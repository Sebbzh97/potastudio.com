import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Clients | Samsung, Isybank | Pota Studio',
  description:
    'The brands that trust Pota Studio. Samsung, Isybank and many more across tech, fintech and e-commerce. Read what our clients say about working with us.',
  alternates: { canonical: 'https://www.potastudio.com/clients' },
}

export default function ClientsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
