import type { Metadata } from "next"
import { getTranslationSlug } from "@/sanity/lib/blog"

const SITE = "https://www.potastudio.com"

/**
 * Builds the `alternates` block of a blog post's <Metadata>, with PROPERLY
 * resolved per-locale slugs.
 *
 * Why this matters:
 *   The previous implementation reused the current page's `slug` for both
 *   `languages.en` and `languages.it`. That works only if the EN and IT
 *   editorial slugs are identical — which is rarely the case for SEO-tuned
 *   slugs (e.g. `shoppertainment-2026` vs `shoppertainment-2026-italia`).
 *   When slugs diverge, the wrong-language hreflang link 404s and Google
 *   silently drops the language pairing.
 *
 * How it works:
 *   We dereference the translation via Sanity's `translationOf` reference
 *   (set on the IT post pointing at the EN post). When a counterpart exists,
 *   we emit a full bidirectional triple (en, it, x-default → en). When it
 *   doesn't, we degrade gracefully and emit only the current language plus
 *   x-default → that same language, so the page still has a valid canonical
 *   pair.
 *
 * @param postId       Sanity `_id` of the current post (no `drafts.` prefix).
 * @param currentSlug  The slug of the post being rendered.
 * @param currentLang  Language of the post being rendered (`'en'` | `'it'`).
 */
export async function buildBlogAlternates(
  postId: string,
  currentSlug: string,
  currentLang: "en" | "it",
): Promise<NonNullable<Metadata["alternates"]>> {
  const otherLang = currentLang === "en" ? "it" : "en"
  const otherSlug = await getTranslationSlug(postId, currentLang)

  const enSlug = currentLang === "en" ? currentSlug : otherSlug
  const itSlug = currentLang === "it" ? currentSlug : otherSlug

  const enUrl = enSlug ? `${SITE}/blog/${enSlug}` : null
  const itUrl = itSlug ? `${SITE}/it/blog/${itSlug}` : null

  // Canonical always points at the URL of the page being rendered.
  const canonical =
    currentLang === "en" ? `${SITE}/blog/${currentSlug}` : `${SITE}/it/blog/${currentSlug}`

  // Only include languages we can actually resolve. Inserting a 404 URL
  // would actively hurt the hreflang cluster.
  const languages: Record<string, string> = {}
  if (enUrl) languages.en = enUrl
  if (itUrl) languages.it = itUrl
  // x-default → English when available, else fall back to the current page
  // (Google requires a concrete x-default target).
  languages["x-default"] = enUrl ?? canonical

  // Touch otherLang so it stays in scope (it documents the bidirectional
  // intent of the helper without forcing eslint to flag it as unused when
  // the variable is only meaningful for the calling-side switch above).
  void otherLang

  return { canonical, languages }
}
