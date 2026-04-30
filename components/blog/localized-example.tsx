import { pickExample, formatPrice, type Locale, type SupportedCurrency } from '@/lib/localization/format'

/**
 * Inline span that swaps content per locale. Designed to be used inside
 * Portable Text serializers or directly in MDX-style layouts so editors
 * can write a single article and surface region-specific examples.
 *
 * Renders as a plain `<span>` (no extra styling) so it inherits the
 * surrounding paragraph's typography. The locale-specific value is also
 * mirrored to a `data-locale` attribute for SEO crawlers that read DOM
 * datasets.
 */
export function LocalizedExample({
  en,
  it,
  locale,
  className,
}: {
  en: string
  it: string
  locale: Locale
  className?: string
}) {
  const value = pickExample({ en, it }, locale)
  return (
    <span className={className} data-locale={locale} data-i18n="example">
      {value}
    </span>
  )
}

/**
 * Inline span for locale-aware prices.
 *
 * @example <LocalizedPrice amount={1990} locale="en" />            // → $1,990
 * @example <LocalizedPrice amount={1990} locale="it" />            // → 1.990 €
 * @example <LocalizedPrice amount={1500} locale="en" currency="GBP" /> // → £1,500
 */
export function LocalizedPrice({
  amount,
  locale,
  currency,
  className,
}: {
  amount: number
  locale: Locale
  currency?: SupportedCurrency
  className?: string
}) {
  return (
    <span
      className={className}
      data-locale={locale}
      data-i18n="price"
      // The microdata helps AI engines & SERP parsers recognise the value
      // as a price even when the article body is otherwise unstructured.
      itemScope
      itemType="https://schema.org/PriceSpecification"
    >
      <meta itemProp="priceCurrency" content={currency ?? (locale === 'it' ? 'EUR' : 'USD')} />
      <span itemProp="price" content={String(amount)}>
        {formatPrice(amount, locale, currency ? { currency } : undefined)}
      </span>
    </span>
  )
}
