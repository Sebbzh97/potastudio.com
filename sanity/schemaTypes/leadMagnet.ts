import { defineType, defineField } from 'sanity'
import { Download } from 'lucide-react'
import { slugIsUrlSafe } from '../lib/slug-validation'

/**
 * Lead Magnet
 *
 * A single-document type that powers the conversion widget shown inside blog
 * articles and other editorial pages (the "Free Resource" card).
 *
 * The document is bilingual: fields without a language suffix are global
 * (e.g. the PDF file), while `_en` / `_it` suffixed fields hold locale copy.
 *
 * Only one document per locale should exist at a time (slug: 'default').
 * The frontend fetches both and picks the right one via `locale`.
 */
export const leadMagnet = defineType({
  name: 'leadMagnet',
  title: 'Lead Magnet',
  type: 'document',
  icon: Download,
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'asset', title: 'Asset & Form' },
    { name: 'localeIt', title: 'Italian copy' },
  ],
  fields: [
    // ── Internal ──────────────────────────────────────────────────────────────
    defineField({
      name: 'internalTitle',
      title: 'Internal title (CMS only)',
      type: 'string',
      group: 'content',
      description: 'Used only in the Studio list view. Not shown on site.',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      description: 'Use "default" for the main magnet, or a specific slug for variants.',
      options: { source: 'internalTitle', maxLength: 64 },
      validation: (R) => R.required().custom(slugIsUrlSafe),
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      group: 'content',
      description: 'When off, the component falls back to the hardcoded copy.',
      initialValue: true,
    }),

    // ── English copy (primary locale) ─────────────────────────────────────────
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow (EN)',
      type: 'string',
      group: 'content',
      description: 'Small orange label above the headline. E.g. "Free Resource".',
      initialValue: 'Free Resource',
    }),
    defineField({
      name: 'badge',
      title: 'Badge (EN)',
      type: 'string',
      group: 'content',
      description: 'Pill next to eyebrow. E.g. "PDF · 12 pages".',
      initialValue: 'PDF · 12 pages',
    }),
    defineField({
      name: 'headline',
      title: 'Headline (EN)',
      type: 'string',
      group: 'content',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'subhead',
      title: 'Subhead (EN)',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'socialProof',
      title: 'Social proof line (EN)',
      type: 'string',
      group: 'content',
      description: 'E.g. "Join 500+ founders getting our playbooks every week."',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA button label (EN)',
      type: 'string',
      group: 'content',
      initialValue: 'Send me the template',
    }),
    defineField({
      name: 'successMessage',
      title: 'Success message (EN)',
      type: 'string',
      group: 'content',
      initialValue: 'Check your inbox — the template is on its way.',
    }),
    defineField({
      name: 'downloadCtaLabel',
      title: 'Download CTA label (EN)',
      type: 'string',
      group: 'content',
      initialValue: 'Download now',
    }),
    defineField({
      name: 'consentText',
      title: 'Consent disclaimer (EN)',
      type: 'text',
      rows: 2,
      group: 'content',
      initialValue: 'By submitting you agree to receive editorial emails. We never share your address.',
    }),
    defineField({
      name: 'emailPlaceholder',
      title: 'Email placeholder (EN)',
      type: 'string',
      group: 'content',
      initialValue: 'you@brand.com',
    }),

    // ── Italian copy ──────────────────────────────────────────────────────────
    defineField({
      name: 'eyebrow_it',
      title: 'Eyebrow (IT)',
      type: 'string',
      group: 'localeIt',
      initialValue: 'Risorsa Gratuita',
    }),
    defineField({
      name: 'badge_it',
      title: 'Badge (IT)',
      type: 'string',
      group: 'localeIt',
      initialValue: 'PDF · 12 pagine',
    }),
    defineField({
      name: 'headline_it',
      title: 'Headline (IT)',
      type: 'string',
      group: 'localeIt',
    }),
    defineField({
      name: 'subhead_it',
      title: 'Subhead (IT)',
      type: 'text',
      rows: 3,
      group: 'localeIt',
    }),
    defineField({
      name: 'socialProof_it',
      title: 'Social proof line (IT)',
      type: 'string',
      group: 'localeIt',
    }),
    defineField({
      name: 'ctaLabel_it',
      title: 'CTA button label (IT)',
      type: 'string',
      group: 'localeIt',
      initialValue: 'Inviami il template',
    }),
    defineField({
      name: 'successMessage_it',
      title: 'Success message (IT)',
      type: 'string',
      group: 'localeIt',
      initialValue: 'Controlla la inbox: il template sta arrivando.',
    }),
    defineField({
      name: 'downloadCtaLabel_it',
      title: 'Download CTA label (IT)',
      type: 'string',
      group: 'localeIt',
      initialValue: 'Scarica ora',
    }),
    defineField({
      name: 'consentText_it',
      title: 'Consent disclaimer (IT)',
      type: 'text',
      rows: 2,
      group: 'localeIt',
      initialValue: 'Inviando accetti di ricevere email editoriali. Non condividiamo mai il tuo indirizzo.',
    }),
    defineField({
      name: 'emailPlaceholder_it',
      title: 'Email placeholder (IT)',
      type: 'string',
      group: 'localeIt',
      initialValue: 'tu@brand.com',
    }),

    // ── Asset ─────────────────────────────────────────────────────────────────
    defineField({
      name: 'pdfAsset',
      title: 'PDF file',
      type: 'file',
      group: 'asset',
      description: 'Upload the actual PDF here. Once uploaded, the download CTA will point to this file.',
      options: { accept: 'application/pdf' },
    }),
    defineField({
      name: 'pdfFallbackUrl',
      title: 'PDF fallback URL',
      type: 'url',
      group: 'asset',
      description: 'External URL to the PDF (used when the asset is hosted outside Sanity, e.g. Google Drive, Notion, etc.).',
    }),
    defineField({
      name: 'pageCount',
      title: 'Page count',
      type: 'number',
      group: 'asset',
      description: 'Shown in the badge pill. E.g. 12 → "PDF · 12 pages".',
      initialValue: 12,
    }),
    defineField({
      name: 'emailIntegration',
      title: 'Email integration / list',
      type: 'string',
      group: 'asset',
      description: 'Optional: the Mailchimp audience ID, ConvertKit form ID, or other identifier. Not rendered on site — used by the API route.',
    }),
  ],
  preview: {
    select: {
      title: 'internalTitle',
      subtitle: 'slug.current',
      active: 'isActive',
    },
    prepare({ title, subtitle, active }) {
      return {
        title: title ?? 'Untitled',
        subtitle: `/${subtitle} · ${active ? 'active' : 'inactive'}`,
      }
    },
  },
})

export default leadMagnet
