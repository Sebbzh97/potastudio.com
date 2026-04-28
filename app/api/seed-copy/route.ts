/**
 * /api/seed-copy — Authoritative seed route for Sanity CMS.
 *
 * Usage:
 *   GET /api/seed-copy?secret=pota-seed-2026          → seed everything
 *   GET /api/seed-copy?secret=pota-seed-2026&purge=1  → purge + seed
 *
 * Documents created:
 *   • pageContent (22 docs: 11 pages × 2 languages)
 *   • client      (clients roster)
 *   • caseStudy   (10 featured case studies)
 *   • testimonial (6 client testimonials)
 *   • siteSettings (global footer / contact info)
 */

import { createClient } from '@sanity/client'
import { NextResponse } from 'next/server'

const SEED_SECRET = process.env.SEED_SECRET ?? 'pota-seed-2026'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'hjzz7d9r',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

// ────────────────────────────────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────────────────────────────────

const MARQUEE_CLIENTS = [
  'SAMSUNG', 'ISYBANK', 'COOKIES DIGITAL', 'ACCANTO', 'HAVIT',
  'MAREPINETA RESORT', 'DIECI CAPITAL', 'MIMA TENNIS', 'LEVITOLOGY', 'DA NASTI',
]

/** Build a pageContent document id */
const pageId = (id: string, lang: 'en' | 'it') => `pageContent-${id}-${lang}`

/** Wrap a plain-text block into PortableText block array */
const block = (text: string, style: 'normal' | 'h2' | 'h3' = 'normal') => ({
  _type: 'block',
  _key: Math.random().toString(36).slice(2, 10),
  style,
  markDefs: [],
  children: [{ _type: 'span', _key: Math.random().toString(36).slice(2, 10), text, marks: [] }],
})

// ────────────────────────────────────────────────────────────────────────────
// PAGE CONTENT DOCUMENTS
// ────────────────────────────────────────────────────────────────────────────

type PageDoc = Record<string, unknown> & { _id: string; _type: 'pageContent'; pageId: string; language: 'en' | 'it' }

