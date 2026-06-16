'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { buildWhatsappUrl } from '@/lib/whatsapp'

const WA_URL = buildWhatsappUrl('¡Hola! Vi sus productos de Copa del Mundo y me interesa hacer un pedido 🏆⚽')

const PRODUCTS = [
  {
    id: 1,
    tag: 'Tamaño Real',
    name: 'Trofeo Copa del Mundo',
    size: '38 cm',
    price: '$650',
    image: '/copa-mundo-38cm.webp',
  },
  {
    id: 2,
    tag: 'Réplica',
    name: 'Trofeo Copa del Mundo',
    size: '25 cm',
    price: '$450',
    image: '/copa-mundo-25cm.webp',
  },
  {
    id: 3,
    tag: 'Con Vaso',
    name: 'Copa con Vaso',
    size: '23 cm',
    price: '$450',
    image: '/copa-mundo-vaso-23cm.webp',
  },
  {
    id: 4,
    tag: 'Llaveros',
    name: 'Llavero Premium',
    size: '',
    price: '$30 c/u',
    image: '/llaveros-copa-mundo.webp',
  },
]

export default function WorldCupPopup() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const seen = sessionStorage.getItem('wc-popup-seen')
    if (!seen) {
      const timer = setTimeout(() => setIsOpen(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  function handleClose() {
    setIsOpen(false)
    sessionStorage.setItem('wc-popup-seen', '1')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[9998] bg-black/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', damping: 22, stiffness: 320 }}
          >
            <div className="relative w-full max-w-sm sm:max-w-2xl bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 z-10 text-zinc-400 hover:text-white transition-colors bg-zinc-800 hover:bg-zinc-700 rounded-full p-1.5"
                aria-label="Cerrar"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Header */}
              <div className="bg-zinc-950 px-5 pt-4 pb-3 sm:pt-6 sm:pb-4 text-center border-b border-zinc-800">
                <p className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-orange-500 uppercase mb-0.5">
                  ⚽ Edición Especial Mundial 2026 🏆
                </p>
                <h2 className="text-xl sm:text-3xl font-black uppercase tracking-wide text-white leading-tight">
                  Copa del Mundo
                </h2>
                <p className="text-zinc-500 text-[10px] sm:text-xs mt-0.5">Impresión 3D · Alta calidad · Envío disponible</p>
              </div>

              {/* Products */}
              <div className="grid grid-cols-4 gap-1.5 sm:gap-3 px-3 sm:px-5 pb-2 sm:pb-4 pt-3 sm:pt-4">
                {PRODUCTS.map((p) => (
                  <div
                    key={p.id}
                    className="group relative bg-zinc-800 rounded-lg sm:rounded-xl overflow-hidden border border-zinc-700 hover:border-orange-500 transition-all duration-200"
                  >
                    <div className="relative aspect-square sm:aspect-3/4 w-full">
                      <Image
                        src={p.image}
                        alt={`${p.name} ${p.size}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 25vw, 25vw"
                      />
                      <span className="absolute top-1 left-1 text-[9px] sm:text-[11px] font-bold bg-orange-500 text-white px-1 sm:px-1.5 py-0.5 rounded-full uppercase tracking-wide leading-none">
                        {p.tag}
                      </span>
                    </div>
                    <div className="px-1 sm:px-2 py-1.5 sm:py-2 text-center">
                      <p className="text-zinc-300 text-[10px] sm:text-xs font-medium leading-snug hidden sm:block">{p.name}</p>
                      {p.size && <p className="text-zinc-500 text-[9px] sm:text-[11px] sm:mt-0.5">{p.size}</p>}
                      <p className="text-orange-500 font-black text-xs sm:text-base mt-0.5">{p.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Personalization note + CTA */}
              <div className="px-3 sm:px-5 pb-3 sm:pb-5 pt-0 text-center">
                <p className="text-zinc-400 text-[10px] sm:text-xs mb-2 sm:mb-3">
                  ✨ Personalizamos la base con tu nombre, selección o logo de negocio
                </p>
                <a
                  href={WA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1db954] text-white font-bold px-5 py-2.5 sm:py-3.5 rounded-xl transition-colors text-sm sm:text-base"
                >
                  <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  ¡Hacer mi pedido por WhatsApp!
                </a>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
