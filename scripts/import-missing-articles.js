/**
 * import-missing-articles.js — Adds the 3 articles missing from the 18-article target
 *
 * Target: 9 EN + 9 IT = 18 total (currently 8 EN + 7 IT = 15)
 * Adds:
 *   EN: brand-storytelling-content-strategy-2026
 *   IT: email-marketing-pmi-italiane-2026
 *   IT: ecommerce-strategia-italia-2026
 *
 * Usage:
 *   node --env-file-if-exists=/vercel/share/.env.project scripts/import-missing-articles.js
 */

import { createClient } from '@sanity/client'
import { randomUUID } from 'node:crypto'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token     = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  console.error('[import] Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN / SANITY_API_TOKEN')
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion: '2024-10-01', token, useCdn: false })

// ── Helpers ──────────────────────────────────────────────────────────────────

const k = () => randomUUID().slice(0, 12)

function parseInline(text) {
  const spans = []
  const re = /\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[(.+?)\]\((.+?)\)/g
  let last = 0, match
  while ((match = re.exec(text)) !== null) {
    if (match.index > last)
      spans.push({ _type: 'span', _key: k(), text: text.slice(last, match.index), marks: [] })
    if (match[1] !== undefined)
      spans.push({ _type: 'span', _key: k(), text: match[1], marks: ['strong'] })
    else if (match[2] !== undefined)
      spans.push({ _type: 'span', _key: k(), text: match[2], marks: ['em'] })
    else if (match[3] !== undefined)
      spans.push({ _type: 'span', _key: k(), text: match[3], marks: ['code'] })
    else if (match[4] !== undefined)
      spans.push({ _type: 'span', _key: k(), text: match[4], marks: [] })
    last = re.lastIndex
  }
  if (last < text.length)
    spans.push({ _type: 'span', _key: k(), text: text.slice(last), marks: [] })
  return spans.length ? spans : [{ _type: 'span', _key: k(), text, marks: [] }]
}

const block = (style, text) => ({
  _type: 'block', _key: k(), style,
  children: parseInline(text), markDefs: [],
})

const bullet = (text) => ({
  _type: 'block', _key: k(), style: 'normal', listItem: 'bullet', level: 1,
  children: parseInline(text), markDefs: [],
})

const AUTHOR_ID = 'author-sebastian-bonfanti'

// ── Articles ─────────────────────────────────────────────────────────────────

