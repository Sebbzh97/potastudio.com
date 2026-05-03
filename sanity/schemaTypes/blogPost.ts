import type React from 'react'
import { defineField, defineType } from 'sanity'

// v2 — isUnique removed, slug validated via custom Rule only
//
// JSON-LD Article schema mapping:
//   title              → headline
//   metaDescription    → description
//   publishedAt        → datePublished
//   updatedAt          → dateModified
//   author.name        → author.name
//   author.credentials → author.knowsAbout       (E-E-A-T signal)
//   coverImage         → image
//   primaryKeyword + tags → keywords
//
// GEO field mapping (most cited by AI engines first):
//   quickAnswer        → injected as the LEAD entry of FAQPage JSON-LD
//                        (paired with the post title) AND visibly rendered
//                        as the <QuickAnswer> block under the H1.
//   tldr               → text paragraph rendered above the body as a
//                        "TL;DR" callout.
//   keyTakeaways       → ARRAY of bullet points rendered as <KeyTakeaways>;
//                        AI engines lift these almost verbatim, so each
//                        item must be a complete, self-contained sentence.
//   faqItems           → mainEntity[] of FAQPage JSON-LD, also rendered as
//                        a visible <FaqSection> with <details>/<summary>
//                        and microdata.
//   keyStatistics      → rendered as <KeyStatistics> grid, each stat
//                        attributed to a verifiable source (E-E-A-T).
//
// Tables: authored INSIDE the body field as `tableBlock` items
// (registered in `blockContent.ts`). Each table is rendered as a semantic
// <table> with <thead>/<tbody>, which Google's structured-data parser and
// AI engines can lift directly into Featured Snippets.
//
// Internationalisation:
//   language     → 'en' | 'it'  (drives /blog/* vs /it/blog/*)
//   translationOf → reference to the EN counterpart on IT posts. The
//                   Next.js metadata layer (`buildBlogAlternates`) reads
//                   this to emit hreflang links pointing at the *actual*
//                   per-locale slug (not the same slug as the current page).
//
// JSON-LD BreadcrumbList:
//   Generated automatically from category slug + post slug.

