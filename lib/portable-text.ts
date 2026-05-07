/**
 * Converts a Portable Text block array to plain text.
 *
 * Used wherever a plain string is required from a Sanity Portable Text field
 * (e.g. <meta name="description">, JSON-LD `description`, OG tags).
 * Safe to call with any value — returns '' for null/undefined/non-array inputs.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function portableTextToPlainText(blocks: any[] | string | null | undefined): string {
  // Already a plain string (e.g. `bio` field on older docs).
  if (typeof blocks === 'string') return blocks.trim()
  // Null / undefined / non-array — nothing to extract.
  if (!blocks || !Array.isArray(blocks)) return ''

  return blocks
    .filter((b) => b?._type === 'block' && Array.isArray(b.children))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((b) => (b.children as any[]).map((c) => c?.text ?? '').join(''))
    .join('\n\n')
    .trim()
}
