import type { Metadata } from 'next'
import { getCookiePage } from '@/sanity/lib/page-queries'
import { stripBrand } from '@/lib/seo'
import LegalPage from '@/components/legal/legal-page'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const data = await getCookiePage('it')
  const title = stripBrand(data?.seoTitle ?? 'Cookie Policy')
  return {
    title,
    description: data?.seoDescription ?? '',
    alternates: {
      canonical: 'https://www.potastudio.com/it/cookie',
      languages: {
        en: 'https://www.potastudio.com/cookie',
        it: 'https://www.potastudio.com/it/cookie',
        'x-default': 'https://www.potastudio.com/cookie',
      },
    },
    openGraph: {
      type: 'website',
      locale: 'it_IT',
      url: 'https://www.potastudio.com/it/cookie',
      siteName: 'Pota Studio',
      title: `${title} | Pota Studio`,
      description: data?.seoDescription ?? '',
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
