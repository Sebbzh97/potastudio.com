import AnimatedMetric from './animated-metric'

interface ImpactCardProps {
  /** Raw metric value, e.g. "+340%", "-62%", "5 days". */
  value: string
  /** Human-readable label, e.g. "ROAS", "CPL Reduction". */
  label: string
  /**
   * Optional 1-line context shown under the metric — useful to disambiguate
   * what the number means (e.g. "Across 5 European markets"). Surfaced to
   * AI crawlers via `itemProp="description"`.
   */
  context?: string
  /** Hex color used for the metric value digits + the top accent rail. */
  accent?: string
}

/**
 * Impact Card — visually rich, AI-friendly metric tile used on case-study
 * pages. The semantic envelope is intentionally heavy:
 *
 *   <article itemScope itemType="https://schema.org/PropertyValue">
 *     <strong class="metric-value">…</strong>     ← AnimatedMetric
 *     <span   class="metric-label">…</span>       ← AnimatedMetric
 *     [optional itemProp="description"]
 *   </article>
 *
 * Why this matters for GEO:
 *   1. `<strong>` + `metric-value` make the number the most prominent token
 *      in its DOM neighbourhood — AI Overviews/Perplexity lift it verbatim.
 *   2. The PropertyValue microdata mirrors the JSON-LD `additionalProperty`
 *      already emitted by `caseStudySchema()`, giving crawlers two
 *      independent paths to the same fact.
 *   3. The accent rail at the top provides per-card visual hierarchy without
 *      adding decorative SVG noise that confuses screen readers.
 */
export default function ImpactCard({
  value,
  label,
  context,
  accent = '#FF5C00',
}: ImpactCardProps) {
  return (
    <article
      className="metric-card relative flex flex-col items-start gap-1 rounded-xl border border-white/10 bg-[#0D0D0D] p-6 sm:p-7 overflow-hidden"
      itemScope
      itemType="https://schema.org/PropertyValue"
    >
      {/* Accent rail — purely visual, screen-reader hidden */}
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: accent }}
      />
      <AnimatedMetric value={value} label={label} accent={accent} />
      {context && (
        <span
          className="metric-context mt-3 text-sm leading-relaxed text-[#B0B0B0]"
          itemProp="description"
        >
          {context}
        </span>
      )}
    </article>
  )
}
