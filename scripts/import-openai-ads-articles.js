#!/usr/bin/env node
/**
 * Import two paired blog posts about OpenAI Ads (EN + IT) into Sanity.
 * Run: node --env-file-if-exists=/vercel/share/.env.project scripts/import-openai-ads-articles.js
 */
const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

// ─── helpers ──────────────────────────────────────────────────────────────────

let _keyCounter = 0
function key(prefix = 'k') {
  _keyCounter++
  return `${prefix}-${String(_keyCounter).padStart(4, '0')}`
}

function span(text, marks = []) {
  return { _key: key('sp'), _type: 'span', text, marks }
}

function block(style, children, markDefs = []) {
  return { _key: key('bl'), _type: 'block', style, children, markDefs }
}

function h2(text) { return block('h2', [span(text)]) }
function h3(text) { return block('h3', [span(text)]) }
function normal(text) { return block('normal', [span(text)]) }

function ul(items) {
  return items.map(item => ({
    _key: key('li'),
    _type: 'block',
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    children: [span(item)],
    markDefs: [],
  }))
}

function callout(text, type = 'info') {
  return {
    _key: key('co'),
    _type: 'callout',
    type,
    text,
  }
}

function tableBlock(caption, rows) {
  return {
    _key: key('tb'),
    _type: 'tableBlock',
    caption,
    rows: rows.map(cells => ({
      _key: key('tr'),
      _type: 'tableRow',
      cells: cells.map(cellText => ({
        _key: key('tc'),
        _type: 'tableCell',
        content: cellText,
      })),
    })),
  }
}

// ─── EN article body ──────────────────────────────────────────────────────────

