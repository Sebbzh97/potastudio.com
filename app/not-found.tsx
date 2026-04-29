import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page not found | Pota Studio',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <p className="text-[#FFC629] text-sm font-semibold uppercase tracking-[0.3em] mb-4">
        404
      </p>
      <h1
        className="text-5xl sm:text-7xl font-bold text-white mb-6"
        style={{ fontFamily: 'var(--font-space-grotesk)' }}
      >
        Page not found.
      </h1>
      <p className="text-[#B0B0B0] text-lg mb-10 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <a
        href="/"
        className="inline-flex items-center px-8 py-4 bg-[#FFC629] text-[#0D0D0D] text-sm font-bold rounded hover:bg-[#e6b320] transition-colors"
      >
        Back to home
      </a>
    </main>
  )
}
