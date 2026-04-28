import type { Metadata } from 'next'
import { getHreflang } from '@/lib/hreflang'
import { getContactPage } from '@/sanity/lib/page-queries'
import ContactPageClient from './contact-client'


export async function generateMetadata(): Promise<Metadata> {
  const data = await getContactPage('en')
  return {
    title: data?.seoTitle ?? 'Contact | Pota Studio',
    description: data?.seoDescription ?? '',
    ...getHreflang('/contact'),
  }
}

export default async function ContactPage() {
  const data = await getContactPage('en')
  return <ContactPageClient data={data} />
}