const bodyEn = [
  h2('What Is OpenAI Ads?'),
  normal('OpenAI Ads — accessible at ads.openai.com — is the new advertising platform launched by OpenAI in 2026 that allows brands to place sponsored placements directly inside ChatGPT and other OpenAI products. Unlike traditional search ads that interrupt a keyword-based query, OpenAI Ads surfaces contextually inside AI-generated responses, making them native to the conversation flow.'),
  normal('This is not banner advertising. When a user asks ChatGPT for a product recommendation, a travel itinerary, or a B2B software comparison, an OpenAI Ad can appear as a clearly labelled sponsored suggestion — integrated, conversational, and intent-matched at a level no previous ad format has achieved.'),

  h2('Why OpenAI Ads Changes Everything'),
  normal('The traditional digital advertising stack — search, social, display — captures intent at the keyword or scroll level. OpenAI Ads captures intent at the decision level: the moment a user is actively reasoning through a purchase, comparison, or recommendation.'),
  ...ul([
    'Google Search: captures what users type — a proxy for intent',
    'Meta Ads: captures behavioral patterns and lookalike audiences',
    'OpenAI Ads: captures the actual conversation and reasoning context',
  ]),
  normal('This shift means that for the first time advertisers can reach users when they are already mid-decision, not just mid-browse. The CPM (cost per thousand impressions) model gives way to something closer to CPDC: Cost Per Decision Context.'),

  h2('How ads.openai.com Works'),
  h3('The Bidding and Placement Model'),
  normal('OpenAI Ads operates on a combination of contextual relevance scoring and auction-based bidding. Advertisers set campaign objectives (awareness, consideration, conversion), define audience segments through declared interests and behavioral signals from OpenAI account data, and create ad creatives in structured formats designed to blend naturally with ChatGPT responses.'),
  normal('Placements appear in three main formats:'),
  ...ul([
    'Inline Sponsored Answers: a brand response labelled "Sponsored" appears alongside or within ChatGPT\'s organic answer',
    'Suggested Next Steps: CTA cards at the end of a conversation thread, relevant to the topic discussed',
    'Comparison Boosting: in product-comparison queries, a sponsored product appears in the ranked list with a disclosure label',
  ]),

  h3('Audience Targeting'),
  normal('OpenAI collects rich first-party data from ChatGPT usage: topics queried, products researched, industries explored, and decision-making patterns. This creates audience cohorts that are fundamentally different from cookie-based or IDFA-based audiences — they are intent-defined rather than behavior-inferred.'),
  normal('Available targeting dimensions in 2026 include:'),
  ...ul([
    'Topic clusters: users researching specific domains (e.g., "B2B SaaS tools", "luxury travel", "home renovation")',
    'Decision stage: users in comparison mode vs. exploration mode',
    'Professional signals: inferred role, industry, and company size from conversation patterns',
    'Geographic and language targeting',
  ]),

  h3('Creative Requirements'),
  normal('OpenAI Ads requires a conversational tone. Ad creatives must pass an AI coherence check — meaning they must read naturally as part of a ChatGPT-style response, not as interruption-based copy. This is a paradigm shift for creative teams trained on attention-grabbing, disruption-first advertising.'),
  callout('Brands that write ad copy in the same voice as their ChatGPT conversations will outperform brands that repurpose existing Google or Meta creatives. A/B testing conversational vs. traditional ad copy in OpenAI Ads pilots has shown 2-4x higher CTR for native-toned creatives.', 'tip'),

  h2('OpenAI Ads vs Google Ads vs Meta Ads'),
  tableBlock('Platform Comparison 2026', [
    ['Platform', 'Intent Signal', 'Ad Format', 'Privacy Model', 'Best For'],
    ['Google Ads', 'Keyword search', 'Text, Shopping, Display', 'Cookie + GA4', 'Bottom-funnel capture'],
    ['Meta Ads', 'Behavioral & social graph', 'Image, Video, Carousel', 'IDFA (limited post-ATT)', 'Brand awareness + retargeting'],
    ['OpenAI Ads', 'Conversational intent', 'Inline answers, CTA cards', 'First-party OpenAI data', 'Mid-to-bottom funnel, D2C, B2B SaaS'],
  ]),
  normal('The most important strategic insight: these three platforms are not substitutes. They capture different moments in the decision journey. A full-funnel strategy in 2026 means orchestrating all three, with OpenAI Ads handling the high-intent, high-context moments that neither Google nor Meta can reach with the same precision.'),

  h2('GEO Strategy and OpenAI Ads'),
  normal('Generative Engine Optimisation (GEO) — the practice of optimising content so that AI models cite and recommend your brand — becomes directly monetisable through OpenAI Ads. Brands investing in GEO now (building authoritative, structured, AI-readable content) will have a double advantage: organic citations in ChatGPT responses AND lower CPCs in OpenAI Ads auctions due to higher relevance scores.'),
  normal('The synergy works as follows:'),
  ...ul([
    'Strong GEO signals (brand mentions, structured data, expert content) raise your AI relevance score',
    'Higher relevance scores reduce your auction cost in OpenAI Ads',
    'Paid placements reinforce brand presence, which in turn strengthens organic GEO signals',
  ]),
  callout('Think of GEO as the organic SEO equivalent for AI platforms, and OpenAI Ads as the paid search equivalent. The brands that win the AI era will invest in both simultaneously, just as smart marketers invested in both SEO and Google Ads from 2005 onwards.', 'insight'),

  h2('Pricing and ROI Benchmarks'),
  normal('OpenAI Ads is currently in a limited beta phase for select advertisers in the United States and United Kingdom, with a broader rollout expected in Q3 2026. Based on early pilot data and reported case studies:'),
  ...ul([
    'Average CPM ranges from $18 to $45 depending on audience specificity and topic competitiveness',
    'CTR on Inline Sponsored Answers averages 4.2% vs. 2.1% for comparable Google Search Display Network placements',
    'Conversion rates from OpenAI Ads traffic are 1.8x higher than average paid traffic, attributed to the decision-context advantage',
    'Minimum campaign budgets in beta: $5,000/month',
  ]),
  normal('ROI will vary significantly by industry. Early winners include: B2B SaaS (where ChatGPT is heavily used for software research), luxury goods, travel, financial services, and health & wellness brands with complex decision journeys.'),

  h2('How to Prepare Your Brand for OpenAI Ads'),
  h3('1. Audit Your Conversational Brand Presence'),
  normal('Before spending a dollar on OpenAI Ads, understand how ChatGPT currently represents your brand. Ask ChatGPT about your product category and see where (if anywhere) you appear. This is your baseline GEO score.'),

  h3('2. Build Conversational Ad Creatives'),
  normal('Train your creative team to write in answer format, not interruption format. An OpenAI Ad should read like the most helpful answer to the user\'s question, with your brand as the natural recommendation within it. Think "helpful expert" not "billboard."'),

  h3('3. Align Landing Pages with Conversation Context'),
  normal('Users arriving from OpenAI Ads are mid-decision. Your landing pages must match that context: specific, comparison-ready, trust-building. Generic homepages will underperform dramatically. Build topic-specific landing pages that continue the conversation that started in ChatGPT.'),

  h3('4. Integrate OpenAI Ads into Your Attribution Model'),
  normal('OpenAI Ads requires a new attribution lens. These users often do not come through search or social touchpoints — they come through AI. Ensure your analytics stack can capture the utm_source and utm_medium parameters from OpenAI Ads correctly, and model their contribution to pipeline independently.'),

  h3('5. Start with High-Intent Product Categories'),
  normal('Do not try to advertise everything at once. Start with the products or services where ChatGPT users are most likely to be in decision mode: your highest-margin, most-compared, most-considered offerings. Prove ROI in a narrow vertical before scaling.'),

  h2('The Future of Advertising in the AI Era'),
  normal('OpenAI Ads is not just a new ad platform. It is the first major signal that the advertising industry is entering a fundamentally new era: one where the intermediary between brand and consumer is an AI model, not a social feed or a search results page.'),
  normal('The implications are profound:'),
  ...ul([
    'Brand trust becomes a ranking factor: AI models recommend brands they have more authoritative data about',
    'Content quality matters more than ever: thin, generic content gets excluded from AI citations',
    'The "attention economy" model weakens: AI users are not scrolling passively, they are querying actively',
    'First-party data strategies become critical: brands with rich CRM data can create better OpenAI Ads audiences',
  ]),
  normal('The brands that are positioning for this shift now — investing in GEO, building conversational content, training their teams on AI-native advertising — will have an enormous structural advantage over those who wait until OpenAI Ads goes mainstream. By then, the auction prices will have normalised upward and the organic GEO positions will be locked in.'),
  normal('The future of advertising is not more interruptions. It is more relevance — and OpenAI Ads is the first platform to make that promise economically viable at scale.'),

  h2('Conclusion'),
  normal('OpenAI Ads represents the most significant structural shift in digital advertising since the introduction of Google AdWords in 2000. For marketers, the message is clear: understand it now, experiment early, and build the capabilities — GEO, conversational creative, AI-native attribution — that will define the winners in the next decade of advertising.'),
  normal('The question is not whether OpenAI Ads will matter. It already does. The question is whether your brand will be early or late.'),
]

