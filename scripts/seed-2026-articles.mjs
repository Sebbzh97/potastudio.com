/**
 * Seed script — 2026 GEO-optimised blog articles.
 *
 * Seeds 4 documents (2 articles × 2 locales) into Sanity:
 *   1. Shoppertainment 2026  (EN + IT)
 *   2. AI Creative Gap 2026  (EN + IT)
 *
 * Plus the supporting "Trends" category in both locales and the author
 * profile, all created with deterministic `_id`s so the script is fully
 * idempotent — re-running it updates the documents in place rather than
 * creating duplicates.
 *
 * Hreflang wiring:
 *   Each IT post sets `translationOf` to its EN counterpart's `_id`.
 *   At request time, `lib/blog/hreflang.ts` reads this reference to emit
 *   <link rel="alternate" hreflang="..." /> tags pointing at the *actual*
 *   per-locale slug (slugs differ between locales for keyword optimisation).
 *
 * GEO field coverage:
 *   - quickAnswer    → injected as the lead FAQPage entry
 *   - tldr           → rendered as the post's TL;DR callout
 *   - keyTakeaways   → bullet list, AI-citable
 *   - faqItems       → curated Q/A list, FAQPage JSON-LD
 *   - keyStatistics  → stat callouts attributed to a verifiable source
 *   - body.tableBlock → semantic <table>, Featured-Snippet eligible
 *
 * Usage:
 *   node --env-file-if-exists=/vercel/share/.env.project scripts/seed-2026-articles.mjs
 *
 * Required env: SANITY_API_WRITE_TOKEN, NEXT_PUBLIC_SANITY_PROJECT_ID,
 *               NEXT_PUBLIC_SANITY_DATASET.
 */

import { createClient } from '@sanity/client'
import { randomUUID } from 'node:crypto'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_API_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_API_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !token) {
  console.error('[seed] Missing env: NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN are required.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-10-01',
  token,
  useCdn: false,
})

// ---------------------------------------------------------------------------
// Portable Text helpers (Sanity needs `_key` on every array entry).
// ---------------------------------------------------------------------------
const k = () => randomUUID().slice(0, 12)

const block = (style, text, marks = []) => ({
  _type: 'block',
  _key: k(),
  style,
  markDefs: [],
  children: [{ _type: 'span', _key: k(), text, marks }],
})

const para = (text) => block('normal', text)
const h2 = (text) => block('h2', text)

const callout = (type, text) => ({
  _type: 'callout',
  _key: k(),
  type,
  text,
})

const tableBlock = (caption, rows) => ({
  _type: 'tableBlock',
  _key: k(),
  caption,
  rows: rows.map((cells) => ({
    _type: 'object',
    _key: k(),
    cells: cells.map(String),
  })),
})

// ---------------------------------------------------------------------------
// Supporting documents (category + author). Created only if missing so we
// don't clobber CMS-side edits.
// ---------------------------------------------------------------------------
const CATEGORY_EN_ID = 'category-trends-en'
const CATEGORY_IT_ID = 'category-trends-it'
const AUTHOR_ID = 'author-sebastian-bonfanti'

async function ensureSupportingDocs() {
  await client.createIfNotExists({
    _id: CATEGORY_EN_ID,
    _type: 'blogCategory',
    title: 'Trends',
    slug: { _type: 'slug', current: 'trends' },
    language: 'en',
    description: 'Marketing, social, and AI trends shaping 2026 and beyond.',
    color: '#FF5C00',
  })
  await client.createIfNotExists({
    _id: CATEGORY_IT_ID,
    _type: 'blogCategory',
    title: 'Trend',
    slug: { _type: 'slug', current: 'trend' },
    language: 'it',
    description: 'I trend di marketing, social e AI che stanno definendo il 2026.',
    color: '#FF5C00',
  })

  // Author is best left to be created via Studio (it requires a profile
  // photo image asset). We only create a stub if absolutely missing.
  const existing = await client.fetch('*[_id == $id][0]{_id}', { id: AUTHOR_ID })
  if (!existing) {
    console.warn(
      '[seed] No `blogAuthor` with _id="author-sebastian-bonfanti" found. ' +
        'Skipping author reference. Create the author in Studio (with photo) ' +
        'and re-run this script to wire posts to it.',
    )
  }
  return Boolean(existing)
}

