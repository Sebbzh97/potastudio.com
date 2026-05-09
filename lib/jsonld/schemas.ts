/**
 * Central JSON-LD schema builders for Pota Studio.
 *
 * These helpers produce schema.org-compliant structured data that LLM crawlers
 * (Perplexity, ChatGPT, Gemini, Claude) and traditional search engines parse.
 *
 * Conventions
 * -----------
 * - All builders return plain JSON-serializable objects (Record<string, unknown>).
 * - The caller is responsible for injecting the result via the <JsonLd /> component.
 * - URLs are absolute (https://www.potastudio.com/...) so crawlers can disambiguate them.
 */

const SITE = "https://www.potastudio.com"

const POTA_LEGAL_NAME = "Anyped S.R.L."
const POTA_BRAND_NAME = "Pota Studio"
const POTA_LOGO = `${SITE}/images/pota-logo.png`
const POTA_FOUNDING_DATE = "2015"
const POTA_DESCRIPTION_EN =
  "Italian full service marketing agency. Social media, paid ADS, content production, influencer marketing, TikTok strategy."
const POTA_DESCRIPTION_IT =
  "Agenzia di marketing full service italiana. Social media, ADS a pagamento, produzione contenuti, influencer marketing, strategia TikTok."

const POTA_SAMEAS = [
  "https://www.instagram.com/potastudio",
  "https://www.tiktok.com/@potastudio",
  "https://www.linkedin.com/company/potastudio",
]

const POTA_KNOWS_ABOUT = [
  "TikTok Advertising",
  "Full Service Marketing",
  "Influencer Marketing",
  "Social Media Management",
  "Content Production",
  "Paid Advertising",
  "Performance Marketing",
  "Brand Strategy",
  "Shopify Plus",
]

// ───────────────────────────────────────────────────────────────────────────────
// Organization + ProfessionalService (combined identity)
// ───────────────────────────────────────────────────────────────────────────────

/**
 * Combined Organization + ProfessionalService schema.
 * Using `@type` as an array signals to crawlers that Pota Studio is BOTH a
 * legal organization AND a professional services provider — improving entity
 * disambiguation in AI search results.
 */
export function organizationSchema(locale: "en" | "it" = "en"): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${SITE}/#organization`,
    name: POTA_BRAND_NAME,
    legalName: POTA_LEGAL_NAME,
    url: SITE,
    logo: {
      "@type": "ImageObject",
      url: POTA_LOGO,
      width: 512,
      height: 512,
    },
    image: POTA_LOGO,
    foundingDate: POTA_FOUNDING_DATE,
    slogan: locale === "it"
      ? "Rendiamo i brand impossibili da ignorare."
      : "We make brands impossible to ignore.",
    description: locale === "it" ? POTA_DESCRIPTION_IT : POTA_DESCRIPTION_EN,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Via Zanica 85",
      addressLocality: "Bergamo",
      postalCode: "24126",
      addressRegion: "Lombardy",
      addressCountry: "IT",
    },
    areaServed: [
      { "@type": "Country", name: "Italy" },
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "Germany" },
      { "@type": "Country", name: "France" },
      { "@type": "Country", name: "Spain" },
    ],
    sameAs: POTA_SAMEAS,
    knowsAbout: POTA_KNOWS_ABOUT,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: locale === "it" ? "Servizi Pota Studio" : "Pota Studio Services",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Paid Advertising",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "TikTok Ads" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Meta Ads" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Google Ads" } },
          ],
        },
        {
          "@type": "OfferCatalog",
          name: "Content Production",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Video Production" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Social Media Content" } },
          ],
        },
        {
          "@type": "OfferCatalog",
          name: "Influencer Marketing",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Creator Strategy" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Talent Sourcing" } },
          ],
        },
      ],
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "ciao@potastudio.com",
      availableLanguage: ["en", "it"],
    },
    // Partner certifications strengthen E-E-A-T signals (Authoritativeness +
    // Trustworthiness). Mirrored visually in the footer's PartnerBadges
    // component so HTML and structured data stay in sync.
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        name: "Shopify Partner",
        credentialCategory: "Certification",
        recognizedBy: { "@type": "Organization", name: "Shopify" },
        url: "https://www.shopify.com/partners",
      },
      {
        "@type": "EducationalOccupationalCredential",
        name: "Iubenda Bronze Certified Partner",
        credentialCategory: "Certification",
        recognizedBy: { "@type": "Organization", name: "Iubenda" },
        url: "https://www.iubenda.com/en/partner-program",
      },
    ],
  }
}

