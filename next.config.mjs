import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Pota Studio — Next.js 16 configuration
 * Self-contained on purpose: do NOT split this into a wrapper + user-config
 * because the v0 platform filters next.user-config.mjs from GitHub commits,
 * which causes ERR_MODULE_NOT_FOUND on Vercel production builds.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: __dirname,

  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },

  turbopack: {
    resolveAlias: {},
    root: __dirname,
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'p16-sign-sg.tiktokcdn.com' },
      { protocol: 'https', hostname: 'p16-sign-va.tiktokcdn.com' },
      { protocol: 'https', hostname: 'p19-sign-sg.tiktokcdn.com' },
      { protocol: 'https', hostname: 'p16-sign.tiktokcdn-us.com' },
      { protocol: 'https', hostname: 'p77-sign-sg.tiktokcdn.com' },
    ],
  },

  async redirects() {
    return [
      // ─── Canonical host ───────────────────────────────────────────────
      // Force apex (potastudio.com) to www.potastudio.com.
      // permanent: true emits a 308 (SEO-equivalent of 301), so canonical
      // chains stay clean and Ahrefs/GSC stop flagging redirect issues.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'potastudio.com' }],
        destination: 'https://www.potastudio.com/:path*',
        permanent: true,
      },

      // ─── Legacy /media ────────────────────────────────────────────────
      { source: '/media', destination: '/', permanent: true },
      { source: '/it/media', destination: '/it', permanent: true },

      // ─── Cross-locale blog mismatches (Ahrefs 17 noindex pages) ───────
      // These 17 URLs were crawled by Ahrefs/Google with the wrong locale
      // path: IT-slug articles sit under /blog (EN) and EN-slug articles
      // sit under /it/blog. We redirect them to the correct locale path
      // (or to the blog index when no counterpart exists) to recover the
      // link equity and resolve the noindex flag in Ahrefs.

      // 6 IT-slug pages erroneously published under /blog (EN path)
      // → redirect to the matching IT article under /it/blog
      {
        source: '/blog/come-trovare-clienti-online-pmi-italiane-2026',
        destination: '/it/blog/come-trovare-clienti-online-pmi-italiane-2026',
        permanent: true,
      },
      {
        source: '/blog/piano-marketing-pmi-italiane-2026-template',
        destination: '/it/blog/piano-marketing-pmi-italiane-2026-template',
        permanent: true,
      },
      {
        source: '/blog/meta-ads-dst-3-percento-luglio-2026-italia',
        destination: '/it/blog/meta-ads-dst-3-percento-luglio-2026-italia',
        permanent: true,
      },
      {
        source: '/blog/tiktok-per-aziende-guida-completa-2026',
        destination: '/it/blog/tiktok-per-aziende-guida-completa-2026',
        permanent: true,
      },
      {
        source: '/blog/ai-nel-marketing-strumenti-pmi-italiane-2026',
        destination: '/it/blog/ai-nel-marketing-strumenti-pmi-italiane-2026',
        permanent: true,
      },
      {
        source: '/blog/google-ads-guida-pmi-italiane-2026',
        destination: '/it/blog/google-ads-guida-pmi-italiane-2026',
        permanent: true,
      },

      // 6 EN-slug pages erroneously crawled under /it/blog (IT path)
      // that DO have an existing EN counterpart under /blog
      // → redirect to the matching EN article
      {
        source: '/it/blog/tiktok-for-business-complete-guide-2026',
        destination: '/blog/tiktok-for-business-complete-guide-2026',
        permanent: true,
      },
      {
        source: '/it/blog/how-to-find-customers-online-italian-smb-2026',
        destination: '/blog/how-to-find-customers-online-italian-smb-2026',
        permanent: true,
      },
      {
        source: '/it/blog/meta-ads-dst-3-percent-surcharge-italy-july-2026',
        destination: '/blog/meta-ads-dst-3-percent-surcharge-italy-july-2026',
        permanent: true,
      },
      {
        source: '/it/blog/google-ads-guide-italian-smb-2026',
        destination: '/blog/google-ads-guide-italian-smb-2026',
        permanent: true,
      },
      {
        source: '/it/blog/ai-marketing-tools-italian-smbs-2026',
        destination: '/blog/ai-marketing-tools-italian-smbs-2026',
        permanent: true,
      },
      {
        source: '/it/blog/marketing-plan-italian-smb-2026-template',
        destination: '/blog/marketing-plan-italian-smb-2026-template',
        permanent: true,
      },

      // 5 EN-slug pages under /it/blog with NO counterpart
      // → redirect to the IT blog index to keep link equity in-locale
      { source: '/it/blog/meta-ads-roas-2026',                destination: '/it/blog', permanent: true },
      { source: '/it/blog/italian-agencies-winning-global',   destination: '/it/blog', permanent: true },
      { source: '/it/blog/social-media-strategy-2026',        destination: '/it/blog', permanent: true },
      { source: '/it/blog/influencer-marketing-roi',          destination: '/it/blog', permanent: true },
      { source: '/it/blog/tiktok-advertising-2026',           destination: '/it/blog', permanent: true },
    ]
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

export default nextConfig
