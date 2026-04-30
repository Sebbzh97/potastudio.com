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
    //   app/icon.png        → /icon.png        (raster, fallback)
    //   app/icon.svg        → /icon.svg        (vector, scales perfectly)
    //   app/apple-icon.tsx  → /apple-icon      (180x180 generated PNG)
    // Order matters — browsers/crawlers pick the first usable format.
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon.png',
        sizes: '32x32',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
