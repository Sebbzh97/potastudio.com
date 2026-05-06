import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, Calendar } from 'lucide-react'
import Breadcrumbs from '@/components/breadcrumbs'
import { JsonLd } from '@/components/json-ld'
import { blogSchema, collectionPageSchema, breadcrumbListSchema } from '@/lib/jsonld/schemas'
import { categoryMetaCopy, findCategoryName, slugifyCategory } from '@/lib/blog-categories'
import { getBlogPosts, type SanityBlogPost } from '@/sanity/lib/page-queries'
import NewsletterCTA from '@/components/blog/newsletter-cta'

// ISR: category page regenerates every hour. Webhook can target this
// with `revalidateTag(`category:${slug}`)` for instant updates.
export const revalidate = 3600

const SITE = 'https://www.potastudio.com'

interface Post {
  slug: string
  category: string
  title: string
  excerpt: string
  readTime: string | number
  date: string
  author: string
  publishedAt?: string
  // Sanity CDN URL + alt; falls back to category-letter placeholder.
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
  return new Date(iso).toLocaleDateString(locale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
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

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  try {
    const posts = (await getBlogPosts('en')).map(toPost)
    const slugs = Array.from(
      new Set(posts.map((p) => slugifyCategory(p.category))),
    )
    return slugs.map((slug) => ({ slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const posts = (await getBlogPosts('en')).map(toPost)
  const canonicalName = findCategoryName(posts, slug)

  if (!canonicalName) {
    return { title: 'Category not found' }
  }

  const { title, description } = categoryMetaCopy(canonicalName, 'en')
  const itSlug = slug // EN→IT slug mirrors when category name is identical

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE}/blog/category/${slug}`,
      languages: {
        en: `${SITE}/blog/category/${slug}`,
        it: `${SITE}/it/blog/categoria/${itSlug}`,
        'x-default': `${SITE}/blog/category/${slug}`,
      },
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: `${SITE}/blog/category/${slug}`,
      siteName: 'Pota Studio',
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function BlogCategoryPage({ params }: Props) {
  const { slug } = await params
  const allPosts = (await getBlogPosts('en')).map(toPost)
  const canonicalName = findCategoryName(allPosts, slug)
  if (!canonicalName) notFound()

  const filteredPosts = allPosts.filter((p) => p.category === canonicalName)
  const otherCategories = Array.from(new Set(allPosts.map((p) => p.category)))

  const accent = categoryColors[canonicalName] ?? '#FF5C00'
  const { title: metaTitle, description: metaDescription } = categoryMetaCopy(canonicalName, 'en')
  const url = `${SITE}/blog/category/${slug}`

  // ── Structured data ──────────────────────────────────────────────────────
  const breadcrumbs = breadcrumbListSchema([
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: canonicalName, url: `/blog/category/${slug}` },
  ])
  const collection = collectionPageSchema({
    url,
    name: metaTitle,
    description: metaDescription,
    locale: 'en',
    posts: filteredPosts.map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.excerpt,
      publishedAt: p.publishedAt,
      authorName: p.author,
      category: p.category,
    })),
  })
  const blog = blogSchema({
    locale: 'en',
    category: `category/${slug}`,
    posts: filteredPosts.map((p) => ({
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
      <JsonLd data={breadcrumbs} />
      <JsonLd data={collection} />
      <JsonLd data={blog} />

      <main>
        {/* Hero */}
        <section className="pt-28 sm:pt-40 pb-12 sm:pb-16 bg-[#0D0D0D] relative overflow-hidden">
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
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-[#B0B0B0] hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft size={14} />
              All Posts
            </Link>
            <Breadcrumbs
              className="mb-8"
              items={[
                { name: 'Home', url: '/' },
                { name: 'Blog', url: '/blog' },
                { name: canonicalName, url: `/blog/category/${slug}` },
              ]}
            />
            <span
              className="text-xs font-semibold uppercase tracking-[0.3em] mb-4 sm:mb-6 block"
              style={{ color: accent }}
            >
              Category
            </span>
            <h1
              className="font-bold text-white leading-[1.05] mb-4 sm:mb-6 text-balance"
              style={{
                fontFamily: 'var(--font-space-grotesk)',
                fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
              }}
            >
              {canonicalName}
            </h1>
            <p className="text-base sm:text-lg text-[#B0B0B0] max-w-2xl leading-relaxed">
              {metaDescription}
            </p>
          </div>
        </section>

        {/* Category navigation pills */}
        {otherCategories.length > 1 && (
          <nav
            aria-label="Blog categories"
            className="sticky top-14 sm:top-16 lg:top-20 z-30 bg-[#0D0D0D]/95 backdrop-blur-sm border-b border-white/10 py-3 sm:py-4"
          >
            <div className="container-site flex items-center gap-2 overflow-x-auto no-scrollbar">
              <Link
                href="/blog"
                className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full whitespace-nowrap flex-shrink-0 border border-white/20 text-[#B0B0B0] hover:border-white/40 hover:text-white transition-all"
              >
                All
              </Link>
              {otherCategories.map((cat) => {
                const catSlug = slugifyCategory(cat)
                const isActive = catSlug === slug
                return (
                  <Link
                    key={cat}
                    href={`/blog/category/${catSlug}`}
                    aria-current={isActive ? 'page' : undefined}
                    className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full whitespace-nowrap flex-shrink-0 border transition-all ${
                      isActive
                        ? 'border-white/60 text-white bg-white/10'
                        : 'text-[#B0B0B0] border-white/20 hover:border-white/40 hover:text-white'
                    }`}
                  >
                    {cat}
                  </Link>
                )
              })}
            </div>
          </nav>
        )}

        {/* Featured post */}
        {filteredPosts[0] && (
          <section className="py-10 sm:py-16 bg-[#0D0D0D]">
            <div className="container-site">
              <Link
                href={`/blog/${filteredPosts[0].slug}`}
                className="group grid grid-cols-1 lg:grid-cols-2 bg-[#141414] border border-white/10 rounded-xl overflow-hidden hover:border-[#FF5C00]/40 transition-colors"
              >
                <div className="relative aspect-video lg:aspect-auto bg-[#1A0D00] flex items-center justify-center min-h-[180px] sm:min-h-[220px] overflow-hidden">
                  {filteredPosts[0].coverImageUrl ? (
                    <Image
                      src={filteredPosts[0].coverImageUrl}
                      alt={filteredPosts[0].coverImageAlt || filteredPosts[0].title}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <span
                      className="text-[8rem] sm:text-[12rem] font-bold opacity-10 select-none"
                      style={{ fontFamily: 'var(--font-space-grotesk)', color: accent }}
                      aria-hidden="true"
                    >
                      {canonicalName[0]}
                    </span>
                  )}
                </div>
                <div className="p-6 sm:p-8 lg:py-12 flex flex-col justify-center">
                  <span
                    className="text-xs font-semibold uppercase tracking-widest mb-3 sm:mb-4 inline-block"
                    style={{ color: accent }}
                  >
                    {canonicalName}
                  </span>
                  <h2
                    className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 group-hover:text-[#FF5C00] transition-colors"
                    style={{ fontFamily: 'var(--font-space-grotesk)' }}
                  >
                    {filteredPosts[0].title}
                  </h2>
                  <p className="text-[#B0B0B0] leading-relaxed mb-5 sm:mb-6 text-sm sm:text-base">
                    {filteredPosts[0].excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-[#B0B0B0]">
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} />
                      {formatReadTime(filteredPosts[0].readTime)}
                    </span>
                    {filteredPosts[0].date && (
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        {filteredPosts[0].date}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* Post grid */}
        {filteredPosts.length > 1 && (
          <section className="pb-16 sm:pb-24 bg-[#0D0D0D]">
            <div className="container-site">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredPosts.slice(1).map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group bg-[#141414] border border-white/10 rounded-xl overflow-hidden hover:border-[#FF5C00]/30 transition-colors flex flex-col"
                  >
                    <div className="aspect-video bg-[#0D0D0D] flex items-center justify-center relative overflow-hidden">
                      {post.coverImageUrl ? (
                        <Image
                          src={post.coverImageUrl}
                          alt={post.coverImageAlt || post.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover"
                        />
                      ) : (
                        <span
                          className="text-[7rem] sm:text-[8rem] font-bold opacity-10 select-none"
                          style={{ fontFamily: 'var(--font-space-grotesk)', color: accent }}
                          aria-hidden="true"
                        >
                          {canonicalName[0]}
                        </span>
                      )}
                    </div>
                    <div className="p-5 sm:p-6 flex flex-col flex-1">
                      <h3
                        className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3 group-hover:text-[#FF5C00] transition-colors"
                        style={{ fontFamily: 'var(--font-space-grotesk)' }}
                      >
                        {post.title}
                      </h3>
                      <p className="text-[#B0B0B0] text-sm leading-relaxed mb-4 flex-1">
                        {post.excerpt}
                      </p>
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

        <NewsletterCTA location={`blog_category_${slug}`} locale="en" />
      </main>
    </>
  )
}
