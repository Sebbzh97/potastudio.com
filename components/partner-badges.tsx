/**
 * Footer "Partners & Certifications" heading.
 *
 * The visual TikTok / Google partner badges have been removed for now —
 * the heading is kept so the section structure stays in place and badges
 * can be re-introduced later without re-adding the wrapper.
 *
 * NOTE on structured data: the schema.org `hasCredential` + `award`
 * entries declared in `lib/jsonld/schemas.ts` (organizationSchema) are
 * unaffected by this change. They live in JSON-LD and continue to give
 * search/AI engines the authoritative E-E-A-T signal independently of
 * what is rendered visually here.
 */
export default function PartnerBadges({ locale = 'en' }: { locale?: 'en' | 'it' }) {
  const isIt = locale === 'it'
  const title = isIt ? 'Partner & Certificazioni' : 'Partners & Certifications'
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
    </section>
  )
}
