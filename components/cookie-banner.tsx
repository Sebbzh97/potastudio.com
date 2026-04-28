'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface CookieBannerSettings {
  cookieBannerTitle?: string
  cookieBannerBody?: string
  cookieAcceptLabel?: string
  cookieRejectLabel?: string
  cookieLabel?: string
  cookieHref?: string
  privacyLabel?: string
  privacyHref?: string
}

interface CookieBannerProps {
  settings?: CookieBannerSettings | null
  locale?: 'en' | 'it'
}

export default function CookieBanner({ settings, locale = 'en' }: CookieBannerProps = {}) {
  const [visible, setVisible] = useState(false)
  const isIt = locale === 'it'

  const title = settings?.cookieBannerTitle ?? (isIt ? 'Usiamo i cookie' : 'We use cookies')
  const body =
    settings?.cookieBannerBody ??
    (isIt
      ? 'Usiamo i cookie per migliorare la tua esperienza e per analisi. Consulta la nostra'
      : 'We use cookies to improve your experience and for analytics. See our')
  const acceptLabel = settings?.cookieAcceptLabel ?? (isIt ? 'Accetta tutti' : 'Accept All')
  const rejectLabel = settings?.cookieRejectLabel ?? (isIt ? 'Rifiuta'      : 'Reject')

  const cookieLabel  = settings?.cookieLabel  ?? (isIt ? 'Cookie Policy' : 'Cookie Policy')
  const cookieHref   = settings?.cookieHref   ?? (isIt ? '/it/cookie'    : '/cookie')
  const privacyLabel = settings?.privacyLabel ?? (isIt ? 'Privacy Policy' : 'Privacy Policy')
  const privacyHref  = settings?.privacyHref  ?? (isIt ? '/it/privacy'   : '/privacy')

  const conjunction = isIt ? ' e ' : ' and '

  useEffect(() => {
    const consent = localStorage.getItem('pota_cookie_consent')
    if (!consent) {
      setTimeout(() => setVisible(true), 1500)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('pota_cookie_consent', 'accepted')
    window.dispatchEvent(new Event('pota_consent_change'))
    setVisible(false)
  }

  const reject = () => {
    localStorage.setItem('pota_cookie_consent', 'rejected')
    window.dispatchEvent(new Event('pota_consent_change'))
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] bg-[#141414] border-t border-white/10 shadow-2xl"
      role="region"
      aria-label="Cookie consent"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-white text-sm font-medium mb-1">{title}</p>
          <p className="text-[#B0B0B0] text-xs leading-relaxed">
            {body}{' '}
            <Link href={cookieHref} className="text-[#FF5C00] underline underline-offset-2 hover:text-[#e04f00]">
              {cookieLabel}
            </Link>
            {conjunction}
            <Link href={privacyHref} className="text-[#FF5C00] underline underline-offset-2 hover:text-[#e04f00]">
              {privacyLabel}
            </Link>.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto shrink-0">
          <button
            onClick={reject}
            className="px-4 py-2.5 text-xs font-medium text-[#B0B0B0] border border-white/20 rounded hover:border-white/40 hover:text-white transition-colors min-h-[44px]"
          >
            {rejectLabel}
          </button>
          <button
            onClick={accept}
            className="px-4 py-2.5 text-xs font-medium bg-[#FF5C00] text-white rounded hover:bg-[#e04f00] transition-colors min-h-[44px]"
          >
            {acceptLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
