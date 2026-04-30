'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedMetricProps {
  /** Raw metric value, e.g. "+340%", "-62%", "5 days", "12", "+180% Revenue" */
  value: string
  /** Human-readable label, e.g. "ROAS", "CPL Reduction" */
  label: string
  /** Hex color used for the numeric portion (defaults to brand orange). */
  accent?: string
  /** Animation duration in ms. */
  durationMs?: number
}

/**
 * Parses a metric string into its numeric core + a prefix and a suffix so the
 * counter only animates the digits (preserving signs, units, and trailing
 * words). For example:
 *
 *   "+340%"        → { prefix: "+", target: 340, suffix: "%" }
 *   "-62%"         → { prefix: "-", target: 62,  suffix: "%" }
 *   "5 days"       → { prefix: "",  target: 5,   suffix: " days" }
 *   "+180% Revenue" → { prefix: "+", target: 180, suffix: "% Revenue" }
 *   "non-numeric"  → null  (caller should fall back to plain text)
 */
function parseMetric(raw: string):
  | { prefix: string; target: number; suffix: string; decimals: number }
  | null {
  // Match: optional sign + digits/decimals + everything after
  const match = raw.trim().match(/^([+\-−]?)\s*(\d+(?:[.,]\d+)?)(.*)$/)
  if (!match) return null
  const [, signRaw, num, rest] = match
  const sign = signRaw === '−' ? '-' : signRaw // normalise minus sign
  const target = parseFloat(num.replace(',', '.'))
  if (!Number.isFinite(target)) return null
  const decimals = num.includes('.') || num.includes(',') ? 1 : 0
  return { prefix: sign, target, suffix: rest, decimals }
}

/**
 * Animated count-up that:
 *   - Starts only when the metric scrolls into view (IntersectionObserver).
 *   - Respects `prefers-reduced-motion: reduce` (skips animation entirely).
 *   - Eases out cubically so the value lands on the target gracefully.
 *   - Falls back to plain text for non-numeric values like "Ongoing".
 *
 * Renders semantic, AI-friendly markup:
 *   <strong class="metric-value">+340%</strong>
 *   <span class="metric-label">ROAS</span>
 *
 * The `<strong>` + `metric-value` class are intentional GEO signals — AI
 * crawlers like Perplexity and Google's AI Overviews lift the strongly
 * emphasised number alongside the nearby label as a single fact.
 *
 * The component is layout-agnostic: chrome (cards, dividers, spacing) is
 * provided by the parent (e.g. <ImpactCard>).
 */
export default function AnimatedMetric({
  value,
  label,
  accent = '#FF5C00',
  durationMs = 1600,
}: AnimatedMetricProps) {
  const parsed = parseMetric(value)
  const ref = useRef<HTMLElement | null>(null)
  const [displayed, setDisplayed] = useState<number>(parsed?.target ?? 0)
  const [hasAnimated, setHasAnimated] = useState<boolean>(false)

  useEffect(() => {
    if (!parsed) return
    const node = ref.current
    if (!node) return

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      setDisplayed(parsed.target)
      setHasAnimated(true)
      return
    }

    // Reset to 0 before animation kicks in
    setDisplayed(0)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            const start = performance.now()
            const animate = (now: number) => {
              const elapsed = now - start
              const progress = Math.min(elapsed / durationMs, 1)
              // easeOutCubic
              const eased = 1 - Math.pow(1 - progress, 3)
              setDisplayed(parsed.target * eased)
              if (progress < 1) requestAnimationFrame(animate)
              else setDisplayed(parsed.target)
            }
            requestAnimationFrame(animate)
            observer.disconnect()
          }
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [parsed, durationMs, hasAnimated])

  return (
    <>
      <strong
        ref={ref}
        className="metric-value text-4xl font-bold tabular-nums leading-none"
        style={{ fontFamily: 'var(--font-space-grotesk)', color: accent }}
        aria-label={`${value} ${label}`}
        itemProp="value"
      >
        {parsed ? (
          <>
            {parsed.prefix}
            {displayed.toFixed(parsed.decimals)}
            {parsed.suffix}
          </>
        ) : (
          value
        )}
      </strong>
      <span
        className="metric-label text-xs text-[#B0B0B0] uppercase tracking-widest mt-2"
        itemProp="name"
      >
        {label}
      </span>
    </>
  )
}
