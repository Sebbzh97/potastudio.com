import Image from 'next/image'
import { getHomepageClients } from '@/sanity/lib/page-queries'

type ClientsData = {
  clientsHeadline?: string
}

/**
 * Homepage client logo wall.
 *
 * Renders an infinite horizontal marquee of client logos pulled from Sanity
 * (`getClients()`). Every brand sits inside a FIXED-SIZE slot (h-12 w-36) so
 * logos with very different aspect ratios — square, wide, tall — never look
 * unbalanced next to each other. We use `object-contain` to letter-box each
 * image inside the slot and a soft monochrome filter (grayscale + brightness
 * boost) to homogenise the visual weight; hover restores the original color.
 *
 * If a brand has no logo on Sanity yet, we render its uppercase name inside
 * the same slot so the row stays perfectly aligned regardless of which
 * clients have been image-uploaded.
 */
export default async function ClientLogoWall({
  data,
  locale = 'en',
}: {
  data?: ClientsData
  locale?: 'en' | 'it'
}) {
  const sanityClients = await getHomepageClients()

  if (sanityClients.length === 0) return null

  const isIt = locale === 'it'
  const headline =
    data?.clientsHeadline ??
    (isIt
      ? 'Scelti da brand di livello mondiale'
      : 'Trusted by world-class brands')

  // Two copies of the list create a seamless infinite scroll — the keyframe
  // (defined in globals.css as `animate-marquee`) translates by -50% so the
  // second copy lands exactly where the first started.
  const loop = [...sanityClients, ...sanityClients]

  return (
    <section
      className="py-16 bg-[#141414] border-t border-b border-white/10"
      aria-label={isIt ? 'I nostri clienti' : 'Our clients'}
    >
      <div className="container-site mb-10">
        <p className="text-center text-xs font-semibold text-[#B0B0B0] uppercase tracking-[0.3em]">
          {headline}
        </p>
      </div>

      <div className="overflow-hidden relative">
        {/* Soft fade edges to make the marquee disappear into the background */}
        <div
          className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#141414] to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#141414] to-transparent"
          aria-hidden="true"
        />

        {/* Screen-reader list — the visual marquee is decorative */}
        <ul className="sr-only">
          {sanityClients.map((c) => (
            <li key={c._id}>{c.name}</li>
          ))}
        </ul>

        <div
          className="flex items-center gap-12 md:gap-16 animate-marquee whitespace-nowrap"
          aria-hidden="true"
        >
          {loop.map((c, i) => (
            <div
              key={`${c._id}-${i}`}
              // Fixed slot size guarantees uniform visual weight across all
              // brands regardless of logo aspect ratio or name length.
              className="flex-shrink-0 flex items-center justify-center h-12 w-36"
            >
              {c.logoUrl ? (
                <div className="relative h-full w-full">
                  <Image
                    src={c.logoUrl}
                    alt={c.name}
                    fill
                    sizes="144px"
                    className="object-contain opacity-60 grayscale brightness-150 contrast-125 transition-all duration-300 hover:opacity-100 hover:grayscale-0 hover:brightness-100 hover:contrast-100"
                  />
                </div>
              ) : (
                <span
                  className="text-base md:text-lg font-bold uppercase tracking-wider text-[#B0B0B0]/60 hover:text-white transition-colors duration-300"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  {c.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
