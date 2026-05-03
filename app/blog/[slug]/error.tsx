'use client'

import { useEffect } from 'react'

export default function BlogPostError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[v0] Blog post client error:', error)
  }, [error])

  return (
    <main className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-6">
      <div className="max-w-xl w-full rounded-xl border border-red-500/30 bg-red-500/5 p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-3">
          Client Error
        </p>
        <h1 className="text-2xl font-bold text-white mb-4">
          Something went wrong loading this article
        </h1>
        <pre className="text-sm text-red-300 bg-black/40 rounded-lg p-4 overflow-x-auto mb-6 whitespace-pre-wrap break-words">
          {error?.message ?? 'Unknown error'}
          {'\n\n'}
          {error?.stack ?? ''}
        </pre>
        <button
          onClick={reset}
          className="px-4 py-2 rounded bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
        >
          Try again
        </button>
      </div>
    </main>
  )
}
