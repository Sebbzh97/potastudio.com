import { defineField, defineType } from 'sanity'

export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ Item',
  type: 'object',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      description:
        "Write exactly as users search it. MUST end with '?'. Becomes Question.name in FAQPage JSON-LD.",
      validation: (Rule) =>
        Rule.required()
          .min(8)
          .max(150)
          .custom((q?: string) => {
            if (!q) return true
            return q.trim().endsWith('?') || 'Question must end with "?"'
          }),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'text',
      rows: 3,
      description:
        "Direct, factual answer in 1–3 sentences (50–500 chars). Do not start with 'Yes' or 'No' alone. Becomes acceptedAnswer.text in FAQPage JSON-LD.",
      validation: (Rule) => Rule.required().min(50).max(500),
    }),
  ],
  preview: {
    select: {
      title: 'question',
    },
  },
})

export default faqItem
