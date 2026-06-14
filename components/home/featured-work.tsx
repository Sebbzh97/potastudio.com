import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { getHomepageCaseStudies, pickLocalizedCaseStudy } from '@/sanity/lib/page-queries'

type FeaturedWorkData = {
  featuredWorkLabel?: string
  featuredWorkHeadline1?: string
  featuredWorkHeadline2?: string
  featuredWorkViewAllLabel?: string
  featuredWorkViewCaseLabel?: string
}

/**
 * Curated case studies for the homepage by SLUG — slugs are the most stable
 * identifier across editorial renames. Order in this array = display order.
 * Any slots not filled by these slugs are backfilled from remaining published
 * case studies (excluding the explicit deny-list).
 */
const HOME_FEATURED_SLUGS = [
  'samsung-italia-olimpiadi',
  'samsung-unpacked',
  'lucca-comics-and-games-2025',
  'havit-ecommerce',
  'levitology',
  'cookies-digital-partner',
] as const

const HOME_EXCLUDED_SLUGS: string[] = []

/**
 * Metric tags to display on each card. Keyed by slug.
 * These are real campaign results — update if results change.
 */
const CARD_METRICS: Record<string, string[]> = {
  'samsung-italia-olimpiadi':     ['+340% engagement', '18M reach'],
  'samsung-unpacked':              ['3 live events', '5M views'],
  'lucca-comics-and-games-2025':  ['+120% social growth', '200K attendees'],
  'havit-ecommerce':               ['+280% ROAS', '4x revenue'],
  'levitology':                    ['0→1 brand', 'Full identity'],
  'cookies-digital-partner':       ['+90% organic', 'SEO + ADS'],
}

const matches = (client: string, needle: string) =>
  client.toLowerCase().includes(needle.toLowerCase())

export default async function FeaturedWork({
  data,
  locale = 'en',
}: {
  data?: FeaturedWorkData
  locale?: 'en' | 'it'
}) {
  const isIt = locale === 'it'
  const sanity = await getHomepageCaseStudies()
  const localized = sanity.map((cs) => pickLocalizedCaseStudy(cs, isIt ? 'it' : 'en'))

  // 1) Pick curated slugs in declared order, deduping by _id.
  const picked: typeof localized = []
  for (const slug of HOME_FEATURED_SLUGS) {
    const found = localized.find(
      (cs) => cs.slug === slug && !picked.some((p) => p._id === cs._id),
    )
    if (found) picked.push(found)
  }

  // 2) Fill any empty slots with non-excluded, non-already-picked case studies.
  const fillers = localized.filter(
    (cs) =>
      !picked.some((p) => p._id === cs._id) &&
      !HOME_EXCLUDED_SLUGS.includes(cs.slug),
  )

  const caseStudies = [...picked, ...fillers].slice(0, 6)

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

        {/* Case studies grid — 3 col desktop, 2 tablet, 1 mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {caseStudies.map((cs, idx) => {
            // Cover image: prioritize coverImageUrl, then first galleryUrl
            const coverSrc = cs.coverImageUrl || cs.galleryUrls?.[0]
            const metricTags = CARD_METRICS[cs.slug] ?? []

            return (
            <Link
              key={cs._id}
              href={caseHref(cs.slug)}
              className="group relative overflow-hidden rounded-lg aspect-[4/5] max-h-[560px] flex flex-col justify-end p-5 sm:p-6 active:scale-[0.98] transition-transform"
              style={{ background: cs.bg ?? '#111' }}
            >
              {/* Cover image — first 3 cards eager, rest lazy for LCP */}
              {coverSrc && (
                <Image
                  src={coverSrc}
                  alt={cs.client}
                  fill
                  loading={idx < 3 ? 'eager' : 'lazy'}
                  className="object-cover opacity-50 group-hover:opacity-65 group-hover:scale-105 transition-[opacity,transform] duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              )}

              {/* Bottom gradient — deep solid coverage under title/description */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t from-black via-black/90 via-50% to-transparent" />
              {/* Top gradient — softly protects type chip + year */}
              {coverSrc && (
                <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/60 to-transparent" />
              )}

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
                  <p className="text-sm text-[#B0B0B0] leading-relaxed mb-3">{cs.description}</p>
                )}
                {metricTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {metricTags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-semibold px-2 py-0.5 rounded"
                        style={{ background: `${cs.accent ?? '#FF5C00'}22`, color: cs.accent ?? '#FF5C00' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
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
