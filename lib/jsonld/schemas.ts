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
      ? "Creiamo contenuti impossibili da ignorare."
      : "We make content impossible to ignore.",
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
  }
}

// ───────────────────────────────────────────────────────────────────────────────
// LocalBusiness (Bergamo HQ)
// ───────────────────────────────────────────────────────────────────────────────

export function localBusinessSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE}/#localbusiness`,
    name: `${POTA_BRAND_NAME} Bergamo HQ`,
    parentOrganization: { "@id": `${SITE}/#organization` },
    url: SITE,
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
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    priceRange: "€€€",
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

// ───────────────────────────────────────────────────────────────────────────────
// CaseStudy
// ───────────────────────────────────────────────────────────────────────────────

export interface CaseStudyMetric {
  label: string
  value: string
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
  metrics?: CaseStudyMetric[]
  locale?: "en" | "it"
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
 * CaseStudy is not a top-level schema.org type, so we model it as an
 * `Article` (sub-type "CaseStudy") plus rich properties:
 *   - `about`        → the client (Organization)
 *   - `result`       → the outcome paragraph
 *   - `additionalProperty` → array of PropertyValue (= statistical metrics)
 *
 * AI crawlers (especially Perplexity & Gemini) actively use these fields when
 * answering "show me marketing case studies with measurable ROAS".
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
    metrics = [],
    locale = "en",
  } = input

  const url = locale === "it" ? `${SITE}/it/work/${slug}` : `${SITE}/work/${slug}`
  const headline = type ? `${client}: ${type} Case Study` : `${client} Case Study`
  const description = results || challenge || ""

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#case-study`,
    articleSection: "Case Study",
    additionalType: "https://schema.org/CaseStudy",
    headline,
    name: headline,
    description,
    inLanguage: locale,
    datePublished: year ? `${year}-01-01` : undefined,
    author: { "@id": `${SITE}/#organization` },
    publisher: { "@id": `${SITE}/#organization` },
    about: {
      "@type": "Organization",
      name: client,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    keywords: tags.join(", "),
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
    keywords = [],
    locale = "en",
    section = "blog",
  } = input

  const path = locale === "it" ? `/it/${section}/${slug}` : `/${section}/${slug}`
  const url = `${SITE}${path}`

  const author: Record<string, unknown> =
    authorName === POTA_BRAND_NAME
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

// ───────────────────────────────────────────────────────────────────────────────
// FAQPage
// ───────────────────────────────────────────────────────────────────────────────

export interface FaqItem {
  question: string
  answer: string
}

export function faqPageSchema(items: FaqItem[]): Record<string, unknown> | null {
  const cleaned = (items ?? []).filter(
    (i): i is FaqItem => Boolean(i?.question?.trim() && i?.answer?.trim()),
  )
  if (cleaned.length === 0) return null

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: cleaned.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}
