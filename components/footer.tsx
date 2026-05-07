import Link from 'next/link'
import PartnerBadges from '@/components/partner-badges'
import { LINKEDIN_URL } from '@/lib/constants'

interface FooterLink {
  _key?: string
  label: string
  href: string
}

interface FooterColumn {
  _key?: string
  title: string
  links: FooterLink[]
}

interface SiteSettingsLike {
  footerColumns?: FooterColumn[]
  footerVat?: string
  legalCompanyName?: string
  legalRea?: string
  legalCapital?: string
  legalAddress?: string
  privacyLabel?: string
  privacyHref?: string
  cookieLabel?: string
  cookieHref?: string
}

interface FooterProps {
  locale?: 'en' | 'it'
  settings?: SiteSettingsLike | null
}

// ── Hardcoded fallback (never shown if Sanity has data) ──────────────
const enColumnsFallback: FooterColumn[] = [
  {
    title: 'Services',
    links: [
      { label: 'Social Media Management', href: '/services' },
      { label: 'Paid Advertising',        href: '/services' },
      { label: 'Content Production',      href: '/services' },
      { label: 'Web Design & Dev',        href: '/services' },
      { label: 'Influencer Marketing',    href: '/services' },
      { label: 'Brand Representation',    href: '/services' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About',   href: '/about' },
      { label: 'Work',    href: '/work' },
      { label: 'Clients', href: '/clients' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog',    href: '/blog' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { label: 'Get in Touch', href: '/contact' },
      { label: 'Work With Us', href: '/careers' },
      { label: 'LinkedIn',     href: LINKEDIN_URL },
      { label: 'Instagram',    href: 'https://www.instagram.com/potastudio' },
      { label: 'TikTok',       href: 'https://www.tiktok.com/@potastudio' },
    ],
  },
]

const itColumnsFallback: FooterColumn[] = [
  {
    title: 'Servizi',
    links: [
      { label: 'Social Media Marketing',  href: '/it/services' },
      { label: 'Advertising a Pagamento', href: '/it/services' },
      { label: 'Produzione Contenuti',    href: '/it/services' },
      { label: 'Web Design & Sviluppo',   href: '/it/services' },
      { label: 'Influencer Marketing',    href: '/it/services' },
      { label: 'Brand Representation',    href: '/it/services' },
    ],
  },
  {
    title: 'Azienda',
    links: [
      { label: 'Chi siamo',       href: '/it/about' },
      { label: 'Lavori',          href: '/it/work' },
      { label: 'Clienti',         href: '/it/clients' },
      { label: 'Lavora con noi',  href: '/it/careers' },
      { label: 'Blog',            href: '/it/blog' },
    ],
  },
  {
    title: 'Contatti',
    links: [
      { label: 'Contattaci',     href: '/it/contact' },
      { label: 'Lavora con noi', href: '/it/careers' },
      { label: 'LinkedIn',       href: LINKEDIN_URL },
      { label: 'Instagram',      href: 'https://www.instagram.com/potastudio' },
      { label: 'TikTok',         href: 'https://www.tiktok.com/@potastudio' },
    ],
  },
]

export default function Footer({ locale = 'en', settings }: FooterProps = {}) {
  const isIt = locale === 'it'

  // Resolve all values from Sanity, falling back to safe defaults so the
  // current visual remains unchanged even if the CMS doc is missing.
  const fallbackColumns = isIt ? itColumnsFallback : enColumnsFallback
  const columns: FooterColumn[] =
    settings?.footerColumns && settings.footerColumns.length > 0
      ? settings.footerColumns
      : fallbackColumns

  const vatNumber = settings?.footerVat       ?? 'P.IVA IT04545460166'
  const legalName = settings?.legalCompanyName ?? 'Anyped S.R.L.'
  const rea       = settings?.legalRea         ?? 'REA BG-123456'
  const capital   = settings?.legalCapital     ?? 'Cap. soc. €10.000 i.v.'
  const address   = settings?.legalAddress     ?? 'Via Zanica 85, Bergamo 24126'

  const privacyLabel = settings?.privacyLabel ?? 'Privacy Policy'
  const privacyHref  = settings?.privacyHref  ?? (isIt ? '/it/privacy' : '/privacy')
  const cookieLabel  = settings?.cookieLabel  ?? 'Cookie Policy'
  const cookieHref   = settings?.cookieHref   ?? (isIt ? '/it/cookie' : '/cookie')

  return (
    <footer className="bg-[#0D0D0D] border-t border-white/10 pt-12 sm:pt-16 pb-8">
      <div className="container-site">

        {/* Top row - columns only */}
        <div className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {columns.map((col, i) => (
              <div key={col._key ?? i}>
                <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-widest">
                  {col.title}
                </h4>
                <ul className="flex flex-col gap-2">
                  {(col.links ?? []).map((link, j) => (
                    <li key={link._key ?? j}>
                      <Link
                        href={link.href}
                        className="text-[#B0B0B0] text-sm hover:text-white transition-colors"
                        {...(link.href.startsWith('https') ? {
                          target: '_blank',
                          rel: 'noopener noreferrer',
                          'aria-label': `${link.label} (opens in new tab)`,
                        } : {})}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Partner & certification badges for E-E-A-T */}
        <PartnerBadges locale={locale} />

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Legal details — visible on all viewports */}
          <p className="text-[#666] text-xs leading-relaxed">
            <span className="block sm:inline">{legalName}</span>
            <span className="hidden sm:inline">&nbsp;·&nbsp;</span>
            <span className="block sm:inline">{vatNumber}</span>
            <span className="hidden sm:inline">&nbsp;·&nbsp;</span>
            <span className="block sm:inline">{rea}</span>
            <span className="hidden sm:inline">&nbsp;·&nbsp;</span>
            <span className="block sm:inline">{capital}</span>
            <span className="hidden sm:inline">&nbsp;·&nbsp;</span>
            <span className="block sm:inline">{address}</span>
          </p>
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link href={privacyHref} className="text-[#666] text-xs hover:text-white transition-colors whitespace-nowrap">
              {privacyLabel}
            </Link>
            <Link href={cookieHref} className="text-[#666] text-xs hover:text-white transition-colors whitespace-nowrap">
              {cookieLabel}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