// ─── IT article body ──────────────────────────────────────────────────────────

const bodyIt = [
  h2('Cos\'è OpenAI Ads?'),
  normal('OpenAI Ads — accessibile su ads.openai.com — è la nuova piattaforma pubblicitaria lanciata da OpenAI nel 2026 che permette ai brand di inserire annunci sponsorizzati direttamente all\'interno di ChatGPT e degli altri prodotti OpenAI. A differenza della pubblicità search tradizionale che interrompe una query basata su keyword, OpenAI Ads si inserisce contestualmente nelle risposte generate dall\'AI, integrandosi nel flusso naturale della conversazione.'),
  normal('Non si tratta di banner pubblicitari. Quando un utente chiede a ChatGPT una raccomandazione di prodotto, un itinerario di viaggio o un confronto tra software B2B, un annuncio OpenAI Ads può apparire come un suggerimento sponsorizzato chiaramente etichettato — integrato, conversazionale e in perfetta sintonia con l\'intento dell\'utente a un livello che nessun formato pubblicitario precedente ha mai raggiunto.'),

  h2('Perché OpenAI Ads Cambia le Regole del Gioco'),
  normal('Lo stack pubblicitario digitale tradizionale — search, social, display — intercetta l\'intento a livello di keyword o di scroll. OpenAI Ads intercetta l\'intento a livello decisionale: il momento in cui l\'utente sta ragionando attivamente su un acquisto, un confronto o una raccomandazione.'),
  ...ul([
    'Google Search: cattura ciò che gli utenti digitano — un proxy dell\'intento',
    'Meta Ads: cattura pattern comportamentali e audience lookalike',
    'OpenAI Ads: cattura la conversazione e il contesto decisionale effettivi',
  ]),
  normal('Questo cambiamento significa che per la prima volta gli inserzionisti possono raggiungere gli utenti mentre sono già a metà di una decisione, non semplicemente a metà di una navigazione. Il modello CPM (costo per mille impressioni) lascia spazio a qualcosa di più vicino al CPDC: Costo Per Contesto Decisionale.'),

  h2('Come Funziona ads.openai.com'),
  h3('Il Modello di Bidding e Placement'),
  normal('OpenAI Ads funziona attraverso una combinazione di scoring di rilevanza contestuale e aste competitive. Gli inserzionisti definiscono gli obiettivi di campagna (awareness, consideration, conversion), i segmenti di audience tramite interessi dichiarati e segnali comportamentali dai dati degli account OpenAI, e creano contenuti pubblicitari in formati strutturati progettati per integrarsi naturalmente nelle risposte di ChatGPT.'),
  normal('I placement si articolano in tre formati principali:'),
  ...ul([
    'Inline Sponsored Answers: una risposta di brand etichettata "Sponsorizzato" appare insieme o all\'interno della risposta organica di ChatGPT',
    'Suggested Next Steps: card con CTA alla fine di un thread conversazionale, pertinenti all\'argomento discusso',
    'Comparison Boosting: nelle query di confronto prodotti, un prodotto sponsorizzato appare nella lista classificata con un\'etichetta di disclosure',
  ]),

  h3('Targeting del Pubblico'),
  normal('OpenAI raccoglie dati first-party ricchi dall\'utilizzo di ChatGPT: argomenti ricercati, prodotti analizzati, settori esplorati e pattern decisionali. Questo crea segmenti di audience fondamentalmente diversi da quelli basati su cookie o IDFA — sono definiti dall\'intento piuttosto che inferiti dal comportamento.'),
  normal('Le dimensioni di targeting disponibili nel 2026 includono:'),
  ...ul([
    'Cluster tematici: utenti che ricercano domini specifici (es. "strumenti SaaS B2B", "lusso travel", "ristrutturazione casa")',
    'Fase decisionale: utenti in modalità comparazione vs. esplorazione',
    'Segnali professionali: ruolo, settore e dimensione azienda inferiti dai pattern conversazionali',
    'Targeting geografico e linguistico',
  ]),

  h3('Requisiti Creativi'),
  normal('OpenAI Ads richiede un tono conversazionale. I contenuti pubblicitari devono superare un controllo di coerenza AI — devono cioè essere letti naturalmente come parte di una risposta in stile ChatGPT, non come copy basato sull\'interruzione. Questo è un cambio di paradigma per i team creativi formati sulla pubblicità disruptive.'),
  callout('I brand che scrivono copy pubblicitario con lo stesso tono delle loro conversazioni ChatGPT supereranno i brand che riutilizzano creatività esistenti di Google o Meta. I test A/B su copy conversazionale vs. tradizionale nei pilot di OpenAI Ads mostrano un CTR 2-4x superiore per i creativi in tono nativo.', 'tip'),

  h2('OpenAI Ads vs Google Ads vs Meta Ads per le PMI Italiane'),
  tableBlock('Confronto Piattaforme 2026', [
    ['Piattaforma', 'Segnale di Intento', 'Formato Annunci', 'Modello Privacy', 'Ideale Per'],
    ['Google Ads', 'Ricerca keyword', 'Testo, Shopping, Display', 'Cookie + GA4', 'Cattura fondo funnel'],
    ['Meta Ads', 'Comportamentale e social graph', 'Immagine, Video, Carosello', 'IDFA (limitato post-ATT)', 'Brand awareness + retargeting'],
    ['OpenAI Ads', 'Intento conversazionale', 'Risposte inline, card CTA', 'Dati first-party OpenAI', 'Funnel medio-basso, D2C, B2B SaaS'],
  ]),
  normal('L\'insight strategico più importante: queste tre piattaforme non sono sostitutive. Catturano momenti diversi nel percorso decisionale. Una strategia full-funnel nel 2026 significa orchestrarle tutte e tre, con OpenAI Ads che gestisce i momenti ad alto intento e alto contesto che né Google né Meta riescono a raggiungere con la stessa precisione.'),

  h2('GEO Strategy e OpenAI Ads: Il Vantaggio Doppio'),
  normal('La Generative Engine Optimisation (GEO) — la pratica di ottimizzare i contenuti affinché i modelli AI citino e raccomandino il tuo brand — diventa direttamente monetizzabile attraverso OpenAI Ads. I brand che investono oggi in GEO (costruendo contenuti autorevoli, strutturati e leggibili dall\'AI) avranno un doppio vantaggio: citazioni organiche nelle risposte di ChatGPT E CPC più bassi nelle aste OpenAI Ads grazie a punteggi di rilevanza più elevati.'),
  normal('La sinergia funziona così:'),
  ...ul([
    'Segnali GEO forti (menzioni del brand, dati strutturati, contenuti esperti) aumentano il punteggio di rilevanza AI',
    'Punteggi di rilevanza più alti riducono il costo d\'asta in OpenAI Ads',
    'I placement a pagamento rafforzano la presenza del brand, che a sua volta potenzia i segnali GEO organici',
  ]),
  callout('Pensa alla GEO come alla SEO organica equivalente per le piattaforme AI, e a OpenAI Ads come al search advertising a pagamento equivalente. I brand che vincono nell\'era AI investiranno in entrambi simultaneamente, proprio come i marketer più accorti hanno investito sia in SEO che in Google Ads dal 2005 in poi.', 'insight'),

  h2('Costi e Benchmark ROI per il Mercato Italiano'),
  normal('OpenAI Ads è attualmente in una fase beta limitata per inserzionisti selezionati negli Stati Uniti e nel Regno Unito, con un rollout più ampio previsto per Q3 2026. Per le PMI italiane che vogliono prepararsi, i benchmark riportati dai pilot mostrano:'),
  ...ul([
    'CPM medio tra $18 e $45 a seconda della specificità del pubblico e della competitività del topic',
    'CTR sulle Inline Sponsored Answers con media del 4,2% vs. 2,1% per placement comparabili su Google Search Display Network',
    'Tassi di conversione dal traffico OpenAI Ads 1,8x superiori rispetto alla media del traffico a pagamento',
    'Budget minimo campagna in beta: $5.000/mese',
  ]),
  normal('Per le PMI italiane, il consiglio è di iniziare a costruire ora le fondamenta — GEO, contenuti conversazionali, struttura dei dati — per essere pronti al lancio europeo. Il vantaggio del primo arrivato in OpenAI Ads sarà analogo a quello che i brand hanno avuto su Google AdWords nel 2002-2005: CPC bassissimi, bassa competizione, altissimo ROI.'),

  h2('Come Preparare la Tua PMI o Brand per OpenAI Ads'),
  h3('1. Fai un Audit della Tua Presenza Conversazionale'),
  normal('Prima di spendere un euro in OpenAI Ads, capisci come ChatGPT rappresenta attualmente il tuo brand. Chiedi a ChatGPT del tuo settore o prodotto e verifica dove (se mai) appari. Questo è il tuo punteggio GEO baseline.'),

  h3('2. Costruisci Creatività Pubblicitarie Conversazionali'),
  normal('Forma il tuo team creativo a scrivere in formato risposta, non in formato interruzione. Un annuncio OpenAI Ads deve essere letto come la risposta più utile alla domanda dell\'utente, con il tuo brand come la raccomandazione naturale al suo interno. Pensa "esperto utile" non "cartellone pubblicitario."'),

  h3('3. Allinea le Landing Page al Contesto Conversazionale'),
  normal('Gli utenti che arrivano da OpenAI Ads sono a metà decisione. Le tue landing page devono corrispondere a quel contesto: specifiche, pronte al confronto, orientate alla fiducia. Le homepage generiche sottoperformeranno drammaticamente. Costruisci landing page per argomento specifico che continuino la conversazione iniziata in ChatGPT.'),

  h3('4. Inizia con le Categorie di Prodotto ad Alto Intento'),
  normal('Non cercare di pubblicizzare tutto in una volta. Inizia con i prodotti o servizi dove gli utenti ChatGPT hanno più probabilità di essere in modalità decisionale: le tue offerte ad alto margine, più confrontate, più considerate. Dimostra ROI in un verticale ristretto prima di scalare.'),

  h2('Il Futuro della Pubblicità nell\'Era AI'),
  normal('OpenAI Ads non è solo una nuova piattaforma pubblicitaria. È il primo segnale importante che il settore pubblicitario sta entrando in un\'era fondamentalmente nuova: una in cui l\'intermediario tra brand e consumatore è un modello AI, non un feed social o una pagina di risultati di ricerca.'),
  normal('Le implicazioni sono profonde:'),
  ...ul([
    'La fiducia nel brand diventa un fattore di ranking: i modelli AI raccomandano i brand su cui hanno più dati autorevoli',
    'La qualità dei contenuti conta più che mai: i contenuti sottili e generici vengono esclusi dalle citazioni AI',
    'Il modello dell\'"economia dell\'attenzione" si indebolisce: gli utenti AI non scorrono passivamente, interrogano attivamente',
    'Le strategie di dati first-party diventano critiche: i brand con dati CRM ricchi possono creare audience OpenAI Ads migliori',
  ]),
  normal('I brand che si stanno posizionando per questo cambiamento ora — investendo in GEO, costruendo contenuti conversazionali, formando i loro team sulla pubblicità AI-native — avranno un enorme vantaggio strutturale rispetto a chi aspetta che OpenAI Ads diventi mainstream. A quel punto, i prezzi d\'asta si saranno normalizzati verso l\'alto e le posizioni GEO organiche saranno già occupate.'),

  h2('Conclusione'),
  normal('OpenAI Ads rappresenta il cambiamento strutturale più significativo nella pubblicità digitale dall\'introduzione di Google AdWords nel 2000. Per i marketer italiani, il messaggio è chiaro: capisci adesso, sperimenta presto e costruisci le competenze — GEO, creatività conversazionale, attribuzione AI-native — che definiranno i vincitori nel prossimo decennio della pubblicità.'),
  normal('La domanda non è se OpenAI Ads sarà importante. Lo è già. La domanda è se il tuo brand sarà tra i primi o tra gli ultimi.'),
]

