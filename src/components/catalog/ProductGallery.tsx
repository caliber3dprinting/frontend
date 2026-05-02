'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Image from 'next/image'
import type { SanityImage } from '@/lib/types'
import { getSanityImageUrl } from '@/lib/sanity'

interface ProductGalleryProps {
  images: SanityImage[]
  title: string
}

const SWIPE_THRESHOLD = 50

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const didSwipe = useRef(false)

  const hasMultiple = images.length > 1
  const current = images[active]

  const prev = useCallback(
    () => setActive(i => (i - 1 + images.length) % images.length),
    [images.length]
  )
  const next = useCallback(
    () => setActive(i => (i + 1) % images.length),
    [images.length]
  )

  // Keyboard navigation and scroll lock for lightbox
  useEffect(() => {
    if (!lightbox) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'Escape') setLightbox(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightbox, prev, next])

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    didSwipe.current = false
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (hasMultiple && Math.abs(delta) > SWIPE_THRESHOLD) {
      delta > 0 ? next() : prev()
      didSwipe.current = true
    }
    touchStartX.current = null
  }

  const openLightbox = () => {
    if (didSwipe.current) { didSwipe.current = false; return }
    setLightbox(true)
  }

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-700">
        <svg className="w-20 h-20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Main image */}
        <div
          className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-800 group"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Click-to-zoom overlay */}
          <button
            className="absolute inset-0 z-10 cursor-zoom-in"
            onClick={openLightbox}
            aria-label="Ver imagen ampliada"
          />

          <Image
            src={getSanityImageUrl(current, 'large')}
            alt={current.alt ?? title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />

          {/* Zoom icon hint */}
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/10">
            <svg
              className="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-60"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"/>
            </svg>
          </div>

          {/* Desktop prev/next arrows — visible on hover */}
          {hasMultiple && (
            <>
              <button
                className="absolute left-2 top-1/2 z-30 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-black/70"
                onClick={(e) => { e.stopPropagation(); prev() }}
                aria-label="Imagen anterior"
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </button>
              <button
                className="absolute right-2 top-1/2 z-30 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-black/70"
                onClick={(e) => { e.stopPropagation(); next() }}
                aria-label="Siguiente imagen"
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                </svg>
              </button>

              {/* Dot indicators */}
              <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setActive(i) }}
                    aria-label={`Imagen ${i + 1}`}
                    className={`rounded-full transition-all duration-300 ${
                      i === active
                        ? 'h-1.5 w-4 bg-orange-500'
                        : 'h-1.5 w-1.5 bg-white/60 hover:bg-white/90'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {hasMultiple && (
          <div className="grid grid-cols-5 gap-2">
            {images.map((img, i) => (
              <button
                key={img.asset?._ref ?? i}
                onClick={() => setActive(i)}
                aria-label={`Ver imagen ${i + 1}`}
                className={`relative aspect-square overflow-hidden rounded-lg bg-zinc-800 transition-all ${
                  i === active
                    ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-zinc-950'
                    : 'opacity-50 hover:opacity-80'
                }`}
              >
                <Image
                  src={getSanityImageUrl(img, 'thumbnail')}
                  alt={img.alt ?? `${title} ${i + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Close */}
          <button
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-white transition-colors hover:bg-zinc-700"
            onClick={() => setLightbox(false)}
            aria-label="Cerrar"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>

          {hasMultiple && (
            <>
              <button
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-white transition-colors hover:bg-zinc-700"
                onClick={(e) => { e.stopPropagation(); prev() }}
                aria-label="Anterior"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </button>
              <button
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-white transition-colors hover:bg-zinc-700"
                onClick={(e) => { e.stopPropagation(); next() }}
                aria-label="Siguiente"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                </svg>
              </button>

              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 tabular-nums text-sm text-white/60">
                {active + 1} / {images.length}
              </div>
            </>
          )}

          <div
            className="relative h-full max-h-[85vh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={getSanityImageUrl(current)}
              alt={current.alt ?? title}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  )
}
