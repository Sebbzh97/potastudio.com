import type { Metadata } from 'next'
import { getContactPage } from '@/sanity/lib/page-queries'
import ContactPageClient from '@/app/contact/contact-client'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const data = await getContactPage('it')
  return {
    title: data?.seoTitle ?? 'Contatti | Pota Studio',
    description: data?.seoDescription ?? '',
    alternates: {
      canonical: 'https://www.potastudio.com/it/contact',
      languages: {
        en: 'https://www.potastudio.com/contact',
        it: 'https://www.potastudio.com/it/contact',
        'x-default': 'https://www.potastudio.com/contact',
      },
    },
  }
}

export default async function ItalianContactPage() {
  const data = await getContactPage('it')
  return <ContactPageClient data={data} />
}
