import type { MetadataRoute } from 'next'
import { getAllAuthorSlugs } from '@/sanity/lib/blog'
import { getBlogPosts } from '@/sanity/lib/page-queries'
import { client } from '@/sanity/lib/client'
import { slugifyCategory } from '@/lib/blog-categories'

const BASE_URL = 'https://www.potastudio.com'

// Refresh every hour so newly-published Sanity content appears quickly.
export const revalidate = 3600

// Site launch date — used as lastModified for stable static pages.
const SITE_LAUNCH = new Date('2026-03-03')

// ── Static routes mirrored EN + IT ────────────────────────────────────────────
const staticPaths: {
  path: string
  priority: number
  changefreq: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>
  // When true, use SITE_LAUNCH as lastModified (page rarely changes).
  stable?: boolean
}[] = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/services', priority: 0.9, changefreq: 'monthly', stable: true },
  { path: '/work', priority: 0.9, changefreq: 'weekly' },
  { path: '/about', priority: 0.7, changefreq: 'monthly', stable: true },
  { path: '/blog', priority: 0.9, changefreq: 'daily' },
  { path: '/contact', priority: 0.6, changefreq: 'yearly', stable: true },
  { path: '/clients', priority: 0.6, changefreq: 'monthly', stable: true },
  { path: '/careers', priority: 0.5, changefreq: 'monthly', stable: true },
  { path: '/privacy', priority: 0.3, changefreq: 'yearly', stable: true },
  { path: '/cookie', priority: 0.3, changefreq: 'yearly', stable: true },
]

async function getCaseStudySlugs(): Promise<{ slug: string; updatedAt?: string }[]> {
  try {
    return await client.fetch<{ slug: string; updatedAt?: string }[]>(
      `*[_type == "caseStudy" && defined(slug.current)] { "slug": slug.current, updatedAt }`,
      {},
      { next: { tags: ['caseStudies'], revalidate: 3600 } },
    ) ?? []
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Each static path emits two entries (EN + IT) sharing hreflang alternates.
  const staticEntries: MetadataRoute.Sitemap = staticPaths.flatMap((p) => {
    const enUrl = `${BASE_URL}${p.path}`
    const itUrl = `${BASE_URL}/it${p.path === '/' ? '' : p.path}`
    const lastMod = p.stable ? SITE_LAUNCH : now
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
    client.fetch<{ slug: string; updatedAt?: string; publishedAt?: string }[]>(
      `*[_type == "blogPost" && language == "en" && isPublished != false]{
        "slug": slug.current, updatedAt, publishedAt
      }`,
      {},
      { next: { tags: ['blogPost', 'blogPost-en'], revalidate: 3600 } },
    ).catch(() => [] as { slug: string; updatedAt?: string; publishedAt?: string }[]),
    client.fetch<{ slug: string; enSlug: string | null; updatedAt?: string; publishedAt?: string }[]>(
      `*[_type == "blogPost" && language == "it" && isPublished != false]{
        "slug": slug.current,
        "enSlug": translationOf->slug.current,
        updatedAt, publishedAt
      }`,
      {},
      { next: { tags: ['blogPost', 'blogPost-it'], revalidate: 3600 } },
    ).catch(() => [] as { slug: string; enSlug: string | null; updatedAt?: string; publishedAt?: string }[]),
  ])

  // Keep getBlogPostSlugs for author queries — use the new date-aware lists.
  const enBlogSlugs = (enBlogWithDates ?? []).map((r) => r.slug).filter(Boolean)
  const itBlogSlugs = (itBlogWithRef ?? []).map((r) => r.slug).filter(Boolean)

  // Lookup maps: dates keyed by slug.
  const enBlogDates = new Map(
    (enBlogWithDates ?? []).map((r) => [r.slug, r.updatedAt ?? r.publishedAt]),
  )
  const itBlogDates = new Map(
    (itBlogWithRef ?? []).map((r) => [r.slug, r.updatedAt ?? r.publishedAt]),
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
    const rawDate = enBlogDates.get(slug)
    const lastMod = rawDate ? new Date(rawDate) : now
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
    const rawDate = itBlogDates.get(slug)
    const lastMod = rawDate ? new Date(rawDate) : now
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
    const rawDate = typeof item === 'object' ? item.updatedAt : undefined
    const lastMod = rawDate ? new Date(rawDate) : now
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
  const [enBlogPosts, itBlogPosts] = await Promise.all([
    getBlogPosts('en'),
    getBlogPosts('it'),
  ])
  const enCategorySlugs = Array.from(
    new Set(
      (enBlogPosts ?? [])
        .map((p) => p.categories?.[0])
        .filter((c): c is string => Boolean(c))
        .map((c) => slugifyCategory(c)),
    ),
  )
  const itCategorySlugs = Array.from(
    new Set(
      (itBlogPosts ?? [])
        .map((p) => p.categories?.[0])
        .filter((c): c is string => Boolean(c))
        .map((c) => slugifyCategory(c)),
    ),
  )
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
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
        alternates,
      })
    }
    if (itCategorySlugs.includes(slug)) {
      entries.push({
        url: itUrl,
        lastModified: now,
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
          lastModified: now,
          changeFrequency: 'monthly' as const,
          priority: 0.6,
          alternates,
        },
        {
          url: itUrl,
          lastModified: now,
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
