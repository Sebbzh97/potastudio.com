import type { Metadata } from 'next'
import React from 'react'
import CaseStudyGallery from '@/components/media/case-study-gallery'
import type { GalleryItem } from '@/components/media/lightbox'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, BarChart2, TrendingUp, Users } from 'lucide-react'
import { JsonLd } from '@/components/json-ld'
import Breadcrumbs from '@/components/breadcrumbs'
import CaseStudyTracker from '@/components/analytics/case-study-tracker'
import ImpactCard from '@/components/work/impact-card'
import YoutubeVideoGrid from '@/components/work/youtube-video-grid'
import { caseStudySchema } from '@/lib/jsonld/schemas'
import { getHreflang } from '@/lib/hreflang'
import {
  getCaseStudyBySlug,
  getCaseStudies,
  pickLocalizedCaseStudy,
  type SanityCaseStudy,
} from '@/sanity/lib/page-queries'

export const revalidate = 3600
export const dynamicParams = true

// ── Static fallback data (IT) ──────────────────────────────────────────────────

type StaticCS = {
  client: string; type: string; tags: string[]; year: string
  bg: string; accent: string; challenge: string; approach: string; results: string
  metrics: { label: string; value: string }[]; relatedSlugs: string[]
  services: string[]
}

const STATIC_CASE_STUDIES: Record<string, StaticCS> = {
  'samsung-tiktok': {
    client: 'Samsung', type: 'ADS', tags: ['TikTok Ads', 'Meta ADS', 'Performance'],
    year: '2023', bg: '#00001A', accent: '#1428A0',
    challenge: "Samsung Italia doveva lanciare la serie Galaxy S24 con un impatto misurabile su un pubblico più giovane in 5 mercati europei contemporaneamente.",
    approach: "Abbiamo architettato una campagna full-funnel su TikTok e Meta con 24 asset creativi unici testati su 6 segmenti di pubblico. Gli annunci in stile UGC hanno sovraperformato il contenuto di brand di 3:1 in ogni mercato.",
    results: "La campagna ha ottenuto un ROAS del 340% in tutti i mercati. Samsung ha rinnovato l'incarico per i successivi 3 lanci di prodotto.",
    metrics: [
      { label: 'ROAS', value: '+340%' }, { label: 'Mercati Coperti', value: '5' },
      { label: 'Varianti Creative', value: '24' }, { label: 'Riduzione CPM', value: '-38%' },
    ],
    relatedSlugs: ['isybank-ads'],
    services: ['TikTok Ads', 'Meta Ads', 'Strategia Performance', 'Produzione Contenuti'],
  },
  'isybank-ads': {
    client: 'Isybank', type: 'ADS', tags: ['Meta ADS', 'Lead Gen', 'Fintech'],
    year: '2022', bg: '#001A1A', accent: '#00C8FF',
    challenge: "Isybank, una nuova banca digitale di Intesa Sanpaolo, doveva acquisire utenti dell'app su larga scala mantenendo il CPL sotto controllo in un mercato fintech altamente competitivo.",
    approach: "Abbiamo costruito un modello di segmentazione del pubblico granulare su Meta, rotazione creativa ogni 7 giorni e un framework di A/B testing delle landing page con 12 varianti simultanee.",
    results: "Il CPL è calato del 62% in 90 giorni. Gli install dell'app hanno superato gli obiettivi del 180%. La campagna è diventata un caso studio interno per il team di Intesa Sanpaolo.",
    metrics: [
      { label: 'Riduzione CPL', value: '-62%' }, { label: 'Target Install Superato', value: '+180%' },
      { label: 'Varianti Landing Page', value: '12' }, { label: 'Durata Campagna', value: '90 giorni' },
    ],
    relatedSlugs: ['samsung-tiktok'],
    services: ['Meta Ads', 'Lead Generation', 'A/B Testing Landing Page', 'Strategia Audience'],
  },
}

