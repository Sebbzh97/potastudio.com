import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pota Studio CMS',
  robots: { index: false, follow: false },
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
