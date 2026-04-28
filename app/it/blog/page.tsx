import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock, Calendar } from 'lucide-react'
import { getBlogPosts, getBlogPage, type SanityBlogPost } from '@/sanity/lib/page-queries'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const data = await getBlogPage('it')
  return {
    title: data?.seoTitle ?? 'Blog | Pota Studio',
    description: data?.seoDescription ?? '',
    alternates: {
      canonical: 'https://potastudio.com/it/blog',
      languages: {
        en: 'https://potastudio.com/blog',
        it: 'https://potastudio.com/it/blog',
        'x-default': 'https://potastudio.com/blog',
      },
    },
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
}

const categoryColors: Record<string, string> = {
  TikTok: '#FF385C',
  'Digital Strategy': '#7B61FF',
  'Paid ADS': '#FF5C00',
  'Influencer Marketing': '#00C8FF',
  'Social Media': '#00C851',
}

function formatReadTime(rt: string | number, suffix = 'min di lettura'): string {
  if (typeof rt === 'number') return `${rt} ${suffix}`
  return rt
}

function formatDate(iso?: string, locale = 'it-IT'): string {
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
  }
}

type Props = { searchParams: Promise<{ category?: string }> }

export default async function BlogPageIT({ searchParams }: Props) {
  const { category: selectedCategory } = await searchParams
  const [sanity, data] = await Promise.all([getBlogPosts('it'), getBlogPage('it')])
  const allPosts = sanity.map(toPost)

  const activePosts =
    !selectedCategory || ['all', 'tutti'].includes(selectedCategory.toLowerCase())
      ? allPosts
      : allPosts.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase())

  const allCategories = Array.from(new Set(allPosts.map((p) => p.category)))
  const categories = ['Tutti', ...allCategories]

  const heroLabel    = data?.heroLabel    ?? 'Blog'
  const heroHeadline = data?.heroHeadline ?? ''
  const heroBody     = data?.heroBody     ?? ''
  const authorPrefix = 'di'
  const emptyMessage = 'Nessun articolo in questa categoria.'

  return (
    <main>
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
          {heroHeadline && (
            <h1
              className="font-bold text-white leading-[1.05] mb-5 sm:mb-6"
              style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 'clamp(3rem, 11vw, 8rem)' }}
            >
              {heroHeadline}
            </h1>
          )}
          {heroBody && (
            <p className="text-base sm:text-xl text-[#B0B0B0] max-w-2xl leading-relaxed">
              {heroBody}
            </p>
          )}
        </div>
      </section>

      {categories.length > 1 && (
        <div className="sticky top-14 sm:top-16 lg:top-20 z-30 bg-[#0D0D0D]/95 backdrop-blur-sm border-b border-white/10 py-3 sm:py-4">
          <div className="container-site flex items-center gap-2 overflow-x-auto no-scrollbar">
            {categories.map((cat) => {
              const isActive =
                cat === 'Tutti'
                  ? !selectedCategory || ['all', 'tutti'].includes(selectedCategory.toLowerCase())
                  : selectedCategory?.toLowerCase() === cat.toLowerCase()
              return (
                <Link
                  key={cat}
                  href={cat === 'Tutti' ? '/it/blog' : `/it/blog?category=${encodeURIComponent(cat)}`}
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
        </div>
      )}

      {activePosts[0] && (
        <section className="py-10 sm:py-16 bg-[#0D0D0D]">
          <div className="container-site">
            <Link
              href={`/it/blog/${activePosts[0].slug}`}
              className="group grid grid-cols-1 lg:grid-cols-2 bg-[#141414] border border-white/10 rounded-xl overflow-hidden hover:border-[#FF5C00]/40 transition-colors"
            >
              <div className="aspect-video lg:aspect-auto bg-[#1A0D00] flex items-center justify-center min-h-[180px] sm:min-h-[220px]">
                <span
                  className="text-[8rem] sm:text-[12rem] font-bold opacity-10 select-none"
                  style={{ fontFamily: 'var(--font-space-grotesk)', color: categoryColors[activePosts[0].category] ?? '#FF5C00' }}
                  aria-hidden="true"
                >
                  {activePosts[0].category[0]}
                </span>
              </div>
              <div className="p-6 sm:p-8 lg:py-12 flex flex-col justify-center">
                <span
                  className="text-xs font-semibold uppercase tracking-widest mb-3 sm:mb-4 inline-block"
                  style={{ color: categoryColors[activePosts[0].category] ?? '#FF5C00' }}
                >
                  {activePosts[0].category}
                </span>
                <h2
                  className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 group-hover:text-[#FF5C00] transition-colors"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  {activePosts[0].title}
                </h2>
                <p className="text-[#B0B0B0] leading-relaxed mb-5 sm:mb-6 text-sm sm:text-base">{activePosts[0].excerpt}</p>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-[#B0B0B0]">
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} />
                    {formatReadTime(activePosts[0].readTime)}
                  </span>
                  {activePosts[0].date && (
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      {activePosts[0].date}
                    </span>
                  )}
                  {activePosts[0].author && <span>{authorPrefix} {activePosts[0].author}</span>}
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {activePosts.length > 1 && (
        <section className="pb-16 sm:pb-24 bg-[#0D0D0D]">
          <div className="container-site">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {activePosts.slice(1).map((post) => (
                <Link
                  key={post.slug}
                  href={`/it/blog/${post.slug}`}
                  className="group bg-[#141414] border border-white/10 rounded-xl overflow-hidden hover:border-[#FF5C00]/30 transition-colors flex flex-col"
                >
                  <div className="aspect-video bg-[#0D0D0D] flex items-center justify-center relative overflow-hidden">
                    <span
                      className="text-[7rem] sm:text-[8rem] font-bold opacity-10 select-none"
                      style={{ fontFamily: 'var(--font-space-grotesk)', color: categoryColors[post.category] ?? '#FF5C00' }}
                      aria-hidden="true"
                    >
                      {post.category[0]}
                    </span>
                    <span
                      className="absolute top-3 left-3 text-xs font-semibold uppercase tracking-widest px-2 py-1 rounded"
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

      {activePosts.length === 0 && (
        <section className="py-24 bg-[#0D0D0D] text-center">
          <p className="text-[#B0B0B0]">{emptyMessage}</p>
        </section>
      )}
    </main>
  )
}
