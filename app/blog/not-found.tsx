import Link from 'next/link'

export default function BlogNotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 bg-[#0D0D0D] text-white">
      <h1 className="text-4xl font-bold" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
        Post not found
      </h1>
      <p className="text-[#B0B0B0] text-center max-w-md">
        This article does not exist or has been moved.
      </p>
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 rounded text-sm font-medium text-[#B0B0B0] hover:text-white hover:border-white/40 transition-all"
      >
        &larr; Back to Blog
      </Link>
    </main>
  )
}
