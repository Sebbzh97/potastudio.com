import type { Metadata } from 'next'
import { getHreflang } from '@/lib/hreflang'

export const metadata: Metadata = {
  title: 'Contact | Start a Project with Pota Studio',
  description:
    'Get in touch with Pota Studio to start a marketing project. Office in Bergamo (Ponte San Pietro). Write to us for a free consultation.',
  ...getHreflang('/contact'),
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
