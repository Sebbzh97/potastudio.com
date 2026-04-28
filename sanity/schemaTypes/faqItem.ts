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
      description: "Write exactly as users search it. This becomes the 'name' field in FAQPage JSON-LD schema.",
      validation: (Rule) => Rule.required().max(150),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'text',
      rows: 3,
      description: "Direct, factual answer in 1–3 sentences. This becomes the 'acceptedAnswer.text' in FAQPage JSON-LD. Do not start with 'Yes' or 'No' alone — provide the complete answer immediately.",
      validation: (Rule) => Rule.required().max(500),
    }),
  ],
  preview: {
    select: {
      title: 'question',
    },
  },
})

export default faqItem
