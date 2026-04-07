import Image from 'next/image'
import Link from 'next/link'
import type { HomePage } from '@/lib/types'
import { getStrapiImageUrl } from '@/lib/strapi'

interface HeroSectionProps {
  data: HomePage
}

export default function HeroSection({ data }: HeroSectionProps) {
  const imgUrl = getStrapiImageUrl(data.hero_image, 'large')

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden noise">
      {/* Background image */}
      {data.hero_image && (
        <div className="absolute inset-0">
          <Image
            src={imgUrl}
            alt="Impresión 3D Caliber"
            fill
            priority
            className="object-cover opacity-25"
            sizes="100vw"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
        </div>
      )}

      {/* Decorative grid lines */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(249,115,22,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.04) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 pt-40">
        <div className="max-w-3xl">

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-orange-500" />
            <span className="text-orange-400 text-sm font-semibold tracking-widest uppercase">
              Playa del Carmen · 5 Impresoras
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display font-black text-white mb-6 leading-none"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}>
            {data.hero_title.split(' ').map((word, i) => (
              <span
                key={i}
                className="inline-block mr-[0.2em]"
                style={{
                  animationDelay: `${i * 80}ms`,
                  animation: 'fadeUp 0.6s ease both',
                }}
              >
                {word === '3D' || word === '3d'
                  ? <span className="text-orange-500">{word}</span>
                  : word}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <p className="text-zinc-300 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl"
            style={{ animation: 'fadeUp 0.6s ease 0.3s both' }}>
            {data.hero_subtitle}
          </p>

          {/* CTAs */}
          <div
            className="flex flex-wrap gap-4"
            style={{ animation: 'fadeUp 0.6s ease 0.5s both' }}
          >
            <Link
              href={data.hero_cta_label === 'Cotizar' ? '/cotizar' : '/cotizar'}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-7 py-4 rounded-xl text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {data.hero_cta_label}
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </Link>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold px-7 py-4 rounded-xl text-base transition-all"
            >
              Ver catálogo
            </Link>
          </div>

          {/* Stats strip */}
          <div
            className="flex flex-wrap gap-8 mt-14 pt-10 border-t border-zinc-800/60"
            style={{ animation: 'fadeUp 0.6s ease 0.7s both' }}
          >
            {[
              { value: '5', label: 'Impresoras' },
              { value: '3', label: 'Miembros del equipo' },
              { value: '100%', label: 'A medida' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="font-display font-black text-3xl text-orange-500">{value}</div>
                <div className="text-zinc-500 text-sm mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600 z-10"
        style={{ animation: 'fadeIn 1s ease 1.2s both' }}>
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-zinc-600 to-transparent" />
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </section>
  )
}
