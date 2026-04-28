import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  fields: [
    defineField({ name: 'client', title: 'Client Name', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'language', type: 'string', readOnly: true, hidden: true }),
    defineField({ name: 'isPublished', title: 'Published (visible on site)', type: 'boolean', initialValue: true }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'client', maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
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
    defineField({ name: 'type', title: 'Work Type', type: 'string', options: { list: ['Social', 'ADS', 'Web', 'Influencer', 'Content'] } }),
    defineField({ name: 'year', title: 'Year', type: 'string' }),
    defineField({ name: 'bg', title: 'Card Background Color (hex)', type: 'string' }),
    defineField({ name: 'accent', title: 'Accent Color (hex)', type: 'string' }),
    defineField({ name: 'description', title: 'Short Description', type: 'text', rows: 2 }),
    defineField({ name: 'challenge', title: 'The Challenge', type: 'text', rows: 4 }),
    defineField({ name: 'approach', title: 'Our Approach', type: 'text', rows: 4 }),
    defineField({ name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'services', title: 'Services Used', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'galleryUrls',
      title: 'Gallery URLs (external images)',
      type: 'array',
      of: [{ type: 'url' }],
      description: 'External image URLs for the gallery',
    }),
    defineField({
      name: 'youtubeVideoId',
      title: 'YouTube Video ID',
      type: 'string',
      description: 'YouTube video ID (e.g., "dQw4w9WgXcQ" from youtube.com/watch?v=dQw4w9WgXcQ). Will be shown above the gallery.',
    }),
    defineField({
      name: 'metrics',
      title: 'Key Metrics',
      type: 'array',
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
      name: 'results',
      title: 'Results Summary',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'relatedSlugs',
      title: 'Related Case Study Slugs',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({ name: 'metric', title: 'Hero Metric (e.g. +340% Revenue)', type: 'string' }),
    defineField({ name: 'testimonial', title: 'Testimonial', type: 'reference', to: [{ type: 'testimonial' }] }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: { title: 'client', subtitle: 'category', media: 'coverImage' },
  },
})
