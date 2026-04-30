import Image from 'next/image'
import { Linkedin, Award } from 'lucide-react'
import { urlFor } from '@/sanity/lib/client'

type Author = {
  name?: string
  role?: string
  bio?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  photo?: { asset?: any; alt?: string }
  linkedin?: string
  twitterX?: string
  credentials?: string[]
}

const COPY = {
  en: {
    label: 'Written by',
    credentialsHeading: 'Credentials',
    linkedin: 'Connect on LinkedIn',
    twitter: 'Follow on X',
  },
  it: {
    label: 'Articolo di',
    credentialsHeading: 'Credenziali',
    linkedin: 'Connettiti su LinkedIn',
    twitter: 'Seguimi su X',
  },
} as const

// X (Twitter) icon — kept inline because lucide-react no longer ships a
// brand-correct X glyph.
function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117Z" />
    </svg>
  )
}

/**
 * Author Authority Box — E-E-A-T optimised.
 *
 * Surfaces the signals Google + AI engines use to evaluate trust:
 *   - Profile photo (Person.image)
 *   - Real name + role (Person.name + Person.jobTitle)
 *   - Bio with concrete experience
 *   - Verifiable credentials (Person.knowsAbout, rendered as badges)
 *   - Social proof links (Person.sameAs)
 *
 * Uses Schema.org microdata (itemScope/itemProp) so the markup is
 * machine-readable even before JSON-LD is parsed.
 */
export default function AuthorAuthorityBox({
  author,
  accent = '#FF5C00',
  locale = 'en',
}: {
  author: Author
  accent?: string
  locale?: 'en' | 'it'
}) {
  if (!author?.name) return null
  const copy = COPY[locale]
  const photoSrc = author.photo?.asset
    ? urlFor(author.photo).width(160).height(160).fit('crop').auto('format').url()
    : null
  const photoAlt = author.photo?.alt ?? author.name

  return (
    <aside
      className="mt-16 pt-10 border-t border-white/10"
      itemScope
      itemType="https://schema.org/Person"
      aria-label={`${copy.label} ${author.name}`}
    >
      <p className="text-xs uppercase tracking-[0.2em] text-[#9A9A9A] mb-5" style={{ color: accent }}>
        {copy.label}
      </p>

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="shrink-0">
          {photoSrc ? (
            <Image
              src={photoSrc}
              alt={photoAlt}
              width={96}
              height={96}
              className="rounded-full border-2 object-cover"
              style={{ borderColor: `${accent}80` }}
              itemProp="image"
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full border-2 flex items-center justify-center"
              style={{ borderColor: `${accent}80`, backgroundColor: `${accent}20` }}
              aria-hidden="true"
            >
              <span
                className="text-3xl font-bold"
                style={{ color: accent, fontFamily: 'var(--font-space-grotesk)' }}
              >
                {author.name[0]}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className="text-xl font-semibold text-white"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
            itemProp="name"
          >
            {author.name}
          </h3>
          {author.role && (
            <p
              className="text-sm font-medium mb-3"
              style={{ color: accent }}
              itemProp="jobTitle"
            >
              {author.role}
            </p>
          )}

          {author.bio && (
            <p className="text-[#C0C0C0] text-base leading-relaxed mb-4 max-w-2xl" itemProp="description">
              {author.bio}
            </p>
          )}

          {author.credentials && author.credentials.length > 0 && (
            <div className="mb-4">
              <p className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#9A9A9A] mb-2">
                <Award size={12} aria-hidden="true" />
                {copy.credentialsHeading}
              </p>
              <ul className="flex flex-wrap gap-2">
                {author.credentials.map((credential) => (
                  <li
                    key={credential}
                    className="text-xs text-white/90 rounded-full px-3 py-1 border"
                    style={{ borderColor: `${accent}40`, backgroundColor: `${accent}10` }}
                    itemProp="knowsAbout"
                  >
                    {credential}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(author.linkedin || author.twitterX) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {author.linkedin && (
                <a
                  href={author.linkedin}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="inline-flex items-center gap-2 text-sm font-medium border border-white/20 rounded-lg px-4 py-2 text-[#B0B0B0] hover:text-white hover:border-white/40 transition-colors"
                  itemProp="sameAs"
                  aria-label={copy.linkedin}
                >
                  <Linkedin size={16} aria-hidden="true" />
                  LinkedIn
                </a>
              )}
              {author.twitterX && (
                <a
                  href={author.twitterX}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="inline-flex items-center gap-2 text-sm font-medium border border-white/20 rounded-lg px-4 py-2 text-[#B0B0B0] hover:text-white hover:border-white/40 transition-colors"
                  itemProp="sameAs"
                  aria-label={copy.twitter}
                >
                  <XIcon size={14} />X
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
