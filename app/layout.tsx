import type { Viewport } from 'next'
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
import { rootMetadata } from '@/lib/seo'
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

// Re-export the centralised root metadata so all pages inherit the
// title template, default description, and OG/Twitter defaults.
export const metadata = rootMetadata

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#0D0D0D',
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