// ───────────────────────────────────────────────────────────────────────────────
// LocalBusiness (Bergamo HQ)
// ───────────────────────────────────────────────────────────────────────────────

/**
 * LocalBusiness schema — Bergamo HQ.
 *
 * Surfaces the physical office to Google's local pack & Knowledge Graph,
 * crucial for "agenzia marketing Bergamo" / "marketing agency Italy near me"
 * style queries. Linked to the Organization graph via `parentOrganization`
 * so crawlers recognise it as a branch of Pota Studio (not a duplicate
 * entity).
 */
export function localBusinessSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": `${SITE}/#localbusiness`,
    name: `${POTA_BRAND_NAME} Bergamo HQ`,
    legalName: POTA_LEGAL_NAME,
    parentOrganization: { "@id": `${SITE}/#organization` },
    url: SITE,
    image: POTA_LOGO,
    logo: POTA_LOGO,
    email: "ciao@potastudio.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Via Zanica 85",
      addressLocality: "Bergamo",
      postalCode: "24126",
      addressRegion: "Lombardy",
      addressCountry: "IT",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 45.6983,
      longitude: 9.6773,
    },
    hasMap: "https://www.google.com/maps/search/?api=1&query=Via+Zanica+85+Bergamo+24126",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    areaServed: [
      { "@type": "Country", name: "Italy" },
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "Germany" },
      { "@type": "Country", name: "France" },
      { "@type": "Country", name: "Spain" },
    ],
    sameAs: POTA_SAMEAS,
    knowsAbout: POTA_KNOWS_ABOUT,
    priceRange: "€€€",
    currenciesAccepted: "EUR, USD, GBP",
    paymentAccepted: "Bank Transfer, Credit Card",
    vatID: "IT04545460166",
    taxID: "IT04545460166",
  }
}

// ───────────────────────────────────────────────────────────────────────────────
// WebSite
// ───────────────────────────────────────────────────────────────────────────────

