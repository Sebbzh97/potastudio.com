import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  groups: [
    { name: 'core', title: 'Core', default: true },
    { name: 'en', title: 'English content' },
    { name: 'it', title: 'Italian content' },
    { name: 'media', title: 'Media' },
    { name: 'meta', title: 'Meta & relations' },
  ],
  fields: [
    // ── Core ─────────────────────────────────────────────────────────────────
    defineField({
      name: 'client',
      title: 'Client Name',
      type: 'string',
      group: 'core',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'language',
      type: 'string',
      group: 'core',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'isPublished',
      title: 'Published (visible on site)',
      type: 'boolean',
      group: 'core',
      initialValue: true,
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'core',
      options: { source: 'client', maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'core',
      options: {
        list: [
          { title: 'E-commerce', value: 'ecommerce' },
          { title: 'TikTok LIVE', value: 'tiktok-live' },
          { title: 'Paid Advertising', value: 'ads' },
          { title: 'Social Media', value: 'social' },
          { title: 'Shopify Plus', value: 'shopify' },
          { title: 'Influencer Marketing', value: 'influencer' },
          { title: 'Brand Identity', value: 'brand' },
        ],
      },
    }),
    defineField({
      name: 'type',
      title: 'Work Type',
      type: 'string',
      group: 'core',
      options: { list: ['Social', 'ADS', 'Web', 'Influencer', 'Content'] },
    }),
    defineField({ name: 'year', title: 'Year', type: 'string', group: 'core' }),
    defineField({ name: 'bg', title: 'Card Background Color (hex)', type: 'string', group: 'core' }),
    defineField({ name: 'accent', title: 'Accent Color (hex)', type: 'string', group: 'core' }),

    // ── English content ──────────────────────────────────────────────────────
    defineField({
      name: 'description',
      title: 'Short Description (EN)',
      type: 'text',
      rows: 2,
      group: 'en',
    }),
    defineField({
      name: 'challenge',
      title: 'The Challenge (EN)',
      type: 'text',
      rows: 4,
      group: 'en',
    }),
    defineField({
      name: 'approach',
      title: 'Our Approach (EN)',
      type: 'text',
      rows: 4,
      group: 'en',
    }),
    defineField({
      name: 'results',
      title: 'Results Summary (EN)',
      type: 'text',
      rows: 4,
      group: 'en',
    }),
    defineField({
      name: 'tags',
      title: 'Tags (EN)',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'en',
    }),
    defineField({
      name: 'services',
      title: 'Services Used (EN)',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'en',
    }),
    defineField({
      name: 'metrics',
      title: 'Key Metrics (EN)',
      type: 'array',
      group: 'en',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'value', title: 'Value', type: 'string' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'metric',
      title: 'Hero Metric (EN, e.g. +340% Revenue)',
      type: 'string',
      group: 'en',
    }),

    // ── Italian content ──────────────────────────────────────────────────────
    defineField({
      name: 'descriptionIt',
      title: 'Short Description (IT)',
      type: 'text',
      rows: 2,
      group: 'it',
      description: 'Italian translation. Falls back to EN when empty.',
    }),
    defineField({
      name: 'challengeIt',
      title: 'La Sfida (IT)',
      type: 'text',
      rows: 4,
      group: 'it',
      description: 'Italian translation. Falls back to EN when empty.',
    }),
    defineField({
      name: 'approachIt',
      title: 'Il Nostro Approccio (IT)',
      type: 'text',
      rows: 4,
      group: 'it',
      description: 'Italian translation. Falls back to EN when empty.',
    }),
    defineField({
      name: 'resultsIt',
      title: 'I Risultati (IT)',
      type: 'text',
      rows: 4,
      group: 'it',
      description: 'Italian translation. Falls back to EN when empty.',
    }),
    defineField({
      name: 'tagsIt',
      title: 'Tag (IT)',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'it',
      description: 'Italian tags. Falls back to EN when empty.',
    }),
    defineField({
      name: 'servicesIt',
      title: 'Servizi (IT)',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'it',
    }),
    defineField({
      name: 'metricsIt',
      title: 'Metriche Chiave (IT)',
      type: 'array',
      group: 'it',
      description:
        'Italian labels for the metrics. Numeric values usually stay the same; translate only the label. Falls back to EN when empty.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Etichetta', type: 'string' }),
            defineField({ name: 'value', title: 'Valore', type: 'string' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'metricIt',
      title: 'Hero Metric (IT, es. +340% Fatturato)',
      type: 'string',
      group: 'it',
    }),

    // ── Media ────────────────────────────────────────────────────────────────
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'media',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'galleryUrls',
      title: 'Gallery URLs (external images)',
      type: 'array',
      group: 'media',
      of: [{ type: 'url' }],
      description: 'External image URLs for the gallery',
    }),
    defineField({
      name: 'youtubeVideoId',
      title: 'YouTube Video ID',
      type: 'string',
      group: 'media',
      description:
        'YouTube video ID (e.g. "dQw4w9WgXcQ" from youtube.com/watch?v=dQw4w9WgXcQ). Will be shown above the gallery.',
    }),

    // ── Meta & relations ─────────────────────────────────────────────────────
    defineField({
      name: 'relatedSlugs',
      title: 'Related Case Study Slugs',
      type: 'array',
      group: 'meta',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'testimonial',
      title: 'Testimonial',
      type: 'reference',
      group: 'meta',
      to: [{ type: 'testimonial' }],
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'client', subtitle: 'category', media: 'coverImage' },
  },
})