// ---------------------------------------------------------------------------
// Article 1 — Shoppertainment 2026
// ---------------------------------------------------------------------------
const SHOPPERTAINMENT_EN_ID = 'post-shoppertainment-2026-en'
const SHOPPERTAINMENT_IT_ID = 'post-shoppertainment-2026-it'

const shoppertainmentEN = {
  _id: SHOPPERTAINMENT_EN_ID,
  _type: 'blogPost',
  language: 'en',
  title: 'Shoppertainment 2026: Why Your Traditional E-commerce is Losing the Battle',
  slug: { _type: 'slug', current: 'shoppertainment-2026-tiktok-shop-live-commerce-global' },
  metaTitle:
    'Shoppertainment 2026: Why Your Traditional E-commerce is Losing the Battle',
  metaDescription:
    'Learn how TikTok Shop and Live Commerce are redefining global sales in 2026. A practical guide for brands to scale through entertainment.',
  primaryKeyword: 'shoppertainment 2026',
  secondaryKeywords: ['TikTok Shop strategy', 'live commerce conversion rate', 'social commerce 2026'],
  tags: ['TikTok', 'E-commerce', 'Live Commerce', 'Social Commerce', '2026 trends'],
  publishedAt: '2026-04-15T09:00:00Z',
  isPublished: true,
  featured: true,
  readingTime: 7,
  category: { _type: 'reference', _ref: CATEGORY_EN_ID },
  // The Quick Answer is the single most important GEO field — it gets
  // promoted to the lead FAQPage entry and is the most-cited paragraph by
  // Perplexity / Google AI Overviews.
  quickAnswer:
    'Shoppertainment is the convergence of content and commerce, allowing users to purchase products directly within social platforms. In 2026, global brands leveraging Live Commerce report conversion rates up to 8x higher than traditional web stores, driven by authenticity and real-time engagement.',
  tldr:
    'Linear funnels are dead. TikTok Shop and Live Commerce are pulling discovery, entertainment and checkout into a single in-app loop, with conversion rates that dwarf those of traditional e-commerce.',
  keyTakeaways: [
    'In 2026, TikTok Shop and Instagram Checkout host the entire purchase journey, eliminating the click-out to a brand site.',
    'Live Commerce sessions average 6.5–11.2% conversion rates — roughly 5–8x higher than the 1.5–1.8% baseline of classic e-commerce.',
    'Real-time AI sentiment analysis on the live chat is now the unfair advantage: it lets brands re-price, restock and re-pitch within the same 60-minute window.',
    'Brands that delay TikTok Shop integration in 2026 are paying a 30–40% premium per acquisition versus social-native competitors.',
  ],
  keyStatistics: [
    {
      _key: k(),
      value: '8x',
      label: 'Live Commerce conversion rate vs. traditional e-commerce',
      source: 'Pota Studio internal benchmark, Q1 2026',
    },
    {
      _key: k(),
      value: '11.2%',
      label: 'Average Live Commerce conversion rate observed in 2026',
      source: 'Pota Studio client portfolio (Samsung, Atalanta BC, Airbnb)',
    },
  ],
  faqItems: [
    {
      _key: k(),
      question: 'What is Shoppertainment exactly?',
      answer:
        'Shoppertainment is a content-first commerce model where the discovery, entertainment and purchase steps all happen inside the same social app — most notably on TikTok Shop, Instagram Checkout and YouTube Shopping.',
    },
    {
      _key: k(),
      question: 'How much higher are Live Commerce conversion rates?',
      answer:
        'Pota Studio benchmarks across Q1 2026 put Live Commerce sessions in the 7–12% conversion range, against ~1.5–1.8% for traditional e-commerce. The gap is driven by real-time engagement, scarcity tactics and presenter authority.',
    },
    {
      _key: k(),
      question: 'Is Shoppertainment only for B2C fashion and beauty?',
      answer:
        'No. We have shipped Shoppertainment campaigns across consumer electronics, fintech onboarding, sports merchandise and travel. The format works wherever a product benefits from demonstration or storytelling.',
    },
  ],
  body: [
    h2('The collapse of the linear funnel'),
    para(
      'Through 2024 the playbook looked like this: a TikTok or Reel sparked curiosity, the user opened a browser, searched for the brand, landed on the site, and (sometimes) checked out. Each handoff leaked between 30% and 60% of the audience. In 2026 that funnel is gone — discovery, entertainment and checkout collapse into a single in-app loop.',
    ),
    para(
      'TikTok Shop, Instagram Checkout and YouTube Shopping each removed the browser detour. The session that started with a video ends with a purchase confirmation, often inside 90 seconds.',
    ),
    h2('Live Commerce benchmark'),
    para(
      'A 60-minute live session — when produced with proper choreography, multiple SKUs and real-time community moderation — routinely matches a full month of revenue from the brand site.',
    ),
    tableBlock('Conversion rates by channel — Pota Studio portfolio, Q1 2026', [
      ['Channel', 'Avg. conversion rate', 'Engagement'],
      ['Classic e-commerce', '1.8%', 'Low'],
      ['TikTok Shop', '6.5%', 'High'],
      ['Live Commerce', '11.2%', 'Very High'],
    ]),
    callout(
      'stat',
      'Brands that delayed TikTok Shop integration into 2026 are paying a 30–40% CAC premium versus social-native competitors.',
    ),
    h2('The Pota Studio strategy'),
    para(
      'We pair the live show with a real-time AI sentiment layer that scans every comment, ranks the top objections and surfaces them to the host inside 30 seconds. The result is a live that adapts price, bundling and on-screen messaging while the audience is still watching.',
    ),
  ],
}

