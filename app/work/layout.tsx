import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Work | Case Studies | Pota Studio',
  description:
    "Explore Pota Studio's portfolio: Shopify Plus builds, TikTok campaigns, social media strategies and content production for global brands including Samsung and Isybank.",
  alternates: { canonical: 'https://www.potastudio.com/work' },
}

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
