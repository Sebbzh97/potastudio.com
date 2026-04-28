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
    icons: [
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