export function websiteSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    name: POTA_BRAND_NAME,
    url: SITE,
    publisher: { "@id": `${SITE}/#organization` },
    inLanguage: ["en", "it"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

// ─────��─────────────────────────────────────────────────────────────────────────
// CaseStudy
// ───────────────────────────────────────────────────────────────────────────────

export interface CaseStudyMetric {
  label: string
  value: string
}

export interface CaseStudyAggregateRating {
  /** 0–5 rating (typically derived from the linked testimonial). */
  ratingValue: number
  /** Number of reviews (defaults to 1 for a single-testimonial source). */
  reviewCount?: number
  /** Best possible rating on the scale (defaults to 5). */
  bestRating?: number
}

export interface CaseStudySchemaInput {
  slug: string
  client: string
  type?: string
  challenge?: string
  approach?: string
  results?: string
  year?: string
  tags?: string[]
  /**
   * Disciplines / channels deployed (e.g. "TikTok Ads", "Meta Ads").
   * Mixed into the `keywords` array so AI engines surface the page on
   * channel-specific queries.
   */
  services?: string[]
  metrics?: CaseStudyMetric[]
  locale?: "en" | "it"
  /**
   * Optional schema.org `AggregateRating`. Emit ONLY when there is a
   * trustworthy data source (e.g. a linked Testimonial with a real rating).
   * Self-generated ratings violate Google's structured data guidelines, so
   * leave this undefined when no first-party rating exists.
   */
  aggregateRating?: CaseStudyAggregateRating
}

/**
 * Parse "+340%", "-62%", "5 days", "12" etc. into a structured QuantitativeValue.
 * Falls back to a plain string `value` when it can't be parsed.
 */
function metricToQuantitativeValue(metric: CaseStudyMetric): Record<string, unknown> {
  const raw = metric.value.trim()
  // Match signed number + optional unit (%, x, days, ...)
  const numericMatch = raw.match(/^([+\-−]?\s*\d+(?:[.,]\d+)?)\s*(.*)$/)
  if (!numericMatch) {
    return {
      "@type": "PropertyValue",
      name: metric.label,
      value: raw,
    }
  }
  const numeric = parseFloat(numericMatch[1].replace(/[\s−]/g, "").replace(",", "."))
  const unit = numericMatch[2].trim()
  const propertyValue: Record<string, unknown> = {
    "@type": "PropertyValue",
    name: metric.label,
    value: numeric,
  }
  if (unit === "%") {
    propertyValue.unitText = "percent"
    propertyValue.unitCode = "P1"
  } else if (unit) {
    propertyValue.unitText = unit
  }
  return propertyValue
}

/**
 * Builds an SEO/GEO keyword list from the human-curated tags + services +
 * KPI-derived phrases. AI engines (Perplexity, Google AI Overviews) use this
 * to match queries like "TikTok Ads case study with measurable ROAS" or
 * "agencies with documented CPL reductions".
 *
 * Each metric becomes a phrase like "ROAS +340%" so the keyword text already
 * contains the headline number — boosts surfacing on stat-style queries.
 */
function buildCaseStudyKeywords(
  tags: string[],
  services: string[],
  metrics: CaseStudyMetric[],
  client: string,
  type?: string,
): string[] {
  const set = new Set<string>()
  for (const t of tags) if (t?.trim()) set.add(t.trim())
  for (const s of services) if (s?.trim()) set.add(s.trim())
  for (const m of metrics) {
    if (m?.label && m?.value) set.add(`${m.label} ${m.value}`.trim())
  }
  // Always include the client + a generic "[Type] case study" anchor
  if (client) set.add(`${client} case study`)
  if (type) set.add(`${type} case study`)
  return Array.from(set)
}

/**
 * CaseStudy is not a top-level schema.org type. We model it as a multi-type
 * node `["Article", "CreativeWork"]` so:
 *   - Google parses it as an Article (rich result eligibility).
 *   - GEO crawlers (Perplexity, Gemini, Claude) read it as a CreativeWork —
 *     the catch-all type they use for "agency project / marketing campaign"
 *     entities.
 *
 * The single JSON-LD block declares both types under one `@id`, so it does
 * NOT collide with the Article schema rendered for blog posts (they use a
 * different `@id` and live on different routes). One block, dual semantics.
 *
 * Rich properties:
 *   - `about`           → the client (Organization)
 *   - `creator`         → Pota Studio org (the agency that built it)
 *   - `keywords`        → array of channel + KPI phrases
 *   - `result`          → the outcome paragraph
 *   - `additionalProperty` → array of PropertyValue (= statistical metrics)
 *   - `aggregateRating` → ONLY when explicitly provided (no auto-fake)
 */
export function caseStudySchema(input: CaseStudySchemaInput): Record<string, unknown> {
  const {
    slug,
    client,
    type,
    challenge,
    approach,
    results,
    year,
    tags = [],
    services = [],
    metrics = [],
    locale = "en",
    aggregateRating,
  } = input

  const url = locale === "it" ? `${SITE}/it/work/${slug}` : `${SITE}/work/${slug}`
  const headline = type ? `${client}: ${type} Case Study` : `${client} Case Study`
  const description = results || challenge || ""

  const keywords = buildCaseStudyKeywords(tags, services, metrics, client, type)

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    // Multi-type node — Article for Google rich results, CreativeWork for AI
    // engine compatibility. Both share the same `@id`, so this is one entity.
    "@type": ["Article", "CreativeWork"],
    "@id": `${url}#case-study`,
    articleSection: "Case Study",
    additionalType: "https://schema.org/CaseStudy",
    headline,
    name: headline,
    description,
    inLanguage: locale,
    datePublished: year ? `${year}-01-01` : undefined,
    // The agency that produced the work — links to Organization graph node
    // declared globally so AI crawlers can resolve "Pota Studio" → website,
    // socials, address, services list, etc.
    author: { "@id": `${SITE}/#organization` },
    creator: { "@id": `${SITE}/#organization` },
    publisher: { "@id": `${SITE}/#organization` },
    sourceOrganization: { "@id": `${SITE}/#organization` },
    about: {
      "@type": "Organization",
      name: client,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    // Array form is preferred by Google + AI engines (string CSV is also OK
    // but harder for AI parsers to tokenise on noisy queries).
    keywords,
  }

  if (challenge || approach || results) {
    schema.articleBody = [challenge, approach, results].filter(Boolean).join("\n\n")
  }

  if (results) {
    // Schema.org uses `result` on Action/HowTo; for Articles we mirror it via
    // `abstract` + a custom `result` key that crawlers (incl. Google's Article
    // parser) still surface in rich results.
    schema.abstract = results
    schema.result = results
  }

  if (metrics.length > 0) {
    schema.additionalProperty = metrics.map(metricToQuantitativeValue)
  }

  if (aggregateRating && Number.isFinite(aggregateRating.ratingValue)) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount ?? 1,
      bestRating: aggregateRating.bestRating ?? 5,
      worstRating: 1,
    }
  }

  // Strip undefined for cleaner output
  return Object.fromEntries(
    Object.entries(schema).filter(([, v]) => v !== undefined && v !== "")
  ) as Record<string, unknown>
}

