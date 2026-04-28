import Link from 'next/link'
import { PortableText, type PortableTextBlock } from '@portabletext/react'
import IubendaEmbed from '@/components/legal/iubenda-embed'

interface LegalPageProps {
  eyebrow: string
  title: string
  lastUpdated?: string
  appliesToLabel: string
  body?: PortableTextBlock[] | null
  seeAlsoLabel: string
  seeAlsoHref: string
  seeAlsoLinkLabel: string
  /**
   * If provided, renders the Iubenda embed (button that opens the full policy in a modal)
   * either alongside the Sanity body (if present) or as the sole content.
   */
  iubenda?: {
    url: string
    label: string
    caption?: string
    subCaption?: string
  }
}

export default function LegalPage({
  eyebrow,
  title,
  lastUpdated,
  appliesToLabel,
  body,
  seeAlsoLabel,
  seeAlsoHref,
  seeAlsoLinkLabel,
  iubenda,
}: LegalPageProps) {
  const hasBody = body && body.length > 0
  return (
    <main>
      {/* Hero */}
      <section className="pt-40 pb-16 bg-[#0D0D0D] border-b border-white/10">
        <div className="container-site" style={{ maxWidth: '56rem' }}>
          <span className="text-xs font-semibold text-[#FF5C00] uppercase tracking-[0.3em] mb-6 block">
            {eyebrow}
          </span>
          <h1
            className="text-5xl md:text-7xl font-bold text-white leading-none mb-6 text-balance"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            {title}
          </h1>
          {lastUpdated && (
            <p className="text-[#B0B0B0] text-sm">
              {lastUpdated} &nbsp;·&nbsp; {appliesToLabel}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-[#0D0D0D]">
        <div className="container-site" style={{ maxWidth: '56rem' }}>
          <div className="legal-body text-[#B0B0B0] text-sm leading-[1.85]">
            {hasBody ? (
              <PortableText
                value={body}
                components={{
                  block: {
                    h2: ({ children }) => (
                      <h2
                        className="text-2xl font-bold text-white mb-4 mt-14 first:mt-0"
                        style={{ fontFamily: 'var(--font-space-grotesk)' }}
                      >
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3
                        className="text-lg font-semibold text-white mb-3 mt-8"
                        style={{ fontFamily: 'var(--font-space-grotesk)' }}
                      >
                        {children}
                      </h3>
                    ),
                    normal: ({ children }) => <p className="mb-4">{children}</p>,
                  },
                  list: {
                    bullet: ({ children }) => <ul className="list-disc pl-6 mb-4 flex flex-col gap-2">{children}</ul>,
                    number: ({ children }) => <ol className="list-decimal pl-6 mb-4 flex flex-col gap-2">{children}</ol>,
                  },
                  marks: {
                    strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                    link: ({ children, value }) => (
                      <a
                        href={value?.href}
                        className="text-[#FF5C00] hover:underline"
                        target={value?.href?.startsWith('http') ? '_blank' : undefined}
                        rel={value?.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {children}
                      </a>
                    ),
                  },
                }}
              />
            ) : iubenda ? null : (
              <p>—</p>
            )}
          </div>

          {iubenda && (
            <div className={hasBody ? 'mt-12' : 'mt-2'}>
              <IubendaEmbed
                url={iubenda.url}
                label={iubenda.label}
                caption={iubenda.caption}
                subCaption={iubenda.subCaption}
              />
            </div>
          )}

          {/* See also link */}
          <div className="mt-16 pt-10 border-t border-white/10">
            <p className="text-[#B0B0B0] text-sm">
              {seeAlsoLabel}{' '}
              <Link href={seeAlsoHref} className="text-[#FF5C00] hover:underline">
                {seeAlsoLinkLabel}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
