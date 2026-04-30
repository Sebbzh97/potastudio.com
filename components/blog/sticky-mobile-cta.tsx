'use client'

import Link from 'next/link'
import { ArrowRight, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { trackCTAClick } from '@/lib/gtm-events'

interface StickyMobileCtaProps {
  /** UI locale — drives copy + destination. */
  locale?: 'en' | 'it'
  /** Used for GTM `cta_location` segmentation. */
  location?: string
  /** Pixels of vertical scroll required before the bar appears. */
  showAfterPx?: number
}

const COPY = {
  en: {
    label: 'Got a project? Talk to us.',
    cta: "Let's Talk",
    dismiss: 'Dismiss CTA',
  },
  it: {
    label: 'Hai un progetto? Parliamone.',
    cta: 'Parliamone',
    dismiss: 'Chiudi CTA',
  },
} as const

const DISMISS_KEY = 'pota:sticky-cta:dismissed'

/**
 * Mobile-only sticky bar that nudges blog readers toward the contact form
 * once they've engaged with the article. Behaviour:
 *   - Only renders below the `md` breakpoint (≤767 px).
 *   - Stays hidden until the user has scrolled `showAfterPx` (default 600 px).
 *   - Respects an explicit dismiss action (sessionStorage-scoped, so it does
 *     not pester users on every page within a single session).
 *   - Uses backdrop-blur so it sits on top of content without obscuring it.
 *   - Fires a `cta_click` analytics event when tapped.
 */
export default function StickyMobileCta({
  locale = 'en',
  location = 'blog_post_mobile',
  showAfterPx = 600,
}: StickyMobileCtaProps) {
  const t = COPY[locale]
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Honor previous-session dismissal so we never harass repeat readers.
    if (window.sessionStorage?.getItem(DISMISS_KEY) === '1') {
      setDismissed(true)
      return
    }

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY || window.pageYOffset || 0
        setVisible(y > showAfterPx)
        ticking = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [showAfterPx])

  if (dismissed) return null

  const targetUrl = locale === 'it' ? '/it/contact' : '/contact'

  function handleClick() {
    trackCTAClick({ ctaText: t.cta, ctaLocation: location, targetUrl })
  }

  function handleDismiss() {
    setDismissed(true)
    if (typeof window !== 'undefined') {
      window.sessionStorage?.setItem(DISMISS_KEY, '1')
    }
  }

  return (
    <div
      role="region"
      aria-label="Contact"
      className={[
        'md:hidden fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(env(safe-area-inset-bottom),12px)] pt-3',
        'transition-transform duration-300 ease-out',
        visible ? 'translate-y-0' : 'translate-y-[120%]',
      ].join(' ')}
    >
      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#0D0D0D]/85 backdrop-blur-md px-3 py-2.5 shadow-2xl shadow-black/50">
        <span className="flex-1 text-[13px] text-white/90 leading-snug truncate">
          {t.label}
        </span>
        <Link
          href={targetUrl}
          onClick={handleClick}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF5C00] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 whitespace-nowrap"
        >
          {t.cta}
          <ArrowRight size={13} aria-hidden="true" />
        </Link>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label={t.dismiss}
          className="flex-shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#B0B0B0] hover:text-white hover:bg-white/5 transition-colors"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
