/**
 * Centralised slug validation rule for every Sanity document with a
 * `slug` field.
 *
 * The validator enforces the URL-safe shape `[a-z0-9-]+`, with no
 * leading/trailing/double hyphens, no whitespace, no uppercase, no
 * special characters. Catching this in Sanity Studio at edit time avoids
 * the canonical "isybank-gaming tour" sitemap regression where a literal
 * space character in a slug crashed the URL across every crawler.
 *
 * Usage:
 *   defineField({
 *     name: 'slug',
 *     type: 'slug',
 *     options: { source: 'title', maxLength: 96 },
 *     validation: (R) => R.required().custom(slugIsUrlSafe),
 *   })
 */

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export type SlugValueLike = { current?: string } | undefined | null

/**
 * Sanity custom validator. Returns `true` when the slug is well-formed,
 * otherwise an error string suitable for Sanity Studio's red banner.
 */
export function slugIsUrlSafe(slug: SlugValueLike): true | string {
  const current = slug?.current?.trim() ?? ''
  if (!current) return 'Slug is required'
  if (!SLUG_RE.test(current)) {
    return 'Slug must be lowercase letters, numbers, and single hyphens only (no spaces, no special characters, no double hyphens)'
  }
  return true
}
