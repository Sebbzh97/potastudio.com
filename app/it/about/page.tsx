import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { JsonLd } from '@/components/json-ld'
import { stripBrand } from '@/lib/seo'
import { getAboutPage, getClients } from '@/sanity/lib/page-queries'

export const revalidate = 3600

// ── Metadata ───────────────────────────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  const data = await getAboutPage('it')
  const title = stripBrand(data?.seoTitle ?? 'Chi siamo — Agenzia di marketing nata a Bergamo')
  const description =
    data?.seoDescription?.trim() ||
    'Pota Studio è un\'agenzia di marketing full-service di Bergamo: paid advertising, social, influencer marketing e produzione contenuti. Tutto in-house.'
  return {
    title,
    description,
    alternates: {
      canonical: 'https://www.potastudio.com/it/about',
      languages: {
        en: 'https://www.potastudio.com/about',
        it: 'https://www.potastudio.com/it/about',
        'x-default': 'https://www.potastudio.com/about',
      },
    },
    openGraph: {
      type: 'website',
      locale: 'it_IT',
      url: 'https://www.potastudio.com/it/about',
      siteName: 'Pota Studio',
      title: `${title} | Pota Studio`,
      description,
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Pota Studio' }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@potastudio',
      title: `${title} | Pota Studio`,
      description,
    },
  }
}

// ── Page ───────────────────────────────────────────────────────────────────

