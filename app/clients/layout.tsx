import type { Metadata } from 'next'
import { getHreflang } from '@/lib/hreflang'

export const metadata: Metadata = {
  // Brand suffix appended automatically by the root layout template.
  title: 'Our Clients | Samsung, Isybank',
  description:
    'The brands that trust Pota Studio. Samsung, Isybank and many more across tech, fintech and e-commerce. Read what our clients say about working with us.',
  ...getHreflang('/clients'),
}

export default function ClientsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
