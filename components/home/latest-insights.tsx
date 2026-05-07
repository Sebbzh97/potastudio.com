import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Clock, Calendar } from 'lucide-react'
import { getRecentBlogPosts } from '@/sanity/lib/blog'
import { urlFor } from '@/sanity/lib/client'
import { withSanityTransform } from '@/lib/sanity-image'

/**
 * Curated slugs shown first. These are the most recent high-quality posts
 * that best represent the agency's editorial authority.
 * Order matters — first match in the Sanity results wins the first slot.
 */
const FEATURED_SLUGS = [
  'openai-ads-future-advertising-2026',
  'geo-strategy-ai-search-results-2026',
  'tiktok-shop-global-strategy-scaling',
]

const categoryColors: Record<string, string> = {
  'B2B Marketing':          '#FF5C00',
  'Performance Marketing':  '#FF5C00',
  'GEO & SEO':              '#7B61FF',
  'Content Marketing':      '#00C8FF',
  'Social Media':           '#00C851',
  'Digital Marketing':      '#FF5C00',
  'Digital Strategy':       '#7B61FF',
}

function formatDate(iso?: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatDateIt(iso?: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('it-IT', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function LatestInsights({ locale = 'en' }: { locale?: 'en' | 'it' }) {
  const isIt = locale === 'it'

  // Fetch 10 recent posts — we then reorder to put curated slugs first.
  const raw = await getRecentBlogPosts(isIt ? 'it' : 'en', 10)
  const posts = (raw ?? []) as Array<{
    _id: string
    slug: string
    title: string
    excerpt?: string
    readingTime?: number
    publishedAt?: string
    coverImage?: { asset?: unknown; alt?: string }
    author?: { name?: string }
    categories?: Array<{ title: string }>
    coverImageUrl?: string
  }>

  // Sort: curated first (in declared order), then remaining by date.
  const curated: typeof posts = []
  for (const slug of FEATURED_SLUGS) {
    const found = posts.find((p) => p.slug === slug && !curated.some((c) => c._id === p._id))
    if (found) curated.push(found)
  }
  const rest = posts.filter((p) => !curated.some((c) => c._id === p._id))
  const displayed = [...curated, ...rest].slice(0, 3)

  if (displayed.length === 0) return null

  const eyebrow   = isIt ? 'Ultimi Articoli'        : 'Latest Insights'
  const headline  = isIt ? 'Marketing playbooks'    : 'Marketing playbooks'
  const subtitle  = isIt ? 'dal campo.'             : 'from the field.'
  const viewAll   = isIt ? 'Leggi tutti gli articoli' : 'Read all articles'
  const readLabel = isIt ? 'min di lettura'           : 'min read'
  const blogHref  = isIt ? '/it/blog'                 : '/blog'

  return (
    <section className="py-16 sm:py-24 bg-[#0A0A0A]">
      <div className="container-site">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-10 sm:mb-16">
          <div>
            <span className="text-xs font-semibold text-[#FF5C00] uppercase tracking-[0.3em] mb-3 sm:mb-4 block">
              {eyebrow}
            </span>
            <h2
              className="font-bold text-white"
              style={{
                fontFamily: 'var(--font-space-grotesk)',
                fontSize: 'clamp(2rem, 4.5vw, 5rem)',
              }}
            >
              {headline}
              <br />
              <span className="text-[#B0B0B0]">{subtitle}</span>
            </h2>
          </div>
          <Link
            href={blogHref}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#B0B0B0] hover:text-white transition-colors group self-start sm:self-auto"
          >
            {viewAll}
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        {/* Cards grid — 3 col desktop, 1 col mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayed.map((post, idx) => {
            const category = post.categories?.[0]?.title ?? 'Digital Marketing'
            const accent = categoryColors[category] ?? '#FF5C00'
            const blogSlug = `${isIt ? '/it/blog/' : '/blog/'}${post.slug}`

            // Resolve cover: coverImage asset → urlFor, then fallback to coverImageUrl
            let coverSrc: string | null = null
            if (post.coverImage?.asset) {
              try {
                coverSrc = withSanityTransform(
                  urlFor(post.coverImage).width(800).height(450).fit('crop').auto('format').url(),
                  {},
                )
              } catch {
                coverSrc = null
              }
            }
            if (!coverSrc && post.coverImageUrl) {
              coverSrc = withSanityTransform(post.coverImageUrl, { w: 800, fit: 'crop' })
            }

            const dateStr = isIt
              ? formatDateIt(post.publishedAt)
              : formatDate(post.publishedAt)

            return (
              <Link
                key={post._id}
                href={blogSlug}
                rel="bookmark"
                className="group flex flex-col bg-[#111] rounded-xl overflow-hidden border border-white/[0.06] hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Cover */}
                <div className="relative aspect-[16/9] bg-[#0D0D0D] overflow-hidden flex-shrink-0">
                  {coverSrc ? (
                    <Image
                      src={coverSrc}
                      alt={post.title}
                      fill
                      loading={idx === 0 ? 'eager' : 'lazy'}
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
                  {/* Category badge */}
                  <span
                    className="absolute top-3 left-3 text-xs font-semibold uppercase tracking-widest px-2 py-1 rounded backdrop-blur-sm"
                    style={{ color: accent, backgroundColor: `${accent}22` }}
                  >
                    {category}
                  </span>
                </div>

                {/* Content */}
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
                  <div className="mt-auto flex items-center gap-3 text-xs text-[#666]">
                    {post.author?.name && (
                      <span>{post.author.name}</span>
                    )}
                    {post.readingTime && (
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {post.readingTime} {readLabel}
                      </span>
                    )}
                    {post.publishedAt && (
                      <span className="flex items-center gap-1 ml-auto">
                        <Calendar size={11} />
                        {dateStr}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
