'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

interface CaseStudy {
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

const FILTER_TYPES = ['Social', 'ADS', 'Web', 'Influencer', 'Content']

export default function WorkList({
  caseStudies,
  basePath = '/work',
  viewLabel = 'View Case Study',
  filterAllLabel = 'All',
}: {
  caseStudies: CaseStudy[]
  basePath?: string
  viewLabel?: string
  filterAllLabel?: string
}) {
  const filters = [filterAllLabel, ...FILTER_TYPES]
  const [active, setActive] = useState(filterAllLabel)
  const filtered = active === filterAllLabel ? caseStudies : caseStudies.filter((c) => c.type === active)

  return (
    <>
      {/* Filter bar */}
      <div className="sticky top-14 sm:top-16 lg:top-20 z-30 bg-[#0D0D0D]/95 backdrop-blur-sm border-b border-white/10 py-3 sm:py-4">
        <div className="container-site flex items-center gap-2 overflow-x-auto no-scrollbar">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                active === f
                  ? 'bg-[#FF5C00] text-white'
                  : 'text-[#B0B0B0] border border-white/20 hover:border-white/40 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section className="py-10 sm:py-16 bg-[#0D0D0D]">
        <div className="container-site">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filtered.map((cs) => (
              <Link
                key={cs.slug}
                href={`${basePath}/${cs.slug}`}
                className="group relative overflow-hidden rounded-xl flex flex-col p-6 sm:p-8 min-h-64 sm:min-h-72 transition-all duration-300 active:scale-[0.98]"
                style={{ background: cs.bg }}
              >
                {/* Cover image — fully visible, only zoom on hover */}
                {cs.coverImage && (
                  <Image
                    src={cs.coverImage}
                    alt={cs.client}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}

                {/* Localized gradients for text readability */}
                {cs.coverImage && (
                  <>
                    {/* Top: covers tag chips + year */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-24 sm:h-28 bg-gradient-to-b from-black/85 via-black/40 to-transparent" />
                    {/* Bottom: covers metric, title, description */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/90 via-30% to-transparent" />
                  </>
                )}
                
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-0.5 z-10" style={{ background: cs.accent }} />

                {/* Large letter - only show if no cover */}
                {!cs.coverImage && (
                <div
                  className="absolute bottom-0 right-0 text-[8rem] sm:text-[10rem] font-bold leading-none opacity-[0.08] select-none"
                  style={{ fontFamily: 'var(--font-space-grotesk)', color: cs.accent }}
                  aria-hidden="true"
                >
                  {cs.client[0]}
                </div>
                )}

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-auto flex-wrap">
                    {cs.tags.map((t) => (
                      <span key={t} className="text-xs font-medium px-2 py-0.5 rounded bg-white/10 text-[#B0B0B0]">
                        {t}
                      </span>
                    ))}
                    {cs.year && <span className="text-xs text-[#B0B0B0] ml-auto">{cs.year}</span>}
                  </div>

                  <div className="mt-10 sm:mt-12">
                    {cs.metric && (
                      <div
                        className="text-2xl sm:text-3xl font-bold mb-1 transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                        style={{ fontFamily: 'var(--font-space-grotesk)', color: cs.accent }}
                      >
                        {cs.metric}
                      </div>
                    )}
                    <h3
                      className="text-xl sm:text-2xl font-bold text-white mb-2"
                      style={{ fontFamily: 'var(--font-space-grotesk)' }}
                    >
                      {cs.client}
                    </h3>
                    <p className="text-sm text-[#B0B0B0] leading-relaxed mb-4">{cs.description}</p>
                    <div 
                      className="flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0"
                      style={{ color: cs.accent }}
                    >
                      {viewLabel}
                      <ArrowUpRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
