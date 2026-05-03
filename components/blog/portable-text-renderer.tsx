import Image from 'next/image'
import Link from 'next/link'
import { PortableText, type PortableTextComponents, type PortableTextBlock } from '@portabletext/react'
import { urlFor } from '@/sanity/lib/client'

/**
 * Semantic + AI-friendly Portable Text renderer for blog posts.
 *
 * Why this exists:
 *  - The previous renderer flattened the body to plain `<p>` elements, losing
 *    headings, tables, callouts, code blocks, lists, links and images.
 *  - LLM crawlers (ChatGPT, Perplexity, Gemini) score "semantic chunking"
 *    very highly: they need real `<h2>`/`<h3>` boundaries, real `<table>`
 *    elements with `<thead>` + `<tbody>`, real `<blockquote>`, etc.
 *  - This renderer also wraps every H2 (and the content following it until
 *    the next H2) in its own `<section>`, which gives Google + AIs a clear
 *    "concept boundary" for chunk-level retrieval.
 *
 * Public API: just pass the Portable Text array and an optional `accent`
 * brand colour for the styling of callouts / list bullets.
 */

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any[]
  accent?: string
  locale?: 'en' | 'it'
}

// ── shared serializers ────────────────────────────────────────────────────────

function buildComponents(accent: string): PortableTextComponents {
  return {
    block: {
      // H1 should never appear in the body (it's the post title), but if it
      // does we render it as h2 to keep the heading hierarchy clean.
      h1: ({ children }) => (
        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-5 scroll-mt-24" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
          {children}
        </h2>
      ),
      h2: ({ children }) => (
        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-5 scroll-mt-24" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-xl md:text-2xl font-semibold text-white mt-10 mb-4 scroll-mt-24" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 className="text-lg md:text-xl font-semibold text-white mt-8 mb-3 scroll-mt-24" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
          {children}
        </h4>
      ),
      blockquote: ({ children }) => (
        <blockquote
          className="my-8 pl-6 border-l-4 italic text-[#D0D0D0] text-lg leading-relaxed"
          style={{ borderColor: accent }}
        >
          {children}
        </blockquote>
      ),
      normal: ({ children }) => (
        <p className="text-[#C0C0C0] text-lg leading-[1.85] mb-6">{children}</p>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="my-6 flex flex-col gap-2 text-[#C0C0C0] text-lg leading-[1.85] list-disc list-outside pl-6">
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol className="my-6 flex flex-col gap-2 text-[#C0C0C0] text-lg leading-[1.85] list-decimal list-outside pl-6">
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => <li className="marker:text-[--accent]" style={{ ['--accent' as string]: accent }}>{children}</li>,
      number: ({ children }) => <li>{children}</li>,
    },
    marks: {
      strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
      em: ({ children }) => <em className="italic">{children}</em>,
      code: ({ children }) => (
        <code className="px-1.5 py-0.5 rounded bg-white/[0.07] border border-white/10 text-[0.95em] font-mono text-white">
          {children}
        </code>
      ),
      link: ({ value, children }) => {
        const href = (value as { href?: string })?.href ?? '#'
        const blank = (value as { blank?: boolean })?.blank
        const nofollow = (value as { nofollow?: boolean })?.nofollow
        const sponsored = (value as { sponsored?: boolean })?.sponsored
        const isExternal = blank || /^https?:\/\//.test(href)
        const rel = [
          isExternal ? 'noopener' : '',
          nofollow ? 'nofollow' : '',
          sponsored ? 'sponsored' : '',
          isExternal ? 'noreferrer' : '',
        ].filter(Boolean).join(' ') || undefined

        if (isExternal) {
          return (
            <a
              href={href}
              target={blank ? '_blank' : undefined}
              rel={rel}
              className="underline underline-offset-4 decoration-2 transition-colors"
              style={{ color: accent, textDecorationColor: `${accent}80` }}
            >
              {children}
            </a>
          )
        }
        return (
          <Link
            href={href}
            className="underline underline-offset-4 decoration-2 transition-colors"
            style={{ color: accent, textDecorationColor: `${accent}80` }}
          >
            {children}
          </Link>
        )
      },
    },
    types: {
      // ── Image ────────────────────────────────────────────────────────────
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      image: ({ value }: { value: any }) => {
        if (!value?.asset) return null
        const alt = value.alt ?? ''
        const caption = value.caption ?? null
        const fullWidth = !!value.fullWidth
        const src = urlFor(value).width(fullWidth ? 1600 : 1200).fit('max').auto('format').url()
        return (
          <figure className={`my-10 ${fullWidth ? 'lg:-mx-16 xl:-mx-32' : ''}`}>
            <Image
              src={src}
              alt={alt}
              width={fullWidth ? 1600 : 1200}
              height={fullWidth ? 900 : 675}
              className="w-full h-auto rounded-xl border border-white/10"
              sizes={fullWidth ? '(min-width: 1280px) 1280px, 100vw' : '(min-width: 768px) 768px, 100vw'}
            />
            {caption && (
              <figcaption className="text-center text-sm text-[#9A9A9A] mt-3 italic">{caption}</figcaption>
            )}
          </figure>
        )
      },

      // ── Callout (info / warning / tip / stat) ────────────────────────────
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callout: ({ value }: { value: any }) => {
        const type = (value?.type ?? 'info') as 'info' | 'warning' | 'tip' | 'stat'
        const text = (value?.text ?? '') as string
        const palette: Record<typeof type, { color: string; label: string }> = {
          info: { color: '#5DA9FF', label: 'INFO' },
          warning: { color: '#FFB547', label: 'WARNING' },
          tip: { color: '#3DD68C', label: 'TIP' },
          stat: { color: accent, label: 'STAT' },
        }
        const { color, label } = palette[type]
        return (
          <aside
            className="my-8 rounded-xl p-5 border"
            style={{ backgroundColor: `${color}10`, borderColor: `${color}33` }}
            role="note"
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color }}>
              {label}
            </p>
            <p className="text-white text-base leading-relaxed">{text}</p>
          </aside>
        )
      },

      // ── Table ────────────────────────────────────────────────────────────
      // Renders Sanity tableBlock as a clean HTML <table> with semantic
      // <thead>/<tbody>. The first row is treated as the header row — this
      // is the convention Google's structured data parsers expect.
      //
      // Cells may arrive in two shapes depending on how the document was
      // authored / imported:
      //   1. Plain strings — `cells: ['Feature', 'Old', 'New']`
      //   2. Object cells  — `cells: [{ _type: 'tableCell', content: 'Feature' }, …]`
      // We normalize both into a string before rendering so React never
      // receives a raw object as children (which would crash with React
      // error #31 — "Objects are not valid as a React child").
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tableBlock: ({ value }: { value: any }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cellText = (cell: any): string => {
          if (cell == null) return ''
          if (typeof cell === 'string') return cell
          if (typeof cell === 'object') {
            if (typeof cell.content === 'string') return cell.content
            if (typeof cell.text === 'string') return cell.text
            if (typeof cell.value === 'string') return cell.value
          }
          return String(cell)
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rows: { cells?: any[] }[] = Array.isArray(value?.rows) ? value.rows : []
        if (rows.length === 0) return null
        const [headerRow, ...bodyRows] = rows
        const headerCells = (headerRow?.cells ?? []).map(cellText)
        const caption = (value?.caption ?? '') as string
        return (
          <figure className="my-10 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-[15px] border-collapse">
              {caption && (
                <caption className="text-sm text-[#9A9A9A] italic px-4 py-3 text-left bg-white/[0.02]">
                  {caption}
                </caption>
              )}
              {headerCells.length > 0 && (
                <thead>
                  <tr className="bg-white/[0.04] border-b border-white/10">
                    {headerCells.map((cell, i) => (
                      <th
                        key={i}
                        scope="col"
                        className="px-4 py-3 text-white font-semibold whitespace-nowrap"
                        style={{ fontFamily: 'var(--font-space-grotesk)' }}
                      >
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {bodyRows.map((row, ri) => (
                  <tr
                    key={ri}
                    className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors"
                  >
                    {(row.cells ?? []).map((cell, ci) => (
                      <td key={ci} className="px-4 py-3 text-[#C0C0C0] align-top">
                        {cellText(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </figure>
        )
      },

      // ── Code Block ───────────────────────────────────────────────────────
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      codeBlock: ({ value }: { value: any }) => {
        const code = (value?.code ?? '') as string
        const language = (value?.language ?? '') as string
        const filename = (value?.filename ?? '') as string
        return (
          <figure className="my-8 rounded-xl border border-white/10 overflow-hidden bg-[#0A0A0A]">
            {(filename || language) && (
              <figcaption className="flex items-center justify-between px-4 py-2 border-b border-white/10 text-xs">
                <span className="text-[#B0B0B0] font-mono">{filename}</span>
                {language && (
                  <span className="uppercase tracking-widest text-[#9A9A9A]">{language}</span>
                )}
              </figcaption>
            )}
            <pre className="p-4 overflow-x-auto text-[14px] leading-relaxed">
              <code className={`font-mono text-white whitespace-pre language-${language}`}>{code}</code>
            </pre>
          </figure>
        )
      },
    },
  }
}

// ── semantic section grouping ────────────────────────────────────────────────
//
// We wrap every contiguous run of Portable Text blocks that starts with an H2
// (or, before the first H2, all leading blocks) inside a `<section>`. This
// creates clear concept boundaries for AI chunk retrieval and Google's passage
// indexing without changing any visual styling.

function groupBlocksBySection(blocks: PortableTextBlock[]): PortableTextBlock[][] {
  const sections: PortableTextBlock[][] = []
  let current: PortableTextBlock[] = []
  for (const block of blocks) {
    const isH2 =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (block as any)?._type === 'block' && (block as any)?.style === 'h2'
    if (isH2 && current.length > 0) {
      sections.push(current)
      current = [block]
    } else {
      current.push(block)
    }
  }
  if (current.length > 0) sections.push(current)
  return sections
}

// ── public component ─────────────────────────────────────────────────────────

export default function PortableTextRenderer({ value, accent = '#FF5C00' }: Props) {
  if (!Array.isArray(value) || value.length === 0) return null
  const components = buildComponents(accent)
  const sections = groupBlocksBySection(value as PortableTextBlock[])
  return (
    <>
      {sections.map((blocks, i) => (
        <section key={i} className="blog-section">
          <PortableText value={blocks} components={components} />
        </section>
      ))}
    </>
  )
}
