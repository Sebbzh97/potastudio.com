/**
 * Auto-extract FAQPage entries from a Portable Text blog body.
 *
 * Heuristic: any H2 whose plain-text either ends with "?" or starts with a
 * common interrogative word (What / How / Why / Come / Cosa / Perché / …) is
 * treated as a FAQ Question. The "answer" is the concatenation of the text
 * blocks that follow the H2, up to (but not including) the next H2 / H3 / FAQ
 * boundary. This keeps the heuristic conservative — only well-structured
 * articles ("Q-style H2 + paragraph + paragraph") get picked up — avoiding
 * noisy or false-positive FAQs.
 *
 * Used as a fallback when the post does not have curated `faqItems[]` from
 * Sanity. Curated items always win because they are editor-validated.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PtBlock = any

const QUESTION_STARTERS_EN = [
  "what",
  "how",
  "why",
  "when",
  "where",
  "who",
  "which",
  "can",
  "could",
  "does",
  "do",
  "is",
  "are",
  "should",
  "will",
  "would",
]

const QUESTION_STARTERS_IT = [
  "cosa",
  "come",
  "perché",
  "perche",
  "quando",
  "dove",
  "chi",
  "quale",
  "quali",
  "puoi",
  "puo",
  "può",
  "posso",
  "devo",
  "si può",
  "si puo",
  "è",
  "e",
  "sono",
]

const QUESTION_STARTERS = [...QUESTION_STARTERS_EN, ...QUESTION_STARTERS_IT]

/** Flatten a PT text block to a plain string (text spans only). */
function blockToText(block: PtBlock): string {
  if (!block || block._type !== "block") return ""
  if (!Array.isArray(block.children)) return ""
  return block.children
    .map((c: { text?: string }) => c?.text ?? "")
    .join("")
    .trim()
}

/** True if `text` looks like a question worth turning into FAQ entry. */
function looksLikeQuestion(text: string): boolean {
  const trimmed = text.trim()
  if (!trimmed) return false
  if (trimmed.endsWith("?")) return true
  const firstWord = trimmed.split(/\s+/)[0]?.toLowerCase()
  return Boolean(firstWord && QUESTION_STARTERS.includes(firstWord))
}

export interface ExtractedFaq {
  question: string
  answer: string
}

/**
 * Walk the PT body. When we hit an H2 that looks like a question, accumulate
 * the following text blocks until the next H2 / H3 (or end of body) and emit
 * a `{ question, answer }` pair.
 *
 * @param body PortableText body array from Sanity
 * @param maxItems Hard cap so we never spam FAQPage with 30 entries
 */
export function extractFaqFromBody(
  body: PtBlock[] | null | undefined,
  maxItems = 8,
): ExtractedFaq[] {
  if (!Array.isArray(body) || body.length === 0) return []

  const faqs: ExtractedFaq[] = []
  let current: { question: string; answerParts: string[] } | null = null

  const flushCurrent = () => {
    if (!current) return
    const answer = current.answerParts.join(" ").replace(/\s+/g, " ").trim()
    // Only keep the pair if there is at least one sentence of answer.
    if (answer.length >= 30) {
      faqs.push({ question: current.question, answer })
    }
    current = null
  }

  for (const block of body) {
    if (!block || block._type !== "block") {
      // Non-text blocks (images, code, tables, callouts) end the current answer.
      // We DO NOT emit them into the answer text — Google rejects FAQ answers
      // with embedded media — but they still terminate the answer collection.
      if (current) flushCurrent()
      continue
    }

    const style = block.style ?? "normal"

    // Boundary headings — stop accumulating into the current answer.
    if (style === "h2" || style === "h3") {
      flushCurrent()
      if (style === "h2") {
        const text = blockToText(block)
        if (looksLikeQuestion(text)) {
          current = { question: text, answerParts: [] }
        }
      }
      continue
    }

    // Plain paragraph or list item → goes into the current answer (if any).
    if (current && (style === "normal" || style === "blockquote")) {
      const text = blockToText(block)
      if (text) current.answerParts.push(text)
    }

    // Stop early once we have enough.
    if (faqs.length >= maxItems) break
  }

  // Flush the last buffered Q at end of body.
  flushCurrent()

  return faqs.slice(0, maxItems)
}

/**
 * Combined helper: returns the post's FAQ entries from the most trustworthy
 * source available. Resolution order:
 *
 *   1. Curated `faqItems[]` from Sanity — editor-validated, always wins.
 *   2. Body H2-extracted FAQs — auto-mined when no curated list exists
 *      (only kept when the H2 looks like a real question).
 *
 * IMPORTANT (audit fix, 2026-05): we DO NOT inject the article title as a
 * Question entry anymore. The article title is a STATEMENT (e.g.
 * "OpenAI Ads: The Future of Advertising"), and Schema.org FAQPage requires
 * `Question.name` to be an actual question. Pairing `postTitle` with
 * `quickAnswer` produced invalid markup that could trigger Google manual
 * actions against the rich result. The visible TL;DR / Quick Answer block
 * is rendered separately on-page; it is not part of the FAQPage JSON-LD.
 *
 * The optional `postTitle` and `quickAnswer` arguments are kept in the
 * signature only so existing callers do not break — they are now ignored
 * and intentionally documented as deprecated.
 *
 * Final list is filtered to questions that end with `?` so the schema is
 * always Schema.org-conformant, and capped at 10 entries.
 */
export function resolveFaqItems(args: {
  curated?: { question?: string; answer?: string }[] | null
  body?: PtBlock[] | null
  maxExtracted?: number
  /** @deprecated Ignored — never used as a Question.name. */
  postTitle?: string
  /** @deprecated Ignored — TL;DR is rendered visually, not in FAQPage JSON-LD. */
  quickAnswer?: string
}): ExtractedFaq[] {
  // Touch deprecated args to keep them in the public signature without
  // tripping the unused-vars lint rule when callers pass them.
  void args.postTitle
  void args.quickAnswer

  const curated = (args.curated ?? [])
    .map((f) => ({
      question: (f?.question ?? "").trim(),
      answer: (f?.answer ?? "").trim(),
    }))
    .filter((f) => f.question && f.answer)

  const base = curated.length > 0
    ? curated
    : extractFaqFromBody(args.body, args.maxExtracted ?? 8)

  // Hard rule: every Question MUST end with `?`. Auto-extracted entries
  // that started with an interrogative word but did not end with `?` are
  // dropped here so the JSON-LD never carries a Statement masquerading as
  // a Question.
  const questionShaped = base.filter((f) => f.question.trim().endsWith("?"))

  // Dedupe (case-insensitive) and cap at 10.
  const seen = new Set<string>()
  const deduped: ExtractedFaq[] = []
  for (const f of questionShaped) {
    const key = f.question.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    deduped.push(f)
    if (deduped.length >= 10) break
  }
  return deduped
}
