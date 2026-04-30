import { Sparkles } from 'lucide-react'

/**
 * Quick Answer block.
 *
 * Sits immediately under the H1 in every blog post, providing a 2–3 line
 * direct answer to the post's primary question. AI engines (ChatGPT,
 * Perplexity, Google AI Overviews) preferentially cite content that exposes
 * a clear, self-contained answer near the top of the page.
 *
 * The block is wrapped in a `<aside role="note">` with an explicit
 * itemProp="abstract" microdata signal so structured-data parsers can
 * reliably recognise it as the article's abstract.
 */
export default function QuickAnswer({
  text,
  accent = '#FF5C00',
  label = 'Quick Answer',
}: {
  text: string
  accent?: string
  label?: string
}) {
  if (!text?.trim()) return null
  return (
    <aside
      // Stable id (`tldr`) lets AI engines anchor-link directly to this
      // block, and lets us pair it with `<a href="#tldr">` jump links from
      // the article TOC. `data-block` is a non-standard hook some GEO
      // crawlers (e.g. Perplexity's content extractor) use to identify
      // canonical answer regions on a page.
      id="tldr"
      data-block="quick-answer"
      className="rounded-2xl p-6 md:p-7 border-l-4 relative overflow-hidden"
      style={{
        backgroundColor: `${accent}10`,
        borderColor: accent,
      }}
      role="note"
      aria-labelledby="quick-answer-label"
      itemScope
      itemType="https://schema.org/Question"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={14} style={{ color: accent }} aria-hidden="true" />
        <p
          id="quick-answer-label"
          className="text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: accent }}
        >
          {label}
        </p>
      </div>
      {/* The block is microdata-tagged as a single Question/Answer pair so
          it doubles as the lead entry in the page's FAQPage JSON-LD graph
          (also emitted server-side for parsers that ignore microdata). */}
      <p className="text-white text-lg leading-relaxed text-pretty" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
        <span itemProp="text">{text}</span>
      </p>
    </aside>
  )
}
