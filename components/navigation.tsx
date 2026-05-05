'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown } from 'lucide-react'

// ── Static nav data ────────────────────────────────────────────────

const navLinksEn = [
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'All Services', href: '/services' },
      { label: 'Coming Soon', href: null, isSoon: true },
    ],
  },
  { label: 'Work', href: '/work' },
  {
    label: 'About',
    href: '/about',
    children: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
    ],
  },
  { label: 'Blog', href: '/blog' },
]

const navLinksIt = [
  {
    label: 'Servizi',
    href: '/it/services',
    children: [
      { label: 'Tutti i servizi', href: '/it/services' },
      { label: 'In Arrivo', href: null, isSoon: true },
    ],
  },
  { label: 'Lavori', href: '/it/work' },
  {
    label: 'Chi siamo',
    href: '/it/about',
    children: [
      { label: 'Chi siamo', href: '/it/about' },
      { label: 'Lavora con noi', href: '/it/careers' },
    ],
  },
  { label: 'Blog', href: '/it/blog' },
]

// ── Coming Soon dropdown content ───────────────────────────────────

interface ComingSoonItem {
  title: string
  description?: string
  icon?: string // 'courses' | 'play' | 'calendar'
}

interface ComingSoonProps {
  header?: string
  footer?: string
  badge?: string
  items?: ComingSoonItem[]
}

function CSIcon({ icon }: { icon?: string }) {
  if (icon === 'play') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF5C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" fill="#FF5C00" stroke="none" />
      </svg>
    )
  }
  if (icon === 'calendar') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF5C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    )
  }
  // default: courses (mortarboard)
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF5C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  )
}

const fallbackComingSoon: Required<ComingSoonProps> = {
  header: 'In Arrivo',
  footer: 'Nuove funzionalità in arrivo nel 2026.',
  badge: 'Soon',
  items: [
    { title: 'Corsi', description: 'Formazione professionale su social media, TikTok e digital marketing.', icon: 'courses' },
    { title: 'YouTube per Aziende', description: 'Strategie, produzione e distribuzione video per brand e PMI.', icon: 'play' },
    { title: 'Eventi', description: 'Workshop, masterclass ed eventi live pensati per creator e brand.', icon: 'calendar' },
  ],
}

function ComingSoonDropdown({ header, footer, badge, items }: ComingSoonProps = {}) {
  const finalHeader = header || fallbackComingSoon.header
  const finalFooter = footer || fallbackComingSoon.footer
  const finalBadge = badge || fallbackComingSoon.badge
  const finalItems = items && items.length > 0 ? items : fallbackComingSoon.items

  return (
    <div className="bg-[#111] border border-[#222] rounded-2xl p-5 min-w-[260px] shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
      <p className="text-[11px] tracking-[0.15em] text-[#888] uppercase mb-3">{finalHeader}</p>
      <div className="flex flex-col gap-3">
        {finalItems.map((item) => (
          <div key={item.title} className="relative bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[rgba(255,92,0,0.1)] flex items-center justify-center flex-shrink-0 mt-0.5">
              <CSIcon icon={item.icon} />
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-bold mb-0.5">{item.title}</p>
              {item.description && (
                <p className="text-[#888] text-xs leading-snug">{item.description}</p>
              )}
            </div>
            <span className="absolute top-2.5 right-3 text-[9px] tracking-widest uppercase bg-[rgba(255,92,0,0.15)] border border-[rgba(255,92,0,0.3)] text-[#FF5C00] px-1.5 py-0.5 rounded-full">{finalBadge}</span>
          </div>
        ))}
      </div>
      <p className="text-[#B0B0B0] text-xs italic mt-3 pt-3 border-t border-[#222]">{finalFooter}</p>
    </div>
  )
}

// ── Desktop dropdown wrapper ───────────────────────────────────────

interface DesktopDropdownProps {
  label: string
  href: string
  children: { label: string; href: string | null; isLive?: boolean; isSoon?: boolean }[]
  isActive: boolean
  comingSoon?: ComingSoonProps
}

