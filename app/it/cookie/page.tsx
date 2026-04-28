import type { Metadata } from 'next'
import { getCookiePage } from '@/sanity/lib/page-queries'
import LegalPage from '@/components/legal/legal-page'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const data = await getCookiePage('it')
  return {
    title: data?.seoTitle ?? 'Cookie Policy | Pota Studio',
    description: data?.seoDescription ?? '',
    alternates: {
      canonical: 'https://potastudio.com/it/cookie',
      languages: {
        en: 'https://potastudio.com/cookie',
        it: 'https://potastudio.com/it/cookie',
        'x-default': 'https://potastudio.com/cookie',
      },
    },
  }
}

export default async function CookiePageIT() {
  const data = await getCookiePage('it')
  return (
    <LegalPage
      eyebrow={data?.eyebrow ?? 'Legale'}
      title={data?.heroHeadline ?? 'Cookie Policy'}
      lastUpdated={data?.legalLastUpdated ? `Ultimo aggiornamento: ${data.legalLastUpdated}` : undefined}
      appliesToLabel="Si applica a: potastudio.com"
      body={null}
      iubenda={{
        url: 'https://www.iubenda.com/privacy-policy/31096609/cookie-policy',
        label: 'Apri la Cookie Policy completa',
        caption: 'Cookie Policy',
        subCaption: 'La nostra Cookie Policy completa è ospitata su Iubenda ed è sempre aggiornata. Clicca il pulsante qui sotto per consultarla.',
      }}
      seeAlsoLabel="Vedi anche:"
      seeAlsoHref="/it/privacy"
      seeAlsoLinkLabel="Privacy Policy"
    />
  )
}
