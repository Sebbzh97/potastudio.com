import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk, Barlow_Condensed } from 'next/font/google'
import { Analytics as VercelAnalytics } from '@vercel/analytics/next'
import AnalyticsPixels from '@/components/analytics'
import { JsonLd } from '@/components/json-ld'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import CookieBanner from '@/components/cookie-banner'
import { headers } from 'next/headers'
import { getNavigation } from '@/sanity/lib/navigation'
import { getSiteSettings } from '@/sanity/lib/page-queries'
import {
  organizationSchema,
  localBusinessSchema,
  websiteSchema,
} from '@/lib/jsonld/schemas'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-barlow-condensed',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#0D0D0D',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.potastudio.com'),
  title: {
    default: 'Pota Studio - Social Media, Influencer Marketing & Ads',
    template: '%s | Pota Studio',
  },
  description:
    'Full-service agency for social media, influencer marketing, paid advertising and TikTok. No handoffs, all in-house. Europe & US clients. See our work.',
  authors: [{ name: 'Pota Studio', url: 'https://www.potastudio.com' }],
  creator: 'Pota Studio',
  publisher: 'Pota Studio',
  robots: process.env.VERCEL_ENV === 'preview'
    ? { index: false, follow: false }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.potastudio.com',
    siteName: 'Pota Studio',
    title: 'Pota Studio - Social Media, Influencer Marketing & Ads',
    description:
      'Full-service agency for social media, influencer marketing, paid advertising and TikTok. No handoffs, all in-house.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Pota Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pota Studio - Social Media, Influencer Marketing & Ads',
    description:
      'Full-service agency for social media, influencer marketing, paid advertising and TikTok. No handoffs, all in-house.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: '/',
    languages: {
      'en': '/',
      'it': '/it',
      'x-default': '/',
    },
  },
  // Icon resolution. The App Router already auto-serves any `icon.png` /
  // `apple-icon.png` / `favicon.ico` placed in `/app` via convention, but
  // we ALSO declare them explicitly here so:
  //   1. Crawlers that read the JSON-like Next metadata payload (Google,
  //      Bing, AI engines) get unambiguous absolute paths.
  //   2. Legacy tools that probe `/favicon.ico` directly find it (we
  //      keep `favicon.ico` in `/app` so Next serves it from `/`).
  //   3. Multiple sizes are advertised so iOS/Android home-screen
  //      shortcuts pick the right asset without re-scaling our 512×512.
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any', rel: 'icon' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
  },
  manifest: '/manifest.webmanifest',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList = await headers()
  const pathname =
    headersList.get('x-invoke-path') ??
    headersList.get('x-pathname') ??
    headersList.get('next-url') ??
    ''
  const isStudio = pathname.startsWith('/studio')
  const locale: 'en' | 'it' = pathname.startsWith('/it') ? 'it' : 'en'
  const [navData, siteSettings] = isStudio
    ? [null, null]
    : await Promise.all([getNavigation(locale), getSiteSettings(locale)])
  return (
    <html
      lang={isStudio ? 'en' : locale}
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${spaceGrotesk.variable} ${barlowCondensed.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/* DNS prefetch for third-party domains used by lazy-loaded scripts.
            Cheap warm-up that lets the browser resolve DNS in parallel with
            HTML parsing, so when the lazy scripts finally fire they connect
            faster without blocking earlier paints. */}
        <link rel="dns-prefetch" href="https://cdn.iubenda.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://analytics.tiktok.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        {/* Preload the hero video poster — it is the LCP element on the
            home page until the background <video> can play, so warming it
            in parallel with the HTML parse measurably improves LCP. */}
        <link
          rel="preload"
          as="image"
          href="/images/hero-poster.jpg"
          fetchPriority="high"
        />
        {/* Google tag (gtag.js) — server-rendered so Google's tag detector can find it */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-CMP5TYMZP3" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-CMP5TYMZP3', { anonymize_ip: true });
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-[#0D0D0D] text-white overflow-x-hidden">
        {!isStudio && (
          <>
            <JsonLd data={organizationSchema(locale)} />
            <JsonLd data={localBusinessSchema()} />
            <JsonLd data={websiteSchema()} />
            <Navigation data={navData} />
          </>
        )}
        {children}
        {!isStudio && <Footer locale={locale} settings={siteSettings} />}
        {!isStudio && <CookieBanner settings={siteSettings} locale={locale} />}
        <VercelAnalytics />
        <AnalyticsPixels />
      </body>
    </html>
  )
}
