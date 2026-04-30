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
