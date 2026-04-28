import { defineType, defineField } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'general', title: 'General' },
    { name: 'navigation', title: 'Navigation' },
    { name: 'footer', title: 'Footer' },
    { name: 'cookie', title: 'Cookie Banner' },
    { name: 'seo', title: 'SEO & Social' },
  ],
  fields: [
    // ── General ──────────────────────────────────────────────────────────────
    defineField({ name: 'language', type: 'string', readOnly: true, hidden: true }),
    defineField({ name: 'siteName', title: 'Site Name', type: 'string', group: 'general' }),
    defineField({ name: 'siteTagline', title: 'Tagline', type: 'string', group: 'general' }),

    // ── Navigation ───────────────────────────────────────────────────────────
    defineField({
      name: 'navItems',
      title: 'Nav Links',
      type: 'array',
      group: 'navigation',
      description: 'Top-level nav links. Optionally add children to create a dropdown menu.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', title: 'Label' }),
            defineField({ name: 'href', type: 'string', title: 'URL' }),
            defineField({ name: 'isLive', type: 'boolean', title: 'Show live dot', initialValue: false }),
            defineField({
              name: 'children',
              title: 'Dropdown items (optional)',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({ name: 'label', type: 'string', title: 'Label' }),
                    defineField({ name: 'href', type: 'string', title: 'URL (leave blank for "Coming Soon")' }),
                    defineField({ name: 'isLive', type: 'boolean', title: 'Show live dot', initialValue: false }),
                    defineField({ name: 'isSoon', type: 'boolean', title: 'Show as Coming Soon flyout', initialValue: false }),
                  ],
                  preview: { select: { title: 'label', subtitle: 'href' } },
                },
              ],
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'href' },
          },
        },
      ],
    }),
    defineField({ name: 'navCtaLabel', title: 'Nav CTA Button Label', type: 'string', group: 'navigation' }),
    defineField({ name: 'navCtaHref', title: 'Nav CTA Button URL', type: 'string', group: 'navigation' }),

    // Coming Soon dropdown content (rendered inside nav flyout)
    defineField({ name: 'navComingSoonHeader', title: 'Coming Soon Header', type: 'string', group: 'navigation', description: 'Eyebrow text shown above the Coming Soon flyout (e.g. "In Arrivo").' }),
    defineField({ name: 'navComingSoonFooter', title: 'Coming Soon Footer Text', type: 'string', group: 'navigation', description: 'Italic line at the bottom of the flyout.' }),
    defineField({ name: 'navComingSoonBadge', title: 'Coming Soon Badge Label', type: 'string', group: 'navigation', description: 'Small badge label (e.g. "Soon").' }),
    defineField({
      name: 'navComingSoonItems',
      title: 'Coming Soon Items',
      type: 'array',
      group: 'navigation',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string', title: 'Title' }),
            defineField({ name: 'description', type: 'text', rows: 2, title: 'Description' }),
            defineField({
              name: 'icon',
              type: 'string',
              title: 'Icon',
              options: {
                list: [
                  { title: 'Mortarboard (courses)', value: 'courses' },
                  { title: 'Play (video)', value: 'play' },
                  { title: 'Calendar (events)', value: 'calendar' },
                ],
              },
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'description' } },
        },
      ],
    }),

    // ── Footer ───────────────────────────────────────────────────────────────
    defineField({ name: 'footerTagline', title: 'Footer Tagline', type: 'string', group: 'footer' }),
    defineField({ name: 'footerCopyright', title: 'Copyright Text', type: 'string', group: 'footer' }),
    defineField({ name: 'footerAddress1', title: 'Address — Bergamo', type: 'string', group: 'footer' }),
    defineField({ name: 'footerAddress2', title: 'Address — Milan', type: 'string', group: 'footer' }),
    defineField({ name: 'footerVat', title: 'P.IVA / VAT', type: 'string', group: 'footer' }),

    // Legal info shown in footer bottom-bar
    defineField({ name: 'legalCompanyName', title: 'Legal Company Name', type: 'string', group: 'footer', description: 'E.g. "Anyped S.R.L."' }),
    defineField({ name: 'legalRea', title: 'REA Number', type: 'string', group: 'footer', description: 'E.g. "REA BG-123456"' }),
    defineField({ name: 'legalCapital', title: 'Capital Sociale', type: 'string', group: 'footer', description: 'E.g. "Cap. soc. €10.000 i.v."' }),
    defineField({ name: 'legalAddress', title: 'Legal Address', type: 'string', group: 'footer', description: 'E.g. "Via Zanica 85, Bergamo 24126"' }),
    defineField({ name: 'privacyLabel', title: 'Privacy Link Label', type: 'string', group: 'footer' }),
    defineField({ name: 'privacyHref', title: 'Privacy Link URL', type: 'string', group: 'footer' }),
    defineField({ name: 'cookieLabel', title: 'Cookie Link Label', type: 'string', group: 'footer' }),
    defineField({ name: 'cookieHref', title: 'Cookie Link URL', type: 'string', group: 'footer' }),

    defineField({
      name: 'footerColumns',
      title: 'Link Columns',
      type: 'array',
      group: 'footer',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string', title: 'Column Title' }),
            defineField({
              name: 'links',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({ name: 'label', type: 'string' }),
                    defineField({ name: 'href', type: 'string' }),
                  ],
                  preview: { select: { title: 'label', subtitle: 'href' } },
                },
              ],
            }),
          ],
          preview: { select: { title: 'title' } },
        },
      ],
    }),

    // ── Cookie Banner ────────────────────────────────────────────────────────
    defineField({ name: 'cookieBannerTitle', title: 'Banner Title', type: 'string', group: 'cookie' }),
    defineField({
      name: 'cookieBannerBody',
      title: 'Banner Body Text',
      type: 'text',
      rows: 3,
      group: 'cookie',
      description: 'Plain text. The privacy and cookie links will be appended after this text.',
    }),
    defineField({ name: 'cookieAcceptLabel', title: 'Accept Button Label', type: 'string', group: 'cookie' }),
    defineField({ name: 'cookieRejectLabel', title: 'Reject Button Label', type: 'string', group: 'cookie' }),

    // ── SEO & Social ─────────────────────────────────────────────────────────
    defineField({ name: 'seoDescription', title: 'Default SEO Description', type: 'text', rows: 3, group: 'seo' }),
    defineField({ name: 'ogImage', title: 'Default OG Image', type: 'image', group: 'seo' }),
    defineField({
      name: 'socials',
      title: 'Social Links',
      type: 'object',
      group: 'seo',
      fields: [
        defineField({ name: 'instagram', type: 'url', title: 'Instagram' }),
        defineField({ name: 'tiktok', type: 'url', title: 'TikTok' }),
        defineField({ name: 'linkedin', type: 'url', title: 'LinkedIn' }),
        defineField({ name: 'youtube', type: 'url', title: 'YouTube' }),
        defineField({ name: 'x', type: 'url', title: 'X (Twitter)' }),
      ],
    }),
  ],
  preview: {
    select: { title: 'siteName', subtitle: 'siteTagline' },
  },
})

export default siteSettings
