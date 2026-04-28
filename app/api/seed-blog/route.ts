/**
 * /api/seed-blog — Upsert all 12 blog posts, 4 categories and 1 author into Sanity.
 *
 * GET /api/seed-blog?secret=pota-seed-2026          → upsert all documents
 * GET /api/seed-blog?secret=pota-seed-2026&verify=1 → upsert + verify counts
 *
 * v2 — requires SANITY_API_TOKEN with editor/write permissions
 */

import { createClient } from '@sanity/client'
import { NextResponse } from 'next/server'

const SEED_SECRET = process.env.SEED_SECRET ?? 'pota-seed-2026'

const client = createClient({
  projectId: 'hjzz7d9r',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

// ─── helpers ──────────────────────────────────────────────────────────────────

function pt(text: string) {
  return text
    .split(/\n\n+/)
    .filter(Boolean)
    .map((para, i) => ({
      _type: 'block',
      _key: `b${i}`,
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: `s${i}`, text: para.replace(/\n/g, ' ').trim(), marks: [] }],
    }))
}

function catRef(id: string) { return { _type: 'reference', _ref: id } }
function authorRef() { return { _type: 'reference', _ref: 'author-sebastian-bonfanti' } }
function translationRef(id: string) { return { _type: 'reference', _ref: id } }

