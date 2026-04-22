'use client'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import type { Product } from '@/lib/types'
import { ProductCard } from '@/components/catalog/ProductGrid'

interface FeaturedProductsProps {
  products: Product[]
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null

  const headerRef = useRef(null)
  const gridRef = useRef(null)
  const ctaRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-10% 0px' })
  const gridInView = useInView(gridRef, { once: true, margin: '-5% 0px' })
  const ctaInView = useInView(ctaRef, { once: true, margin: '-10% 0px' })

  return (
    <section className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          ref={headerRef}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <div>
            <p className="text-orange-500 text-sm font-semibold tracking-widest uppercase mb-2">
              Lo que hacemos
            </p>
            <h2 className="font-display font-black text-white accent-line"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
              Trabajos destacados
            </h2>
          </div>
          <Link
            href="/catalogo"
            className="text-zinc-400 hover:text-orange-400 text-sm font-medium transition-colors flex items-center gap-1.5 shrink-0 mb-1"
          >
            Ver todo el catálogo
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </Link>
        </motion.div>

        {/* Grid with staggered cards */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              animate={gridInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          ref={ctaRef}
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p className="text-zinc-500 mb-4">¿No encuentras lo que buscas?</p>
          <Link
            href="/cotizar"
            className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            Cuéntanos tu idea y la hacemos realidad
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
