'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'
import Lightbox, { type GalleryItem } from './lightbox'

interface CaseStudyGalleryProps {
  items: GalleryItem[]
}

export default function CaseStudyGallery({ items }: CaseStudyGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (!items || items.length === 0) return null

  return (
    <>
      <section className="py-20 bg-[#0D0D0D] border-t border-white/10">
        <div className="container-site">
          <p className="text-[#FF5C00] text-xs font-semibold uppercase tracking-[0.2em] mb-3">Gallery</p>
          <h2
            className="text-3xl font-bold text-white mb-10 text-balance"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Media Gallery
          </h2>

          {/* Responsive grid — mix of 1/2/3 col. Images fill their cell naturally. */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {items.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setLightboxIndex(idx)}
                className="group relative overflow-hidden rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#FF5C00]/50 transition-all focus-visible:outline-2 focus-visible:outline-[#FF5C00]"
                style={{ aspectRatio: item.mediaType === 'photo' ? '4/3' : '16/9' }}
                aria-label={item.caption ?? `Open media item ${idx + 1}`}
              >
                <Image
                  src={item.src}
                  alt={item.caption ?? `Gallery item ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
                  {item.mediaType === 'video' && (
                    <div className="w-12 h-12 rounded-full bg-[#FF5C00] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-[0_0_30px_rgba(255,92,0,0.5)]">
                      <Play size={18} fill="white" className="text-white ml-0.5" />
                    </div>
                  )}
                </div>

                {/* Caption on hover */}
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                    <p className="text-white text-xs leading-snug line-clamp-2">{item.caption}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      <Lightbox
        items={items}
        initialIndex={lightboxIndex ?? 0}
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
      />
    </>
  )
}