// ─── documents ────────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DOCS: any[] = [

  // ── AUTHOR ────────────────────────────────────────────────────────────────
  {
    _id: 'author-sebastian-bonfanti',
    _type: 'blogAuthor',
    name: 'Sebastian Bonfanti',
    slug: { _type: 'slug', current: 'sebastian-bonfanti' },
    role: 'Founder & CEO, Pota Studio',
    bio: 'Sebastian founded Pota Studio in 2023 after 7+ years as a communications consultant. Currently managing Samsung, Isybank and other top brands.',
    credentials: [
      'Full Service Marketing Agency',
      'Founder & CEO, Pota Studio',
      '7+ years digital marketing experience',
      'Clients: Samsung, Isybank',
    ],
  },

  // ── CATEGORIES ────────────────────────────────────────────────────────────
  { _id: 'cat-digital-marketing',  _type: 'blogCategory', title: 'Digital Marketing',  slug: { _type: 'slug', current: 'digital-marketing' },  language: 'en' },
  { _id: 'cat-paid-advertising',   _type: 'blogCategory', title: 'Paid Advertising',   slug: { _type: 'slug', current: 'paid-advertising' },   language: 'en' },
  { _id: 'cat-tiktok-marketing',   _type: 'blogCategory', title: 'TikTok Marketing',   slug: { _type: 'slug', current: 'tiktok-marketing' },   language: 'en' },
  { _id: 'cat-marketing-digitale', _type: 'blogCategory', title: 'Marketing Digitale', slug: { _type: 'slug', current: 'marketing-digitale' }, language: 'it' },

  // ── ART 1 EN — AI Marketing Tools ─────────────────────────────────────────
  {
    _id: 'blogPost-ai-marketing-tools-2026-en',
    _type: 'blogPost',
    language: 'en',
    isPublished: true,
    slug: { _type: 'slug', current: 'ai-marketing-tools-italian-smbs-2026' },
    title: 'AI in Marketing: 10 Tools Italian SMBs Are Actually Using in 2026',
    excerpt: 'The 10 AI tools most used by Italian SMBs in 2026, with real pricing and field-tested use cases. From ChatGPT to n8n: everything you need to start without wasting budget.',
    publishedAt: '2026-03-18T09:00:00Z',
    readingTime: 12,
    author: authorRef(),
    categories: [catRef('cat-digital-marketing')],
    tags: ['AI', 'Digital Marketing', 'SMB', 'Artificial Intelligence', 'Tools', 'Automation', 'ChatGPT'],
    metaTitle: 'AI in Marketing: 10 Tools Italian SMBs Use in 2026 (Real Pricing) | Pota Studio',
    metaDescription: 'Discover the 10 AI marketing tools most used by Italian SMBs in 2026, with real pricing, concrete use cases and advice from practitioners. A practical guide by Pota Studio.',
    primaryKeyword: 'AI marketing tools Italian SMBs 2026',
    secondaryKeywords: ['best AI tools for marketing 2026', 'artificial intelligence marketing Italy', 'ChatGPT for business', 'marketing tools SMB', 'marketing automation tools'],
    tldr: 'Italian SMBs using AI in marketing in 2026 use tools costing €20–200/month: ChatGPT Plus, Canva AI, Meta Advantage+, Surfer SEO, HubSpot AI, Descript, Klaviyo AI, Perplexity Pro, AdCreative.ai and n8n. Minimum base stack: €35–50/month.',
    quickAnswer: 'The best AI marketing tools for Italian SMBs in 2026 cost between €20 and €200 per month. The most widely used are ChatGPT Plus (€20/month), Meta Advantage+ (included in Meta Ads), and Klaviyo AI for e-commerce (from €20/month). A base stack starts at €35–50/month.',
    targetSearchQueries: ['best AI tools for marketing 2026', 'how to use artificial intelligence in marketing', 'AI marketing tools Italy SMB', 'ChatGPT for Italian businesses', 'how much does AI marketing cost', 'digital marketing tools 2026', 'marketing automation small business'],
    body: pt(
      `Italian SMBs using AI in their marketing in 2026 are not doing it with six-figure enterprise systems. They are doing it with tools costing €20 to €200 per month that automate content creation, optimise ad campaigns and analyse data in real time. The 10 most used are ChatGPT Plus, Canva AI, Meta Advantage+, Surfer SEO, HubSpot AI, Descript, Klaviyo AI, Perplexity Pro, AdCreative.ai and n8n. The minimum recommended budget for a base stack is €35–50 per month.\n\n` +
      `In 2026, artificial intelligence is no longer a competitive advantage reserved for large corporations. It has become an operational requirement for anyone who wants to remain competitive in the Italian market. 16.4% of Italian companies with at least 10 employees already use at least one AI technology — double the previous year (ISTAT, 2025). Marketing and sales account for 33.1% of all AI use cases in Italian businesses, with content creation leading adoption at 59.1% of cases.\n\n` +
      `ChatGPT Plus (€20/month) is the mandatory starting point. It generates copy for social media, email, blog posts, ads and product descriptions. Canva AI (€14.99/month) has radically transformed visual content production — reducing production time by 50–65% compared to traditional manual workflow. Meta Advantage+ is included in Meta Ads Manager and automatically optimises targeting, creatives and placement. Surfer SEO (€79/month) analyses content already ranking for target keywords and guides SEO optimisation in real time.\n\n` +
      `HubSpot AI (from €15/month) integrates predictive lead scoring into the CRM. Descript (€12/month) lets you edit video by modifying the transcribed text. Klaviyo AI is the most widely used email platform by Italian e-commerce businesses, with predictive segmentation and dynamic personalisation. Perplexity Pro (€18/month) answers complex questions citing real-time sources. AdCreative.ai (from €21/month) generates advertising creatives automatically. n8n (from €20/month) automates complex marketing workflows without code.\n\n` +
      `Three realistic budget scenarios for Italian SMBs: Base (€35–50/month) — ChatGPT Plus + Canva Pro, covers 70% of content needs. Intermediate (€100–150/month) — adds Klaviyo or HubSpot and Descript. Advanced (€250–350/month) — full stack with Surfer SEO, AdCreative.ai and n8n cloud for companies with ongoing paid campaigns and an active SEO blog.`
    ),
  },

  // ── ART 1 IT — AI Marketing Tools ─────────────────────────────────────────
  {
    _id: 'blogPost-ai-marketing-tools-2026-it',
    _type: 'blogPost',
    language: 'it',
    isPublished: true,
    slug: { _type: 'slug', current: 'ai-nel-marketing-strumenti-pmi-italiane-2026' },
    title: 'AI nel Marketing: i 10 strumenti che le PMI italiane stanno usando nel 2026',
    excerpt: 'I 10 strumenti AI più usati dalle PMI italiane nel 2026, con prezzi reali e casi d\'uso concreti testati sul campo. Da ChatGPT a n8n: tutto quello che serve per iniziare senza sprecare budget.',
    publishedAt: '2026-03-18T09:00:00Z',
    readingTime: 12,
    author: authorRef(),
    categories: [catRef('cat-marketing-digitale')],
    tags: ['AI', 'Marketing Digitale', 'PMI', 'Intelligenza Artificiale', 'Tool', 'Automazione', 'ChatGPT'],
    metaTitle: 'AI nel Marketing: 10 Tool per PMI Italiane nel 2026 (Prezzi Reali) | Pota Studio',
    metaDescription: 'Scopri i 10 strumenti di AI marketing più usati dalle PMI italiane nel 2026, con prezzi reali, casi d\'uso concreti e consigli da chi li usa ogni giorno. Guida pratica di Pota Studio.',
    primaryKeyword: 'AI nel marketing PMI italiane',
    secondaryKeywords: ['strumenti AI marketing 2026', 'intelligenza artificiale marketing Italia', 'ChatGPT per aziende', 'tool marketing PMI', 'automazione marketing'],
    tldr: 'Le PMI italiane che usano l\'AI nel marketing nel 2026 si affidano a tool da 20–200€/mese: ChatGPT Plus, Canva AI, Meta Advantage+, Surfer SEO, HubSpot AI, Descript, Klaviyo AI, Perplexity Pro, AdCreative.ai e n8n. Budget minimo stack base: 35–50€/mese.',
    quickAnswer: 'I migliori strumenti AI per il marketing delle PMI italiane nel 2026 costano tra 20 e 200€/mese. I più usati sono ChatGPT Plus (20€/mese), Meta Advantage+ (incluso in Meta Ads) e Klaviyo AI per l\'e-commerce (da 20€/mese). Uno stack base parte da 35–50€/mese.',
    targetSearchQueries: ['migliori strumenti AI per il marketing 2026', 'come usare l\'intelligenza artificiale nel marketing', 'tool AI marketing PMI Italia', 'ChatGPT per aziende italiane', 'quanto costa l\'AI nel marketing', 'strumenti marketing digitale 2026', 'automazione marketing piccole imprese'],
    translationOf: translationRef('blogPost-ai-marketing-tools-2026-en'),
    body: pt(
      `Le PMI italiane che usano l\'AI nel marketing nel 2026 non lo fanno con sistemi enterprise da centinaia di migliaia di euro. Lo fanno con tool da 20 a 200€/mese che automatizzano la creazione di contenuti, ottimizzano le campagne pubblicitarie e analizzano i dati in tempo reale. I 10 più usati sono ChatGPT Plus, Canva AI, Meta Advantage+, Surfer SEO, HubSpot AI, Descript, Klaviyo AI, Perplexity Pro, AdCreative.ai e n8n. Il budget minimo consigliato per uno stack base è 35–50€/mese.\n\n` +
      `Nel 2026, l\'intelligenza artificiale non è più un vantaggio competitivo riservato alle grandi aziende. Il 16,4% delle imprese italiane con almeno 10 addetti usa già almeno una tecnologia AI — il doppio rispetto all\'anno precedente (ISTAT, 2025). Il marketing e le vendite rappresentano il 33,1% di tutti i casi d\'uso AI nelle aziende italiane, con la creazione di contenuti che guida l\'adozione nel 59,1% dei casi.\n\n` +
      `ChatGPT Plus (20€/mese) è il punto di partenza obbligatorio. Genera copy per social media, email, blog, annunci e schede prodotto. Canva AI (14,99€/mese) ha trasformato la produzione visiva — riducendo i tempi del 50–65% rispetto al flusso manuale tradizionale. Meta Advantage+ è incluso in Meta Ads Manager e ottimizza automaticamente targeting, creative e placement. Surfer SEO (79€/mese) analizza i contenuti che rankano per le keyword target e guida l\'ottimizzazione SEO in tempo reale.\n\n` +
      `HubSpot AI (da 15€/mese) integra lo scoring predittivo dei lead nel CRM. Descript (12€/mese) permette di editare i video modificando il testo trascritto. Klaviyo AI è la piattaforma email più usata dagli e-commerce italiani, con segmentazione predittiva e personalizzazione dinamica. Perplexity Pro (18€/mese) risponde con fonti in tempo reale. AdCreative.ai (da 21€/mese) genera creative pubblicitarie automaticamente. n8n (da 20€/mese) automatizza workflow di marketing complessi senza codice.\n\n` +
      `Tre scenari di budget realistici per PMI italiane: Scenario Base (35–50€/mese) — ChatGPT Plus + Canva Pro, copre il 70% delle esigenze di contenuto. Scenario Intermedio (100–150€/mese) — aggiunge Klaviyo o HubSpot e Descript. Scenario Avanzato (250–350€/mese) — stack completo con Surfer SEO, AdCreative.ai e n8n cloud per chi ha campagne paid continuative e blog SEO attivo.`
    ),
  },

  // ── ART 2 EN — Meta DST ───────────────────────────────────────────────────
  {
    _id: 'blogPost-meta-dst-italy-2026-en',
    _type: 'blogPost',
    language: 'en',
    isPublished: true,
    slug: { _type: 'slug', current: 'meta-ads-dst-3-percent-surcharge-italy-july-2026' },
    title: 'Meta Ads in Italy After July 2026: How the 3% DST Surcharge Works',
    excerpt: 'From 1 July 2026, Meta applies a 3% surcharge on all ads targeting Italian users. Here is what it means for your budget, how to recalculate your ROAS and 5 concrete strategies to adapt.',
    publishedAt: '2026-03-18T09:00:00Z',
    readingTime: 8,
    author: authorRef(),
    categories: [catRef('cat-paid-advertising')],
    tags: ['Meta Ads', 'Facebook Ads', 'Instagram Ads', 'DST', 'Digital Services Tax', 'ROAS', 'Italy'],
    metaTitle: 'Meta Ads Italy July 2026: The 3% DST Surcharge Explained | Pota Studio',
    metaDescription: 'From 1 July 2026, Meta applies a 3% surcharge on all ads targeting Italian users. Learn exactly what it means for your budget, how to recalculate ROAS and the 5 strategies to adapt.',
    primaryKeyword: 'Meta Ads DST Italy 2026',
    secondaryKeywords: ['Digital Services Tax Meta Ads', 'Meta Ads cost increase Italy', 'DST surcharge advertising', 'ROAS calculation DST'],
    tldr: 'From 1 July 2026, Meta applies a 3% DST surcharge on all campaigns targeting Italian users. A €1,000 budget becomes €1,030 charged. Real ROAS = revenue ÷ (budget × 1.03). The 5 adaptation strategies: update ROAS targets, improve AOV, diversify to TikTok Ads, optimise creatives, activate Meta Advantage+ Shopping.',
    quickAnswer: 'The Meta Ads DST surcharge in Italy is 3% from 1 July 2026. It applies to all campaigns targeting Italian users, is charged separately on invoices, and requires updating your ROAS targets by dividing current targets by 0.97.',
    targetSearchQueries: ['Meta Ads DST Italy July 2026', 'Meta DST 3% surcharge explained', 'Digital Services Tax advertising Italy', 'how does Meta DST surcharge work', 'Meta Ads cost increase Italy 2026'],
    body: pt(
      `From 1 July 2026, Meta applies a 3% surcharge on all advertising campaigns targeting users in Italy to cover the Digital Services Tax (DST). A budget of €1,000 becomes €1,030 charged. The surcharge appears as a separate line in invoices under "Italy Digital Services Tax".\n\n` +
      `Real ROAS is calculated by dividing revenue by budget multiplied by 1.03. Example: if you spend €1,000 and generate €4,000 in revenue, your apparent ROAS is 4.0 but your real ROAS — accounting for the DST surcharge — is 3.88 (€4,000 ÷ €1,030). For a business with a ROAS break-even at 3.0, the real break-even after DST becomes 3.09.\n\n` +
      `The surcharge is not VAT and does not give the right to VAT deduction, but it is deductible as a business cost for direct tax purposes. It applies regardless of campaign objective, placement (Facebook, Instagram, Audience Network) or ad format (image, video, carousel, Stories).\n\n` +
      `The 5 adaptation strategies: (1) Update your ROAS target — divide your current target by 0.97 to find the equivalent post-DST target. (2) Improve average order value through upsell and cross-sell to maintain profitability at the same conversion volume. (3) Diversify budget toward TikTok Ads, which currently does not apply an equivalent DST surcharge in Italy. (4) Optimise creatives systematically — a 10–20% CTR improvement more than compensates for the 3% cost increase. (5) Activate Meta Advantage+ Shopping for e-commerce to maximise algorithmic efficiency and partially offset the higher cost.\n\n` +
      `At Pota Studio, we have already updated all client ROAS targets and budget pacing models in anticipation of 1 July 2026. The DST surcharge is real and non-negotiable — but for well-run accounts it is an operational adjustment, not a strategic crisis.`
    ),
  },

  // ── ART 2 IT — Meta DST ───────────────────────────────────────────────────
  {
    _id: 'blogPost-meta-dst-italy-2026-it',
    _type: 'blogPost',
    language: 'it',
    isPublished: true,
    slug: { _type: 'slug', current: 'meta-ads-dst-3-percento-luglio-2026-italia' },
    title: 'Meta Ads in Italia dal 1° luglio 2026: cosa cambia con la DST del 3%',
    excerpt: 'Dal 1° luglio 2026 Meta applica un supplemento del 3% su tutti gli annunci rivolti al pubblico italiano. Ecco cosa significa per il tuo budget, come ricalcolare il ROAS e le 5 strategie concrete per adattarti.',
    publishedAt: '2026-03-18T09:00:00Z',
    readingTime: 8,
    author: authorRef(),
    categories: [catRef('cat-paid-advertising')],
    tags: ['Meta Ads', 'Facebook Ads', 'Instagram Ads', 'DST', 'Digital Services Tax', 'ROAS', 'Italia'],
    metaTitle: 'Meta Ads e DST del 3%: cosa cambia dal 1° luglio 2026 per le aziende italiane | Pota Studio',
    metaDescription: 'Dal 1° luglio 2026 Meta applica un supplemento del 3% su tutti gli annunci rivolti al pubblico italiano. Scopri cosa significa, come cambia il budget e le 5 strategie per adattare la tua strategia.',
    primaryKeyword: 'Meta Ads DST Italia 2026',
    secondaryKeywords: ['Digital Services Tax Meta Ads', 'aumento costi Meta Ads Italia', 'supplemento DST advertising', 'calcolo ROAS DST'],
    tldr: 'Dal 1° luglio 2026, Meta applica un supplemento DST del 3% su tutte le campagne rivolte a utenti in Italia. Un budget di 1.000€ diventa 1.030€ addebitati. ROAS reale = entrate ÷ (budget × 1,03). Le 5 strategie: aggiorna i target ROAS, migliora AOV, diversifica su TikTok Ads, ottimizza le creative, attiva Meta Advantage+ Shopping.',
    quickAnswer: 'Il supplemento DST su Meta Ads in Italia è del 3% dal 1° luglio 2026. Si applica a tutte le campagne rivolte a utenti italiani, viene addebitato separatamente in fattura e richiede di aggiornare i target ROAS dividendo i target attuali per 0,97.',
    targetSearchQueries: ['Meta Ads DST Italia luglio 2026', 'supplemento DST Meta Ads spiegato', 'Digital Services Tax pubblicità Italia', 'come funziona supplemento DST Meta', 'aumento costi Meta Ads Italia 2026'],
    translationOf: translationRef('blogPost-meta-dst-italy-2026-en'),
    body: pt(
      `Dal 1° luglio 2026, Meta applica un supplemento del 3% su tutte le campagne pubblicitarie rivolte a utenti in Italia per coprire la Digital Services Tax (DST). Un budget di 1.000€ diventa 1.030€ addebitati. Il supplemento appare come voce separata in fattura con la dicitura "Italy Digital Services Tax".\n\n` +
      `Il ROAS reale si calcola dividendo le entrate per il budget moltiplicato 1,03. Esempio: se spendi 1.000€ e generi 4.000€ di entrate, il tuo ROAS apparente è 4,0 ma il ROAS reale — tenendo conto del supplemento DST — è 3,88 (4.000€ ÷ 1.030€). Per un'azienda con ROAS di pareggio a 3,0, il break-even reale post-DST diventa 3,09.\n\n` +
      `Il supplemento non è IVA e non dà diritto a detrazione IVA, ma è deducibile come costo d\'impresa ai fini delle imposte dirette. Si applica indipendentemente dall\'obiettivo della campagna, dal placement (Facebook, Instagram, Audience Network) o dal formato (immagine, video, carosello, Stories).\n\n` +
      `Le 5 strategie di adattamento: (1) Aggiorna il target ROAS — dividi il tuo target attuale per 0,97 per trovare il target equivalente post-DST. (2) Migliora il valore medio dell\'ordine tramite upsell e cross-sell per mantenere la redditività. (3) Diversifica il budget verso TikTok Ads, che attualmente non applica un supplemento DST equivalente in Italia. (4) Ottimizza le creative in modo sistematico — un miglioramento del CTR del 10–20% compensa ampiamente l\'aumento del 3%. (5) Attiva Meta Advantage+ Shopping per l\'e-commerce per massimizzare l\'efficienza algoritmica.\n\n` +
      `Da Pota Studio abbiamo già aggiornato tutti i target ROAS e i modelli di pacing del budget in previsione del 1° luglio 2026. Il supplemento DST è reale e non negoziabile — ma per gli account ben gestiti è un aggiustamento operativo, non una crisi strategica.`
    ),
  },

  // ── ART 3 EN — TikTok for Business ────────────────────────────────────────
  {
    _id: 'blogPost-tiktok-business-guide-2026-en',
    _type: 'blogPost',
    language: 'en',
    isPublished: true,
    slug: { _type: 'slug', current: 'tiktok-for-business-complete-guide-2026' },
    title: 'TikTok for Business in 2026: The Complete Guide for Italian Companies',
    excerpt: 'From TikTok Shop to TikTok Ads to LIVE Shopping: the complete guide for Italian companies wanting to use TikTok as a real revenue channel in 2026, not just for brand awareness.',
    publishedAt: '2026-03-18T09:00:00Z',
    readingTime: 15,
    author: authorRef(),
    categories: [catRef('cat-tiktok-marketing')],
    tags: ['TikTok', 'TikTok for Business', 'TikTok Shop', 'TikTok Ads', 'Social Commerce', 'LIVE Shopping', 'Italy'],
    metaTitle: 'TikTok for Business in 2026: Complete Guide for Italian Companies | Pota Studio',
    metaDescription: 'From TikTok Shop to LIVE Shopping: the complete guide for Italian companies using TikTok as a real revenue channel in 2026. Strategies, ad formats and case studies.',
    primaryKeyword: 'TikTok for business Italy 2026',
    secondaryKeywords: ['TikTok Shop Italy', 'TikTok Ads Italian companies', 'LIVE Shopping TikTok', 'social commerce Italy 2026'],
    tldr: 'TikTok in 2026 is a complete sales ecosystem for Italian companies: 23.1 million Italian users, TikTok Shop open to Italian sellers, LIVE Shopping with average conversion rates of 3–8%, TikTok Ads with CPMs of €4–12. The 4 pillars: organic content, TikTok Shop, LIVE Shopping, TikTok Ads.',
    quickAnswer: 'TikTok for business in Italy in 2026 means 23.1 million users, TikTok Shop available for Italian sellers, TikTok Ads with CPMs of €4–12, and LIVE Shopping with 3–8% conversion rates. Minimum recommended budget for ads: €1,500–2,000/month.',
    targetSearchQueries: ['TikTok for business Italy 2026', 'how to use TikTok for Italian business', 'TikTok Shop Italy guide', 'TikTok Ads cost Italy', 'LIVE Shopping TikTok Italy', 'social commerce TikTok 2026'],
    body: pt(
      `TikTok in 2026 is no longer just a platform for viral dances. For Italian companies, it has become a complete sales ecosystem: 23.1 million Italian users, TikTok Shop open to Italian sellers since 2025, LIVE Shopping with average conversion rates of 3–8%, and TikTok Ads with CPMs of €4–12 — significantly lower than Meta.\n\n` +
      `The 4 pillars of TikTok for business: (1) Organic content — short-form videos that educate, entertain or inspire, published 3–5 times per week minimum. (2) TikTok Shop — direct in-app e-commerce with product catalogue, affiliate creator programme and integrated checkout. (3) LIVE Shopping — real-time product demonstrations with direct purchasing, the fastest-growing format in Italy in 2025. (4) TikTok Ads — paid campaigns with In-Feed Ads, TopView, Branded Hashtag Challenges and Spark Ads.\n\n` +
      `TikTok Ads work differently from Meta Ads. The algorithm is content-first: your ads compete with organic content in the same feed. This means creative quality is the dominant variable — not audience size or targeting precision. The best-performing creatives look native: hand-filmed, authentic, with spoken captions and a direct call to action in the first 3 seconds.\n\n` +
      `For Italian companies starting TikTok Ads: minimum recommended budget is €1,500–2,000/month (below this, the algorithm has insufficient data to optimise). Creative testing cadence: minimum 3 new creatives per week. Ad formats that work best for Italian e-commerce in 2026: Spark Ads boosting organic creator content (lowest CPM, highest authenticity), In-Feed Ads for direct response, and Video Shopping Ads for catalogue-based retargeting.\n\n` +
      `TikTok Shop commissions: 5% of transaction value plus €0.30 fixed fee. For products under €20, this makes margins tight — TikTok Shop works best for products with unit margins above €15–20. LIVE Shopping requires a minimum following of 1,000 for Italian accounts and works best for products that benefit from demonstration: clothing, food, cosmetics, electronics accessories.\n\n` +
      `At Pota Studio we have managed TikTok campaigns for Samsung, Isybank and brands across fashion, food and technology. The data is consistent: accounts that invest simultaneously in organic content quality AND paid amplification achieve 3–5x better ROAS than accounts relying exclusively on paid ads without organic foundations.`
    ),
  },

  // ── ART 3 IT — TikTok per Aziende ─────────────────────────────────────────
  {
    _id: 'blogPost-tiktok-aziende-guida-2026-it',
    _type: 'blogPost',
    language: 'it',
    isPublished: true,
    slug: { _type: 'slug', current: 'tiktok-per-aziende-guida-completa-2026' },
    title: 'TikTok per Aziende nel 2026: La Guida Completa per le Imprese Italiane',
    excerpt: 'Da TikTok Shop a TikTok Ads fino al LIVE Shopping: la guida completa per le aziende italiane che vogliono usare TikTok come canale di vendita reale nel 2026, non solo per la brand awareness.',
    publishedAt: '2026-03-18T09:00:00Z',
    readingTime: 15,
    author: authorRef(),
    categories: [catRef('cat-tiktok-marketing')],
    tags: ['TikTok', 'TikTok per Aziende', 'TikTok Shop', 'TikTok Ads', 'Social Commerce', 'LIVE Shopping', 'Italia'],
    metaTitle: 'TikTok per Aziende nel 2026: Guida Completa per le Imprese Italiane | Pota Studio',
    metaDescription: 'Da TikTok Shop al LIVE Shopping: la guida completa per le aziende italiane che usano TikTok come canale di vendita reale nel 2026. Strategie, formati ads e casi studio.',
    primaryKeyword: 'TikTok per aziende Italia 2026',
    secondaryKeywords: ['TikTok Shop Italia', 'TikTok Ads aziende italiane', 'LIVE Shopping TikTok', 'social commerce Italia 2026'],
    tldr: 'TikTok nel 2026 è un ecosistema di vendita completo per le aziende italiane: 23,1 milioni di utenti italiani, TikTok Shop aperto ai venditori italiani, LIVE Shopping con tassi di conversione medi del 3–8%, TikTok Ads con CPM di 4–12€. I 4 pilastri: contenuto organico, TikTok Shop, LIVE Shopping, TikTok Ads.',
    quickAnswer: 'TikTok per aziende in Italia nel 2026 significa 23,1 milioni di utenti, TikTok Shop disponibile per i venditori italiani, TikTok Ads con CPM di 4–12€ e LIVE Shopping con tassi di conversione del 3–8%. Budget minimo consigliato per ads: 1.500–2.000€/mese.',
    targetSearchQueries: ['TikTok per aziende Italia 2026', 'come usare TikTok per business italiano', 'TikTok Shop Italia guida', 'costo TikTok Ads Italia', 'LIVE Shopping TikTok Italia', 'social commerce TikTok 2026'],
    translationOf: translationRef('blogPost-tiktok-business-guide-2026-en'),
    body: pt(
      `TikTok nel 2026 non è più solo una piattaforma per video virali. Per le aziende italiane è diventato un ecosistema di vendita completo: 23,1 milioni di utenti italiani, TikTok Shop aperto ai venditori italiani dal 2025, LIVE Shopping con tassi di conversione medi del 3–8%, e TikTok Ads con CPM di 4–12€ — significativamente inferiori a Meta.\n\n` +
      `I 4 pilastri di TikTok per le aziende: (1) Contenuto organico — video short-form che educano, intrattengono o ispirano, pubblicati almeno 3–5 volte a settimana. (2) TikTok Shop — e-commerce diretto in-app con catalogo prodotti, programma di affiliazione creator e checkout integrato. (3) LIVE Shopping — dimostrazioni prodotto in tempo reale con acquisto diretto, il formato in più rapida crescita in Italia nel 2025. (4) TikTok Ads — campagne paid con In-Feed Ads, TopView, Branded Hashtag Challenge e Spark Ads.\n\n` +
      `TikTok Ads funziona diversamente da Meta Ads. L\'algoritmo è content-first: i tuoi annunci competono con i contenuti organici nello stesso feed. Questo significa che la qualità della creatività è la variabile dominante — non la dimensione del pubblico o la precisione del targeting. Le creative con le migliori performance sembrano native: girate a mano, autentiche, con sottotitoli parlati e una call to action diretta nei primi 3 secondi.\n\n` +
      `Per le aziende italiane che iniziano con TikTok Ads: il budget minimo consigliato è 1.500–2.000€/mese (sotto questa soglia, l\'algoritmo ha dati insufficienti per ottimizzare). Cadenza di test creativi: almeno 3 nuove creative a settimana. I formati ads che funzionano meglio per l\'e-commerce italiano nel 2026: Spark Ads che amplificano contenuti organici dei creator (CPM più basso, massima autenticità), In-Feed Ads per direct response, e Video Shopping Ads per il retargeting basato su catalogo.\n\n` +
      `Commissioni TikTok Shop: 5% del valore della transazione più 0,30€ di quota fissa. Per prodotti sotto i 20€, questo rende i margini stretti — TikTok Shop funziona meglio per prodotti con margini unitari superiori a 15–20€. Il LIVE Shopping richiede un minimo di 1.000 follower per gli account italiani e funziona meglio per prodotti che beneficiano della dimostrazione: abbigliamento, food, cosmetica, accessori elettronici.\n\n` +
      `Da Pota Studio abbiamo gestito campagne TikTok per Samsung, Isybank e brand nei settori fashion, food e technology. I dati sono consistenti: gli account che investono contemporaneamente nella qualità del contenuto organico E nell\'amplificazione paid ottengono un ROAS 3–5 volte migliore rispetto agli account che si affidano esclusivamente alle ads senza fondamenta organiche.`
    ),
  },

  // ── ART 4 EN — Finding Customers ──────────────────────────────────────────
  {
    _id: 'blogPost-find-customers-online-smb-2026-en',
    _type: 'blogPost',
    language: 'en',
    isPublished: true,
    slug: { _type: 'slug', current: 'how-to-find-customers-online-italian-smb-2026' },
    title: 'How to Find Customers Online: A Complete Guide for Italian SMBs in 2026',
    excerpt: 'The 7 most effective channels for finding new customers online for Italian SMBs in 2026, with real data, minimum budgets and the exact sequence in which to activate them.',
    publishedAt: '2026-03-25T09:00:00Z',
    readingTime: 14,
    author: authorRef(),
    categories: [catRef('cat-digital-marketing')],
    tags: ['Lead Generation', 'Find Customers Online', 'Google Ads', 'SEO', 'Digital Marketing', 'SMB', 'Italy'],
    metaTitle: 'How to Find Customers Online for Italian SMBs in 2026: 7 Channels That Work | Pota Studio',
    metaDescription: 'The 7 most effective channels for finding new customers online for Italian SMBs in 2026, with real data, minimum budgets and the activation sequence that maximises ROI.',
    primaryKeyword: 'find customers online Italian SMB 2026',
    secondaryKeywords: ['lead generation Italy SMB', 'digital marketing customer acquisition', 'online advertising Italy 2026', 'B2B lead generation Italy'],
    tldr: 'The 7 most effective channels for Italian SMBs to find customers online in 2026: Google Ads Search (immediate, measurable), SEO (long-term, compounding), LinkedIn Ads (B2B), Meta Ads (B2C, retargeting), TikTok Ads (awareness + conversion), email marketing, and referral programmes. Activation order matters: start with Google Ads Search, build SEO in parallel, add social paid after 90 days.',
    quickAnswer: 'For Italian SMBs in 2026, the most effective channels for finding customers online are Google Ads Search (immediate ROI, minimum €1,000/month), SEO (3–6 months to results), and Meta Ads for B2C or LinkedIn Ads for B2B. Start with Google Search, build email list from day one.',
    targetSearchQueries: ['how to find customers online Italy', 'lead generation for Italian SMB', 'best digital marketing channels Italy 2026', 'B2B customer acquisition Italy', 'Google Ads vs SEO Italy SMB'],
    body: pt(
      `Finding new customers online is the number one priority for Italian SMBs in 2026 — and also the area where budget is wasted most systematically. The fundamental mistake: activating multiple channels simultaneously without a clear acquisition strategy, then declaring that "digital advertising does not work" after 30 days.\n\n` +
      `The 7 most effective channels for Italian SMBs to find customers online in 2026, in recommended activation order:\n\n` +
      `1. Google Ads Search — the highest-intent channel. Users searching "plumber Rome urgent" or "accountant Milan SME" have already decided they need the service. Minimum budget: €1,000/month. Average conversion rate for well-configured Italian accounts: 3–8%. Average time to first results: 2–4 weeks.\n\n` +
      `2. SEO (Search Engine Optimisation) — the only channel with compounding ROI over time. A well-positioned article continues generating leads without ongoing cost. Minimum investment: €500–800/month for content production + technical optimisation. Time to results: 3–6 months. Ideal for businesses with defined service lines and predictable search queries.\n\n` +
      `3. LinkedIn Ads — mandatory for B2B companies with decision-maker targeting. CPM: €15–35 (expensive, but quality is unmatched). Works best for companies with average deal values above €5,000. Lead Gen Forms on LinkedIn convert at 10–15% versus 3–5% for equivalent landing pages.\n\n` +
      `4. Meta Ads (Facebook + Instagram) — ideal for B2C with visual products or services. Best used for retargeting website visitors (conversion rate 5–15x higher than cold audiences) and lookalike audiences based on existing customer lists. Minimum effective budget: €1,500/month.\n\n` +
      `5. TikTok Ads — growing rapidly for both B2C awareness and direct conversion. CPMs of €4–12 make it cost-effective for top-of-funnel reach. Best results when combined with organic TikTok content. Minimum effective budget: €1,500/month.\n\n` +
      `6. Email marketing — the channel with the highest documented ROI (average €36 return per €1 invested, DMA UK 2025). Essential for nurturing leads who are not yet ready to buy. Build the list from day one: every website visitor, every event attendee, every contact is a potential subscriber.\n\n` +
      `7. Referral programmes — the most underused channel by Italian SMBs. A structured referral programme (discount or credit for both referrer and new customer) can generate 20–40% of new customers for service businesses at near-zero marginal cost.\n\n` +
      `The correct activation sequence: Month 1–2: Google Ads Search + start building email list. Month 3–4: add SEO content production + Meta Ads retargeting. Month 5–6: add TikTok Ads or LinkedIn (depending on B2B vs B2C). Month 7+: referral programme activation + email nurturing sequences.`
    ),
  },

  // ── ART 4 IT — Trovare Clienti ────────────────────────────────────────────
  {
    _id: 'blogPost-trovare-clienti-online-pmi-2026-it',
    _type: 'blogPost',
    language: 'it',
    isPublished: true,
    slug: { _type: 'slug', current: 'come-trovare-clienti-online-pmi-italiane-2026' },
    title: 'Come Trovare Clienti Online: la Guida Completa per le PMI Italiane nel 2026',
    excerpt: 'I 7 canali più efficaci per trovare nuovi clienti online per le PMI italiane nel 2026, con dati reali, budget minimi e la sequenza esatta in cui attivarli.',
    publishedAt: '2026-03-25T09:00:00Z',
    readingTime: 14,
    author: authorRef(),
    categories: [catRef('cat-marketing-digitale')],
    tags: ['Lead Generation', 'Trovare Clienti Online', 'Google Ads', 'SEO', 'Marketing Digitale', 'PMI', 'Italia'],
    metaTitle: 'Come Trovare Clienti Online per PMI Italiane nel 2026: 7 Canali che Funzionano | Pota Studio',
    metaDescription: 'I 7 canali più efficaci per trovare nuovi clienti online per le PMI italiane nel 2026, con dati reali, budget minimi e la sequenza di attivazione che massimizza il ROI.',
    primaryKeyword: 'trovare clienti online PMI italiane 2026',
    secondaryKeywords: ['lead generation PMI Italia', 'acquisizione clienti digitale', 'pubblicità online Italia 2026', 'lead generation B2B Italia'],
    tldr: 'I 7 canali più efficaci per le PMI italiane per trovare clienti online nel 2026: Google Ads Search (immediato, misurabile), SEO (lungo termine, compounding), LinkedIn Ads (B2B), Meta Ads (B2C, retargeting), TikTok Ads (awareness + conversione), email marketing e programmi referral. L\'ordine di attivazione conta: inizia con Google Ads Search, costruisci SEO in parallelo, aggiungi social paid dopo 90 giorni.',
    quickAnswer: 'Per le PMI italiane nel 2026, i canali più efficaci per trovare clienti online sono Google Ads Search (ROI immediato, minimo 1.000€/mese), SEO (3–6 mesi ai risultati) e Meta Ads per B2C o LinkedIn Ads per B2B. Inizia con Google Search, costruisci la lista email dal primo giorno.',
    targetSearchQueries: ['come trovare clienti online Italia', 'lead generation per PMI italiane', 'migliori canali marketing digitale Italia 2026', 'acquisizione clienti B2B Italia', 'Google Ads vs SEO PMI Italia'],
    translationOf: translationRef('blogPost-find-customers-online-smb-2026-en'),
    body: pt(
      `Trovare nuovi clienti online è la priorità numero uno per le PMI italiane nel 2026 — ed è anche l\'area dove il budget viene sprecato più sistematicamente. L\'errore fondamentale: attivare più canali contemporaneamente senza una strategia di acquisizione chiara, poi dichiarare che "la pubblicità digitale non funziona" dopo 30 giorni.\n\n` +
      `I 7 canali più efficaci per le PMI italiane per trovare clienti online nel 2026, in ordine consigliato di attivazione:\n\n` +
      `1. Google Ads Search — il canale con la più alta intenzione d\'acquisto. Un utente che cerca "idraulico Roma urgente" o "commercialista Milano PMI" ha già deciso di aver bisogno del servizio. Budget minimo: 1.000€/mese. Tasso di conversione medio per account italiani ben configurati: 3–8%. Tempo ai primi risultati: 2–4 settimane.\n\n` +
      `2. SEO (Search Engine Optimisation) — l\'unico canale con ROI compounding nel tempo. Un articolo ben posizionato continua a generare lead senza costi ricorrenti. Investimento minimo: 500–800€/mese per produzione contenuti + ottimizzazione tecnica. Tempo ai risultati: 3–6 mesi. Ideale per aziende con linee di servizio definite e query di ricerca prevedibili.\n\n` +
      `3. LinkedIn Ads — obbligatorio per le aziende B2B con targeting su decision maker. CPM: 15–35€ (costoso, ma la qualità del targeting è impareggiabile). Funziona meglio per aziende con valore medio del contratto superiore a 5.000€. I Lead Gen Form su LinkedIn convertono al 10–15% contro il 3–5% di landing page equivalenti.\n\n` +
      `4. Meta Ads (Facebook + Instagram) — ideale per B2C con prodotti o servizi visivi. Usare principalmente per retargeting dei visitatori del sito (tasso di conversione 5–15x superiore ai pubblici freddi) e lookalike audience basate su liste di clienti esistenti. Budget minimo efficace: 1.500€/mese.\n\n` +
      `5. TikTok Ads — in rapida crescita sia per awareness B2C che per conversione diretta. CPM di 4–12€ lo rendono conveniente per la reach top-of-funnel. I migliori risultati si ottengono combinando contenuto organico TikTok con amplificazione paid. Budget minimo efficace: 1.500€/mese.\n\n` +
      `6. Email marketing — il canale con il ROI più alto documentato (media 36€ di ritorno per 1€ investito, DMA UK 2025). Essenziale per il nurturing dei lead non ancora pronti all\'acquisto. Costruisci la lista dal primo giorno: ogni visitatore del sito, ogni partecipante a un evento, ogni contatto è un potenziale iscritto.\n\n` +
      `7. Programmi referral — il canale più sottoutilizzato dalle PMI italiane. Un programma di referral strutturato (sconto o credito sia per chi segnala che per il nuovo cliente) può generare il 20–40% dei nuovi clienti per le aziende di servizi a costo marginale quasi zero.\n\n` +
      `La sequenza di attivazione corretta: Mesi 1–2: Google Ads Search + inizio costruzione lista email. Mesi 3–4: aggiunta produzione contenuti SEO + Meta Ads retargeting. Mesi 5–6: aggiunta TikTok Ads o LinkedIn Ads (B2B vs B2C). Mese 7+: attivazione programma referral + sequenze email nurturing.`
    ),
  },

  // ── ART 5 EN — Google Ads SMB ─────────────────────────────────────────────
  {
    _id: 'blogPost-google-ads-smb-guide-2026-en',
    _type: 'blogPost',
    language: 'en',
    isPublished: true,
    slug: { _type: 'slug', current: 'google-ads-guide-italian-smb-2026' },
    title: 'Google Ads for Italian SMBs in 2026: How Much to Spend and What to Expect',
    excerpt: 'The complete guide to Google Ads for Italian SMBs in 2026: real costs, benchmarks by sector, the 3 campaign types that work and the 5 mistakes that burn budget without results.',
    publishedAt: '2026-03-25T09:00:00Z',
    readingTime: 11,
    author: authorRef(),
    categories: [catRef('cat-paid-advertising')],
    tags: ['Google Ads', 'PPC', 'SEM', 'SMB', 'Italy', 'Lead Generation', 'ROAS', 'CPC'],
    metaTitle: 'Google Ads for Italian SMBs in 2026: Real Costs and What to Expect | Pota Studio',
    metaDescription: 'Complete guide to Google Ads for Italian SMBs in 2026: real costs by sector, the 3 campaign types that generate ROI, benchmarks and the 5 mistakes that burn budget.',
    primaryKeyword: 'Google Ads Italian SMB 2026',
    secondaryKeywords: ['Google Ads cost Italy 2026', 'PPC advertising Italian small business', 'Google Ads benchmark Italy', 'SEM Italy SMB'],
    tldr: 'Google Ads for Italian SMBs in 2026: minimum effective budget €1,000–1,500/month, average CPC €0.80–4.50 depending on sector, average conversion rate 3–8% for Search, break-even ROAS typically 3–5x. The 3 campaign types that work: Search (intent), Performance Max (full funnel), Shopping (e-commerce). The 5 mistakes to avoid: too-broad keywords, no negative keyword list, ignoring Quality Score, no conversion tracking, insufficient budget for meaningful data.',
    quickAnswer: 'Google Ads for Italian SMBs costs €1,000–1,500/month minimum to be effective. Average CPC ranges from €0.80 (local services) to €4.50 (legal/financial). Average Search campaign conversion rate is 3–8%. Results typically appear in 2–4 weeks with proper setup.',
    targetSearchQueries: ['Google Ads cost Italy SMB 2026', 'Google Ads guide Italian small business', 'how much to spend Google Ads Italy', 'Google Ads vs Meta Ads Italy', 'PPC advertising Italy 2026'],
    body: pt(
      `Google Ads remains the highest-intent paid channel available to Italian SMBs in 2026. When a potential customer types "commercial lawyer Milan" or "industrial refrigeration repair Rome", they have an active and immediate need. Google Ads puts your business in front of that person at the exact moment they are looking for what you offer — no other channel does this with equivalent precision.\n\n` +
      `Real cost benchmarks for Italian Google Ads accounts in 2026 by sector: Legal services: €3.50–5.50/click. Financial services: €2.80–4.50/click. Healthcare and aesthetics: €1.80–3.20/click. Construction and renovation: €1.20–2.80/click. B2B services: €1.50–3.50/click. Local retail: €0.80–1.80/click. E-commerce (general): €0.60–2.00/click.\n\n` +
      `The minimum effective budget for Italian SMBs is €1,000–1,500/month. Below this threshold, the algorithm has insufficient conversion data to optimise properly, and you end up paying premium CPCs without the learning-phase advantages of higher-spend accounts. For competitive sectors (legal, financial, insurance), effective minimum budgets are €2,500–4,000/month.\n\n` +
      `The 3 campaign types that actually work for Italian SMBs: (1) Search campaigns — text ads on specific search queries. The most direct, measurable and controllable. Start here. (2) Performance Max — Google's AI-driven full-funnel campaign type that runs across Search, Display, YouTube, Gmail and Maps simultaneously. Works well for accounts with at least 30 conversions per month of historical data. (3) Shopping campaigns — for e-commerce with a product catalogue. Average ROAS for well-optimised Italian Shopping campaigns: 4–8x.\n\n` +
      `The 5 mistakes that burn Google Ads budget without results: (1) Broad match keywords without negatives — attracts irrelevant traffic that costs money without converting. (2) No negative keyword list from day one — generic terms like "free", "reviews", competitor names. (3) Ignoring Quality Score — a low Quality Score (below 5/10) doubles or triples your effective CPC for equivalent position. (4) No proper conversion tracking — if you cannot measure what drives conversions, you cannot optimise. (5) Insufficient budget for meaningful data — €300/month generates 50–100 clicks, which is statistically insufficient to make any optimisation decisions.\n\n` +
      `Average conversion rates for well-configured Italian Search campaigns by sector: Local services (plumber, electrician): 8–15%. Healthcare: 6–12%. B2B services: 3–7%. E-commerce: 2–5%. Legal/financial: 5–10%. If your conversion rate is consistently below 2% on Search, the problem is almost always the landing page, not the ads.`
    ),
  },

  // ── ART 5 IT — Google Ads PMI ─────────────────────────────────────────────
  {
    _id: 'blogPost-google-ads-pmi-guida-2026-it',
    _type: 'blogPost',
    language: 'it',
    isPublished: true,
    slug: { _type: 'slug', current: 'google-ads-guida-pmi-italiane-2026' },
    title: 'Google Ads per PMI Italiane nel 2026: Quanto Spendere e Cosa Aspettarsi',
    excerpt: 'La guida completa a Google Ads per le PMI italiane nel 2026: costi reali, benchmark per settore, i 3 tipi di campagna che funzionano e i 5 errori che bruciano budget senza risultati.',
    publishedAt: '2026-03-25T09:00:00Z',
    readingTime: 11,
    author: authorRef(),
    categories: [catRef('cat-paid-advertising')],
    tags: ['Google Ads', 'PPC', 'SEM', 'PMI', 'Italia', 'Lead Generation', 'ROAS', 'CPC'],
    metaTitle: 'Google Ads per PMI Italiane nel 2026: Costi Reali e Cosa Aspettarsi | Pota Studio',
    metaDescription: 'Guida completa a Google Ads per le PMI italiane nel 2026: costi reali per settore, i 3 tipi di campagna che generano ROI, benchmark e i 5 errori che bruciano budget.',
    primaryKeyword: 'Google Ads PMI italiane 2026',
    secondaryKeywords: ['costo Google Ads Italia 2026', 'PPC pubblicità piccole imprese italiane', 'benchmark Google Ads Italia', 'SEM Italia PMI'],
    tldr: 'Google Ads per PMI italiane nel 2026: budget minimo efficace 1.000–1.500€/mese, CPC medio 0,80–4,50€ a seconda del settore, tasso di conversione medio 3–8% per Search, ROAS break-even tipicamente 3–5x. I 3 tipi di campagna che funzionano: Search (intento), Performance Max (full funnel), Shopping (e-commerce). I 5 errori da evitare: keyword troppo generiche, nessuna lista di keyword negative, ignorare il Quality Score, nessun tracciamento conversioni, budget insufficiente per dati significativi.',
    quickAnswer: 'Google Ads per le PMI italiane costa un minimo di 1.000–1.500€/mese per essere efficace. Il CPC medio va da 0,80€ (servizi locali) a 4,50€ (legale/finanziario). Il tasso di conversione medio per campagne Search ben configurate è del 3–8%. I risultati appaiono tipicamente in 2–4 settimane con una configurazione corretta.',
    targetSearchQueries: ['costo Google Ads PMI Italia 2026', 'guida Google Ads piccole imprese italiane', 'quanto spendere Google Ads Italia', 'Google Ads vs Meta Ads Italia', 'PPC pubblicità Italia 2026'],
    translationOf: translationRef('blogPost-google-ads-smb-guide-2026-en'),
    body: pt(
      `Google Ads rimane il canale paid con la più alta intenzione d\'acquisto disponibile per le PMI italiane nel 2026. Quando un potenziale cliente digita "avvocato commerciale Milano" o "riparazione refrigerazione industriale Roma", ha un bisogno attivo e immediato. Google Ads mette la tua azienda di fronte a quella persona nel momento esatto in cui sta cercando quello che offri — nessun altro canale fa questo con precisione equivalente.\n\n` +
      `Benchmark di costo reali per account Google Ads italiani nel 2026 per settore: Servizi legali: 3,50–5,50€/click. Servizi finanziari: 2,80–4,50€/click. Sanità ed estetica: 1,80–3,20€/click. Costruzioni e ristrutturazioni: 1,20–2,80€/click. Servizi B2B: 1,50–3,50€/click. Retail locale: 0,80–1,80€/click. E-commerce (generale): 0,60–2,00€/click.\n\n` +
      `Il budget minimo efficace per le PMI italiane è 1.000–1.500€/mese. Sotto questa soglia, l\'algoritmo ha dati di conversione insufficienti per ottimizzare correttamente, e si finisce per pagare CPC premium senza i vantaggi della fase di apprendimento degli account con spesa più elevata. Per i settori competitivi (legale, finanziario, assicurativo), i budget minimi efficaci sono 2.500–4.000€/mese.\n\n` +
      `I 3 tipi di campagna che funzionano davvero per le PMI italiane: (1) Campagne Search — annunci di testo su query di ricerca specifiche. Le più dirette, misurabili e controllabili. Inizia da qui. (2) Performance Max — il tipo di campagna full-funnel basato sull\'AI di Google che gira su Search, Display, YouTube, Gmail e Maps contemporaneamente. Funziona bene per account con almeno 30 conversioni mensili di dati storici. (3) Campagne Shopping — per e-commerce con catalogo prodotti. ROAS medio per campagne Shopping italiane ben ottimizzate: 4–8x.\n\n` +
      `I 5 errori che bruciano budget Google Ads senza risultati: (1) Keyword in broad match senza negative — attira traffico irrilevante che costa senza convertire. (2) Nessuna lista di keyword negative fin dal primo giorno — termini generici come "gratis", "recensioni", nomi dei concorrenti. (3) Ignorare il Quality Score — un Quality Score basso (sotto 5/10) raddoppia o triplica il CPC effettivo per una posizione equivalente. (4) Nessun tracciamento conversioni corretto — se non riesci a misurare cosa genera conversioni, non puoi ottimizzare. (5) Budget insufficiente per dati significativi — 300€/mese genera 50–100 click, statisticamente insufficienti per qualsiasi decisione di ottimizzazione.\n\n` +
      `Tassi di conversione medi per campagne Search italiane ben configurate per settore: Servizi locali (idraulico, elettricista): 8–15%. Sanità: 6–12%. Servizi B2B: 3–7%. E-commerce: 2–5%. Legale/finanziario: 5–10%. Se il tuo tasso di conversione è costantemente sotto il 2% su Search, il problema è quasi sempre la landing page, non gli annunci.`
    ),
  },

  // ── ART 6 EN — Marketing Plan SMB ─────────────────────────────────────────
  {
    _id: 'blogPost-marketing-plan-smb-2026-en',
    _type: 'blogPost',
    language: 'en',
    isPublished: true,
    slug: { _type: 'slug', current: 'marketing-plan-italian-smb-2026-template' },
    title: 'Marketing Plan for Italian SMBs in 2026: The Template We Use With Every Client',
    excerpt: 'The exact marketing plan framework Pota Studio uses for every new client, adapted for Italian SMBs with realistic budgets. Includes a 12-month roadmap, channel allocation and KPI structure.',
    publishedAt: '2026-03-25T09:00:00Z',
    readingTime: 13,
    author: authorRef(),
    categories: [catRef('cat-digital-marketing')],
    tags: ['Marketing Plan', 'Digital Strategy', 'SMB', 'Marketing Budget', 'KPI', 'Italy', 'Roadmap'],
    metaTitle: 'Marketing Plan for Italian SMBs in 2026: Template + 12-Month Roadmap | Pota Studio',
    metaDescription: 'The marketing plan framework Pota Studio uses with every Italian SMB client: situation analysis, goal setting, channel allocation, 12-month roadmap and KPI tracking structure.',
    primaryKeyword: 'marketing plan Italian SMB 2026',
    secondaryKeywords: ['digital marketing plan Italy', 'SMB marketing budget 2026', 'marketing strategy Italian small business', 'marketing roadmap template Italy'],
    tldr: 'A complete marketing plan for Italian SMBs in 2026 has 5 components: situation analysis (where you are), goal setting (where you want to go), channel selection (how you get there), 12-month roadmap (when you do what), and KPI tracking (whether it is working). Minimum total marketing budget recommended: 3–5% of revenue.',
    quickAnswer: 'A marketing plan for an Italian SMB in 2026 should cover: situation analysis, SMART goal setting, channel selection based on budget and objectives, 12-month roadmap with quarterly milestones, and weekly/monthly KPI tracking. Minimum recommended marketing budget: 3% of revenue.',
    targetSearchQueries: ['marketing plan Italian SMB 2026', 'how to create marketing plan Italy', 'digital marketing strategy small business Italy', 'marketing budget Italian SMB 2026', 'marketing roadmap template Italy'],
    body: pt(
      `A marketing plan is not a 50-page document that collects dust in a drawer. For an Italian SMB in 2026, it is a one-page operational document that answers 5 questions clearly: where are we now, where do we want to go, how will we get there, when will we do what, and how will we know if it is working.\n\n` +
      `Component 1 — Situation Analysis (the honest assessment): Before setting any goal, document exactly where the business stands. Key metrics to collect: total website visitors (monthly, last 12 months), conversion rate (visitors to leads or customers), customer acquisition cost by channel, average customer lifetime value, current monthly revenue by product/service line, and top 3 sources of new customers in the last 12 months.\n\n` +
      `Component 2 — Goal Setting (SMART, not aspirational): The most common mistake in Italian SMB marketing plans is setting vague goals: "increase brand awareness", "grow sales", "be more visible online". SMART goals for 2026 look like this: "Generate 40 qualified leads per month from Google Ads by June 2026", "Achieve €120,000 monthly revenue from e-commerce by Q4 2026", "Grow Instagram followers from 2,400 to 8,000 by December 2026 with an engagement rate above 3%."\n\n` +
      `Component 3 — Channel Selection (match to budget and objective): The channel selection matrix for Italian SMBs: Budget under €1,500/month: Google Ads Search only (highest intent, most measurable). Budget €1,500–3,000/month: Google Ads + Meta Ads retargeting + SEO content (1 article/week). Budget €3,000–6,000/month: full paid stack (Google + Meta + TikTok or LinkedIn) + SEO + email marketing. Budget above €6,000/month: full stack plus influencer/creator programme and PR.\n\n` +
      `Component 4 — 12-Month Roadmap (quarterly milestones): Q1 (Jan–Mar): infrastructure setup — website conversion optimisation, tracking configuration, email list building, Google Ads Search launch. Q2 (Apr–Jun): paid media expansion — Meta Ads launch, SEO content acceleration, email nurturing sequences. Q3 (Jul–Sep): social commerce and community — TikTok or LinkedIn (based on B2B/B2C), referral programme launch. Q4 (Oct–Dec): retention and loyalty — win-back campaigns, loyalty programme, Black Friday strategy, annual review and 2027 planning.\n\n` +
      `Component 5 — KPI Tracking (weekly + monthly): Weekly KPIs (check every Monday): ad spend vs budget, leads generated vs target, ROAS vs target, email open rate. Monthly KPIs (review on first Wednesday of month): Customer Acquisition Cost by channel, Customer Lifetime Value trend, organic traffic growth, conversion rate by source, revenue by channel.\n\n` +
      `Recommended total marketing budget for Italian SMBs in 2026: minimum 3% of revenue for maintenance, 5% for growth, 8–10% for aggressive expansion. For businesses under €300,000 annual revenue, allocate at least €800–1,200/month to see meaningful results from digital marketing.`
    ),
  },

  // ── ART 6 IT — Piano Marketing PMI ───────────────────────────────────────
  {
    _id: 'blogPost-piano-marketing-pmi-2026-it',
    _type: 'blogPost',
    language: 'it',
    isPublished: true,
    slug: { _type: 'slug', current: 'piano-marketing-pmi-italiane-2026-template' },
    title: 'Piano Marketing per PMI Italiane nel 2026: il Template che Usiamo con Ogni Cliente',
    excerpt: 'Il framework di piano marketing che Pota Studio usa con ogni nuovo cliente, adattato per le PMI italiane con budget realistici. Include una roadmap a 12 mesi, allocazione dei canali e struttura KPI.',
    publishedAt: '2026-03-25T09:00:00Z',
    readingTime: 13,
    author: authorRef(),
    categories: [catRef('cat-marketing-digitale')],
    tags: ['Piano Marketing', 'Strategia Digitale', 'PMI', 'Budget Marketing', 'KPI', 'Italia', 'Roadmap'],
    metaTitle: 'Piano Marketing per PMI Italiane nel 2026: Template + Roadmap 12 Mesi | Pota Studio',
    metaDescription: 'Il framework di piano marketing che Pota Studio usa con ogni cliente PMI italiano: analisi della situazione, definizione obiettivi, allocazione canali, roadmap 12 mesi e struttura KPI.',
    primaryKeyword: 'piano marketing PMI italiane 2026',
    secondaryKeywords: ['piano marketing digitale Italia', 'budget marketing PMI 2026', 'strategia marketing piccole imprese italiane', 'template roadmap marketing Italia'],
    tldr: 'Un piano marketing completo per le PMI italiane nel 2026 ha 5 componenti: analisi della situazione (dove sei), definizione obiettivi (dove vuoi arrivare), selezione canali (come ci arrivi), roadmap 12 mesi (quando fai cosa), e tracciamento KPI (se sta funzionando). Budget marketing minimo consigliato: 3–5% del fatturato.',
    quickAnswer: 'Un piano marketing per una PMI italiana nel 2026 deve coprire: analisi della situazione, definizione obiettivi SMART, selezione canali in base a budget e obiettivi, roadmap 12 mesi con milestone trimestrali, e tracciamento KPI settimanale/mensile. Budget marketing minimo consigliato: 3% del fatturato.',
    targetSearchQueries: ['piano marketing PMI italiane 2026', 'come creare piano marketing Italia', 'strategia marketing digitale piccole imprese Italia', 'budget marketing PMI italiane 2026', 'template roadmap marketing Italia'],
    translationOf: translationRef('blogPost-marketing-plan-smb-2026-en'),
    body: pt(
      `Un piano marketing non è un documento di 50 pagine che prende polvere in un cassetto. Per una PMI italiana nel 2026, è un documento operativo di una pagina che risponde chiaramente a 5 domande: dove siamo ora, dove vogliamo arrivare, come ci arriviamo, quando facciamo cosa, e come sapremo se sta funzionando.\n\n` +
      `Componente 1 — Analisi della Situazione (la valutazione onesta): Prima di fissare qualsiasi obiettivo, documenta esattamente dove si trova l\'azienda. Metriche chiave da raccogliere: visitatori totali del sito web (mensili, ultimi 12 mesi), tasso di conversione (visitatori in lead o clienti), costo di acquisizione cliente per canale, lifetime value medio del cliente, fatturato mensile attuale per linea di prodotto/servizio, e top 3 fonti di nuovi clienti negli ultimi 12 mesi.\n\n` +
      `Componente 2 — Definizione Obiettivi (SMART, non aspirazionali): L\'errore più comune nei piani marketing delle PMI italiane è fissare obiettivi vaghi: "aumentare la brand awareness", "crescere le vendite", "essere più visibili online". Obiettivi SMART per il 2026 si presentano così: "Generare 40 lead qualificati al mese da Google Ads entro giugno 2026", "Raggiungere 120.000€ di fatturato mensile da e-commerce entro Q4 2026", "Crescere i follower Instagram da 2.400 a 8.000 entro dicembre 2026 con un tasso di engagement superiore al 3%."\n\n` +
      `Componente 3 — Selezione Canali (in base a budget e obiettivo): La matrice di selezione canali per PMI italiane: Budget sotto 1.500€/mese: solo Google Ads Search (intenzione più alta, più misurabile). Budget 1.500–3.000€/mese: Google Ads + retargeting Meta Ads + contenuti SEO (1 articolo/settimana). Budget 3.000–6.000€/mese: stack paid completo (Google + Meta + TikTok o LinkedIn) + SEO + email marketing. Budget superiore a 6.000€/mese: stack completo più programma influencer/creator e PR.\n\n` +
      `Componente 4 — Roadmap 12 Mesi (milestone trimestrali): Q1 (Gen–Mar): setup infrastruttura — ottimizzazione conversioni sito web, configurazione tracking, costruzione lista email, lancio Google Ads Search. Q2 (Apr–Giu): espansione paid media — lancio Meta Ads, accelerazione contenuti SEO, sequenze email nurturing. Q3 (Lug–Set): social commerce e community — TikTok o LinkedIn (B2B/B2C), lancio programma referral. Q4 (Ott–Dic): retention e loyalty — campagne win-back, programma fedeltà, strategia Black Friday, review annuale e pianificazione 2027.\n\n` +
      `Componente 5 — Tracciamento KPI (settimanale + mensile): KPI settimanali (controlla ogni lunedì): spesa ads vs budget, lead generati vs target, ROAS vs target, open rate email. KPI mensili (revisione il primo mercoledì del mese): Customer Acquisition Cost per canale, trend Customer Lifetime Value, crescita traffico organico, tasso di conversione per fonte, fatturato per canale.\n\n` +
      `Budget marketing totale consigliato per le PMI italiane nel 2026: minimo 3% del fatturato per il mantenimento, 5% per la crescita, 8–10% per l\'espansione aggressiva. Per le aziende con meno di 300.000€ di fatturato annuo, allocare almeno 800–1.200€/mese per ottenere risultati significativi dal marketing digitale.`
    ),
  },
]

