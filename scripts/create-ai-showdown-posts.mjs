import { createClient } from '@sanity/client';
import https from 'https';
import fs from 'fs';

const c = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// 1. Upload cover image
const imgUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SxU3uZ9hfxbVwcUFtEn2H3-1200-80-tvX05uxAemFtCsDM3ni8PfuZACtUKR.png';
const tmpPath = '/tmp/ai-showdown-cover.png';

await new Promise((resolve, reject) => {
  const file = fs.createWriteStream(tmpPath);
  const get = (u) => https.get(u, (res) => {
    if ([301,302,307,308].includes(res.statusCode)) return get(res.headers.location);
    res.pipe(file);
    file.on('finish', () => { file.close(); resolve(); });
  }).on('error', reject);
  get(imgUrl);
});
console.log('Downloaded cover:', fs.statSync(tmpPath).size, 'bytes');

const asset = await c.assets.upload('image', fs.createReadStream(tmpPath), {
  filename: 'claude-chatgpt-gemini-ai-showdown-2026.png',
  contentType: 'image/png',
});
console.log('Asset:', asset._id);

const coverImage = {
  _type: 'image',
  asset: { _type: 'reference', _ref: asset._id },
  alt: 'Claude 4.7 vs ChatGPT 5.5 vs Gemini 3.0',
};

const catRef = (key, ref) => ({ _key: key, _type: 'reference', _ref: ref });

const blk = (key, text, style = 'normal') => ({
  _type: 'block', _key: key, style,
  markDefs: [],
  children: [{ _type: 'span', _key: key + 's', text, marks: [] }],
});

const h2 = (key, text) => blk(key, text, 'h2');
const h3 = (key, text) => blk(key, text, 'h3');
const p  = (key, text) => blk(key, text, 'normal');

// ---- ENGLISH BODY ----
const enBody = [
  h2('b01', 'The Era of Super-Intelligence: Where We Stand in 2026'),
  p('b02', "Welcome to the future. In 2024, we discussed chatbots writing emails; in May 2026, we discuss Cognitive Systems managing entire marketing departments. The pace of innovation has delivered versions that seemed like science fiction just two years ago. At Pota Studio, we've integrated these models into our daily global workflow to manage over $2.5M in ad spend, and the distinction between models has become a matter of strategic nuance."),
  p('b03', 'In this playbook, we analyze the AI Triumvirate of 2026 to determine which engine should power your global brand.'),
  h2('b04', '1. Claude 4.7 Opus (Anthropic): The Pinnacle of Language'),
  p('b05', 'Anthropic, with the release of Claude 4.7 Opus, has achieved a milestone: it has almost entirely eliminated the robotic aftertaste typical of AI.'),
  h3('b06', 'Mastery of Creative Writing'),
  p('b07', "Claude 4.7 no longer writes like an AI; it writes like a senior copywriter with 15 years of experience. Its ability to handle irony, metaphors, and subtle tones of voice makes it the tool of choice for Pota Studio when we need to draft long-form blog posts, emotional video scripts, or high-converting newsletters for international markets."),
  h3('b08', 'Infinite Context Window'),
  p('b09', "With a context window now reaching 500k tokens, Claude 4.7 can read a company's entire documentation, all its past posts, and its technical manuals, instantly becoming an expert on that brand. There's no longer a need for repetitive instructions; Claude knows your brand better than anyone."),
  h3('b10', 'When to Choose It'),
  p('b11', 'Select Claude 4.7 if your priority is content quality, brand consistency, and the analysis of vast volumes of unstructured text. It is the model we use for this very blog.'),
  h2('b12', '2. ChatGPT 5.5 (OpenAI): The Architect of Automation'),
  p('b13', "OpenAI has met the challenge with GPT-5.5, focusing on the ability to do as much as to say."),
  h3('b14', 'Real Autonomous Agents'),
  p('b15', "The true strength of ChatGPT 5.5 is not just text, but its Operational Agents. These are no longer simple bots but entities capable of connecting to your CRM, your advertising platform, and even your bank account (with appropriate permissions) to execute tasks. You can tell GPT-5.5 to optimize campaigns based on yesterday's sales data and send a report on Slack, and it will execute."),
  h3('b16', 'Engineering-Grade Coding'),
  p('b17', 'For web development and complex system integration, GPT-5.5 remains unsurpassed. Its ability to write clean Next.js 15+ or Python code for data analysis is so precise that it has reduced internal development time by 60% for our global clients.'),
  h3('b18', 'When to Choose It'),
  p('b19', 'Select ChatGPT 5.5 if you need operational efficiency, process automation, and logical analysis of structured data.'),
  h2('b20', '3. Gemini 3.0 (Google): The King of Total Multimodality'),
  p('b21', 'Google has finally unleashed the full power of its TPU chips with Gemini 3.0, the fastest and most visual model on the market.'),
  h3('b22', 'Real-Time Video Vision and Analysis'),
  p('b23', "Gemini 3.0 doesn't analyze videos frame by frame; it understands them in real-time. It can watch a 3-hour webinar recording and instantly generate 10 TikTok clips based on moments of highest emotional engagement detected in participants' faces. This native multimodal capability is what makes it unique."),
  h3('b24', 'Workspace 2.0 Integration'),
  p('b25', 'For companies living on Google Workspace, Gemini 3.0 is the invisible assistant. It drafts documents based on Meet conversations, organizes calendars, and analyzes Google Sheets with millions of rows in seconds.'),
  h3('b26', 'When to Choose It'),
  p('b27', 'Select Gemini 3.0 if your business is multimedia-heavy (video/audio), if you need extreme speed, or if your infrastructure is entirely Google-based.'),
  h2('b28', 'The Future According to Pota Studio: AI Orchestration'),
  p('b29', "In 2026, the question is no longer which AI is best but how to make them work together. At Pota Studio, we use an Orchestration system: Gemini 3.0 analyzes our clients' raw video footage, Claude 4.7 writes the script and copy based on that analysis, and ChatGPT 5.5 automates the publishing and performance data analysis. This is the true power of AI Marketing in 2026."),
  p('b30', 'Ready to transform your brand into an AI-first organization and scale your global results? Contact Pota Studio for a strategic consultation on frontier models.'),
];