export default defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',

  groups: [
    { name: 'seo', title: 'SEO & Metadata' },
    { name: 'geo', title: 'GEO & AI Optimization' },
  ],

  fields: [
    // ── BASIC IDENTITY ────────────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Post Title',
      type: 'string',
      description: 'The H1 headline. Keep between 20 and 70 characters for SEO. Include the primary keyword near the beginning.',
      validation: (Rule) => Rule.required().min(20).max(70),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      description: 'Auto-generated from title. Use lowercase, hyphens only, no special characters. This becomes the page URL.',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) =>
        Rule.required().custom((slug) => {
          if (!slug?.current) return 'Slug is required'
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.current)) {
            return 'Slug must be lowercase, hyphens only, no special characters'
          }
          return true
        }),
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
      name: 'translationOf',
      title: 'Translation of',
      type: 'reference',
      to: [{ type: 'blogPost' }],
      description: 'If this is the Italian version of an English post (or vice versa), link the counterpart here.',
    }),

    // ── PUBLICATION & AUTHORING ───────────────────────────────────────────
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'blogAuthor' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      description: 'The publication date shown to readers and used in JSON-LD Article schema.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime',
      description: 'Important for GEO: AI engines weight freshness. Update this whenever the post content is revised.',
    }),
    defineField({
      name: 'readingTime',
      title: 'Reading Time (minutes)',
      type: 'number',
      description: 'Estimated reading time. Used in meta tags and shown on the post card. Typical: 5–15 minutes.',
      validation: (Rule) => Rule.required().min(1).max(60),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'blogCategory' }] }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Comma-separated keywords. Used for internal filtering and JSON-LD keywords field. Max 8 tags.',
      validation: (Rule) => Rule.max(8),
    }),

    // ── VISUAL ────────────────────────────────────────────────────────────
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describe the image for accessibility and SEO. Include the primary keyword if natural.',
          validation: (Rule) => Rule.required().max(125),
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
          description: 'Optional caption shown below the image.',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),

    // ── SEO FIELDS ────────────────────────────────────────────────────────
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      group: 'seo',
      description: 'Overrides the post title in the browser tab and Google snippet. Ideal: 50–60 characters. Include primary keyword. Leave empty to use post title.',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'The snippet shown in Google search results. Ideal: 140–160 characters. Must include primary keyword and a clear value proposition. Never duplicate the meta title.',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'primaryKeyword',
      title: 'Primary Keyword',
      type: 'string',
      group: 'seo',
      description: "The single most important keyword this post targets. Used internally for content audits. Example: 'TikTok Shop Italia' or 'Meta Ads DST 2026'.",
    }),
    defineField({
      name: 'secondaryKeywords',
      title: 'Secondary Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'seo',
      description: 'Supporting keywords and LSI (Latent Semantic Indexing) terms. These should appear naturally in headings and body copy.',
      validation: (Rule) => Rule.max(5),
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      group: 'seo',
      description: 'Only set if this content appears elsewhere. Leave empty for standard posts — the canonical will be set automatically.',
    }),
    defineField({
      name: 'noIndex',
      title: 'No Index',
      type: 'boolean',
      group: 'seo',
      initialValue: false,
      description: 'Set to true to prevent Google from indexing this post. Use for drafts or duplicate content.',
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      options: { hotspot: true },
      group: 'seo',
      description: 'Image shown when the post is shared on social media. Ideal size: 1200×630px. If empty, the cover image is used.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    // ── GEO FIELDS ────────────────────────────────────────────────────────
    defineField({
      name: 'tldr',
      title: 'TL;DR Summary',
      type: 'text',
      rows: 4,
      group: 'geo',
      description: 'CRITICAL FOR GEO: A 40–80 word direct answer to the post\'s main question. This is what AI engines (ChatGPT, Perplexity, Google AI Overviews) will quote. Write it as a standalone answer that makes sense without context. Start with the direct answer, not a preamble.',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'quickAnswer',
      title: 'Quick Answer (Featured Snippet)',
      type: 'text',
      rows: 3,
      group: 'geo',
      description: "A 1–3 sentence answer to the primary keyword query. Optimised to appear in Google's Featured Snippet position. Format: '[Primary keyword] is/does/means [direct answer].'",
      validation: (Rule) => Rule.max(150),
    }),
    defineField({
      name: 'faqItems',
      title: 'FAQ Section (JSON-LD)',
      type: 'array',
      of: [{ type: 'faqItem' }],
      group: 'geo',
      description: 'CRITICAL FOR GEO: These questions and answers generate FAQPage JSON-LD schema markup and render as an FAQ section at the bottom of the post. Write questions exactly as users search them. AI engines pull from FAQ schema to cite your content.',
      validation: (Rule) => Rule.max(8),
    }),
    defineField({
      name: 'keyTakeaways',
      title: 'Key Takeaways',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'geo',
      description:
        'CRITICAL FOR GEO: 3–7 short, declarative bullet points summarising the post. Rendered as a "Key Takeaways" block before the FAQ section. AI engines lift these almost verbatim — write each one as a complete, self-contained sentence (e.g. "TikTok Shop is available in Italy from October 2024" rather than "October 2024").',
      validation: (Rule) => Rule.max(7),
    }),
    defineField({
      name: 'keyStatistics',
      title: 'Key Statistics',
      type: 'array',
      group: 'geo',
      description: 'Verifiable statistics with sources. AI engines are 40% more likely to cite content that includes verified statistics with source attribution.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'stat',
              title: 'Statistic',
              type: 'string',
              description: 'E.g. "23.9 milioni di utenti TikTok in Italia"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'source',
              title: 'Source',
              type: 'string',
              description: 'E.g. "TikTok Italy, 2025"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'year',
              title: 'Year',
              type: 'number',
            }),
          ],
          preview: {
            select: { title: 'stat', subtitle: 'source' },
          },
        },
      ],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: 'expertQuotes',
      title: 'Expert Quotes',
      type: 'array',
      group: 'geo',
      description: 'Direct quotes from named experts or official sources. Dramatically increases GEO citation probability. Each quote must be attributed to a real, verifiable person or organisation.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'quote',
              title: 'Quote',
              type: 'text',
              rows: 2,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'attribution',
              title: 'Attribution',
              type: 'string',
              description: 'E.g. "Sebastian Bonfanti, Founder Pota Studio"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'role',
              title: 'Role / Organisation',
              type: 'string',
            }),
          ],
          preview: {
            select: { title: 'attribution', subtitle: 'quote' },
          },
        },
      ],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'targetSearchQueries',
      title: 'Target Search Queries',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'geo',
      description: "The exact questions this post answers, as users would type them in Google, ChatGPT or Perplexity. Example: 'come aprire tiktok shop italia', 'tiktok shop commissioni 2026'.",
      validation: (Rule) => Rule.max(10),
    }),

    // ── CONTENT ───────────────────────────────────────────────────────────
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'A short summary shown on the blog listing page and in social shares. 2–3 sentences. Different from meta description — this is reader-facing, not search-engine-facing.',
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: 'body',
      title: 'Article Body',
      type: 'blockContent',
      description: 'The full article content. Use H2 for main sections, H3 for subsections. Every H2 section should have a TL;DR-style opening sentence. Include statistics with source citations inline.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'relatedPosts',
      title: 'Related Posts',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'blogPost' }] }],
      description: 'Manually selected related posts shown at the bottom of the article. Used for internal linking and topic cluster architecture.',
      validation: (Rule) => Rule.max(3),
    }),

    // ── INTERNATIONALISATION FLAGS ────────────────────────────────────────
    defineField({
      name: 'isInternational',
      title: 'International Content',
      type: 'boolean',
      initialValue: false,
      description:
        'Set to true for posts targeting global/international audiences (US, UK, EU multi-market). ' +
        'Set to false for posts primarily targeting the Italian domestic market. ' +
        'Used for content filtering, hreflang strategy, and analytics segmentation.',
    }),

    // Legacy field kept for backwards compatibility with existing documents
    defineField({
      name: 'isPublished',
      title: 'Published (visible on site)',
      type: 'boolean',
      initialValue: true,
      hidden: true,
    }),
  ],

  preview: {
    select: {
      title: 'title',
      language: 'language',
      date: 'publishedAt',
      media: 'coverImage',
    },
    prepare(selection: { title?: string; language?: string; date?: string; media?: { asset?: { _ref?: string } } }) {
      const lang = selection.language === 'it' ? '[IT]' : '[EN]'
      return {
        title: `${lang} ${selection.title ?? 'Untitled'}`,
        subtitle: selection.date ? new Date(selection.date).toLocaleDateString() : 'No date',
        media: selection.media as React.ReactNode,
      }
    },
  },
})

