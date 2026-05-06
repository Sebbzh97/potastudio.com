import WorkList from '@/components/work-list'
import type { Metadata } from 'next'
import { getHreflang } from '@/lib/hreflang'
import { getWorkPage, getCaseStudies } from '@/sanity/lib/page-queries'

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
  const data = await getWorkPage('en')
  return {
    // Brand suffix appended automatically by the root layout template.
    title: data?.seoTitle ?? 'Work',
    description: data?.seoDescription ?? '',
    ...getHreflang('/work'),
  }
}

export default async function WorkPageEN() {
  const [data, sanityCases] = await Promise.all([getWorkPage('en'), getCaseStudies()])

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
  const filterAllLabel = data?.filterAllLabel ?? 'All'
  const viewLabel    = data?.featuredWorkViewCaseLabel ?? 'View case study'

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
        viewLabel={viewLabel}
        filterAllLabel={filterAllLabel}
      />
    </main>
  )
}
