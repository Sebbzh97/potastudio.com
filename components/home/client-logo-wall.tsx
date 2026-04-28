import { getClients } from '@/sanity/lib/page-queries'

type ClientsData = {
  clientsHeadline?: string
}

export default async function ClientLogoWall({ data, locale = 'en' }: { data?: ClientsData; locale?: 'en' | 'it' }) {
  const sanityClients = await getClients()
  const names = sanityClients.map((c) => c.name.toUpperCase())

  if (names.length === 0) return null

  const isIt = locale === 'it'
  const headline = data?.clientsHeadline ?? (isIt ? 'Scelti da brand di livello mondiale' : 'Trusted by world-class brands')

  return (
    <section className="py-16 bg-[#141414] border-t border-b border-white/10">
      <div className="container-site mb-10">
        <p className="text-center text-xs font-semibold text-[#B0B0B0] uppercase tracking-[0.3em]">
          {headline}
        </p>
      </div>
      <div className="overflow-hidden relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#141414] to-transparent" aria-hidden="true" />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#141414] to-transparent" aria-hidden="true" />

        {/* Screen-reader list */}
        <ul className="sr-only">
          {names.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>

        <div className="flex gap-16 animate-marquee whitespace-nowrap" aria-hidden="true">
          {[...names, ...names, ...names, ...names].map((name, i) => (
            <div key={i} className="flex items-center justify-center px-6">
              <span
                className="text-2xl font-bold text-[#B0B0B0]/60 hover:text-white transition-colors duration-300 tracking-wider"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
