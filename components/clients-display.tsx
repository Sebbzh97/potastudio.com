'use client'

import { useState } from 'react'
import type { Testimonial, ClientBrand } from '@/lib/types'

const industries = ['All', 'Automotive', 'Sport', 'Finance', 'E-commerce', 'Fashion', 'Partner', 'Food & Beverage', 'Tech / E-commerce']

const industryColors: Record<string, string> = {
  Automotive: '#CC0000',
  Sport: '#0038A8',
  Finance: '#00C8FF',
  'E-commerce': '#FF5C00',
  Fashion: '#FFD600',
  Partner: '#A0A0A0',
  'Food & Beverage': '#22C55E',
  'Tech / E-commerce': '#A78BFA',
}

export interface ClientsPageCopy {
  heroLabel: string
  heroHeadline: string
  heroAccent: string
  heroBody: string
  statsLabel: string
  stat1Value: string
  stat1Label: string
  stat2Value: string
  stat2Label: string
  stat3Value: string
  stat3Label: string
  testimonialsLabel: string
}

export default function ClientsDisplay({
  clients,
  testimonials,
  copy,
}: {
  clients: ClientBrand[]
  testimonials: Testimonial[]
  copy: ClientsPageCopy
}) {
  const [active, setActive] = useState('All')

  // Only show filter tabs for industries present in the current client list
  const presentIndustries = ['All', ...Array.from(new Set(clients.map((c) => c.industry)))]
  const tabs = industries.filter((i) => presentIndustries.includes(i))

  const filtered = active === 'All' ? clients : clients.filter((c) => c.industry === active)

  return (
    <main>
      {/* Hero */}
      <section className="pt-28 sm:pt-40 pb-16 sm:pb-24 bg-[#0D0D0D] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#FFFFFF 1px, transparent 1px), linear-gradient(90deg, #FFFFFF 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
          aria-hidden="true"
        />
          <div className="container-site relative">
          <span className="text-xs font-semibold text-[#FF5C00] uppercase tracking-[0.3em] mb-4 sm:mb-6 block">
            {copy.heroLabel}
          </span>
          <h1
            className="font-bold text-white leading-[1.05] mb-5 sm:mb-6"
            style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 'clamp(3rem, 11vw, 8rem)' }}
          >
            {copy.heroHeadline}
            <br />
            <span className="text-[#FF5C00]">{copy.heroAccent}</span>
          </h1>
          <p className="text-base sm:text-xl text-[#B0B0B0] max-w-2xl leading-relaxed">
            {copy.heroBody}
          </p>
        </div>
      </section>

      {/* Stats */}
      <div className="bg-[#141414] border-t border-b border-white/10 py-10 sm:py-12">
          <div className="container-site">
          {copy.statsLabel && (
            <p className="text-xs font-semibold text-[#FF5C00] uppercase tracking-[0.3em] mb-6 text-center">
              {copy.statsLabel}
            </p>
          )}
          <div className="grid grid-cols-3 divide-x divide-white/10">
            {[
              { value: copy.stat1Value, label: copy.stat1Label },
              { value: copy.stat2Value, label: copy.stat2Label },
              { value: copy.stat3Value, label: copy.stat3Label },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center py-3 sm:py-4 gap-1 px-2">
                <span
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FF5C00]"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  {s.value}
                </span>
                <span className="text-[9px] sm:text-xs text-[#B0B0B0] uppercase tracking-widest text-center">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Industry filter + logo grid */}
      <section className="py-12 sm:py-16 bg-[#0D0D0D]">
          <div className="container-site">
          <div className="flex items-center gap-2 flex-wrap mb-8 sm:mb-12">
            {tabs.map((ind) => (
              <button
                key={ind}
                onClick={() => setActive(ind)}
                className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 ${
                  active === ind
                    ? 'bg-[#FF5C00] text-white'
                    : 'text-[#B0B0B0] border border-white/20 hover:border-white/40 hover:text-white'
                }`}
              >
                {ind}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-white/10">
            {filtered.map((c) => (
              <div
                key={c.name}
                className="group bg-[#0D0D0D] p-8 sm:p-12 flex flex-col items-center justify-center gap-2 sm:gap-3 hover:bg-[#141414] transition-colors"
              >
                <span
                  className="text-xl sm:text-3xl md:text-4xl font-bold text-white/30 group-hover:text-white transition-colors text-center tracking-tight"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  {c.name.toUpperCase()}
                </span>
                {c.industry !== 'Partner' && (
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded"
                    style={{
                      color: industryColors[c.industry] ?? '#A0A0A0',
                      backgroundColor: `${industryColors[c.industry] ?? '#A0A0A0'}15`,
                    }}
                  >
                    {c.industry}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-24 bg-[#141414] border-t border-white/10">
          <div className="container-site">
          <span className="text-xs font-semibold text-[#FF5C00] uppercase tracking-[0.3em] mb-8 sm:mb-12 block">
            {copy.testimonialsLabel}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-[#0D0D0D] border border-white/10 rounded-xl p-5 sm:p-6 flex flex-col gap-4 hover:border-[#FF5C00]/30 transition-colors relative"
              >
                <span
                  className="absolute top-4 right-5 text-5xl sm:text-6xl font-bold text-[#FF5C00] opacity-20 select-none leading-none pointer-events-none"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                <p className="text-white text-sm leading-relaxed relative z-10">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/10">
                  <div className="w-8 h-8 rounded-full bg-[#FF5C00]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#FF5C00] font-bold text-xs">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-xs">{t.name}</p>
                    <p className="text-[#B0B0B0] text-xs">{t.role} · {t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
