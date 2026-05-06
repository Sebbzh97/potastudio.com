import { defineType, defineField, defineArrayMember } from 'sanity'

export const blockContent = defineType({
  name: 'blockContent',
  title: 'Block Content',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Heading 2', value: 'h2' },
        { title: 'Heading 3', value: 'h3' },
        { title: 'Heading 4', value: 'h4' },
        { title: 'Blockquote', value: 'blockquote' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
          { title: 'Code', value: 'code' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              defineField({
                name: 'href',
                title: 'URL',
                type: 'url',
                validation: (Rule) => Rule.required(),
              }),
              defineField({
                name: 'blank',
                title: 'Open in new tab',
                type: 'boolean',
                initialValue: false,
              }),
              defineField({
                name: 'nofollow',
                title: 'No Follow',
                type: 'boolean',
                initialValue: false,
              }),
              defineField({
                name: 'sponsored',
                title: 'Sponsored (adds rel=sponsored)',
                type: 'boolean',
                initialValue: false,
              }),
            ],
          },
        ],
      },
    }),
    // Image block
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
        }),
        defineField({
          name: 'fullWidth',
          title: 'Full Width',
          type: 'boolean',
          initialValue: false,
        }),
      ],
    }),
    // Callout block
    defineArrayMember({
      type: 'object',
      name: 'callout',
      title: 'Callout',
      fields: [
        defineField({
          name: 'type',
          title: 'Type',
          type: 'string',
          options: {
            list: [
              { title: 'Info', value: 'info' },
              { title: 'Warning', value: 'warning' },
              { title: 'Tip', value: 'tip' },
              { title: 'Stat', value: 'stat' },
              { title: 'Insight', value: 'insight' },
            ],
          },
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'text',
          title: 'Text',
          type: 'text',
          rows: 2,
          description: "Highlighted callout box. 'stat' type is used for key statistics and is 30% more likely to be cited by AI engines.",
          validation: (Rule) => Rule.required(),
        }),
      ],
      preview: {
        select: {
          title: 'type',
          subtitle: 'text',
        },
      },
    }),
    // Table block
    defineArrayMember({
      type: 'object',
      name: 'tableBlock',
      title: 'Table',
      fields: [
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
        }),
        defineField({
          name: 'rows',
          title: 'Rows',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({
                  name: 'cells',
                  title: 'Cells',
                  type: 'array',
                  of: [{ type: 'string' }],
                }),
              ],
            },
          ],
          description: 'Use for comparison tables, pricing tables, data tables. Tables rank well in Featured Snippets.',
        }),
      ],
      preview: {
        select: {
          title: 'caption',
        },
        prepare(selection: { title?: string }) {
          return {
            title: selection.title || 'Table',
          }
        },
      },
    }),
    // Code block
    defineArrayMember({
      type: 'object',
      name: 'codeBlock',
      title: 'Code Block',
      fields: [
        defineField({
          name: 'language',
          title: 'Language',
          type: 'string',
          options: {
            list: [
              { title: 'JavaScript', value: 'javascript' },
              { title: 'TypeScript', value: 'typescript' },
              { title: 'Bash', value: 'bash' },
              { title: 'JSON', value: 'json' },
              { title: 'HTML', value: 'html' },
              { title: 'CSS', value: 'css' },
              { title: 'Python', value: 'python' },
            ],
          },
        }),
        defineField({
          name: 'code',
          title: 'Code',
          type: 'text',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'filename',
          title: 'Filename',
          type: 'string',
        }),
      ],
      preview: {
        select: {
          title: 'filename',
          subtitle: 'language',
        },
        prepare(selection: { title?: string; subtitle?: string }) {
          return {
            title: selection.title || 'Code Block',
            subtitle: selection.subtitle,
          }
        },
      },
    }),
  ],
})

export default blockContent
