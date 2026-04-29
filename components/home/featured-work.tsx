import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { getCaseStudies, pickLocalizedCaseStudy } from '@/sanity/lib/page-queries'

type FeaturedWorkData = {
  featuredWorkLabel?: string
  featuredWorkHeadline1?: string
  featuredWorkHeadline2?: string
  featuredWorkViewAllLabel?: string
  featuredWorkViewCaseLabel?: string
}

export default async function FeaturedWork({
  data,
  locale = 'en',
}: {
  data?: FeaturedWorkData
  locale?: 'en' | 'it'
}) {
  const isIt = locale === 'it'
  const sanity = await getCaseStudies()
  const caseStudies = sanity
    .map((cs) => pickLocalizedCaseStudy(cs, isIt ? 'it' : 'en'))
    .slice(0, 3)

  // Section copy (Sanity-driven with minimal fallbacks)
  const eyebrow  = data?.featuredWorkLabel        ?? (isIt ? 'Lavori Selezionati' : 'Selected Work')
  const line1    = data?.featuredWorkHeadline1    ?? (isIt ? 'Risultati che' : 'Results that')
  const line2    = data?.featuredWorkHeadline2    ?? (isIt ? 'parlano chiaro.' : 'speak louder.')
  const viewAll  = data?.featuredWorkViewAllLabel ?? (isIt ? 'Vedi tutti i lavori' : 'View all work')
  const viewCase = data?.featuredWorkViewCaseLabel ?? (isIt ? 'Vedi il Case Study' : 'View Case Study')
  const workHref = isIt ? '/it/work' : '/work'
  const caseHref = (slug: string) => (isIt ? `/it/work/${slug}` : `/work/${slug}`)

  if (caseStudies.length === 0) return null

  return (
    <section className="py-16 sm:py-24 bg-[#0D0D0D]">
      <div className="container-site">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-10 sm:mb-16">
          <div>
            <span className="text-xs font-semibold text-[#FFC629] uppercase tracking-[0.3em] mb-3 sm:mb-4 block">
              {eyebrow}
            </span>
            <h2
              className="font-bold text-white"
              style={{
                fontFamily: 'var(--font-space-grotesk)',
                fontSize: 'clamp(2rem, 4.5vw, 5rem)',
              }}
            >
              {line1}
              <br />
              {line2}
            </h2>
          </div>
          <Link
            href={workHref}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#B0B0B0] hover:text-white transition-colors group self-start sm:self-auto"
          >
            {viewAll}
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Case studies grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {caseStudies.map((cs) => {
            // Cover image: prioritize coverImageUrl, then first galleryUrl
            const coverSrc = cs.coverImageUrl || cs.galleryUrls?.[0]
            
            return (
            <Link
              key={cs._id}
              href={caseHref(cs.slug)}
              className="group relative overflow-hidden rounded-lg aspect-[4/5] max-h-[560px] flex flex-col justify-end p-5 sm:p-6 active:scale-[0.98] transition-transform"
              style={{ background: cs.bg ?? '#111' }}
            >
              {/* Cover image */}
              {coverSrc && (
                <Image
                  src={coverSrc}
                  alt={cs.client}
                  fill
                  className="object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
              )}
              
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />

              {/* Colored top accent */}
              <div
                className="absolute top-0 left-0 right-0 h-1 z-10"
                style={{ background: cs.accent ?? '#FF5C00' }}
              />

              {/* Large client initial - only show if no cover image */}
              {!coverSrc && (
              <div
                className="absolute top-4 right-4 sm:top-6 sm:right-6 text-[6rem] sm:text-[8rem] font-bold leading-none opacity-10 select-none"
                style={{
                  fontFamily: 'var(--font-space-grotesk)',
                  color: cs.accent ?? '#FF5C00',
                }}
                aria-hidden="true"
              >
                {cs.client[0]}
              </div>
              )}

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
                  {cs.type && (
                    <span className="text-xs font-medium text-[#B0B0B0] bg-white/10 px-2 py-1 rounded">
                      {cs.type}
                    </span>
                  )}
                  {cs.year && <span className="text-xs text-[#B0B0B0]">{cs.year}</span>}
                </div>
                <h3
                  className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-[#FFC629] transition-colors"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  {cs.client}
                </h3>
                {cs.description && (
                  <p className="text-sm text-[#B0B0B0] leading-relaxed mb-3 sm:mb-4">{cs.description}</p>
                )}
                <div 
                  className="flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0"
                  style={{ color: cs.accent ?? '#FF5C00' }}
                >
                  {viewCase}
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
