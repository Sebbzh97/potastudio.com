import type { Metadata } from 'next'
import { getHreflang } from '@/lib/hreflang'
import { stripBrand } from '@/lib/seo'
import { getContactPage } from '@/sanity/lib/page-queries'
import ContactPageClient from './contact-client'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const data = await getContactPage('en')
  return {
    // Brand suffix appended automatically by the root layout template.
    title: stripBrand(data?.seoTitle ?? 'Contact — Start a Project'),
    description: data?.seoDescription ?? '',
    ...getHreflang('/contact'),
  }
}

export default async function ContactPage() {
  const data = await getContactPage('en')
  return <ContactPageClient data={data} />
}
