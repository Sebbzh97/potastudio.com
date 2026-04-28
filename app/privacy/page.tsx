import type { Metadata } from 'next'
import { getHreflang } from '@/lib/hreflang'
import { getPrivacyPage } from '@/sanity/lib/page-queries'
import LegalPage from '@/components/legal/legal-page'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPrivacyPage('en')
  return {
    title: data?.seoTitle ?? 'Privacy Policy | Pota Studio',
    description: data?.seoDescription ?? '',
    ...getHreflang('/privacy'),
  }
}

export default async function PrivacyPageEN() {
  const data = await getPrivacyPage('en')
  return (
    <LegalPage
      eyebrow={data?.eyebrow ?? 'Legal'}
      title={data?.heroHeadline ?? 'Privacy Policy'}
      lastUpdated={data?.legalLastUpdated ? `Last updated: ${data.legalLastUpdated}` : undefined}
      appliesToLabel="Applies to: potastudio.com"
      body={data?.legalBody ?? null}
      seeAlsoLabel="See also:"
      seeAlsoHref="/cookie"
      seeAlsoLinkLabel="Cookie Policy"
    />
  )
}
