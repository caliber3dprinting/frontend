'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useInView, animate } from 'framer-motion'
import type { HomePage } from '@/lib/types'
import { getStrapiImageUrl } from '@/lib/strapi'

interface HeroSectionProps {
  data: HomePage
}

function AnimatedCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const numeric = parseInt(value.replace(/\D/g, ''), 10)
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (!inView || isNaN(numeric)) {
      setDisplay(value)
      return
    }
    const controls = animate(0, numeric, {
      duration: 1.6,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v).toString()),
    })
    return controls.stop
  }, [inView, numeric, value])

  return (
    <div ref={ref} className="font-display font-black text-3xl text-orange-500">
      {isNaN(numeric) ? value : display + suffix}
    </div>
  )
}

export default function HeroSection({ data }: HeroSectionProps) {
  const imgUrl = getStrapiImageUrl(data.hero_image, 'large')
  const containerRef = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 600], [0, 180])
  const gridY = useTransform(scrollY, [0, 600], [0, 60])
  const contentY = useTransform(scrollY, [0, 600], [0, -60])
  const opacity = useTransform(scrollY, [0, 400], [1, 0])

  const words = data.hero_title.split(' ')

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden noise">
      {/* Background image with parallax */}
      {data.hero_image && (
        <motion.div className="absolute inset-0" style={{ y: bgY }}>
          <Image
            src={imgUrl}
            alt="Impresión 3D Caliber"
            fill
            priority
            className="object-cover opacity-25"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/40" />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-transparent to-transparent" />
        </motion.div>
      )}

      {/* Decorative grid lines with parallax */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(249,115,22,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.05) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          y: gridY,
        }}
      />

      {/* Floating accent orbs */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/3 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.04) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Content with scroll fade */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 pt-40"
        style={{ y: contentY, opacity }}
      >
        <div className="max-w-3xl">

          {/* Eyebrow */}
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <motion.div
              className="h-px bg-orange-500"
              initial={{ width: 0 }}
              animate={{ width: 40 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <span className="text-orange-400 text-sm font-semibold tracking-widest uppercase">
              Playa del Carmen · 5 Impresoras
            </span>
          </motion.div>

          {/* Title word by word */}
          <h1
            className="font-display font-black text-white mb-6 leading-none"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
          >
            {words.map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-[0.2em]"
                initial={{ opacity: 0, y: 40, rotateX: -20 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: [0.25, 0.4, 0.25, 1] }}
              >
                {word === '3D' || word === '3d'
                  ? <span className="text-orange-500">{word}</span>
                  : word}
              </motion.span>
            ))}
          </h1>

          {/* Subtitle */}
          <motion.p
            className="text-zinc-300 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
          >
            {data.hero_subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: 'easeOut' }}
          >
            <Link
              href="/cotizar"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-7 py-4 rounded-xl text-base transition-all hover:scale-[1.03] active:scale-[0.97]"
            >
              {data.hero_cta_label}
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </Link>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold px-7 py-4 rounded-xl text-base transition-all hover:scale-[1.02]"
            >
              Ver catálogo
            </Link>
          </motion.div>

          {/* Stats strip with animated counters */}
          <motion.div
            className="flex flex-wrap gap-8 mt-14 pt-10 border-t border-zinc-800/60"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: 'easeOut' }}
          >
            {[
              { value: '5', label: 'Impresoras' },
              { value: '3', label: 'Miembros del equipo' },
              { value: '100', label: 'A medida', suffix: '%' },
            ].map(({ value, label, suffix }) => (
              <div key={label}>
                <AnimatedCounter value={value} suffix={suffix} />
                <div className="text-zinc-500 text-sm mt-0.5">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        style={{ opacity }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          className="w-px h-10 bg-linear-to-b from-zinc-600 to-transparent"
          animate={{ scaleY: [1, 0.5, 1], opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
