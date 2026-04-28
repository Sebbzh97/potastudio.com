import { defineField, defineType } from 'sanity'

/**
 * client — replaces the old clientLogo type.
 * Adds industry, country and order for richer filtering/sorting in the app.
 */
export default defineType({
  name: 'client',
  title: 'Client',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Brand Name', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'industry',
      title: 'Industry',
      type: 'string',
      options: {
        list: [
          { title: 'E-commerce', value: 'E-commerce' },
          { title: 'Fashion', value: 'Fashion' },
          { title: 'Food & Beverage', value: 'Food & Beverage' },
          { title: 'Finance', value: 'Finance' },
          { title: 'Sport', value: 'Sport' },
          { title: 'Tech / E-commerce', value: 'Tech / E-commerce' },
          { title: 'Partner', value: 'Partner' },
        ],
      },
    }),
    defineField({ name: 'country', title: 'Country', type: 'string' }),
    defineField({ name: 'logo', title: 'Logo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'website', title: 'Website URL', type: 'url' }),
    defineField({ name: 'featured', title: 'Featured (homepage marquee)', type: 'boolean', initialValue: false }),
    defineField({ name: 'order', title: 'Display Order', type: 'number', initialValue: 99 }),
  ],
  orderings: [
    { title: 'Alphabetical', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] },
    { title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'name', subtitle: 'industry', media: 'logo' },
  },
})
