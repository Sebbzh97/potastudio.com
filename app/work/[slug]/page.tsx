import type { Metadata } from 'next'
import React from 'react'
import CaseStudyGallery from '@/components/media/case-study-gallery'
import type { GalleryItem } from '@/components/media/lightbox'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, BarChart2, TrendingUp, Users } from 'lucide-react'
import { JsonLd } from '@/components/json-ld'
import {
  getCaseStudyBySlug,
  getCaseStudies,
  type SanityCaseStudy,
} from '@/sanity/lib/page-queries'

// ── Static fallback data ───────────────────────────────────────────────────────

type StaticCS = {
  client: string; type: string; tags: string[]; year: string
  bg: string; accent: string; challenge: string; approach: string; results: string
  metrics: { label: string; value: string }[]; relatedSlugs: string[]
}

const STATIC_CASE_STUDIES: Record<string, StaticCS> = {
  'samsung-tiktok': {
    client: 'Samsung', type: 'ADS', tags: ['TikTok Ads', 'Meta ADS', 'Performance'],
    year: '2023', bg: '#00001A', accent: '#1428A0',
    challenge: 'Samsung Italy needed to launch the Galaxy S24 series with measurable impact on a younger demographic across 5 European markets simultaneously.',
    approach: 'We architected a full-funnel campaign on TikTok and Meta with 24 unique creative assets tested across 6 audience segments.',
    results: 'The campaign delivered 340% ROAS across all markets. Samsung renewed the engagement for the next 3 product launches.',
    metrics: [
      { label: 'ROAS', value: '+340%' }, { label: 'Markets Covered', value: '5' },
      { label: 'Creative Variants', value: '24' }, { label: 'CPM Reduction', value: '-38%' },
    ],
    relatedSlugs: ['isybank-ads'],
  },
  'isybank-ads': {
    client: 'Isybank', type: 'ADS', tags: ['Meta ADS', 'Lead Gen', 'Fintech'],
    year: '2022', bg: '#001A1A', accent: '#00C8FF',
    challenge: 'Isybank, a new digital bank by Intesa Sanpaolo, needed to acquire app users at scale while keeping CPL under control in a highly competitive fintech market.',
    approach: 'We built a granular audience segmentation model across Meta, ran creative rotation every 7 days, and deployed a landing page A/B testing framework with 12 simultaneous variants.',
    results: "CPL dropped 62% in 90 days. App installs exceeded targets by 180%. The campaign became an internal case study for Intesa Sanpaolo's digital marketing team.",
    metrics: [
      { label: 'CPL Reduction', value: '-62%' }, { label: 'Install Target Hit', value: '+180%' },
      { label: 'Landing Page Variants', value: '12' }, { label: 'Campaign Duration', value: '90 days' },
    ],
    relatedSlugs: ['samsung-tiktok'],
  },
}

