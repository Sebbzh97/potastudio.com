/**
 * Blog category utilities — bridge between human-readable Sanity category
 * names ("Paid ADS", "Influencer Marketing") and SEO-friendly URL slugs
 * ("paid-ads", "influencer-marketing").
 *
 * Conventions:
 *   - EN slug:  /blog/category/<slug>
 *   - IT slug:  /it/blog/categoria/<slug>
 *   - Slugs are produced from the canonical category name via `slugifyCategory`.
 *   - The reverse-lookup `findCategoryBySlug` works against any list of posts
 *     because Sanity is the source of truth for which categories exist.
 */

export type Locale = "en" | "it"

/**
 * Convert a category display name into a URL-safe slug.
 * Examples:
 *   "Paid ADS"               → "paid-ads"
 *   "Influencer Marketing"   → "influencer-marketing"
 *   "TikTok"                 → "tiktok"
 *   "Strategy & Growth"      → "strategy-and-growth"
 *   "Marketing Digitale"     → "marketing-digitale"
 */
export function slugifyCategory(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Find the canonical category name from a list of posts that matches a slug.
 * Returns null when no match — the caller should call `notFound()`.
 */
export function findCategoryName<T extends { category: string }>(
  posts: T[],
  slug: string,
): string | null {
  const target = slug.toLowerCase()
  const match = posts.find((p) => slugifyCategory(p.category) === target)
  return match?.category ?? null
}

/**
 * Editorial copy per category for SEO meta. Falls back to a generic, well-formed
 * template when a category isn't curated below — so new categories added in
 * Sanity work automatically without code changes.
 */
const CATEGORY_COPY_EN: Record<string, { title: string; description: string }> = {
  "Paid ADS": {
    title:
      "Paid Advertising Articles - Meta, TikTok & Google Ads Playbooks | Pota Studio",
    description:
      "In-depth guides on paid media: Meta Ads, TikTok Ads, Google Ads. Real campaigns, ROAS benchmarks, creative frameworks. Read our paid advertising playbooks.",
  },
  "Paid Advertising": {
    title:
      "Paid Advertising Articles - Meta, TikTok & Google Ads Playbooks | Pota Studio",
    description:
      "In-depth guides on paid media: Meta Ads, TikTok Ads, Google Ads. Real campaigns, ROAS benchmarks, creative frameworks. Read our paid advertising playbooks.",
  },
  TikTok: {
    title: "TikTok Marketing Articles - Strategy, Ads & Creator Playbooks | Pota Studio",
    description:
      "TikTok marketing playbooks from a team that runs campaigns daily. Organic strategy, TikTok Ads, creator collaborations, and live shopping insights.",
  },
  "TikTok Marketing": {
    title: "TikTok Marketing Articles - Strategy, Ads & Creator Playbooks | Pota Studio",
    description:
      "TikTok marketing playbooks from a team that runs campaigns daily. Organic strategy, TikTok Ads, creator collaborations, and live shopping insights.",
  },
  "Influencer Marketing": {
    title:
      "Influencer Marketing Articles - Creator Strategy & Talent Sourcing | Pota Studio",
    description:
      "Hands-on guides on influencer marketing, creator strategy, and talent sourcing. Frameworks, contracts, KPIs and lessons from real campaigns.",
  },
  "Social Media": {
    title:
      "Social Media Articles - Content Strategy, Community & Trends | Pota Studio",
    description:
      "Social media strategy, content frameworks, and community-building playbooks for brands across Europe and the US.",
  },
  "Digital Strategy": {
    title:
      "Digital Strategy Articles - Brand, Growth & Positioning | Pota Studio",
    description:
      "Digital strategy guides on brand positioning, growth marketing, and integrated campaign architecture for ambitious brands.",
  },
  "Digital Marketing": {
    title:
      "Digital Marketing Articles - Strategy, Ads, Social & Content | Pota Studio",
    description:
      "Digital marketing playbooks for modern brands: strategy, paid media, social, content production, and the platforms that move the needle.",
  },
}

const CATEGORY_COPY_IT: Record<string, { title: string; description: string }> = {
  "Paid ADS": {
    title:
      "Articoli Paid Advertising - Guide Meta, TikTok & Google Ads | Pota Studio",
    description:
      "Guide approfondite sul paid media: Meta Ads, TikTok Ads, Google Ads. Campagne reali, benchmark ROAS, framework creativi. Leggi i nostri playbook.",
  },
  "Paid Advertising": {
    title:
      "Articoli Paid Advertising - Guide Meta, TikTok & Google Ads | Pota Studio",
    description:
      "Guide approfondite sul paid media: Meta Ads, TikTok Ads, Google Ads. Campagne reali, benchmark ROAS, framework creativi. Leggi i nostri playbook.",
  },
  TikTok: {
    title:
      "Articoli TikTok Marketing - Strategia, Ads & Playbook Creator | Pota Studio",
    description:
      "Playbook di TikTok marketing da un team che gestisce campagne ogni giorno. Strategia organica, TikTok Ads, collaborazioni con creator e live shopping.",
  },
  "TikTok Marketing": {
    title:
      "Articoli TikTok Marketing - Strategia, Ads & Playbook Creator | Pota Studio",
    description:
      "Playbook di TikTok marketing da un team che gestisce campagne ogni giorno. Strategia organica, TikTok Ads, collaborazioni con creator e live shopping.",
  },
  "Influencer Marketing": {
    title:
      "Articoli Influencer Marketing - Strategia Creator & Talent | Pota Studio",
    description:
      "Guide pratiche su influencer marketing, strategia creator e talent sourcing. Framework, contratti, KPI e lezioni da campagne reali.",
  },
  "Social Media": {
    title:
      "Articoli Social Media - Strategia, Content e Community | Pota Studio",
    description:
      "Strategia social media, framework di content e playbook per costruire community per brand in Europa e USA.",
  },
  "Digital Strategy": {
    title:
      "Articoli Digital Strategy - Brand, Crescita & Posizionamento | Pota Studio",
    description:
      "Guide di strategia digitale: posizionamento brand, growth marketing e architettura di campagne integrate per brand ambiziosi.",
  },
  "Digital Marketing": {
    title:
      "Articoli Marketing Digitale - Strategia, Ads, Social & Content | Pota Studio",
    description:
      "Playbook di marketing digitale per brand moderni: strategia, paid media, social, produzione contenuti e le piattaforme che fanno la differenza.",
  },
  "Marketing Digitale": {
    title:
      "Articoli Marketing Digitale - Strategia, Ads, Social & Content | Pota Studio",
    description:
      "Playbook di marketing digitale per brand moderni: strategia, paid media, social, produzione contenuti e le piattaforme che fanno la differenza.",
  },
}

export function categoryMetaCopy(
  canonicalName: string,
  locale: Locale,
): { title: string; description: string } {
  const map = locale === "it" ? CATEGORY_COPY_IT : CATEGORY_COPY_EN
  const curated = map[canonicalName]
  if (curated) return curated

  // Generic fallback for any new category added in Sanity.
  return locale === "it"
    ? {
        title: `Articoli ${canonicalName} - Guide e Playbook | Pota Studio`,
        description: `Guide e playbook su ${canonicalName.toLowerCase()} dal team Pota Studio. Strategie, dati reali e best practice per il tuo brand.`,
      }
    : {
        title: `${canonicalName} Articles - Guides & Playbooks | Pota Studio`,
        description: `Guides and playbooks on ${canonicalName.toLowerCase()} from the Pota Studio team. Strategy, real data, and battle-tested best practices.`,
      }
}