// ---- ITALIAN BODY ----
const itBody = [
  h2('c01', "L'Era della Super-Intelligenza: Dove Siamo nel 2026"),
  p('c02', "Benvenuti nel futuro. Se nel 2024 parlavamo di chatbot che scrivevano email, nel maggio 2026 parliamo di Sistemi Cognitivi che gestiscono interi reparti marketing. La velocita dell'innovazione ci ha portato a versioni che solo due anni fa sembravano fantascienza. In Pota Studio, abbiamo integrato questi modelli nel nostro workflow quotidiano per gestire oltre 2.5M EUR di ad spend, e la differenza tra un modello e l'altro e diventata una questione di sfumatura strategica."),
  p('c03', "In questo playbook, analizzeremo il Triumvirato dell'AI del 2026 per capire quale motore debba spingere la tua azienda."),
  h2('c04', "1. Claude 4.7 Opus (Anthropic): La Perfezione del Linguaggio"),
  p('c05', "Anthropic, con il rilascio di Claude 4.7 Opus, ha compiuto il miracolo: ha eliminato quasi totalmente quel retrogusto robotico tipico dell'AI."),
  h3('c06', 'Il Dominio della Scrittura Creativa'),
  p('c07', "Claude 4.7 non scrive piu come un'AI; scrive come un copywriter senior con 15 anni di esperienza. La sua capacita di gestire l'ironia, le metafore e i toni di voce sottili lo rende lo strumento d'elezione per Pota Studio quando dobbiamo redigere blog post lunghi, script per video emozionali o newsletter che devono realmente convertire."),
  h3('c08', 'Finestra di Contesto Infinita'),
  p('c09', "Con una finestra di contesto che ora tocca i 500k token, Claude 4.7 puo leggere l'intera documentazione di un'azienda, tutti i suoi post passati e i suoi manuali tecnici, diventando istantaneamente l'esperto di quel brand. Non c'e piu bisogno di dare istruzioni ripetitive; Claude conosce il tuo brand meglio di chiunque altro."),
  h3('c10', 'Quando Sceglierlo'),
  p('c11', "Scegli Claude 4.7 se la tua priorita e la qualita del contenuto, la coerenza del brand e l'analisi di grandi volumi di testo non strutturato. E il modello che usiamo per questo blog."),
  h2('c12', "2. ChatGPT 5.5 (OpenAI): L'Architetto dell'Automazione"),
  p('c13', "OpenAI ha risposto alla sfida con GPT-5.5, puntando tutto sulla capacita di fare oltre che di dire."),
  h3('c14', 'Agenti Autonomi Reali'),
  p('c15', "La vera forza di ChatGPT 5.5 non e solo il testo, ma i suoi Agenti Operativi. Questi non sono piu semplici bot, ma entita capaci di connettersi al tuo CRM, alla tua piattaforma di advertising e persino al tuo conto bancario (con i dovuti permessi) per eseguire task. Puoi dire a GPT-5.5 di ottimizzare le campagne Meta Ads basandoti sui dati di vendita di ieri e inviare un report su Slack, e lui lo fara."),
  h3('c16', 'Coding di Grado Ingegneristico'),
  p('c17', "Per lo sviluppo web e l'integrazione di sistemi complessi, GPT-5.5 rimane insuperato. La sua capacita di scrivere codice Next.js 15+ o Python per l'analisi dei dati e cosi precisa che ha ridotto i tempi di sviluppo interno del 60%."),
  h3('c18', 'Quando Sceglierlo'),
  p('c19', 'Scegli ChatGPT 5.5 se hai bisogno di efficienza operativa, automazione dei processi e analisi logica di dati strutturati.'),
  h2('c20', '3. Gemini 3.0 (Google): Il Re della Multimodalita Totale'),
  p('c21', 'Google ha finalmente sprigionato tutta la potenza dei suoi chip TPU con Gemini 3.0, il modello piu veloce e visivo sul mercato.'),
  h3('c22', 'Visione e Analisi Video Real-Time'),
  p('c23', "Gemini 3.0 non analizza i video fotogramma per fotogramma; li comprende in tempo reale. Puo guardare una registrazione di un webinar di 3 ore e generare istantaneamente 10 clip per TikTok basate sui momenti di maggiore engagement emotivo rilevati nei volti dei partecipanti. Questa capacita multimodale e cio che lo rende unico."),
  h3('c24', 'Integrazione Workspace 2.0'),
  p('c25', "Per le aziende che vivono su Google Workspace, Gemini 3.0 e l'assistente invisibile. Scrive bozze di documenti basandosi su conversazioni avute su Meet, organizza il calendario e analizza fogli di calcolo Google Sheets con milioni di righe in pochi secondi."),
  h3('c26', 'Quando Sceglierlo'),
  p('c27', "Scegli Gemini 3.0 se il tuo business e multimediale (video/audio), se hai bisogno di velocita estrema o se la tua infrastruttura e interamente basata su Google."),
  h2('c28', "Il Futuro secondo Pota Studio: L'Orchestrazione AI"),
  p('c29', "Nel 2026, la domanda non e piu quale AI e la migliore, ma come le faccio lavorare insieme. In Pota Studio, utilizziamo un sistema di Orchestrazione: Gemini 3.0 analizza i video grezzi dei nostri clienti, Claude 4.7 scrive lo script e il copy basandosi su quell'analisi, e ChatGPT 5.5 automatizza la pubblicazione e l'analisi dei dati di performance. Questa e la vera potenza dell'AI Marketing nel 2026."),
  p('c30', "Vuoi trasformare la tua azienda in un'organizzazione AI-first e scalare i tuoi risultati? Contatta Pota Studio per una consulenza strategica sui modelli di frontiera."),
];

