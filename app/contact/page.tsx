import type { Metadata } from 'next'
import { getHreflang } from '@/lib/hreflang'
import { getContactPage } from '@/sanity/lib/page-queries'
import ContactPageClient from './contact-client'


export async function generateMetadata(): Promise<Metadata> {
  const data = await getContactPage('en')
  return {
    // Brand suffix appended automatically by the root layout template.
    title: data?.seoTitle ?? 'Contact',
    description: data?.seoDescription ?? '',
    ...getHreflang('/contact'),
  }
}

export default async function ContactPage() {
  const data = await getContactPage('en')
  return <ContactPageClient data={data} />
}