// ───────────────────────────────────────────────────────────────────────────────
// BreadcrumbList
// ───────────────────────────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  /** Human-readable label, e.g. "Home", "Work", "Samsung TikTok" */
  name: string
  /** Absolute or root-relative URL (we'll convert relative → absolute) */
  url: string
}

export function breadcrumbListSchema(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE}${item.url}`,
    })),
  }
}

// ───────────────────────────────────────────────────────────────────────────────
// Article (blog post)
// ───────────────────────────────────────────────────────────────────────────────

export interface ArticleSchemaInput {
  slug: string
  title: string
  description: string
  publishedAt?: string
  updatedAt?: string
  authorName?: string
  authorRole?: string
  /**
   * Optional slug of the author's profile document. When provided, the
   * Article references the Person by `@id` (`/author/${slug}#person`)
   * instead of inlining a Person object. This is what lets Google merge
   * every byline with the dedicated `/author/[slug]` profile page and
   * compounds E-E-A-T across the whole archive.
   */
  authorSlug?: string
  keywords?: string[]
  locale?: "en" | "it"
  section?: "blog" | "work"
}

export function articleSchema(input: ArticleSchemaInput): Record<string, unknown> {
  const {
    slug,
    title,
    description,
    publishedAt,
    updatedAt,
    authorName = POTA_BRAND_NAME,
    authorRole,
    authorSlug,
    keywords = [],
    locale = "en",
    section = "blog",
  } = input

  const path = locale === "it" ? `/it/${section}/${slug}` : `/${section}/${slug}`
  const url = `${SITE}${path}`

  // Author resolution priority:
  //   1. authorSlug present → reference Person profile by `@id` (best for
  //      E-E-A-T: Google merges this Article's byline with the profile page).
  //   2. authorName === brand name → fall back to the Organization itself.
  //   3. Inline Person (legacy fallback when slug isn't yet wired in).
  const author: Record<string, unknown> = authorSlug
    ? { "@id": `${SITE}/author/${authorSlug}#person` }
    : authorName === POTA_BRAND_NAME
      ? { "@id": `${SITE}/#organization` }
      : {
          "@type": "Person",
          name: authorName,
          jobTitle: authorRole,
          worksFor: { "@id": `${SITE}/#organization` },
        }

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: title,
    description,
    datePublished: publishedAt,
    dateModified: updatedAt ?? publishedAt,
    inLanguage: locale,
    author,
    publisher: { "@id": `${SITE}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: keywords.filter(Boolean).join(", "),
  }
}

// ───────────────────────────────────────────�����───────────────────────────────────
// Blog (index page) + CollectionPage (category index)
// ───────────────────────────────────────────────────────────────────────────────

export interface BlogIndexPost {
  slug: string
  title: string
  description?: string
  publishedAt?: string
  authorName?: string
  category?: string
}

/**
 * Blog index schema. AI crawlers (Perplexity, Gemini) use this to understand
 * that a page lists multiple Articles, surfacing the most recent ones in
 * "what has Pota Studio published lately?" style queries.
 */
export function blogSchema(input: {
  posts: BlogIndexPost[]
  locale?: "en" | "it"
  category?: string
}): Record<string, unknown> {
  const { posts, locale = "en", category } = input
  const path = locale === "it" ? "/it/blog" : "/blog"
  const url = category ? `${SITE}${path}/${category}` : `${SITE}${path}`

  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${url}#blog`,
    name: category
      ? `${POTA_BRAND_NAME} Blog — ${category}`
      : `${POTA_BRAND_NAME} Blog`,
    url,
    inLanguage: locale,
    publisher: { "@id": `${SITE}/#organization` },
    blogPost: posts.slice(0, 20).map((post) => {
      const postUrl =
        locale === "it"
          ? `${SITE}/it/blog/${post.slug}`
          : `${SITE}/blog/${post.slug}`
      const author: Record<string, unknown> =
        !post.authorName || post.authorName === POTA_BRAND_NAME
          ? { "@id": `${SITE}/#organization` }
          : { "@type": "Person", name: post.authorName }
      return {
        "@type": "BlogPosting",
        "@id": `${postUrl}#article`,
        headline: post.title,
        description: post.description,
        url: postUrl,
        datePublished: post.publishedAt,
        author,
        publisher: { "@id": `${SITE}/#organization` },
        articleSection: post.category,
      }
    }),
  }
}