function DesktopDropdown({ label, href, children, isActive, comingSoon }: DesktopDropdownProps) {
  const [open, setOpen] = useState(false)
  const [comingSoonOpen, setComingSoonOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const closeMenu = () => {
    closeTimer.current = setTimeout(() => {
      setOpen(false)
      setComingSoonOpen(false)
    }, 120)
  }

  return (
    <div className="relative" onMouseEnter={openMenu} onMouseLeave={closeMenu}>
      {/* Parent link with subtle indicator */}
      <Link
        href={href}
        className={`flex items-center gap-1 text-sm font-medium tracking-wide transition-colors duration-200 whitespace-nowrap ${
          isActive ? 'text-[#FFC629]' : 'text-[#B0B0B0] hover:text-white'
        }`}
      >
        {label}
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 opacity-40 mt-px ${open ? 'rotate-180' : ''}`}
        />
      </Link>

      {/* Dropdown panel */}
      <div
        className="absolute top-[calc(100%+8px)] left-0 z-50 transition-all duration-200 origin-top-left"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? 'scale(1) translateY(0)' : 'scale(0.97) translateY(-4px)',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        {/* Arrow pointer */}
        <div className="absolute -top-1.5 left-4 w-3 h-3 bg-[#161616] border-l border-t border-[#2A2A2A] rotate-45" />

        <div className="relative bg-[#161616] border border-[#2A2A2A] rounded-xl pt-3 pb-2 min-w-[200px] shadow-[0_16px_48px_rgba(0,0,0,0.7)]">
          {/* Section header */}
          <p className="text-[10px] font-semibold text-[#555] uppercase tracking-[0.15em] px-4 mb-2">
            {label}
          </p>

          {children.map((child) =>
            child.isSoon ? (
              <div
                key="soon"
                className="relative"
                onMouseEnter={() => setComingSoonOpen(true)}
                onMouseLeave={() => setComingSoonOpen(false)}
              >
                <button className="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-[#666] hover:text-[#999] transition-colors group">
                  <span className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFC629] flex-shrink-0" />
                    Coming Soon
                  </span>
                  <ChevronDown size={11} className="-rotate-90 opacity-30 group-hover:opacity-60 transition-opacity" />
                </button>
                {/* Flyout */}
                <div
                  className="absolute left-full top-0 pl-2 z-50 transition-all duration-200 origin-top-left"
                  style={{
                    opacity: comingSoonOpen ? 1 : 0,
                    transform: comingSoonOpen ? 'scale(1) translateX(0)' : 'scale(0.97) translateX(-6px)',
                    pointerEvents: comingSoonOpen ? 'auto' : 'none',
                  }}
                >
                  <ComingSoonDropdown {...(comingSoon ?? {})} />
                </div>
              </div>
            ) : (
              <Link
                key={child.href}
                href={child.href!}
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#B0B0B0] hover:text-white hover:bg-white/[0.04] rounded-lg mx-1 transition-colors"
              >
                {child.isLive && <span className="w-1.5 h-1.5 rounded-full bg-[#FE2C55] flex-shrink-0" />}
                {child.label}
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  )
}

// ── Types ──────────────────────────────────────────────────────────

interface NavItem {
  _key?: string
  label: string
  href: string
  isLive?: boolean
  children?: { label: string; href: string | null; isLive?: boolean; isSoon?: boolean }[]
}

interface NavigationData {
  items?: NavItem[]
  ctaLabel?: string
  ctaHref?: string
  comingSoonHeader?: string
  comingSoonFooter?: string
  comingSoonBadge?: string
  comingSoonItems?: ComingSoonItem[]
}

interface NavigationProps {
  data?: NavigationData | null
}

// ── Main export ────────────────────────────────────────────────────

export default function Navigation({ data }: NavigationProps) {
  return (
    <Suspense fallback={null}>
      <NavigationInner data={data} />
    </Suspense>
  )
}

function NavigationInner({ data }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileOpenSections, setMobileOpenSections] = useState<Record<string, boolean>>({})
  const pathname = usePathname()
  const isIt = pathname.startsWith('/it')

  // Pre-compute locale switch targets so they ship as real <Link href> in the
  // SSR HTML — this lets Googlebot discover and crawl the IT pages, fixing the
  // "URL is unknown to Google" indexing issue for /it routes.
  const enHref = pathname.replace(/^\/it(\/|$)/, '/') || '/'
  const itHref =
    pathname === '/' || enHref === '/' ? '/it' : `/it${enHref}`

  // The proxy (`proxy.ts`) auto-redirects Italian visitors (`country === 'IT'`
  // or `accept-language: it`) to the `/it` tree on every full request — UNLESS
  // the `pota-locale` cookie is set, which is treated as an explicit user
  // preference. Without setting that cookie on click, an IT-located user who
  // toggles to English would be forced back to /it on the next refresh, making
  // it look like the EN switcher doesn't work. We persist the choice for one
  // year so refreshes, deep links, and return visits all honour it.
  const setLocaleCookie = (locale: 'en' | 'it') => {
    if (typeof document === 'undefined') return
    const secure = location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `pota-locale=${locale}; path=/; max-age=31536000; SameSite=Lax${secure}`
  }

  const ctaLabel = data?.ctaLabel ?? (isIt ? 'Contattaci' : "Let's Talk")
  const ctaHref = data?.ctaHref ?? '/contact'
  const activeCta = isIt && !ctaHref.startsWith('/it') ? `/it${ctaHref}` : ctaHref

  // Prefer Sanity-driven nav items; fall back to static defaults so the site
  // still works without (or before) the CMS document is created.
  const activeLinks: NavItem[] =
    data?.items && data.items.length > 0
      ? data.items
      : isIt ? navLinksIt : navLinksEn

  const comingSoonProps: ComingSoonProps = {
    header: data?.comingSoonHeader,
    footer: data?.comingSoonFooter,
    badge: data?.comingSoonBadge,
    items: data?.comingSoonItems,
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setMobileOpenSections({})
  }, [pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false) }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [mobileOpen])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [mobileOpen])

  const toggleMobileSection = (key: string) =>
    setMobileOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))

  return (
    <>
      {/* ── Header bar ────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#0D0D0D]/95 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none ${
          scrolled
            ? 'lg:bg-[#0D0D0D]/95 lg:backdrop-blur-sm border-b border-white/5'
            : 'border-b border-white/5 lg:border-b-0'
        }`}
      >
        <div className="container-site">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">

            {/* Logo */}
            <Link href={isIt ? '/it' : '/'} className="flex items-center flex-shrink-0">
              <Image
                src="/images/pota-logo.png"
                alt="Pota Studio logo"
                width={140}
                height={38}
                className="object-contain invert h-auto w-[92px] sm:w-[110px] lg:w-[140px]"
                priority
                loading="eager"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8" aria-label="Main navigation">
              {activeLinks.map((link) =>
                link.children ? (
                  <DesktopDropdown
                    key={link.href}
                    label={link.label}
                    href={link.href}
                    children={link.children}
                    isActive={pathname === link.href}
                    comingSoon={comingSoonProps}
                  />
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium tracking-wide transition-colors duration-200 whitespace-nowrap ${
                      pathname === link.href ? 'text-[#FFC629]' : 'text-[#B0B0B0] hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* Right side - locale + CTA */}
            <div className="hidden lg:flex items-center gap-3 xl:gap-4">
              <div className="flex items-center gap-1 text-xs font-medium">
                {isIt ? (
                  <>
                    <Link href={enHref} hrefLang="en" aria-label="Switch to English" onClick={() => setLocaleCookie('en')} className="text-[#B0B0B0] px-2 py-1 hover:text-white transition-colors">EN</Link>
                    <span className="text-white/20" aria-hidden="true">|</span>
                    <span className="text-white px-2 py-1 border border-white/20 rounded" aria-current="true">IT</span>
                  </>
                ) : (
                  <>
                    <span className="text-white px-2 py-1 border border-white/20 rounded" aria-current="true">EN</span>
                    <span className="text-white/20" aria-hidden="true">|</span>
                    <Link href={itHref} hrefLang="it" aria-label="Switch to Italian" onClick={() => setLocaleCookie('it')} className="text-[#B0B0B0] px-2 py-1 hover:text-white transition-colors">IT</Link>
                  </>
                )}
              </div>
              <Link
                href={activeCta}
                className="inline-flex items-center px-4 xl:px-5 py-2 xl:py-2.5 bg-[#FFC629] text-[#0D0D0D] text-sm font-bold rounded transition-all duration-200 hover:bg-[#e6b320] hover:shadow-[0_0_20px_rgba(255,198,41,0.4)] whitespace-nowrap"
              >
                {ctaLabel}
              </Link>
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 text-white -mr-1"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-panel"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile full-screen menu ────────────────────────────── */}
      <div
        id="mobile-nav-panel"
        className={`fixed inset-0 z-[60] bg-[#0D0D0D] flex flex-col lg:hidden transition-all duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto visible' : 'opacity-0 pointer-events-none invisible'
        }`}
        aria-hidden={!mobileOpen}
      >
        {/* Mobile top bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 h-16 flex-shrink-0">
          <Link href={isIt ? '/it' : '/'} className="flex items-center" onClick={() => setMobileOpen(false)}>
            <Image src="/images/pota-logo.png" alt="Pota Studio logo" width={140} height={38} className="object-contain invert h-auto" />
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center w-10 h-10 rounded-md border border-[#FF5C00] text-white transition-colors hover:bg-[#FF5C00]/10"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav
          className="flex flex-col px-6 pt-4 overflow-y-auto flex-1 w-full"
          aria-label="Mobile navigation"
        >
          <div className="mx-auto w-full max-w-sm">
            {activeLinks.map((link) => {
              const open = !!mobileOpenSections[link.href]
              return link.children ? (
                <div key={link.href} className="border-b border-white/10">
                  {/* Toggle row — click anywhere opens the submenu */}
                  <button
                    type="button"
                    onClick={() => toggleMobileSection(link.href)}
                    className="flex items-center justify-center gap-3 py-4 w-full text-center text-white transition-colors hover:text-[#FF5C00]"
                    aria-expanded={open}
                    aria-controls={`mobile-sub-${link.href}`}
                  >
                    <span
                      className="text-3xl sm:text-4xl font-bold leading-none"
                      style={{ fontFamily: 'var(--font-space-grotesk)' }}
                    >
                      {link.label}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`text-white/70 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>

                  {/* Sub-items */}
                  <div
                    id={`mobile-sub-${link.href}`}
                    style={{
                      overflow: 'hidden',
                      maxHeight: open ? 400 : 0,
                      transition: 'max-height 280ms ease-in-out',
                    }}
                  >
                    <div className="pb-4 flex flex-col items-center gap-1">
                      {link.children.map((child) =>
                        child.isSoon ? (
                          <div
                            key="soon"
                            className="flex items-center gap-2 py-2 text-base text-[#B0B0B0]"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00]" />
                            Coming Soon
                          </div>
                        ) : (
                          <Link
                            key={child.href}
                            href={child.href!}
                            className="py-2 text-base text-[#D4D4D4] hover:text-white transition-colors"
                            onClick={() => setMobileOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-center py-4 w-full text-center text-3xl sm:text-4xl font-bold text-white hover:text-[#FF5C00] transition-colors border-b border-white/10"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Mobile bottom */}
        <div
          className="px-6 pt-5 pb-5 flex flex-col gap-4 flex-shrink-0"
          style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}
        >
          <div className="flex items-center gap-3 text-sm font-medium">
            {isIt ? (
              <>
                <Link
                  href={enHref}
                  hrefLang="en"
                  onClick={() => {
                    setLocaleCookie('en')
                    setMobileOpen(false)
                  }}
                  aria-label="Switch to English"
                  className="text-[#B0B0B0] px-2 py-1 hover:text-white transition-colors"
                >
                  EN
                </Link>
                <span className="text-white/20" aria-hidden="true">|</span>
                <span
                  className="text-white px-3 py-1 border border-white/40 rounded"
                  aria-current="true"
                >
                  IT
                </span>
              </>
            ) : (
              <>
                <span
                  className="text-white px-3 py-1 border border-white/40 rounded"
                  aria-current="true"
                >
                  EN
                </span>
                <span className="text-white/20" aria-hidden="true">|</span>
                <Link
                  href={itHref}
                  hrefLang="it"
                  onClick={() => {
                    setLocaleCookie('it')
                    setMobileOpen(false)
                  }}
                  aria-label="Switch to Italian"
                  className="text-[#B0B0B0] px-2 py-1 hover:text-white transition-colors"
                >
                  IT
                </Link>
              </>
            )}
          </div>
          <Link
            href={activeCta}
            className="flex items-center justify-center px-6 py-4 bg-[#FFC629] text-[#0D0D0D] font-bold rounded text-base active:bg-[#e6b320] transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </>
  )
}
