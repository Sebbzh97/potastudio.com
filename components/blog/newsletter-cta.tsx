'use client'

import { useState, type FormEvent } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { trackNewsletterSignup } from '@/lib/gtm-events'

interface NewsletterCTAProps {
  /** Where on the site this CTA appears, used for analytics segmentation. */
  location: string
  /** UI locale — drives copy. */
  locale?: 'en' | 'it'
  /** Optional override of the headline copy. */
  headline?: string
  /** Optional override of the subhead copy. */
  subhead?: string
}

const COPY = {
  en: {
    eyebrow: 'Newsletter',
    headline: 'Marketing playbooks. No fluff.',
    subhead:
      'Once a month: a single short email with one tactic, one teardown, one stat — sourced from real client work. Unsubscribe anytime.',
    placeholder: 'you@brand.com',
    cta: 'Subscribe',
    success: 'You’re in. Check your inbox to confirm.',
    consent:
      'By subscribing you agree to receive editorial emails. We never share your address.',
  },
  it: {
    eyebrow: 'Newsletter',
    headline: 'Playbook di marketing. Senza fronzoli.',
    subhead:
      'Una volta al mese: una singola email breve con una tattica, un teardown, un dato — direttamente da lavoro reale con i clienti. Disiscrizione in qualsiasi momento.',
    placeholder: 'tu@brand.com',
    cta: 'Iscriviti',
    success: 'Iscritto. Controlla la inbox per confermare.',
    consent:
      'Iscrivendoti accetti di ricevere email editoriali. Non condividiamo mai il tuo indirizzo.',
  },
} as const

export default function NewsletterCTA({
  location,
  locale = 'en',
  headline,
  subhead,
}: NewsletterCTAProps) {
  const t = COPY[locale]
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.includes('@')) return
    setStatus('submitting')
    // Fire analytics event — wire to Mailchimp / ConvertKit later if needed.
    trackNewsletterSignup({ location })
    // Simulate completion (no PII sent to dataLayer).
    window.setTimeout(() => setStatus('success'), 350)
  }

  return (
    <section
      aria-labelledby={`newsletter-${location}`}
      className="bg-[#0D0D0D] py-16 sm:py-24"
    >
      <div className="container-site">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#141414] px-6 py-12 sm:px-12 sm:py-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(#FFFFFF 1px, transparent 1px), linear-gradient(90deg, #FFFFFF 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }}
            aria-hidden="true"
          />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="flex-1 max-w-xl">
              <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.3em] text-[#FF5C00]">
                {t.eyebrow}
              </span>
              <h2
                id={`newsletter-${location}`}
                className="mb-4 text-3xl font-bold leading-[1.15] text-white text-balance sm:text-4xl"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                {headline ?? t.headline}
              </h2>
              <p className="text-base leading-relaxed text-[#B0B0B0]">
                {subhead ?? t.subhead}
              </p>
            </div>

            <div className="flex-1 lg:max-w-md">
              {status === 'success' ? (
                <div
                  role="status"
                  className="flex items-center gap-3 rounded-lg border border-[#FF5C00]/30 bg-[#FF5C00]/10 px-4 py-4 text-sm text-white"
                >
                  <Check size={18} className="flex-shrink-0 text-[#FF5C00]" aria-hidden="true" />
                  <span>{t.success}</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <label htmlFor={`newsletter-email-${location}`} className="sr-only">
                      Email
                    </label>
                    <input
                      id={`newsletter-email-${location}`}
                      type="email"
                      required
                      autoComplete="email"
                      inputMode="email"
                      placeholder={t.placeholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 rounded-lg border border-white/10 bg-[#0D0D0D] px-4 py-3 text-sm text-white placeholder-[#666] focus:border-[#FF5C00] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5C00]"
                    />
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF5C00] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      {t.cta}
                      <ArrowRight size={14} aria-hidden="true" />
                    </button>
                  </div>
                  <p className="text-xs text-[#666] leading-relaxed">{t.consent}</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
