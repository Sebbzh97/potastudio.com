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
  // Use Sanity values when set; fall back to the canonical positioning copy.
  // `||` (not `??`) so empty strings from Studio also fall back.
  // Description name-drops the verified Italian clients only (Samsung,
  // Isybank, Lucca Comics & Games) — Ferrari/Lamborghini/Atalanta are NOT
  // clients and were removed in the 2026-05 audit cleanup.
  const title =
    data?.seoTitle?.trim() ||
    'Pota Studio | Agenzia di Marketing Full-Service'
  const description =
    data?.seoDescription?.trim() ||
    'Agenzia di marketing full-service da Bergamo. Lavoriamo con Samsung, Isybank, Lucca Comics & Games. Social media, advertising, content production, influencer marketing.'
  return {
    // `title.absolute` bypasses the root layout's `%s | Pota Studio`
    // template — without this the IT home shipped
    // "Pota Studio - Social Media, Influencer Marketing e Ads | Pota Studio"
    // (double brand) to Google.
    title: { absolute: title },
    description,
    alternates: {
      canonical: 'https://www.potastudio.com/it',
      languages: {
        en: 'https://www.potastudio.com',
        it: 'https://www.potastudio.com/it',
        'x-default': 'https://www.potastudio.com',
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
