import type { Metadata } from 'next'
import { ArrowUpRight } from 'lucide-react'
import { getCareersPage, getJobOpenings } from '@/sanity/lib/page-queries'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const data = await getCareersPage('it')
  return {
    title: data?.seoTitle ?? 'Lavora con noi | Pota Studio',
    description: data?.seoDescription ?? '',
    alternates: {
      canonical: 'https://potastudio.com/it/careers',
      languages: {
        en: 'https://potastudio.com/careers',
        it: 'https://potastudio.com/it/careers',
        'x-default': 'https://potastudio.com/careers',
      },
    },
  }
}

export default async function CareersPageIT() {
  const [data, jobs] = await Promise.all([getCareersPage('it'), getJobOpenings()])

  const heroLabel    = data?.heroLabel    ?? ''
  const heroHeadline = data?.heroHeadline ?? ''
  const heroAccent   = data?.heroAccent   ?? ''
  const heroBody     = data?.heroBody     ?? ''

  const perksHeadline = data?.perksHeadline ?? ''
  const rolesLabel    = data?.rolesLabel    ?? ''

  const spontaneousLabel    = data?.spontaneousLabel    ?? ''
  const spontaneousHeadline = data?.spontaneousHeadline ?? ''
  const spontaneousBody     = data?.spontaneousBody     ?? ''

  const noPositionsHeadline = data?.noPositionsHeadline ?? ''
  const noPositionsBody     = data?.noPositionsBody     ?? ''

  const perks = [1, 2, 3, 4, 5]
    .map((n) => ({
      title: (data?.[`perk${n}Title`] as string | undefined) ?? '',
      description: (data?.[`perk${n}Body`] as string | undefined) ?? '',
    }))
    .filter((p) => p.title)

  return (
    <main>
      <section className="pt-28 sm:pt-40 pb-16 sm:pb-24 bg-[#0D0D0D] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#FFFFFF 1px, transparent 1px), linear-gradient(90deg, #FFFFFF 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
          aria-hidden="true"
        />
        <div className="container-site relative">
          {heroLabel && (
            <span className="text-xs font-semibold text-[#FF5C00] uppercase tracking-[0.3em] mb-4 sm:mb-6 block">
              {heroLabel}
            </span>
          )}
          <h1
            className="font-bold text-white leading-[1.05] mb-5 sm:mb-6"
            style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 'clamp(3rem, 11vw, 8rem)' }}
          >
            {heroHeadline}
            {heroAccent && (<><br /><span className="text-[#FF5C00]">{heroAccent}</span></>)}
          </h1>
          {heroBody && <p className="text-base sm:text-xl text-[#B0B0B0] max-w-2xl leading-relaxed">{heroBody}</p>}
        </div>
      </section>

      {perks.length > 0 && (
        <section className="py-16 sm:py-24 bg-[#141414] border-t border-white/10">
          <div className="container-site">
            {perksHeadline && (
              <span className="text-xs font-semibold text-[#FF5C00] uppercase tracking-[0.3em] mb-8 sm:mb-12 block">
                {perksHeadline}
              </span>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {perks.slice(0, 3).map((perk, i) => (
                <div
                  key={perk.title}
                  className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6 sm:p-8 hover:border-[#FF5C00]/30 transition-colors"
                >
                  <span
                    className="text-4xl sm:text-5xl font-bold text-[#FF5C00] opacity-20 block mb-4"
                    style={{ fontFamily: 'var(--font-space-grotesk)' }}
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3
                    className="text-base sm:text-lg font-bold text-white mb-3"
                    style={{ fontFamily: 'var(--font-space-grotesk)' }}
                  >
                    {perk.title}
                  </h3>
                  <p className="text-[#B0B0B0] text-sm leading-relaxed">{perk.description}</p>
                </div>
              ))}
            </div>
            {perks.length > 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:w-2/3 lg:mx-auto mt-4 sm:mt-6">
                {perks.slice(3).map((perk, i) => (
                  <div
                    key={perk.title}
                    className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6 sm:p-8 hover:border-[#FF5C00]/30 transition-colors"
                  >
                    <span
                      className="text-4xl sm:text-5xl font-bold text-[#FF5C00] opacity-20 block mb-4"
                      style={{ fontFamily: 'var(--font-space-grotesk)' }}
                      aria-hidden="true"
                    >
                      {String(i + 4).padStart(2, '0')}
                    </span>
                    <h3
                      className="text-base sm:text-lg font-bold text-white mb-3"
                      style={{ fontFamily: 'var(--font-space-grotesk)' }}
                    >
                      {perk.title}
                    </h3>
                    <p className="text-[#B0B0B0] text-sm leading-relaxed">{perk.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {(noPositionsHeadline || rolesLabel || jobs.length > 0) && (
        <section className="py-16 sm:py-24 bg-[#0D0D0D] border-t border-white/10">
          <div className="container-site">
            {rolesLabel && (
              <span className="text-xs font-semibold text-[#FF5C00] uppercase tracking-[0.3em] mb-8 sm:mb-12 block">
                {rolesLabel}
              </span>
            )}

            {jobs.length > 0 ? (
              <ul className="flex flex-col gap-3 sm:gap-4">
                {jobs.map((job) => {
                  const title = job.titleIt ?? job.title
                  const description = job.descriptionIt ?? job.description
                  const meta = [job.department, job.location, job.workMode, job.type]
                    .filter(Boolean)
                    .join(' · ')
                  const applyHref = job.applyEmail
                    ? `mailto:${job.applyEmail}?subject=${encodeURIComponent(`Candidatura — ${title}`)}`
                    : undefined
                  return (
                    <li
                      key={job._id}
                      className="border border-white/10 rounded-xl p-5 sm:p-6 bg-[#141414] hover:border-[#FF5C00]/40 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <h3
                          className="text-lg sm:text-xl font-bold text-white mb-1"
                          style={{ fontFamily: 'var(--font-space-grotesk)' }}
                        >
                          {title}
                        </h3>
                        {meta && (
                          <p className="text-[#B0B0B0] text-xs sm:text-sm uppercase tracking-wider">
                            {meta}
                          </p>
                        )}
                        {description && (
                          <p className="text-[#B0B0B0] text-sm leading-relaxed mt-2 max-w-2xl">
                            {description}
                          </p>
                        )}
                      </div>
                      {applyHref && (
                        <a
                          href={applyHref}
                          className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-[#FF5C00] text-white text-sm font-semibold rounded hover:bg-[#e04f00] transition-colors flex-shrink-0"
                        >
                          Candidati
                          <ArrowUpRight size={14} />
                        </a>
                      )}
                    </li>
                  )
                })}
              </ul>
            ) : (
              noPositionsHeadline && (
                <div className="border border-white/10 rounded-xl p-8 sm:p-12 bg-[#141414] text-center max-w-2xl">
                  <h2
                    className="text-2xl sm:text-3xl font-bold text-white mb-4"
                    style={{ fontFamily: 'var(--font-space-grotesk)' }}
                  >
                    {noPositionsHeadline}
                  </h2>
                  {noPositionsBody && <p className="text-[#B0B0B0] leading-relaxed text-sm sm:text-base">{noPositionsBody}</p>}
                </div>
              )
            )}
          </div>
        </section>
      )}

      {spontaneousHeadline && (
        <section className="py-16 sm:py-24 bg-[#141414] border-t border-white/10">
          <div className="container-site">
            <div className="max-w-2xl">
              {spontaneousLabel && (
                <span className="text-xs font-semibold text-[#FF5C00] uppercase tracking-[0.3em] mb-4 sm:mb-6 block">
                  {spontaneousLabel}
                </span>
              )}
              <h2
                className="text-3xl sm:text-4xl font-bold text-white mb-4"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                {spontaneousHeadline}
              </h2>
              {spontaneousBody && (
                <p className="text-[#B0B0B0] leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base">
                  {spontaneousBody}
                </p>
              )}
              <a
                href="mailto:ciao@potastudio.com?subject=Candidatura Spontanea"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 bg-white text-[#0D0D0D] text-sm font-semibold rounded hover:bg-[#F0F0F0] active:bg-[#E0E0E0] transition-colors"
              >
                ciao (at) potastudio (dot) com
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
