import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { Clock, Calendar } from 'lucide-react'
import { getHreflang } from '@/lib/hreflang'
import { getBlogPosts, getBlogPage, type SanityBlogPost } from '@/sanity/lib/page-queries'
import { withSanityTransform } from '@/lib/sanity-image'
import { JsonLd } from '@/components/json-ld'
import { blogSchema } from '@/lib/jsonld/schemas'
import { slugifyCategory } from '@/lib/blog-categories'
import NewsletterCTA from '@/components/blog/newsletter-cta'

// ISR: blog index regenerates every hour. New articles appear instantly
// when /api/revalidate is hit by the Sanity webhook.
export const revalidate = 3600

// `| Pota Studio` is appended automatically by the root layout template,
// so we omit the brand suffix here to avoid a double-suffixed title.
const FALLBACK_TITLE =
  'Marketing Blog — Social Media, TikTok & Paid Ads Playbooks'
const FALLBACK_DESCRIPTION =
  'Hands-on marketing playbooks on social media, TikTok, paid advertising and content. Strategy, real data, and best practices from the Pota Studio team. Read our editorial.'
const FALLBACK_HEADLINE =
  'Field-Tested Playbooks: Practical Guides on Social Media, TikTok & Advertising'

export async function generateMetadata(): Promise<Metadata> {
  const data = await getBlogPage('en')
  return {
    title: (data?.seoTitle?.trim() || FALLBACK_TITLE),
    description: (data?.seoDescription?.trim() || FALLBACK_DESCRIPTION),
    ...getHreflang('/blog'),
  }
}

interface Post {
  slug: string
  category: string
  title: string
  excerpt: string
  readTime: string | number
  date: string
  author: string
  publishedAt?: string
  // Resolved Sanity asset URL + alt text. When undefined we fall back to
  // the category-letter placeholder so the layout never collapses.
  coverImageUrl?: string
  coverImageAlt?: string
}

const categoryColors: Record<string, string> = {
  TikTok: '#FF385C',
  'Digital Strategy': '#7B61FF',
  'Paid ADS': '#FF5C00',
  'Influencer Marketing': '#00C8FF',
  'Social Media': '#00C851',
}

function formatReadTime(rt: string | number, suffix = 'min read'): string {
  if (typeof rt === 'number') return `${rt} ${suffix}`
  return rt
}

function formatDate(iso?: string, locale = 'en-US'): string {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString(locale, { month: 'long', day: 'numeric', year: 'numeric' })
}

function toPost(s: SanityBlogPost): Post {
  return {
    slug: s.slug,
    category: s.categories?.[0] ?? 'Digital Strategy',
    title: s.title,
    excerpt: s.excerpt ?? '',
    readTime: s.readingTime ?? 7,
    date: formatDate(s.publishedAt),
    author: s.author?.name ?? 'Pota Studio',
    publishedAt: s.publishedAt,
    coverImageUrl: s.coverImageUrl,
    coverImageAlt: s.coverImageAlt,
  }
}

type Props = { searchParams: Promise<{ category?: string }> }

