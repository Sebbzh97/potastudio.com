/**
 * Hreflang + canonical helper.
 *
 * Returns a `Metadata.alternates` block scoped to the *current* locale page.
 *
 * Conventions:
 *   - Canonical points to the URL of the LOCALE that is rendering — each
 *     locale is its own self-canonicalising entity. (Common SEO mistake:
 *     pointing the IT canonical at the EN page consolidates the IT URL into
 *     EN and removes /it from the index.)
 *   - `languages.en` always points to the EN version, `languages.it` to the
 *     IT version. Both pages emit the same set of alternates — bidirectional
 *     hreflang is mandatory for Google to honour them.
 *   - `x-default` always points to the EN version (per the requirement that
 *     non-Italian users are served English by default).
 *
 * Usage (EN page):
 *   export const metadata = {
 *     title: 'About',
 *     ...getHreflang('/about'),
 *   }
 *
 * Usage (IT page):
 *   export const metadata = {
 *     title: 'Chi Siamo',
 *     ...getHreflang('/about', 'it'),
 *   }
 *
 * Always pass the EN-equivalent path. The helper computes `/it/<path>` for
 * the Italian alternate automatically (handles slug differences for the
 * homepage and prefix-stripping when callers accidentally pass `/it/...`).
 *
 * @param englishPath  EN-locale path, e.g. `/about` or `/blog/my-post`.
 * @param locale       Locale of the page that calls this helper. Defaults to
 *                     `en` for backward compatibility with existing callers.
 */
export function getHreflang(englishPath: string, locale: 'en' | 'it' = 'en') {
  const base = 'https://www.potastudio.com'
  // Defensive: strip a stray /it prefix in case caller passes the IT path.
  const cleanPath = englishPath.replace(/^\/it/, '') || '/'

  const enUrl = `${base}${cleanPath}`
  const itUrl = `${base}/it${cleanPath === '/' ? '' : cleanPath}`

  return {
    alternates: {
      // Self-canonicalise each locale to itself.
      canonical: locale === 'it' ? itUrl : enUrl,
      languages: {
        en: enUrl,
        it: itUrl,
        // x-default → EN (English serves as the global / non-IT default).
        'x-default': enUrl,
      },
    },
  }
}
