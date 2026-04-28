import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

interface ServiceItem {
  number?: string
  name?: string
  description?: string
  imageUrl?: string
}

interface ServicesData {
  servicesHeadline?: string
  servicesBody?: string
  servicesEyebrow?: string
  servicesAllLabel?: string
  servicesLearnMoreLabel?: string
  servicesList?: ServiceItem[]
}

export default function ServicesPreview({ data, locale }: { data?: ServicesData | null; locale?: 'en' | 'it' }) {
  const isIt     = locale === 'it'
  const services = data?.servicesList ?? []
  const headline = data?.servicesHeadline ?? ''
  const [line1, line2] = headline.includes('\n') ? headline.split('\n') : [headline, '']
  const servicesHref = isIt ? '/it/services' : '/services'
  const allLabel     = data?.servicesAllLabel ?? (isIt ? 'Tutti i servizi' : 'All services')
  const learnMore    = data?.servicesLearnMoreLabel ?? (isIt ? 'Scopri di piu' : 'Learn more')
  const eyebrow      = data?.servicesEyebrow ?? (isIt ? 'Cosa facciamo' : 'What We Do')

  if (services.length === 0) return null

  return (
    <section className="py-16 sm:py-24 bg-[#0D0D0D]">
      <div className="container-site">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-10 sm:mb-16">
          <div>
            <span className="text-xs font-semibold text-[#FFC629] uppercase tracking-[0.3em] mb-3 sm:mb-4 block">
              {eyebrow}
            </span>
            <h2
              className="font-bold text-white"
              style={{
                fontFamily: 'var(--font-space-grotesk)',
                fontSize: 'clamp(2rem, 4.5vw, 5rem)',
              }}
            >
              {line1}
              {line2 && <><br />{line2}</>}
            </h2>
          </div>
          <Link
            href={servicesHref}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#B0B0B0] hover:text-white transition-colors group self-start sm:self-auto"
          >
            {allLabel}
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
          {services.map((service, i) => (
            <Link
              key={service.number ?? service.name ?? i}
              href={servicesHref}
              className="group relative bg-[#0D0D0D] p-6 sm:p-8 flex flex-col gap-3 sm:gap-4 transition-all duration-300 hover:shadow-[inset_0_0_0_1px_#FFC629] active:bg-[#141414] overflow-hidden min-h-[200px]"
            >
              {/* Background image */}
              {service.imageUrl && (
                <Image
                  src={service.imageUrl}
                  alt={service.name ?? ''}
                  fill
                  className="object-cover opacity-20 group-hover:opacity-40 group-hover:scale-105 transition-all duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              )}
              
              {/* Gradient overlay */}
              {service.imageUrl && (
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/80 to-[#0D0D0D]/60" />
              )}
              
              {/* Content */}
              <div className="relative z-10 flex flex-col gap-3 sm:gap-4 h-full">
                {service.number && (
                  <span
                    className="text-3xl sm:text-4xl font-bold text-[#FFC629] opacity-50 group-hover:opacity-100 transition-opacity"
                    style={{ fontFamily: 'var(--font-space-grotesk)' }}
                    aria-hidden="true"
                  >
                    {service.number}
                  </span>
                )}
                {service.name && (
                  <h3
                    className="text-lg sm:text-xl font-bold text-white group-hover:text-[#FFC629] transition-colors"
                    style={{ fontFamily: 'var(--font-space-grotesk)' }}
                  >
                    {service.name}
                  </h3>
                )}
                {service.description && (
                  <p className="text-[#B0B0B0] text-sm leading-relaxed">{service.description}</p>
                )}
                <div className="mt-auto flex items-center gap-2 text-[#FF5C00] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {learnMore}
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
