import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

export type RelatedPost = {
  _id: string
  slug: string
  title: string
  excerpt?: string
  publishedAt?: string
  readingTime?: number
  coverImageUrl?: string | null
  categories?: Array<{ title?: string }>
}

const categoryColors: Record<string, string> = {
  'Digital Marketing': '#FF5C00',
  'Marketing Digitale': '#FF5C00',
  'Paid Advertising': '#FF5C00',
  'Paid ADS': '#FF5C00',
  'TikTok Marketing': '#FF385C',
  TikTok: '#FF385C',
  'Digital Strategy': '#7B61FF',
  'Influencer Marketing': '#00C8FF',
  'Social Media': '#00C851',
}

/**
 * "More articles" block rendered at the bottom of every blog post.
 *
 * SEO purpose: each card is a descriptive in-content link to another post in
 * the same locale, raising the internal-link count toward articles Google has
 * "discovered but not crawled" (GSC, 29 May 2026). The anchor text is the
 * post title — not a generic "Read more" — so the link carries topical signal.
 */
export default function RelatedPosts({
  posts,
  locale = 'en',
}: {
  posts: RelatedPost[]
  locale?: 'en' | 'it'
}) {
  if (!posts || posts.length === 0) return null

  const isIt = locale === 'it'
  const heading = isIt ? 'Altri articoli' : 'More articles'
  const base = isIt ? '/it/blog/' : '/blog/'

  return (
    <aside
      aria-label={heading}
      className="mt-16 pt-12 border-t border-white/10"
    >
      <h2
        className="text-2xl font-bold text-white mb-8"
        style={{ fontFamily: 'var(--font-space-grotesk)' }}
      >
        {heading}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => {
          const category = post.categories?.[0]?.title ?? 'Digital Marketing'
          const accent = categoryColors[category] ?? '#FF5C00'
          return (
            <Link
              key={post._id}
              href={`${base}${post.slug}`}
              rel="bookmark"
              className="group flex flex-col bg-[#111] rounded-xl overflow-hidden border border-white/[0.06] hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[16/9] bg-[#0D0D0D] overflow-hidden flex-shrink-0">
                {post.coverImageUrl ? (
                  <Image
                    src={post.coverImageUrl}
                    alt={post.title}
                    fill
                    loading="lazy"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    unoptimized
                  />
                ) : (
                  <span
                    className="absolute inset-0 flex items-center justify-center text-[6rem] font-bold opacity-10 select-none"
                    style={{ fontFamily: 'var(--font-space-grotesk)', color: accent }}
                    aria-hidden="true"
                  >
                    {category[0]}
                  </span>
                )}
                <span
                  className="absolute top-3 left-3 text-xs font-semibold uppercase tracking-widest px-2 py-1 rounded backdrop-blur-sm"
                  style={{ color: accent, backgroundColor: `${accent}22` }}
                >
                  {category}
                </span>
              </div>
              <div className="flex flex-col flex-1 p-5">
                <h3
                  className="text-base font-bold text-white leading-snug mb-2 group-hover:text-[#FFC629] transition-colors line-clamp-2"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-sm text-[#B0B0B0] leading-relaxed mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
                <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-medium text-[#B0B0B0] group-hover:text-white transition-colors">
                  {isIt ? 'Leggi l\u2019articolo' : 'Read article'}
                  <ArrowUpRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
