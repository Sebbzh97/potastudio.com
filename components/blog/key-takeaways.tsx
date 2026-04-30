import { Check } from 'lucide-react'

/**
 * Key Takeaways list.
 *
 * Renders bullet-point summary at the bottom of an article (before FAQ).
 * Designed to be the section AI scrapers most easily lift verbatim — use
 * 3-7 short, declarative sentences in the Sanity field.
 */
export default function KeyTakeaways({
  items,
  accent = '#FF5C00',
  title = 'Key Takeaways',
}: {
  items: string[]
  accent?: string
  title?: string
}) {
  if (!items || items.length === 0) return null
  return (
    <section
      className="mt-16 rounded-2xl p-6 md:p-8 border"
      style={{ backgroundColor: `${accent}08`, borderColor: `${accent}30` }}
      aria-labelledby="key-takeaways-heading"
    >
      <h2
        id="key-takeaways-heading"
        className="text-2xl font-bold text-white mb-5"
        style={{ fontFamily: 'var(--font-space-grotesk)' }}
      >
        {title}
      </h2>
      <ul className="flex flex-col gap-4">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className="mt-1 shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${accent}20` }}
              aria-hidden="true"
            >
              <Check size={14} style={{ color: accent }} strokeWidth={3} />
            </span>
            <span className="text-white text-base leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
