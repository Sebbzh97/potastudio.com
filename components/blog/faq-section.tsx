import { ChevronDown } from "lucide-react"

/**
 * FAQ section for blog articles.
 *
 * Renders questions with native `<details>/<summary>` so the content is
 * keyboard-accessible, expandable without JavaScript, and present in the
 * source HTML — which is exactly what both screen readers and AI crawlers
 * want. The schema.org microdata (`Question` / `Answer` / `mainEntity`) is
 * still emitted so Google can cross-validate it against the FAQPage JSON-LD
 * we ship in the page `<head>`.
 *
 * Visual: borderless cards, accent-coloured chevron rotates on open via the
 * `[&[open]>summary>...]` attribute selector — no client JS, no hydration cost.
 */

interface FaqSectionProps {
  items: { question: string; answer: string }[]
  accent?: string
  title: string
  /** Anchor id used by the section heading for `aria-labelledby`. */
  headingId?: string
  /** Open the first FAQ by default — improves visibility of the answer. */
  defaultOpenFirst?: boolean
}

export default function FaqSection({
  items,
  accent = "#FF5C00",
  title,
  headingId = "faq-heading",
  defaultOpenFirst = true,
}: FaqSectionProps) {
  if (!items?.length) return null

  return (
    <section
      className="mt-16"
      aria-labelledby={headingId}
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      <h2
        id={headingId}
        className="text-2xl font-bold text-white mb-8"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        {title}
      </h2>

      <div className="flex flex-col gap-4">
        {items.map((faq, i) => (
          <details
            key={`${i}-${faq.question.slice(0, 40)}`}
            open={defaultOpenFirst && i === 0}
            className="group rounded-xl bg-white/[0.03] border border-white/10 overflow-hidden transition-colors hover:border-white/20 [&[open]]:border-white/20"
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <summary
              className="flex items-start justify-between gap-4 p-6 cursor-pointer list-none select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0D0D]"
              // Suppress the default disclosure triangle in WebKit
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <h3
                className="text-white font-semibold text-base sm:text-lg leading-snug text-pretty"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
                itemProp="name"
              >
                {faq.question}
              </h3>
              <ChevronDown
                size={20}
                aria-hidden="true"
                className="shrink-0 mt-1 text-white/60 transition-transform duration-200 group-[&[open]]:rotate-180"
                style={{ color: accent }}
              />
            </summary>
            <div
              className="px-6 pb-6 -mt-1"
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
            >
              <div
                className="text-[#B0B0B0] leading-relaxed text-pretty whitespace-pre-line"
                itemProp="text"
              >
                {faq.answer}
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
