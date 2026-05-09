import type { Metadata } from 'next'
import { getHreflang } from '@/lib/hreflang'
import ClientsDisplay, { type ClientsPageCopy } from '@/components/clients-display'
import type { Testimonial, ClientBrand } from '@/lib/types'
import { getClientsPage, getTestimonials, getClients } from '@/sanity/lib/page-queries'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const data = await getClientsPage('en')
  return {
    // Title template (`%s | Pota Studio`) is applied by the root layout.
    title: data?.seoTitle ?? 'Clients',
    description: data?.seoDescription ?? '',
    ...getHreflang('/clients'),
  }
}

export default async function ClientsPage() {
  const [data, sanityTestimonials, sanityClients] = await Promise.all([
    getClientsPage('en'),
    getTestimonials(),
    getClients(),
  ])

  const copy: ClientsPageCopy = {
    heroLabel:         data?.heroLabel         ?? '',
    heroHeadline:      data?.heroHeadline      ?? '',
    heroAccent:        data?.heroAccent        ?? '',
    heroBody:          data?.heroBody          ?? '',
    statsLabel:        data?.statsLabel        ?? '',
    stat1Value:        data?.stat1DisplayValue ?? '',
    stat1Label:        data?.stat1DisplayLabel ?? '',
    stat2Value:        data?.stat2DisplayValue ?? '',
    stat2Label:        data?.stat2DisplayLabel ?? '',
    stat3Value:        data?.stat3DisplayValue ?? '',
    stat3Label:        data?.stat3DisplayLabel ?? '',
    testimonialsLabel: data?.testimonialsLabel ?? '',
  }

  const clients: ClientBrand[] = sanityClients.map((c) => ({
    name:     c.name,
    industry: c.industry ?? '',
    country:  c.country  ?? '',
  }))

  const testimonials: Testimonial[] = sanityTestimonials.map((t) => ({
    name: t.author,
    role: t.role ?? '',
    company: t.company ?? '',
    quote: t.quote,
  }))

  return <ClientsDisplay clients={clients} testimonials={testimonials} copy={copy} />
}