const enFaq = [
  { _key: 'fq-en-01', question: 'Which AI model is best in 2026?', answer: 'As of May 2026, Claude 4.7 Opus leads in creative writing, ChatGPT 5.5 leads in automation and coding, and Gemini 3.0 leads in multimodality and speed. The best strategy is to orchestrate all three based on the task.' },
  { _key: 'fq-en-02', question: 'What is Claude 4.7 Opus best at?', answer: 'Claude 4.7 Opus excels at creative writing, brand content, long-form copy, and understanding large volumes of unstructured text thanks to its 500k token context window.' },
  { _key: 'fq-en-03', question: 'What is ChatGPT 5.5 best at?', answer: 'GPT-5.5 is the leader in operational automation, autonomous agents, and engineering-grade coding. It can execute complex multi-step tasks across CRMs, ad platforms, and other business tools.' },
  { _key: 'fq-en-04', question: 'What is Gemini 3.0 best at?', answer: 'Gemini 3.0 is the king of multimodality — it can analyze real-time video streams, understand audio, and integrates natively across Google Workspace. It also has the largest context window at 2M+ tokens.' },
];

const itFaq = [
  { _key: 'fq-it-01', question: 'Quale modello AI e il migliore nel 2026?', answer: "A Maggio 2026, Claude 4.7 Opus e il migliore per la scrittura creativa, ChatGPT 5.5 per l'automazione e il coding, e Gemini 3.0 per la multimodalita e la velocita. La strategia vincente e orchestrarli tutti e tre." },
  { _key: 'fq-it-02', question: 'In cosa eccelle Claude 4.7 Opus?', answer: "Claude 4.7 Opus eccelle nella scrittura creativa, nel content marketing, nel copy long-form e nell'analisi di grandi volumi di testo non strutturato, grazie alla sua finestra di contesto da 500k token." },
  { _key: 'fq-it-03', question: 'In cosa eccelle ChatGPT 5.5?', answer: "GPT-5.5 e il leader nell'automazione operativa, negli agenti autonomi e nel coding di precisione. Puo eseguire task complessi su CRM, piattaforme adv e altri strumenti aziendali." },
  { _key: 'fq-it-04', question: 'In cosa eccelle Gemini 3.0?', answer: "Gemini 3.0 e il re della multimodalita: analizza video in real-time, comprende l'audio e si integra nativamente su Google Workspace. Ha anche la finestra di contesto piu grande con 2M+ token." },
];

