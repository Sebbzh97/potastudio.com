/**
 * page-queries.ts — page-level Sanity fetchers.
 *
 * All page documents use the unified `pageContent` type with a `pageId` field.
 * Site-wide config (nav + footer) lives in `siteSettings`.
  * Content types: blogPost, caseStudy, teamMember, jobOpening, testimonial, client.
 */
import { client } from './client'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = Record<string, any>

export interface SanityTestimonial {
  _id: string
  quote: string
  quoteIt?: string
  author: string
  role?: string
  company?: string
  rating?: number
  featured?: boolean
  avatarUrl?: string
}

export interface SanityCaseStudy {
  _id: string
  slug: string
  client: string
  type?: string
  category?: string
  year?: string
  bg?: string
  accent?: string
  // English (canonical) content
  description?: string
  challenge?: string
  approach?: string
  results?: string
  tags?: string[]
  services?: string[]
  metrics?: { label: string; value: string }[]
  metric?: string
  // Italian translations (fall back to EN when empty)
  descriptionIt?: string
  challengeIt?: string
  approachIt?: string
  resultsIt?: string
  tagsIt?: string[]
  servicesIt?: string[]
  metricsIt?: { label: string; value: string }[]
  metricIt?: string
  // Common
  relatedSlugs?: string[]
  featured?: boolean
  coverImageUrl?: string
  gallery?: { id: string; src: string }[]
  galleryUrls?: string[]
  youtubeVideoId?: string
}

/**
 * Picks the localized case-study content for a given locale.
 * IT fields fall back to their EN counterpart when empty so editors can
 * roll out translations gradually without breaking the live site.
 */
export type Locale = 'en' | 'it'
export function pickLocalizedCaseStudy(
  cs: SanityCaseStudy,
  locale: Locale,
): SanityCaseStudy {
  if (locale !== 'it') return cs
  const pickStr = (it?: string, en?: string) =>
    it && it.trim().length > 0 ? it : en
  const pickArr = <T,>(it?: T[], en?: T[]) =>
    it && it.length > 0 ? it : en
  return {
    ...cs,
    description: pickStr(cs.descriptionIt, cs.description),
    challenge: pickStr(cs.challengeIt, cs.challenge),
    approach: pickStr(cs.approachIt, cs.approach),
    results: pickStr(cs.resultsIt, cs.results),
    metric: pickStr(cs.metricIt, cs.metric),
    tags: pickArr(cs.tagsIt, cs.tags),
    services: pickArr(cs.servicesIt, cs.services),
    metrics: pickArr(cs.metricsIt, cs.metrics),
  }
}

export interface SanityClient {
  _id: string
  name: string
  industry?: string
  country?: string
  logoUrl?: string
  featured?: boolean
  order?: number
}

export interface SanityTeamMember {
  _id: string
  name: string
  role: string
  roleIt?: string
  bio: string
  bioIt?: string
  linkedin?: string
  initial?: string
  photoUrl?: string
  order?: number
}

/** Fetch a single `pageContent` document by its pageId + language */
const getPage = (pageId: string, lang: string): Promise<Doc | null> =>
  client
    .fetch(
      `*[_type == "pageContent" && pageId == $pageId && language == $lang && isPublished != false][0]`,
      { pageId, lang },
      { next: { tags: ['pageContent', `pageContent-${pageId}-${lang}`] } },
    )
    .then((r: Doc | null) => r ?? null)
    .catch(() => null)

/** Fetch siteSettings — includes nav items, footer, and socials */
export const getSiteSettings = (lang = 'en'): Promise<Doc | null> =>
  client
    .fetch(
      `*[_type == "siteSettings" && language == $lang][0]`,
      { lang },
      { next: { tags: ['siteSettings', `siteSettings-${lang}`] } },
    )
    .then((r: Doc | null) => r ?? null)
    .catch(() => null)

export const getHomepage     = (lang = 'en') => getPage('homepage',     lang)
export const getServicesPage = (lang = 'en') => getPage('servicesPage', lang)
export const getAboutPage    = (lang = 'en') => getPage('aboutPage',    lang)
export const getContactPage  = (lang = 'en') => getPage('contactPage',  lang)
export const getWorkPage     = (lang = 'en') => getPage('workPage',     lang)
export const getCareersPage  = (lang = 'en') => getPage('careersPage',  lang)
export const getClientsPage  = (lang = 'en') => getPage('clientsPage',  lang)
export const getBlogPage     = (lang = 'en') => getPage('blogPage',     lang)
export const getPrivacyPage  = (lang = 'en') => getPage('privacyPage',  lang)
export const getCookiePage   = (lang = 'en') => getPage('cookiePage',   lang)

/** Returns all testimonials, featured ones first */
export const getTestimonials = (): Promise<SanityTestimonial[]> =>
  client
    .fetch(
`*[_type == "testimonial"] | order(featured desc, _createdAt asc) {
  _id, quote, quoteIt, author, role, company, rating, featured,
  "avatarUrl": avatar.asset->url
  }`,
      {},
      { next: { tags: ['testimonials'] } },
    )
    .then((r: SanityTestimonial[]) => r ?? [])
    .catch(() => [])

