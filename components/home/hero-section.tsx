import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import CyclingWord from './cycling-word'

type HeroData = {
  heroLabel?: string
  heroHeadlinePrefix?: string
  heroCyclingWords?: string[]
  heroAccentLine?: string
  heroHeadlineSuffix?: string
  heroSubheadline?: string
  heroMarqueeClients?: string[]
  heroCta1Label?: string
  heroCta1Href?: string
  heroCta2Label?: string
  heroCta2Href?: string
}

export default function HeroSection({ data, locale }: { data?: HeroData; locale?: 'en' | 'it' }) {
  const isIt = locale === 'it'

  const heroLabel   = data?.heroLabel          ?? ''
  const prefix      = data?.heroHeadlinePrefix ?? (isIt ? 'Rendiamo' : 'We make')
  const cyclingWords = data?.heroCyclingWords && data.heroCyclingWords.length > 0
    ? data.heroCyclingWords
    : (isIt ? ['brand', 'eventi', 'ADS', 'social', 'video', 'foto'] : ['brands', 'events', 'ADS', 'social', 'video', 'photo'])
  const accentLine  = data?.heroAccentLine     ?? (isIt ? 'impossibili' : 'impossible')
  const suffix      = data?.heroHeadlineSuffix ?? (isIt ? 'da ignorare.' : 'to ignore.')
  const subheadline = data?.heroSubheadline    ?? ''
  const marqueeClients = data?.heroMarqueeClients && data.heroMarqueeClients.length > 0
    ? data.heroMarqueeClients
    : ['SAMSUNG', 'ISYBANK', 'COOKIES DIGITAL', 'HAVIT']
  const cta1Label = data?.heroCta1Label ?? (isIt ? 'Vedi i nostri lavori' : 'See Our Work')
  const cta1Href  = data?.heroCta1Href  ?? (isIt ? '/it/work' : '/work')
  const cta2Label = data?.heroCta2Label ?? (isIt ? 'Il team' : 'Meet the Team')
  const cta2Href  = data?.heroCta2Href  ?? (isIt ? '/it/about' : '/about')

  return (
    <section className="relative min-h-[100svh] flex flex-col bg-[#0D0D0D] overflow-hidden">
      {/* Solid dark background — the previous reel video was replaced
          with a flat black canvas + dual glow so the LCP element is the
          hero headline itself, which is the fastest possible LCP. */}
      <div className="absolute inset-0 bg-[#0D0D0D]" aria-hidden="true" />

      {/* Yellow+orange dual glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[800px] xl:w-[1000px] h-[500px] sm:h-[800px] xl:h-[1000px] rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FFC629 0%, #FF5C00 40%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="container-site relative pt-24 sm:pt-32 pb-8 flex-1 flex flex-col justify-center">
        {heroLabel && <span className="sr-only">{heroLabel}</span>}

        <h1
          className="font-bold leading-[0.9] tracking-tight text-white mb-6 sm:mb-8 text-balance break-words"
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: 'clamp(3rem, 9vw, 9rem)',
          }}
        >
          {prefix}{' '}
          <span
            style={{ display: 'inline', verticalAlign: 'baseline' }}
            aria-live="polite"
            aria-atomic="true"
          >
            <CyclingWord words={cyclingWords} />
          </span>
          <br />
          <span className="text-[#FFC629]">{accentLine}</span>
          <br />
          {suffix}
        </h1>

        {subheadline && (
          <p className="text-base sm:text-lg xl:text-xl text-white/70 max-w-2xl 2xl:max-w-3xl leading-relaxed mb-8 sm:mb-10">
            {subheadline}
          </p>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <Link
            href={cta1Href}
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 bg-[#FFC629] text-[#0D0D0D] font-bold rounded transition-all duration-200 hover:bg-[#e6b320] hover:shadow-[0_0_30px_rgba(255,198,41,0.45)] active:bg-[#e6b320] group text-sm sm:text-base"
          >
            {cta1Label}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1 flex-shrink-0" />
          </Link>
          <Link
            href={cta2Href}
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 border border-white/30 text-white font-semibold rounded transition-all duration-200 hover:border-white hover:bg-white/5 active:bg-white/10 text-sm sm:text-base"
          >
            {cta2Label}
          </Link>
        </div>
      </div>

      {/* Marquee ticker */}
      <div className="relative mt-12 sm:mt-16 border-t border-b border-white/10 py-3.5 sm:py-4 overflow-hidden bg-black/40 backdrop-blur-sm w-full" aria-hidden="true">
        <div className="flex gap-8 sm:gap-12 animate-marquee whitespace-nowrap">
          {[...marqueeClients, ...marqueeClients, ...marqueeClients, ...marqueeClients].map((c, i) => (
            <span
              key={i}
              className="text-xs sm:text-sm font-semibold tracking-[0.3em] text-[#B0B0B0] uppercase flex items-center gap-8 sm:gap-12 flex-shrink-0"
            >
              {c}
              <span
                className="text-lg sm:text-xl"
                style={{ color: i % 2 === 0 ? '#FFC629' : '#FF5C00' }}
              >*</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