const shoppertainmentIT = {
  _id: SHOPPERTAINMENT_IT_ID,
  _type: 'blogPost',
  language: 'it',
  // EN counterpart reference — drives hreflang resolution at runtime.
  translationOf: { _type: 'reference', _ref: SHOPPERTAINMENT_EN_ID },
  title: 'Shoppertainment 2026: Perché il tuo E-commerce Tradizionale sta Morendo',
  slug: { _type: 'slug', current: 'shoppertainment-2026-tiktok-shop-live-commerce-italia' },
  metaTitle:
    'Shoppertainment 2026: Perché il tuo E-commerce Tradizionale sta Morendo',
  metaDescription:
    'Scopri come il TikTok Shop e il Live Commerce stanno rivoluzionando le vendite online in Italia nel 2026. Guida pratica per scalare con l’intrattenimento.',
  primaryKeyword: 'shoppertainment 2026 italia',
  secondaryKeywords: ['TikTok Shop Italia', 'live commerce conversion rate', 'social commerce 2026'],
  tags: ['TikTok', 'E-commerce', 'Live Commerce', 'Social Commerce', 'Trend 2026'],
  publishedAt: '2026-04-15T09:00:00Z',
  isPublished: true,
  featured: true,
  readingTime: 7,
  category: { _type: 'reference', _ref: CATEGORY_IT_ID },
  quickAnswer:
    'Lo Shoppertainment è la fusione tra shopping e intrattenimento, dove l’acquisto avviene direttamente all’interno dei social media (TikTok Shop, Instagram Checkout). Nel 2026, i brand italiani che adottano il Live Commerce vedono tassi di conversione medi del 7–12%, contro l’1.5% degli e-commerce tradizionali.',
  tldr:
    'Il funnel lineare è finito. TikTok Shop e Live Commerce uniscono scoperta, intrattenimento e checkout in un unico loop in-app, con conversion rate che surclassano l’e-commerce classico.',
  keyTakeaways: [
    'Nel 2026 TikTok Shop e Instagram Checkout ospitano l’intero customer journey, eliminando il salto al sito del brand.',
    'Le sessioni di Live Commerce viaggiano in media tra il 6.5% e l’11.2% di conversion rate — circa 5–8 volte la baseline dell’1.5–1.8% dell’e-commerce classico.',
    'L’analisi AI in tempo reale sui commenti della live è l’unfair advantage del 2026: permette di ri-prezzare, riassortire e ri-pitchare dentro la stessa finestra di 60 minuti.',
    'I brand italiani che rimandano l’integrazione di TikTok Shop nel 2026 stanno pagando un CAC del 30–40% superiore ai competitor social-native.',
  ],
  keyStatistics: [
    {
      _key: k(),
      value: '8x',
      label: 'Conversion rate Live Commerce vs. e-commerce tradizionale',
      source: 'Benchmark interno Pota Studio, Q1 2026',
    },
    {
      _key: k(),
      value: '11.2%',
      label: 'Conversion rate medio del Live Commerce nel 2026',
      source: 'Portfolio Pota Studio (Samsung, Atalanta BC, Airbnb)',
    },
  ],
  faqItems: [
    {
      _key: k(),
      question: 'Cos’è esattamente lo Shoppertainment?',
      answer:
        'Lo Shoppertainment è un modello di commerce content-first dove scoperta, intrattenimento e acquisto avvengono nella stessa app social — soprattutto TikTok Shop, Instagram Checkout e YouTube Shopping.',
    },
    {
      _key: k(),
      question: 'Quanto sono più alti i conversion rate del Live Commerce?',
      answer:
        'I benchmark Pota Studio del Q1 2026 mostrano sessioni Live Commerce nel range 7–12%, contro l’1.5–1.8% dell’e-commerce tradizionale. Il gap è guidato da engagement in tempo reale, scarcity e autorevolezza del presenter.',
    },
    {
      _key: k(),
      question: 'Lo Shoppertainment funziona solo per fashion e beauty B2C?',
      answer:
        'No. Abbiamo lanciato campagne Shoppertainment su consumer electronics, onboarding fintech, merchandising sportivo e travel. Il formato funziona ovunque il prodotto benefici di demo o storytelling.',
    },
  ],
  body: [
    h2('Il crollo del funnel lineare'),
    para(
      'Fino al 2024 il playbook era questo: un TikTok o un Reel attivava la curiosità, l’utente apriva il browser, cercava il brand, atterrava sul sito e (a volte) faceva checkout. Ogni passaggio faceva perdere tra il 30 e il 60% dell’audience. Nel 2026 quel funnel è finito: scoperta, intrattenimento e acquisto si comprimono in un unico loop in-app.',
    ),
    para(
      'TikTok Shop, Instagram Checkout e YouTube Shopping hanno rimosso la deviazione browser. La sessione che parte da un video si chiude con una conferma d’ordine, spesso entro 90 secondi.',
    ),
    h2('Benchmark Live Commerce'),
    para(
      'Una diretta di 60 minuti — se prodotta con la giusta scaletta, più SKU e una moderazione community in tempo reale — eguaglia regolarmente un mese intero di fatturato del sito brand.',
    ),
    tableBlock('Conversion rate per canale — portfolio Pota Studio, Q1 2026', [
      ['Canale', 'Conversion rate medio', 'Engagement'],
      ['E-commerce classico', '1.8%', 'Basso'],
      ['TikTok Shop', '6.5%', 'Alto'],
      ['Live Commerce', '11.2%', 'Altissimo'],
    ]),
    callout(
      'stat',
      'I brand italiani che hanno rimandato l’integrazione TikTok Shop nel 2026 stanno pagando un CAC del 30–40% superiore ai competitor social-native.',
    ),
    h2('La strategia Pota Studio'),
    para(
      'Affianchiamo alla diretta un layer AI di sentiment analysis che scansiona ogni commento, classifica le obiezioni principali e le porta all’host entro 30 secondi. Il risultato è una live che adatta prezzo, bundle e messaggi a video mentre l’audience sta ancora guardando.',
    ),
  ],
}

