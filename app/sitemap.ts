import type { MetadataRoute } from 'next'
import { getAllAuthorSlugs } from '@/sanity/lib/blog'
import { getBlogPosts } from '@/sanity/lib/page-queries'
import { client } from '@/sanity/lib/client'
import { slugifyCategory } from '@/lib/blog-categories'

const BASE_URL = 'https://www.potastudio.com'

// Refresh every hour so newly-published Sanity content appears quickly.
export const revalidate = 3600

// Site launch date — used as lastModified fallback when no real date is available.
const SITE_LAUNCH = new Date('2026-03-03')

// ── Static routes mirrored EN + IT ────────────────────────────────────────────
// lastModDate: a fixed ISO date string (YYYY-MM-DD) for each page.
// Use a date that reflects when the page content was last meaningfully updated.
// Do NOT use new Date() here — that changes on every deploy/request and
// causes GSC to think every page was updated on every build, which wastes
// crawl budget and can show epoch (1970-01-01) dates in GSC.
const staticPaths: {
  path: string
  priority: number
  changefreq: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>
  lastModDate: string
}[] = [
  { path: '/',          priority: 1.0, changefreq: 'weekly',  lastModDate: '2026-05-01' },
  { path: '/services',  priority: 0.9, changefreq: 'monthly', lastModDate: '2026-04-01' },
  { path: '/work',      priority: 0.9, changefreq: 'weekly',  lastModDate: '2026-05-01' },
  { path: '/about',     priority: 0.7, changefreq: 'monthly', lastModDate: '2026-04-01' },
  { path: '/blog',      priority: 0.9, changefreq: 'daily',   lastModDate: '2026-05-01' },
  { path: '/contact',   priority: 0.6, changefreq: 'yearly',  lastModDate: '2026-03-03' },
  { path: '/clients',   priority: 0.6, changefreq: 'monthly', lastModDate: '2026-03-03' },
  { path: '/careers',   priority: 0.5, changefreq: 'monthly', lastModDate: '2026-04-01' },
  { path: '/privacy',   priority: 0.3, changefreq: 'yearly',  lastModDate: '2026-03-03' },
  { path: '/cookie',    priority: 0.3, changefreq: 'yearly',  lastModDate: '2026-03-03' },
]

async function getCaseStudySlugs(): Promise<{ slug: string; updatedAt?: string; _updatedAt?: string; publishedAt?: string }[]> {
  try {
    return await client.fetch<{ slug: string; updatedAt?: string; _updatedAt?: string; publishedAt?: string }[]>(
      `*[_type == "caseStudy" && defined(slug.current)] { "slug": slug.current, updatedAt, _updatedAt, publishedAt }`,
      {},
      { next: { tags: ['caseStudies'], revalidate: 3600 } },
    ) ?? []
  } catch {
    return []
  }
}

/** Resolve the best available date for a Sanity document. Priority:
 *  1. custom `updatedAt` field (editor-set)
 *  2. custom `publishedAt` field
 *  3. Sanity system `_updatedAt` (always present)
 *  4. SITE_LAUNCH as hard fallback (never epoch)
 */
