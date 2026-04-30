import Image from 'next/image'

/**
 * Displays official partner/certification badges to reinforce E-E-A-T
 * signals for Google & GEO crawlers. Each badge is schema.org-tagged with
 * `itemProp="award"` or `hasCredential` microdata so structured-data parsers
 * can recognise the certifications.
 *
 * Renders in the footer (global), visible above the legal columns on
 * all public pages (excluded from /studio).
 */
export default function PartnerBadges({ locale = 'en' }: { locale?: 'en' | 'it' }) {
  const isIt = locale === 'it'
  const title = isIt ? 'Partner & Certificazioni' : 'Partners & Certifications'
  return (
    <section
      aria-labelledby="partner-badges-heading"
      className="border-t border-white/10 pt-10 pb-6"
      itemProp="hasCredential"
      itemScope
      itemType="https://schema.org/EducationalOccupationalCredential"
    >
      <h4
        id="partner-badges-heading"
        className="text-white text-xs sm:text-sm font-semibold uppercase tracking-widest mb-6"
      >
        {title}
      </h4>
      <div className="flex flex-wrap items-center gap-6 sm:gap-8">
        {/* TikTok Official Marketing Partner */}
        <div
          itemProp="award"
          itemScope
          itemType="https://schema.org/Grant"
          className="flex items-center"
        >
          <meta itemProp="name" content="TikTok Official Marketing Partner" />
          <meta itemProp="description" content="Certified TikTok Official Marketing Partner since 2023" />
          <meta itemProp="funder" content="TikTok" />
          <a
            href="https://www.tiktok.com/business/en/partners"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-60 hover:opacity-100 transition-opacity"
            aria-label="TikTok Official Marketing Partner"
          >
            <Image
              src="/badges/tiktok-partner.svg"
              alt="TikTok Official Marketing Partner badge"
              width={140}
              height={48}
              className="h-10 sm:h-12 w-auto"
            />
          </a>
        </div>

        {/* Google Partner */}
        <div
          itemProp="award"
          itemScope
          itemType="https://schema.org/Grant"
          className="flex items-center"
        >
          <meta itemProp="name" content="Google Partner" />
          <meta itemProp="description" content="Google Ads certified partner" />
          <meta itemProp="funder" content="Google" />
          <a
            href="https://partnersdirectory.withgoogle.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Google Partner"
          >
            <Image
              src="/badges/google-partner.svg"
              alt="Google Partner badge"
              width={140}
              height={48}
              className="h-10 sm:h-12 w-auto"
            />
          </a>
        </div>

        {/* Meta Business Partner (optional, uncomment when approved) */}
        {/* 
        <div
          itemProp="award"
          itemScope
          itemType="https://schema.org/Grant"
          className="flex items-center"
        >
          <meta itemProp="name" content="Meta Business Partner" />
          <meta itemProp="description" content="Meta certified business partner" />
          <meta itemProp="funder" content="Meta" />
          <a
            href="https://www.facebook.com/business/partner-directory"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Meta Business Partner"
          >
            <Image
              src="/badges/meta-partner.svg"
              alt="Meta Business Partner badge"
              width={140}
              height={48}
              className="h-10 sm:h-12 w-auto"
            />
          </a>
        </div>
        */}
      </div>
    </section>
  )
}
