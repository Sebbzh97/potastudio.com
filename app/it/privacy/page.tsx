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
      canonical: 'https://www.potastudio.com/it/privacy',
      languages: {
        en: 'https://www.potastudio.com/privacy',
        it: 'https://www.potastudio.com/it/privacy',
        'x-default': 'https://www.potastudio.com/privacy',
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
      body={null}
      iubenda={{
        url: 'https://www.iubenda.com/privacy-policy/31096609',
        label: 'Apri la Privacy Policy completa',
        caption: 'Privacy Policy',
        subCaption: 'La nostra Privacy Policy completa è ospitata su Iubenda ed è sempre aggiornata. Clicca il pulsante qui sotto per consultarla.',
      }}
      seeAlsoLabel="Vedi anche:"
      seeAlsoHref="/it/cookie"
      seeAlsoLinkLabel="Cookie Policy"
    />
  )
}
