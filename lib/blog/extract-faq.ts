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
 * Combined helper: returns curated `faqItems` if present, otherwise falls back
 * to body-extracted FAQs. Designed for direct use in page components.
 */
export function resolveFaqItems(args: {
  curated?: { question?: string; answer?: string }[] | null
  body?: PtBlock[] | null
  maxExtracted?: number
}): ExtractedFaq[] {
  const curated = (args.curated ?? [])
    .map((f) => ({
      question: (f?.question ?? "").trim(),
      answer: (f?.answer ?? "").trim(),
    }))
    .filter((f) => f.question && f.answer)

  if (curated.length > 0) return curated

  return extractFaqFromBody(args.body, args.maxExtracted ?? 8)
}
