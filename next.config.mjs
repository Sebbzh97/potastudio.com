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
      // Canonical host: force apex (potastudio.com) to www.potastudio.com
      // permanent: true emits a 308 (SEO-equivalent of 301), so canonical
      // chains stay clean and Ahrefs/GSC stop flagging redirect issues.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'potastudio.com' }],
        destination: 'https://www.potastudio.com/:path*',
        permanent: true,
      },
      { source: '/media', destination: '/', permanent: true },
      { source: '/it/media', destination: '/it', permanent: true },
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
