import Image from 'next/image'
import Link from 'next/link'
import { Linkedin, Globe, Mail, MapPin, Award, Calendar } from 'lucide-react'
import { PortableText, type PortableTextBlock } from '@portabletext/react'
import { urlFor } from '@/sanity/lib/client'

// X (Twitter) brand mark — kept inline because lucide-react no longer
// ships an accurate post-rebrand X glyph.
function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117Z" />
    </svg>
  )
}

const COPY = {
  en: {
    backLabel: 'All authors',
    backHref: '/blog',
    role: 'Role',
    expertise: 'Areas of expertise',
    credentials: 'Credentials',
    location: 'Based in',
    yearsOfExperience: 'Years of experience',
    contact: 'Contact',
    articlesHeading: 'Articles by this author',
    noArticles: 'No articles published yet.',
    readMore: 'Read article',
    minRead: 'min read',
    publishedOn: 'Published on',
  },
  it: {
    backLabel: 'Tutti gli autori',
    backHref: '/it/blog',
    role: 'Ruolo',
    expertise: 'Aree di competenza',
    credentials: 'Credenziali',
    location: 'Sede',
    yearsOfExperience: 'Anni di esperienza',
    contact: 'Contatto',
    articlesHeading: 'Articoli scritti da',
    noArticles: 'Nessun articolo pubblicato.',
    readMore: 'Leggi articolo',
    minRead: 'min di lettura',
    publishedOn: 'Pubblicato il',
  },
} as const

type Author = {
  _id?: string
  name: string
  slug?: string
  role?: string
  bio?: string
  longBio?: PortableTextBlock[] | null
  longBio_it?: PortableTextBlock[] | null
  expertise?: string[]
  yearsOfExperience?: number
  location?: string
  email?: string
  website?: string
  linkedin?: string
  twitterX?: string
  instagram?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  photo?: { asset?: any; alt?: string }
  credentials?: string[]
}

type AuthorPost = {
  _id: string
  title: string
  slug: string
  excerpt?: string
  publishedAt?: string
  readingTime?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coverImage?: { asset?: any; alt?: string }
  categories?: { title: string; slug: string; color?: string }[]
}

const ACCENT = '#FF5C00'

function formatDate(iso: string | undefined, locale: 'en' | 'it'): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Author profile content. Rendered identically on `/author/[slug]` (EN) and
 * `/it/autore/[slug]` (IT) — the only difference is the `locale` prop, which
 * picks the right copy and the localised long-bio field.
 *
 * The Person + ProfilePage JSON-LD is emitted from the surrounding route
 * file (so it sits in <head> and Google can resolve it before paint).
 */