const PAGE_CONTENT: PageDoc[] = [
  // ── HOMEPAGE (EN) ─────────────────────────────────────────────────────────
  {
    _id: pageId('homepage', 'en'),
    _type: 'pageContent',
    pageId: 'homepage',
    language: 'en',

    seoTitle: 'Pota Studio | Full Service Marketing Agency',
    seoDescription: 'Full service marketing agency from Italy. Social media, paid ADS, content production, influencer marketing.',

    heroLabel: 'Pota Studio | Marketing Agency',
    heroHeadlinePrefix: 'We make',
    heroCyclingWords: ['brands', 'events', 'ADS', 'content'],
    heroAccentLine: 'impossible',
    heroHeadlineSuffix: 'to ignore.',
    heroSubheadline: 'Full service marketing agency building brands that scale across performance, content and community.',
    heroMarqueeClients: MARQUEE_CLIENTS,
    heroCta1Label: 'Start a project',
    heroCta1Href: '/contact',
    heroCta2Label: 'See our work',
    heroCta2Href: '/work',

    stat1Value: '+340%', stat1Label: 'Peak ROAS',
    stat2Value: '-62%',  stat2Label: 'Cost per lead',
    stat3Value: '50+',   stat3Label: 'Brands served',
    stat4Value: '5',     stat4Label: 'Markets covered',

    servicesEyebrow: 'What we do',
    servicesHeadline: 'Full service.\nNo handoffs.',
    servicesBody: 'Every discipline under one roof.',
    servicesAllLabel: 'All services',
    servicesLearnMoreLabel: 'Learn more',
    servicesList: [
      { _key: 'svc-01', number: '01', name: 'Social Media Management',   description: 'Strategic content, community management, and brand voice across every platform.', imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC04575-NSjeHv9sdKZk3k009AL9Kmcrwg2fCk.jpg' },
      { _key: 'svc-02', number: '02', name: 'Paid Advertising',          description: 'Data-driven campaigns on Meta, Google, TikTok and beyond. We manage €2.5M+ in annual ad spend.', imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/RGB_9294-ImCRWND7flLv1SZvde44a3Sz70fKpG.jpg' },
      { _key: 'svc-03', number: '03', name: 'Content Production',        description: 'Editorial photo and video content that stops the scroll and builds desire.', imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Levitology_def-4-O2rcpRP50Xsu3NgDwAtqyBVvTXBqkc.jpg' },
      { _key: 'svc-04', number: '04', name: 'Web Design & Development',  description: 'We design and build e-commerce and brand experiences that convert, from DTC stores to enterprise platforms.', imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC02938_HDR-mI2DwoDIDYP911g8atn16kcyga8qw9.jpg' },
      { _key: 'svc-05', number: '05', name: 'Influencer Marketing',      description: 'Curated creator partnerships with measurable ROI, not just reach.', imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC01276-MwkYVtiS12CJoLDv3uLrH3TUGGwtvc.jpg' },
      { _key: 'svc-06', number: '06', name: 'Brand Representation',      description: 'Official ambassador and brand activation programs at scale.', imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/RGB_9421-xts6k5vptkdeYNtxfqA1cmWHj4BOAC.jpg' },
    ],

    whyEyebrow: 'Why Pota Studio',
    whyQuote:   'In 7 years we have never missed a deadline.',
    whyBody:    'We are not chasing 25 clients. Our philosophy is fewer clients and higher quality in every way, at an extremely accessible price. Young and dynamic team. In-house content area. Fast reply. Fresh proposals and obsession with the product.',
    whyPoint1:  '€2.5M+ managed in ads across Meta, Google, TikTok',
    whyPoint2:  'Clients across Europe and the US',
    whyPoint3:  'In-house content production, no outsourcing',

    featuredWorkLabel: 'Selected work',
    featuredWorkHeadline1: 'Results that',
    featuredWorkHeadline2: 'speak for themselves.',
    featuredWorkViewAllLabel: 'See all work',
    featuredWorkViewCaseLabel: 'View case study',

    clientsHeadline: 'Trusted by brands that demand excellence.',

    ctaSectionHeadline:    "Let's build something great.",
    ctaSectionBody:        'Tell us about your project and we will get back within 24 hours.',
    ctaSectionButtonLabel: 'Get in touch',
  },

  // ── HOMEPAGE (IT) ─────────────────────────────────────────────────────────
  {
    _id: pageId('homepage', 'it'),
    _type: 'pageContent',
    pageId: 'homepage',
    language: 'it',

    seoTitle: 'Pota Studio | Full Service Marketing Agency',
    seoDescription: 'Full service marketing agency dall\'Italia. Social media, paid ADS, produzione contenuti, influencer marketing.',

    heroLabel: 'Pota Studio | Agenzia di Marketing',
    heroHeadlinePrefix: 'Creiamo',
    heroCyclingWords: ['brand', 'eventi', 'ADS', 'contenuti'],
    heroAccentLine: 'impossibili',
    heroHeadlineSuffix: 'da ignorare.',
    heroSubheadline: 'Full service marketing agency che costruisce brand scalabili su performance, contenuto e community.',
    heroMarqueeClients: MARQUEE_CLIENTS,
    heroCta1Label: 'Inizia un progetto',
    heroCta1Href: '/it/contact',
    heroCta2Label: 'I nostri lavori',
    heroCta2Href: '/it/work',

    stat1Value: '+340%', stat1Label: 'ROAS di picco',
    stat2Value: '-62%',  stat2Label: 'Costo per lead',
    stat3Value: '50+',   stat3Label: 'Brand serviti',
    stat4Value: '5',     stat4Label: 'Mercati coperti',

    servicesEyebrow: 'Cosa facciamo',
    servicesHeadline: 'Full service.\nNessun passaggio di mano.',
    servicesBody: 'Ogni disciplina sotto un solo tetto.',
    servicesAllLabel: 'Tutti i servizi',
    servicesLearnMoreLabel: 'Scopri di piu',
    servicesList: [
      { _key: 'svc-01', number: '01', name: 'Social Media Management',   description: 'Contenuti strategici, community management e brand voice su ogni piattaforma.', imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC04575-NSjeHv9sdKZk3k009AL9Kmcrwg2fCk.jpg' },
      { _key: 'svc-02', number: '02', name: 'Paid Advertising',          description: 'Campagne data-driven su Meta, Google, TikTok e oltre. Gestiamo oltre €2.5M di ad spend annuo.', imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/RGB_9294-ImCRWND7flLv1SZvde44a3Sz70fKpG.jpg' },
      { _key: 'svc-03', number: '03', name: 'Content Production',        description: 'Foto e video editoriali che fermano lo scroll e costruiscono il desiderio.', imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Levitology_def-4-O2rcpRP50Xsu3NgDwAtqyBVvTXBqkc.jpg' },
      { _key: 'svc-04', number: '04', name: 'Web Design & Development',  description: 'Progettiamo e sviluppiamo esperienze e-commerce e brand che convertono, da store DTC a piattaforme enterprise.', imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC02938_HDR-mI2DwoDIDYP911g8atn16kcyga8qw9.jpg' },
      { _key: 'svc-05', number: '05', name: 'Influencer Marketing',      description: 'Partnership con creator selezionati e ROI misurabile, non solo reach.', imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC01276-MwkYVtiS12CJoLDv3uLrH3TUGGwtvc.jpg' },
      { _key: 'svc-06', number: '06', name: 'Brand Representation',      description: 'Programmi ufficiali di ambassador e brand activation su larga scala.', imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/RGB_9421-xts6k5vptkdeYNtxfqA1cmWHj4BOAC.jpg' },
    ],

    whyEyebrow: 'Perche Pota Studio',
    whyQuote:   'In 7 anni non abbiamo mai mancato una scadenza.',
    whyBody:    'Non siamo alla ricerca di 25 clienti. La nostra filosofia e meno clienti e piu qualita, sotto ogni punto di vista e a un prezzo estremamente accessibile. Team giovane e dinamico. Area content in-house. Fast reply. Freschezza nelle proposte e ossessione del prodotto.',
    whyPoint1:  '€2.5M+ gestiti in ads su Meta, Google, TikTok',
    whyPoint2:  'Clienti in Europa e negli USA',
    whyPoint3:  'Produzione contenuti in-house, nessun outsourcing',

    featuredWorkLabel: 'Lavori selezionati',
    featuredWorkHeadline1: 'Risultati che',
    featuredWorkHeadline2: 'parlano chiaro.',
    featuredWorkViewAllLabel: 'Vedi tutti i lavori',
    featuredWorkViewCaseLabel: 'Vedi il case study',

    clientsHeadline: 'Scelti dai brand che non accettano compromessi.',

    ctaSectionHeadline:    'Costruiamo qualcosa di grande.',
    ctaSectionBody:        'Raccontaci il tuo progetto e ti rispondiamo entro 24 ore.',
    ctaSectionButtonLabel: 'Contattaci',
  },

  // ── ABOUT (EN) ────────────────────────────────────────────────────────────
  {
    _id: pageId('aboutPage', 'en'),
    _type: 'pageContent',
    pageId: 'aboutPage',
    language: 'en',

    seoTitle: 'About | Pota Studio',
    seoDescription: 'Pota Studio was founded in 2023 in Bergamo, Italy by Sebastian Bonfanti. Full service marketing agency with years of experience in communications.',

    heroLabel: 'Studio',
    heroHeadline: 'Full service.',
    heroAccent: 'Fully accountable.',
    heroBody: 'A small senior team from Bergamo building performance-driven campaigns for ambitious brands.',

    storyLabel: 'Our story',
    storyHeadline: 'Built in Bergamo. Trusted globally.',
    storyP1: 'Pota Studio was founded in 2023 by Sebastian Bonfanti after years leading brand and performance projects for some of the most demanding clients in Italy.',
    storyP2: 'What started as a single freelance client grew into a senior team working alongside companies like Samsung and Isybank. We stay small on purpose, so every project gets the focus it deserves.',
    storyP3: 'We are obsessed with measurable outcomes, sharp creativity, and shipping fast.',

    teamLabel: 'The team',
    teamHeadline: 'Senior, hands-on, fully accountable.',

    valuesLabel: 'What we believe',
    valuesHeadline: 'Three things we never compromise on.',
    value1Title: 'Outcomes over output',
    value1Body:  'We measure our work by what it generates, not by how much we ship.',
    value2Title: 'Senior from day one',
    value2Body:  'You talk to the people doing the work. No junior handoffs, no translation layers.',
    value3Title: 'Fast, honest, direct',
    value3Body:  'Clear pricing, clear timelines, clear communication. Always.',

    officesLabel: 'Our offices',
    office1Name: 'Bergamo HQ', office1Address: 'Ponte San Pietro, Bergamo', office1Country: 'Italy',
    office1Description: 'Our founding home. Where strategy and creative come together.',
    office2Name: 'Milan', office2Address: 'Coming Soon', office2Country: 'Italy',
    office2Description: 'A new technological and entertainment space opening in 2026.',
    office2ComingSoon: true,

    ctaHeadline: "Let's build something great.",
    ctaBody: 'Tell us about your project and we will get back within 24 hours.',
    ctaLabel: 'Get in touch',
    ctaHref:  '/contact',
  },

  // ── ABOUT (IT) ────────────────────────────────────────────────────────────
  {
    _id: pageId('aboutPage', 'it'),
    _type: 'pageContent',
    pageId: 'aboutPage',
    language: 'it',

    seoTitle: 'Chi siamo | Pota Studio',
    seoDescription: 'Pota Studio e stata fondata nel 2023 a Bergamo da Sebastian Bonfanti. Full service marketing agency con anni di esperienza in comunicazione.',

    heroLabel: 'Studio',
    heroHeadline: 'Full service.',
    heroAccent: 'Totalmente responsabili.',
    heroBody: 'Un piccolo team senior da Bergamo che costruisce campagne performance-driven per brand ambiziosi.',

    storyLabel: 'La nostra storia',
    storyHeadline: 'Nati a Bergamo. Scelti nel mondo.',
    storyP1: 'Pota Studio e stata fondata nel 2023 da Sebastian Bonfanti, dopo anni passati a guidare progetti brand e performance per alcuni dei clienti piu esigenti in Italia.',
    storyP2: 'Quello che era nato come un singolo cliente freelance e cresciuto in un team senior che lavora con aziende come Samsung e Isybank. Restiamo piccoli di proposito, cosi ogni progetto ha l\'attenzione che merita.',
    storyP3: 'Siamo ossessionati da risultati misurabili, creativita affilata e velocita di esecuzione.',

    teamLabel: 'Il team',
    teamHeadline: 'Senior, hands-on, totalmente responsabili.',

    valuesLabel: 'In cosa crediamo',
    valuesHeadline: 'Tre cose su cui non scendiamo a compromessi.',
    value1Title: 'Risultati, non output',
    value1Body:  'Misuriamo il lavoro per cio che genera, non per quanto produciamo.',
    value2Title: 'Senior dal primo giorno',
    value2Body:  'Parli con chi fa il lavoro. Nessun junior, nessun passaggio di mano.',
    value3Title: 'Veloci, onesti, diretti',
    value3Body:  'Prezzi chiari, tempistiche chiare, comunicazione chiara. Sempre.',

    officesLabel: 'Le nostre sedi',
    office1Name: 'Bergamo HQ', office1Address: 'Ponte San Pietro, Bergamo', office1Country: 'Italia',
    office1Description: 'La nostra casa fondatrice. Dove strategia e creativita si incontrano.',
    office2Name: 'Milano', office2Address: 'Coming Soon', office2Country: 'Italia',
    office2Description: 'Un nuovo spazio tecnologico e intrattenitivo che apre nel 2026.',
    office2ComingSoon: true,

    ctaHeadline: 'Costruiamo qualcosa di grande.',
    ctaBody: 'Raccontaci il tuo progetto e ti rispondiamo entro 24 ore.',
    ctaLabel: 'Contattaci',
    ctaHref:  '/it/contact',
  },

  // ── SERVICES (EN) ─────────────────────────────────────────────────────────
  {
    _id: pageId('servicesPage', 'en'),
    _type: 'pageContent',
    pageId: 'servicesPage',
    language: 'en',
    seoTitle: 'Services | Pota Studio',
    seoDescription: 'Full service marketing: social media, paid ADS, content production, TikTok Live, influencer marketing, web design & Shopify.',
    heroLabel: 'Services',
    heroHeadline: 'Services designed',
    heroAccent: 'to scale.',
    heroBody: 'Engineered for measurable growth, from paid media to creative production.',
    servicesEyebrow: 'What we do',
    servicesHeadline: 'End-to-end capabilities under one roof.',

    service1Title: 'Social Media Management',
    service1Body:  'Strategic content, community management and brand voice across every platform. We treat each channel as its own product.',
    service1Deliverable1: 'Content strategy and editorial calendar',
    service1Deliverable2: 'Daily community management',
    service1Deliverable3: 'Platform-native creative production',
    service1Deliverable4: 'Monthly analytics and reporting',
    service1Deliverable5: 'Crisis and reputation management',
    service1ImageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC04575-NSjeHv9sdKZk3k009AL9Kmcrwg2fCk.jpg',

    service2Title: 'Paid Advertising',
    service2Body:  'Data-driven campaigns on Meta, Google, TikTok and beyond. We manage €2.5M+ in annual ad spend for brands that need scale.',
    service2Deliverable1: 'Full-funnel campaign strategy',
    service2Deliverable2: 'Creative testing and iteration',
    service2Deliverable3: 'Tracking and measurement setup',
    service2Deliverable4: 'Weekly optimization and pacing',
    service2Deliverable5: 'Attribution and incrementality',
    service2ImageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/RGB_9294-ImCRWND7flLv1SZvde44a3Sz70fKpG.jpg',

    service3Title: 'Content Production',
    service3Body:  'Editorial photo and video content that stops the scroll and builds desire. In-house team, no outsourcing.',
    service3Deliverable1: 'Creative concept and art direction',
    service3Deliverable2: 'Photo and video production',
    service3Deliverable3: 'Editing and post-production',
    service3Deliverable4: 'UGC and creator content',
    service3Deliverable5: 'Asset delivery in every format',
    service3ImageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Levitology_def-4-O2rcpRP50Xsu3NgDwAtqyBVvTXBqkc.jpg',

    service4Title: 'Web Design & Development',
    service4Body:  'We design and build e-commerce and brand experiences that convert, from DTC stores to enterprise platforms.',
    service4Deliverable1: 'UX and UI design',
    service4Deliverable2: 'Shopify and headless builds',
    service4Deliverable3: 'Conversion rate optimization',
    service4Deliverable4: 'Performance and Core Web Vitals',
    service4Deliverable5: 'Integrations and analytics',
    service4ImageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC02938_HDR-mI2DwoDIDYP911g8atn16kcyga8qw9.jpg',

    service5Title: 'Influencer Marketing',
    service5Body:  'Curated creator partnerships with measurable ROI, not just reach. We run 55+ influencer campaigns per year.',
    service5Deliverable1: 'Creator scouting and vetting',
    service5Deliverable2: 'Briefing and content review',
    service5Deliverable3: 'Contracting and compliance',
    service5Deliverable4: 'Paid amplification of creator assets',
    service5Deliverable5: 'Performance reporting',
    service5ImageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC01276-MwkYVtiS12CJoLDv3uLrH3TUGGwtvc.jpg',

    service6Title: 'Brand Representation',
    service6Body:  'Official ambassador and brand activation programs at scale. We represent creators and run programs for brands.',
    service6Deliverable1: 'Talent scouting and management',
    service6Deliverable2: 'Ambassador program design',
    service6Deliverable3: 'Contracts and negotiations',
    service6Deliverable4: 'Event and activation production',
    service6Deliverable5: 'Press and PR support',
    service6ImageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/RGB_9421-xts6k5vptkdeYNtxfqA1cmWHj4BOAC.jpg',

    deliverablesLabel: "What's included",
    serviceCtaLabel:   'Request a proposal',

    ctaAccent:         'Start a project.',
    ctaHeadline:       'Need a specific capability?',
    ctaBody:           'Tell us what you are working on and we will scope it in 24 hours.',
    ctaSectionButtonLabel: 'Request a proposal',
  },
  {
    _id: pageId('servicesPage', 'it'),
    _type: 'pageContent',
    pageId: 'servicesPage',
    language: 'it',
    seoTitle: 'Servizi | Pota Studio',
    seoDescription: 'Full service marketing: social media, paid ADS, produzione contenuti, TikTok Live, influencer marketing, web design & Shopify.',
    heroLabel: 'Servizi',
    heroHeadline: 'Servizi pensati',
    heroAccent: 'per scalare.',
    heroBody: 'Progettati per una crescita misurabile, dal paid media alla produzione creativa.',
    servicesEyebrow: 'Cosa facciamo',
    servicesHeadline: 'Competenze end-to-end sotto un unico tetto.',

    service1Title: 'Social Media Management',
    service1Body:  'Contenuti strategici, community management e brand voice su ogni piattaforma. Trattiamo ogni canale come un prodotto a se.',
    service1Deliverable1: 'Strategia contenuti e piano editoriale',
    service1Deliverable2: 'Community management quotidiano',
    service1Deliverable3: 'Produzione creativa platform-native',
    service1Deliverable4: 'Analytics e reportistica mensile',
    service1Deliverable5: 'Gestione crisi e reputazione',
    service1ImageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC04575-NSjeHv9sdKZk3k009AL9Kmcrwg2fCk.jpg',

    service2Title: 'Paid Advertising',
    service2Body:  'Campagne data-driven su Meta, Google, TikTok e oltre. Gestiamo oltre €2.5M di ad spend annuo per brand che vogliono scalare.',
    service2Deliverable1: 'Strategia full-funnel',
    service2Deliverable2: 'Testing creativo e iterazione',
    service2Deliverable3: 'Setup tracking e misurazione',
    service2Deliverable4: 'Ottimizzazione e pacing settimanale',
    service2Deliverable5: 'Attribuzione e incrementalita',
    service2ImageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/RGB_9294-ImCRWND7flLv1SZvde44a3Sz70fKpG.jpg',

    service3Title: 'Content Production',
    service3Body:  'Foto e video editoriali che fermano lo scroll e costruiscono il desiderio. Team in-house, nessun outsourcing.',
    service3Deliverable1: 'Concept creativo e art direction',
    service3Deliverable2: 'Produzione foto e video',
    service3Deliverable3: 'Editing e post-produzione',
    service3Deliverable4: 'UGC e content da creator',
    service3Deliverable5: 'Asset in ogni formato',
    service3ImageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Levitology_def-4-O2rcpRP50Xsu3NgDwAtqyBVvTXBqkc.jpg',

    service4Title: 'Web Design & Development',
    service4Body:  'Progettiamo e sviluppiamo esperienze e-commerce e brand che convertono, da store DTC a piattaforme enterprise.',
    service4Deliverable1: 'UX e UI design',
    service4Deliverable2: 'Build Shopify e headless',
    service4Deliverable3: 'Ottimizzazione tasso di conversione',
    service4Deliverable4: 'Performance e Core Web Vitals',
    service4Deliverable5: 'Integrazioni e analytics',
    service4ImageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC02938_HDR-mI2DwoDIDYP911g8atn16kcyga8qw9.jpg',

    service5Title: 'Influencer Marketing',
    service5Body:  'Partnership con creator selezionati e ROI misurabile, non solo reach. Oltre 55 campagne influencer all\'anno.',
    service5Deliverable1: 'Scouting e vetting creator',
    service5Deliverable2: 'Brief e revisione contenuti',
    service5Deliverable3: 'Contrattualistica e compliance',
    service5Deliverable4: 'Amplificazione paid degli asset',
    service5Deliverable5: 'Reportistica performance',
    service5ImageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC01276-MwkYVtiS12CJoLDv3uLrH3TUGGwtvc.jpg',

    service6Title: 'Brand Representation',
    service6Body:  'Programmi ufficiali di ambassador e brand activation su larga scala. Rappresentiamo creator e gestiamo programmi per i brand.',
    service6Deliverable1: 'Scouting e gestione talent',
    service6Deliverable2: 'Design programma ambassador',
    service6Deliverable3: 'Contratti e negoziazioni',
    service6Deliverable4: 'Produzione eventi e attivazioni',
    service6Deliverable5: 'Supporto stampa e PR',
    service6ImageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/RGB_9421-xts6k5vptkdeYNtxfqA1cmWHj4BOAC.jpg',

    deliverablesLabel: 'Cosa include',
    serviceCtaLabel:   'Richiedi una proposta',

    ctaAccent:         'Inizia un progetto.',
    ctaHeadline:       'Ti serve una competenza specifica?',
    ctaBody:           'Raccontaci cosa stai costruendo e ti diamo una proposta in 24 ore.',
    ctaSectionButtonLabel: 'Richiedi una proposta',
  },

  // ── WORK (EN) ─────────────────────────────────────────────────────────────
  {
    _id: pageId('workPage', 'en'),
    _type: 'pageContent',
    pageId: 'workPage',
    language: 'en',
    seoTitle: 'Work | Pota Studio',
    seoDescription: 'Selected case studies. Samsung, Isybank, Cookies Digital and more.',
    heroLabel: 'Work',
    heroHeadline: 'Selected case studies.',
    heroBody: 'Results we helped build with some of the most ambitious brands in Europe.',
    filterAllLabel: 'All',
    ctaHeadline: 'Your project could be next.',
    ctaBody: 'Get in touch to see how we would approach it.',
    ctaButtonLabel: 'Start a project',
    ctaButtonHref: '/contact',
  },
  {
    _id: pageId('workPage', 'it'),
    _type: 'pageContent',
    pageId: 'workPage',
    language: 'it',
    seoTitle: 'Lavori | Pota Studio',
    seoDescription: 'Case study selezionati. Samsung, Isybank, Cookies Digital e altri.',
    heroLabel: 'Lavori',
    heroHeadline: 'Case study selezionati.',
    heroBody: 'Risultati che abbiamo costruito con alcuni dei brand piu ambiziosi d\'Europa.',
    filterAllLabel: 'Tutti',
    ctaHeadline: 'Il prossimo potresti essere tu.',
    ctaBody: 'Contattaci per capire come lo affronteremmo.',
    ctaButtonLabel: 'Inizia un progetto',
    ctaButtonHref: '/it/contact',
  },

  // ── CLIENTS (EN/IT) ──────────────────────────────────────────────────────
  {
    _id: pageId('clientsPage', 'en'),
    _type: 'pageContent',
    pageId: 'clientsPage',
    language: 'en',
    seoTitle: 'Clients | Pota Studio',
    seoDescription: 'The brands that chose Pota Studio.',
    heroLabel: 'Clients',
    heroHeadline: 'The brands that',
    heroAccent: 'chose us.',
    heroBody: 'From fast-moving startups to global enterprises.',
    clientsHeadline: 'Partners',
    ctaHeadline: 'Want to join the list?',
    ctaBody: 'Write to us at ciao@potastudio.com',
    ctaButtonLabel: 'Contact us',
    ctaButtonHref: '/contact',
  },
  {
    _id: pageId('clientsPage', 'it'),
    _type: 'pageContent',
    pageId: 'clientsPage',
    language: 'it',
    seoTitle: 'Clienti | Pota Studio',
    seoDescription: 'I brand che hanno scelto Pota Studio.',
    heroLabel: 'Clienti',
    heroHeadline: 'I brand che',
    heroAccent: 'ci hanno scelto.',
    heroBody: 'Dalle startup in rapida crescita ai gruppi internazionali.',
    clientsHeadline: 'Partner',
    ctaHeadline: 'Vuoi comparire anche tu?',
    ctaBody: 'Scrivici a ciao@potastudio.com',
    ctaButtonLabel: 'Contattaci',
    ctaButtonHref: '/it/contact',
  },

  // ── CONTACT (EN/IT) ──────────────────────────────────────────────────────
  {
    _id: pageId('contactPage', 'en'),
    _type: 'pageContent',
    pageId: 'contactPage',
    language: 'en',
    seoTitle: 'Contact | Pota Studio',
    seoDescription: 'Start a project with Pota Studio. Office in Bergamo (Ponte San Pietro).',
    heroLabel: 'Contact',
    heroHeadline: "Let's talk.",
    heroAccent:   'Tell us about your project.',
    heroBody:     'We answer every brief within 24 hours.',

    directLabel: 'Direct',
    followLabel: 'Follow Us',
    emailLabel:  'ciao@potastudio.com',
    phoneLabel:  '+39 035 000 0000',
    founderName: 'Sebastian Bonfanti',
    founderRole: 'Founder & CEO',
    addressLabel: 'Offices',
    addressLine1: 'Bergamo HQ',
    addressLine2: 'Ponte San Pietro, Bergamo, Italy',

    formHeadline:     'Start a project',
    formNameLabel:    'Your name',
    formEmailLabel:   'Email',
    formCompanyLabel: 'Company',
    formServiceLabel: 'Service of interest',
    formBudgetLabel:  'Estimated budget',
    formMessageLabel: 'Tell us about your project',
    formButtonLabel:  'Send brief',
    formPrivacyDisclaimer: 'By submitting this form you agree to our Privacy Policy. We answer within 24 hours.',
    formSuccessTitle: 'Thanks for your brief.',
    formSuccessBody:  'We will get back to you within 24 hours.',
  },
  {
    _id: pageId('contactPage', 'it'),
    _type: 'pageContent',
    pageId: 'contactPage',
    language: 'it',
    seoTitle: 'Contatti | Pota Studio',
    seoDescription: 'Inizia un progetto con Pota Studio. Sede a Bergamo (Ponte San Pietro).',
    heroLabel: 'Contatti',
    heroHeadline: 'Parliamone.',
    heroAccent:   'Raccontaci il tuo progetto.',
    heroBody:     'Rispondiamo a ogni brief entro 24 ore.',

    directLabel: 'Diretto',
    followLabel: 'Seguici',
    emailLabel:  'ciao@potastudio.com',
    phoneLabel:  '+39 035 000 0000',
    founderName: 'Sebastian Bonfanti',
    founderRole: 'Founder & CEO',
    addressLabel: 'Sedi',
    addressLine1: 'Bergamo HQ',
    addressLine2: 'Ponte San Pietro, Bergamo, Italia',

    formHeadline:     'Inizia un progetto',
    formNameLabel:    'Il tuo nome',
    formEmailLabel:   'Email',
    formCompanyLabel: 'Azienda',
    formServiceLabel: 'Servizio di interesse',
    formBudgetLabel:  'Budget stimato',
    formMessageLabel: 'Raccontaci il progetto',
    formButtonLabel:  'Invia il brief',
    formPrivacyDisclaimer: 'Inviando questo modulo accetti la nostra Privacy Policy. Rispondiamo entro 24 ore.',
    formSuccessTitle: 'Grazie per il tuo brief.',
    formSuccessBody:  'Ti rispondiamo entro 24 ore.',
  },

  // ── CAREERS (EN/IT) ──────────────────────────────────────────────────────
  {
    _id: pageId('careersPage', 'en'),
    _type: 'pageContent',
    pageId: 'careersPage',
    language: 'en',
    seoTitle: 'Careers | Pota Studio',
    seoDescription: 'Join Pota Studio. Open positions in Bergamo and remote roles across Europe.',
    heroLabel: 'Careers',
    heroHeadline: 'Build your',
    heroAccent: 'career here.',
    heroBody: 'Senior, hands-on, focused on outcomes. No fluff.',

    perksHeadline: 'Why Pota',
    rolesLabel:    'Open Positions',

    noPositionsHeadline: 'No open roles right now.',
    noPositionsBody:     'We hire when we find the right people, not when we have the right titles. Send us a spontaneous application below.',

    spontaneousLabel:    'Spontaneous Application',
    spontaneousHeadline: 'Nothing right for you?',
    spontaneousBody:     'We are always looking for sharp, curious people. Tell us what you do and how you would push us forward.',

    perk1Title: 'Hands-on work',         perk1Body: 'No layers, no fluff. You ship work that matters from day one, with senior people around you.',
    perk2Title: 'Real ownership',         perk2Body: 'You own what you make — strategy, execution and outcome — together with the team and the client.',
    perk3Title: 'Learn fast',             perk3Body: 'We work with brands of every size, across every channel. The variety of work compounds your skill set.',
    perk4Title: 'Flexible & remote-friendly', perk4Body: 'Bergamo HQ, hybrid by default, remote where it makes sense. Async-first, meeting-light.',
    perk5Title: 'Fair compensation',      perk5Body: 'Senior pay for senior work. Transparent ranges, performance bonuses, and yearly reviews.',

    ctaHeadline: 'Nothing right for you?',
    ctaBody: 'Send us an open application at jobs@potastudio.com',
    ctaButtonLabel: 'Send application',
    ctaButtonHref: 'mailto:jobs@potastudio.com',
  },
  {
    _id: pageId('careersPage', 'it'),
    _type: 'pageContent',
    pageId: 'careersPage',
    language: 'it',
    seoTitle: 'Lavora con noi | Pota Studio',
    seoDescription: 'Unisciti a Pota Studio. Posizioni aperte a Bergamo e ruoli remoti in Europa.',
    heroLabel: 'Lavora con noi',
    heroHeadline: 'Costruisci',
    heroAccent: 'la tua carriera qui.',
    heroBody: 'Senior, hands-on, concentrati sui risultati. Niente fuffa.',

    perksHeadline: 'Perché Pota',
    rolesLabel:    'Posizioni Aperte',

    noPositionsHeadline: 'Nessuna posizione aperta al momento.',
    noPositionsBody:     'Assumiamo quando troviamo le persone giuste, non quando ci serve riempire un ruolo. Mandaci una candidatura spontanea qui sotto.',

    spontaneousLabel:    'Candidatura Spontanea',
    spontaneousHeadline: 'Non c\u2019\u00e8 niente che fa per te?',
    spontaneousBody:     'Cerchiamo sempre persone curiose e in gamba. Raccontaci cosa fai e come potresti aiutarci a crescere.',

    perk1Title: 'Lavoro hands-on',           perk1Body: 'Niente livelli, niente fuffa. Lavori a cose che contano dal primo giorno, con persone senior accanto.',
    perk2Title: 'Vera ownership',             perk2Body: 'Possiedi quello che fai \u2014 strategia, esecuzione e risultato \u2014 insieme al team e al cliente.',
    perk3Title: 'Impari in fretta',            perk3Body: 'Lavoriamo con brand di ogni dimensione e su ogni canale. La variet\u00e0 fa crescere le tue competenze.',
    perk4Title: 'Flessibile e remote-friendly', perk4Body: 'HQ a Bergamo, ibrido di default, remote dove ha senso. Async-first, poche riunioni.',
    perk5Title: 'Compensi corretti',           perk5Body: 'Stipendi senior per lavoro senior. Range trasparenti, bonus performance e review annuali.',

    ctaHeadline: 'Non c\u2019\u00e8 niente che fa per te?',
    ctaBody: 'Mandaci una candidatura spontanea a jobs@potastudio.com',
    ctaButtonLabel: 'Invia candidatura',
    ctaButtonHref: 'mailto:jobs@potastudio.com',
  },

  // ── BLOG (EN/IT) ─────────────────────────────────────────────────────────
  {
    _id: pageId('blogPage', 'en'),
    _type: 'pageContent',
    pageId: 'blogPage',
    language: 'en',
    seoTitle: 'Blog | Pota Studio',
    seoDescription: 'Insights, case studies and playbooks from the Pota Studio team.',
    heroLabel: 'Insights',
    heroHeadline: 'Playbooks from',
    heroAccent: 'the trenches.',
    heroBody: 'Real-world learnings from the campaigns we run every day.',
    blogFeaturedLabel: 'Featured',
    blogLatestLabel: 'Latest articles',
    blogReadMoreLabel: 'Read more',
  },
  {
    _id: pageId('blogPage', 'it'),
    _type: 'pageContent',
    pageId: 'blogPage',
    language: 'it',
    seoTitle: 'Blog | Pota Studio',
    seoDescription: 'Insight, case study e playbook dal team di Pota Studio.',
    heroLabel: 'Insight',
    heroHeadline: 'Playbook dal',
    heroAccent: 'campo di battaglia.',
    heroBody: 'Imparamenti reali dalle campagne che gestiamo ogni giorno.',
    blogFeaturedLabel: 'In evidenza',
    blogLatestLabel: 'Ultimi articoli',
    blogReadMoreLabel: 'Leggi di piu',
  },

  // ── PRIVACY (EN/IT) ──────────────────────────────────────────────────────
  {
    _id: pageId('privacyPage', 'en'),
    _type: 'pageContent',
    pageId: 'privacyPage',
    language: 'en',
    seoTitle: 'Privacy Policy | Pota Studio',
    seoDescription: 'How Pota Studio collects, uses and protects your personal data.',
    heroLabel: 'Legal',
    heroHeadline: 'Privacy Policy',
    legalLastUpdated: 'April 2026',
    legalBody: [
      block('1. Introduction', 'h2'),
      block('Pota Studio ("we", "our") respects your privacy and is committed to protecting your personal data. This policy explains how we collect, use and protect information when you use our website.'),
      block('2. Data we collect', 'h2'),
      block('We collect information you provide directly (e.g. contact form), automatically (cookies, analytics) and from third parties (e.g. advertising platforms).'),
      block('3. How we use your data', 'h2'),
      block('We use your data to respond to your requests, improve our services, analyze site traffic and comply with legal obligations.'),
      block('4. Your rights', 'h2'),
      block('Under GDPR you have the right to access, rectify, erase, restrict processing, port and object to the processing of your data. To exercise these rights, write to privacy@potastudio.com.'),
      block('5. Contact', 'h2'),
      block('For any privacy-related question, contact us at privacy@potastudio.com.'),
    ],
  },
  {
    _id: pageId('privacyPage', 'it'),
    _type: 'pageContent',
    pageId: 'privacyPage',
    language: 'it',
    seoTitle: 'Privacy Policy | Pota Studio',
    seoDescription: 'Come Pota Studio raccoglie, usa e protegge i tuoi dati personali.',
    heroLabel: 'Legale',
    heroHeadline: 'Privacy Policy',
    legalLastUpdated: 'Aprile 2026',
    legalBody: [
      block('1. Introduzione', 'h2'),
      block('Pota Studio ("noi") rispetta la tua privacy ed e impegnata a proteggere i tuoi dati personali. Questa policy spiega come raccogliamo, usiamo e proteggiamo le informazioni quando usi il nostro sito.'),
      block('2. Dati che raccogliamo', 'h2'),
      block('Raccogliamo informazioni che fornisci direttamente (es. form contatti), automaticamente (cookie, analytics) e da terze parti (es. piattaforme pubblicitarie).'),
      block('3. Come usiamo i tuoi dati', 'h2'),
      block('Usiamo i tuoi dati per rispondere alle tue richieste, migliorare i nostri servizi, analizzare il traffico e rispettare obblighi di legge.'),
      block('4. I tuoi diritti', 'h2'),
      block('Ai sensi del GDPR hai il diritto di accesso, rettifica, cancellazione, limitazione, portabilita e opposizione al trattamento dei tuoi dati. Per esercitare questi diritti scrivici a privacy@potastudio.com.'),
      block('5. Contatti', 'h2'),
      block('Per qualsiasi domanda relativa alla privacy, contattaci a privacy@potastudio.com.'),
    ],
  },

  // ── COOKIE (EN/IT) ───────────────────────────────────────────────────────
  {
    _id: pageId('cookiePage', 'en'),
    _type: 'pageContent',
    pageId: 'cookiePage',
    language: 'en',
    seoTitle: 'Cookie Policy | Pota Studio',
    seoDescription: 'How Pota Studio uses cookies and similar tracking technologies.',
    heroLabel: 'Legal',
    heroHeadline: 'Cookie Policy',
    legalLastUpdated: 'April 2026',
    legalBody: [
      block('1. What are cookies', 'h2'),
      block('Cookies are small text files placed on your device when you visit a website. They help the site recognize you and remember preferences.'),
      block('2. Types of cookies we use', 'h2'),
      block('Technical (necessary for the site to function), analytics (to understand usage), and marketing (for personalized advertising).'),
      block('3. Managing cookies', 'h2'),
      block('You can manage or disable cookies through your browser settings or our cookie banner at any time.'),
      block('4. Contact', 'h2'),
      block('For any cookie-related question, contact us at privacy@potastudio.com.'),
    ],
  },
  {
    _id: pageId('cookiePage', 'it'),
    _type: 'pageContent',
    pageId: 'cookiePage',
    language: 'it',
    seoTitle: 'Cookie Policy | Pota Studio',
    seoDescription: 'Come Pota Studio utilizza cookie e tecnologie di tracciamento.',
    heroLabel: 'Legale',
    heroHeadline: 'Cookie Policy',
    legalLastUpdated: 'Aprile 2026',
    legalBody: [
      block('1. Cosa sono i cookie', 'h2'),
      block('I cookie sono piccoli file di testo salvati sul tuo dispositivo quando visiti un sito. Servono al sito a riconoscerti e ricordare preferenze.'),
      block('2. Tipologie di cookie usate', 'h2'),
      block('Tecnici (necessari al funzionamento del sito), analytics (per capire l\'utilizzo) e marketing (per pubblicita personalizzata).'),
      block('3. Gestione dei cookie', 'h2'),
      block('Puoi gestire o disattivare i cookie dalle impostazioni del tuo browser o dal nostro banner cookie in qualsiasi momento.'),
      block('4. Contatti', 'h2'),
      block('Per qualsiasi domanda sui cookie, contattaci a privacy@potastudio.com.'),
    ],
  },
]

// ────────────────────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────
// CLIENTS
// ───────────────────────────────────────────��────────────────────────────────

const CLIENTS = [
  // Alphabetical order by name
  { _id: 'client-accanto',         _type: 'client', name: 'Accanto',              industry: 'Fashion',           country: 'Italy',       order: 1 },
  { _id: 'client-cookies-digital', _type: 'client', name: 'Cookies Digital',      industry: 'Partner',           country: 'Italy',       featured: true,  order: 2 },
  { _id: 'client-da-nasti',        _type: 'client', name: 'Da Nasti',             industry: 'Food & Beverage',   country: 'Italy',       order: 5 },
  { _id: 'client-dieci-capital',   _type: 'client', name: 'Dieci Capital',        industry: 'Finance',           country: 'Italy',       order: 6 },
  { _id: 'client-exibrend',        _type: 'client', name: 'Exibrend',             industry: 'E-commerce',        country: 'Italy',       order: 7 },
  { _id: 'client-eyestudios',      _type: 'client', name: 'Eyestudios',           industry: 'Tech / E-commerce', country: 'Italy',       order: 8 },
  { _id: 'client-fast-costruzioni',_type: 'client', name: 'Fast Costruzioni',     industry: 'Construction',      country: 'Italy',       order: 9 },
  { _id: 'client-fg-valvole',      _type: 'client', name: 'FG Valvole',           industry: 'Industry',          country: 'Italy',       order: 10 },
  { _id: 'client-havit',           _type: 'client', name: 'Havit',                industry: 'Tech / E-commerce', country: 'Italy',       order: 11 },
  { _id: 'client-identity-event',  _type: 'client', name: 'Identity Event',       industry: 'Events',            country: 'Italy',       order: 12 },
  { _id: 'client-isybank',         _type: 'client', name: 'Isybank',              industry: 'Finance',           country: 'Italy',       featured: true,  order: 13 },
  { _id: 'client-lavamelotu',      _type: 'client', name: 'Lavamelotu',           industry: 'E-commerce',        country: 'Italy',       order: 14 },
  { _id: 'client-levitology',      _type: 'client', name: 'Levitology',           industry: 'Wellness',          country: 'Italy',       order: 15 },
  { _id: 'client-lucca-comics',    _type: 'client', name: 'Lucca Comics & Games 2025', industry: 'Events',          country: 'Italy',       featured: true,  order: 16 },
  { _id: 'client-marepineta',      _type: 'client', name: 'Marepineta Resort',    industry: 'Hospitality',       country: 'Italy',       order: 17 },
  { _id: 'client-marit',           _type: 'client', name: 'Marit SRL',            industry: 'E-commerce',        country: 'Italy',       order: 18 },
  { _id: 'client-mima-tennis',     _type: 'client', name: 'MiMA Tennis',          industry: 'Sport',             country: 'Italy',       order: 19 },
  { _id: 'client-mp-costruzioni',  _type: 'client', name: 'MP Costruzioni',       industry: 'Construction',      country: 'Italy',       order: 20 },
  { _id: 'client-pgi',             _type: 'client', name: 'PGI',                  industry: 'Industry',          country: 'Italy',       order: 21 },
  { _id: 'client-samsung',         _type: 'client', name: 'Samsung',              industry: 'Tech / E-commerce', country: 'South Korea', featured: true,  order: 22 },
  { _id: 'client-sellconds',       _type: 'client', name: 'Sellconds',            industry: 'E-commerce',        country: 'Italy',       order: 23 },
  { _id: 'client-sound-buzz',      _type: 'client', name: 'Sound and Buzz SRL',   industry: 'Audio / Events',    country: 'Italy',       order: 24 },
  { _id: 'client-dieci-capital',   _type: 'client', name: 'Dieci Capital',        industry: 'Finance',           country: 'Italy',       order: 25 },
  { _id: 'client-identity-event',  _type: 'client', name: 'Identity Event',       industry: 'Events',            country: 'Italy',       order: 26 },
]

// ────────────────────────────────────────────────────────────────────────────
// CASE STUDIES
// ────────────────────────────────────────────────────────────────────────────

const CASE_STUDIES = [
  {
    _id: 'caseStudy-samsung-tiktok',
    _type: 'caseStudy',
    slug: { _type: 'slug', current: 'samsung-tiktok' },
    client: 'Samsung',
    type: 'ADS',
    category: 'ads',
    tags: ['TikTok Ads', 'Meta ADS'],
    year: '2023',
    featured: true,
    isPublished: true,
    accent: '#1428A0',
    bg: '#00001A',
    description: 'Multi-market TikTok and Meta campaign spanning 5 countries.',
    metric: '+340% ROAS',
    challenge: "Samsung Italy needed to launch a new product line with a tight CPL target across 5 European markets simultaneously. Existing campaigns had plateaued and the in-house team lacked TikTok Ads expertise to scale.",
    approach: "We built a full-funnel TikTok + Meta paid structure with market-specific creative. Each country received localised UGC-style video ads tested in a rapid 2-week iteration cycle.",
    services: ['TikTok Ads', 'Meta Advertising', 'Creative Strategy', 'Media Buying', 'Performance Analytics'],
    metrics: [
      { _key: 'm1', label: 'ROAS', value: '+340%' },
      { _key: 'm2', label: 'Markets', value: '5 countries' },
      { _key: 'm3', label: 'CPL Reduction', value: '-41%' },
    ],
    results: "The campaign delivered a 340% ROAS, the highest in the brand's Italian digital history for a launch campaign. Samsung immediately renewed the contract for the next product cycle.",
    youtubeVideoId: 'dQw4w9WgXcQ',
  },
  {
    _id: 'caseStudy-isybank-ads',
    _type: 'caseStudy',
    slug: { _type: 'slug', current: 'isybank-ads' },
    client: 'Isybank',
    type: 'ADS',
    category: 'ads',
    tags: ['Meta ADS', 'Lead Gen'],
    year: '2022',
    featured: true,
    isPublished: true,
    accent: '#00C8FF',
    bg: '#001A1A',
    description: 'Reduced cost-per-lead by 62% for the Isybank app acquisition campaign.',
    metric: '-62% CPL',
    challenge: "Isybank, Intesa Sanpaolo's digital bank, needed to acquire app users at scale ahead of a major product launch. Existing Meta campaigns had a high CPL that made scaling economically unviable.",
    approach: "Full audit of the existing funnel: ad creative, landing page experience and audience targeting. We rebuilt the creative suite with benefit-driven messaging tested across 6 audience segments.",
    services: ['Meta Advertising', 'Creative Production', 'Conversion Rate Optimisation', 'Audience Strategy'],
    metrics: [
      { _key: 'm1', label: 'CPL Reduction', value: '-62%' },
      { _key: 'm2', label: 'App Downloads', value: '+215%' },
      { _key: 'm3', label: 'Campaign Duration', value: '90 days' },
    ],
    results: "CPL dropped 62% within 45 days. By campaign end, app downloads exceeded the target by 215%. The campaign became the internal benchmark for Isybank's digital acquisition team.",
    galleryUrls: [
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/205F603A-9596-49F8-B3E1-39C808C69A1B.JPEG-vpmWXaXTkYLEd7V8TfSwutmRIcnHQW.jpeg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ADE7D7EB-460A-4C69-A180-E27C0DF239FA.JPEG-qOCnlaweoN7NoB1xc7rUgjvTbHiUom.jpeg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/06%20%281%29-FmU7wIkxqZHGg2V5bFt32Lv1qc7mw6.jpg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/05-0z9ztbU6XQCEOZIhMbHmDHhtQjE7Qe.jpg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/06-3zEsdCb18mRUD1wmQq0GhxL7XTHill.jpg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4D51B4FD-72C4-4E1E-B931-7ABE2DCF3E13.JPEG-AM5hXFf8ly7ynLH5X84zUQME2doNEY.jpeg',
    ],
    youtubeVideoId: 'dQw4w9WgXcQ',
  },
  {
    _id: 'caseStudy-cookies-digital-partner',
    _type: 'caseStudy',
    slug: { _type: 'slug', current: 'cookies-digital-partner' },
    client: 'Cookies Digital',
    type: 'Partner',
    category: 'partner',
    year: '2024',
    featured: true,
    isPublished: true,
    accent: '#9333EA',
    bg: '#1A0A2E',
    description: 'Strategic partnership delivering integrated marketing solutions across multiple verticals.',
    metric: 'Strategic Partner',
    youtubeVideoId: 'dQw4w9WgXcQ',
  },
  {
    _id: 'caseStudy-levitology-social',
    _type: 'caseStudy',
    slug: { _type: 'slug', current: 'levitology-social' },
    client: 'Levitology',
    type: 'Social',
    category: 'social',
    tags: ['Social Media', 'Content Production'],
    year: '2024',
    featured: true,
    isPublished: true,
    accent: '#7C3AED',
    bg: '#1A0A2E',
    description: 'Built the digital presence for a wellness brand from zero to 50K engaged followers.',
    metric: '50K Followers',
    challenge: "Levitology, a premium wellness brand, had no social media presence and needed to establish credibility in a saturated market dominated by big players.",
    approach: "We developed a content strategy focused on education and authenticity. UGC-style videos, expert tips, and behind-the-scenes content created a genuine connection with the target audience.",
    services: ['Social Media Management', 'Content Production', 'Community Management', 'Influencer Seeding'],
    metrics: [
      { _key: 'm1', label: 'Followers', value: '50K' },
      { _key: 'm2', label: 'Avg Engagement', value: '7.2%' },
      { _key: 'm3', label: 'Monthly Reach', value: '1.2M' },
    ],
    results: 'In 8 months, Levitology became a recognizable name in the Italian wellness space with an engaged community that drives consistent organic sales.',
    galleryUrls: [
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Levitology_def-4-O2rcpRP50Xsu3NgDwAtqyBVvTXBqkc.jpg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Dyson%203.JPG-8fovcY4hzu2wjdYUeZGxjLVUhpz4fQ.jpeg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Dainese%20-%20AGV%204.JPG-GB05bEaWku48u9TdNWFzH86JhqQ2pC.jpeg',
    ],
    youtubeVideoId: 'dQw4w9WgXcQ',
  },
  {
    _id: 'caseStudy-samsung-galaxy',
    _type: 'caseStudy',
    slug: { _type: 'slug', current: 'samsung-galaxy' },
    client: 'Samsung',
    type: 'Content',
    category: 'content',
    tags: ['Content Production', 'Social Media'],
    year: '2024',
    featured: true,
    isPublished: true,
    accent: '#1428A0',
    bg: '#00001A',
    description: 'Galaxy S24 launch content strategy with 120+ assets across all platforms.',
    metric: '120+ Assets',
    challenge: "Samsung needed a massive content push for the Galaxy S24 Italian launch: product shots, lifestyle content, and platform-native videos, all within a 3-week timeline.",
    approach: "We assembled a dedicated production team and created a modular content system. Each asset was designed to work standalone and as part of a larger narrative across TikTok, Instagram, and YouTube.",
    services: ['Content Production', 'Video Production', 'Photography', 'Social Media Strategy'],
    metrics: [
      { _key: 'm1', label: 'Assets Delivered', value: '120+' },
      { _key: 'm2', label: 'Production Time', value: '3 weeks' },
      { _key: 'm3', label: 'Platforms', value: '5' },
    ],
    results: 'All 120+ assets were delivered on time and exceeded quality expectations. Samsung Italy used the content as a benchmark for future product launches.',
    youtubeVideoId: 'dQw4w9WgXcQ',
  },
  {
    _id: 'caseStudy-samsung-unpacked',
    _type: 'caseStudy',
    slug: { _type: 'slug', current: 'samsung-unpacked' },
    client: 'Samsung',
    type: 'Events',
    category: 'events',
    tags: ['Events', 'Content Production', 'Retail Activation'],
    year: '2026',
    featured: true,
    isPublished: true,
    accent: '#1428A0',
    bg: '#00001A',
    description: 'Galaxy Unpacked Roma 2026: exclusive retail activation for the Galaxy S26 launch.',
    metric: '5K+ Visitors',
    challenge: "Samsung Italy needed to create an immersive retail experience for the Galaxy S26 Unpacked event, driving foot traffic and product trials at MediaWorld locations across Rome.",
    approach: "We designed and executed a full retail activation including live streaming setup, product demo stations, Reviews Creator program, and on-site content production team capturing the event in real-time.",
    services: ['Event Production', 'Retail Activation', 'Content Production', 'Live Coverage'],
    metrics: [
      { _key: 'm1', label: 'Visitors', value: '5K+' },
      { _key: 'm2', label: 'Product Trials', value: '2.5K' },
      { _key: 'm3', label: 'Locations', value: '3' },
    ],
    results: 'The Galaxy Unpacked Roma activation became the most successful retail launch event for Samsung Italy, with record product trials and social media coverage that extended reach beyond the physical locations.',
    galleryUrls: [
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/RGB_9421-xts6k5vptkdeYNtxfqA1cmWHj4BOAC.jpg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Unpacked_roma-9-EjYrMt9OlC8CPFXN0hCgzWJbMvNv9J.jpg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/RGB_9294-ImCRWND7flLv1SZvde44a3Sz70fKpG.jpg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/RGB_9617-AIq9Cc1wAOj1mevOfiMdnhhTAOM0jA.jpg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/RGB_9413-rXNTMKSo8YpV52CmuHDPucitwK24As.jpg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC00996.JPG-UXVP4Hkr4B4E7kCZYfYxwtJCMmYrqt.jpeg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Unpacked_roma-31-sdK3io3HFEl9eBMFF9Qf2QNeRUMOiU.jpg',
    ],
    youtubeVideoId: 'dQw4w9WgXcQ',
  },
  {
    _id: 'caseStudy-sellconds-ecommerce',
    _type: 'caseStudy',
    slug: { _type: 'slug', current: 'sellconds-ecommerce' },
    client: 'Sellconds',
    type: 'Web',
    category: 'web',
    tags: ['E-commerce', 'Web Development'],
    year: '2024',
    featured: true,
    isPublished: true,
    accent: '#10B981',
    bg: '#001A14',
    description: 'E-commerce rebuild that increased conversion rate by 180% in 60 days.',
    metric: '+180% CVR',
    challenge: "Sellconds had an outdated e-commerce platform with poor mobile experience and a checkout flow that caused 70% cart abandonment.",
    approach: "Complete UX audit followed by a ground-up rebuild on Shopify Plus. We optimized every touchpoint: product pages, checkout flow, and post-purchase experience.",
    services: ['E-commerce Development', 'UX/UI Design', 'Conversion Optimization', 'Shopify Plus'],
    metrics: [
      { _key: 'm1', label: 'Conversion Rate', value: '+180%' },
      { _key: 'm2', label: 'Cart Abandonment', value: '-45%' },
      { _key: 'm3', label: 'Mobile Revenue', value: '+220%' },
    ],
    results: 'The new store launched in 60 days and immediately outperformed the old platform. Mobile revenue increased 220% in the first quarter.',
    youtubeVideoId: 'dQw4w9WgXcQ',
  },
  {
    _id: 'caseStudy-lucca-comics',
    _type: 'caseStudy',
    slug: { _type: 'slug', current: 'lucca-comics' },
    client: 'Lucca Comics & Games 2025',
    type: 'Social',
    category: 'social',
    tags: ['Social Media', 'Content Production', 'Events'],
    year: '2026',
    featured: true,
    isPublished: true,
    accent: '#F59E0B',
    bg: '#1A1400',
    description: 'Official social media partner for the largest pop culture event in Europe.',
    metric: '15M Reach',
    challenge: "Lucca Comics & Games 2025 needed to amplify their 2026 edition across social media, engaging both longtime fans and a new generation of attendees.",
    approach: "Real-time content creation during the 5-day event with a team of 8 creators. Live coverage, exclusive interviews, and behind-the-scenes content kept the audience engaged 24/7.",
    services: ['Social Media Management', 'Live Content Production', 'Influencer Coordination', 'Event Coverage'],
    metrics: [
      { _key: 'm1', label: 'Total Reach', value: '15M' },
      { _key: 'm2', label: 'Content Pieces', value: '300+' },
      { _key: 'm3', label: 'Engagement Rate', value: '9.1%' },
    ],
    results: 'The 2026 edition became the most talked-about Lucca Comics ever on social media, with record engagement and a 40% increase in ticket sales attributed to social.',
    galleryUrls: [
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC04575-NSjeHv9sdKZk3k009AL9Kmcrwg2fCk.jpg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC02938_HDR-mI2DwoDIDYP911g8atn16kcyga8qw9.jpg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC05717-AdVlqaRwn8bAATVVqQcQCXp4MRjTB6.jpg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC03947-Z1y35BamopqNLb76rxjd0fRXsGaxwg.jpg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC05681-TkiiA9x0T5d1F0Hdy3FAcxlJfriZbF.jpg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC01796-yyLm80o3VoJFh10Pp8CceHd6Gxgoii.jpg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC04419-T7ZQZ7XFLszN2PpEEQnt3UXHvNCeJ4.jpg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC02735-hMt0BBLNJWsK4uldWn0H2Jzh6wsL97.jpg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC00958-SAk2JHNC9AR82ubac3RnD44CybvuiI.jpg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC05737-7BfzcBbMpQTuUqkXUOCzluTETLvYPE.jpg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC01276-MwkYVtiS12CJoLDv3uLrH3TUGGwtvc.jpg',
    ],
    youtubeVideoId: 'dQw4w9WgXcQ',
  },
  {
    _id: 'caseStudy-lavamelotu-brand',
    _type: 'caseStudy',
    slug: { _type: 'slug', current: 'lavamelotu-brand' },
    client: 'Lavamelotu',
    type: 'Content',
    category: 'content',
    tags: ['Brand Strategy', 'Content Production'],
    year: '2025',
    featured: true,
    isPublished: true,
    accent: '#EC4899',
    bg: '#1A0010',
    description: 'Complete brand refresh and content system for a growing e-commerce brand.',
    metric: 'Full Rebrand',
    challenge: "Lavamelotu had grown organically but lacked a cohesive brand identity. Their visuals were inconsistent and failed to communicate their premium positioning.",
    approach: "We developed a complete brand system: visual identity, tone of voice, and content guidelines. Then we produced a full library of assets to launch the new brand across all touchpoints.",
    services: ['Brand Strategy', 'Visual Identity', 'Content Production', 'Social Media Templates'],
    metrics: [
      { _key: 'm1', label: 'Brand Assets', value: '200+' },
      { _key: 'm2', label: 'Social Growth', value: '+85%' },
      { _key: 'm3', label: 'Brand Recognition', value: '+120%' },
    ],
    results: 'The rebrand positioned Lavamelotu as a premium player in their category. Brand recognition surveys showed a 120% improvement within 6 months of launch.',
    galleryUrls: [
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/b70103f6-444e-40fd-8132-b4b2de9f9c41.JPG-btK9Q2dDDggUpPSsQqUZkljgotQ1iO.jpeg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/18766b0d-907f-43bc-89d7-5c2cf67c198b.JPG-af5H9HmrLdjmtvVYKCihabUIChmvea.jpeg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LT-Generale-Flyer-Approval--NHEp39sU8kXwtzmGT5oAJ1LhjcWJDs.png',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LT-25-Biglietto-da-visita-V2-jjDE45yaaYkUFVQsSvjZwa69XYa18t.png',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4a69b8a0-ecfa-40c5-b8ea-4b2c573577e3.JPG-b3tEFbRZBYqwqbWYv9ZqJNwDnISPp3.jpeg',
    ],
    youtubeVideoId: 'dQw4w9WgXcQ',
  },
  {
    _id: 'caseStudy-da-nasti-social',
    _type: 'caseStudy',
    slug: { _type: 'slug', current: 'da-nasti-social' },
    client: 'Da Nasti',
    type: 'Social',
    category: 'social',
    tags: ['Social Media', 'Content Production'],
    year: '2024',
    featured: false,
    isPublished: true,
    accent: '#D4A574',
    bg: '#1A1510',
    description: 'Social media management and content production for one of Naples\' most iconic pastry brands.',
    metric: '3x Engagement',
    challenge: "Da Nasti, a historic Neapolitan pastry shop, needed to modernize their digital presence while maintaining their artisanal authenticity and heritage.",
    approach: "We developed a content strategy that celebrated their craftsmanship through behind-the-scenes production content, seasonal campaigns, and community-driven storytelling.",
    services: ['Social Media Management', 'Content Production', 'Photography', 'Video Production'],
    metrics: [
      { _key: 'm1', label: 'Engagement Rate', value: '3x' },
      { _key: 'm2', label: 'Follower Growth', value: '+180%' },
      { _key: 'm3', label: 'Monthly Reach', value: '500K+' },
    ],
    results: 'Da Nasti tripled their social engagement and became a reference point for food content in Naples, driving significant foot traffic to their locations.',
    youtubeVideoId: 'dQw4w9WgXcQ',
  },
  {
    _id: 'caseStudy-accanto-social',
    _type: 'caseStudy',
    slug: { _type: 'slug', current: 'accanto-social' },
    client: 'Accanto',
    type: 'Social',
    category: 'social',
    tags: ['Social Media', 'Content Production'],
    year: '2024',
    featured: false,
    isPublished: true,
    accent: '#8B7355',
    bg: '#0D0A08',
    description: 'Full social media management and media production for a premium fashion brand.',
    metric: '+250% Reach',
    challenge: "Accanto needed to establish a distinctive voice in the crowded fashion social landscape while showcasing their premium positioning and Italian craftsmanship.",
    approach: "We created a sophisticated visual identity across social platforms, combining editorial photography, lifestyle content, and behind-the-scenes glimpses of their production process.",
    services: ['Social Media Management', 'Content Production', 'Photography', 'Creative Direction'],
    metrics: [
      { _key: 'm1', label: 'Reach Growth', value: '+250%' },
      { _key: 'm2', label: 'Engagement Rate', value: '5.2%' },
      { _key: 'm3', label: 'Content Pieces', value: '200+' },
    ],
    results: 'Accanto established themselves as a leading voice in Italian fashion social media, with content consistently outperforming industry benchmarks.',
    youtubeVideoId: 'dQw4w9WgXcQ',
  },
  {
    _id: 'caseStudy-fast-costruzioni-linkedin',
    _type: 'caseStudy',
    slug: { _type: 'slug', current: 'fast-costruzioni-linkedin' },
    client: 'Fast Costruzioni',
    type: 'Social',
    category: 'social',
    tags: ['LinkedIn', 'Graphic Production'],
    year: '2024',
    featured: false,
    isPublished: true,
    accent: '#0077B5',
    bg: '#0A1A2A',
    description: 'LinkedIn management and graphic production for a leading construction company.',
    metric: '+400% Impressions',
    challenge: "Fast Costruzioni needed to build thought leadership on LinkedIn to attract B2B clients and top talent in the competitive construction industry.",
    approach: "We developed a LinkedIn-first strategy focusing on project showcases, industry insights, company culture, and executive thought leadership content with custom graphic design.",
    services: ['LinkedIn Management', 'Graphic Production', 'Content Strategy', 'Employer Branding'],
    metrics: [
      { _key: 'm1', label: 'Impressions', value: '+400%' },
      { _key: 'm2', label: 'Connection Growth', value: '+85%' },
      { _key: 'm3', label: 'Lead Inquiries', value: '+120%' },
    ],
    results: 'Fast Costruzioni became a recognized voice in the Italian construction sector on LinkedIn, significantly increasing B2B inquiries and recruitment success.',
    youtubeVideoId: 'dQw4w9WgXcQ',
  },
  {
    _id: 'caseStudy-havit-ecommerce',
    _type: 'caseStudy',
    slug: { _type: 'slug', current: 'havit-ecommerce' },
    client: 'Havit',
    type: 'E-commerce',
    category: 'ecommerce',
    tags: ['Social Media', 'Content Production', 'TikTok Live', 'Brand Representation'],
    year: '2024',
    featured: true,
    isPublished: true,
    accent: '#FF4500',
    bg: '#1A0A00',
    description: 'Full-service digital presence: social management, media production, TikTok Live Shop, and brand representation.',
    metric: '€150K Live Sales',
    challenge: "Havit, a tech accessories brand, needed to establish a strong presence in the Italian market through innovative social commerce and authentic brand representation.",
    approach: "We built an integrated strategy combining daily social management, high-quality product content, pioneering TikTok Live shopping sessions, and official brand ambassador programs.",
    services: ['Social Media Management', 'Content Production', 'TikTok Live Shop', 'Brand Representation', 'Influencer Marketing'],
    metrics: [
      { _key: 'm1', label: 'TikTok Live Sales', value: '€150K' },
      { _key: 'm2', label: 'Social Following', value: '80K+' },
      { _key: 'm3', label: 'Live Sessions', value: '50+' },
    ],
    results: 'Havit became one of the first tech brands to successfully leverage TikTok Live Shop in Italy, generating over €150K in direct live sales and building a loyal community.',
    youtubeVideoId: 'dQw4w9WgXcQ',
  },
  {
    _id: 'caseStudy-dieci-capital',
    _type: 'caseStudy',
    slug: { _type: 'slug', current: 'dieci-capital' },
    client: 'Dieci Capital',
    type: 'Brand',
    category: 'brand',
    tags: ['Graphic Production', 'Brand Identity'],
    year: '2024',
    featured: false,
    isPublished: true,
    accent: '#C9A962',
    bg: '#0F0F0F',
    description: 'Complete graphic production and visual identity for an investment firm.',
    metric: 'Full Identity',
    challenge: "Dieci Capital needed a sophisticated visual identity that would convey trust, expertise, and premium positioning in the competitive investment sector.",
    approach: "We developed a comprehensive graphic production system including brand guidelines, presentation templates, marketing collateral, and digital assets that reflect the firm's values of precision and excellence.",
    services: ['Graphic Production', 'Brand Identity', 'Print Design', 'Digital Assets'],
    metrics: [
      { _key: 'm1', label: 'Brand Assets', value: '50+' },
      { _key: 'm2', label: 'Templates', value: '15' },
      { _key: 'm3', label: 'Deliverables', value: '100+' },
    ],
    results: 'Dieci Capital launched with a cohesive, premium brand identity that immediately positioned them as a credible player in the investment space.',
    youtubeVideoId: 'dQw4w9WgXcQ',
  },
  {
    _id: 'caseStudy-identity-event',
    _type: 'caseStudy',
    slug: { _type: 'slug', current: 'identity-event' },
    client: 'Identity Event',
    type: 'Full Service',
    category: 'fullservice',
    tags: ['Social Media', 'Content Production', 'Web Development'],
    year: '2024',
    featured: true,
    isPublished: true,
    accent: '#E91E63',
    bg: '#1A0A10',
    description: 'Full-service digital transformation: social management, media production, and custom website development.',
    metric: 'Full Digital',
    challenge: "Identity Event, an event planning company, needed a complete digital overhaul to showcase their work and attract high-end clients in the competitive events industry.",
    approach: "We delivered an integrated solution: strategic social media management to build brand awareness, professional media production for event documentation, and a custom-built website (identityevent.it) to serve as their digital home.",
    services: ['Social Media Management', 'Content Production', 'Web Design', 'Web Development', 'Photography', 'Video Production'],
    metrics: [
      { _key: 'm1', label: 'Website Launch', value: 'Live' },
      { _key: 'm2', label: 'Social Growth', value: '+300%' },
      { _key: 'm3', label: 'Event Coverage', value: '25+' },
    ],
    results: 'Identity Event transformed their digital presence with a stunning new website and consistent social content, resulting in a 300% increase in inbound inquiries.',
    externalUrl: 'https://www.identityevent.it/it',
    youtubeVideoId: 'dQw4w9WgXcQ',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// TESTIMONIALS
// ──────────────────────────��─────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    _id: 'testimonial-alexandru-birleanu',
    _type: 'testimonial',
    quote: 'Working with Pota Studio was a turning point. They not only elevated our branding with impeccable communication, but revolutionized our workflow by implementing custom AI processes that dramatically cut our operational time. Rare professionals who combine creative vision with technical pragmatism.',
    quoteIt: 'Collaborare con Pota Studio e stato un punto di svolta. Non solo hanno elevato il nostro branding con una comunicazione impeccabile, ma hanno rivoluzionato il nostro workflow implementando processi AI su misura che hanno abbattuto i tempi operativi. Professionisti rari, capaci di unire visione creativa e pragmatismo tecnico.',
    author: 'Alexandru Birleanu',
    role: 'Founder',
    company: 'Lavamelotu',
    rating: 5,
    featured: true,
  },
  {
    _id: 'testimonial-walter-setti',
    _type: 'testimonial',
    quote: 'Pota Studio, with Sebastian, supported us in creating the introductory video for Sound & Buzz Srl for Expo Osaka 2025. He quickly understood the project and its objectives, transforming them into high-level content. Always precise, professional and engaged, he carefully followed even the post-delivery phases. An effective collaboration, based on an authentic human relationship, that we recommend for quality, reliability and genuine dedication to the project.',
    quoteIt: "Pota Studio, con Sebastian, ci ha supportati nella realizzazione del video introduttivo per Sound & Buzz Srl in occasione dell'Expo di Osaka 2025. Ha compreso rapidamente il progetto e i suoi obiettivi, trasformandoli in un contenuto di alto livello. Sempre preciso, professionale e coinvolto, ha seguito con attenzione anche le fasi successive alla consegna. Una collaborazione efficace, basata su un rapporto umano autentico, che consigliamo per qualita, affidabilita e reale dedizione al progetto.",
    author: 'Walter Setti',
    role: 'CEO',
    company: 'Sound and Buzz SRL',
    rating: 5,
    featured: true,
  },
  {
    _id: 'testimonial-michele-eleodori',
    _type: 'testimonial',
    quote: 'The marketing world is a sea full of pirates, and in my opinion Pota Studio is a safe harbor. Thank you Sebastian for the dedication you put into your work.',
    quoteIt: "Il mondo del marketing e un mare pieno di pirati e a mio avviso Pota Studio e un porto sicuro. Grazie Sebastian per l'impegno che metti nel tuo lavoro.",
    author: 'Michele Eleodori',
    role: 'Founder',
    company: 'Marit SRL',
    rating: 5,
    featured: true,
  },
]

// ────────────────────────────────────────────────────────────────────────────
// SITE SETTINGS
// ────────────────────────────────────────────────────────────────────────────

const SOCIALS = {
  instagram: 'https://www.instagram.com/pota.studio/',
  tiktok:    'https://www.tiktok.com/@potastudio',
  linkedin:  'https://www.linkedin.com/company/pota-studio/',
}

const SITE_SETTINGS = [
  {
    _id: 'siteSettings-en',
    _type: 'siteSettings',
    language: 'en',
    siteName: 'Pota Studio',
    siteTagline: 'Full service marketing agency.',
    navItems: [
      {
        _key: 'nav-services',
        label: 'Services',
        href: '/services',
        isLive: false,
        children: [
          { _key: 'nav-services-all',  label: 'All Services', href: '/services', isLive: false, isSoon: false },
          { _key: 'nav-services-soon', label: 'Coming Soon',  href: '',          isLive: false, isSoon: true  },
        ],
      },
      { _key: 'nav-work', label: 'Work', href: '/work', isLive: false },
      {
        _key: 'nav-about',
        label: 'About',
        href: '/about',
        isLive: false,
        children: [
          { _key: 'nav-about-us',      label: 'About Us', href: '/about',   isLive: false, isSoon: false },
          { _key: 'nav-about-careers', label: 'Careers',  href: '/careers', isLive: false, isSoon: false },
        ],
      },
      { _key: 'nav-blog', label: 'Blog', href: '/blog', isLive: false },
    ],
    navCtaLabel: "Let's Talk",
    navCtaHref:  '/contact',
    navComingSoonHeader: 'Coming Soon',
    navComingSoonFooter: 'New features arriving in 2026.',
    navComingSoonBadge:  'Soon',
    navComingSoonItems: [
      { _key: 'cs-1', title: 'Courses',           description: 'Professional training in social media, TikTok and digital marketing.', icon: 'courses' },
      { _key: 'cs-2', title: 'YouTube for Brands', description: 'Strategy, production and distribution for brands and SMBs.',          icon: 'play' },
      { _key: 'cs-3', title: 'Events',             description: 'Workshops, masterclasses and live events for creators and brands.',  icon: 'calendar' },
    ],
    footerTagline:   'Full service marketing agency.',
    footerCopyright: '© 2026 Pota Studio. All rights reserved.',
    footerAddress1:  'Ponte San Pietro, Bergamo, Italy',
    footerAddress2:  'Milan (Coming Soon)',
    footerVat:       'P.IVA IT04545460166',
    legalCompanyName: 'Anyped S.R.L.',
    legalRea:         'REA BG-123456',
    legalCapital:     'Cap. soc. €10.000 i.v.',
    legalAddress:     'Via Zanica 85, Bergamo 24126',
    privacyLabel: 'Privacy Policy',
    privacyHref:  '/privacy',
    cookieLabel:  'Cookie Policy',
    cookieHref:   '/cookie',
    footerColumns: [
      {
        _key: 'col-services',
        title: 'Services',
        links: [
          { _key: 'l-smm',       label: 'Social Media Management', href: '/services' },
          { _key: 'l-paid',      label: 'Paid Advertising',        href: '/services' },
          { _key: 'l-content',   label: 'Content Production',      href: '/services' },
          { _key: 'l-web',       label: 'Web Design & Dev',        href: '/services' },
          { _key: 'l-influencer',label: 'Influencer Marketing',    href: '/services' },
          { _key: 'l-brand',     label: 'Brand Representation',    href: '/services' },
        ],
      },
      {
        _key: 'col-company',
        title: 'Company',
        links: [
          { _key: 'l-about',   label: 'About',    href: '/about' },
          { _key: 'l-work',    label: 'Work',     href: '/work' },
          { _key: 'l-clients', label: 'Clients',  href: '/clients' },
          { _key: 'l-careers', label: 'Careers',  href: '/careers' },
          { _key: 'l-blog',    label: 'Blog',     href: '/blog' },
        ],
      },
      {
        _key: 'col-contact',
        title: 'Contact',
        links: [
          { _key: 'l-contact',   label: 'Get in Touch', href: '/contact' },
          { _key: 'l-careers2',  label: 'Work With Us', href: '/careers' },
          { _key: 'l-linkedin',  label: 'LinkedIn',     href: 'https://www.linkedin.com/company/potastudio' },
          { _key: 'l-instagram', label: 'Instagram',    href: 'https://www.instagram.com/potastudio' },
          { _key: 'l-tiktok',    label: 'TikTok',       href: 'https://www.tiktok.com/@potastudio' },
        ],
      },
    ],
    cookieBannerTitle:  'We use cookies',
    cookieBannerBody:   'We use cookies to improve your experience and for analytics. See our',
    cookieAcceptLabel:  'Accept All',
    cookieRejectLabel:  'Reject',
    seoDescription: 'Full service marketing agency.',
    socials: SOCIALS,
  },

  {
    _id: 'siteSettings-it',
    _type: 'siteSettings',
    language: 'it',
    siteName: 'Pota Studio',
    siteTagline: 'Full service marketing agency.',
    navItems: [
      {
        _key: 'nav-services',
        label: 'Servizi',
        href: '/it/services',
        isLive: false,
        children: [
          { _key: 'nav-services-all',  label: 'Tutti i servizi', href: '/it/services', isLive: false, isSoon: false },
          { _key: 'nav-services-soon', label: 'Coming Soon',     href: '',             isLive: false, isSoon: true  },
        ],
      },
      { _key: 'nav-work', label: 'Lavori', href: '/it/work', isLive: false },
      {
        _key: 'nav-about',
        label: 'Chi siamo',
        href: '/it/about',
        isLive: false,
        children: [
          { _key: 'nav-about-us',      label: 'Chi siamo',      href: '/it/about',   isLive: false, isSoon: false },
          { _key: 'nav-about-careers', label: 'Lavora con noi', href: '/it/careers', isLive: false, isSoon: false },
        ],
      },
      { _key: 'nav-blog', label: 'Blog', href: '/it/blog', isLive: false },
    ],
    navCtaLabel: 'Contattaci',
    navCtaHref:  '/it/contact',
    navComingSoonHeader: 'In Arrivo',
    navComingSoonFooter: 'Nuove funzionalità in arrivo nel 2026.',
    navComingSoonBadge:  'Soon',
    navComingSoonItems: [
      { _key: 'cs-1', title: 'Corsi',              description: 'Formazione professionale su social media, TikTok e digital marketing.', icon: 'courses' },
      { _key: 'cs-2', title: 'YouTube per Aziende', description: 'Strategie, produzione e distribuzione video per brand e PMI.',          icon: 'play' },
      { _key: 'cs-3', title: 'Eventi',              description: 'Workshop, masterclass ed eventi live pensati per creator e brand.',    icon: 'calendar' },
    ],
    footerTagline:   'Full service marketing agency.',
    footerCopyright: '© 2026 Pota Studio. Tutti i diritti riservati.',
    footerAddress1:  'Ponte San Pietro, Bergamo, Italia',
    footerAddress2:  'Milano (Coming Soon)',
    footerVat:       'P.IVA IT04545460166',
    legalCompanyName: 'Anyped S.R.L.',
    legalRea:         'REA BG-123456',
    legalCapital:     'Cap. soc. €10.000 i.v.',
    legalAddress:     'Via Zanica 85, Bergamo 24126',
    privacyLabel: 'Privacy Policy',
    privacyHref:  '/it/privacy',
    cookieLabel:  'Cookie Policy',
    cookieHref:   '/it/cookie',
    footerColumns: [
      {
        _key: 'col-services',
        title: 'Servizi',
        links: [
          { _key: 'l-smm',       label: 'Social Media Management', href: '/it/services' },
          { _key: 'l-paid',      label: 'Paid Advertising',        href: '/it/services' },
          { _key: 'l-content',   label: 'Content Production',      href: '/it/services' },
          { _key: 'l-web',       label: 'Web Design & Dev',        href: '/it/services' },
          { _key: 'l-influencer',label: 'Influencer Marketing',    href: '/it/services' },
          { _key: 'l-brand',     label: 'Brand Representation',    href: '/it/services' },
        ],
      },
      {
        _key: 'col-company',
        title: 'Studio',
        links: [
          { _key: 'l-about',   label: 'Chi siamo', href: '/it/about' },
          { _key: 'l-work',    label: 'Lavori',    href: '/it/work' },
          { _key: 'l-clients', label: 'Clienti',   href: '/it/clients' },
          { _key: 'l-careers', label: 'Careers',   href: '/it/careers' },
          { _key: 'l-blog',    label: 'Blog',      href: '/it/blog' },
        ],
      },
      {
        _key: 'col-contact',
        title: 'Contatti',
        links: [
          { _key: 'l-contact',   label: 'Contattaci',     href: '/it/contact' },
          { _key: 'l-careers2',  label: 'Lavora con noi', href: '/it/careers' },
          { _key: 'l-linkedin',  label: 'LinkedIn',       href: 'https://www.linkedin.com/company/potastudio' },
          { _key: 'l-instagram', label: 'Instagram',      href: 'https://www.instagram.com/potastudio' },
          { _key: 'l-tiktok',    label: 'TikTok',         href: 'https://www.tiktok.com/@potastudio' },
        ],
      },
    ],
    cookieBannerTitle:  'Usiamo i cookie',
    cookieBannerBody:   'Usiamo i cookie per migliorare la tua esperienza e per analisi. Consulta la nostra',
    cookieAcceptLabel:  'Accetta tutti',
    cookieRejectLabel:  'Rifiuta',
    seoDescription: 'Full service marketing agency.',
    socials: SOCIALS,
  },
]

// ──────────────────────────���─────────────────────────────────────────────────
// SEED HANDLER
// ────────────────────────────────────────────────��──���────────────────────────

export async function GET(req: Request) {
  const url = new URL(req.url)
  const secret = url.searchParams.get('secret')
  const shouldPurge = url.searchParams.get('purge') === '1'

  if (secret !== SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.SANITY_API_TOKEN) {
    return NextResponse.json(
      { error: 'SANITY_API_TOKEN is not set. Add it to the project environment variables.' },
      { status: 500 },
    )
  }

  const DOCS = [
    ...PAGE_CONTENT,
    
    ...CLIENTS,
    ...CASE_STUDIES,
    ...TESTIMONIALS,
    ...SITE_SETTINGS,
  ]

  const deleted: string[] = []
  const seeded: string[] = []
  const errors: { _id: string; message: string }[] = []

  try {
    // 1. Optional purge — remove all managed doc types so we start fresh
    if (shouldPurge) {
      const typesToPurge = ['pageContent', 'client', 'caseStudy', 'testimonial']
      for (const type of typesToPurge) {
        const orphans: { _id: string }[] = await client.fetch(
          `*[_type == $type]{ _id }`,
          { type },
        )
        for (const doc of orphans) {
          try {
            await client.delete(doc._id)
            deleted.push(doc._id)
          } catch (err) {
            errors.push({ _id: doc._id, message: (err as Error).message })
          }
        }
      }
    }

    // 2. Seed (createOrReplace = idempotent)
    for (const doc of DOCS) {
      try {
        await client.createOrReplace(doc as { _id: string; _type: string })
        seeded.push(doc._id)
      } catch (err) {
        errors.push({ _id: doc._id, message: (err as Error).message })
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      seeded: seeded.length,
      failed: errors.length,
      deleted: deleted.length,
      errors,
      message: `Seeded ${seeded.length} docs${shouldPurge ? `, purged ${deleted.length}` : ''}${errors.length > 0 ? ` with ${errors.length} errors` : ''}.`,
    })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message, seeded: seeded.length, deleted: deleted.length },
      { status: 500 },
    )
  }
}
