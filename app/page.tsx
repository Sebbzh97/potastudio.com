import type { Metadata } from 'next'
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

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHomepage('en')
  // Use Sanity values when set; fall back to the canonical positioning copy.
  // `||` (not `??`) so empty strings from Studio also fall back.
  const title =
    data?.seoTitle?.trim() ||
    'Pota Studio - Social Media, Influencer Marketing & Ads'
  const description =
    data?.seoDescription?.trim() ||
    'Full-service agency for social media, influencer marketing, paid advertising and TikTok. No handoffs, all in-house. Europe & US clients. See our work.'
  return {
    title,
    description,
    ...getHreflang('/'),
  }
}

export default async function HomePage() {
  const [data, testimonials] = await Promise.all([getHomepage('en'), getTestimonials()])
  return (
    <main>
      <HeroSection data={data ?? undefined} locale="en" />
      <StatsBar data={data} locale="en" />
      <ServicesPreview data={data} />
      <FeaturedWork data={data ?? undefined} locale="en" />
      <WhyPota data={data} locale="en" />
      <ClientLogoWall data={data ?? undefined} locale="en" />
      <Testimonials testimonials={testimonials} locale="en" />
      <CtaSection data={data} />
    </main>
  )
}
