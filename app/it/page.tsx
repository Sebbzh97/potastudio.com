import type { Metadata } from 'next'
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
  const data = await getHomepage('it')
  return {
    title: data?.seoTitle ?? 'Pota Studio | Marketing Agency',
    description: data?.seoDescription ?? '',
    alternates: {
      canonical: 'https://potastudio.com/it',
      languages: {
        en: 'https://potastudio.com',
        it: 'https://potastudio.com/it',
        'x-default': 'https://potastudio.com',
      },
    },
  }
}

export default async function ItalianHomePage() {
  const [data, testimonials] = await Promise.all([getHomepage('it'), getTestimonials()])
  return (
    <main>
      <HeroSection data={data ?? undefined} locale="it" />
      <StatsBar data={data} locale="it" />
      <ServicesPreview data={data} locale="it" />
      <FeaturedWork data={data ?? undefined} locale="it" />
      <WhyPota data={data} locale="it" />
      <ClientLogoWall data={data ?? undefined} locale="it" />
      <Testimonials testimonials={testimonials} locale="it" />
      <CtaSection data={data} locale="it" />
    </main>
  )
}
