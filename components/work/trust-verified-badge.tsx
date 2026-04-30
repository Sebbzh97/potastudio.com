import Image from 'next/image'
import { ShieldCheck } from 'lucide-react'

interface TrustVerifiedBadgeProps {
  /** ISO locale — drives the visible copy. Defaults to 'en'. */
  locale?: 'en' | 'it'
  /** When true, renders compact one-line variant. */
  compact?: boolean
  /** Optional override for the secondary line under the headline. */
  subline?: string
}

const COPY = {
  en: {
    headline: 'Verified by Pota Studio',
    subline: 'Results audited and approved by our in-house performance team.',
    logoAlt: 'Pota Studio logo',
    badge: 'Verified',
  },
  it: {
    headline: 'Verificato da Pota Studio',
    subline: 'Risultati verificati e approvati dal nostro team performance interno.',
    logoAlt: 'Logo Pota Studio',
    badge: 'Verificato',
  },
} as const

/**
 * "Verified by Pota Studio" trust badge.
 *
 * UX role: visible reassurance that the numbers above were audited by Pota's
 * in-house team (counterpart to the GEO-Local trust signals in the footer).
 *
 * SEO role: schema.org microdata pointing back to the Organization graph
 * already declared in the global JSON-LD — gives crawlers a third
 * convergent signal that this page's KPIs are first-party.
 */
export default function TrustVerifiedBadge({
  locale = 'en',
  compact = false,
  subline,
}: TrustVerifiedBadgeProps) {
  const copy = COPY[locale]
  return (
    <aside
      aria-label={copy.headline}
      className="trust-verified-badge inline-flex items-center gap-3 rounded-full border border-[#FF5C00]/30 bg-[#FF5C00]/5 px-4 py-2"
      itemScope
      itemType="https://schema.org/Organization"
    >
      {/* Logo — references app/icon.png served at /icon.png */}
      <span className="relative flex-none h-7 w-7 overflow-hidden rounded-full ring-1 ring-[#FF5C00]/40">
        <Image
          src="/icon.png"
          alt={copy.logoAlt}
          width={28}
          height={28}
          className="object-cover"
          itemProp="logo"
        />
      </span>
      <ShieldCheck
        size={16}
        aria-hidden="true"
        className="text-[#FF5C00] flex-none"
      />
      <div className="flex flex-col leading-tight">
        <strong
          className="text-sm font-semibold text-white"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          <span itemProp="name">{copy.headline}</span>
        </strong>
        {!compact && (
          <span className="text-xs text-[#B0B0B0] mt-0.5">
            {subline ?? copy.subline}
          </span>
        )}
      </div>
      {/* Hidden machine-readable URL pointing to the Organization graph node */}
      <link itemProp="url" href="https://www.potastudio.com/" />
    </aside>
  )
}
