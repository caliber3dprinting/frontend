'use client'
import Link from 'next/link'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP ?? '529982017863'
const WA_URL = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hola, me gustaría solicitar una cotización 3D.')}`

export default function QuoteCTA() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <section className="py-24 bg-zinc-900/40 relative overflow-hidden" ref={ref}>
      {/* Pulsing decorative glow */}
      <motion.div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: '37.5rem',
          height: '18.75rem',
          background: 'radial-gradient(ellipse, rgba(249,115,22,0.10) 0%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">

        {/* Icon */}
        <motion.div
          aria-hidden="true"
          className="inline-flex w-16 h-16 bg-orange-500/10 border border-orange-500/20 rounded-2xl items-center justify-center mb-6"
          initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
          animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.6, ease: 'backOut' }}
        >
          <svg className="w-8 h-8 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
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
          Respondemos en menos de 24 horas desde Playa del Carmen.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row sm:flex-wrap gap-4 justify-center"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
        >
          <Link
            href="/cotizar"
            className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-xl text-base transition-all hover:scale-[1.03] active:scale-[0.97]"
          >
            Solicitar cotización gratis
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </Link>

          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bc59] text-white font-bold px-8 py-4 rounded-xl text-base transition-all hover:scale-[1.03] active:scale-[0.97]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Escribir por WhatsApp
          </a>

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
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500/60" aria-hidden="true" />
              {item}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
