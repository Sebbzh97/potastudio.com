import { client } from './client'

// ── PROJECTIONS ───────────────────────────────────────────────────────────────

const listingProjection = `
  _id,
  title,
  "slug": slug.current,
  language,
  publishedAt,
  readingTime,
  excerpt,
  coverImage { asset, alt, caption },
  "author": author->{ name, role, "photo": photo { asset, alt } },
  "categories": categories[]->{ title, "slug": slug.current, color }
`

const fullProjection = `
  _id,
  title,
  "slug": slug.current,
  language,
  publishedAt,
  updatedAt,
  readingTime,
  excerpt,
  coverImage { asset, alt, caption },
  "author": author->{
  _id,
  name,
  "slug": slug.current,
  role,
  bio,
  "photo": photo { asset, alt },
  linkedin,
  twitterX,
  "credentials": credentials[]
  },
  "categories": categories[]->{ title, "slug": slug.current, color, description },
  tags,
  body[] {
    ...,
    _type == "image" => { asset, alt, caption, fullWidth },
  },
  faqItems[] { question, answer },
  keyTakeaways,
  keyStatistics[] { stat, source, year },
  expertQuotes[] { quote, attribution, role },
  tldr,
  quickAnswer,
  targetSearchQueries,
  metaTitle,
  metaDescription,
  primaryKeyword,
  secondaryKeywords,
  canonicalUrl,
  noIndex,
  ogImage { asset, alt },
  "relatedPosts": relatedPosts[]->{ title, "slug": slug.current, excerpt, coverImage { asset, alt }, publishedAt }
`

// ── QUERIES ───────────────────────────────────────────────────────────────────

/**
 * Fetch all published blog posts for a given language, newest first.
 * Used for the /blog listing page.
 */
export async function getAllBlogPosts(lang: string) {
  return client
    .fetch(
      `*[_type == "blogPost" && language == $lang && isPublished != false] | order(publishedAt desc) {
        ${listingProjection}
      }`,
      { lang },
      { cache: 'no-store' },
    )
    .catch(() => null)
}

/**
 * Fetch a single blog post by slug and language.
 * Used for the /blog/[slug] detail page.
 */
export async function getBlogPostBySlug(slug: string, lang: string) {
  return client
    .fetch(
      `*[_type == "blogPost" && slug.current == $slug && language == $lang && isPublished != false][0] {
        ${fullProjection}
      }`,
      { slug, lang },
      { cache: 'no-store' },
    )
    .catch(() => null)
}

/**
 * Fetch all posts belonging to a specific category slug and language.
 */
export async function getBlogPostsByCategory(categorySlug: string, lang: string) {
  return client
    .fetch(
      `*[_type == "blogPost" && language == $lang && isPublished != false && $categorySlug in categories[]->slug.current] | order(publishedAt desc) {
        ${listingProjection}
      }`,
      { categorySlug, lang },
      { cache: 'no-store' },
    )
    .catch(() => null)
}

/**
 * Fetch the most recent N posts for a given language.
 */
export async function getRecentBlogPosts(lang: string, limit: number = 3) {
  return client
    .fetch(
      `*[_type == "blogPost" && language == $lang && isPublished != false] | order(publishedAt desc) [0...$limit] {
        ${listingProjection}
      }`,
      { lang, limit },
      { cache: 'no-store' },
    )
    .catch(() => null)
}

/**
 * Fetch only slug values — used in generateStaticParams.
 */
export async function getBlogPostSlugs(lang: string) {
  return client
    .fetch(
      `*[_type == "blogPost" && language == $lang && isPublished != false] { "slug": slug.current }`,
      { lang },
      { cache: 'no-store' },
    )
    .catch(() => [] as { slug: string }[])
}

/**
 * Given a post's _id and target language, return the slug of the translation.
 * EN posts carry no translationOf; IT posts reference the EN post via translationOf.
 * So to go EN→IT: find the IT post that references this EN post's _id.
 * To go IT→EN: dereference translationOf on the current post.
 */
