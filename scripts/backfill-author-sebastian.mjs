/**
 * One-shot backfill: ensure the Sebastian Bonfanti blogAuthor doc has all
 * the new profile fields (slug, expertise, location, longBio EN+IT, etc.)
 * required by the /author/[slug] and /it/autore/[slug] routes.
 *
 * Idempotent: existing fields are preserved, only empty/undefined fields
 * are filled in. Safe to re-run.
 *
 *   pnpm exec node \
 *     --env-file-if-exists=/vercel/share/.env.project \
 *     --env-file-if-exists=.env.local \
 *     scripts/backfill-author-sebastian.mjs
 */
import { createClient } from '@sanity/client'

const c = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

const list = await c.fetch(
  `*[_type == 'blogAuthor']{_id, name, "slug": slug.current, role, bio, expertise, yearsOfExperience, location, email, website, instagram, longBio, longBio_it}`,
)
console.log('CURRENT AUTHORS:', JSON.stringify(list, null, 2))

const sebastian = list.find(
  (a) => a.name && a.name.toLowerCase().includes('sebastian'),
)
if (!sebastian) {
  console.log('No Sebastian doc found, skipping backfill.')
  process.exit(0)
}

// Long bio Portable Text — EN.
const longBioEn = [
  {
    _type: 'block',
    _key: 'p1',
    style: 'normal',
    children: [
      {
        _type: 'span',
        _key: 's1',
        text: "Sebastian Bonfanti is the Founder & CEO of Pota Studio, a full-service marketing agency based in Bergamo, Italy. He leads strategy and creative across the agency's flagship engagements, from large-scale national campaigns for Samsung and Isybank to long-running creator partnerships at Lucca Comics & Games.",
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'p2',
    style: 'normal',
    children: [
      {
        _type: 'span',
        _key: 's2',
        text: 'His work focuses on the intersection of paid media, organic social, and creator-led production: the parts of marketing that compound over time rather than evaporate after a single campaign window. The articles published under this byline reflect that operating bias — concrete frameworks, real budgets, and the failure modes the agency has personally absorbed.',
        marks: [],
      },
    ],
  },
]

// Long bio Portable Text — IT.
const longBioIt = [
  {
    _type: 'block',
    _key: 'p1',
    style: 'normal',
    children: [
      {
        _type: 'span',
        _key: 's1',
        text: 'Sebastian Bonfanti è Founder & CEO di Pota Studio, agenzia full-service di marketing con sede a Bergamo. Guida strategia e creatività sui progetti più importanti dello studio, dalle campagne nazionali per Samsung e Isybank alle partnership pluriennali con creator a Lucca Comics & Games.',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'p2',
    style: 'normal',
    children: [
      {
        _type: 'span',
        _key: 's2',
        text: "Il suo lavoro si concentra sull'intersezione tra paid media, organic social e produzione creator-led: le parti del marketing che si capitalizzano nel tempo invece di esaurirsi dopo una singola finestra di campagna. Gli articoli a sua firma riflettono quel bias operativo — framework concreti, budget reali, e i fallimenti che lo studio ha effettivamente attraversato.",
        marks: [],
      },
    ],
  },
]

const patch = {
  slug: { _type: 'slug', current: 'sebastian-bonfanti' },
}
if (!sebastian.expertise || sebastian.expertise.length === 0) {
  patch.expertise = [
    'Paid Advertising',
    'Influencer Marketing',
    'TikTok Marketing',
    'E-commerce',
    'Brand Strategy',
  ]
}
if (typeof sebastian.yearsOfExperience !== 'number') patch.yearsOfExperience = 9
if (!sebastian.location) patch.location = 'Bergamo, Italy'
if (!sebastian.website) patch.website = 'https://www.potastudio.com'
if (
  !sebastian.longBio ||
  (Array.isArray(sebastian.longBio) && sebastian.longBio.length === 0)
) {
  patch.longBio = longBioEn
}
if (
  !sebastian.longBio_it ||
  (Array.isArray(sebastian.longBio_it) && sebastian.longBio_it.length === 0)
) {
  patch.longBio_it = longBioIt
}

const result = await c.patch(sebastian._id).set(patch).commit()
console.log('PATCHED', sebastian._id, 'with keys:', Object.keys(patch))
console.log('Slug now:', result.slug?.current)
