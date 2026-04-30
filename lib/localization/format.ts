/**
 * Locale-aware formatting utilities for the blog & marketing site.
 *
 * Two concerns covered here:
 *   1. Currency display — show prices in the right symbol/format for the
 *      reader (EUR for /it/, USD/GBP for /en/ depending on context).
 *   2. Contextual examples — let editors author one piece of content and
 *      surface a locally-relevant example string per locale (e.g. "Milano"
 *      for IT readers, "London" for EN readers).
 *
 * Both helpers are pure, server-safe, and SSR-friendly — no `Intl.*`
 * timezone gotchas because we only format numbers/strings, not dates.
 */

export type Locale = "en" | "it"

/** Currency codes we support out-of-the-box. */
export type SupportedCurrency = "EUR" | "USD" | "GBP"

/**
 * Returns the canonical default currency for a given locale.
 * IT readers see EUR, EN readers default to USD (broadest reach for the
 * international audience). Override via the `currency` arg of `formatPrice`
 * when a piece of content is GBP-priced (e.g. UK case studies).
 */
export function defaultCurrencyForLocale(locale: Locale): SupportedCurrency {
  return locale === "it" ? "EUR" : "USD"
}

interface FormatPriceOptions {
  /**
   * Force a specific currency. When omitted we fall back to the locale's
   * default (EUR for it, USD for en).
   */
  currency?: SupportedCurrency
  /** Hide decimals on round amounts (default: true). */
  trimZeroDecimals?: boolean
  /**
   * Display style. `narrowSymbol` → "€10", `symbol` → "€10" (US locale also
   * shows just "$"), `code` → "EUR 10". Default `narrowSymbol`.
   */
  display?: "narrowSymbol" | "symbol" | "code"
}

/**
 * Formats a numeric amount as a localised price string.
 *
 * @example formatPrice(1990, 'it')          // "1.990 €"
 * @example formatPrice(1990, 'en')          // "$1,990"
 * @example formatPrice(1990, 'en', { currency: 'GBP' }) // "£1,990"
 */
export function formatPrice(
  amount: number,
  locale: Locale,
  options: FormatPriceOptions = {},
): string {
  if (!Number.isFinite(amount)) return ""

  const currency = options.currency ?? defaultCurrencyForLocale(locale)
  const trim = options.trimZeroDecimals ?? true
  // BCP-47 tag — the IT locale uses Italian number grouping (1.990,00)
  // while EN follows US/UK conventions (1,990.00).
  const bcp47 = locale === "it" ? "it-IT" : "en-US"

  const fractionDigits = trim && Number.isInteger(amount) ? 0 : 2

  return new Intl.NumberFormat(bcp47, {
    style: "currency",
    currency,
    currencyDisplay: options.display ?? "narrowSymbol",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount)
}

/**
 * Returns a thousands-separated number formatted for the locale, no
 * currency. Useful for "5,000 followers" / "5.000 follower" style copy.
 */
export function formatNumber(value: number, locale: Locale): string {
  if (!Number.isFinite(value)) return ""
  const bcp47 = locale === "it" ? "it-IT" : "en-US"
  return new Intl.NumberFormat(bcp47).format(value)
}

// ─── Contextual examples ─────────────────────────────────────────────

/**
 * A pair of locale-specific example values, used to swap concrete
 * references in marketing copy without forking entire articles.
 */
export interface LocalizedExample {
  /** Shown to EN readers. Use international, brand-neutral references. */
  en: string
  /** Shown to IT readers. Use locally-relevant references. */
  it: string
}

/**
 * Picks the right side of a `LocalizedExample` for the current locale.
 *
 * @example
 *   pickExample({ en: 'London / NYC', it: 'Milano' }, 'it') // → 'Milano'
 */
export function pickExample(example: LocalizedExample, locale: Locale): string {
  return locale === "it" ? example.it : example.en
}

/**
 * Curated dictionary of common example placeholders. Editors can reference
 * them by key (`example('majorCity', locale)`) instead of typing the full
 * pair every time. Keep this list short and content-driven — it is NOT a
 * translations table, only a sample-content helper.
 */
export const EXAMPLE_DICTIONARY: Record<string, LocalizedExample> = {
  majorCity: { en: "London", it: "Milano" },
  majorCities: { en: "London or New York", it: "Milano o Roma" },
  startupHub: { en: "Silicon Valley", it: "Milano" },
  retailFlagship: { en: "Oxford Street", it: "Via Montenapoleone" },
  fashionWeek: { en: "Paris Fashion Week", it: "Milano Fashion Week" },
  topAgency: { en: "Wieden+Kennedy", it: "Saatchi & Saatchi Italia" },
  exampleClient: { en: "Nike", it: "Pirelli" },
}

export function example(key: keyof typeof EXAMPLE_DICTIONARY, locale: Locale): string {
  return pickExample(EXAMPLE_DICTIONARY[key], locale)
}
