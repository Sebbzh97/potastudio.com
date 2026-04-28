import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Pota Studio | Full Service Marketing Agency'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0D0D0D',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: '#FFC629',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          {/* Left: wordmark + tagline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontSize: 96, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-4px', lineHeight: 1 }}>
              POTA
            </div>
            <div style={{ fontSize: 96, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-4px', lineHeight: 1 }}>
              STUDIO
            </div>
            <div style={{ fontSize: 28, color: '#FF5C00', fontWeight: 600, letterSpacing: '2px', marginTop: 8 }}>
              FULL SERVICE MARKETING AGENCY
            </div>
          </div>

          {/* Right: credentials */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'flex-end' }}>
            <div style={{ fontSize: 26, color: '#FFFFFF', fontWeight: 500 }}>Shopify Plus Certified</div>
            <div style={{ fontSize: 26, color: '#FFFFFF', fontWeight: 500 }}>Full Service Marketing Agency</div>
            <div style={{ fontSize: 22, color: '#A0A0A0', fontWeight: 400 }}>Samsung · Isybank · Sellconds</div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
