/**
 * Append Sanity CDN transform params to an asset URL.
 *
 * Why this exists:
 *   The blog/category listing GROQ projections return `coverImageUrl` as a
 *   pre-resolved CDN string (cheaper than threading the full image object
 *   through three layers of types). That means we can't use the canonical
 *   `urlFor(image)` builder downstream — but we still want responsive
 *   sizing and modern formats. This helper closes the gap by appending
 *   query params to the existing URL.
 *
 *   We also pair this with `<Image unoptimized />` so the request goes
 *   straight to cdn.sanity.io instead of hitting `/_next/image`. That
 *   keeps the dev sandbox working (Turbopack's image optimizer
 *   intermittently 404s in the v0 VM) AND offloads optimisation to
 *   Sanity's CDN, which already serves AVIF/WebP via `auto=format` and
 *   handles caching globally.
 *
 * Sanity transform reference:
 *   https://www.sanity.io/docs/image-urls
 *
 * @example
 *   withSanityTransform("https://cdn.sanity.io/.../foo.png", { w: 800 })
 *   // -> "https://cdn.sanity.io/.../foo.png?w=800&auto=format&fit=max&q=80"
 */
export interface SanityTransformOptions {
  /** Target render width in CSS pixels. */
  w?: number
  /** Target render height in CSS pixels (omit to preserve aspect ratio). */
  h?: number
  /** JPEG/WebP quality 0–100. Defaults to 80 (good balance for hero crops). */
  q?: number
  /**
   * Crop fit mode. Defaults to `'max'` (no upscaling, preserves aspect).
   * Use `'crop'` when you need the dimensions to match exactly.
   */
  fit?: 'max' | 'crop' | 'fill' | 'fillmax' | 'min' | 'scale'
}

export function withSanityTransform(
  url: string | undefined | null,
  opts: SanityTransformOptions = {},
): string | undefined {
  if (!url) return undefined

  // Defensive: if for some reason the URL doesn't look like a Sanity CDN
  // asset, return it untouched. Sanity transform params are no-ops on
  // other hosts but appending them silently could mangle signed URLs.
  if (!url.includes('cdn.sanity.io')) return url

  const { w, h, q = 80, fit = 'max' } = opts

  const params = new URLSearchParams()
  if (w) params.set('w', String(w))
  if (h) params.set('h', String(h))
  params.set('auto', 'format') // serves AVIF/WebP based on Accept header
  params.set('fit', fit)
  params.set('q', String(q))

  // Existing query string handling — most asset URLs from Sanity have no
  // query, but the builder occasionally produces them, so we append
  // safely.
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}${params.toString()}`
}
