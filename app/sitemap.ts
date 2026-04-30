import type { MetadataRoute } from 'next'
import { getBlogPostSlugs } from '@/sanity/lib/blog'
import { getBlogPosts } from '@/sanity/lib/page-queries'
import { client } from '@/sanity/lib/client'
import { slugifyCategory } from '@/lib/blog-categories'

const BASE_URL = 'https://www.potastudio.com'

// Refresh every hour so newly-published Sanity content appears quickly.
export const revalidate = 3600

// ── Static routes mirrored EN + IT ────────────────────────────────────────────
const staticPaths: {
  path: string
  priority: number
  changefreq: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>
}[] = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/services', priority: 0.9, changefreq: 'monthly' },
  { path: '/work', priority: 0.9, changefreq: 'weekly' },
  { path: '/about', priority: 0.7, changefreq: 'monthly' },
  { path: '/blog', priority: 0.9, changefreq: 'daily' },
  { path: '/contact', priority: 0.6, changefreq: 'yearly' },
  { path: '/clients', priority: 0.6, changefreq: 'monthly' },
  { path: '/careers', priority: 0.5, changefreq: 'monthly' },
  { path: '/privacy', priority: 0.3, changefreq: 'yearly' },
  { path: '/cookie', priority: 0.3, changefreq: 'yearly' },
]

async function getCaseStudySlugs(): Promise<string[]> {
  try {
    const result = await client.fetch<{ slug: string }[]>(
      `*[_type == "caseStudy" && defined(slug.current)] { "slug": slug.current }`,
      {},
      { cache: 'no-store' },
    )
    return (result ?? []).map((r) => r.slug).filter(Boolean)
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
        lastModified: now,
        changeFrequency: p.changefreq,
        priority: p.priority,
        alternates,
      },
      {
        url: itUrl,
        lastModified: now,
        changeFrequency: p.changefreq,
        priority: Math.max(0.1, p.priority - 0.05),
        alternates,
      },
    ]
  })

  // Blog posts (Sanity-driven)
  const [enBlog, itBlog] = await Promise.all([
    getBlogPostSlugs('en'),
    getBlogPostSlugs('it'),
  ])
  const enBlogSlugs = (enBlog ?? []).map((r: { slug: string }) => r.slug).filter(Boolean)
  const itBlogSlugs = (itBlog ?? []).map((r: { slug: string }) => r.slug).filter(Boolean)

  const blogEntries: MetadataRoute.Sitemap = [
    ...enBlogSlugs.map((slug: string) => ({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...itBlogSlugs.map((slug: string) => ({
      url: `${BASE_URL}/it/blog/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.65,
    })),
  ]

  // Case studies (Sanity-driven, EN + IT mirror)
  const caseStudySlugs = await getCaseStudySlugs()
  const caseStudyEntries: MetadataRoute.Sitemap = caseStudySlugs.flatMap((slug: string) => [
    {
      url: `${BASE_URL}/work/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/it/work/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    },
  ])

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

  return [...staticEntries, ...blogEntries, ...caseStudyEntries, ...categoryEntries]
}
