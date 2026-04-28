import { MetadataRoute } from 'next'

const BASE_URL = 'https://potastudio.com'

const staticEnPages = [
  '',
  '/services',
  '/work',
  '/about',
  '/contact',
  '/blog',
  '/clients',
  '/careers',
  '/privacy',
  '/cookie',
]

const italianPages = [
  '/it',
  '/it/services',
  '/it/work',
  '/it/blog',
  '/it/about',
  '/it/contact',
  '/it/careers',
  '/it/clients',
  '/it/privacy',
  '/it/cookie',
]

const blogSlugs = [
  'tiktok-advertising-2026',
  'italian-agencies-winning-global',
  'meta-ads-roas-2026',
  'influencer-marketing-roi',
  'social-media-strategy-2026',
]

const caseSlugs = [
  'samsung-tiktok',
  'isybank-ads',
  'cookies-digital-partner',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = staticEnPages.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date('2025-12-01'),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1.0 : 0.8,
    alternates: {
      languages: {
        it: `${BASE_URL}/it${path === '' ? '' : path}`,
        en: `${BASE_URL}${path}`,
      },
    },
  }))

  const italianEntries: MetadataRoute.Sitemap = italianPages.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date('2025-12-01'),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
    alternates: {
      languages: {
        it: `${BASE_URL}${path}`,
        en: `${BASE_URL}${path.replace('/it', '') || '/'}`,
      },
    },
  }))

  const blogEntries: MetadataRoute.Sitemap = blogSlugs.flatMap((slug) => [
    {
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: new Date('2025-12-01'),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/it/blog/${slug}`,
      lastModified: new Date('2025-12-01'),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ])

  const caseEntries: MetadataRoute.Sitemap = caseSlugs.flatMap((slug) => [
    {
      url: `${BASE_URL}/work/${slug}`,
      lastModified: new Date('2025-12-01'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/it/work/${slug}`,
      lastModified: new Date('2025-12-01'),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ])

  return [...staticEntries, ...italianEntries, ...blogEntries, ...caseEntries]
}
