import type { Metadata } from 'next'
import { getHreflang } from '@/lib/hreflang'
import { getCookiePage } from '@/sanity/lib/page-queries'
import LegalPage from '@/components/legal/legal-page'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const data = await getCookiePage('en')
  return {
    title: data?.seoTitle ?? 'Cookie Policy | Pota Studio',
    description: data?.seoDescription ?? '',
    ...getHreflang('/cookie'),
  }
}

export default async function CookiePageEN() {
  const data = await getCookiePage('en')
  return (
    <LegalPage
      eyebrow={data?.eyebrow ?? 'Legal'}
      title={data?.heroHeadline ?? 'Cookie Policy'}
      lastUpdated={data?.legalLastUpdated ? `Last updated: ${data.legalLastUpdated}` : undefined}
      appliesToLabel="Applies to: potastudio.com"
      body={null}
      iubenda={{
        url: 'https://www.iubenda.com/privacy-policy/31096609/cookie-policy',
        label: 'View full Cookie Policy',
        caption: 'Cookie Policy',
        subCaption: 'Our full Cookie Policy is hosted on Iubenda and is always kept up to date. Click the button below to read it.',
      }}
      seeAlsoLabel="See also:"
      seeAlsoHref="/privacy"
      seeAlsoLinkLabel="Privacy Policy"
    />
  )
}
