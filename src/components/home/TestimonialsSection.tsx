'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import type { Testimonial } from '@/lib/types'

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-orange-400' : 'text-zinc-700'}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  )
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null

  const headerRef = useRef(null)
  const gridRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-10% 0px' })
  const gridInView = useInView(gridRef, { once: true, margin: '-5% 0px' })

  return (
    <section className="py-24 bg-zinc-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          ref={headerRef}
          className="text-center mb-14"
          initial={{ opacity: 0, y: 40 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <p className="text-orange-500 text-sm font-semibold tracking-widest uppercase mb-2">
            Clientes satisfechos
          </p>
          <h2 className="font-display font-black text-white"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
            Lo que dicen de nosotros
          </h2>
        </motion.div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.article
              key={t.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4 hover:border-zinc-700 transition-colors"
              initial={{ opacity: 0, y: 50 }}
              animate={gridInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.25, 0.4, 0.25, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <svg className="w-8 h-8 text-orange-500/30" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>

              <p className="text-zinc-300 leading-relaxed flex-1">
                "{t.content}"
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <div>
                  <div className="font-semibold text-white text-sm">{t.author_name}</div>
                  {t.author_city && (
                    <div className="text-zinc-500 text-xs mt-0.5">{t.author_city}</div>
                  )}
                </div>
                <StarRating rating={t.rating} />
              </div>

              {t.product && (
                <div className="text-xs text-zinc-600">
                  Proyecto: <span className="text-zinc-500">{t.product.title}</span>
                </div>
              )}
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  )
}