/** Returns all published case studies ordered by featured, then year desc */
export const getCaseStudies = (): Promise<SanityCaseStudy[]> =>
  client
    .fetch(
  `*[_type == "caseStudy" && isPublished != false] | order(featured desc, year desc) {
  _id,
  "slug": slug.current,
  client, type, category, year, bg, accent,
  description, challenge, approach, results,
  tags, services, metrics, metric,
  descriptionIt, challengeIt, approachIt, resultsIt,
  tagsIt, servicesIt, metricsIt, metricIt,
  relatedSlugs, featured,
  "coverImageUrl": coverImage.asset->url,
  galleryUrls
  }`,
      {},
      { next: { tags: ['caseStudy'] } },
    )
    .then((r: SanityCaseStudy[]) => r ?? [])
    .catch(() => [])

/** Returns a single case study by slug */
export const getCaseStudyBySlug = (slug: string): Promise<SanityCaseStudy | null> =>
  client
    .fetch(
      `*[_type == "caseStudy" && slug.current == $slug && isPublished != false][0] {
        _id,
        "slug": slug.current,
        client, type, category, year, bg, accent,
        description, challenge, approach, results,
        tags, services, metrics, metric,
        descriptionIt, challengeIt, approachIt, resultsIt,
        tagsIt, servicesIt, metricsIt, metricIt,
        relatedSlugs, featured,
        "coverImageUrl": coverImage.asset->url,
  "gallery": gallery[]{
  "id": _key,
  "src": asset->url
  },
  galleryUrls,
  youtubeVideoId
  }`,
  { slug },
      { next: { tags: ['caseStudy', `caseStudy-${slug}`] } },
    )
    .then((r: SanityCaseStudy | null) => r ?? null)
    .catch(() => null)

/** Returns all team members ordered by display order */
export const getTeamMembers = (): Promise<SanityTeamMember[]> =>
  client
    .fetch(
      `*[_type == "teamMember"] | order(order asc, _createdAt asc) {
        _id, name, role, roleIt, bio, bioIt, linkedin, initial, order,
        "photoUrl": photo.asset->url
      }`,
      {},
      { next: { tags: ['teamMember'] } },
    )
    .then((r: SanityTeamMember[]) => r ?? [])
    .catch(() => [])

/** Returns all clients ordered by display order, then name */
export const getClients = (): Promise<SanityClient[]> =>
  client
    .fetch(
      `*[_type == "client"] | order(order asc, name asc) {
        _id, name, industry, country, featured, order,
        "logoUrl": logo.asset->url
      }`,
      {},
      { next: { tags: ['client'] } },
    )
    .then((r: SanityClient[]) => r ?? [])
    .catch(() => [])

export interface SanityJobOpening {
  _id: string
  title: string
  titleIt?: string
  department?: string
  location?: string
  workMode?: string
  type?: string
  description?: string
  descriptionIt?: string
  applyEmail?: string
  slug?: string
  featured?: boolean
  publishedAt?: string
}

/** Returns active job openings ordered by featured, then publishedAt desc */
export const getJobOpenings = (): Promise<SanityJobOpening[]> =>
  client
    .fetch(
      `*[_type == "jobOpening" && isActive != false] | order(featured desc, publishedAt desc) {
        _id, title, titleIt, department, location, workMode, type,
        description, descriptionIt, applyEmail, featured, publishedAt,
        "slug": slug.current
      }`,
      {},
      { next: { tags: ['jobOpenings', 'jobOpening'] } },
    )
    .then((r: SanityJobOpening[]) => r ?? [])
    .catch(() => [])

export interface SanityBlogPost {
  _id: string
  slug: string
  language: string
  title: string
  excerpt?: string
  readingTime?: number
  publishedAt?: string
  coverImageUrl?: string
  coverImageAlt?: string
  categories?: string[]   // resolved category titles
  tags?: string[]
  author?: { name?: string; avatarUrl?: string; credentials?: string }
  featured?: boolean
}

/** Returns published blog posts, newest first */
export const getBlogPosts = (lang = 'en'): Promise<SanityBlogPost[]> =>
  client
    .fetch(
      `*[_type == "blogPost" && language == $lang && isPublished != false] | order(publishedAt desc) {
        _id,
        "slug": slug.current,
        language, title, excerpt, readingTime, publishedAt, tags,
        "coverImageUrl": coverImage.asset->url,
        "coverImageAlt": coverImage.alt,
        "categories": categories[]->title,
        "author": author->{ name, credentials, "avatarUrl": avatar.asset->url }
      }`,
      { lang },
      { cache: 'no-store' },
    )
    .then((r: SanityBlogPost[]) => r ?? [])
    .catch(() => [])
