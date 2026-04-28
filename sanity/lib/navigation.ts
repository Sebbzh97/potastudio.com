import { client } from './client'
import { groq } from 'next-sanity'

type SanityDoc = Record<string, any>

/**
 * getNavigation — reads nav items + Coming Soon dropdown content from the consolidated
 * siteSettings document. Fields are mapped to the shape `<Navigation />` expects so
 * components keep working even if the document is missing (graceful fallback to defaults).
 */
export const getNavigation = async (lang = 'en'): Promise<SanityDoc | null> => {
  try {
    const settings = await client.fetch(
      groq`*[_type == "siteSettings" && language == $lang][0]{
        navItems[]{
          label, href, isLive,
          children[]{ label, href, isLive, isSoon }
        },
        navCtaLabel, navCtaHref,
        navComingSoonHeader, navComingSoonFooter, navComingSoonBadge,
        navComingSoonItems[]{ title, description, icon }
      }`,
      { lang },
      { next: { tags: ['siteSettings', `siteSettings-${lang}`] } },
    )
    if (!settings) return null
    return {
      items: settings.navItems ?? [],
      ctaLabel: settings.navCtaLabel,
      ctaHref: settings.navCtaHref,
      comingSoonHeader: settings.navComingSoonHeader,
      comingSoonFooter: settings.navComingSoonFooter,
      comingSoonBadge: settings.navComingSoonBadge,
      comingSoonItems: settings.navComingSoonItems ?? [],
    }
  } catch {
    return null
  }
}