const STATIC_GALLERY: Record<string, GalleryItem[]> = {
  'samsung-tiktok': [
    { id: 'g1', mediaType: 'photo', src: 'https://images.unsplash.com/photo-1611186871525-6e7aabf96c6a?w=800&q=80', caption: 'Galaxy S24: creativo lancio mercato Italia' },
    { id: 'g2', mediaType: 'video', src: 'https://images.unsplash.com/photo-1579869847514-7c1a19d2d2ad?w=800&q=80', caption: 'Annuncio hero stile UGC: variante migliore', videoSource: 'youtube', youtubeId: 'dQw4w9WgXcQ' },
    { id: 'g3', mediaType: 'photo', src: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80', caption: 'Griglia storyboard annuncio TikTok' },
  ],

  'isybank-ads': [
    { id: 'g1', mediaType: 'photo', src: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80', caption: 'Creativo Meta: variante migliore performer' },
    { id: 'g2', mediaType: 'video', src: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80', caption: 'Video campagna install app', videoSource: 'youtube', youtubeId: 'dQw4w9WgXcQ' },
    { id: 'g3', mediaType: 'photo', src: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80', caption: 'Variante A/B landing page: vincitrice' },
  ],
}

function toStaticShape(cs: SanityCaseStudy): StaticCS {
  return {
    client: cs.client, type: cs.type ?? '', tags: cs.tags ?? [], year: cs.year ?? '',
    bg: cs.bg ?? '#111111', accent: cs.accent ?? '#FF5C00',
    challenge: cs.challenge ?? '', approach: cs.approach ?? '', results: cs.results ?? '',
    metrics: (cs.metrics ?? []).filter((m) => {
      const v = String(m.value ?? '').trim()
      return v !== '' && v !== '0' && v !== '+0' && v !== '-0' && !/^[+-]?0\s/.test(v) && Number(v) !== 0
    }),
    relatedSlugs: cs.relatedSlugs ?? [],
    services: cs.services ?? [],
  }
}

interface CaseStudySection { icon: React.ReactElement; title: string; body: string }
type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const raw = await getCaseStudyBySlug(slug)
  const sanity = raw ? pickLocalizedCaseStudy(raw, 'it') : null
  const cs = sanity ? toStaticShape(sanity) : STATIC_CASE_STUDIES[slug]
  if (!cs) return { title: 'Case study non trovato' }
  // Brand suffix is appended automatically by the root layout's title
  // template — leave it off here to avoid double-suffixing.
  return {
    title: `${cs.client} Case Study`,
    description: (cs.challenge || cs.results).slice(0, 160),
    ...getHreflang(`/work/${slug}`, 'it'),
  }
}

export default async function CaseStudyPageIT({ params }: Props) {
  const { slug } = await params
  const raw = await getCaseStudyBySlug(slug)
  const sanity = raw ? pickLocalizedCaseStudy(raw, 'it') : null
  const cs = sanity ? toStaticShape(sanity) : STATIC_CASE_STUDIES[slug]

// Build gallery - use Sanity gallery if available, then galleryUrls, then static fallback
let gallery: GalleryItem[] = []
if (sanity?.gallery?.length) {
  gallery = sanity.gallery.map((g, i) => ({ id: g.id || `g${i}`, mediaType: 'photo' as const, src: g.src }))
} else if (sanity?.galleryUrls?.length) {
  gallery = sanity.galleryUrls.map((url, i) => ({ id: `url${i}`, mediaType: 'photo' as const, src: url }))
} else {
  gallery = STATIC_GALLERY[slug] ?? []
}

  const allSanityRaw = sanity ? await getCaseStudies() : []
  const allSanity = allSanityRaw.map((c) => pickLocalizedCaseStudy(c, 'it'))
  const relatedItems = (cs?.relatedSlugs ?? []).map((rslug) => {
    const fromSanity = allSanity.find((s) => s.slug === rslug)
    if (fromSanity) return { slug: rslug, client: fromSanity.client, type: fromSanity.type ?? '', year: fromSanity.year ?? '' }
    const fromStatic = STATIC_CASE_STUDIES[rslug]
    if (fromStatic) return { slug: rslug, client: fromStatic.client, type: fromStatic.type, year: fromStatic.year }
    return null
  }).filter(Boolean) as { slug: string; client: string; type: string; year: string }[]

  if (!cs) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-space-grotesk)' }}>Case study non trovato</h1>
          <Link href="/it/work" className="text-[#FF5C00] hover:underline">Torna ai lavori</Link>
        </div>
      </main>
    )
  }

  return (
    <main>
      <CaseStudyTracker
        slug={slug}
        client={cs.client}
        category={cs.type}
        year={cs.year}
      />
      <JsonLd
        data={caseStudySchema({
          slug,
          client: cs.client,
          type: cs.type,
          challenge: cs.challenge,
          approach: cs.approach,
          results: cs.results,
          year: cs.year,
          tags: cs.tags,
          services: cs.services,
          metrics: cs.metrics,
          locale: 'it',
          aggregateRating:
            raw?.testimonial?.rating &&
            Number.isFinite(raw.testimonial.rating)
              ? {
                  ratingValue: raw.testimonial.rating,
                  reviewCount: 1,
                  bestRating: 5,
                }
              : undefined,
        })}
      />

      <article aria-labelledby="case-study-title">
        {/* Hero — cover image as opaque blurred full-bleed background */}
        <header className="pt-40 pb-24 relative overflow-hidden" style={{ background: cs.bg }}>
          {raw?.coverImageUrl && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${raw.coverImageUrl}?w=1400&auto=format&q=60&fit=crop`}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                style={{ filter: 'blur(6px) brightness(0.25) saturate(0.6)', transform: 'scale(1.05)' }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: `linear-gradient(to bottom, ${cs.bg}80 0%, ${cs.bg}E6 70%, ${cs.bg} 100%)` }}
              />
            </>
          )}
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: cs.accent }} />
          <div className="container-site relative">
            <Link href="/it/work" className="inline-flex items-center gap-2 text-sm text-[#B0B0B0] hover:text-white transition-colors mb-6">
              <ArrowLeft size={14} />Tutti i lavori
            </Link>
            <Breadcrumbs
              className="mb-10"
              items={[
                { name: 'Home', url: '/it' },
                { name: 'Lavori', url: '/it/work' },
                { name: cs.client, url: `/it/work/${slug}` },
              ]}
            />
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {cs.tags.map((t) => (
                <span key={t} className="text-xs font-medium px-3 py-1 bg-white/10 rounded-full text-[#B0B0B0]">{t}</span>
              ))}
              {cs.year && <span className="text-xs text-[#B0B0B0]">{cs.year}</span>}
            </div>
            <h1
              id="case-study-title"
              className="font-bold text-white leading-none mb-6 text-balance"
              style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 'clamp(3rem, 8vw, 8rem)' }}
            >
              {cs.client}
            </h1>
          </div>
        </header>

      {/* Impact Cards — filter out empty or zero-value metrics */}
      {cs.metrics.filter((m) => {
        const v = (m.value ?? '').trim()
        return v !== '' && !/^[+-]?0(\s|$)/.test(v)
      }).length > 0 && (
        <section
          aria-label="Risultati chiave"
          className="bg-[#141414] border-y border-white/10"
        >
          <div className="container-site py-12 sm:py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {cs.metrics
                .filter((m) => {
                  const v = (m.value ?? '').trim()
                  return v !== '' && !/^[+-]?0(\s|$)/.test(v)
                })
                .map((m, i) => (
                  <ImpactCard
                    key={`${m.label}-${i}`}
                    value={m.value}
                    label={m.label}
                    accent={cs.accent}
                  />
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-24 bg-[#0D0D0D]">
        <div className="container-site" style={{ maxWidth: '56rem' }}>
          <div className="flex flex-col gap-16">
            {([
              { icon: <BarChart2 size={20} />, title: 'La Sfida', body: cs.challenge },
              { icon: <TrendingUp size={20} />, title: 'Il Nostro Approccio', body: cs.approach },
              { icon: <Users size={20} />, title: 'I Risultati', body: cs.results },
            ] as CaseStudySection[]).filter((s) => s.body).map((section) => (
              <div key={section.title}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-[#FF5C00]">{section.icon}</div>
                  <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>{section.title}</h2>
                </div>
                <p className="text-[#B0B0B0] text-lg leading-relaxed pl-9">{section.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube Videos — thumbnail grid with inline lightbox */}
      {(() => {
        const ids: string[] = [
          ...(raw?.youtubeVideos ?? []),
          ...(raw?.youtubeVideoId ? [raw.youtubeVideoId] : []),
        ].filter(Boolean)
        if (ids.length === 0) return null
        return (
          <section className="py-16 bg-[#0D0D0D] border-t border-white/10">
            <div className="container-site">
              <YoutubeVideoGrid ids={ids} client={cs.client} accent={cs.accent} />
            </div>
          </section>
        )
      })()}

        {/* Media Gallery */}
        <CaseStudyGallery items={gallery} />
      </article>

      {/* Related work — semantic aside (tangential to the article) */}
      {relatedItems.length > 0 && (
        <aside aria-label="Case study correlati" className="py-16 bg-[#141414] border-t border-white/10">
          <div className="container-site">
            <h2 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: 'var(--font-space-grotesk)' }}>Altri Lavori</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedItems.map((r) => (
                <Link key={r.slug} href={`/it/work/${r.slug}`} className="group flex items-center justify-between p-6 bg-[#0D0D0D] border border-white/10 rounded-xl hover:border-[#FF5C00]/40 transition-all">
                  <div>
                    <div className="text-xs text-[#B0B0B0] mb-1">{r.type}{r.year ? ` · ${r.year}` : ''}</div>
                    <div className="text-xl font-bold text-white group-hover:text-[#FF5C00] transition-colors" style={{ fontFamily: 'var(--font-space-grotesk)' }}>{r.client}</div>
                  </div>
                  <ArrowUpRight size={20} className="text-[#B0B0B0] group-hover:text-[#FF5C00] transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </aside>
      )}
    </main>
  )
}

export async function generateStaticParams() {
  const sanity = await getCaseStudies().catch(() => [])
  const sanityParams = sanity.map((cs) => ({ slug: cs.slug }))
  const staticParams = Object.keys(STATIC_CASE_STUDIES).map((slug) => ({ slug }))
  const seen = new Set<string>()
  return [...sanityParams, ...staticParams].filter(({ slug }) => {
    if (seen.has(slug)) return false
    seen.add(slug)
    return true
  })
}
