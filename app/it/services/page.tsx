import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Check } from 'lucide-react'
import { getServicesPage } from '@/sanity/lib/page-queries'

// ── Visual palette per service number (layout-only, not content) ──────────
const BG_COLORS = ['#1A0D00', '#1A1A00', '#1A0D00', '#1A1A00', '#1A0D00', '#1A1A00']
const ACCENT_COLORS = ['#FF5C00', '#FFD600', '#FF5C00', '#FFD600', '#FF5C00', '#FFD600']

function getDeliverables(data: Record<string, unknown> | null, n: number): string[] {
  if (!data) return []
  return [1, 2, 3, 4, 5]
    .map((k) => data[`service${n}Deliverable${k}`] as string | undefined)
    .filter(Boolean) as string[]
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getServicesPage('it')
  return {
    // Brand suffix is appended automatically by the root layout's title
    // template — never pre-include "| Pota Studio" here.
    title: data?.seoTitle ?? 'Servizi',
    description: data?.seoDescription ?? '',
    alternates: {
      canonical: 'https://www.potastudio.com/it/services',
      languages: {
        en: 'https://www.potastudio.com/services',
        it: 'https://www.potastudio.com/it/services',
        'x-default': 'https://www.potastudio.com/services',
      },
    },
  }
}

export default async function ServicesPageIT() {
  const data = await getServicesPage('it')

  const services = [1, 2, 3, 4, 5, 6]
    .map((n) => {
      const title = data?.[`service${n}Title`] as string | undefined
      if (!title) return null
      return {
        number:       String(n).padStart(2, '0'),
        name:         title,
        description:  (data?.[`service${n}Body`] as string | undefined) ?? '',
        deliverables: getDeliverables(data, n),
        bg:           BG_COLORS[n - 1],
        accent:       ACCENT_COLORS[n - 1],
        imageUrl:     (data?.[`service${n}ImageUrl`] as string | undefined) ?? '',
      }
    })
    .filter(Boolean) as Array<{ number: string; name: string; description: string; deliverables: string[]; bg: string; accent: string; imageUrl: string }>

  const heroLabel    = data?.heroLabel    ?? ''
  const heroHeadline = data?.heroHeadline ?? ''
  const heroAccent   = data?.heroAccent   ?? ''
  const heroBody     = data?.heroBody     ?? ''
  const ctaHeadline  = data?.ctaHeadline  ?? ''
  const ctaAccent    = data?.ctaAccent    ?? ''
  const ctaBody      = data?.ctaBody      ?? ''
  const ctaLabel     = data?.ctaButtonLabel ?? 'Contattaci'
  const ctaHref      = data?.ctaButtonHref  ?? '/it/contact'
  const serviceCtaLabel   = data?.serviceCtaLabel   ?? 'Inizia questo servizio'
  const deliverablesLabel = data?.deliverablesLabel ?? 'Cosa è incluso'

  return (
    <main>
      <section className="pt-28 sm:pt-40 pb-16 sm:pb-24 bg-[#0D0D0D] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#FFFFFF 1px, transparent 1px), linear-gradient(90deg, #FFFFFF 1px, transparent 1px)', backgroundSize: '80px 80px' }} aria-hidden="true" />
        <div className="container-site relative">
          {heroLabel && <span className="text-xs font-semibold text-[#FF5C00] uppercase tracking-[0.3em] mb-4 sm:mb-6 block">{heroLabel}</span>}
          <h1 className="font-bold text-white leading-[1.05] mb-5 sm:mb-6" style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 'clamp(3rem, 11vw, 8rem)' }}>
            {heroHeadline}
            {heroAccent && (<>{' '}<br /><span className="text-[#FF5C00]">{heroAccent}</span></>)}
          </h1>
          {heroBody && <p className="text-base sm:text-xl text-[#B0B0B0] max-w-2xl leading-relaxed">{heroBody}</p>}
        </div>
      </section>

      {services.map((service, i) => (
        <section key={service.number} className="py-14 sm:py-20 border-t border-white/10 relative overflow-hidden" style={{ backgroundColor: service.bg }}>
          {/* Background image */}
          {service.imageUrl && (
            <Image
              src={service.imageUrl}
              alt={service.name}
              fill
              className="object-cover opacity-20"
              sizes="100vw"
            />
          )}
          {/* Gradient overlay */}
          {service.imageUrl && (
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
          )}
          <div className="container-site relative z-10">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-start ${i % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
              <div className={i % 2 === 1 ? 'lg:col-start-2' : ''}>
                <div className="flex items-center gap-4 mb-5 sm:mb-6">
                  <span className="text-5xl sm:text-6xl font-bold" style={{ fontFamily: 'var(--font-space-grotesk)', color: service.accent }}>{service.number}</span>
                  <div className="h-px flex-1" style={{ backgroundColor: service.accent, opacity: 0.3 }} />
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5 sm:mb-6" style={{ fontFamily: 'var(--font-space-grotesk)' }}>{service.name}</h2>
                {service.description && <p className="text-[#B0B0B0] text-base sm:text-lg leading-relaxed mb-8 sm:mb-10">{service.description}</p>}
                <Link href="/it/contact" className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 bg-[#FF5C00] text-white font-semibold rounded transition-all duration-200 hover:bg-[#e04f00] hover:shadow-[0_0_20px_rgba(255,92,0,0.4)] group text-sm sm:text-base">
                  {serviceCtaLabel} <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {service.deliverables.length > 0 && (
                <div className={`bg-[#0D0D0D]/60 border border-white/10 rounded-xl p-6 sm:p-8 ${i % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <h3 className="text-xs font-semibold text-[#B0B0B0] uppercase tracking-widest mb-5 sm:mb-6">{deliverablesLabel}</h3>
                  <ul className="flex flex-col gap-3 sm:gap-4">
                    {service.deliverables.map((d) => (
                      <li key={d} className="flex items-start gap-3">
                        <div className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${service.accent}20` }}>
                          <Check size={12} style={{ color: service.accent }} />
                        </div>
                        <span className="text-white text-sm leading-relaxed">{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      ))}

      {(ctaHeadline || ctaBody) && (
        <section className="py-16 sm:py-24 bg-[#0D0D0D] border-t border-white/10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              {ctaHeadline}
              {ctaAccent && (<>{' '}<br /><span className="text-[#FF5C00]">{ctaAccent}</span></>)}
            </h2>
            {ctaBody && <p className="text-[#B0B0B0] text-base sm:text-lg mb-8 sm:mb-10">{ctaBody}</p>}
            <Link href={ctaHref} className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#FF5C00] text-white font-bold rounded transition-all hover:bg-[#e04f00] hover:shadow-[0_0_30px_rgba(255,92,0,0.4)] group">
              {ctaLabel} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      )}
    </main>
  )
}