// ---------------------------------------------------------------------------
// Article 2 — AI Creative Gap 2026
// ---------------------------------------------------------------------------
const AI_GAP_EN_ID = 'post-ai-creative-gap-2026-en'
const AI_GAP_IT_ID = 'post-ai-creative-gap-2026-it'

const aiGapEN = {
  _id: AI_GAP_EN_ID,
  _type: 'blogPost',
  language: 'en',
  title: 'The AI Creative Gap 2026: Scaling Video Ads Without Breaking the Bank',
  slug: { _type: 'slug', current: 'ai-creative-gap-2026-video-ads-performance-global' },
  metaTitle:
    'The AI Creative Gap 2026: Scaling Video Ads Without Breaking the Bank',
  metaDescription:
    'AI has slashed video production costs. Discover why in 2026, your competitive advantage isn’t your budget — it’s your editorial taste.',
  primaryKeyword: 'AI creative gap 2026',
  secondaryKeywords: ['AI video ads', 'creative testing strategy', 'video production cost AI'],
  tags: ['AI', 'Video Ads', 'Creative Strategy', 'Performance Marketing'],
  publishedAt: '2026-04-22T09:00:00Z',
  isPublished: true,
  featured: true,
  readingTime: 8,
  category: { _type: 'reference', _ref: CATEGORY_EN_ID },
  quickAnswer:
    'The AI Creative Gap is the performance divide between brands using AI for mere cost-cutting and those using it for hyper-speed creative testing. In 2026, while technical production costs have dropped by 90%, the winning factor remains human vision and strategic “Taste” in directing AI workflows.',
  tldr:
    'AI has compressed video production costs by ~90% since 2024. The agencies that win in 2026 are not the cheapest — they are the ones with the editorial taste to direct AI at scale.',
  keyTakeaways: [
    'A national-grade video ad in 2026 can be produced for ~10% of its 2024 cost using a combination of generative video, AI voice and synthetic talent.',
    'The strategic moat shifted from “access to production” to “editorial taste” — what to test, what to ship, what to kill.',
    'Pota Studio runs an Extreme Creative Testing loop: 80–120 ad variants per campaign, fed by AI, evaluated against thumb-stop and 3-second view-through.',
    'Boutique agencies with strong creative direction now outperform global holding companies on ROAS because they iterate faster on insight, not on render budget.',
  ],
  keyStatistics: [
    {
      _key: k(),
      value: '90%',
      label: 'Reduction in technical video-production cost vs. 2024',
      source: 'Pota Studio production data, Q1 2026',
    },
    {
      _key: k(),
      value: '80–120',
      label: 'Creative variants tested per campaign in our Extreme Creative Testing loop',
      source: 'Pota Studio internal playbook',
    },
  ],
  faqItems: [
    {
      _key: k(),
      question: 'What is the AI Creative Gap?',
      answer:
        'It is the widening performance gap between brands using AI to cut production costs and brands using it to multiply the volume and quality of creative testing. The latter compound their learnings; the former just save money.',
    },
    {
      _key: k(),
      question: 'How much does an AI-produced video ad cost in 2026?',
      answer:
        'Across our portfolio in Q1 2026, a fully delivered AI-driven video ad lands at roughly 10% of its 2024 production cost — without sacrificing on-brand quality, when directed by an experienced creative team.',
    },
    {
      _key: k(),
      question: 'Will AI replace creative agencies?',
      answer:
        'No, but it will compress the ones whose value was “access to production”. The agencies that survive in 2026 are the ones whose value is editorial taste and creative strategy.',
    },
  ],
  body: [
    h2('Democratisation of production'),
    para(
      'You no longer need a 50,000€ shoot to launch a national-grade video ad. Generative video, AI voice cloning and synthetic talent push the marginal cost of an additional ad variant close to zero. The bottleneck is no longer the camera — it is the brief.',
    ),
    h2('Winning by volume — and by taste'),
    para(
      'Our Extreme Creative Testing loop ships 80–120 variants per campaign across hooks, value-propositions and visual styles. Each batch is fed by AI but graded by a human creative director against thumb-stop and 3-second view-through.',
    ),
    tableBlock('Cost per delivered video ad — 2024 vs. 2026', [
      ['Production type', '2024 cost', '2026 cost', 'Delta'],
      ['Studio shoot', '€50,000', '€8,000', '-84%'],
      ['Agency UGC briefing', '€2,500', '€600', '-76%'],
      ['Fully AI-generated ad', 'n/a', '€350', 'n/a'],
    ]),
    callout(
      'stat',
      'In 2026, ROAS no longer correlates with production budget — it correlates with the number of distinct creative angles tested in the first 14 days of the campaign.',
    ),
    h2('Why “Taste” is the only durable moat'),
    para(
      'When everyone has the same generative tools, the differentiator is not the toolkit — it is the human judgment that decides which 5 variants out of 100 are worth amplifying. That judgment is what we call Taste, and it is the one part of the workflow AI cannot yet outsource.',
    ),
  ],
}