// ─── handler ──────────────────────────────────────────────────────────────────

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  if (searchParams.get('secret') !== SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.SANITY_API_TOKEN) {
    return NextResponse.json(
      { error: 'SANITY_API_TOKEN is not set on the server. Add it in Project Settings → Environment Variables.' },
      { status: 500 },
    )
  }

  const shouldPurge = searchParams.get('purge') === '1' || searchParams.get('purge') === 'true'

  let deleted = 0
  if (shouldPurge) {
    try {
      const ids = await client.fetch<string[]>(
        `*[_type in ["blogAuthor","blogCategory","blogPost"]]._id`,
      )
      if (ids.length > 0) {
        const tx = client.transaction()
        // Delete drafts first (they block deletion of referenced docs)
        for (const id of ids) tx.delete(`drafts.${id}`)
        for (const id of ids) tx.delete(id)
        await tx.commit({ visibility: 'sync' })
        deleted = ids.length
      }
    } catch (err: unknown) {
      return NextResponse.json(
        { error: `Purge failed: ${err instanceof Error ? err.message : String(err)}` },
        { status: 500 },
      )
    }
  }

  const results: Record<string, string> = {}
  const errors: Record<string, string> = {}

  for (const doc of DOCS) {
    try {
      await client.createOrReplace(doc)
      results[doc._id] = 'ok'
    } catch (err: unknown) {
      errors[doc._id] = err instanceof Error ? err.message : String(err)
    }
  }

  const seeded = Object.keys(results).length
  const failed = Object.keys(errors).length
  const success = failed === 0

  const payload: Record<string, unknown> = {
    success,
    seeded,
    failed,
    deleted,
    results,
    errors,
    message: `Seeded ${seeded} docs${shouldPurge ? `, purged ${deleted}` : ''}${failed > 0 ? ` with ${failed} errors` : ''}.`,
  }

  if (searchParams.get('verify') === '1') {
    const counts = await client.fetch<{ authors: number; categories: number; posts: number }>(
      `{
        "authors":    count(*[_type == "blogAuthor"]),
        "categories": count(*[_type == "blogCategory"]),
        "posts":      count(*[_type == "blogPost"])
      }`,
    )
    payload.verify = counts
  }

  return NextResponse.json(payload)
}
