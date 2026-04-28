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
  return {
    title: data?.seoTitle ?? 'Pota Studio | Marketing Agency',
    description: data?.seoDescription ?? '',
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
