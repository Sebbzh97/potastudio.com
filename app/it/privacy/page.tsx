import type { Metadata } from 'next'
import { getPrivacyPage } from '@/sanity/lib/page-queries'
import { stripBrand } from '@/lib/seo'
import LegalPage from '@/components/legal/legal-page'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPrivacyPage('it')
  const title = stripBrand(data?.seoTitle ?? 'Privacy Policy')
  return {
    title,
    description: data?.seoDescription ?? '',
    alternates: {
      canonical: 'https://www.potastudio.com/it/privacy',
      languages: {
        en: 'https://www.potastudio.com/privacy',
        it: 'https://www.potastudio.com/it/privacy',
        'x-default': 'https://www.potastudio.com/privacy',
      },
    },
    openGraph: {
      type: 'website',
      locale: 'it_IT',
      url: 'https://www.potastudio.com/it/privacy',
      siteName: 'Pota Studio',
      title: `${title} | Pota Studio`,
      description: data?.seoDescription ?? '',
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
