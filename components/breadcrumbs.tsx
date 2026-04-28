import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { JsonLd } from "@/components/json-ld"
import { breadcrumbListSchema, type BreadcrumbItem } from "@/lib/jsonld/schemas"

export type { BreadcrumbItem }

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  /**
   * Visual variant.
   * - "default" — soft white-on-dark, used inside hero sections
   * - "muted"   — slightly dimmer, used on light/colored backgrounds
   */
  variant?: "default" | "muted"
  className?: string
}

/**
 * Semantic breadcrumb component.
 * - Uses <nav aria-label="Breadcrumb"> + <ol> for accessibility (WCAG 2.5.8)
 * - Last item is rendered as <span aria-current="page"> (not a link)
 * - Injects schema.org BreadcrumbList JSON-LD so search engines and AI crawlers
 *   understand the site hierarchy
 */
export default function Breadcrumbs({
  items,
  variant = "default",
  className = "",
}: BreadcrumbsProps) {
  if (!items || items.length === 0) return null

  const linkColor =
    variant === "muted"
      ? "text-[#8A8A8A] hover:text-white"
      : "text-[#B0B0B0] hover:text-white"
  const currentColor = variant === "muted" ? "text-white/90" : "text-white"
  const sepColor = variant === "muted" ? "text-white/30" : "text-white/40"

  return (
    <>
      <JsonLd data={breadcrumbListSchema(items)} />
      <nav aria-label="Breadcrumb" className={className}>
        <ol className="flex flex-wrap items-center gap-1.5 text-sm">
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            return (
              <li key={`${item.url}-${index}`} className="flex items-center gap-1.5">
                {isLast ? (
                  <span
                    aria-current="page"
                    className={`${currentColor} font-medium`}
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className={`${linkColor} transition-colors`}
                  >
                    {item.name}
                  </Link>
                )}
                {!isLast && (
                  <ChevronRight
                    size={14}
                    className={sepColor}
                    aria-hidden="true"
                  />
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
