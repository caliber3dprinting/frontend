import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import RichText from '@/components/ui/RichText'
import { getAboutPage, getStrapiImageUrl } from '@/lib/strapi'
import type { AboutPage } from '@/lib/types'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Nosotros',
  description:
    'Somos un emprendimiento especializado en manufactura aditiva. No imprimimos "cosas", fabricamos soluciones.',
}

// ── Fallbacks con lorem ipsum (formato Blocks de Strapi v5) ──────────────────

const FALLBACK: AboutPage = {
  title: 'Sobre Nosotros',
  story: [
    {
      type: 'paragraph',
      children: [
        { type: 'text', text: 'Lorem ipsum — ' },
        { type: 'text', text: 'aquí irá la historia de Caliber 3D', bold: true },
        { type: 'text', text: ': cómo nació, quiénes lo forman, y qué los mueve a hacer lo que hacen. Editalo desde Strapi → AboutPage → story.' },
      ],
    },
    {
      type: 'paragraph',
      children: [
        { type: 'text', text: 'Podés usar texto enriquecido: negrita, listas, enlaces, etc.' },
      ],
    },
  ],
  team_photo: null,
  team_caption: 'El equipo de Caliber 3D · Playa del Carmen',
  values: [
    {
      id: 1,
      title: 'Calidad garantizada',
      text: 'Lorem ipsum — editá este valor en Strapi → AboutPage → values → ítem 1 → text.',
    },
    {
      id: 2,
      title: 'Personalización total',
      text: 'Lorem ipsum — editá este valor en Strapi → AboutPage → values → ítem 2 → text.',
    },
    {
      id: 3,
      title: 'Equipo familiar',
      text: 'Lorem ipsum — editá este valor en Strapi → AboutPage → values → ítem 3 → text.',
    },
  ],
}

// ── Secciones estáticas ──────────────────────────────────────────────────────

const STEPS = [
  {
    num: '01',
    title: 'Escuchamos',
    body: 'Nos contás qué necesitás, para qué se usa y qué problema querés resolver. Cuanto más claro, mejor.',
  },
  {
    num: '02',
    title: 'Analizamos',
    body: 'Definimos material, refuerzos, tiempo de impresión y terminación. Acá es donde evitamos errores caros.',
  },
  {
    num: '03',
    title: 'Fabricamos',
    body: 'Imprimimos con parámetros optimizados, cuidando cada capa como si fuera la última.',
  },
  {
    num: '04',
    title: 'Entregamos',
    body: 'Revisamos la pieza, verificamos calidad y coordinamos la entrega. Sin sorpresas raras.',
  },
]

export default async function NosotrosPage() {
  const about = await getAboutPage().catch(() => FALLBACK)

  const teamImgUrl = getStrapiImageUrl(about.team_photo, 'large')

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16">

      {/* ── Título ── */}
      <section className="text-center space-y-4">
        <h1
          className="font-display font-black text-white"
          style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}
        >
          {about.title}
        </h1>
      </section>

      {/* ── Historia + foto del equipo ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Rich text renderizado (Strapi v5 Blocks) */}
        <div className="space-y-4">
          <RichText content={about.story} />
        </div>

        {/* Foto del equipo */}
        <div className="space-y-3">
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-zinc-800">
            {about.team_photo ? (
              <Image
                src={teamImgUrl}
                alt={about.team_caption ?? 'El equipo de Caliber 3D'}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-zinc-600 p-6 text-center">
                <svg className="w-16 h-16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-sm text-zinc-500">
                  Subí la foto del equipo desde<br />
                  Strapi → AboutPage → team_photo
                </p>
              </div>
            )}
          </div>
          {about.team_caption && (
            <p className="text-center text-zinc-500 text-sm">{about.team_caption}</p>
          )}
        </div>
      </section>

      {/* ── Valores / Pilares ── */}
      {about.values.length > 0 && (
        <section className="space-y-6">
          <h2
            className="font-display font-black text-white text-center"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}
          >
            Nuestros valores
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {about.values.map((v, idx) => (
              <div
                key={v.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-3"
              >
                <div className="font-display font-black text-orange-500 text-2xl leading-none">
                  0{idx + 1}
                </div>
                <h3 className="font-display font-black text-white text-lg">{v.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Cómo trabajamos ── */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-8">
        <h2
          className="font-display font-black text-white text-center"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}
        >
          Cómo trabajamos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map(({ num, title, body }) => (
            <div key={num} className="space-y-2">
              <div className="font-display font-black text-orange-500 text-2xl leading-none">{num}</div>
              <div className="font-semibold text-white">{title}</div>
              <p className="text-zinc-400 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="text-center space-y-6 pt-4">
        <h2
          className="font-display font-black text-white"
          style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
        >
          ¿Tenés un proyecto en mente?
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/cotizar"
            className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
          >
            Solicitar cotización
          </Link>
          <Link
            href="/catalogo"
            className="inline-flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
          >
            Ver el catálogo
          </Link>
        </div>
      </section>

    </main>
  )
}