export default function AuthorProfileContent({
  author,
  posts,
  locale,
}: {
  author: Author
  posts: AuthorPost[]
  locale: 'en' | 'it'
}) {
  const copy = COPY[locale]
  const photoSrc = author.photo?.asset
    ? urlFor(author.photo).width(320).height(320).fit('crop').auto('format').url()
    : null
  const photoAlt = author.photo?.alt ?? author.name

  // Localised long bio: prefer the locale-specific field, fall back to EN
  // when the IT translation isn't filled in. Both can be undefined — that
  // just means we render only the short bio + sidebar facts.
  const longBio: PortableTextBlock[] | null =
    locale === 'it'
      ? (author.longBio_it as PortableTextBlock[] | null) ??
        (author.longBio as PortableTextBlock[] | null) ??
        null
      : (author.longBio as PortableTextBlock[] | null) ?? null

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Hero ─────────────────────────────────────────────────────────────── */}
      <section className="pt-40 pb-16 border-b border-white/10">
        <div className="container-site max-w-5xl">
          <Link
            href={copy.backHref}
            className="inline-flex items-center gap-2 text-sm text-[#9A9A9A] hover:text-white mb-10 transition-colors"
          >
            <span aria-hidden="true">←</span>
            {copy.backLabel}
          </Link>

          <div className="flex flex-col sm:flex-row gap-10 items-start">
            <div className="shrink-0">
              {photoSrc ? (
                <Image
                  src={photoSrc}
                  alt={photoAlt}
                  width={160}
                  height={160}
                  priority
                  className="rounded-full border-2 object-cover"
                  style={{ borderColor: `${ACCENT}80` }}
                />
              ) : (
                <div
                  className="w-40 h-40 rounded-full flex items-center justify-center border-2"
                  style={{ borderColor: `${ACCENT}80`, backgroundColor: `${ACCENT}20` }}
                  aria-hidden="true"
                >
                  <span
                    className="text-6xl font-bold"
                    style={{ color: ACCENT, fontFamily: 'var(--font-space-grotesk)' }}
                  >
                    {author.name[0]}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h1
                className="text-4xl sm:text-5xl font-bold leading-[1] tracking-tight text-balance mb-4"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                {author.name}
              </h1>
              {author.role && (
                <p
                  className="text-lg sm:text-xl font-medium mb-6"
                  style={{ color: ACCENT }}
                >
                  {author.role}
                </p>
              )}
              {author.bio && (
                <p className="text-[#C0C0C0] text-base leading-relaxed max-w-2xl">
                  {author.bio}
                </p>
              )}

              {/* Social proof links */}
              {(author.linkedin || author.twitterX || author.instagram || author.website) && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {author.linkedin && (
                    <a
                      href={author.linkedin}
                      target="_blank"
                      rel="noopener noreferrer me"
                      className="inline-flex items-center gap-2 text-sm font-medium border border-white/20 rounded-lg px-4 py-2 text-[#B0B0B0] hover:text-white hover:border-white/40 transition-colors"
                      aria-label={`${author.name} on LinkedIn`}
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
                      aria-label={`${author.name} on X`}
                    >
                      <XIcon size={14} />X
                    </a>
                  )}
                  {author.website && (
                    <a
                      href={author.website}
                      target="_blank"
                      rel="noopener noreferrer me"
                      className="inline-flex items-center gap-2 text-sm font-medium border border-white/20 rounded-lg px-4 py-2 text-[#B0B0B0] hover:text-white hover:border-white/40 transition-colors"
                    >
                      <Globe size={16} aria-hidden="true" />
                      {copy.contact}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Body — long bio + sidebar facts ─────────────────────────────────── */}
      <section className="py-16">
        <div className="container-site max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Long bio (Portable Text) */}
            <div className="lg:col-span-2">
              {longBio && Array.isArray(longBio) && longBio.length > 0 ? (
                <div
                  className="prose prose-invert max-w-none
                    prose-p:text-[#C0C0C0] prose-p:leading-relaxed
                    prose-h2:text-white prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-4
                    prose-h3:text-white prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3
                    prose-strong:text-white
                    prose-a:text-[#FF5C00] prose-a:no-underline hover:prose-a:underline
                    prose-li:text-[#C0C0C0]"
                >
                  <PortableText value={longBio} />
                </div>
              ) : (
                author.bio && (
                  <p className="text-[#C0C0C0] text-lg leading-relaxed">{author.bio}</p>
                )
              )}
            </div>

            {/* Sidebar — sticky facts */}
            <aside className="lg:col-span-1">
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 sticky top-32 space-y-6">
                {author.expertise && author.expertise.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#9A9A9A] mb-3">
                      {copy.expertise}
                    </p>
                    <ul className="flex flex-wrap gap-2">
                      {author.expertise.map((e) => (
                        <li
                          key={e}
                          className="text-xs text-white/90 rounded-full px-3 py-1 border"
                          style={{
                            borderColor: `${ACCENT}40`,
                            backgroundColor: `${ACCENT}10`,
                          }}
                        >
                          {e}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {author.credentials && author.credentials.length > 0 && (
                  <div>
                    <p className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#9A9A9A] mb-3">
                      <Award size={12} aria-hidden="true" />
                      {copy.credentials}
                    </p>
                    <ul className="space-y-1.5 text-sm text-[#C0C0C0]">
                      {author.credentials.map((c) => (
                        <li key={c} className="leading-snug">
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {(author.location || author.yearsOfExperience || author.email) && (
                  <div className="space-y-3 pt-2 border-t border-white/5 text-sm">
                    {author.location && (
                      <p className="flex items-center gap-2 text-[#C0C0C0]">
                        <MapPin size={14} aria-hidden="true" className="shrink-0" />
                        <span>
                          <span className="text-[#9A9A9A] text-xs uppercase tracking-widest block">
                            {copy.location}
                          </span>
                          {author.location}
                        </span>
                      </p>
                    )}
                    {typeof author.yearsOfExperience === 'number' &&
                      author.yearsOfExperience > 0 && (
                        <p className="flex items-center gap-2 text-[#C0C0C0]">
                          <Calendar size={14} aria-hidden="true" className="shrink-0" />
                          <span>
                            <span className="text-[#9A9A9A] text-xs uppercase tracking-widest block">
                              {copy.yearsOfExperience}
                            </span>
                            {author.yearsOfExperience}
                          </span>
                        </p>
                      )}
                    {author.email && (
                      <p className="flex items-center gap-2 text-[#C0C0C0]">
                        <Mail size={14} aria-hidden="true" className="shrink-0" />
                        <a
                          href={`mailto:${author.email}`}
                          className="hover:text-white transition-colors break-all"
                        >
                          {author.email}
                        </a>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Articles by this author ─────────────────────────────────────────── */}
      <section className="py-16 border-t border-white/10">
        <div className="container-site max-w-5xl">
          <h2
            className="text-2xl sm:text-3xl font-bold mb-10"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            {locale === 'it' ? `${copy.articlesHeading} ${author.name}` : copy.articlesHeading}
          </h2>

          {posts.length === 0 ? (
            <p className="text-[#9A9A9A]">{copy.noArticles}</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post) => {
                const cover = post.coverImage?.asset
                  ? urlFor(post.coverImage)
                      .width(800)
                      .height(450)
                      .fit('crop')
                      .auto('format')
                      .url()
                  : null
                const category = post.categories?.[0]?.title
                const blogHref =
                  locale === 'it' ? `/it/blog/${post.slug}` : `/blog/${post.slug}`
                return (
                  <li
                    key={post._id}
                    className="rounded-xl border border-white/10 overflow-hidden bg-white/[0.02] hover:border-white/30 transition-colors"
                  >
                    <Link href={blogHref} className="block group">
                      {cover && (
                        <div className="aspect-[16/9] overflow-hidden">
                          <Image
                            src={cover}
                            alt={post.coverImage?.alt ?? post.title}
                            width={800}
                            height={450}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(min-width: 768px) 50vw, 100vw"
                          />
                        </div>
                      )}
                      <div className="p-5">
                        {category && (
                          <p
                            className="text-xs uppercase tracking-widest mb-2"
                            style={{ color: ACCENT }}
                          >
                            {category}
                          </p>
                        )}
                        <h3
                          className="text-lg font-semibold text-white leading-snug mb-2"
                          style={{ fontFamily: 'var(--font-space-grotesk)' }}
                        >
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-[#9A9A9A] text-sm leading-relaxed line-clamp-2 mb-3">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-[#9A9A9A]">
                          {post.publishedAt && (
                            <time dateTime={post.publishedAt}>
                              {formatDate(post.publishedAt, locale)}
                            </time>
                          )}
                          {post.readingTime ? (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>
                                {post.readingTime} {copy.minRead}
                              </span>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>
    </main>
  )
}
