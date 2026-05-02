'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth, SignInButton, UserButton } from '@clerk/nextjs'

const NAV_LINKS = [
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/blog', label: 'Blog' },
  { href: '/calculadora', label: 'Calculadora' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/cotizar', label: 'Cotizar', accent: true },
]

interface NavbarProps {
  whatsapp: string
}

export default function Navbar({ whatsapp }: NavbarProps) {
  const pathname = usePathname()
  const { isSignedIn } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on route change
  useEffect(() => setOpen(false), [pathname])

  const waUrl = `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=Hola%2C%20me%20gustar%C3%ADa%20cotizar%20una%20impresi%C3%B3n%203D`

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/caliber-3d-logo.svg"
              alt="Caliber 3D Printing — Impresión 3D a Medida en Playa del Carmen"
              width={120}
              height={120}
              className="h-26 w-auto"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-3">
            {NAV_LINKS.map(({ href, label, accent }) =>
              accent ? (
                <Link
                  key={href}
                  href={href}
                  className="ml-4 bg-orange-500 hover:bg-orange-400 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-colors"
                >
                  {label}
                </Link>
              ) : (
                <Link
                  key={href}
                  href={href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname.startsWith(href)
                      ? 'text-white bg-zinc-800'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  {label}
                </Link>
              )
            )}
          </nav>

          {/* Auth — desktop */}
          <div className="hidden md:flex items-center gap-2">
            {isSignedIn ? (
              <UserButton />
            ) : (
              <SignInButton mode="modal">
                <button className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors">
                  Iniciar sesión
                </button>
              </SignInButton>
            )}
          </div>

          {/* WhatsApp pill — desktop */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 text-xs font-medium text-green-400 hover:text-green-300 border border-green-500/30 hover:border-green-400/50 px-3 py-1.5 rounded-full transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>

          {/* Hamburger — mobile */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden relative z-60 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          >
            <span className={`block w-5 h-0.5 bg-current mb-1.5 transition-all duration-300 origin-center ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-current mb-1.5 transition-all duration-300 ${open ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-current transition-all duration-300 origin-center ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>

        </div>
      </header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-55 md:hidden flex flex-col bg-zinc-950"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Header: logo + close */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-zinc-800/60">
              <Link href="/" onClick={() => setOpen(false)}>
                <Image
                  src="/caliber-3d-logo.svg"
                  alt="Caliber 3D Printing — Impresión 3D a Medida en Playa del Carmen"
                  width={90}
                  height={90}
                  className="h-14 w-auto"
                />
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="p-2 text-zinc-500 hover:text-white transition-colors"
                aria-label="Cerrar menú"
              >
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col flex-1 px-5 pt-6 gap-1">
              {NAV_LINKS.map(({ href, label, accent }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.06, duration: 0.25, ease: 'easeOut' }}
                >
                  <Link
                    href={href}
                    className={`flex items-center font-semibold text-base transition-colors rounded-xl px-4 py-3 ${
                      accent
                        ? 'bg-orange-500 hover:bg-orange-400 text-white justify-center mt-2'
                        : pathname.startsWith(href)
                        ? 'text-white bg-zinc-800/60'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
                    }`}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Auth — mobile */}
            <motion.div
              className="px-5 pt-2 pb-2 border-t border-zinc-800/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.20, duration: 0.25 }}
            >
              {isSignedIn ? (
                <div className="flex items-center gap-3 px-4 py-2">
                  <UserButton />
                  <span className="text-sm text-zinc-400">Mi cuenta</span>
                </div>
              ) : (
                <SignInButton mode="modal">
                  <button className="flex items-center justify-center w-full px-4 py-3 rounded-xl text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors">
                    Iniciar sesión
                  </button>
                </SignInButton>
              )}
            </motion.div>

            {/* Bottom: WhatsApp */}
            <motion.div
              className="px-5 pb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.22, duration: 0.25 }}
            >
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full border border-green-500/30 text-green-400 py-3 rounded-xl text-sm font-medium transition-all hover:border-green-400/50"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Escribirnos por WhatsApp
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
