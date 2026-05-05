'use client'

import { useState, type FormEvent } from 'react'
import { ArrowRight, Check, Download, FileText } from 'lucide-react'
import { trackFileDownload, trackNewsletterSignup } from '@/lib/gtm-events'
import type { LeadMagnetData } from '@/sanity/lib/blog'

interface LeadMagnetBoxProps {
  /** Where on the site this magnet appears, used for analytics segmentation. */
  location: string
  /** UI locale — drives default copy. */
  locale?: 'en' | 'it'
  /**
   * Optional override of the asset filename so analytics can attribute the
   * download to a specific lead magnet variant.
   */
  assetSlug?: string
  /**
   * When provided, Sanity copy overrides the built-in COPY dict.
   * Passed from the RSC page so the client component stays pure.
   */
  data?: LeadMagnetData | null
}

const COPY = {
  en: {
    eyebrow: 'Free Resource',
    headline: 'Marketing Plan Template 2026',
    subhead:
      'Get the same fill-in-the-blank template our team uses on every new client engagement: positioning, channel mix, KPI tree, and a 90-day rollout calendar.',
    socialProof: 'Join 500+ founders getting our playbooks every week.',
    placeholder: 'you@brand.com',
    cta: 'Send me the template',
    success: 'Check your inbox — the template is on its way.',
    downloadCta: 'Download now',
    consent:
      'By submitting you agree to receive editorial emails. We never share your address.',
    badge: 'PDF · 12 pages',
  },
  it: {
    eyebrow: 'Risorsa Gratuita',
    headline: 'Marketing Plan Template 2026',
    subhead:
      'Lo stesso template fill-in-the-blank che usiamo internamente per ogni nuovo cliente: positioning, channel mix, albero dei KPI e calendario di rollout in 90 giorni.',
    socialProof: 'Unisciti a 500+ imprenditori che ricevono i nostri playbook ogni settimana.',
    placeholder: 'tu@brand.com',
    cta: 'Inviami il template',
    success: 'Controlla la inbox: il template sta arrivando.',
    downloadCta: 'Scarica ora',
    consent:
      'Inviando accetti di ricevere email editoriali. Non condividiamo mai il tuo indirizzo.',
    badge: 'PDF · 12 pagine',
  },
} as const

/**
 * Conversion-focused lead magnet card. Differs from `NewsletterCTA` in that:
 *   1. It promises a tangible deliverable (the Marketing Plan Template).
 *   2. It carries social-proof microcopy ("500+ founders…") to lift CVR.
 *   3. Success state surfaces a download button (currently links to a static
 *      PDF placeholder; replace `/downloads/...` with the real asset path
 *      once it's hosted).
 *
 * Analytics: fires `newsletter_signup` (with `signup_location`) on submit and
 * `file_download` when the user clicks the download CTA in the success state.
 */
export default function LeadMagnetBox({
  location,
  locale = 'en',
  assetSlug = 'marketing-plan-template-2026',
  data,
}: LeadMagnetBoxProps) {
  // If Sanity data is available, build a locale-resolved copy object from it;
  // otherwise fall back to the hardcoded COPY dict so the component always works
  // even when Sanity is unreachable.
  const t = data
    ? {
        eyebrow:     (locale === 'it' ? data.eyebrow_it     : undefined) ?? data.eyebrow,
        badge:       (locale === 'it' ? data.badge_it       : undefined) ?? data.badge,
        headline:    (locale === 'it' ? data.headline_it    : undefined) ?? data.headline,
        subhead:     (locale === 'it' ? data.subhead_it     : undefined) ?? data.subhead,
        socialProof: (locale === 'it' ? data.socialProof_it : undefined) ?? data.socialProof,
        placeholder: (locale === 'it' ? data.emailPlaceholder_it : undefined) ?? data.emailPlaceholder,
        cta:         (locale === 'it' ? data.ctaLabel_it    : undefined) ?? data.ctaLabel,
        success:     (locale === 'it' ? data.successMessage_it : undefined) ?? data.successMessage,
        downloadCta: (locale === 'it' ? data.downloadCtaLabel_it : undefined) ?? data.downloadCtaLabel,
        consent:     (locale === 'it' ? data.consentText_it : undefined) ?? data.consentText,
      }
    : COPY[locale]

  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')

  // Use the Sanity PDF asset URL if available, otherwise fall back to the
  // static /downloads/ path.
  const downloadHref = data?.pdfFallbackUrl ?? `/downloads/${assetSlug}.pdf`

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.includes('@')) return
    setStatus('submitting')
    trackNewsletterSignup({ location: `lead_magnet_${location}` })
    // Small delay so users perceive the submission ("submitting" → "success").
    window.setTimeout(() => setStatus('success'), 350)
  }

  function handleDownloadClick() {
    trackFileDownload({
      fileName: `${assetSlug}.pdf`,
      fileType: 'pdf',
      fileCategory: 'lead_magnet',
    })
  }

  return (
    <aside
      aria-labelledby={`lead-magnet-${location}-heading`}
      className="my-12 sm:my-16"
    >
      <div className="relative overflow-hidden rounded-2xl border border-[#FF5C00]/20 bg-gradient-to-br from-[#141414] to-[#0D0D0D] p-6 sm:p-10">
        {/* Decorative grid (purely visual, hidden from AT). */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#FFFFFF 1px, transparent 1px), linear-gradient(90deg, #FFFFFF 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
          aria-hidden="true"
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6 sm:gap-8 items-start">
          {/* Asset visual */}
          <div className="hidden sm:flex flex-shrink-0 h-20 w-20 lg:h-24 lg:w-24 items-center justify-center rounded-xl bg-[#FF5C00]/10 border border-[#FF5C00]/20">
            <FileText size={36} className="text-[#FF5C00]" aria-hidden="true" strokeWidth={1.5} />
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#FF5C00]">
                  {t.eyebrow}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-widest text-[#666] border border-white/10 rounded-full px-2 py-0.5">
                  {t.badge}
                </span>
              </div>

              <h2
                id={`lead-magnet-${location}-heading`}
                className="text-2xl sm:text-3xl font-bold text-white leading-tight text-balance mb-3"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                {t.headline}
              </h2>

              <p className="text-sm sm:text-base text-[#B0B0B0] leading-relaxed text-pretty">
                {t.subhead}
              </p>
            </div>

            {status === 'success' ? (
              <div
                role="status"
                aria-live="polite"
                className="flex flex-col gap-4 rounded-xl border border-[#FF5C00]/30 bg-[#FF5C00]/10 p-5"
              >
                <div className="flex items-center gap-3">
                  <Check size={18} className="flex-shrink-0 text-[#FF5C00]" aria-hidden="true" />
                  <span className="text-sm text-white">{t.success}</span>
                </div>
                <a
                  href={downloadHref}
                  onClick={handleDownloadClick}
                  download
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF5C00] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 self-start"
                >
                  <Download size={14} aria-hidden="true" />
                  {t.downloadCta}
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <label htmlFor={`lead-magnet-email-${location}`} className="sr-only">
                    Email
                  </label>
                  <input
                    id={`lead-magnet-email-${location}`}
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
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF5C00] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 whitespace-nowrap"
                  >
                    {t.cta}
                    <ArrowRight size={14} aria-hidden="true" />
                  </button>
                </div>
                <p className="text-xs text-[#FF5C00]/90 leading-relaxed font-medium">
                  {t.socialProof}
                </p>
                <p className="text-[11px] text-[#666] leading-relaxed">{t.consent}</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
