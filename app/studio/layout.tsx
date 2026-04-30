import type { Metadata } from 'next'

export const metadata: Metadata = {
  // `title.absolute` bypasses the root layout's `%s | Pota Studio` template
  // so the Sanity Studio admin tab shows just "Pota Studio CMS" (not
  // "Pota Studio CMS | Pota Studio").
  title: { absolute: 'Pota Studio CMS' },
  robots: { index: false, follow: false },
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
