import { defineField, defineType } from 'sanity'
import { slugIsUrlSafe } from '../lib/slug-validation'

export const blogCategory = defineType({
  name: 'blogCategory',
  title: 'Blog Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Category Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required().custom(slugIsUrlSafe),
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          { title: 'English', value: 'en' },
          { title: 'Italiano', value: 'it' },
        ],
        layout: 'radio',
      },
      initialValue: 'en',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      description: 'Used in category page meta description.',
    }),
    defineField({
      name: 'color',
      title: 'Accent Color',
      type: 'string',
      description: "Hex color for the category badge on the blog. Example: '#FF5C00' for Marketing, '#FFD600' for TikTok.",
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
    },
  },
})

export default blogCategory
