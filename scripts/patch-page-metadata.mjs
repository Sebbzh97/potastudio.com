/**
 * patch-page-metadata.mjs
 *
 * Patches all Sanity pageContent documents with SEO-optimised meta titles and
 * descriptions (<= 155 chars each). Run with:
 *
 *   node --env-file-if-exists=/vercel/share/.env.project scripts/patch-page-metadata.mjs
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
})

// Each entry matches a live pageContent _id in Sanity.
// Meta descriptions are ≤155 chars and front-load the primary keyword.
const patches = [
  // ── Homepage ────────────────────────────────────────────────────────────
  {
    id: 'pageContent-homepage-en',
    seoTitle: 'Pota Studio | Full-Service Marketing Agency | Bergamo, Italy',
    seoDescription:
      'Italian marketing agency from Bergamo. Samsung, Isybank, Lucca Comics. Paid ads, social media, influencer & content — all in-house. Europe & US.',
  },
  {
    id: 'pageContent-homepage-it',
    seoTitle: 'Pota Studio | Agenzia di Marketing Full-Service | Bergamo',
    seoDescription:
      'Agenzia marketing full-service a Bergamo. Samsung, Isybank, Lucca Comics. Paid ads, social media, influencer, content — tutto interno. Italia e Europa.',
  },

  // ── About ────────────────────────────────────────────────────────────────
  {
    id: 'pageContent-aboutPage-en',
    seoTitle: 'About Pota Studio | Marketing Agency Founded in Bergamo',
    seoDescription:
      'Full-service marketing agency founded in 2023 in Bergamo by Sebastian Bonfanti. Social media, paid ads, content & influencer — no handoffs, all in-house.',
  },
  {
    id: 'pageContent-aboutPage-it',
    seoTitle: 'Chi siamo | Pota Studio — Agenzia Marketing, Bergamo',
    seoDescription:
      "Pota Studio è un'agenzia marketing full-service fondata a Bergamo nel 2023 da Sebastian Bonfanti. Social, ADV, content & influencer — tutto interno.",
  },

  // ── Services ─────────────────────────────────────────────────────────────
  {
    id: 'pageContent-servicesPage-en',
    seoTitle: 'Marketing Services | Pota Studio — Paid Ads, Social, Content',
    seoDescription:
      'Paid advertising (TikTok, Meta, Google), content production, social media management, influencer marketing and brand strategy — all delivered in-house.',
  },
  {
    id: 'pageContent-servicesPage-it',
    seoTitle: 'Servizi Marketing | Pota Studio — Paid Ads, Social, Content',
    seoDescription:
      'Advertising (TikTok, Meta, Google), produzione contenuti, social media management, influencer marketing e brand strategy — tutto in-house a Bergamo.',
  },

  // ── Work ─────────────────────────────────────────────────────────────────
  {
    id: 'pageContent-workPage-en',
    seoTitle: 'Our Work | Pota Studio — Case Studies & Campaigns',
    seoDescription:
      'Case studies from Pota Studio: Samsung, Isybank, Lucca Comics & Games and more. Paid ads, social media and content campaigns that delivered real results.',
  },
  {
    id: 'pageContent-workPage-it',
    seoTitle: 'I nostri lavori | Pota Studio — Case Study & Campagne',
    seoDescription:
      'Case study di Pota Studio: Samsung, Isybank, Lucca Comics & Games e altri. Campagne paid ads, social media e content con risultati misurabili.',
  },

  // ── Blog ─────────────────────────────────────────────────────────────────
  {
    id: 'pageContent-blogPage-en',
    seoTitle: 'Blog | Pota Studio — Marketing Insights, AI & Paid Ads',
    seoDescription:
      'Marketing insights, AI trends and paid advertising playbooks from the Pota Studio team. Written for brand managers and performance marketers.',
  },
  {
    id: 'pageContent-blogPage-it',
    seoTitle: 'Blog | Pota Studio — Marketing, AI e Paid Advertising',
    seoDescription:
      'Insight sul marketing, trend AI e playbook sul paid advertising dal team di Pota Studio. Scritto per brand manager e performance marketer.',
  },

  // ── Clients ───────────────────────────────────────────────────────────────
  {
    id: 'pageContent-clientsPage-en',
    seoTitle: 'Our Clients | Pota Studio — Samsung, Isybank & More',
    seoDescription:
      'Pota Studio has worked with Samsung, Isybank, Lucca Comics & Games, and 50+ brands across fashion, fintech, food and entertainment.',
  },
  {
    id: 'pageContent-clientsPage-it',
    seoTitle: 'I nostri clienti | Pota Studio — Samsung, Isybank e altri',
    seoDescription:
      'Pota Studio ha lavorato con Samsung, Isybank, Lucca Comics & Games e oltre 50 brand nel fashion, fintech, food e entertainment.',
  },

  // ── Contact ───────────────────────────────────────────────────────────────
  {
    id: 'pageContent-contactPage-en',
    seoTitle: 'Contact Pota Studio | Marketing Agency — Bergamo, Italy',
    seoDescription:
      "Start a project with Pota Studio. Our office is in Bergamo (Via Zanica 85). We work with brands across Italy, UK, Germany and the US — let's talk.",
  },
  {
    id: 'pageContent-contactPage-it',
    seoTitle: 'Contattaci | Pota Studio — Agenzia Marketing, Bergamo',
    seoDescription:
      'Inizia un progetto con Pota Studio. Sede a Bergamo, Via Zanica 85. Lavoriamo con brand in Italia, UK, Germania e USA — scrivici.',
  },

  // ── Careers ───────────────────────────────────────────────────────────────
  {
    id: 'pageContent-careersPage-en',
    seoTitle: 'Careers at Pota Studio | Marketing Jobs in Bergamo & Remote',
    seoDescription:
      'Join Pota Studio — a fast-growing full-service marketing agency in Bergamo. Open positions in content, paid media and strategy. Remote roles available.',
  },
  {
    id: 'pageContent-careersPage-it',
    seoTitle: 'Lavora con noi | Pota Studio — Offerte di lavoro Marketing',
    seoDescription:
      'Unisciti a Pota Studio, agenzia marketing in rapida crescita a Bergamo. Posizioni aperte in content, paid media e strategia. Ruoli da remoto disponibili.',
  },

  // ── Privacy ───────────────────────────────────────────────────────────────
  {
    id: 'pageContent-privacyPage-en',
    seoTitle: 'Privacy Policy | Pota Studio (Anyped S.R.L.)',
    seoDescription:
      'Privacy Policy for Pota Studio (legal entity: Anyped S.R.L.). Learn how we collect, use and protect your personal data in line with GDPR.',
  },
  {
    id: 'pageContent-privacyPage-it',
    seoTitle: 'Privacy Policy | Pota Studio (Anyped S.R.L.)',
    seoDescription:
      'Informativa sulla privacy di Pota Studio (Anyped S.R.L.). Scopri come raccogliamo, utilizziamo e proteggiamo i tuoi dati personali nel rispetto del GDPR.',
  },

  // ── Cookie ────────────────────────────────────────────────────────────────
  {
    id: 'pageContent-cookiePage-en',
    seoTitle: 'Cookie Policy | Pota Studio',
    seoDescription:
      'Cookie Policy for potastudio.com. Find out which cookies we use, why we use them and how to manage your preferences.',
  },
  {
    id: 'pageContent-cookiePage-it',
    seoTitle: 'Cookie Policy | Pota Studio',
    seoDescription:
      'Cookie Policy di potastudio.com. Scopri quali cookie utilizziamo, perché li usiamo e come gestire le tue preferenze.',
  },
]

async function run() {
  console.log(`Patching ${patches.length} pageContent documents...`)
  const tx = client.transaction()
  for (const { id, seoTitle, seoDescription } of patches) {
    if (seoDescription.length > 155) {
      console.warn(`[WARN] ${id} seoDescription is ${seoDescription.length} chars (>155)`)
    }
    tx.patch(id, { set: { seoTitle, seoDescription } })
  }
  await tx.commit({ visibility: 'async' })
  console.log('Done. All patches committed.')
}

run().catch((e) => { console.error('ERR:', e.message); process.exit(1) })