/**
 * CollectionPage schema for category landing pages — explicitly tells search
 * engines that this URL is an index of multiple Articles filtered by topic.
 */
export function collectionPageSchema(input: {
  url: string
  name: string
  description: string
  locale?: "en" | "it"
  posts: BlogIndexPost[]
}): Record<string, unknown> {
  const { url, name, description, locale = "en", posts } = input
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collectionpage`,
    name,
    description,
    url,
    inLanguage: locale,
    isPartOf: { "@id": `${SITE}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: posts.length,
      itemListElement: posts.map((post, index) => {
        const postUrl =
          locale === "it"
            ? `${SITE}/it/blog/${post.slug}`
            : `${SITE}/blog/${post.slug}`
        return {
          "@type": "ListItem",
          position: index + 1,
          url: postUrl,
          name: post.title,
        }
      }),
    },
  }
}

// ───────────────────────────────────────────────────────────────────────────────
// FAQPage
// ───────────────────────────────────────────────────────────────────────────────

export interface FaqItem {
  question: string
  answer: string
}

/**
 * FAQPage JSON-LD.
 *
 * Emitted as a SEPARATE `<script type="application/ld+json">` from the
 * Article schema, which is Google's officially supported pattern (see
 * https://developers.google.com/search/docs/appearance/structured-data/faqpage):
 * Article and FAQPage do not collide because each block self-identifies via
 * `@type` and a unique `@id`. We attach `@id` + `isPartOf` so AI crawlers can
 * still resolve the relationship between the article and its FAQ block.
 *
 * @param items     Question/answer pairs (curated or auto-extracted from H2s).
 * @param pageUrl   Canonical URL of the article. When provided, the schema is
 *                  scoped with `@id={pageUrl}#faq` and `isPartOf` referencing
 *                  the article — the cleanest possible disambiguation.
 * @param locale    ISO language tag, used for `inLanguage`.
 */
