import WorkList from '@/components/work-list'
import type { Metadata } from 'next'
import {
  getWorkPage,
  getCaseStudies,
  pickLocalizedCaseStudy,
} from '@/sanity/lib/page-queries'

export const revalidate = 60

interface CaseStudyCard {
  slug: string
  client: string
  type: string
  tags: string[]
  year: string
  metric: string
  bg: string
  accent: string
  description: string
  coverImage?: string
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getWorkPage('it')
  return {
    // Brand suffix is appended automatically by the root layout's title
    // template — never pre-include "| Pota Studio" here.
    title: data?.seoTitle ?? 'Lavori',
    description: data?.seoDescription ?? '',
    alternates: {
      canonical: 'https://www.potastudio.com/it/work',
      languages: {
        en: 'https://www.potastudio.com/work',
        it: 'https://www.potastudio.com/it/work',
        'x-default': 'https://www.potastudio.com/work',
      },
    },
  }
}

export default async function WorkPageIT() {
  const [data, sanityCasesRaw] = await Promise.all([
    getWorkPage('it'),
    getCaseStudies(),
  ])

  const sanityCases = sanityCasesRaw.map((cs) => pickLocalizedCaseStudy(cs, 'it'))

  const caseStudies: CaseStudyCard[] = sanityCases.map((cs) => ({
    slug: cs.slug,
    client: cs.client,
    type: cs.type ?? '',
    tags: cs.tags ?? [],
    year: cs.year ?? '',
    metric: cs.metric ?? '',
    bg: cs.bg ?? '#111111',
    accent: cs.accent ?? '#FF5C00',
    description: cs.description ?? '',
    coverImage: cs.coverImageUrl || cs.galleryUrls?.[0],
  }))

  const heroLabel    = data?.heroLabel    ?? ''
  const heroHeadline = data?.heroHeadline ?? ''
  const heroAccent   = data?.heroAccent   ?? ''
  const heroBody     = data?.heroBody     ?? ''
  const filterAllLabel = data?.filterAllLabel ?? 'Tutti'
  const viewLabel    = data?.featuredWorkViewCaseLabel ?? 'Vedi il case study'

  return (
    <main>
      <section className="pt-28 sm:pt-40 pb-12 sm:pb-16 bg-[#0D0D0D]">
        <div className="container-site">
          {heroLabel && (
            <span className="text-xs font-semibold text-[#FF5C00] uppercase tracking-[0.3em] mb-4 sm:mb-6 block">
              {heroLabel}
            </span>
          )}
          <h1
            className="font-bold text-white leading-[1.05] mb-5 sm:mb-6 whitespace-pre-line"
            style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 'clamp(3rem, 11vw, 8rem)' }}
          >
            {heroHeadline}
            {heroAccent && (<>{' '}<br /><span className="text-[#FF5C00]">{heroAccent}</span></>)}
          </h1>
          {heroBody && (
            <p className="text-base sm:text-xl text-[#B0B0B0] max-w-2xl leading-relaxed">{heroBody}</p>
          )}
        </div>
      </section>
      <WorkList
        caseStudies={caseStudies}
        basePath="/it/work"
        viewLabel={viewLabel}
        filterAllLabel={filterAllLabel}
      />
    </main>
  )
}
