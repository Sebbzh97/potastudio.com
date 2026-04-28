'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import type { SanityTestimonial } from '@/sanity/lib/page-queries'

// Static fallbacks — real testimonials with both languages
const FALLBACK: SanityTestimonial[] = [
  {
    _id: 'fallback-1',
    quote: 'Working with Pota Studio was a turning point. They not only elevated our branding with impeccable communication, but revolutionized our workflow by implementing custom AI processes that dramatically cut our operational time. Rare professionals who combine creative vision with technical pragmatism.',
    quoteIt: 'Collaborare con Pota Studio e stato un punto di svolta. Non solo hanno elevato il nostro branding con una comunicazione impeccabile, ma hanno rivoluzionato il nostro workflow implementando processi AI su misura che hanno abbattuto i tempi operativi. Professionisti rari, capaci di unire visione creativa e pragmatismo tecnico.',
    author: 'Alexandru Birleanu',
    role: 'Founder',
    company: 'Lavamelotu',
    rating: 5,
    featured: true,
  },
  {
    _id: 'fallback-2',
    quote: 'Pota Studio, with Sebastian, supported us in creating the introductory video for Sound & Buzz Srl for Expo Osaka 2025. He quickly understood the project and its objectives, transforming them into high-level content. Always precise, professional and engaged. An effective collaboration that we recommend for quality, reliability and genuine dedication.',
    quoteIt: "Pota Studio, con Sebastian, ci ha supportati nella realizzazione del video introduttivo per Sound & Buzz Srl in occasione dell'Expo di Osaka 2025. Ha compreso rapidamente il progetto e i suoi obiettivi, trasformandoli in un contenuto di alto livello. Sempre preciso, professionale e coinvolto. Una collaborazione efficace che consigliamo per qualita, affidabilita e reale dedizione al progetto.",
    author: 'Walter Setti',
    role: 'CEO',
    company: 'Sound and Buzz SRL',
    rating: 5,
    featured: true,
  },
  {
    _id: 'fallback-3',
    quote: 'The marketing world is a sea full of pirates, and in my opinion Pota Studio is a safe harbor. Thank you Sebastian for the dedication you put into your work.',
    quoteIt: "Il mondo del marketing e un mare pieno di pirati e a mio avviso Pota Studio e un porto sicuro. Grazie Sebastian per l'impegno che metti nel tuo lavoro.",
    author: 'Michele Eleodori',
    role: 'Founder',
    company: 'Marit SRL',
    rating: 5,
    featured: true,
  },
]

interface Props {
  testimonials?: SanityTestimonial[]
  locale?: 'en' | 'it'
}

export default function Testimonials({ testimonials, locale }: Props) {
  const isIt = locale === 'it'
  const items = testimonials && testimonials.length > 0 ? testimonials : FALLBACK
  const [active, setActive] = useState(0)

  const prev = () => setActive((a) => (a === 0 ? items.length - 1 : a - 1))
  const next = () => setActive((a) => (a === items.length - 1 ? 0 : a + 1))

  const current = items[active]
  // Use Italian quote if available and locale is Italian, otherwise English
  const displayQuote = isIt && current.quoteIt ? current.quoteIt : current.quote
  const sectionLabel = isIt ? 'Cosa dicono i clienti' : 'What clients say'

  return (
    <section className="py-16 sm:py-24 bg-[#0D0D0D] border-t border-white/10">
      <div className="container-site" style={{ maxWidth: '64rem' }}>
        <span className="text-xs font-semibold text-[#FF5C00] uppercase tracking-[0.3em] mb-8 sm:mb-12 block text-center">
          {sectionLabel}
        </span>

        {/* Card */}
        <div className="relative bg-[#141414] border border-white/10 rounded-xl p-6 sm:p-8 md:p-12">
          {/* Orange quote mark */}
          <span
            className="absolute top-4 right-5 sm:top-6 sm:right-8 text-6xl sm:text-8xl font-bold text-[#FF5C00] opacity-20 select-none leading-none pointer-events-none"
            aria-hidden="true"
          >
            &ldquo;
          </span>

          <blockquote className="text-lg sm:text-xl md:text-2xl font-medium text-white leading-relaxed mb-6 sm:mb-8 relative z-10 font-sans">
            &ldquo;{displayQuote}&rdquo;
          </blockquote>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Avatar — photo if available, initial fallback otherwise */}
            <div className="w-10 h-10 rounded-full bg-[#FF5C00] flex items-center justify-center flex-shrink-0 overflow-hidden">
              {current.avatarUrl ? (
                <Image
                  src={current.avatarUrl}
                  alt={`${current.author}${current.role ? `, ${current.role}` : ''}`}
                  width={40}
                  height={40}
                  className="object-cover object-center w-full h-full"
                  style={{ width: '100%', height: '100%' }}
                />
              ) : (
                <span className="text-white font-bold text-sm">
                  {current.author[0]}
                </span>
              )}
            </div>

            <div>
              <p className="text-white font-semibold text-sm">{current.author}</p>
              {(current.role || current.company) && (
                <p className="text-[#B0B0B0] text-xs">
                  {[current.role, current.company].filter(Boolean).join(', ')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation — only show if more than one testimonial */}
        {items.length > 1 && (
          <div className="flex items-center justify-center gap-4 mt-6 sm:mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-[#FF5C00] hover:text-[#FF5C00] active:border-[#FF5C00] active:text-[#FF5C00] transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-2 rounded-full transition-all duration-200 ${
                    i === active ? 'bg-[#FF5C00] w-6' : 'bg-white/30 w-2'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-[#FF5C00] hover:text-[#FF5C00] active:border-[#FF5C00] active:text-[#FF5C00] transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
