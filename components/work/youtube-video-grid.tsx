'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowUpRight, X } from 'lucide-react'

interface YoutubeVideoGridProps {
  ids: string[]
  client: string
  accent?: string
}

export default function YoutubeVideoGrid({ ids, client, accent = '#FF5C00' }: YoutubeVideoGridProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const close = useCallback(() => setActiveId(null), [])

  useEffect(() => {
    if (!activeId) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [activeId, close])

  return (
    <>
      {/* Card grid */}
      <ul className={`grid gap-4 ${ids.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : 'grid-cols-1 sm:grid-cols-2'}`}>
        {ids.map((id, idx) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => setActiveId(id)}
              aria-label={`Play ${client} video ${idx + 1}`}
              className="group block relative w-full overflow-hidden rounded-2xl bg-black cursor-pointer border-0 p-0"
              style={{ aspectRatio: '16/9' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
                alt={`${client} video ${idx + 1}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Vignette */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="flex items-center justify-center rounded-full backdrop-blur-sm border border-white/20 transition-all duration-300 group-hover:scale-110"
                  style={{
                    width: 72,
                    height: 72,
                    background: 'rgba(255,255,255,0.12)',
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <polygon points="8,4 21,12 8,20" fill="white" />
                  </svg>
                </div>
              </div>
              {/* Bottom label */}
              <div className="absolute bottom-0 left-0 right-0 px-5 py-4 flex items-center justify-between">
                <span
                  className="text-sm font-medium text-white/90 drop-shadow"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  {client}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-white/60 font-medium uppercase tracking-widest">
                  YouTube <ArrowUpRight size={12} aria-hidden="true" />
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {/* Lightbox */}
      {activeId && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Video player"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          style={{ background: 'rgba(0,0,0,0.88)' }}
          onClick={(e) => { if (e.target === e.currentTarget) close() }}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={close}
            aria-label="Close video"
            className="absolute top-5 right-5 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/15"
            style={{ width: 44, height: 44 }}
          >
            <X size={18} className="text-white" />
          </button>

          {/* iframe wrapper */}
          <div
            className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-black"
            style={{ maxWidth: '56rem', aspectRatio: '16/9' }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${activeId}?autoplay=1&rel=0`}
              title={`${client} — video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      )}
    </>
  )
}