export async function getTranslationSlug(postId: string, fromLang: string): Promise<string | null> {
  try {
    if (fromLang === 'en') {
      // Find the IT post whose translationOf points to this EN _id
      const result = await client.fetch(
        `*[_type == "blogPost" && language == "it" && translationOf._ref == $id && isPublished != false][0] {
          "slug": slug.current
        }`,
        { id: postId },
        { cache: 'no-store' },
      )
      return result?.slug ?? null
    } else {
      // Dereference translationOf on this IT post to get the EN slug
      const result = await client.fetch(
        `*[_type == "blogPost" && _id == $id][0] {
          "slug": translationOf->slug.current
        }`,
        { id: postId },
        { cache: 'no-store' },
      )
      return result?.slug ?? null
    }
  } catch {
    return null
  }
}

// ── AUTHOR PAGES ──────────────────────────────────────────────────────────────
//
// Powers the dedicated /author/[slug] (EN) and /it/autore/[slug] (IT) routes.
// We expose three helpers:
//   - getAllAuthorSlugs    → static params for prerendering
//   - getAuthorBySlug      → full profile (long bio, expertise, social, etc.)
//   - getPostsByAuthor     → that author's articles in a given language

const authorProfileProjection = `
  _id,
  name,
  "slug": slug.current,
  role,
  bio,
  longBio,
  longBio_it,
  expertise,
  yearsOfExperience,
  location,
  email,
  website,
  linkedin,
  twitterX,
  instagram,
  "photo": photo { asset, alt },
  "credentials": credentials[]
`

/**
 * Slugs of every blogAuthor document, used by generateStaticParams.
 * Returns a stable shape `{ slug: string }[]`.
 */
export async function getAllAuthorSlugs(): Promise<{ slug: string }[]> {
  return client
    .fetch(
      `*[_type == "blogAuthor" && defined(slug.current)] { "slug": slug.current }`,
      {},
      { cache: 'no-store' },
    )
    .catch(() => [] as { slug: string }[])
}

/**
 * Full author profile by slug. Returns null when not found so callers can
 * trigger notFound() cleanly.
 */
export async function getAuthorBySlug(slug: string) {
  return client
    .fetch(
      `*[_type == "blogAuthor" && slug.current == $slug][0] {
        ${authorProfileProjection}
      }`,
      { slug },
      { cache: 'no-store' },
    )
    .catch(() => null)
}

/**
 * Posts written by a specific author in a specific language. Sorted by
 * publishedAt desc. Used to power the "Articles" section of /author/[slug].
 * Reuses `listingProjection` so the cards render identically to /blog.
 */
export async function getPostsByAuthor(authorSlug: string, lang: string) {
  return client
    .fetch(
      `*[_type == "blogPost"
          && language == $lang
          && isPublished != false
          && author->slug.current == $authorSlug
        ] | order(publishedAt desc) {
        ${listingProjection}
      }`,
      { authorSlug, lang },
      { cache: 'no-store' },
    )
    .catch(() => null)
}

// ── LEAD MAGNET ───────────────────────────────────────────────────────────────

export type LeadMagnetData = {
  _id: string
  isActive: boolean
  eyebrow: string
  badge: string
  headline: string
  subhead: string
  socialProof: string
  ctaLabel: string
  successMessage: string
  downloadCtaLabel: string
  consentText: string
  emailPlaceholder: string
  eyebrow_it?: string
  badge_it?: string
  headline_it?: string
  subhead_it?: string
  socialProof_it?: string
  ctaLabel_it?: string
  successMessage_it?: string
  downloadCtaLabel_it?: string
  consentText_it?: string
  emailPlaceholder_it?: string
  pdfFallbackUrl?: string
  pageCount?: number
}

const leadMagnetProjection = `
  _id,
  isActive,
  eyebrow, badge, headline, subhead, socialProof, ctaLabel,
  successMessage, downloadCtaLabel, consentText, emailPlaceholder,
  eyebrow_it, badge_it, headline_it, subhead_it, socialProof_it,
  ctaLabel_it, successMessage_it, downloadCtaLabel_it, consentText_it,
  emailPlaceholder_it,
  "pdfFallbackUrl": pdfAsset.asset->url,
  pageCount
`

/**
 * Fetch the active default lead magnet (slug == 'default').
 * Falls back to null so callers can safely fall back to hardcoded copy.
 */
export async function getDefaultLeadMagnet(): Promise<LeadMagnetData | null> {
  try {
    return await client.fetch(
      `*[_type == "leadMagnet" && slug.current == "default" && isActive == true][0] {
        ${leadMagnetProjection}
      }`,
      {},
      { next: { revalidate: 3600 } },
    )
  } catch {
    return null
  }
}
