import Image from 'next/image'

/**
 * Footer "Partners & Certifications" heading + visible certification badges.
 *
 * Currently shows:
 *   - Shopify Partners (local asset, primary inverted lockup for dark UI)
 *   - iubenda Bronze Certified Partner (remote asset from iubenda's CDN)
 *
 * NOTE on structured data: the schema.org `hasCredential` + `award`
 * entries declared in `lib/jsonld/schemas.ts` (organizationSchema) are
 * unaffected by this file. They live in JSON-LD and continue to give
 * search/AI engines the authoritative E-E-A-T signal independently of
 * what is rendered visually here.
 */
export default function PartnerBadges({ locale = 'en' }: { locale?: 'en' | 'it' }) {
  const isIt = locale === 'it'
  const title = isIt ? 'Partner & Certificazioni' : 'Partners & Certifications'
  const iubendaAlt = isIt
    ? 'iubenda Bronze Partner certificato'
    : 'iubenda Bronze Certified Partner'
  const shopifyAlt = isIt
    ? 'Shopify Partner ufficiale'
    : 'Official Shopify Partner'
  return (
    <section
      aria-labelledby="partner-badges-heading"
      className="border-t border-white/10 pt-10 pb-6"
    >
      <h4
        id="partner-badges-heading"
        className="text-white text-xs sm:text-sm font-semibold uppercase tracking-widest"
      >
        {title}
      </h4>

      <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-6">
        {/*
         * iubenda Certified Partner Badge — Bronze (local asset).
         * Downloaded from iubenda's CDN and served from /public/badges/
         * to avoid CSP blocks on external image sources and guarantee
         * availability regardless of CDN changes.
         */}
        <a
          href="/iubenda-partner"
          title={iubendaAlt}
          aria-label={iubendaAlt}
          className="inline-block transition-opacity hover:opacity-80"
        >
          <img
            src="/badges/iubenda-bronze-partner.png"
            alt={iubendaAlt}
            width={153}
            height={54}
            loading="lazy"
            decoding="async"
            style={{ height: '54px', width: 'auto' }}
          />
        </a>

        {/*
         * Shopify Partners — local asset. The source PNG is a wide
         * horizontal lockup; we cap its rendered height at 32px so it sits
         * at roughly the same optical weight as the Iubenda badge, then
         * let the width scale proportionally via `h-8 w-auto`.
         *
         * `unoptimized` because the file is already a small inverted PNG
         * and Shopify's brand guidelines require pixel-exact reproduction
         * of the lockup — running it through next/image's resizer can
         * introduce subtle compression artifacts on the green icon.
         */}
        <a
          href="https://www.shopify.com/partners"
          target="_blank"
          rel="noopener noreferrer"
          title={shopifyAlt}
          aria-label={shopifyAlt}
          className="inline-block transition-opacity hover:opacity-80"
        >
          <Image
            src="/badges/shopify-partners.png"
            alt={shopifyAlt}
            width={180}
            height={47}
            sizes="180px"
            className="h-8 w-auto"
            unoptimized
          />
        </a>
      </div>
    </section>
  )
}
