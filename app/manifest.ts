import type { MetadataRoute } from 'next'

/**
 * PWA / Web App Manifest — improves brand recognition when the site
 * is added to home screen and surfaces brand metadata to crawlers.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pota Studio — Full Service Marketing Agency',
    short_name: 'Pota Studio',
    description:
      'Italian full service marketing agency. Performance marketing, content production, influencer marketing, paid ADS on Meta, Google and TikTok.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#0D0D0D',
    theme_color: '#0D0D0D',
    orientation: 'portrait-primary',
    lang: 'en',
    categories: ['business', 'marketing', 'productivity'],
    // These paths match the Next.js App Router file conventions:
    //   app/icon.png        → /icon.png        (raster, browsers + Google)
    //   app/apple-icon.png  → /apple-icon.png  (iOS home screen)
    // NOTE: keep only ONE file with base name "icon" in app/ at any time
    // (e.g. icon.png OR icon.svg — never both). Having icon.svg + icon.png
    // together triggers a Turbopack production-build panic in Next 16.1.x
    // ("Dependency tracking is disabled" — vercel/next.js#89358).
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
