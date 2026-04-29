import type { MetadataRoute } from 'next'

const BASE_URL = 'https://potastudio.com'

/**
 * Robots.txt — explicitly opt-in for AI/LLM crawlers (GEO strategy).
 * Blocks only Sanity Studio and internal Next.js routes.
 */
export default function robots(): MetadataRoute.Robots {
  // AI / LLM crawlers we explicitly allow so the brand can be cited
  // in answers from ChatGPT, Perplexity, Claude, Gemini, Copilot, etc.
  const aiCrawlers = [
    'GPTBot',                // OpenAI training
    'OAI-SearchBot',         // OpenAI search index
    'ChatGPT-User',          // ChatGPT browse
    'PerplexityBot',         // Perplexity index
    'Perplexity-User',       // Perplexity user-initiated fetch
    'ClaudeBot',             // Anthropic training
    'Claude-Web',            // Anthropic web
    'anthropic-ai',          // Anthropic legacy
    'Google-Extended',       // Google AI / Gemini training
    'Googlebot',             // Google search (also feeds AI Overviews)
    'Bingbot',               // Bing + Copilot
    'Applebot-Extended',     // Apple Intelligence
    'CCBot',                 // Common Crawl (consumed by many LLMs)
    'cohere-ai',             // Cohere
    'YouBot',                // You.com
    'Meta-ExternalAgent',    // Meta AI
    'Meta-ExternalFetcher',  // Meta AI live fetch
    'Bytespider',            // ByteDance / Doubao
    'DuckAssistBot',         // DuckDuckGo AI
    'Amazonbot',             // Alexa+
    'mistralai-User',        // Mistral
  ]

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio', '/studio/', '/api/', '/_next/'],
      },
      ...aiCrawlers.map((ua) => ({
        userAgent: ua,
        allow: '/',
        disallow: ['/studio', '/studio/', '/api/'],
      })),
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
