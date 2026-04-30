import { ImageResponse } from 'next/og'

// Apple touch icon — used by iOS/macOS when users save the site to
// their home screen, and as a high-resolution fallback by Google,
// LinkedIn and other crawlers when scraping favicons.
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0D0D0D',
          borderRadius: 36,
          fontSize: 132,
          fontWeight: 800,
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          color: '#FF8800',
          letterSpacing: -6,
          lineHeight: 1,
          paddingBottom: 8,
        }}
      >
        p
      </div>
    ),
    { ...size },
  )
}