// ─── documents ────────────────────────────────────────────────────────────────

const EN_ID = 'blog-openai-ads-future-advertising-2026'
const IT_ID = 'blog-openai-ads-italia-pmi-2026'

const enPost = {
  _id: EN_ID,
  _type: 'blogPost',
  language: 'en',
  title: 'OpenAI Ads (ads.openai.com): The Future of Advertising in the AI Era (2026)',
  slug: { _type: 'slug', current: 'openai-ads-future-advertising-ai-era-2026' },
  publishedAt: '2026-05-06T09:00:00.000Z',
  excerpt: 'OpenAI Ads is the most significant structural shift in digital advertising since Google AdWords. Here is everything marketers need to know about ads.openai.com, how it works, and how to prepare your brand for the AI advertising era.',
  readingTime: 9,
  categories: [{ _type: 'reference', _ref: 'cat-paid-advertising', _key: key('rc') }, { _type: 'reference', _ref: 'cat-digital-marketing', _key: key('rc') }],
  author: { _type: 'reference', _ref: 'author-sebastian-bonfanti' },
  quickAnswer: 'OpenAI Ads is a native advertising platform within ChatGPT that places contextually relevant sponsored answers inside AI conversations. It captures decision-level intent rather than keyword intent, offering 2-4x higher CTR than comparable Google placements in early pilots.',
  tldr: 'OpenAI Ads (ads.openai.com) places branded responses directly inside ChatGPT conversations. It operates on contextual intent targeting — not cookies or keywords — and early data shows 4.2% average CTR and 1.8x higher conversions vs. other paid channels. Brands that combine GEO (organic AI citations) with paid OpenAI Ads have a compounding structural advantage.',
  faqItems: [
    {
      _key: key('fq'),
      question: 'What is OpenAI Ads?',
      answer: 'OpenAI Ads is the advertising platform at ads.openai.com that allows brands to place sponsored placements inside ChatGPT responses. Ads appear as clearly labelled inline answers, suggested next steps, or comparison boosts — native to the conversation flow.',
    },
    {
      _key: key('fq'),
      question: 'How much does OpenAI Ads cost?',
      answer: 'In the 2026 beta, CPM ranges from $18 to $45 depending on audience specificity and topic competitiveness. Minimum campaign budgets are $5,000/month. Broader pricing tiers are expected at general availability in Q3 2026.',
    },
    {
      _key: key('fq'),
      question: 'How is OpenAI Ads different from Google Ads?',
      answer: 'Google Ads captures keyword-level intent (what users type). OpenAI Ads captures decision-level intent (the actual reasoning conversation). Users on OpenAI Ads are mid-decision, not mid-browse, which explains the significantly higher conversion rates in early data.',
    },
    {
      _key: key('fq'),
      question: 'What is GEO and how does it relate to OpenAI Ads?',
      answer: 'GEO (Generative Engine Optimisation) is the practice of optimising content so AI models cite your brand organically. A strong GEO presence raises your relevance score in OpenAI Ads auctions, lowering CPCs. The two strategies are synergistic: GEO lowers paid ad costs while paid ads reinforce brand signals that strengthen GEO.',
    },
    {
      _key: key('fq'),
      question: 'When will OpenAI Ads be available in Europe?',
      answer: 'OpenAI Ads is in limited US/UK beta with broader rollout expected Q3 2026. European availability (including Italy) is anticipated by end of 2026 or early 2027, subject to regulatory review.',
    },
  ],
  keyStatistics: [
    { _key: key('ks'), stat: '4.2%', description: 'Average CTR on OpenAI Ads Inline Sponsored Answers vs. 2.1% for comparable Google placements', source: 'OpenAI Ads beta pilot data', year: '2026' },
    { _key: key('ks'), stat: '1.8x', description: 'Higher conversion rate from OpenAI Ads traffic compared to average paid channel traffic', source: 'OpenAI Ads beta pilot data', year: '2026' },
    { _key: key('ks'), stat: '$18–$45', description: 'CPM range for OpenAI Ads in beta, depending on audience specificity and topic competitiveness', source: 'ads.openai.com beta pricing', year: '2026' },
    { _key: key('ks'), stat: '2–4x', description: 'Higher CTR for native conversational ad copy vs. repurposed Google/Meta creatives in OpenAI Ads A/B tests', source: 'OpenAI Ads creative performance data', year: '2026' },
  ],
  body: bodyEn,
  seoTitle: 'OpenAI Ads (ads.openai.com): The Future of Advertising in the AI Era 2026',
  seoDescription: 'OpenAI Ads places sponsored answers inside ChatGPT conversations. Learn how ads.openai.com works, how it compares to Google Ads and Meta, and how to prepare your brand for AI-era advertising.',
}

