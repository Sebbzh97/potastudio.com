import { defineField, defineType } from 'sanity'
import { slugIsUrlSafe } from '../lib/slug-validation'

export default defineType({
  name: 'jobOpening',
  title: 'Job Opening',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Job Title (EN)', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'titleIt', title: 'Job Title (IT)', type: 'string' }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (R) => R.custom(slugIsUrlSafe),
    }),
    defineField({
      name: 'department',
      title: 'Department',
      type: 'string',
      options: {
        list: [
          { title: 'Marketing', value: 'marketing' },
          { title: 'Creative', value: 'creative' },
          { title: 'Technology', value: 'technology' },
          { title: 'Strategy', value: 'strategy' },
          { title: 'Sales', value: 'sales' },
          { title: 'Operations', value: 'operations' },
        ],
      },
    }),
    defineField({ name: 'location', title: 'Location', type: 'string', description: 'E.g. "Bergamo, Italy" or "Remote"' }),
    defineField({
      name: 'workMode',
      title: 'Work Mode',
      type: 'string',
      options: {
        list: [
          { title: 'In-office', value: 'in-office' },
          { title: 'Hybrid', value: 'hybrid' },
          { title: 'Remote', value: 'remote' },
        ],
      },
    }),
    defineField({
      name: 'type',
      title: 'Employment Type',
      type: 'string',
      options: {
        list: [
          { title: 'Full-time', value: 'full-time' },
          { title: 'Part-time', value: 'part-time' },
          { title: 'Contract', value: 'contract' },
          { title: 'Internship', value: 'internship' },
        ],
      },
    }),
    defineField({ name: 'description', title: 'Job Description (EN)', type: 'text', rows: 5 }),
    defineField({ name: 'descriptionIt', title: 'Job Description (IT)', type: 'text', rows: 5 }),
    defineField({ name: 'requirements', title: 'Requirements', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'applyEmail', title: 'Apply Email', type: 'string', description: 'E.g. "careers@potastudio.com" — used for the apply mailto link.' }),
    defineField({ name: 'applyUrl', title: 'Apply URL (alternative to email)', type: 'url' }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
    defineField({ name: 'isActive', title: 'Active / Visible on careers page', type: 'boolean', initialValue: true }),
    defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'department' },
  },
})