export function faqPageSchema(
  items: FaqItem[],
  options: { pageUrl?: string; locale?: "en" | "it" } = {},
): Record<string, unknown> | null {
  // Schema.org-shaped items: question must end with `?`, answer must have
  // some substance. Anything else is silently dropped — better to omit the
  // schema than to ship an invalid one.
  const cleaned = (items ?? []).filter((i): i is FaqItem => {
    const q = i?.question?.trim() ?? ""
    const a = i?.answer?.trim() ?? ""
    return Boolean(q && a) && q.endsWith("?") && a.length >= 30
  })
  // Google's rich-result guidance: FAQPage with a single Q/A pair is
  // routinely rejected. We require at least 2 to emit anything.
  if (cleaned.length < 2) return null

  const { pageUrl, locale } = options
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: cleaned.map((faq, idx) => ({
      "@type": "Question",
      "@id": pageUrl ? `${pageUrl}#faq-${idx + 1}` : undefined,
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
  if (pageUrl) {
    schema["@id"] = `${pageUrl}#faq`
    schema.isPartOf = { "@id": `${pageUrl}#article` }
    schema.url = pageUrl
  }
  if (locale) schema.inLanguage = locale

  return schema
}

// ───────────────────────────────────────────────────────────────────────────────
// AboutPage
// ───────────────────────────────────────────────────────────────────────────────

/**
 * AboutPage schema for /about — improves entity disambiguation for AI crawlers
 * and signals to Google that this page describes the organization itself.
 */
export function aboutPageSchema(): Record<string, unknown> {
  const url = `${SITE}/about`
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${url}#webpage`,
    url,
    name: "About Pota Studio",
    description: "Italian full-service marketing agency founded in Bergamo by Sebastian Bonfanti.",
    inLanguage: "en",
    isPartOf: { "@id": `${SITE}/#website` },
    about: { "@id": `${SITE}/#organization` },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE },
        { "@type": "ListItem", position: 2, name: "About", item: url },
      ],
    },
  }
}

// ───────────────────────────────────────────────────────────────────────────────
// Speakable — GEO/AI visibility boost
// ───────────────────────────────────────────────────────────────────────────────

/**
 * SpeakableSpecification schema. Tells AI engines (Google Duplex, Perplexity,
 * ChatGPT) which CSS selectors contain the most important content on a page —
 * improves the likelihood of being surfaced in AI-generated answers.
 *
 * @param url          Canonical absolute URL of the page.
 * @param cssSelectors Array of CSS selector strings pointing to key content.
 */
export function speakableSchema(
  url: string,
  cssSelectors: string[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: cssSelectors,
    },
  }
}

// ───────────────────────────────────────────────────────────────────────────────
// Mentions — semantic brand awareness for GEO
// ───────────────────────────────────────────────────────────────────────────────

export interface MentionedBrand {
  name: string
  url?: string
  wikidataUrl?: string
}

/**
 * Adds a `mentions` array to an Article schema to signal to AI crawlers
 * which brands are referenced in the content. This improves entity-linking
 * in AI search results (Perplexity, Google AI Overviews, ChatGPT).
 *
 * @param brands  Array of brand objects from the post's `mentionedBrands` field.
 */
export function mentionsArray(brands: MentionedBrand[]): Record<string, unknown>[] {
  return brands
    .filter((b) => b?.name)
    .map((b) => {
      const entry: Record<string, unknown> = {
        "@type": "Organization",
        name: b.name,
      }
      if (b.url) entry.url = b.url
      if (b.wikidataUrl) entry.sameAs = b.wikidataUrl
      return entry
    })
}

// ───────────────────────────────────────────────────────────────────────────────
// FAQPage — Homepage + Services (GEO boost)
// ───────────────────────────────────────────────────────────────────────────────

/**
 * FAQ schema for the homepage. Answers the most common questions about Pota
 * Studio for AI engines (ChatGPT, Perplexity, Claude) to surface in responses.
 */
export function homeFaqSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE}/#faq`,
    mainEntity: [
      {
        "@type": "Question",
        name: "What services does Pota Studio offer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Pota Studio is a full-service marketing agency offering paid advertising (TikTok Ads, Meta Ads, Google Ads), content production, influencer marketing, social media management, and brand strategy. All services are delivered in-house from our Bergamo headquarters.",
        },
      },
      {
        "@type": "Question",
        name: "Does Pota Studio work with international clients?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Pota Studio works with clients across Italy, UK, Germany, France, and the US. We have managed campaigns for global brands including Samsung, Isybank, and Lucca Comics & Games.",
        },
      },
      {
        "@type": "Question",
        name: "Is Pota Studio a Shopify Partner?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Pota Studio is a certified Shopify Partner with experience in e-commerce scaling for D2C brands.",
        },
      },
      {
        "@type": "Question",
        name: "Where is Pota Studio located?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Pota Studio (legal name: Anyped S.R.L.) is headquartered at Via Zanica 85, Bergamo 24126, Italy. We serve clients in Europe and the US.",
        },
      },
    ],
  }
}