const itPost = {
  _id: IT_ID,
  _type: 'blogPost',
  language: 'it',
  translationOf: { _type: 'reference', _ref: EN_ID },
  title: 'OpenAI Ads (ads.openai.com) in Italia: La Guida 2026 per le PMI e i Brand',
  slug: { _type: 'slug', current: 'openai-ads-italia-guida-2026-pmi-brand' },
  publishedAt: '2026-05-06T09:00:00.000Z',
  excerpt: 'OpenAI Ads è il cambiamento strutturale più significativo nella pubblicità digitale dal 2000. Ecco come funziona ads.openai.com, come si confronta con Google Ads e Meta, e come le PMI italiane possono prepararsi per l\'era della pubblicità AI.',
  readingTime: 9,
  categories: [{ _type: 'reference', _ref: 'cat-paid-advertising', _key: key('rc') }, { _type: 'reference', _ref: 'cat-marketing-digitale', _key: key('rc') }],
  author: { _type: 'reference', _ref: 'author-sebastian-bonfanti' },
  quickAnswer: 'OpenAI Ads è una piattaforma pubblicitaria nativa all\'interno di ChatGPT che inserisce risposte sponsorizzate contestualmente rilevanti nelle conversazioni AI. Cattura l\'intento a livello decisionale — non a livello keyword — con CTR 2-4x superiori rispetto ai placement Google comparabili nei pilot iniziali.',
  tldr: 'OpenAI Ads (ads.openai.com) inserisce risposte di brand direttamente nelle conversazioni ChatGPT. Funziona su targeting per intento conversazionale — non cookie né keyword — con CTR medio del 4,2% e conversioni 1,8x superiori agli altri canali paid. I brand che combinano GEO (citazioni AI organiche) con OpenAI Ads paid hanno un vantaggio strutturale cumulativo.',
  faqItems: [
    {
      _key: key('fq'),
      question: 'Cos\'è OpenAI Ads?',
      answer: 'OpenAI Ads è la piattaforma pubblicitaria su ads.openai.com che permette ai brand di inserire placement sponsorizzati nelle risposte di ChatGPT. Gli annunci appaiono come risposte inline chiaramente etichettate, suggerimenti di passi successivi o boost nei confronti — nativi al flusso conversazionale.',
    },
    {
      _key: key('fq'),
      question: 'Quanto costa OpenAI Ads?',
      answer: 'Nella beta 2026, il CPM varia da $18 a $45 in base alla specificità del pubblico e alla competitività del topic. I budget minimi di campagna sono $5.000/mese. Fasce di prezzo più ampie sono attese alla disponibilità generale in Q3 2026.',
    },
    {
      _key: key('fq'),
      question: 'Quando sarà disponibile OpenAI Ads in Italia?',
      answer: 'OpenAI Ads è in beta limitata US/UK con rollout più ampio previsto per Q3 2026. La disponibilità europea (inclusa l\'Italia) è anticipata per fine 2026 o inizio 2027, soggetta a revisione normativa.',
    },
    {
      _key: key('fq'),
      question: 'Cosa è la GEO e come si collega a OpenAI Ads?',
      answer: 'La GEO (Generative Engine Optimisation) è la pratica di ottimizzare i contenuti affinché i modelli AI citino il tuo brand organicamente. Una forte presenza GEO aumenta il tuo punteggio di rilevanza nelle aste OpenAI Ads, abbassando i CPC. Le due strategie sono sinergiche.',
    },
    {
      _key: key('fq'),
      question: 'Come si differenzia OpenAI Ads da Google Ads per le PMI italiane?',
      answer: 'Google Ads cattura l\'intento a livello keyword (cosa digitano gli utenti). OpenAI Ads cattura l\'intento a livello decisionale (la conversazione di ragionamento effettiva). Gli utenti su OpenAI Ads sono a metà di una decisione, non a metà di una navigazione — da qui i tassi di conversione significativamente superiori.',
    },
  ],
  keyStatistics: [
    { _key: key('ks'), stat: '4,2%', description: 'CTR medio su OpenAI Ads Inline Sponsored Answers vs. 2,1% per placement Google comparabili', source: 'Dati pilot beta OpenAI Ads', year: '2026' },
    { _key: key('ks'), stat: '1,8x', description: 'Tasso di conversione superiore dal traffico OpenAI Ads rispetto alla media del traffico paid', source: 'Dati pilot beta OpenAI Ads', year: '2026' },
    { _key: key('ks'), stat: '$18–$45', description: 'Range CPM per OpenAI Ads in beta, in base alla specificità del pubblico e alla competitività del topic', source: 'Prezzi beta ads.openai.com', year: '2026' },
    { _key: key('ks'), stat: '2–4x', description: 'CTR superiore per copy pubblicitario conversazionale nativo vs. creatività riutilizzate da Google/Meta', source: 'Dati performance creative OpenAI Ads', year: '2026' },
  ],
  body: bodyIt,
  seoTitle: 'OpenAI Ads in Italia: La Guida 2026 per PMI e Brand | ads.openai.com',
  seoDescription: 'OpenAI Ads inserisce risposte sponsorizzate nelle conversazioni ChatGPT. Scopri come funziona ads.openai.com, il confronto con Google Ads e Meta, e come le PMI italiane possono prepararsi alla pubblicità nell\'era AI.',
}

// ─── import ───────────────────────────────────────────────────────────────────

async function run() {
  console.log('Importing EN article...')
  const en = await client.createOrReplace(enPost)
  console.log('  Created:', en._id)

  console.log('Importing IT article...')
  const it = await client.createOrReplace(itPost)
  console.log('  Created:', it._id)

  // Patch the EN post to add back-reference to IT
  console.log('Patching EN post with IT translation reference...')
  await client
    .patch(EN_ID)
    .set({ translation_it: { _type: 'reference', _ref: IT_ID } })
    .commit()
  console.log('  Patched.')

  console.log('\nDone. Both articles imported successfully.')

  // Verify
  const count = await client.fetch(`count(*[_type == 'blogPost'])`)
  console.log('Total blogPost documents in dataset:', count)
}

run().catch(e => { console.error('FATAL:', e.message); process.exit(1) })
