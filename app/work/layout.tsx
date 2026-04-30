import type { Metadata } from 'next'
import { getHreflang } from '@/lib/hreflang'

export const metadata: Metadata = {
  // Brand suffix appended automatically by the root layout template.
  title: 'Our Work | Case Studies',
  description:
    "Explore Pota Studio's portfolio: Shopify Plus builds, TikTok campaigns, social media strategies and content production for global brands including Samsung and Isybank.",
  ...getHreflang('/work'),
}

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
