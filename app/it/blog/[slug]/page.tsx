import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, Calendar } from 'lucide-react'
import { getBlogPostBySlug, getBlogPostSlugs, getTranslationSlug, getDefaultLeadMagnet, getRelatedBlogPosts } from '@/sanity/lib/blog'
import { buildBlogAlternates } from '@/lib/blog/hreflang'
import Breadcrumbs from '@/components/breadcrumbs'
import { JsonLd } from '@/components/json-ld'
import { articleSchema, faqPageSchema, speakableSchema } from '@/lib/jsonld/schemas'
import { resolveFaqItems } from '@/lib/blog/extract-faq'
import PortableTextRenderer from '@/components/blog/portable-text-renderer'
import QuickAnswer from '@/components/blog/quick-answer'
import KeyTakeaways from '@/components/blog/key-takeaways'
import LeadMagnetBox from '@/components/blog/lead-magnet-box'
import StickyMobileCta from '@/components/blog/sticky-mobile-cta'
import AuthorAuthorityBox from '@/components/blog/author-authority-box'
import FaqSection from '@/components/blog/faq-section'
import RelatedPosts from '@/components/blog/related-posts'

// ISR: regenerate every hour. Articles are pre-rendered at build time via
// `generateStaticParams` and on-demand via `revalidateTag` from the Sanity
// webhook (see `/api/revalidate`). Previously force-dynamic which forced a
// Lambda hit on every request.
export const revalidate = 3600

// ── helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso?: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('it-IT', { month: 'long', day: 'numeric', year: 'numeric' })
}

function formatReadTime(rt?: number): string {
  if (!rt) return '5 min di lettura'
  return `${rt} min di lettura`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ptToText(body: any[]): string {
  if (!Array.isArray(body)) return ''
  return body
    .filter((b) => b != null && b._type === 'block')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((b) => (b.children ?? []).map((c: any) => c?.text ?? '').join(''))
    .filter(Boolean)
    .join(' ')
    .slice(0, 300)
}

const categoryColors: Record<string, string> = {
  'Digital Marketing': '#FF5C00',
  'Marketing Digitale': '#FF5C00',
  'Paid Advertising': '#FF5C00',
  'TikTok Marketing': '#FF385C',
  'Digital Strategy': '#7B61FF',
  'Paid ADS': '#FF5C00',
  TikTok: '#FF385C',
  'Influencer Marketing': '#00C8FF',
  'Social Media': '#00C851',
}

// ── static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  try {
    const slugs = await getBlogPostSlugs('it')
    return (slugs ?? []).map((s: { slug: string }) => ({ slug: s.slug }))
  } catch {
    return []
  }
}

// ── metadata ──────────────────────────────────────────────────────────────────

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug, 'it')
  if (!post) return { title: 'Articolo non trovato' }

  // Brand suffix is appended automatically by the root layout's title
  // template — neither the metaTitle (from Sanity) nor post.title should
  // pre-include "| Pota Studio".
  const title = post.metaTitle ?? post.title
  const description =
    post.metaDescription ?? post.excerpt ?? ptToText(post.body ?? [])

  // Hreflang: resolve the EN counterpart's *actual* slug via Sanity
  // `translationOf`. If no counterpart exists, only the IT URL is emitted.
  const alternates = await buildBlogAlternates(post._id, slug, 'it')

  return {
    title,
    description,
    keywords: [post.primaryKeyword, ...(post.secondaryKeywords ?? [])].filter(Boolean).join(', '),
    authors: post.author?.slug
      ? [{ name: post.author.name, url: `https://www.potastudio.com/author/${post.author.slug}` }]
      : [{ name: 'Pota Studio', url: 'https://www.potastudio.com' }],
    alternates,
    openGraph: {
      type: 'article',
      locale: 'it_IT',
      alternateLocale: ['en_US'],
      title: post.title,
      description,
      url: `https://www.potastudio.com/it/blog/${slug}`,
      siteName: 'Pota Studio',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: post.author?.name ? [post.author.name] : ['Pota Studio'],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@potastudio',
      creator: post.author?.name ? '@sebbonfanti' : '@potastudio',
      title,
      description,
    },
    robots: post.noIndex ? { index: false, follow: false } : undefined,
  }
}

// ── page ──────────────────────────────────────────────────────────────────────

