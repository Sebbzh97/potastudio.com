import {
  BarChart3,
  Globe,
  Hash,
  Mail,
  Megaphone,
  Music,
  PenLine,
  Search,
  ShoppingBag,
  Sparkles,
  Target,
  Users,
  Video,
  type LucideIcon,
} from 'lucide-react'

interface StrategySectionProps {
  /** Localised list of services / channels used on the case study. */
  services: string[]
  /** Section heading copy (locale-driven by caller). */
  headline: string
  /** Section sub-copy explaining what these channels accomplished. */
  subhead?: string
  /** Brand accent for the icon highlight. */
  accent?: string
}

interface ChannelDef {
  label: string
  icon: LucideIcon
  brandColor: string
}

/**
 * Maps a free-text service / channel name (from Sanity) onto a known channel
 * with its canonical icon and brand color. The match is case-insensitive and
 * substring-based so editors can write "TikTok Ads", "TIKTOK", or "TikTok
 * Live" — they all resolve to the same TikTok channel definition.
 */
function resolveChannel(raw: string): ChannelDef {
  const s = raw.toLowerCase()
  if (s.includes('tiktok')) return { label: raw, icon: Music, brandColor: '#FF0050' }
  if (s.includes('meta') || s.includes('facebook') || s.includes('instagram'))
    return { label: raw, icon: Hash, brandColor: '#0866FF' }
  if (s.includes('google') || s.includes('search ads'))
    return { label: raw, icon: Search, brandColor: '#4285F4' }
  if (s.includes('youtube')) return { label: raw, icon: Video, brandColor: '#FF0000' }
  if (s.includes('linkedin')) return { label: raw, icon: Users, brandColor: '#0A66C2' }
  if (s.includes('email') || s.includes('newsletter') || s.includes('crm'))
    return { label: raw, icon: Mail, brandColor: '#FF5C00' }
  if (s.includes('shopify') || s.includes('e-commerce') || s.includes('ecommerce'))
    return { label: raw, icon: ShoppingBag, brandColor: '#95BF47' }
  if (s.includes('influencer') || s.includes('creator'))
    return { label: raw, icon: Sparkles, brandColor: '#FF5C00' }
  if (s.includes('content') || s.includes('produzione') || s.includes('production'))
    return { label: raw, icon: PenLine, brandColor: '#FFC629' }
  if (s.includes('brand') || s.includes('identity'))
    return { label: raw, icon: Megaphone, brandColor: '#FF5C00' }
  if (s.includes('analytics') || s.includes('measurement') || s.includes('data'))
    return { label: raw, icon: BarChart3, brandColor: '#00C8FF' }
  if (s.includes('strategy') || s.includes('strategia'))
    return { label: raw, icon: Target, brandColor: '#FF5C00' }
  if (s.includes('web') || s.includes('site') || s.includes('sito'))
    return { label: raw, icon: Globe, brandColor: '#FF5C00' }
  // Generic fallback so unknown services still render gracefully.
  return { label: raw, icon: Target, brandColor: '#FF5C00' }
}

/**
 * "The Strategy" block — surfaces the channels used in a case study with
 * recognisable brand iconography. Improves scannability for hiring managers
 * who skim the page looking for "what platforms did they actually run?".
 *
 * Renders nothing when the services array is empty so it never shows an
 * empty container.
 */
export default function StrategySection({
  services,
  headline,
  subhead,
  accent = '#FF5C00',
}: StrategySectionProps) {
  if (!services || services.length === 0) return null

  return (
    <section
      aria-labelledby="case-strategy-heading"
      className="bg-[#0D0D0D] py-16 sm:py-20 border-t border-white/5"
    >
      <div className="container-site" style={{ maxWidth: '64rem' }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="text-[#FF5C00]" aria-hidden="true" style={{ color: accent }}>
            <Target size={20} />
          </div>
          <h2
            id="case-strategy-heading"
            className="text-2xl font-bold text-white"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            {headline}
          </h2>
        </div>

        {subhead && (
          <p className="text-[#B0B0B0] text-base sm:text-lg leading-relaxed mb-10 pl-9 max-w-3xl text-pretty">
            {subhead}
          </p>
        )}

        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {services.map((rawName, i) => {
            const ch = resolveChannel(rawName)
            const Icon = ch.icon
            return (
              <li
                key={`${rawName}-${i}`}
                className="group relative flex items-center gap-3 px-4 py-4 bg-[#141414] border border-white/10 rounded-xl transition-all hover:border-white/20 hover:bg-[#1A1A1A]"
              >
                <span
                  className="flex-shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: `${ch.brandColor}1A`,
                    color: ch.brandColor,
                  }}
                  aria-hidden="true"
                >
                  <Icon size={18} strokeWidth={2} />
                </span>
                <span className="text-sm font-medium text-white leading-tight">
                  {ch.label}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
