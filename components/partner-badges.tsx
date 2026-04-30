/**
 * Footer "Partners & Certifications" heading + Iubenda Bronze Partner badge.
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
  const iubendaAlt = isIt
    ? 'iubenda Bronze Partner certificato'
    : 'iubenda Bronze Certified Partner'
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

      <div className="mt-6 flex flex-wrap items-center gap-6">
        {/*
         * iubenda Certified Partner Badge — Small (Bronze).
         * Using a plain <img> because:
         *   1. The asset is hosted on iubenda's CDN and the file name is
         *      versioned by them; we don't want to pipe it through
         *      next/image (would require adding a remotePattern just for
         *      one small badge).
         *   2. Width/height are fixed by iubenda's brand guidelines, so
         *      there's nothing to optimise responsively.
         * `loading="lazy"` keeps it off the LCP critical path.
         */}
        <a
          href="/iubenda-partner"
          title={iubendaAlt}
          aria-label={iubendaAlt}
          className="inline-block transition-opacity hover:opacity-80"
        >
          <img
            src="https://www.iubenda.com/wp-content/uploads/2026/04/Bronze.png"
            alt={iubendaAlt}
            width={153}
            height={54}
            loading="lazy"
            decoding="async"
          />
        </a>
      </div>
    </section>
  )
}