const aiGapIT = {
  _id: AI_GAP_IT_ID,
  _type: 'blogPost',
  language: 'it',
  translationOf: { _type: 'reference', _ref: AI_GAP_EN_ID },
  title: 'AI Creative Gap 2026: Come Produrre 100 Video Ads al Costo di 1',
  slug: { _type: 'slug', current: 'ai-creative-gap-2026-video-ads-performance' },
  metaTitle:
    'AI Creative Gap 2026: Come Produrre 100 Video Ads al Costo di 1',
  metaDescription:
    'L’intelligenza artificiale ha azzerato i costi tecnici di produzione video. Scopri perché nel 2026 la differenza non la fa il budget, ma il gusto editoriale.',
  primaryKeyword: 'AI creative gap 2026',
  secondaryKeywords: ['AI video ads', 'creative testing', 'costo produzione video AI'],
  tags: ['AI', 'Video Ads', 'Creative Strategy', 'Performance Marketing'],
  publishedAt: '2026-04-22T09:00:00Z',
  isPublished: true,
  featured: true,
  readingTime: 8,
  category: { _type: 'reference', _ref: CATEGORY_IT_ID },
  quickAnswer:
    'L’AI Creative Gap è la differenza di performance tra i brand che usano l’AI solo per risparmiare e quelli che la usano per testare centinaia di varianti creative. Nel 2026, produrre una video ad costa il 90% in meno rispetto al 2024, ma il ROAS dipende esclusivamente dalla strategia e dal “Gusto” umano dietro il prompt.',
  tldr:
    'Dal 2024 l’AI ha compresso i costi tecnici di produzione video di ~90%. Nel 2026 vincono le agenzie con il gusto editoriale per dirigere l’AI alla velocità giusta — non quelle più economiche.',
  keyTakeaways: [
    'Una video ad di livello nazionale nel 2026 si produce a ~10% del costo del 2024, grazie a video generativo, AI voice e talent sintetici.',
    'Il vero asset strategico è passato da “accesso alla produzione” a “gusto editoriale”: cosa testare, cosa lanciare, cosa uccidere.',
    'Pota Studio gira un loop di Creative Testing Estremo: 80–120 varianti per campagna, generate via AI, valutate su thumb-stop e 3-second view-through.',
    'Le agenzie boutique con direzione creativa forte battono i grandi gruppi sul ROAS perché iterano sull’insight, non sul budget di rendering.',
  ],
  keyStatistics: [
    {
      _key: k(),
      value: '90%',
      label: 'Riduzione del costo tecnico di produzione video rispetto al 2024',
      source: 'Dati produzione interni Pota Studio, Q1 2026',
    },
    {
      _key: k(),
      value: '80–120',
      label: 'Varianti creative testate per campagna nel loop di Creative Testing Estremo',
      source: 'Playbook interno Pota Studio',
    },
  ],
  faqItems: [
    {
      _key: k(),
      question: 'Cos’è l’AI Creative Gap?',
      answer:
        'È il gap di performance crescente tra i brand che usano l’AI per tagliare i costi di produzione e quelli che la usano per moltiplicare volume e qualità del creative testing. I secondi accumulano insight; i primi risparmiano e basta.',
    },
    {
      _key: k(),
      question: 'Quanto costa una video ad AI nel 2026?',
      answer:
        'Sul nostro portfolio nel Q1 2026 una video ad AI completa atterra intorno al 10% del costo di produzione 2024 — senza sacrificare la qualità di brand, se diretta da un creative team esperto.',
    },
    {
      _key: k(),
      question: 'L’AI sostituirà le agenzie creative?',
      answer:
        'No, ma comprimerà quelle il cui valore era “accesso alla produzione”. Sopravvivono nel 2026 le agenzie il cui valore è il gusto editoriale e la strategia creativa.',
    },
  ],
  body: [
    h2('Democratizzazione della produzione'),
    para(
      'Non serve più un set da 50.000€ per lanciare uno spot di livello nazionale. Video generativo, AI voice cloning e talent sintetici portano il costo marginale di una variante in più vicino a zero. Il collo di bottiglia non è più la macchina da presa: è il brief.',
    ),
    h2('Vincere a volumi — e con il gusto'),
    para(
      'Il nostro loop di Creative Testing Estremo lancia 80–120 varianti per campagna su hook, value proposition e stili visivi. Ogni batch è generato dall’AI ma valutato da un creative director umano su thumb-stop e 3-second view-through.',
    ),
    tableBlock('Costo per video ad consegnata — 2024 vs 2026', [
      ['Tipologia di produzione', 'Costo 2024', 'Costo 2026', 'Delta'],
      ['Set in studio', '50.000€', '8.000€', '-84%'],
      ['UGC briefato in agenzia', '2.500€', '600€', '-76%'],
      ['Ad full AI-generated', 'n/d', '350€', 'n/d'],
    ]),
    callout(
      'stat',
      'Nel 2026 il ROAS non correla più con il budget di produzione — correla con il numero di angle creativi distinti testati nei primi 14 giorni di campagna.',
    ),
    h2('Perché il “Gusto” è l’unico moat durabile'),
    para(
      'Quando tutti hanno gli stessi tool generativi, il differenziale non è il toolkit: è il giudizio umano che sceglie le 5 varianti giuste sulle 100 generate. Questo giudizio è quello che chiamiamo Gusto, ed è la parte del workflow che l’AI ancora non sa replicare.',
    ),
  ],
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------
async function main() {
  console.log(`[seed] dataset=${dataset}`)

  const hasAuthor = await ensureSupportingDocs()

  // Optionally wire the author reference if it exists in CMS.
  const withAuthor = (post) =>
    hasAuthor ? { ...post, author: { _type: 'reference', _ref: AUTHOR_ID } } : post

  const posts = [
    withAuthor(shoppertainmentEN),
    withAuthor(shoppertainmentIT),
    withAuthor(aiGapEN),
    withAuthor(aiGapIT),
  ]

  // `createOrReplace` keeps the script idempotent — re-running it updates
  // the documents in place rather than creating duplicates.
  for (const doc of posts) {
    await client.createOrReplace(doc)
    console.log(`[seed] upserted ${doc._id} (${doc.language}) — ${doc.slug.current}`)
  }

  console.log('[seed] done.')
}

main().catch((err) => {
  console.error('[seed] failed:', err)
  process.exit(1)
})
