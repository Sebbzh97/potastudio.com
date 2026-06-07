import type { Metadata } from 'next'
import ClientsDisplay, { type ClientsPageCopy } from '@/components/clients-display'
import type { Testimonial, ClientBrand } from '@/lib/types'
import { getClientsPage, getTestimonials, getClients } from '@/sanity/lib/page-queries'
import { stripBrand } from '@/lib/seo'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const data = await getClientsPage('it')
  const title = stripBrand(data?.seoTitle ?? 'Clienti — Samsung, Isybank, Lucca Comics')
  const description =
    data?.seoDescription?.trim() ||
    'I clienti di Pota Studio: Samsung Italia, Isybank, Lucca Comics & Games, Havit e altri brand che si affidano a noi per marketing e contenuti.'
  return {
    title,
    description,
    alternates: {
      canonical: 'https://www.potastudio.com/it/clients',
      languages: {
        en: 'https://www.potastudio.com/clients',
        it: 'https://www.potastudio.com/it/clients',
        'x-default': 'https://www.potastudio.com/clients',
      },
    },
    openGraph: {
      type: 'website',
      locale: 'it_IT',
      url: 'https://www.potastudio.com/it/clients',
      siteName: 'Pota Studio',
      title: `${title} | Pota Studio`,
      description,
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Pota Studio' }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@potastudio',
      title: `${title} | Pota Studio`,
      description,
    },
  }
}

export default async function ClientsPageIT() {
  const [data, sanityTestimonials, sanityClients] = await Promise.all([
    getClientsPage('it'),
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
    name: c.name,
    industry: c.industry ?? '',
    country: c.country ?? '',
  }))

  const testimonials: Testimonial[] = sanityTestimonials.map((t) => ({
    name: t.author,
    role: t.role ?? '',
    company: t.company ?? '',
    quote: t.quote,
  }))

  return <ClientsDisplay clients={clients} testimonials={testimonials} copy={copy} />
}
