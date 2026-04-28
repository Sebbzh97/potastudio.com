interface StatsData {
  stat1Value?: string | number
  stat1Label?: string
  stat2Value?: string | number
  stat2Label?: string
  stat3Value?: string | number
  stat3Label?: string
  stat4Value?: string | number
  stat4Label?: string
}

export default function StatsBar({ data, locale }: { data?: StatsData | null; locale?: 'en' | 'it' }) {
  const isIt = locale === 'it'
  const stats = [
    { value: data?.stat1Value, label: data?.stat1Label ?? (isIt ? 'Anni. Zero scadenze mancate.' : 'Years. Zero missed deadlines.') },
    { value: data?.stat2Value, label: data?.stat2Label ?? (isIt ? 'Budget gestito in ADS ogni anno' : 'In annual ad spend managed') },
    { value: data?.stat3Value, label: data?.stat3Label ?? (isIt ? 'Aziende supportate in Europa e US' : 'Clients across Europe and the US') },
    { value: data?.stat4Value, label: data?.stat4Label ?? (isIt ? 'Campagne influencer gestite' : 'Influencer campaigns managed') },
  ].filter((s) => s.value !== undefined && s.value !== null && s.value !== '')

  if (stats.length === 0) return null

  return (
    <section className="bg-[#141414] border-t border-b border-white/10 py-10 sm:py-12">
      <div className="container-site">
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center px-6 sm:px-8 py-6 sm:py-0 gap-2 text-center"
            >
              <span
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#FFC629] leading-none"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                {String(stat.value)}
              </span>
              <span className="text-[#B0B0B0] text-xs sm:text-sm text-center leading-snug font-medium">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
