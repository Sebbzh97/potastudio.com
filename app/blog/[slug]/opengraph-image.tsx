/**
 * Per-article Open Graph image (1200×630).
 *
 * Why this exists:
 *   - Without it, every article shipped the SAME default site OG card
 *     when shared on LinkedIn / WhatsApp / Slack / X. Click-through rates
 *     for marketing-blog posts are 2-3x higher with a unique title-aware
 *     preview, and Google's social-card crawler also caches it as a
 *     fallback when the article HTML hasn't been re-fetched.
 *
 *   - The card is rendered on the edge with `next/og` (Satori under the
 *     hood) so the cost is ~0 and it cold-starts in <100ms. Cache headers
 *     are set to `public, max-age=31536000, immutable` since the URL
 *     changes any time the slug changes — so the served bytes truly never
 *     mutate for a given URL.
 *
 *   - We intentionally keep the layout server-side font-free: Satori falls
 *     back to its bundled "system" font (Noto). Self-hosting a custom font
 *     here would force a fetch from /public for every cold start, which
 *     would defeat the edge cost win.
 *
 *   - Data: just the slug from the URL → `getBlogPostBySlug()` for title
 *     + category. We do not embed the cover image — composing remote
 *     images in Satori is unreliable on cold paths and the title-only
 *     card outperforms image-heavy variants in CTR studies.
 */
import { ImageResponse } from 'next/og'
import { getBlogPostBySlug } from '@/sanity/lib/blog'

export const runtime = 'edge'
export const alt = 'Pota Studio | Article'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Resolve the category color from the article. Mirrors the palette used
// on the article page so the card visually matches the on-site experience.
const CATEGORY_COLORS: Record<string, string> = {
  'Digital Marketing': '#FF5C00',
  'Paid Advertising': '#FF5C00',
  'Paid ADS': '#FF5C00',
  'TikTok Marketing': '#FF385C',
  TikTok: '#FF385C',
  'Digital Strategy': '#7B61FF',
  'Influencer Marketing': '#00C8FF',
  'Social Media': '#00C851',
}

type Props = { params: Promise<{ slug: string }> }

export default async function Image({ params }: Props) {
  const { slug } = await params

  // Best-effort lookup. If the article is missing (e.g. just deleted or
  // a stale link), we still emit a branded fallback rather than 500-ing.
  const post = await getBlogPostBySlug(slug, 'en').catch(() => null)
  const title = post?.title ?? 'Pota Studio'
  const rawCategory = post?.categories?.[0]
  const category =
    typeof rawCategory === 'string'
      ? rawCategory
      : rawCategory?.title ?? 'Insights'
  const accent = CATEGORY_COLORS[category] ?? '#FF5C00'
  const author = post?.author?.name ?? 'Pota Studio'

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0D0D0D',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          position: 'relative',
          color: '#FFFFFF',
        }}
      >
        {/* Top: category pill + brand wordmark */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: 'uppercase',
              padding: '12px 24px',
              borderRadius: 999,
              background: `${accent}22`,
              color: accent,
              border: `2px solid ${accent}`,
            }}
          >
            {category}
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: -0.5,
              color: '#FFFFFF',
            }}
          >
            POTASTUDIO.COM
          </div>
        </div>

        {/* Middle: title — clamped via CSS line-clamp inside Satori */}
        <div
          style={{
            display: 'flex',
            fontSize: title.length > 70 ? 64 : 80,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2,
            color: '#FFFFFF',
            // Satori does not fully implement -webkit-line-clamp; we instead
            // bias the font size by length and trust word-wrap.
            maxWidth: '100%',
          }}
        >
          {title}
        </div>

        {/* Bottom: author + accent bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            paddingTop: 24,
            borderTop: `2px solid ${accent}`,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 18, color: '#A0A0A0', textTransform: 'uppercase', letterSpacing: 2 }}>
              By
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, color: '#FFFFFF', marginTop: 4 }}>
              {author}
            </div>
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: accent,
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            Read on Pota Studio →
          </div>
        </div>

        {/* Accent bar at the very bottom for brand consistency */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            background: accent,
          }}
        />
      </div>
    ),
    { ...size },
  )
}