export default async function BlogPostPageIT({ params }: Props) {
  const { slug } = await params
  const [post, leadMagnet] = await Promise.all([
    getBlogPostBySlug(slug, 'it'),
    getDefaultLeadMagnet(),
  ])

  if (!post) notFound()

  // Articoli correlati per il blocco "Altri articoli" — rafforza i link
  // interni verso gli articoli che GSC segnala "rilevati ma non scansionati".
  const categorySlugs = (post.categories ?? [])
    .map((c: { slug?: string }) => c?.slug)
    .filter(Boolean) as string[]
  const relatedPosts = await getRelatedBlogPosts(slug, 'it', categorySlugs, 3)

  const enSlug = await getTranslationSlug(post._id, 'it')
  const rawCategory = post.categories?.[0]
  const category: string =
    typeof rawCategory === 'string'
      ? rawCategory
      : rawCategory?.title ?? 'Marketing Digitale'
  const accent = categoryColors[category] ?? '#FF5C00'
  const authorName = post.author?.name ?? 'Pota Studio'
  const authorRole = post.author?.role ?? 'Founder & CEO'
  // See EN counterpart — author slug threads into the Article JSON-LD so
  // Google can merge the byline with the /it/autore/[slug] profile page.
  const authorSlug =
    post.author?.slug && post.author?.name && post.author.name !== 'Pota Studio'
      ? (post.author.slug as string)
      : undefined
  const coverSrc = post.coverImageUrl ?? null
  const coverAlt = post.coverImageAlt ?? post.title

  // ── Structured data (centralized library) ────────────────────────────────
  const article = articleSchema({
    slug,
    title: post.title,
    description: post.metaDescription ?? post.excerpt ?? '',
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    authorName,
    authorRole,
    authorSlug,
    keywords: [post.primaryKeyword, ...(post.secondaryKeywords ?? [])].filter(Boolean) as string[],
    locale: 'it',
    section: 'blog',
  })
  // FAQ resolution order:
  //   1) curated faqItems from Sanity (editor-validated)
  //   2) H2-extracted FAQs from the body (auto-mined from Q-style articles)
  // PLUS: when the post has a `quickAnswer`, the (post.title, quickAnswer)
  // pair is prepended as the lead FAQ so the visible TL;DR block doubles
  // as the article's primary FAQPage entry.
  const pageUrl = `https://www.potastudio.com/it/blog/${slug}`
  const faqItems = resolveFaqItems({
    curated: post.faqItems,
    body: post.body,
    postTitle: post.title,
    quickAnswer: post.quickAnswer,
  })
  const faq = faqPageSchema(faqItems, { pageUrl, locale: 'it' })

  return (
    <>
      <JsonLd data={article} />
      {faq && <JsonLd data={faq} />}
      <JsonLd data={speakableSchema(`https://www.potastudio.com/it/blog/${slug}`, ['h1', '[itemprop="description"]', '[itemprop="articleBody"]'])} />

      <main>
        <article
          itemScope
          itemType="https://schema.org/Article"
          itemID={`https://www.potastudio.com/it/blog/${slug}#article`}
        >
          {/* Hero */}
          <header className="pt-40 pb-12 bg-[#0D0D0D]">
            <div className="container-site" style={{ maxWidth: '56rem' }}>
              <Link
                href="/it/blog"
                className="inline-flex items-center gap-2 text-sm text-[#B0B0B0] hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft size={14} />
                Tutti gli articoli
              </Link>
              <Breadcrumbs
                className="mb-10"
                items={[
                  { name: 'Home', url: '/it' },
                  { name: 'Blog', url: '/it/blog' },
                  { name: post.title, url: `/it/blog/${slug}` },
                ]}
              />
              <span
                className="text-xs font-semibold uppercase tracking-widest mb-6 block"
                style={{ color: accent }}
                itemProp="articleSection"
              >
                {category}
              </span>
              <h1
                className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6 text-balance"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
                itemProp="headline"
              >
                {post.title}
              </h1>
              {post.excerpt && (
                <p
                  className="text-[#B0B0B0] text-xl leading-relaxed mb-8 max-w-2xl"
                  itemProp="description"
                >
                  {post.excerpt}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-6 text-sm text-[#B0B0B0]">
                {/* Byline — link to the IT author profile when the slug is
                    available; the page is mounted at /it/autore/[slug]. */}
                <span className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#FF5C00]/20 flex items-center justify-center">
                    <span className="text-[#FF5C00] text-xs font-bold">{authorName[0]}</span>
                  </div>
                  {authorSlug ? (
                    <Link
                      href={`/it/autore/${authorSlug}`}
                      className="hover:text-white transition-colors"
                      rel="author"
                    >
                      {authorName} · {authorRole}
                    </Link>
                  ) : (
                    <span>
                      {authorName} · {authorRole}
                    </span>
                  )}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} />
                  {formatReadTime(post.readingTime)}
                </span>
                {post.publishedAt && (
                  <time
                    className="flex items-center gap-1.5"
                    dateTime={post.publishedAt}
                    itemProp="datePublished"
                  >
                    <Calendar size={13} />
                    {formatDate(post.publishedAt)}
                  </time>
                )}
                {post.updatedAt && (
                  <meta itemProp="dateModified" content={post.updatedAt} />
                )}
              </div>
            </div>
          </header>

          {/* Quick Answer — subito sotto l'H1 */}
          {post.quickAnswer && (
            <div className="container-site -mt-2 mb-12" style={{ maxWidth: '56rem' }}>
              <QuickAnswer text={post.quickAnswer} accent={accent} label="Risposta Rapida" />
            </div>
          )}

          {/* Cover image */}
          <div className="container-site mb-16" style={{ maxWidth: '56rem' }}>
            {coverSrc ? (
              <Image
                src={coverSrc}
                alt={coverAlt}
                width={1600}
                height={900}
                priority
                sizes="(max-width: 768px) 100vw, 56rem"
                quality={85}
                className="w-full h-auto rounded-xl border border-white/10"
                itemProp="image"
              />
            ) : (
              <div
                className="w-full aspect-video rounded-xl flex items-center justify-center overflow-hidden"
                style={{ background: `${accent}10`, border: `1px solid ${accent}20` }}
                aria-hidden="true"
              >
                <span
                  className="text-[16rem] font-bold opacity-10 select-none leading-none"
                  style={{ fontFamily: 'var(--font-space-grotesk)', color: accent }}
                >
                  {category[0]}
                </span>
              </div>
            )}
          </div>

          {/* TL;DR — guard: only render if tldr is a non-empty string.
              Array-shaped tldr (legacy import bug) would crash React otherwise. */}
          {typeof post.tldr === 'string' && post.tldr && (
            <div className="container-site mb-12" style={{ maxWidth: '56rem' }}>
              <div className="rounded-xl p-6 bg-white/[0.03] border border-white/10">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#FF5C00] mb-2">
                  TL;DR
                </p>
                <p className="text-[#B0B0B0] text-base leading-relaxed">{post.tldr}</p>
              </div>
            </div>
          )}

          {/* Body */}
          <div
            className="container-site pb-16"
            style={{ maxWidth: '56rem' }}
            itemProp="articleBody"
          >
            <PortableTextRenderer value={post.body ?? []} accent={accent} locale="it" />

            {/* Key Statistics */}
            {post.keyStatistics?.length > 0 && (
              <section className="mt-16" aria-labelledby="key-statistics-heading">
                <h2
                  id="key-statistics-heading"
                  className="text-2xl font-bold text-white mb-6"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  Statistiche Chiave
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {post.keyStatistics.map(
                    (s: { stat: string; source?: string; year?: string }, i: number) => (
                      <div key={i} className="rounded-xl bg-white/[0.03] border border-white/10 p-5">
                        <p
                          className="text-2xl font-bold mb-1"
                          style={{ fontFamily: 'var(--font-space-grotesk)', color: accent }}
                        >
                          {s.stat}
                        </p>
                        {s.source && (
                          <p className="text-xs text-[#B0B0B0]">
                            {s.source}
                            {s.year ? ` (${s.year})` : ''}
                          </p>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </section>
            )}

            {/* Key Takeaways */}
            {post.keyTakeaways?.length > 0 && (
              <KeyTakeaways items={post.keyTakeaways} accent={accent} title="Punti Chiave" />
            )}

            {/* Lead Magnet — cattura email tra body e FAQ */}
            <LeadMagnetBox location={`blog_${post.slug?.current ?? 'post'}`} locale="it" data={leadMagnet} />

            {/* FAQ — abbinato a FAQPage JSON-LD nel <head>. Markup visibile con
                <details>/<summary> + microdata schema.org per accessibilità e
                crawler-readability. */}
            <FaqSection
              items={faqItems}
              accent={accent}
              title="Domande Frequenti"
            />

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="mt-12 flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium border border-white/20 text-[#B0B0B0]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Author Authority Box */}
            <AuthorAuthorityBox author={post.author ?? {}} accent={accent} locale="it" />

            {/* Language switcher */}
            {enSlug && (
              <div className="mt-10 pt-8 border-t border-white/10">
                <p className="text-xs text-[#B0B0B0] mb-3">Disponibile anche in:</p>
                <Link
                  href={`/blog/${enSlug}`}
                  className="inline-flex items-center gap-2 text-sm font-medium border border-white/20 rounded-lg px-4 py-2 text-[#B0B0B0] hover:text-white hover:border-white/40 transition-all"
                  hrefLang="en"
                >
                  Read in English
                </Link>
              </div>
            )}

            {/* Altri articoli — boost di link interni per la copertura crawl */}
            <RelatedPosts posts={relatedPosts as never} locale="it" />
          </div>
        </article>

        {/* Sticky mobile CTA — prompt contatto non invasivo per i lettori blog */}
        <StickyMobileCta locale="it" location={`blog_${post.slug?.current ?? 'post'}`} />
      </main>
    </>
  )
}