const STATIC_GALLERY: Record<string, GalleryItem[]> = {
  'samsung-tiktok': [
    { id: 'g1', mediaType: 'photo', src: 'https://images.unsplash.com/photo-1611186871525-6e7aabf96c6a?w=800&q=80', caption: 'Galaxy S24 launch creative: Italy market' },
    { id: 'g2', mediaType: 'video', src: 'https://images.unsplash.com/photo-1579869847514-7c1a19d2d2ad?w=800&q=80', caption: 'UGC-style hero ad: best performing variant', videoSource: 'youtube', youtubeId: 'dQw4w9WgXcQ' },
    { id: 'g3', mediaType: 'photo', src: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80', caption: 'TikTok ad storyboard grid' },
  ],

  'isybank-ads': [
    { id: 'g1', mediaType: 'photo', src: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80', caption: 'Meta ad creative: best performing variant' },
    { id: 'g2', mediaType: 'video', src: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80', caption: 'App install campaign video', videoSource: 'youtube', youtubeId: 'dQw4w9WgXcQ' },
    { id: 'g3', mediaType: 'photo', src: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80', caption: 'Landing page A/B variant: winner' },
  ],
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function toStaticShape(cs: SanityCaseStudy): StaticCS {
  return {
    client: cs.client,
    type: cs.type ?? '',
    tags: cs.tags ?? [],
    year: cs.year ?? '',
    bg: cs.bg ?? '#111111',
    accent: cs.accent ?? '#FF5C00',
    challenge: cs.challenge ?? '',
    approach: cs.approach ?? '',
    results: cs.results ?? '',
    metrics: cs.metrics ?? [],
    relatedSlugs: cs.relatedSlugs ?? [],
  }
}

function generateCaseStudySchema(slug: string, cs: StaticCS) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    articleType: 'CaseStudy',
    headline: `${cs.client}: ${cs.type} Case Study`,
    description: cs.results,
    datePublished: `${cs.year}-01-01`,
    author: { '@type': 'Organization', name: 'Pota Studio', url: 'https://potastudio.com' },
    publisher: {
      '@type': 'Organization', name: 'Pota Studio', url: 'https://potastudio.com',
      logo: { '@type': 'ImageObject', url: 'https://potastudio.com/logo.png' },
    },
    about: { '@type': 'Organization', name: cs.client },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://potastudio.com/work/${slug}` },
    keywords: cs.tags.join(', '),
    inLanguage: 'en',
  }
}

interface CaseStudySection { icon: React.ReactElement; title: string; body: string }

type Props = { params: Promise<{ slug: string }> }

// ── Metadata ───────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const sanity = await getCaseStudyBySlug(slug)
  const cs = sanity ? toStaticShape(sanity) : STATIC_CASE_STUDIES[slug]
  if (!cs) return { title: 'Case study not found' }
  return {
    title: `${cs.client} Case Study | Pota Studio`,
    description: (cs.challenge || cs.results).slice(0, 160),
    alternates: {
      canonical: `https://potastudio.com/work/${slug}`,
      languages: {
        en: `https://potastudio.com/work/${slug}`,
        it: `https://potastudio.com/it/work/${slug}`,
        'x-default': `https://potastudio.com/work/${slug}`,
      },
    },
    openGraph: {
      type: 'website',
      title: `${cs.client} Case Study | Pota Studio`,
      description: (cs.challenge || cs.results).slice(0, 160),
      url: `https://potastudio.com/work/${slug}`,
      siteName: 'Pota Studio',
    },
  }
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const sanity = await getCaseStudyBySlug(slug)
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

  // Build related - resolve from Sanity list OR static map
  const allSanity = sanity ? await getCaseStudies() : []
  const relatedItems = (cs?.relatedSlugs ?? []).map((rslug) => {
    const fromSanity = allSanity.find((s) => s.slug === rslug)
    if (fromSanity) return { slug: rslug, client: fromSanity.client, type: fromSanity.type ?? '', year: fromSanity.year ?? '', accent: fromSanity.accent ?? '#FF5C00' }
    const fromStatic = STATIC_CASE_STUDIES[rslug]
    if (fromStatic) return { slug: rslug, client: fromStatic.client, type: fromStatic.type, year: fromStatic.year, accent: fromStatic.accent }
    return null
  }).filter(Boolean) as { slug: string; client: string; type: string; year: string; accent: string }[]

  if (!cs) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            Case study not found
          </h1>
          <Link href="/work" className="text-[#FF5C00] hover:underline">Back to Work</Link>
        </div>
      </main>
    )
  }

  return (
    <main>
      <JsonLd data={generateCaseStudySchema(slug, cs)} />

      {/* Hero */}
      <section className="pt-40 pb-24 relative overflow-hidden" style={{ background: cs.bg }}>
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: cs.accent }} />
        <div className="container-site relative">
          <Link href="/work" className="inline-flex items-center gap-2 text-sm text-[#B0B0B0] hover:text-white transition-colors mb-10">
            <ArrowLeft size={14} />
            All Work
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {cs.tags.map((t) => (
              <span key={t} className="text-xs font-medium px-3 py-1 bg-white/10 rounded-full text-[#B0B0B0]">{t}</span>
            ))}
            {cs.year && <span className="text-xs text-[#B0B0B0]">{cs.year}</span>}
          </div>
          <h1
            className="font-bold text-white leading-none mb-6 text-balance"
            style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 'clamp(3rem, 8vw, 8rem)' }}
          >
            {cs.client}
          </h1>
        </div>
      </section>

      {/* Metrics bar */}
      {cs.metrics.length > 0 && (
        <div className="bg-[#141414] border-b border-white/10">
          <div className="container-site py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:divide-x md:divide-white/10">
              {cs.metrics.map((m) => (
                <div key={m.label} className="flex flex-col gap-1 md:px-8 first:pl-0">
                  <span className="text-4xl font-bold" style={{ fontFamily: 'var(--font-space-grotesk)', color: cs.accent }}>
                    {m.value}
                  </span>
                  <span className="text-xs text-[#B0B0B0] uppercase tracking-widest">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <section className="py-24 bg-[#0D0D0D]">
        <div className="container-site" style={{ maxWidth: '56rem' }}>
          <div className="flex flex-col gap-16">
            {([
              { icon: <BarChart2 size={20} />, title: 'The Challenge', body: cs.challenge },
              { icon: <TrendingUp size={20} />, title: 'Our Approach', body: cs.approach },
              { icon: <Users size={20} />, title: 'The Results', body: cs.results },
            ] as CaseStudySection[]).filter((s) => s.body).map((section) => (
              <div key={section.title}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-[#FF5C00]">{section.icon}</div>
                  <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                    {section.title}
                  </h2>
                </div>
                <p className="text-[#B0B0B0] text-lg leading-relaxed pl-9">{section.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube Video Embed */}
      {sanity?.youtubeVideoId && (
        <section className="py-16 bg-[#0D0D0D]">
          <div className="container-site" style={{ maxWidth: '56rem' }}>
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${sanity.youtubeVideoId}?rel=0`}
                title={`${cs.client} video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </section>
      )}

      {/* Media Gallery */}
      <CaseStudyGallery items={gallery} />

      {/* Related work */}
      {relatedItems.length > 0 && (
        <section className="py-16 bg-[#141414] border-t border-white/10">
          <div className="container-site">
            <h3 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              More Work
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedItems.map((r) => (
                <Link
                  key={r.slug}
                  href={`/work/${r.slug}`}
                  className="group flex items-center justify-between p-6 bg-[#0D0D0D] border border-white/10 rounded-xl hover:border-[#FF5C00]/40 transition-all"
                >
                  <div>
                    <div className="text-xs text-[#B0B0B0] mb-1">{r.type}{r.year ? ` · ${r.year}` : ''}</div>
                    <div className="text-xl font-bold text-white group-hover:text-[#FF5C00] transition-colors" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                      {r.client}
                    </div>
                  </div>
                  <ArrowUpRight size={20} className="text-[#B0B0B0] group-hover:text-[#FF5C00] transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

// Generate static params from both Sanity + static fallback slugs
export async function generateStaticParams() {
  const sanity = await getCaseStudies().catch(() => [])
  const sanityParams = sanity.map((cs) => ({ slug: cs.slug }))
  const staticParams = Object.keys(STATIC_CASE_STUDIES).map((slug) => ({ slug }))
  // Deduplicate
  const seen = new Set<string>()
  return [...sanityParams, ...staticParams].filter(({ slug }) => {
    if (seen.has(slug)) return false
    seen.add(slug)
    return true
  })
}
