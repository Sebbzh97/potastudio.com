import type { Metadata } from 'next'
import { getContactPage } from '@/sanity/lib/page-queries'
import { stripBrand } from '@/lib/seo'
import ContactPageClient from '@/app/contact/contact-client'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const data = await getContactPage('it')
  const title = stripBrand(data?.seoTitle ?? 'Contatti — Iniziamo un progetto')
  const description =
    data?.seoDescription?.trim() ||
    'Parla con Pota Studio. Raccontaci il tuo progetto di marketing, advertising o produzione contenuti e ti rispondiamo entro 24 ore.'
  return {
    title,
    description,
    alternates: {
      canonical: 'https://www.potastudio.com/it/contact',
      languages: {
        en: 'https://www.potastudio.com/contact',
        it: 'https://www.potastudio.com/it/contact',
        'x-default': 'https://www.potastudio.com/contact',
      },
    },
    openGraph: {
      type: 'website',
      locale: 'it_IT',
      url: 'https://www.potastudio.com/it/contact',
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

export default async function ItalianContactPage() {
  const data = await getContactPage('it')
  return <ContactPageClient data={data} />
}