function resolveDate(
  updatedAt?: string,
  publishedAt?: string,
  _updatedAt?: string,
): Date {
  const raw = updatedAt ?? publishedAt ?? _updatedAt
  if (raw) {
    const d = new Date(raw)
    // Guard against invalid dates (which would produce epoch in the sitemap)
    if (!isNaN(d.getTime()) && d.getFullYear() > 1971) return d
  }
  return SITE_LAUNCH
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Each static path emits two entries (EN + IT) sharing hreflang alternates.
  // lastModDate is a fixed ISO date string — not new Date() which would change
  // on every deploy and bloat GSC's "last crawled" signals.
  const staticEntries: MetadataRoute.Sitemap = staticPaths.flatMap((p) => {
    const enUrl = `${BASE_URL}${p.path}`
    const itUrl = `${BASE_URL}/it${p.path === '/' ? '' : p.path}`
    const lastMod = new Date(p.lastModDate)
    const alternates = {
      languages: {
        en: enUrl,
        it: itUrl,
        'x-default': enUrl,
      },
    } as const

    return [
      {
        url: enUrl,
        lastModified: lastMod,
        changeFrequency: p.changefreq,
        priority: Math.round(p.priority * 100) / 100,
        alternates,
      },
      {
        url: itUrl,
        lastModified: lastMod,
        changeFrequency: p.changefreq,
        priority: Math.round(Math.max(0.1, p.priority - 0.05) * 100) / 100,
        alternates,
      },
    ]
  })

  // Blog posts (Sanity-driven).
  // For hreflang we need to know which EN slug pairs with which IT slug.
  // Strategy: fetch both slug lists PLUS the IT posts' translationOf field
  // so we can build a lookup map { itSlug → enSlug }.
  // Fetch blog slugs with dates for real lastModified in sitemap entries.
  const [enBlogWithDates, itBlogWithRef] = await Promise.all([
    client.fetch<{ slug: string; updatedAt?: string; publishedAt?: string; _updatedAt?: string }[]>(
      `*[_type in ["blogPost", "post"] && language == "en" && isPublished != false]{
        "slug": slug.current, updatedAt, publishedAt, _updatedAt
      }`,
      {},
      { next: { tags: ['blogPost', 'blogPost-en'], revalidate: 3600 } },
    ).catch(() => [] as { slug: string; updatedAt?: string; publishedAt?: string; _updatedAt?: string }[]),
    client.fetch<{ slug: string; enSlug: string | null; updatedAt?: string; publishedAt?: string; _updatedAt?: string }[]>(
      `*[_type in ["blogPost", "post"] && language == "it" && isPublished != false]{
        "slug": slug.current,
        "enSlug": translationOf->slug.current,
        updatedAt, publishedAt, _updatedAt
      }`,
      {},
      { next: { tags: ['blogPost', 'blogPost-it'], revalidate: 3600 } },
    ).catch(() => [] as { slug: string; enSlug: string | null; updatedAt?: string; publishedAt?: string; _updatedAt?: string }[]),
  ])

  // Keep getBlogPostSlugs for author queries — use the new date-aware lists.
  const enBlogSlugs = (enBlogWithDates ?? []).map((r) => r.slug).filter(Boolean)
  const itBlogSlugs = (itBlogWithRef ?? []).map((r) => r.slug).filter(Boolean)

  // Lookup maps: dates keyed by slug.
  const enBlogDates = new Map(
    (enBlogWithDates ?? []).map((r) => [r.slug, resolveDate(r.updatedAt, r.publishedAt, r._updatedAt)]),
  )
  const itBlogDates = new Map(
    (itBlogWithRef ?? []).map((r) => [r.slug, resolveDate(r.updatedAt, r.publishedAt, r._updatedAt)]),
  )

  // Build bidirectional maps: EN slug → IT slug and IT slug → EN slug.
  const enToIt = new Map<string, string>()
  const itToEn = new Map<string, string>()
  for (const { slug: itSlug, enSlug } of (itBlogWithRef ?? [])) {
    if (itSlug && enSlug) {
      enToIt.set(enSlug, itSlug)
      itToEn.set(itSlug, enSlug)
    }
  }

  // EN entries: emit hreflang alternates when a paired IT post exists.
  const enBlogEntries: MetadataRoute.Sitemap = enBlogSlugs.map((slug: string) => {
    const itSlug = enToIt.get(slug)
    const enUrl = `${BASE_URL}/blog/${slug}`
    const lastMod = enBlogDates.get(slug) ?? SITE_LAUNCH
    if (itSlug) {
      const itUrl = `${BASE_URL}/it/blog/${itSlug}`
      return {
        url: enUrl,
        lastModified: lastMod,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
        alternates: { languages: { en: enUrl, it: itUrl, 'x-default': enUrl } } as const,
      }
    }
    return {
      url: enUrl,
      lastModified: lastMod,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      alternates: { languages: { en: enUrl, 'x-default': enUrl } } as const,
    }
  })

  // IT entries: only emit slugs that DON'T already appear as the IT side
  // of an EN entry (to avoid duplicate sitemap entries).
  const itBlogEntriesSlugs = itBlogSlugs.filter(
    (slug: string) => !itToEn.has(slug) || !enBlogSlugs.includes(itToEn.get(slug)!),
  )
  const itBlogEntries: MetadataRoute.Sitemap = itBlogEntriesSlugs.map((slug: string) => {
    const enSlug = itToEn.get(slug)
    const itUrl = `${BASE_URL}/it/blog/${slug}`
    const lastMod = itBlogDates.get(slug) ?? SITE_LAUNCH
    if (enSlug) {
      const enUrl = `${BASE_URL}/blog/${enSlug}`
      return {
        url: itUrl,
        lastModified: lastMod,
        changeFrequency: 'weekly' as const,
        priority: 0.65,
        alternates: { languages: { en: enUrl, it: itUrl, 'x-default': enUrl } } as const,
      }
    }
    return {
      url: itUrl,
      lastModified: lastMod,
      changeFrequency: 'weekly' as const,
      priority: 0.65,
      alternates: { languages: { it: itUrl, 'x-default': itUrl } } as const,
    }
  })

  const blogEntries: MetadataRoute.Sitemap = [...enBlogEntries, ...itBlogEntries]

  // Case studies (Sanity-driven, EN + IT mirror same slug under /work vs /it/work).
  // Both entries in each pair share hreflang alternates referencing each other.
  const caseStudySlugs = await getCaseStudySlugs()
  const caseStudyEntries: MetadataRoute.Sitemap = caseStudySlugs.flatMap((item) => {
    const slug = typeof item === 'string' ? item : item.slug
    const lastMod = typeof item === 'object'
      ? resolveDate(item.updatedAt, item.publishedAt, item._updatedAt)
      : SITE_LAUNCH
    const enUrl = `${BASE_URL}/work/${slug}`
    const itUrl = `${BASE_URL}/it/work/${slug}`
    const alternates = {
      languages: { en: enUrl, it: itUrl, 'x-default': enUrl },
    } as const
    return [
      {
        url: enUrl,
        lastModified: lastMod,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
        alternates,
      },
      {
        url: itUrl,
        lastModified: lastMod,
        changeFrequency: 'monthly' as const,
        priority: 0.75,
        alternates,
      },
    ]
  })

  // Blog categories (Sanity-driven, EN + IT). One sitemap entry per category
  // slug per locale, with hreflang alternates (slugs mirror across locales
  // when category names match).
  // lastModified = the most recent publishedAt among posts in that category.
  const [enBlogPosts, itBlogPosts] = await Promise.all([
    getBlogPosts('en'),
    getBlogPosts('it'),
  ])

  // Build a map: categorySlug → latest publishedAt date among its posts.
  const enCategoryDates = new Map<string, Date>()
  for (const p of (enBlogPosts ?? [])) {
    const catSlug = p.categories?.[0] ? slugifyCategory(p.categories[0]) : null
    if (!catSlug) continue
    const postDate = p.publishedAt ? new Date(p.publishedAt) : SITE_LAUNCH
    const existing = enCategoryDates.get(catSlug)
    if (!existing || postDate > existing) enCategoryDates.set(catSlug, postDate)
  }
  const itCategoryDates = new Map<string, Date>()
  for (const p of (itBlogPosts ?? [])) {
    const catSlug = p.categories?.[0] ? slugifyCategory(p.categories[0]) : null
    if (!catSlug) continue
    const postDate = p.publishedAt ? new Date(p.publishedAt) : SITE_LAUNCH
    const existing = itCategoryDates.get(catSlug)
    if (!existing || postDate > existing) itCategoryDates.set(catSlug, postDate)
  }

  const enCategorySlugs = Array.from(enCategoryDates.keys())
  const itCategorySlugs = Array.from(itCategoryDates.keys())
  const allCategorySlugs = Array.from(new Set([...enCategorySlugs, ...itCategorySlugs]))

  const categoryEntries: MetadataRoute.Sitemap = allCategorySlugs.flatMap((slug) => {
    const enUrl = `${BASE_URL}/blog/category/${slug}`
    const itUrl = `${BASE_URL}/it/blog/categoria/${slug}`
    const alternates = {
      languages: { en: enUrl, it: itUrl, 'x-default': enUrl },
    } as const
    const entries: MetadataRoute.Sitemap = []
    if (enCategorySlugs.includes(slug)) {
      entries.push({
        url: enUrl,
        lastModified: enCategoryDates.get(slug) ?? SITE_LAUNCH,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
        alternates,
      })
    }
    if (itCategorySlugs.includes(slug)) {
      entries.push({
        url: itUrl,
        lastModified: itCategoryDates.get(slug) ?? SITE_LAUNCH,
        changeFrequency: 'weekly' as const,
        priority: 0.65,
        alternates,
      })
    }
    return entries
  })

  // Author profile pages — EN at /author/[slug], IT at /it/autore/[slug].
  // We mirror every author across both locales (the long bio falls back to
  // EN when the IT translation is missing) and emit hreflang alternates
  // pointing at the same Person across languages.
  // Authors are stable pages — use SITE_LAUNCH as a fixed date.
  const authorSlugs = await getAllAuthorSlugs()
  const authorEntries: MetadataRoute.Sitemap = (authorSlugs ?? [])
    .map((s: { slug: string }) => s.slug)
    .filter(Boolean)
    .flatMap((slug: string) => {
      const enUrl = `${BASE_URL}/author/${slug}`
      const itUrl = `${BASE_URL}/it/autore/${slug}`
      const alternates = {
        languages: { en: enUrl, it: itUrl, 'x-default': enUrl },
      } as const
      return [
        {
          url: enUrl,
          lastModified: SITE_LAUNCH,
          changeFrequency: 'monthly' as const,
          priority: 0.6,
          alternates,
        },
        {
          url: itUrl,
          lastModified: SITE_LAUNCH,
          changeFrequency: 'monthly' as const,
          priority: 0.55,
          alternates,
        },
      ]
    })

  return [
    ...staticEntries,
    ...blogEntries,
    ...caseStudyEntries,
    ...categoryEntries,
    ...authorEntries,
  ]
}
