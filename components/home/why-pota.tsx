import { Check } from 'lucide-react'

interface WhyPotaData {
  whyEyebrow?: string
  whyQuote?: string
  whyBody?: string
  whyPoint1?: string
  whyPoint2?: string
  whyPoint3?: string
}

function clean(text: string) {
  return text.replace(/ — /g, '. ').replace(/—/g, ' ')
}

export default function WhyPota({ data, locale }: { data?: WhyPotaData | null; locale?: 'en' | 'it' }) {
  const isIt = locale === 'it'

  const eyebrow = clean(data?.whyEyebrow ?? (isIt ? 'Perché Pota Studio' : 'Why Pota Studio'))
  const quote   = clean(data?.whyQuote   ?? (isIt ? 'In 7 anni non abbiamo mai mancato una scadenza.' : 'In 7 years we have never missed a deadline.'))
  const body    = clean(data?.whyBody    ?? (isIt
    ? 'Non siamo alla ricerca di 25 clienti. La nostra filosofia è meno clienti e più qualità, sotto ogni punto di vista e ad un prezzo estremamente accessibile. Team giovane e dinamico. Area content in-house. Fast reply. Freschezza nelle proposte ed ossessione del prodotto. Siamo i primi a sapere come si aggiornano i social.'
    : 'We are not chasing 25 clients. Our philosophy is fewer clients and higher quality in every way, at an extremely accessible price. Young and dynamic team. In-house content area. Fast reply. Fresh proposals and obsession with the product. We are always the first to know how social platforms evolve.'))

  const points = [
    data?.whyPoint1 ?? (isIt ? '€2.5M+ gestiti in ads su Meta, Google, TikTok' : '€2.5M+ managed in ads across Meta, Google, TikTok'),
    data?.whyPoint2 ?? (isIt ? 'Clienti sia in Europa che negli USA' : 'Clients across Europe and the US'),
    data?.whyPoint3 ?? (isIt ? 'Produzione in-house di contenuti, nessun outsourcing' : 'In-house content production, no outsourcing'),
  ]

  // Highlight the "never missed" portion of the quote
  const accentWord = isIt ? 'mai mancato una scadenza.' : 'never missed a deadline.'
  const quoteBase  = isIt ? 'In 7 anni non abbiamo ' : 'In 7 years we have '
  const quoteFull  = quote

  const splitIdx = quoteFull.indexOf(isIt ? 'mai' : 'never')
  const quoteStart = splitIdx > -1 ? quoteFull.slice(0, splitIdx) : quoteFull
  const quoteEnd   = splitIdx > -1 ? quoteFull.slice(splitIdx) : ''
  void quoteBase
  void accentWord

  return (
    <section className="py-16 sm:py-24 2xl:py-32 bg-[#0D0D0D] border-t border-white/10">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 2xl:gap-24 items-center">

          {/* Left: copy */}
          <div>
            <span className="text-xs font-semibold text-[#FF5C00] uppercase tracking-[0.3em] mb-4 sm:mb-6 block">
              {eyebrow}
            </span>
            <blockquote
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-bold text-white leading-tight"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              {quoteEnd ? (
                <>
                  {quoteStart}
                  <span className="text-[#FF5C00]">{quoteEnd}</span>
                </>
              ) : quoteFull}
            </blockquote>
            <p className="mt-4 sm:mt-6 text-[#B0B0B0] text-base sm:text-lg leading-relaxed">
              {body}
            </p>
          </div>

          {/* Right: bullet points */}
          <div className="flex flex-col gap-3 sm:gap-6">
            {points.map((point) => (
              <div
                key={point}
                className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-[#141414] border border-white/10 rounded-lg hover:border-[#FF5C00]/40 transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FF5C00]/15 flex-shrink-0">
                  <Check size={16} className="text-[#FF5C00]" />
                </div>
                <span
                  className="text-white font-semibold text-base sm:text-lg"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  {point}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