const enDoc = {
  _id: 'post-en-claude-chatgpt-gemini-2026',
  _type: 'blogPost',
  language: 'en',
  title: 'Claude 4.7 vs ChatGPT 5.5 vs Gemini 3.0: The Ultimate AI Showdown (May 2026)',
  slug: { _type: 'slug', current: 'claude-4-7-chatgpt-5-5-gemini-3-0-ai-comparison-2026' },
  publishedAt: '2026-05-08T10:00:00.000Z',
  author: { _type: 'reference', _ref: 'author-sebastian-bonfanti' },
  categories: [catRef('cat-0', 'cat-digital-marketing'), catRef('cat-1', 'cat-strategy')],
  metaTitle: 'Claude 4.7 vs ChatGPT 5.5 vs Gemini 3.0: The Ultimate AI Showdown (May 2026)',
  metaDescription: 'A deep dive into the AI giants of 2026. Discover why Claude 4.7 Opus is dominating creative writing and how GPT-5.5 and Gemini 3.0 are reshaping global business strategies.',
  tldr: 'Claude 4.7 Opus leads creative writing, ChatGPT 5.5 leads automation and coding, Gemini 3.0 leads multimodality. The winning strategy for 2026: orchestrate all three.',
  coverImage,
  body: enBody,
  faqItems: enFaq,
};

const itDoc = {
  _id: 'post-it-claude-chatgpt-gemini-2026',
  _type: 'blogPost',
  language: 'it',
  title: 'Claude 4.7 vs ChatGPT 5.5 vs Gemini 3.0: La Guida Definitiva ai Modelli AI (Maggio 2026)',
  slug: { _type: 'slug', current: 'claude-4-7-chatgpt-5-5-gemini-3-0-confronto-ai-2026' },
  publishedAt: '2026-05-08T10:00:00.000Z',
  author: { _type: 'reference', _ref: 'author-sebastian-bonfanti' },
  categories: [catRef('cat-0', 'cat-marketing-digitale'), catRef('cat-1', 'cat-strategy')],
  metaTitle: 'Claude 4.7 vs ChatGPT 5.5 vs Gemini 3.0: La Guida Definitiva ai Modelli AI (Maggio 2026)',
  metaDescription: "Analisi profonda dei giganti dell'AI nel 2026. Scopri perche Claude 4.7 Opus sta dominando la scrittura creativa e come GPT-5.5 e Gemini 3.0 stanno trasformando il business.",
  tldr: "Claude 4.7 Opus domina la scrittura creativa, ChatGPT 5.5 l'automazione, Gemini 3.0 la multimodalita. La strategia vincente nel 2026: orchestrarli tutti e tre.",
  coverImage,
  body: itBody,
  faqItems: itFaq,
};

const tx = c.transaction();
tx.createOrReplace(enDoc);
tx.createOrReplace(itDoc);
await tx.commit();
console.log('Created EN:', enDoc._id, '->', enDoc.slug.current);
console.log('Created IT:', itDoc._id, '->', itDoc.slug.current);
console.log('DONE');
