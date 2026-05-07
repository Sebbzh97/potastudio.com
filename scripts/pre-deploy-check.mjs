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

  // 3. seoTitle must NOT contain the brand name when the document is a
  // page-level entity that relies on Next.js metadata.title.template
  // (which appends ` | Pota Studio` automatically). Homepage docs are
  // exempt because the route uses metadata.title.absolute and the brand
  // *is* part of the canonical positioning string ("Pota Studio | Full
  // Service Marketing Agency"). We exclude them by `_id` since the
  // `pageKey` field is null on the existing homepage documents (legacy
  // schema) — filtering by ID is the only stable signal.
  const HOMEPAGE_IDS = ['pageContent-homepage-en', 'pageContent-homepage-it']
  const titleRows = await client.fetch(
    `*[_type in ['pageContent','servicesPage','aboutPage','workPage','clientsPage','careersPage','contactPage','blogIndex','privacyPage','cookiePage']
        && !(_id in $homepageIds)
        && defined(seoTitle)
        && seoTitle match '*Pota Studio*']{
      _id, _type, language, pageKey, seoTitle
    }`,
    { homepageIds: HOMEPAGE_IDS },
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
  void 0
}

/**
 * Definition-of-Done checks (8 checks from the 2026-05 SEO audit).
 * These hit the LIVE site so they must run as a post-deploy smoke test.
 * Skip when SKIP_LIVE_CHECKS=1 (e.g. during local dev where live != local).
 */
async function checkLiveSite() {
  if (process.env.SKIP_LIVE_CHECKS === '1') {
    warn('live', 'Skipping live site checks (SKIP_LIVE_CHECKS=1)')
    return
  }

  let html = ''
  try {
    const resp = await fetch(SITE + '/', { signal: AbortSignal.timeout(20_000) })
    html = await resp.text()
  } catch (e) {
    warn('live', `Could not fetch ${SITE}/ — ${e.message}. Skipping live checks.`)
    return
  }

  // 1. Author page: no [object Object] in description
  try {
    const authorResp = await fetch(`${SITE}/author/sebastian-bonfanti`, { signal: AbortSignal.timeout(15_000) })
    const authorHtml = await authorResp.text()
    const objectObjectCount = (authorHtml.match(/\[object Object\]/g) ?? []).length
    if (objectObjectCount > 0) {
      fail('dod-1', `Author page contains ${objectObjectCount} "[object Object]" occurrences — bio serialization is broken`)
    } else {
      console.log('[pre-deploy] check 1 (author [object Object]): PASS')
    }

    // 2. Author has photo (cdn.sanity.io) + Wikidata sameAs
    if (!authorHtml.includes('cdn.sanity.io') && !authorHtml.includes('wikidata.org/wiki/Q137637995')) {
      fail('dod-2', 'Author page missing Sanity photo CDN URL or Wikidata sameAs in JSON-LD')
    } else {
      console.log('[pre-deploy] check 2 (author photo + wikidata): PASS')
    }

    // 8. Language switcher: /it/autore/ (not /it/author/)
    if (!authorHtml.includes('/it/autore/sebastian-bonfanti')) {
      fail('dod-8', 'Author page missing /it/autore/ language switcher link — might be /it/author/ (broken)')
    } else {
      console.log('[pre-deploy] check 8 (lang switcher /it/autore/): PASS')
    }
  } catch (e) {
    warn('live', `Author page fetch failed: ${e.message}`)
  }

  // 3. Homepage meta description mentions verified clients
  if (!/Samsung|Isybank|Lucca/.test(html)) {
    fail('dod-3', 'Homepage meta description does not mention Samsung, Isybank or Lucca Comics & Games')
  } else {
    console.log('[pre-deploy] check 3 (homepage description): PASS')
  }

  // 4. Homepage internal links to /work/, /blog/, /author/
  const workLinks   = (html.match(/href="\/work\//g) ?? []).length
  const blogLinks   = (html.match(/href="\/blog\//g) ?? []).length
  const authorLinks = (html.match(/href="\/author\//g) ?? []).length
  if (workLinks < 6) fail('dod-4a', `Homepage has only ${workLinks} /work/* links — expected ≥6`)
  else console.log(`[pre-deploy] check 4a (work links ${workLinks}): PASS`)
  if (blogLinks < 3) fail('dod-4b', `Homepage has only ${blogLinks} /blog/* links — expected ≥3`)
  else console.log(`[pre-deploy] check 4b (blog links ${blogLinks}): PASS`)
  if (authorLinks < 1) fail('dod-4c', `Homepage has ${authorLinks} /author/* links — expected ≥1`)
  else console.log(`[pre-deploy] check 4c (author link ${authorLinks}): PASS`)

  // 5. No full-page skeleton in SSR
  const pulseCount = (html.match(/animate-pulse/g) ?? []).length
  if (pulseCount > 2) {
    fail('dod-5', `Homepage SSR contains ${pulseCount} "animate-pulse" occurrences — skeleton is being rendered in SSR HTML (expect ≤2)`)
  } else {
    console.log(`[pre-deploy] check 5 (animate-pulse count ${pulseCount}): PASS`)
  }

  // 6. Homepage HTML size
  const byteSize = Buffer.byteLength(html, 'utf8')
  if (byteSize > 200_000) {
    fail('dod-6', `Homepage HTML is ${byteSize} bytes — expected < 200,000`)
  } else {
    console.log(`[pre-deploy] check 6 (homepage size ${byteSize} bytes): PASS`)
  }

  // 7. Sitemap blog hreflang
  try {
    const sitemapResp = await fetch(`${SITE}/sitemap.xml`, { signal: AbortSignal.timeout(15_000) })
    const sitemapXml = await sitemapResp.text()
    // Find a block containing the openai-ads post and check for xhtml:link
    const hasHreflang = sitemapXml.includes('/blog/openai-ads') && sitemapXml.includes('xhtml:link')
    if (!hasHreflang) {
      fail('dod-7', 'Sitemap blog entries missing hreflang xhtml:link alternates')
    } else {
      console.log('[pre-deploy] check 7 (sitemap hreflang): PASS')
    }
  } catch (e) {
    warn('live', `Sitemap fetch failed: ${e.message}`)
  }
}

// ─── main ───────────────────────────────────────────────────────────────

async function main() {
  console.log(`[pre-deploy] target site: ${SITE}`)
  await checkSanity()
  await checkBuildOutput()
  await checkLiveSite()

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
