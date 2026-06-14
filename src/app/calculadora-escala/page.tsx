import type { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import CalculadoraEscala from '@/components/tools/CalculadoraEscala'
import CalculadoraEscalaGate from '@/components/tools/CalculadoraEscalaGate'

export const metadata: Metadata = {
  title: 'Calculadora de Escala 3D | Caliber 3D',
  description:
    'Herramienta gratuita para técnicos en impresión 3D: calculá el porcentaje exacto de escala para llevar un diámetro a la medida que necesitás en Bambu Studio o Cura.',
}

export default async function CalculadoraEscalaPage() {
  const { userId } = await auth()

  if (!userId) return <CalculadoraEscalaGate />

  return (
    <main className="min-h-screen bg-zinc-950 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="max-w-2xl mb-10">
          <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">
            Herramienta gratuita
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white mt-2 mb-4 leading-tight">
            Calculadora de escala<br />de impresión <span className="text-orange-500">3D</span>
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed">
            Ingresá el diámetro que tiene tu pieza y el diámetro al que querés llevarla. Te decimos
            el porcentaje exacto que tenés que aumentar o achicar en Bambu Studio o Cura para que
            quede perfecto. El cálculo se actualiza en tiempo real.
          </p>
        </div>

        <CalculadoraEscala />

        <div className="mt-12 mb-6 max-w-3xl bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <svg className="w-5 h-5 text-orange-500 shrink-0 mt-0.5 sm:mt-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-zinc-400 text-sm leading-relaxed">
            ¿Querés entender cómo y cuándo escalar tus piezas? Tenemos una{' '}
            <Link
              href="/blog/como-escalar-piezas-3d-para-que-encajen"
              className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors"
            >
              guía completa de escala en impresión 3D
            </Link>
            {' '}que explica la fórmula, la holgura ideal y cómo aplicar el porcentaje paso a paso en Bambu Studio y Cura.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-1">Cómo funciona</p>
            <p className="text-zinc-400 text-sm leading-relaxed">
              La escala se calcula como objetivo ÷ actual. Si tu jarra mide 85 mm y el vaso 91 mm,
              la escala es 107.06% — es decir, aumentar un 7.06%.
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-1">Holgura</p>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Para que dos piezas encajen sin forzar, sumá entre 0.2 y 0.5 mm de tolerancia al
              diámetro objetivo según tu impresora y filamento.
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-1">Ojo con la altura</p>
            <p className="text-zinc-400 text-sm leading-relaxed">
              El escalado del slicer es proporcional: cambia toda la pieza, no solo el diámetro.
              Revisá que la altura y el grosor de pared sigan sirviéndote.
            </p>
          </div>
        </div>

      </div>
    </main>
  )
}
