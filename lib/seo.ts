/**
 * Centralized Metadata API for Pota Studio.
 *
 * - `rootMetadata`        → imported by app/layout.tsx as `export const metadata`
 * - `buildPageMetadata()` → used by individual route pages to generate
 *                           page-level metadata without repeating boilerplate.
 *
 * Using `metadataBase` prevents Next.js build-time warnings when Open Graph
 * `url` or `alternates.canonical` values are relative paths.
 */

import type { Metadata } from "next"

const SITE_URL = "https://www.potastudio.com"
const SITE_SHORT_TITLE = "Pota Studio"

/**
 * Strips any trailing/embedded "Pota Studio" brand mention from a title so the
 * root layout's `%s | Pota Studio` template never produces a duplicated brand
 * (e.g. "About | Pota Studio | Pota Studio").
 *
 * Handles the common separators editors type in Sanity (`|`, `—`, `-`, `·`)
 * and is safe to call on any resolved title string — CMS value or fallback.
 */
export function stripBrand(title: string): string {
  return title
    // Remove " | Pota Studio", " — Pota Studio", " - Pota Studio", " · Pota Studio"
    .replace(/\s*[|–—\-·]\s*Pota\s*Studio\s*/gi, " ")
    // Remove a leading "Pota Studio | " prefix if present
    .replace(/^\s*Pota\s*Studio\s*[|–—\-·]\s*/i, "")
    // Collapse any leftover double spaces and trim separators/space at the ends
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s|–—\-·]+|[\s|–—\-·]+$/g, "")
    .trim()
}


const DEFAULT_TITLE =
  "Pota Studio | High-Performance Full-Service Marketing Agency | Bergamo, Italy"

// Keep under 155 chars so Google doesn't truncate the snippet mid-sentence.
const DEFAULT_DESCRIPTION =
  "Pota Studio — full-service marketing agency. Social media, Meta/TikTok Ads, influencer marketing, content production. €2.5M+ in ad spend. Bergamo, Italy."

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_SHORT_TITLE}`,
  },
  description: DEFAULT_DESCRIPTION,
  authors: [{ name: SITE_SHORT_TITLE, url: SITE_URL }],
  creator: SITE_SHORT_TITLE,
  publisher: SITE_SHORT_TITLE,
  robots:
    process.env.VERCEL_ENV === "preview"
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      it: "/it",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_SHORT_TITLE,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: SITE_SHORT_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    site: "@potastudio",
    creator: "@sebbonfanti",
    images: ["/og-image.jpg"],
  },
  // app/icon.png and app/apple-icon.png are auto-served by Next.js App Router
  // convention. public/favicon.ico is served statically at /favicon.ico for
  // legacy browsers — it must NOT live inside /app alongside icon.png because
  // that triggers a Turbopack route conflict in Next 16.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
}

// ─── Per-page helper ─────────────────────────────────────────────────────────

type BuildPageMetadataOptions = {
  title: string
  description?: string
  path: string
  /**
   * Page locale — controls the OG `locale` tag and the hreflang `<link>`
   * alternates emitted in `<head>`. Defaults to 'en'.
   */
  locale?: 'en' | 'it'
  /** When true, sets robots noindex + nofollow (e.g. staging pages). */
  noIndex?: boolean
  /** Optional OG image override. Defaults to /og-image.jpg */
  ogImage?: string
}

/**
 * Generates page-level Metadata that inherits the root template.
 * The `path` must start with "/" (e.g. "/services").
 * Pass `locale` to emit correct hreflang alternates and OG locale in <head>.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  locale = 'en',
  noIndex,
  ogImage = "/og-image.jpg",
}: BuildPageMetadataOptions): Metadata {
  const metaDescription = description ?? DEFAULT_DESCRIPTION
  const canonicalPath = path.startsWith("/") ? path : `/${path}`
  const fullUrl = `${SITE_URL}${canonicalPath}`
  const isIt = locale === 'it'
  const ogLocale = isIt ? 'it_IT' : 'en_US'

  // Hreflang: IT pages live under /it/…, EN counterparts at /…
  const enPath = isIt ? canonicalPath.replace(/^\/it/, '') || '/' : canonicalPath
  const itPath = isIt ? canonicalPath : `/it${canonicalPath}`

  const metadata: Metadata = {
    title,
    description: metaDescription,
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: enPath,
        it: itPath,
        'x-default': enPath,
      },
    },
    openGraph: {
      type: "website",
      locale: ogLocale,
      siteName: SITE_SHORT_TITLE,
      title: `${title} | ${SITE_SHORT_TITLE}`,
      description: metaDescription,
      url: fullUrl,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  }

  if (typeof noIndex === "boolean") {
    metadata.robots = {
      index: !noIndex,
      follow: !noIndex,
    }
  }

  return metadata
}
