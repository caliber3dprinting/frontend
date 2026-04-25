import Image from 'next/image'
import Link from 'next/link'
import type { GlobalConfig } from '@/lib/types'

interface FooterProps {
  config: GlobalConfig
}

const FOOTER_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/blog', label: 'Blog' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/cotizar', label: 'Solicitar cotización' },
]

const BLOG_CATEGORY_LINKS = [
  { href: '/blog?categoria=guides', label: 'Guías' },
  { href: '/blog?categoria=materials', label: 'Materiales' },
  { href: '/blog?categoria=projects', label: 'Proyectos' },
  { href: '/blog?categoria=news', label: 'Novedades' },
  { href: '/blog?categoria=tips', label: 'Consejos' },
]

export default function Footer({ config }: FooterProps) {
  const year = new Date().getFullYear()
  const waUrl = `https://wa.me/${config.whatsapp_number.replace(/\D/g, '')}?text=Hola%2C%20me%20gustar%C3%ADa%20cotizar%20una%20impresi%C3%B3n%203D`

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center mb-4">
              <Image
                src="/caliber-3d-logo.svg"
                alt="Logo de Caliber 3D Printing — Impresión 3D en Playa del Carmen"
                width={140}
                height={140}
                className="h-30 w-auto"
              />
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Impresiones 3D a medida desde Playa del Carmen, México. Transformamos tus ideas en piezas reales con 5 impresoras y dedicación artesanal.
            </p>
            {config.address && (
              <p className="text-zinc-600 text-xs mt-3 flex items-start gap-1.5">
                <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
                {config.address}
              </p>
            )}
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">
              Navegación
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-zinc-500 hover:text-white text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">
              Recursos
            </h3>
            <ul className="space-y-2">
              {BLOG_CATEGORY_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-zinc-500 hover:text-white text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-green-400 hover:text-green-300 transition-colors"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {config.whatsapp_number}
                </a>
              </li>
              {config.contact_email && (
                <li>
                  <a
                    href={`mailto:${config.contact_email}`}
                    className="flex items-center gap-2.5 text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                    {config.contact_email}
                  </a>
                </li>
              )}
              {config.business_hours && (
                <li className="text-sm text-zinc-600 flex items-start gap-2.5">
                  <svg className="w-4 h-4 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                  </svg>
                  {config.business_hours}
                </li>
              )}
            </ul>

            {/* Social */}
            {(config.instagram_url || config.facebook_url || config.tiktok_url) && (
              <div className="flex items-center gap-3 mt-6">
                {config.instagram_url && (
                  <a href={config.instagram_url} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
                    aria-label="Instagram">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}
                {config.facebook_url && (
                  <a href={config.facebook_url} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
                    aria-label="Facebook">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}
                {config.tiktok_url && (
                  <a href={config.tiktok_url} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
                    aria-label="TikTok">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.72a4.86 4.86 0 01-1.01-.03z"/>
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>

        </div>

        <div className="mt-10 pt-6 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-zinc-600 text-xs">
            © {year} Caliber 3D · Playa del Carmen, México
          </p>
          <p className="text-zinc-700 text-xs">
            Hecho con dedicación familiar 🧡
          </p>
        </div>
      </div>
    </footer>
  )
}
