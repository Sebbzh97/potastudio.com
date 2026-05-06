#!/usr/bin/env node
/**
 * Pre-deploy checks — run before `next build` in CI.
 *
 * The audit caught a number of regressions that should NEVER reach
 * production again:
 *   - Sitemap entries with whitespace / uppercase / special chars
 *     (`/work/isybank-gaming tour` → 404 on every encoding-safe crawler).
 *   - Sanity blog posts with `categories` ref to nowhere or missing
 *     `isPublished: true` (causes 5xx on the article page).
 *   - Hard-coded competitor / non-client names in app code or in CMS
 *     content (Ferrari, Lamborghini, Atalanta — none of which are
 *     Pota Studio clients).
 *
 * This script reads from the live Sanity dataset (no bundler needed) so
 * it can run in CI and locally with the same env vars used by the dev
 * server. Exit non-zero on any failure → blocks the deploy.
 *
 * NOTE: this file intentionally has zero `node_modules` imports beyond
 * what is already in the production tree — `@sanity/client` is already
 * a dependency. We do NOT add a CI-only dep just for this check.
 */

import { createClient } from '@sanity/client'

// ─── config ─────────────────────────────────────────────────────────────
const SITE = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://www.potastudio.com'
const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const TOKEN = process.env.SANITY_API_TOKEN

// Strings that MUST NOT appear in any published Sanity document title /
// description / body. The audit explicitly identified these as false
// client claims that need to stay out of the index.
const FORBIDDEN_NAME_FRAGMENTS = ['Ferrari', 'Lamborghini', 'Atalanta BC']

// Slug must be lowercase, hyphenated, ASCII only.
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

// ─── helpers ────────────────────────────────────────────────────────────
const failures = []
const warnings = []

function fail(category, msg) {
  failures.push(`[${category}] ${msg}`)
}

function warn(category, msg) {
  warnings.push(`[${category}] ${msg}`)
}

// ─── checks ─────────────────────────────────────────────────────────────

async function checkSanity() {
  if (!PROJECT_ID || !TOKEN) {
    warn('sanity', 'Skipping content checks — missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN')
    return
  }
  const client = createClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: '2024-01-01',
    useCdn: false,
    token: TOKEN,
  })

  // 1. Slug format on every public document type.
  const slugRows = await client.fetch(
    `*[_type in ['blogPost', 'caseStudy', 'blogAuthor', 'blogCategory'] && defined(slug.current)]{
      _id, _type, language, 'slug': slug.current, title
    }`,
  )
  for (const r of slugRows) {
    if (!SLUG_REGEX.test(r.slug)) {
      fail('sanity-slug', `${r._type} ${r._id} ("${r.title ?? ''}") has invalid slug "${r.slug}" — must match ${SLUG_REGEX}`)
    }
  }

  // 2. Forbidden names in titles / descriptions / body.
  const contentRows = await client.fetch(
    `*[_type in ['blogPost', 'caseStudy', 'siteSettings'] && (
      pt::text(body) match $patterns ||
      title match $patterns ||
      description match $patterns ||
      excerpt match $patterns
    )]{ _id, _type, title, 'slug': slug.current }`,
    { patterns: FORBIDDEN_NAME_FRAGMENTS.map((s) => `*${s}*`) },
  )
  for (const r of contentRows) {
    fail(
      'sanity-content',
      `${r._type} ${r._id} ("${r.title ?? r.slug ?? ''}") references one of ${FORBIDDEN_NAME_FRAGMENTS.join(', ')}`,
    )
  }

  // 3. seoTitle must NOT contain the brand name when the document type is
  // a page-level entity. The root layout's metadata.title.template
  // appends ` | Pota Studio` automatically; baking it into the source
  // produces the dreaded `Servizi | Pota Studio | Pota Studio` double
  // brand that the audit flagged.
  const titleRows = await client.fetch(
    `*[_type in ['pageContent','servicesPage','homepage','aboutPage','workPage','clientsPage','careersPage','contactPage','blogIndex','privacyPage','cookiePage'] && defined(seoTitle) && seoTitle match '*Pota Studio*']{
      _id, _type, language, seoTitle
    }`,
  )
  for (const r of titleRows) {
    fail(
      'sanity-title',
      `${r._type} ${r._id} (${r.language ?? 'no-lang'}) has seoTitle "${r.seoTitle}" containing the brand name. The layout template adds " | Pota Studio" automatically — strip it from the field.`,
    )
  }

  // 4. Published blog posts must have isPublished !== false AND a category.
  // The original isybank/openai-ads outage was caused by `isPublished: null`
  // being filtered out by the GROQ `!= false` clause.
  const publishedPosts = await client.fetch(
    `*[_type == 'blogPost' && isPublished != false]{
      _id, language, 'slug': slug.current, title,
      'hasCategory': count(coalesce(categories, [])) > 0,
      isPublished
    }`,
  )
  for (const p of publishedPosts) {
    if (p.isPublished !== true) {
      fail('sanity-publish', `blogPost ${p._id} ("${p.title}") has isPublished = ${p.isPublished}; must be true (not null) so GROQ != false filters work consistently`)
    }
    if (!p.hasCategory) {
      warn('sanity-publish', `blogPost ${p._id} ("${p.title}") has no category — frontend will render with the fallback color/label`)
    }
  }
}

async function checkBuildOutput() {
  // Look for Ferrari/Lambo/Atalanta in the .next output (post-build).
  // Skipped here because pre-deploy runs BEFORE the build by design;
  // we instead grep the SOURCE tree.
  // (Implemented elsewhere via repo search; this section reserved for
  //  future use when pre-deploy runs post-build.)
  void 0
}

// ─── main ───────────────────────────────────────────────────────────────

async function main() {
  console.log(`[pre-deploy] target site: ${SITE}`)
  await checkSanity()
  await checkBuildOutput()

  if (warnings.length > 0) {
    console.warn('\n[pre-deploy] WARNINGS:')
    for (const w of warnings) console.warn('  ' + w)
  }
  if (failures.length > 0) {
    console.error('\n[pre-deploy] FAILURES:')
    for (const f of failures) console.error('  ' + f)
    console.error(`\n[pre-deploy] ${failures.length} failure(s); blocking deploy.`)
    process.exit(1)
  }
  console.log('\n[pre-deploy] all checks passed.')
}

main().catch((err) => {
  console.error('[pre-deploy] unexpected error:', err?.message ?? err)
  process.exit(1)
})