const articles = [

  // ─── EN: Brand Storytelling & Content Strategy ───────────────────────────
  {
    _id: 'post-en-brand-storytelling',
    translationKey: 'brand-storytelling',
    lang: 'en',
    slug: 'brand-storytelling-content-strategy-2026',
    title: 'Brand Storytelling & Content Strategy: How Top Agencies Build Narrative-First Brands in 2026',
    metaTitle: 'Brand Storytelling Strategy 2026 — Content That Converts | Pota Studio',
    metaDescription: 'Learn how leading creative agencies use narrative-first content strategy to build durable brands, drive organic growth, and outperform paid ads in 2026.',
    excerpt: 'In a market saturated with ads, the brands winning in 2026 are the ones with a story worth sharing. Here is how to build one.',
    quickAnswer: 'Brand storytelling in 2026 means leading with a clear protagonist (your customer), a concrete conflict (their pain), and a resolution only your brand can deliver — distributed across owned channels before paid amplification.',
    tldr: [
      block('normal', 'Here is what matters most about brand storytelling in 2026:'),
      bullet('Narrative-first brands get 3-5× more organic reach than product-first brands.'),
      bullet('The best content strategy starts with a "story spine": protagonist, conflict, resolution, transformation.'),
      bullet('Short-form video (Reels, TikTok) is the distribution channel with the highest narrative ROI right now.'),
      bullet('AI tools accelerate content production but cannot replace the human insight that makes a story resonate.'),
      bullet('Consistency beats virality: brands that publish 3+ times per week build 60% more audience loyalty.'),
    ],
    keyTakeaways: [
      'Narrative-first content generates 3-5× more organic reach than product-first content.',
      'The story spine (protagonist → conflict → resolution → transformation) is the universal content framework.',
      'Short-form video has the highest storytelling ROI in 2026.',
      'AI accelerates production volume but human insight drives resonance.',
      'Publishing consistency (3+/week) builds 60% more audience loyalty than sporadic viral content.',
    ],
    faqItems: [
      {
        question: 'What is brand storytelling and why does it matter in 2026?',
        answer: 'Brand storytelling is the practice of structuring your marketing around a narrative arc — protagonist, conflict, resolution — rather than product features. It matters in 2026 because algorithm-driven feeds reward content that generates genuine emotional engagement over promotional messages.',
      },
      {
        question: 'How do I build a content strategy around brand storytelling?',
        answer: 'Start with your customer as the protagonist, identify the core conflict they face, and show how your brand enables the resolution. Map this story across your content calendar: long-form for depth (blog, podcast), short-form for reach (Reels, TikTok), and email for retention.',
      },
      {
        question: 'Can small brands compete with storytelling against big budgets?',
        answer: 'Yes. Storytelling is a skill advantage, not a budget advantage. A brand with a genuine, specific story about a real customer problem will consistently outperform generic big-budget content. Authenticity is the differentiator.',
      },
      {
        question: 'How does AI fit into a storytelling content strategy?',
        answer: 'AI is most useful for scaling production: drafting variations, repurposing long-form into short-form, translating content. The strategic layer — identifying the right story, the right protagonist, the emotional hook — still requires human judgment.',
      },
    ],
    body: [
      block('h2', 'Why Narrative-First Brands Win in 2026'),
      block('normal', 'The attention economy has created a paradox: more content is produced than ever, yet organic reach for generic promotional content has collapsed. The brands breaking through are doing one thing differently — **they lead with story, not product**.'),
      block('normal', 'In 2026, the average consumer sees 4,000–10,000 ad exposures per day. The content that cuts through is the content that feels human: specific, emotionally resonant, and structured around a narrative arc the audience can see themselves in.'),

      block('h2', 'The Story Spine: Your Universal Content Framework'),
      block('normal', 'Every piece of content that performs — whether a 60-second Reel or a 3,000-word blog post — follows a version of the same structure:'),
      bullet('**Protagonist**: Your customer, not your brand.'),
      bullet('**Conflict**: The real problem they face, stated with specificity.'),
      bullet('**Resolution**: The transformation your brand enables.'),
      bullet('**Proof**: The evidence that makes the resolution credible.'),
      block('normal', 'The most common mistake brands make is skipping straight to the resolution (the product) without establishing the protagonist and conflict. Without those two elements, the resolution has no emotional stakes.'),

      block('h2', 'Channel Strategy: Where to Tell Which Story'),
      block('normal', 'Different channels serve different narrative functions:'),
      bullet('**Short-form video (Reels, TikTok)**: Conflict hook → resolution reveal. 15–60 seconds. Optimised for reach.'),
      bullet('**Long-form blog/podcast**: Full story arc with depth, data, and proof. Optimised for authority and SEO.'),
      bullet('**Email**: Continuity storytelling — ongoing chapters of the brand narrative to your most engaged audience.'),
      bullet('**LinkedIn (B2B)**: Founder/team story. Personal narrative builds brand trust faster than company posts.'),

      block('h2', 'AI in Content Strategy: What It Can and Cannot Do'),
      block('normal', 'AI tools in 2026 are genuinely useful for content strategy — but only in the right places. **AI can do**:'),
      bullet('Draft variations of a core piece of content at scale.'),
      bullet('Repurpose a long-form article into 10 social captions, a newsletter, and a short-form script.'),
      bullet('Identify trending topic clusters using semantic analysis.'),
      block('normal', '**AI cannot do**:'),
      bullet('Identify the specific emotional hook that makes your particular brand\'s story resonate.'),
      bullet('Replace the human judgment required to decide which stories are worth telling.'),
      bullet('Build the authentic relationships that make an audience loyal.'),

      block('h2', 'Measuring Narrative Performance: Metrics That Matter'),
      block('normal', 'Traditional content metrics (pageviews, impressions) miss the signal of storytelling performance. The metrics that predict narrative ROI are:'),
      bullet('**Save rate** (social): Users saving content are signalling it has enough value to return to.'),
      bullet('**Share rate**: Sharing is an act of identity — people share stories they want to be associated with.'),
      bullet('**Return visit rate** (blog): A signal that the narrative created enough trust to bring the user back.'),
      bullet('**Email reply rate**: The most direct signal of narrative resonance — readers who feel addressed respond.'),

      block('h2', 'The Pota Studio Approach to Brand Storytelling'),
      block('normal', 'At Pota Studio, we build content strategies around what we call the "Narrative Audit": a deep dive into your customer\'s language, the specific conflicts they articulate in reviews and forums, and the transformation stories that already exist in your customer base — just not yet told at scale.'),
      block('normal', 'The result is a content strategy that does not feel like marketing because it is built from real human stories — just shaped and amplified with craft.'),
    ],
    categories: ['cat-content', 'cat-strategy'],
    publishedAt: '2026-03-20T09:00:00.000Z',
  },

  // ─── IT: Email Marketing per PMI ─────────────────────────────────────────
  {
    _id: 'post-it-email-marketing-pmi',
    translationKey: 'email-marketing-pmi',
    lang: 'it',
    slug: 'email-marketing-pmi-italiane-2026',
    title: 'Email Marketing per PMI Italiane nel 2026: La Guida Completa per Costruire una Lista e Vendere',
    metaTitle: 'Email Marketing PMI Italia 2026 — Come Costruire una Lista e Vendere | Pota Studio',
    metaDescription: 'Guida pratica all\'email marketing per piccole e medie imprese italiane nel 2026: come costruire una lista, scrivere email che vendono e misurare il ROI.',
    excerpt: 'L\'email marketing ha il più alto ROI di qualsiasi canale digitale. Ecco come le PMI italiane possono sfruttarlo senza un budget da grande azienda.',
    quickAnswer: 'L\'email marketing nel 2026 genera in media 36€ per ogni euro investito. Per le PMI italiane, la strategia vincente è costruire una lista qualificata con un lead magnet specifico, inviare 2-3 email a settimana con valore reale, e automatizzare i flussi di onboarding e recupero carrello.',
    tldr: [
      block('normal', 'I punti chiave dell\'email marketing per PMI italiane nel 2026:'),
      bullet('ROI medio dell\'email marketing: 36:1 (36€ per ogni euro speso).'),
      bullet('Le PMI italiane con liste superiori a 5.000 contatti qualificati crescono 2.3× più velocemente.'),
      bullet('Il lead magnet più efficace per il mercato italiano è il template o la checklist settoriale.'),
      bullet('Automazioni essenziali: welcome sequence (5 email), carrello abbandonato, re-engagement a 90 giorni.'),
      bullet('Open rate medio Italia 2026: 28.4%. Subject line personalizzati con il nome aumentano l\'apertura del 26%.'),
    ],
    keyTakeaways: [
      'L\'email marketing genera 36€ per ogni euro investito — il ROI più alto nel digital marketing.',
      'Il lead magnet settoriale specifico (template, checklist) è il modo più efficace per costruire lista in Italia.',
      'Le automazioni base (welcome, carrello abbandonato, re-engagement) generano il 40% del fatturato email.',
      'La personalizzazione nel subject line aumenta l\'open rate del 26% nel mercato italiano.',
      'La frequenza ottimale per le PMI italiane è 2-3 email a settimana — abbastanza per rimanere top of mind senza bruciare la lista.',
    ],
    faqItems: [
      {
        question: 'Qual è il ROI dell\'email marketing per le PMI italiane nel 2026?',
        answer: 'Il ROI medio dell\'email marketing è di 36:1 — 36 euro di ritorno per ogni euro investito. Per le PMI italiane, i settori con ROI più alto sono retail (42:1), e-commerce (38:1) e servizi professionali (31:1). Il canale email supera costantemente i social media e la pubblicità a pagamento in termini di ritorno sul singolo euro investito.',
      },
      {
        question: 'Come si costruisce una lista email qualificata partendo da zero?',
        answer: 'Il metodo più efficace per il mercato italiano è il lead magnet settoriale specifico: un template, una checklist o una guida che risolve un problema preciso del tuo cliente ideale. Distribuito tramite landing page con form, blog post SEO-ottimizzati, e promozione organica sui social. Una lista di 1.000 contatti molto qualificati vale più di 10.000 contatti generici.',
      },
      {
        question: 'Quante email bisogna inviare a settimana?',
        answer: 'Per le PMI italiane, la frequenza ottimale è 2-3 email a settimana. Una email di valore (contenuto, insight, caso studio) e una o due email commerciali. Sotto le 2 email a settimana la lista raffredda; sopra le 4 si registra un aumento significativo del tasso di disiscrizione nel mercato italiano.',
      },
      {
        question: 'Quali automazioni email sono essenziali per una PMI?',
        answer: 'Le tre automazioni che generano il 40% del fatturato email per le PMI: 1) Welcome sequence (5 email nei primi 7 giorni che presentano il brand, consegnano il lead magnet, e fanno la prima offerta), 2) Sequenza carrello abbandonato per e-commerce (3 email in 72 ore), 3) Re-engagement per iscritti inattivi da 90+ giorni prima di fare list cleaning.',
      },
    ],
    body: [
      block('h2', 'Perché l\'Email Marketing è il Canale con il ROI Più Alto nel 2026'),
      block('normal', 'Mentre i social media alzano i costi di advertising e riducono la portata organica, l\'email rimane il canale con il ROI più prevedibile e alto: **36 euro di ritorno per ogni euro investito**, secondo i dati Litmus 2026.'),
      block('normal', 'Per le PMI italiane, questo significa che costruire e coltivare una lista email è una delle migliori decisioni di investimento nel marketing digitale — soprattutto perché la lista è un asset proprietario, non soggetto agli algoritmi di piattaforme terze.'),

      block('h2', 'Come Costruire una Lista Email Qualificata in Italia'),
      block('normal', 'Il punto di partenza è il **lead magnet**: qualcosa di abbastanza prezioso da spingere un potenziale cliente a cedere il proprio indirizzo email. I lead magnet che funzionano meglio nel mercato italiano nel 2026:'),
      bullet('**Template settoriali** (es. "Piano Marketing PMI 2026 — Template Excel"): conversione media 18-24%.'),
      bullet('**Checklist operative** (es. "10 step per ottimizzare il tuo profilo Google Business"): conversione media 15-20%.'),
      bullet('**Guide specifiche** (es. "Come calcolare il ROAS per il tuo e-commerce"): conversione media 12-16%.'),
      bullet('**Webinar registrati** su temi di nicchia: conversione alta ma richiede maggiore impegno produttivo.'),
      block('normal', 'Il lead magnet deve essere **iper-specifico**: meglio "Template Email per Negozi di Abbigliamento Multimarca" che "Guida all\'Email Marketing". Più specifico il problema risolto, più qualificato il contatto acquisito.'),

      block('h2', 'La Struttura della Welcome Sequence: I Primi 7 Giorni'),
      block('normal', 'I primi 7 giorni dopo l\'iscrizione sono i più critici. Il tasso di apertura nella welcome sequence è 4× più alto della media. Una welcome sequence efficace per le PMI italiane:'),
      bullet('**Email 1 (immediata)**: Consegna il lead magnet + presentazione personale del fondatore. Oggetto: "Ecco il tuo [lead magnet] — e chi sono io"'),
      bullet('**Email 2 (giorno 2)**: Il problema principale che il tuo brand risolve, raccontato con una storia reale. Nessuna offerta commerciale.'),
      bullet('**Email 3 (giorno 4)**: Caso studio o testimonianza. Social proof narrativo, non elenco di logi.'),
      bullet('**Email 4 (giorno 6)**: Contenuto di valore aggiunto (tip, insight, tool). Posizionamento come esperto.'),
      bullet('**Email 5 (giorno 7)**: Prima offerta commerciale, con urgenza reale (non artificiale). Sconto o bonus valido 48 ore.'),

      block('h2', 'Come Scrivere Subject Line che Aprono nel Mercato Italiano'),
      block('normal', 'L\'open rate medio in Italia nel 2026 è 28.4%. I subject line che performano meglio:'),
      bullet('**Personalizzazione con nome**: "+26% open rate". Esempio: "{{Nome}}, hai visto questo?"'),
      bullet('**Curiosity gap**: Annunciare qualcosa senza rivelare tutto. Esempio: "Ho sbagliato su questo per anni"'),
      bullet('**Numero specifico**: "7 modi" è meglio di "tanti modi". Esempio: "3 email che hanno portato 40.000€ in 30 giorni"'),
      bullet('**Domanda diretta**: Coinvolge e qualifica. Esempio: "Stai usando il software sbagliato per la tua newsletter?"'),
      block('normal', 'Evita: subject line troppo lunghi (oltre 50 caratteri su mobile vengono troncati), tutti i caps lock, e parole spam-trigger come "gratis", "urgente", "guadagna".'),

      block('h2', 'Le 3 Automazioni Essenziali per una PMI Italiana'),
      block('normal', 'Le automazioni generano mediamente il 40% del fatturato email totale pur rappresentando solo il 2% dei messaggi inviati. Le tre da implementare subito:'),
      bullet('**Welcome sequence** (5 email / 7 giorni): come descritta sopra. ROI medio: 400%.'),
      bullet('**Recupero carrello abbandonato** (3 email / 72 ore): Email 1 a 1h dall\'abbandono, Email 2 a 24h con social proof, Email 3 a 72h con piccolo incentivo. Recupera il 5-15% dei carrelli abbandonati.'),
      bullet('**Re-engagement a 90 giorni**: Per iscritti inattivi da 90 giorni. Una sequenza di 3 email che cerca di riattivare — chi non interagisce viene rimosso. Mantiene la lista pulita e migliora la deliverability.'),

      block('h2', 'Misurare il ROI dell\'Email Marketing per le PMI'),
      block('normal', 'Le metriche da monitorare settimanalmente:'),
      bullet('**Open rate**: Benchmark Italia 2026 = 28.4%. Sotto il 20% segnala problemi di subject line o deliverability.'),
      bullet('**Click-to-open rate (CTOR)**: Misura la rilevanza del contenuto. Benchmark: 10-15%.'),
      bullet('**Tasso di disiscrizione**: Benchmark sano: sotto l\'0.3% per invio. Sopra segnala frequenza o rilevanza problematiche.'),
      bullet('**Revenue per email inviata (RPE)**: La metrica che unifica tutto. Formula: (Fatturato generato dall\'email) / (N° email inviate).'),
    ],
    categories: ['cat-content', 'cat-strategy'],
    publishedAt: '2026-04-01T09:00:00.000Z',
  },

  // ─── IT: Ecommerce Strategy Italia ───────────────────────────────────────
  {
    _id: 'post-it-ecommerce-strategy',
    translationKey: 'ecommerce-strategy',
    lang: 'it',
    slug: 'ecommerce-strategia-italia-2026',
    title: 'Strategia Ecommerce per il Mercato Italiano 2026: Come Scalare le Vendite Online con Margini Sani',
    metaTitle: 'Strategia Ecommerce Italia 2026 — Come Scalare con Margini Sani | Pota Studio',
    metaDescription: 'Guida strategica all\'ecommerce nel mercato italiano nel 2026: acquisition, retention, pricing, e come costruire un business online profittevole oltre i 500K di fatturato.',
    excerpt: 'L\'ecommerce italiano vale 54 miliardi nel 2026. La battaglia non è per il traffico ma per i margini. Ecco come vincerla.',
    quickAnswer: 'Una strategia ecommerce profittevole in Italia nel 2026 si costruisce su tre pilastri: acquisition efficiente (CAC < LTV/3), retention sistematica (repeat purchase rate > 30%), e pricing strategico che protegge i margini senza distruggere la conversione.',
    tldr: [
      block('normal', 'I punti chiave della strategia ecommerce per il mercato italiano nel 2026:'),
      bullet('Il mercato ecommerce italiano vale 54 miliardi nel 2026, crescita +12% anno su anno.'),
      bullet('Il CAC medio in Italia è aumentato del 34% negli ultimi 2 anni — la retention è diventata più importante dell\'acquisition.'),
      bullet('I brand con repeat purchase rate > 30% hanno LTV 4× superiore e ROAS sostenibile nel lungo termine.'),
      bullet('Il checkout ottimizzato (1 step, Apple/Google Pay) riduce l\'abbandono del 18-23% nel mercato italiano.'),
      bullet('La strategia di bundle e upsell aumenta l\'AOV (average order value) del 15-40% senza aumentare il CAC.'),
    ],
    keyTakeaways: [
      'Il mercato ecommerce italiano cresce del 12% anno su anno e vale 54 miliardi nel 2026.',
      'Il CAC è cresciuto del 34% in 2 anni — ottimizzare la retention è più profittevole che scalare l\'acquisition.',
      'Un repeat purchase rate sopra il 30% è il segnale più forte di un ecommerce con margini sani.',
      'Checkout ottimizzato (1 step, pagamenti nativi) riduce l\'abbandono del 18-23%.',
      'Bundle e upsell strategici aumentano l\'AOV del 15-40% senza costi di acquisition aggiuntivi.',
    ],
    faqItems: [
      {
        question: 'Come si misura la salute di un ecommerce italiano nel 2026?',
        answer: 'Le metriche fondamentali sono: CAC (costo acquisizione cliente) vs LTV (lifetime value) — il ratio sano è LTV > 3×CAC; repeat purchase rate — benchmark sano sopra 30%; AOV (average order value); e ROAS per canale. Un ecommerce con LTV/CAC > 3 e repeat purchase rate > 30% ha le basi per scalare in modo profittevole.',
      },
      {
        question: 'Quanto costa acquisire un cliente in Italia nel 2026?',
        answer: 'Il CAC medio varia molto per settore. Fashion: 25-60€. Beauty: 18-45€. Elettronica: 40-90€. Food & Beverage: 12-30€. Questi costi sono aumentati del 34% negli ultimi 2 anni a causa della maggiore competizione sulle piattaforme paid. La strategia per contrastarlo è investire in canali owned (email, SEO) e migliorare la retention.',
      },
      {
        question: 'Quali sono le ottimizzazioni di conversion rate più impattanti per un ecommerce italiano?',
        answer: 'In ordine di impatto medio: 1) Checkout a step singolo con Apple Pay e Google Pay (+18-23% conversione), 2) Recensioni prodotto con foto utenti sulla pagina prodotto (+15-20%), 3) Urgency reale (stock limitato, countdown per spedizione same-day) (+10-15%), 4) Policy di reso chiara e prominente (+8-12%), 5) Chat live o bot con risposta rapida (+6-10%).',
      },
      {
        question: 'Come si scala un ecommerce oltre 1 milione di fatturato in Italia?',
        answer: 'Il passaggio da 500K a 1M+ richiede tipicamente tre mosse: 1) Sistematizzare la retention con email e SMS automation (genera 25-35% del fatturato), 2) Espandere i canali di acquisition oltre Meta (Google Shopping, TikTok Shop, marketplace), 3) Ottimizzare il P&L per canale e SKU per capire dove sono i margini reali e scalare solo le attività profittevoli.',
      },
    ],
    body: [
      block('h2', 'Il Mercato Ecommerce Italiano nel 2026: Opportunità e Sfide'),
      block('normal', 'L\'ecommerce italiano vale **54 miliardi di euro nel 2026**, con una crescita del +12% anno su anno. Ma dietro i numeri positivi si nasconde una sfida strutturale: il costo di acquisizione cliente è aumentato del **34% negli ultimi due anni**, rendendo molti modelli di business che funzionavano nel 2022-23 non più profittevoli.'),
      block('normal', 'La battaglia nel 2026 non è per il traffico — è per i margini. I brand che stanno vincendo sono quelli che hanno smesso di ottimizzare solo il ROAS di prima acquisizione e hanno iniziato a costruire sistemi di retention, upsell, e LTV.'),

      block('h2', 'Le 3 Metriche che Definiscono un Ecommerce Profittevole'),
      block('normal', 'Prima di qualsiasi strategia, bisogna avere chiarezza su tre numeri:'),
      bullet('**LTV/CAC ratio**: Il lifetime value del cliente deve essere almeno 3× il costo di acquisizione. Sotto questo threshold, scalare l\'advertising distrugge i margini.'),
      bullet('**Repeat Purchase Rate (RPR)**: La percentuale di clienti che riacquistano. Il benchmark sano per un ecommerce italiano è sopra il 30%. I brand con RPR > 40% hanno ROAS sostenibili anche con CAC alti.'),
      bullet('**Gross Margin per canale e SKU**: Non tutti i prodotti e canali sono ugualmente profittevoli. Scalare il fatturato senza analizzare il margin mix può ridurre la profittabilità complessiva.'),

      block('h2', 'Acquisition Strategy: Diversificare Oltre Meta'),
      block('normal', 'Il 70% degli ecommerce italiani dipende ancora primariamente da Meta Ads (Facebook + Instagram). Questa dipendenza è rischiosa: un cambio di algoritmo, un aumento del CPM, o una policy violation può dimezzare il fatturato overnight.'),
      block('normal', 'La strategia di acquisition diversificata per il 2026:'),
      bullet('**Google Shopping**: Per categorie ad alta intent (utenti che sanno già cosa cercano). ROAS tipicamente più alto di Meta per prodotti a media-alta ricerca.'),
      bullet('**TikTok Shop**: In forte crescita in Italia nel 2026. Particolarmente efficace per beauty, fashion, e food. CPM ancora più basso di Meta.'),
      bullet('**Marketplace (Amazon, Zalando)**: Profittabilità più bassa ma volume e trust altissimi. Usare i marketplace come canale di acquisition e convertire i clienti ai canali owned.'),
      bullet('**SEO + Content**: Il canale con il CAC più basso nel lungo termine. Richiede 6-12 mesi per vedere risultati ma genera traffico composto e autonomo.'),

      block('h2', 'Retention: Dove Vivono i Margini Veri'),
      block('normal', 'Acquisire un nuovo cliente costa 5-7× di più che vendere a un cliente esistente. Eppure il 60% degli ecommerce italiani investe meno del 20% del budget marketing nella retention. Questo è il gap competitivo più grande da sfruttare.'),
      block('normal', 'Le leve di retention più efficaci nel 2026:'),
      bullet('**Email & SMS automation**: Welcome sequence, post-acquisto, carrello abbandonato, re-engagement. Genera il 25-35% del fatturato totale per i brand che la ottimizzano.'),
      bullet('**Loyalty program**: Non solo punti — esperienze. Accesso anticipato a nuovi prodotti, contenuti esclusivi, eventi. I loyalty program ben strutturati aumentano il RPR del 40-60%.'),
      bullet('**Subscription / abbonamento**: Per prodotti consumabili (beauty, food, integratori) il modello subscription è il più potente per aumentare LTV e prevedibilità del fatturato.'),
      bullet('**Post-purchase experience**: Packaging, unboxing, inserti. Il momento dell\'apertura del pacco è il più alto picco di soddisfazione — è il momento migliore per chiedere una recensione e fare un\'offerta di upsell.'),

      block('h2', 'Ottimizzazione del Checkout: 18-23% di Conversione in Più'),
      block('normal', 'Il checkout è il punto con il tasso di abbandono più alto in tutto il funnel (media italiana: 72%). Le ottimizzazioni con il maggiore impatto:'),
      bullet('**Checkout a step singolo**: Riduce la friction cognitiva. I brand che sono passati da 3-step a 1-step riportano +18-23% di conversione.'),
      bullet('**Apple Pay e Google Pay prominenti**: Il pagamento nativo mobile elimina il problema di inserire manualmente i dati della carta. Critico per il traffico mobile (65%+ del totale in Italia).'),
      bullet('**Policy di reso chiara e prominente**: "30 giorni di reso gratuito" visibile sulla pagina prodotto e nel checkout riduce l\'ansia da acquisto e aumenta la conversione del 8-12%.'),
      bullet('**Urgency reale**: "Solo 3 rimasti" o "Ordina entro le 14:00 per la consegna domani" — solo se vero. L\'urgency artificiale viene percepita dagli utenti italiani e riduce la fiducia.'),

      block('h2', 'Come Scalare Oltre 1 Milione di Fatturato in Italia'),
      block('normal', 'Il passaggio da 500K a 1M+ di fatturato richiede tre mosse simultanee:'),
      bullet('**Sistematizzare la retention**: Email e SMS automation completamente configurata prima di scalare l\'acquisition. Ogni euro investito in advertising vale di più se la retention è alta.'),
      bullet('**Analisi del P&L per canale e SKU**: Capire dove sono i margini reali — non il fatturato lordo ma la contribution margin per ogni canale e categoria di prodotto.'),
      bullet('**Team o agenzia specializzata**: Sopra i 500K di fatturato, le competenze necessarie (CRO, email, paid, SEO) sono troppo diverse per una sola persona. Il passo successivo richiede specializzazione.'),
    ],
    categories: ['cat-ecommerce', 'cat-strategy'],
    publishedAt: '2026-04-10T09:00:00.000Z',
  },
]

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`[import] Connecting to Sanity project "${projectId}" / dataset "${dataset}"`)

  for (const article of articles) {
    const { translationKey, lang, categories, ...rest } = article

    const doc = {
      ...rest,
      _type: 'blogPost',
      language: lang,
      publishedAt: rest.publishedAt,
      author: { _type: 'reference', _ref: AUTHOR_ID },
      categories: (categories || []).map(id => ({ _type: 'reference', _ref: id })),
      slug: { _type: 'slug', current: rest.slug },
      title: rest.title,
    }

    await client.createOrReplace(doc)
    console.log(`[import]   Upserted [${lang}] "${rest.slug}"`)
  }

  console.log('\n[import] All 3 articles upserted. Done.')
}

main().catch(e => { console.error(e.message); process.exit(1) })