// ───────────────────────────────────────────────────────────────────────────────
// Person + ProfilePage
// ───────────────────────────────────────────────────────────────────────────────

export interface AuthorProfileInput {
  /** Stable slug used for the URL, e.g. 'sebastian-bonfanti'. */
  slug: string
  name: string
  role?: string
  /** One-paragraph bio (string only — Portable Text is rendered separately). */
  shortBio?: string
  /** Absolute URL of the profile photo (already CDN-resolved via urlFor). */
  imageUrl?: string
  /** Public email — emitted as Person.email when set. */
  email?: string
  /** Topics this author writes about with authority. */
  expertise?: string[]
  /** Optional credential strings (rendered as badges + Person.knowsAbout). */
  credentials?: string[]
  /** Social profile URLs — become Person.sameAs. */
  linkedin?: string
  twitterX?: string
  instagram?: string
  website?: string
  /**
   * Personal website separate from the generic `website` field (e.g.
   * https://sebastianbonfanti.com). Added to sameAs alongside `website`.
   */
  personalWebsite?: string
  /**
   * Wikidata entity ID (e.g. 'Q137637995'). When set, we emit the full
   * Wikidata URL in sameAs — the strongest E-E-A-T entity disambiguation
   * signal available for AI search engines (Perplexity, Google, ChatGPT).
   */
  wikidataId?: string
  /** Locale of the profile page being emitted. */
  locale?: "en" | "it"
}

/**
 * Build a Person + ProfilePage schema graph for `/author/[slug]` pages.
 *
 * Why a graph: the article-level schema already references this author by
 * `@id`, so emitting the same `@id` here lets Google merge the byline on
 * every Article with the dedicated profile page (E-E-A-T compounding).
 *
 * The Person uses `worksFor` → Organization (`#organization` from
 * organizationSchema) so the entity model is fully connected.
 */
export function authorProfileSchemaGraph(
  input: AuthorProfileInput,
): Record<string, unknown> {
  const {
    slug,
    name,
    role,
    shortBio,
    imageUrl,
    email,
    expertise = [],
    credentials = [],
    linkedin,
    twitterX,
    instagram,
    website,
    personalWebsite,
    wikidataId,
    locale = "en",
  } = input

  const path = locale === "it" ? `/it/autore/${slug}` : `/author/${slug}`
  const url = `${SITE}${path}`
  const personId = `${SITE}/author/${slug}#person`
  const profilePageId = `${url}#profilepage`

  // sameAs — ordered: LinkedIn (most authoritative for professionals) → X →
  // personal site → personal website → Wikidata (entity disambiguator).
  // Wikidata URL is the strongest AI-engine E-E-A-T signal when present.
  const sameAs = [
    linkedin,
    twitterX,
    instagram,
    website,
    personalWebsite,
    wikidataId ? `https://www.wikidata.org/wiki/${wikidataId}` : undefined,
  ].filter((u): u is string => Boolean(u && /^https?:\/\//.test(u)))

  // Person.knowsAbout — merge expertise + credentials, dedupe.
  const knowsAbout = Array.from(
    new Set([...expertise, ...credentials].filter(Boolean)),
  )

  const person: Record<string, unknown> = {
    "@type": "Person",
    "@id": personId,
    name,
    url,
    jobTitle: role,
    worksFor: { "@id": `${SITE}/#organization` },
  }
  if (imageUrl) person.image = imageUrl
  if (shortBio) person.description = shortBio
  if (email) person.email = email
  if (knowsAbout.length > 0) person.knowsAbout = knowsAbout
  if (sameAs.length > 0) person.sameAs = sameAs

  const profilePage: Record<string, unknown> = {
    "@type": "ProfilePage",
    "@id": profilePageId,
    url,
    name: `${name}${role ? ` — ${role}` : ""}`,
    inLanguage: locale,
    isPartOf: { "@id": `${SITE}/#website` },
    mainEntity: { "@id": personId },
    about: { "@id": personId },
  }

  return {
    "@context": "https://schema.org",
    "@graph": [person, profilePage],
  }
}