export default async function AboutPageIT() {
  const [data, rawClients] = await Promise.all([
    getAboutPage('it'),
    getClients(),
  ])

  const clients = rawClients.map((c) => c.name)

  // All copy from Sanity
  const heroLabel    = data?.heroLabel    ?? ''
  const heroHeadline = data?.heroHeadline ?? ''
  const heroAccent   = data?.heroAccent   ?? ''
  const heroBody     = data?.heroBody     ?? ''

  const storyLabel    = data?.storyLabel    ?? ''
  const storyHeadline = data?.storyHeadline ?? ''
  const storyP1       = data?.storyP1       ?? ''
  const storyP2       = data?.storyP2       ?? ''
  const storyP3       = data?.storyP3       ?? ''
  const storyP4       = data?.storyP4       ?? ''

  const officesLabel = data?.officesLabel ?? ''
  const offices = [
    {
      name:        data?.office1Name        ?? '',
      address:     data?.office1Address     ?? '',
      country:     data?.office1Country     ?? '',
      description: data?.office1Description ?? '',
      comingSoon: false,
    },
    ...(data?.office2Name
      ? [{
          name:        data.office2Name,
          address:     data.office2Address     ?? '',
          country:     data.office2Country     ?? '',
          description: data.office2Description ?? '',
          comingSoon:  !!data.office2ComingSoon,
        }]
      : []),
  ]

  const valuesLabel  = data?.valuesLabel  ?? ''
  const clientsLabel = data?.clientsLabel ?? ''
  const clientsWallCta = data?.clientsWallCta ?? ''

  const values = [
    { title: data?.value1Title ?? '', description: data?.value1Body ?? '' },
    { title: data?.value2Title ?? '', description: data?.value2Body ?? '' },
    { title: data?.value3Title ?? '', description: data?.value3Body ?? '' },
  ].filter((v) => v.title || v.description)

  const ctaHeadline = data?.ctaHeadline ?? ''
  const ctaBody     = data?.ctaBody     ?? ''
  const ctaLabel    = data?.ctaLabel    ?? ''

  return (
    <>
      <main>
        {/* Hero */}
        <section className="pt-28 sm:pt-40 pb-16 sm:pb-24 bg-[#0D0D0D] relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(#FFFFFF 1px, transparent 1px), linear-gradient(90deg, #FFFFFF 1px, transparent 1px)', backgroundSize: '80px 80px' }}
            aria-hidden="true"
          />
          <div className="container-site relative">
            {heroLabel && <span className="text-xs font-semibold text-[#FF5C00] uppercase tracking-[0.3em] mb-4 sm:mb-6 block">{heroLabel}</span>}
            <h1 className="font-bold text-white leading-[1.05] mb-5 sm:mb-6" style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 'clamp(3rem, 11vw, 8rem)' }}>
              {heroHeadline}<br /><span className="text-[#FF5C00]">{heroAccent}</span>
            </h1>
            <p className="text-base sm:text-xl text-[#B0B0B0] max-w-2xl leading-relaxed">{heroBody}</p>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 sm:py-24 bg-[#141414] border-t border-white/10">
          <div className="container-site">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-start">
              <div>
                {storyLabel && <span className="text-xs font-semibold text-[#FF5C00] uppercase tracking-[0.3em] mb-4 sm:mb-6 block">{storyLabel}</span>}
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5 sm:mb-6" style={{ fontFamily: 'var(--font-space-grotesk)' }}>{storyHeadline}</h2>
                <div className="flex flex-col gap-4 text-[#B0B0B0] leading-relaxed text-sm sm:text-base">
                  {storyP1 && <p>{storyP1}</p>}
                  {storyP2 && <p>{storyP2}</p>}
                  {storyP3 && <p>{storyP3}</p>}
                  {storyP4 && <p>{storyP4}</p>}
                </div>
              </div>
              <div className="flex flex-col gap-4 sm:gap-6">
                {officesLabel && <span className="text-xs font-semibold text-[#FF5C00] uppercase tracking-[0.3em]">{officesLabel}</span>}
                {offices.map((office) => (
                  <div
                    key={office.name}
                    className={`border rounded-xl p-5 sm:p-6 transition-colors ${
                      office.comingSoon
                        ? 'border-dashed border-white/20 bg-[#0D0D0D]/50'
                        : 'border-white/10 bg-[#0D0D0D] hover:border-[#FF5C00]/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className={`text-lg sm:text-xl font-bold ${office.comingSoon ? 'text-white/60' : 'text-white'}`} style={{ fontFamily: 'var(--font-space-grotesk)' }}>{office.name}</h3>
                        {office.comingSoon && (
                          <span className="text-[10px] font-semibold text-[#FFC629] bg-[#FFC629]/10 px-2 py-0.5 rounded uppercase tracking-wider">In Arrivo</span>
                        )}
                      </div>
                      {office.country && (
                        <span className={`text-xs font-medium px-2 py-1 rounded flex-shrink-0 ${office.comingSoon ? 'text-[#FF5C00]/60 bg-[#FF5C00]/5' : 'text-[#FF5C00] bg-[#FF5C00]/10'}`}>{office.country}</span>
                      )}
                    </div>
                    {office.address && (
                      <div className={`flex items-center gap-2 text-sm mb-2 ${office.comingSoon ? 'text-[#B0B0B0]/60' : 'text-[#B0B0B0]'}`}>
                        <MapPin size={14} className="flex-shrink-0" />{office.address}
                      </div>
                    )}
                    {office.description && (
                      <p className={`text-sm ${office.comingSoon ? 'text-[#B0B0B0]/60' : 'text-[#B0B0B0]'}`}>{office.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>



        {/* Values */}
        {values.length > 0 && (
          <section className="py-16 sm:py-24 bg-[#141414] border-t border-white/10">
            <div className="container-site">
              {valuesLabel && <span className="text-xs font-semibold text-[#FF5C00] uppercase tracking-[0.3em] mb-8 sm:mb-12 block">{valuesLabel}</span>}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
                {values.map((v, i) => (
                  <div key={v.title || i} className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6 sm:p-8 hover:border-[#FF5C00]/30 transition-colors">
                    <span className="text-4xl sm:text-5xl font-bold text-[#FF5C00] opacity-30 block mb-4" style={{ fontFamily: 'var(--font-space-grotesk)' }} aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-space-grotesk)' }}>{v.title}</h3>
                    <p className="text-[#B0B0B0] text-sm leading-relaxed">{v.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Clients wall */}
        {clients.length > 0 && (
          <section className="py-16 sm:py-24 bg-[#0D0D0D] border-t border-white/10">
            <div className="container-site">
              {clientsLabel && <span className="text-xs font-semibold text-[#FF5C00] uppercase tracking-[0.3em] mb-8 sm:mb-12 block">{clientsLabel}</span>}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-10 sm:mb-12">
                {clients.map((name) => (
                  <div key={name} className="border border-white/10 rounded-lg px-4 py-3 sm:py-4 text-center bg-[#141414] hover:border-white/30 transition-colors">
                    <span className="text-[#B0B0B0] text-sm font-medium">{name}</span>
                  </div>
                ))}
              </div>
              {clientsWallCta && (
                <p className="text-[#B0B0B0] text-sm sm:text-base">
                  {clientsWallCta}{' '}
                  <a href="mailto:ciao@potastudio.com" className="text-[#FF5C00] hover:underline">ciao@potastudio.com</a>
                </p>
              )}
            </div>
          </section>
        )}

        {/* CTA */}
        {(ctaHeadline || ctaBody) && (
          <section className="py-16 sm:py-24 bg-[#141414] border-t border-white/10">
            <div className="container-site text-center" style={{ maxWidth: '48rem' }}>
              <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 text-balance" style={{ fontFamily: 'var(--font-space-grotesk)' }}>{ctaHeadline}</h2>
              <p className="text-[#B0B0B0] mb-8 text-base sm:text-lg">{ctaBody}</p>
              {ctaLabel && (
                <Link href="/it/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF5C00] text-white font-semibold rounded hover:bg-[#e04f00] transition-colors">
                  {ctaLabel} <ArrowUpRight size={16} />
                </Link>
              )}
            </div>
          </section>
        )}
      </main>
    </>
  )
}
