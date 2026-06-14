import type { Metadata } from 'next'
import { auth } from '@clerk/nextjs/server'
import EspacioMakersGate from '@/components/tools/EspacioMakersGate'
import EspacioMakersContent from '@/components/tools/EspacioMakersContent'

export const metadata: Metadata = {
  title: 'Espacio Makers | Caliber 3D',
  description:
    'Herramientas profesionales para impresores y diseñadores 3D: calculadora de costos, presupuestador y calculadora de escala. Acceso gratuito para usuarios registrados.',
}

export default async function EspacioMakersPage() {
  const { userId } = await auth()

  if (!userId) return <EspacioMakersGate />

  return (
    <main className="min-h-screen bg-zinc-950 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="max-w-2xl mb-10">
          <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">
            Para la comunidad maker
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white mt-2 mb-4 leading-tight">
            Espacio <span className="text-orange-500">Makers</span>
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed">
            Herramientas pensadas para quienes hacen posible la impresión 3D: calculá costos reales,
            generá presupuestos profesionales, sacá la escala exacta de tus piezas y tomá decisiones con datos.
          </p>
        </div>

        <EspacioMakersContent />

      </div>
    </main>
  )
}
