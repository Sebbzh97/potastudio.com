import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio', '/api/'],
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'PerplexityBot', 'Claude-Web', 'Googlebot-Extended'],
        allow: '/',
      },
    ],
    sitemap: 'https://potastudio.com/sitemap.xml',
    host: 'https://potastudio.com',
  }
}
