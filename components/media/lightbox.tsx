'use client'

import { useEffect, useCallback, useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react'

export interface GalleryItem {
  id: string
  mediaType: 'photo' | 'video'
  src: string        // URL for image or thumbnail
  caption?: string
  videoSource?: 'youtube' | 'sanity'
  youtubeId?: string
  sanityVideoUrl?: string
}

interface LightboxProps {
  items: GalleryItem[]
  initialIndex: number
  isOpen: boolean
  onClose: () => void
}

export default function Lightbox({ items, initialIndex, isOpen, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex)
  const [videoActive, setVideoActive] = useState(false)

  // Sync initial index when opened
  useEffect(() => {
    if (isOpen) {
      setIndex(initialIndex)
      setVideoActive(false)
    }
  }, [isOpen, initialIndex])

  // Reset video when navigating
  useEffect(() => {
    setVideoActive(false)
  }, [index])

  const prev = useCallback(() => setIndex((i) => (i - 1 + items.length) % items.length), [items.length])
  const next = useCallback(() => setIndex((i) => (i + 1) % items.length), [items.length])

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    },
    [onClose, prev, next]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKey])

  if (!isOpen) return null

  const current = items[index]

  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center" role="dialog" aria-modal="true" aria-label="Media lightbox">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-5xl px-4 flex flex-col items-center">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-4 text-white/70 hover:text-white transition-colors flex items-center gap-2 text-sm"
          aria-label="Close lightbox"
        >
          <X size={20} />
        </button>

        {/* Media area */}
        <div className="w-full bg-[#0D0D0D] rounded-xl overflow-hidden relative">
          {current.mediaType === 'photo' ? (
            <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
              <Image
                src={current.src}
                alt={current.caption ?? `Gallery item ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 80vw"
                className="object-contain"
                priority
              />
            </div>
          ) : (
            <div className="relative w-full aspect-video bg-black">
              {!videoActive ? (
                <>
                  <Image
                    src={current.src}
                    alt={current.caption ?? `Video thumbnail ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 80vw"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <button
                      onClick={() => setVideoActive(true)}
                      className="w-20 h-20 rounded-full bg-[#FF5C00] flex items-center justify-center shadow-[0_0_40px_rgba(255,92,0,0.5)] hover:bg-[#e04f00] transition-colors"
                      aria-label="Play video"
                    >
                      <Play size={32} fill="white" className="text-white ml-1.5" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {current.videoSource === 'youtube' && current.youtubeId && (
                    <iframe
                      src={`https://www.youtube.com/embed/${current.youtubeId}?autoplay=1&rel=0`}
                      title={current.caption ?? 'Video'}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                      className="w-full h-full"
                    />
                  )}
                  {current.videoSource === 'sanity' && current.sanityVideoUrl && (
                    <video
                      src={current.sanityVideoUrl}
                      controls
                      autoPlay
                      className="w-full h-full"
                      playsInline
                    />
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Caption + counter */}
        <div className="flex items-center justify-between w-full mt-4 px-1">
          <p className="text-[#B0B0B0] text-sm">{current.caption ?? ''}</p>
          <span className="text-[#B0B0B0] text-xs font-mono">{index + 1} / {items.length}</span>
        </div>

        {/* Navigation */}
        {items.length > 1 && (
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-[#2A2A2A] flex items-center justify-center text-white hover:border-[#FF5C00] hover:text-[#FF5C00] transition-colors"
              aria-label="Previous media item"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-[#2A2A2A] flex items-center justify-center text-white hover:border-[#FF5C00] hover:text-[#FF5C00] transition-colors"
              aria-label="Next media item"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
