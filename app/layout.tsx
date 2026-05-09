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
    site: '@potastudio',
    creator: '@sebbonfanti',
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
  // Icon resolution.
  // - app/icon.png and app/apple-icon.png are auto-served by Next.js App Router
  //   convention as <link rel="icon"> and <link rel="apple-touch-icon">.
  // - public/favicon.ico is served statically at /favicon.ico for legacy
  //   browser and crawler probing. It must NOT live inside /app alongside
  //   icon.png — having both triggers a Turbopack route conflict in Next 16
  //   that crashes the client bundle entirely (black screen on production).
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
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
        {/* DNS prefetch for third-party domains used by lazy-loaded scripts.
            Cheap warm-up: resolves DNS in parallel with HTML parsing so
            lazy scripts connect faster without blocking earlier paints.
            Note: Google Fonts preconnects are intentionally omitted because
            next/font self-hosts all fonts — no external font requests occur. */}
        {/* Sanity CDN — preconnect because cover images are LCP candidates on
            every blog post and the CDN domain differs from the API domain. */}
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.iubenda.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://analytics.tiktok.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        {/* Google Consent Mode v2 — must run BEFORE any gtag calls.
            Sets all storage to 'denied' by default until the user accepts
            the cookie banner. Required for GDPR compliance (EU). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                wait_for_update: 500
              });
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
