/**
 * Per-article OG image, IT locale.
 *
 * Mirrors the EN counterpart at `/app/blog/[slug]/opengraph-image.tsx`
 * with three differences:
 *   1) `getBlogPostBySlug(slug, 'it')` — fetches the Italian variant.
 *   2) Footer CTA copy is in Italian ("Leggi su Pota Studio").
 *   3) Fallback category label is "Approfondimenti" instead of "Insights".
 *
 * Same edge runtime + immutable cache strategy. See the EN file for the
 * full rationale (no embedded cover, font-free, Satori-bundled font).
 */
import { ImageResponse } from 'next/og'
import { getBlogPostBySlug } from '@/sanity/lib/blog'

export const runtime = 'edge'
export const alt = 'Pota Studio | Articolo'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const CATEGORY_COLORS: Record<string, string> = {
  'Marketing Digitale': '#FF5C00',
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
  const post = await getBlogPostBySlug(slug, 'it').catch(() => null)
  const title = post?.title ?? 'Pota Studio'
  const rawCategory = post?.categories?.[0]
  const category =
    typeof rawCategory === 'string'
      ? rawCategory
      : rawCategory?.title ?? 'Approfondimenti'
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
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5, color: '#FFFFFF' }}>
            POTASTUDIO.COM
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: title.length > 70 ? 64 : 80,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2,
            color: '#FFFFFF',
            maxWidth: '100%',
          }}
        >
          {title}
        </div>

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
              Di
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
            Leggi su Pota Studio →
          </div>
        </div>

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
