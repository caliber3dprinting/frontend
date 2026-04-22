'use client'
import Link from 'next/link'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function QuoteCTA() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <section className="py-24 bg-zinc-900/40 relative overflow-hidden" ref={ref}>
      {/* Pulsing decorative glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-75 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(249,115,22,0.10) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">

        {/* Icon */}
        <motion.div
          className="inline-flex w-16 h-16 bg-orange-500/10 border border-orange-500/20 rounded-2xl items-center justify-center mb-6"
          initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
          animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.6, ease: 'backOut' }}
        >
          <svg className="w-8 h-8 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"/>
          </svg>
        </motion.div>

        <motion.h2
          className="font-display font-black text-white mb-4"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        >
          ¿Tienes una idea en mente?
        </motion.h2>

        <motion.p
          className="text-zinc-400 text-lg leading-relaxed mb-10"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
        >
          Cuéntanos qué quieres crear. Sin compromiso, sin costos ocultos.
          Respondemos cada cotización en menos de 24 horas desde Playa del Carmen.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
        >
          <Link
            href="/cotizar"
            className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-xl text-base transition-all hover:scale-[1.03] active:scale-[0.97]"
          >
            Solicitar cotización gratis
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </Link>
          <Link
            href="/catalogo"
            className="inline-flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all hover:scale-[1.02]"
          >
            Explorar catálogo
          </Link>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-zinc-500"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {['Sin costo de consulta', 'Respuesta en 24h', 'Operamos desde PDC'].map((item, i) => (
            <motion.span
              key={item}
              className="flex items-center gap-1.5"
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500/60" />
              {item}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
