import type { Metadata } from 'next'
import { getPrivacyPage } from '@/sanity/lib/page-queries'
import LegalPage from '@/components/legal/legal-page'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPrivacyPage('it')
  return {
    title: data?.seoTitle ?? 'Privacy Policy | Pota Studio',
    description: data?.seoDescription ?? '',
    alternates: {
      canonical: 'https://potastudio.com/it/privacy',
      languages: {
        en: 'https://potastudio.com/privacy',
        it: 'https://potastudio.com/it/privacy',
        'x-default': 'https://potastudio.com/privacy',
      },
    },
  }
}

export default async function PrivacyPageIT() {
  const data = await getPrivacyPage('it')
  return (
    <LegalPage
      eyebrow={data?.eyebrow ?? 'Legale'}
      title={data?.heroHeadline ?? 'Privacy Policy'}
      lastUpdated={data?.legalLastUpdated ? `Ultimo aggiornamento: ${data.legalLastUpdated}` : undefined}
      appliesToLabel="Si applica a: potastudio.com"
      body={data?.legalBody ?? null}
      seeAlsoLabel="Vedi anche:"
      seeAlsoHref="/it/cookie"
      seeAlsoLinkLabel="Cookie Policy"
    />
  )
}
