import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Full Name', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'role', title: 'Role / Title', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'bio', title: 'Bio (EN)', type: 'text', rows: 4 }),
    defineField({ name: 'bioIt', title: 'Bio (IT)', type: 'text', rows: 4,
      description: 'Italian version of the bio. Falls back to EN if empty.' }),
    defineField({ name: 'roleIt', title: 'Role / Title (IT)', type: 'string',
      description: 'Italian version of the role. Falls back to EN if empty.' }),
    defineField({ name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'initial', title: 'Initials (fallback)', type: 'string' }),
    defineField({ name: 'linkedin', title: 'LinkedIn URL', type: 'url' }),
    defineField({ name: 'order', title: 'Display Order', type: 'number', initialValue: 99 }),
  ],
  orderings: [{ title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'photo' },
  },
})
