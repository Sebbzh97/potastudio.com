import { defineField, defineType } from 'sanity'
import { slugIsUrlSafe } from '../lib/slug-validation'

export const blogAuthor = defineType({
  name: 'blogAuthor',
  title: 'Blog Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required().custom(slugIsUrlSafe),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: "E.g. 'Founder & CEO', 'Partner & Head of ADS'",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
      description: 'Short bio shown on the post and author page. Max 200 characters. Include credentials that establish E-E-A-T authority: certifications, years of experience, notable clients.',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'photo',
      title: 'Profile Photo',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'url',
    }),
    defineField({
      name: 'twitterX',
      title: 'X (Twitter) URL',
      type: 'url',
    }),
    defineField({
      name: 'credentials',
      title: 'Credentials',
      type: 'array',
      of: [{ type: 'string' }],
      description: "E-E-A-T signals: certifications, partnerships, notable achievements. E.g. 'Full Service Marketing Agency', 'Shopify Plus Certified'. Rendered as a badge list on the author profile.",
      validation: (Rule) => Rule.max(5),
    }),
    // ── Author profile page extras ────────────────────────────────────────────
    // Surfaced on /author/[slug] and serialised into the Person JSON-LD
    // (`description`, `knowsAbout`, `email`, `sameAs`).
    defineField({
      name: 'longBio',
      title: 'Long Bio (author page)',
      type: 'array',
      of: [{ type: 'block' }],
      description:
        'Full biography for the dedicated /author/[slug] page (EN). Use blocks, lists, and links to build an authoritative profile that establishes Experience-Expertise-Authoritativeness-Trustworthiness for both Google E-E-A-T and AI engine citations.',
    }),
    defineField({
      name: 'longBio_it',
      title: 'Long Bio — Italiano',
      type: 'array',
      of: [{ type: 'block' }],
      description:
        'Biografia estesa per la pagina autore italiana /it/autore/[slug]. Se vuota, la versione inglese viene mostrata anche su /it.',
    }),
    defineField({
      name: 'expertise',
      title: 'Areas of Expertise',
      type: 'array',
      of: [{ type: 'string' }],
      description:
        "Topics this author writes about with authority. Rendered on the profile page and emitted as Person.knowsAbout in JSON-LD. E.g. 'TikTok Advertising', 'E-commerce Conversion'.",
      validation: (Rule) => Rule.max(8),
    }),
    defineField({
      name: 'yearsOfExperience',
      title: 'Years of Experience',
      type: 'number',
      description: 'Used in author profile heading to surface expertise depth.',
      validation: (Rule) => Rule.min(0).max(60),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: "City / country, e.g. 'Bergamo, Italy'. Surfaced on profile.",
    }),
    defineField({
      name: 'email',
      title: 'Public Email',
      type: 'string',
      description:
        'Optional public contact email. Emitted as Person.email in JSON-LD.',
    }),
    defineField({
      name: 'website',
      title: 'Personal Website',
      type: 'url',
      description: 'Personal site or portfolio. Adds another sameAs entry.',
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram URL',
      type: 'url',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'photo',
    },
  },
})

export default blogAuthor
