import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'quote', title: 'Quote (English)', type: 'text', rows: 4, validation: (R) => R.required() }),
    defineField({ name: 'quoteIt', title: 'Quote (Italian)', type: 'text', rows: 4 }),
    defineField({ name: 'author', title: 'Author Name', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'role', title: 'Author Role', type: 'string' }),
    defineField({ name: 'company', title: 'Company', type: 'string' }),
    defineField({ name: 'avatar', title: 'Avatar', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'rating',
      title: 'Rating (1–5)',
      type: 'number',
      validation: (R) => R.min(1).max(5),
      initialValue: 5,
    }),
    defineField({ name: 'featured', title: 'Featured on homepage', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: { title: 'author', subtitle: 'company', media: 'avatar' },
  },
})
