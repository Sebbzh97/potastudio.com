import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getHreflang } from '@/lib/hreflang'
import { getHomepage, getTestimonials } from '@/sanity/lib/page-queries'

import HeroSection from '@/components/home/hero-section'
import StatsBar from '@/components/home/stats-bar'
import ServicesPreview from '@/components/home/services-preview'
import FeaturedWork from '@/components/home/featured-work'
import WhyPota from '@/components/home/why-pota'
import ClientLogoWall from '@/components/home/client-logo-wall'
import Testimonials from '@/components/home/testimonials'
import CtaSection from '@/components/home/cta-section'
import LatestInsights from '@/components/home/latest-insights'

/** Inline skeleton fallbacks — only shown during streaming, never in initial SSR HTML */
function WorkSkeleton() {
  return (
    <section className="py-16 sm:py-24 bg-[#0D0D0D]" aria-hidden="true">
      <div className="container-site">
        <div className="h-6 w-40 bg-white/10 rounded mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] max-h-[560px] bg-white/5 rounded-lg" />
          ))}
        </div>
      </div>
    </section>
  )
}

function InsightsSkeleton() {
  return (
    <section className="py-16 sm:py-24 bg-[#0A0A0A]" aria-hidden="true">
      <div className="container-site">
        <div className="h-6 w-40 bg-white/10 rounded mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-72 bg-white/5 rounded-xl" />
          ))}
        </div>
      </div>
    </section>
  )
}

function LogoWallSkeleton() {
  return <section className="py-16 bg-[#141414] border-t border-b border-white/10 h-36" aria-hidden="true" />
}

export const revalidate = 60

// Canonical positioning copy. Editors can still override these via the
// homepage document in Sanity (`seoTitle` / `seoDescription`); we fall
// back to these strings whenever the CMS field is empty or whitespace.
//
// Description is intentionally name-dropping the *verified* clients only
// (Samsung, Isybank, Lucca Comics & Games). Earlier copy mentioned Ferrari,
// Lamborghini and Atalanta — none of those are clients, and Google's
// snippet was indexing that phrase. Keep this list ↔ /lib/jsonld/schemas.ts
// `clientLogos` in sync.
const FALLBACK_TITLE = 'Pota Studio | Full Service Marketing Agency'
const FALLBACK_DESCRIPTION =
  'Italian full-service marketing agency from Bergamo. Trusted by Samsung, Isybank, Lucca Comics & Games. Social media, paid ADS, content production, influencer marketing. Worldwide ready.'

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHomepage('en')
  // `||` (not `??`) so empty strings from Studio also fall back.
  const title = data?.seoTitle?.trim() || FALLBACK_TITLE
  const description = data?.seoDescription?.trim() || FALLBACK_DESCRIPTION

  return {
    // `title.absolute` bypasses the root layout's `%s | Pota Studio`
    // template — without this we'd ship "Pota Studio | Full Service
    // Marketing Agency | Pota Studio" (double brand) to Google.
    title: { absolute: title },
    description,
    ...getHreflang('/'),
    openGraph: {
      type: 'website',
      url: 'https://www.potastudio.com',
      siteName: 'Pota Studio',
      title,
      description,
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Pota Studio' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.jpg'],
    },
    // Force-refresh signals for Google's index. NOTE: `revisit-after` is a
    // non-standard meta tag ignored by Googlebot since ~2010 (per John
    // Mueller). We emit it because it was explicitly requested AND because
    // a few legacy crawlers still parse it, but the *real* re-crawl signal
    // is `sitemap.xml`'s `<lastmod>` + the `Last-Modified` HTTP header,
    // both already wired up elsewhere in this project.
    other: {
      'revisit-after': '1 days',
    },
  }
}

export default async function HomePage() {
  const [data, testimonials] = await Promise.all([getHomepage('en'), getTestimonials()])
  return (
    <main>
      <HeroSection data={data ?? undefined} locale="en" />
      <StatsBar data={data} locale="en" />
      <ServicesPreview data={data} />
      <Suspense fallback={<WorkSkeleton />}>
        <FeaturedWork data={data ?? undefined} locale="en" />
      </Suspense>
      <Suspense fallback={<InsightsSkeleton />}>
        <LatestInsights locale="en" />
      </Suspense>
      <WhyPota data={data} locale="en" />
      <Suspense fallback={<LogoWallSkeleton />}>
        <ClientLogoWall data={data ?? undefined} locale="en" />
      </Suspense>
      <Testimonials testimonials={testimonials} locale="en" />
      <CtaSection data={data} />
    </main>
  )
}
