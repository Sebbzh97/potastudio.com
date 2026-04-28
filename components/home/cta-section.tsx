import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

function clean(text: string) {
  return text.replace(/ — /g, '. ').replace(/—/g, ' ')
}

export default function CtaSection({ data, locale = 'en' }: { data?: any; locale?: 'en' | 'it' }) {
  const headline    = clean(data?.ctaSectionHeadline    ?? (locale === 'it' ? 'Un\'agenzia. Ogni canale. Zero scuse.' : 'One agency. Every channel. Zero excuses.'))
  const body        = clean(data?.ctaSectionBody        ?? (locale === 'it'
    ? 'Se il tuo brand merita di essere visto su Google, su TikTok e su ogni schermo che guarda il tuo cliente, siamo il team che lo fa succedere. Nessun rimbalzo, nessuna scusa, nessuna sorpresa da junior.'
    : 'If your brand deserves to be seen on Google, on TikTok, on every screen your customer looks at, we are the team that makes it happen. No handoffs, no excuses, no junior surprises.'))
  const buttonLabel = clean(data?.ctaSectionButtonLabel ?? (locale === 'it' ? 'Inizia un progetto con noi →' : 'Start a project with us →'))
  const contactHref = locale === 'it' ? '/it/contact' : '/contact'
  return (
    <section className="py-24 sm:py-32 bg-[#FFC629] relative overflow-hidden">
      {/* Subtle grain on yellow */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(#0D0D0D 1px, transparent 1px), linear-gradient(90deg, #0D0D0D 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />

      <div className="relative container-site text-center" style={{ maxWidth: '72rem' }}>
        <span className="text-xs font-bold text-[#FF5C00] uppercase tracking-[0.3em] mb-6 block">
          Start a project
        </span>
        <h2
          className="font-bold text-[#0D0D0D] leading-none mb-4 text-balance"
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: 'clamp(2.5rem, 6vw, 7rem)',
          }}
        >
          {headline}
        </h2>
        <p className="text-base sm:text-xl text-[#0D0D0D]/60 mb-10 sm:mb-12">
          {body}
        </p>
        <Link
          href={contactHref}
          className="inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-[#0D0D0D] text-white text-base sm:text-lg font-bold rounded transition-all duration-200 hover:bg-[#1a1a1a] hover:shadow-[0_0_40px_rgba(0,0,0,0.4)] group"
        >
          {buttonLabel}
          <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  )
}