export default async function BlogPage({ searchParams }: Props) {
  // Legacy redirect: /blog?category=Paid+ADS  →  /blog/category/paid-ads (307)
  const { category: legacyCategory } = await searchParams
  if (legacyCategory && legacyCategory.toLowerCase() !== 'all') {
    redirect(`/blog/category/${slugifyCategory(legacyCategory)}`)
  }

  const [sanity, data] = await Promise.all([getBlogPosts('en'), getBlogPage('en')])
  const allPosts = sanity.map(toPost)

  const allCategories = Array.from(new Set(allPosts.map((p) => p.category)))
  const categories = ['All', ...allCategories]

  const heroLabel    = data?.heroLabel    ?? 'Blog'
  const heroHeadline = (data?.heroHeadline?.trim() || FALLBACK_HEADLINE)
  const heroBody     = data?.heroBody     ?? ''
  const authorPrefix = 'by'

  const blogJsonLd = blogSchema({
    locale: 'en',
    posts: allPosts.map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.excerpt,
      publishedAt: p.publishedAt,
      authorName: p.author,
      category: p.category,
    })),
  })

  return (
    <>
      <JsonLd data={blogJsonLd} />

      <main>
        {/* Hero */}
        <section className="pt-28 sm:pt-40 pb-16 sm:pb-24 bg-[#0D0D0D] relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(#FFFFFF 1px, transparent 1px), linear-gradient(90deg, #FFFFFF 1px, transparent 1px)',
              backgroundSize: '80px 80px',
            }}
            aria-hidden="true"
          />
          <div className="container-site relative">
            <span className="text-xs font-semibold text-[#FF5C00] uppercase tracking-[0.3em] mb-4 sm:mb-6 block">
              {heroLabel}
            </span>
            <h1
              className="font-bold text-white leading-[1.05] mb-5 sm:mb-6 text-balance"
              style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 'clamp(3rem, 11vw, 8rem)' }}
            >
              {heroHeadline}
            </h1>
            {heroBody && (
              <p className="text-base sm:text-xl text-[#B0B0B0] max-w-2xl leading-relaxed">
                {heroBody}
              </p>
            )}
          </div>
        </section>

        {/* Category filter — semantic dynamic routes */}
        {categories.length > 1 && (
          <nav
            aria-label="Blog categories"
            className="sticky top-14 sm:top-16 lg:top-20 z-30 bg-[#0D0D0D]/95 backdrop-blur-sm border-b border-white/10 py-3 sm:py-4"
          >
            <div className="container-site flex items-center gap-2 overflow-x-auto no-scrollbar">
              {categories.map((cat) => {
                const href = cat === 'All' ? '/blog' : `/blog/category/${slugifyCategory(cat)}`
                return (
                  <Link
                    key={cat}
                    href={href}
                    className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full whitespace-nowrap flex-shrink-0 border border-white/20 text-[#B0B0B0] hover:border-white/40 hover:text-white transition-all"
                  >
                    {cat}
                  </Link>
                )
              })}
            </div>
          </nav>
        )}

        {/* Featured post */}
        {allPosts[0] && (
          <section className="py-10 sm:py-16 bg-[#0D0D0D]">
            <div className="container-site">
              <Link
                href={`/blog/${allPosts[0].slug}`}
                className="group grid grid-cols-1 lg:grid-cols-2 bg-[#141414] border border-white/10 rounded-xl overflow-hidden hover:border-[#FF5C00]/40 transition-colors"
              >
                <div className="relative aspect-video lg:aspect-auto bg-[#1A0D00] flex items-center justify-center min-h-[180px] sm:min-h-[220px] overflow-hidden">
                  {allPosts[0].coverImageUrl ? (
                    <Image
                      src={withSanityTransform(allPosts[0].coverImageUrl, { w: 1200, fit: 'crop' })!}
                      alt={allPosts[0].coverImageAlt || allPosts[0].title}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover"
                      priority
                      unoptimized
                    />
                  ) : (
                    <span
                      className="text-[8rem] sm:text-[12rem] font-bold opacity-10 select-none"
                      style={{ fontFamily: 'var(--font-space-grotesk)', color: categoryColors[allPosts[0].category] ?? '#FF5C00' }}
                      aria-hidden="true"
                    >
                      {allPosts[0].category[0]}
                    </span>
                  )}
                </div>
                <div className="p-6 sm:p-8 lg:py-12 flex flex-col justify-center">
                  <span
                    className="text-xs font-semibold uppercase tracking-widest mb-3 sm:mb-4 inline-block"
                    style={{ color: categoryColors[allPosts[0].category] ?? '#FF5C00' }}
                  >
                    {allPosts[0].category}
                  </span>
                  <h2
                    className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 group-hover:text-[#FF5C00] transition-colors"
                    style={{ fontFamily: 'var(--font-space-grotesk)' }}
                  >
                    {allPosts[0].title}
                  </h2>
                  <p className="text-[#B0B0B0] leading-relaxed mb-5 sm:mb-6 text-sm sm:text-base">{allPosts[0].excerpt}</p>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-[#B0B0B0]">
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} />
                      {formatReadTime(allPosts[0].readTime)}
                    </span>
                    {allPosts[0].date && (
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        {allPosts[0].date}
                      </span>
                    )}
                    {allPosts[0].author && <span>{authorPrefix} {allPosts[0].author}</span>}
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* Post grid */}
        {allPosts.length > 1 && (
          <section className="pb-16 sm:pb-24 bg-[#0D0D0D]">
            <div className="container-site">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {allPosts.slice(1).map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group bg-[#141414] border border-white/10 rounded-xl overflow-hidden hover:border-[#FF5C00]/30 transition-colors flex flex-col"
                  >
                    <div className="aspect-video bg-[#0D0D0D] flex items-center justify-center relative overflow-hidden">
                      {post.coverImageUrl ? (
                        <Image
                          src={withSanityTransform(post.coverImageUrl, { w: 800, fit: 'crop' })!}
                          alt={post.coverImageAlt || post.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <span
                          className="text-[7rem] sm:text-[8rem] font-bold opacity-10 select-none"
                          style={{ fontFamily: 'var(--font-space-grotesk)', color: categoryColors[post.category] ?? '#FF5C00' }}
                          aria-hidden="true"
                        >
                          {post.category[0]}
                        </span>
                      )}
                      <span
                        className="absolute top-3 left-3 text-xs font-semibold uppercase tracking-widest px-2 py-1 rounded backdrop-blur-sm"
                        style={{
                          color: categoryColors[post.category] ?? '#FF5C00',
                          backgroundColor: `${categoryColors[post.category] ?? '#FF5C00'}15`,
                        }}
                      >
                        {post.category}
                      </span>
                    </div>
                    <div className="p-5 sm:p-6 flex flex-col flex-1">
                      <h3
                        className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3 group-hover:text-[#FF5C00] transition-colors"
                        style={{ fontFamily: 'var(--font-space-grotesk)' }}
                      >
                        {post.title}
                      </h3>
                      <p className="text-[#B0B0B0] text-sm leading-relaxed mb-4 flex-1">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-[#B0B0B0] pt-4 border-t border-white/10">
                        <span className="flex items-center gap-1.5">
                          <Clock size={11} />
                          {formatReadTime(post.readTime)}
                        </span>
                        {post.date && <span>{post.date}</span>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {allPosts.length === 0 && (
          <section className="py-24 bg-[#0D0D0D] text-center">
            <p className="text-[#B0B0B0]">No posts published yet — check back soon.</p>
          </section>
        )}

        <NewsletterCTA location="blog_index" locale="en" />
      </main>
    </>
  )
}
