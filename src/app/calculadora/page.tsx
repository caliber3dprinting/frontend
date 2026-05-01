import type { Metadata } from 'next'
import Link from 'next/link'
import CalculadoraCostos from '@/components/tools/CalculadoraCostos'

const BLOG_POST_SLUG = 'como-calcular-costo-impresion-3d'

export const metadata: Metadata = {
  title: 'Calculadora de Costos de Impresión 3D | Caliber 3D',
  description:
    'Herramienta gratuita para diseñadores e impresores: calculá el costo real de producir una pieza 3D considerando material, energía, amortización de máquina y mano de obra.',
}

export default function CalculadoraPage() {
  return (
    <main className="min-h-screen bg-zinc-950 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="max-w-2xl mb-10">
          <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">
            Herramienta gratuita
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white mt-2 mb-4 leading-tight">
            Calculadora de costos<br />de impresión <span className="text-orange-500">3D</span>
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed">
            Sabé exactamente cuánto te cuesta producir cada pieza: material, energía eléctrica,
            desgaste de máquina y mano de obra. Los resultados se actualizan en tiempo real.
          </p>
        </div>

        <CalculadoraCostos />

        <div className="mt-12 mb-6 max-w-3xl bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <svg className="w-5 h-5 text-orange-500 shrink-0 mt-0.5 sm:mt-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-zinc-400 text-sm leading-relaxed">
            ¿No sabés de dónde sacar algún dato? Tenemos una{' '}
            <Link
              href={`/blog/${BLOG_POST_SLUG}`}
              className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors"
            >
              guía completa con glosario
            </Link>
            {' '}que explica cómo encontrar cada valor: consumo en la ficha técnica, kWh en la factura de luz, amortización y más.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-1">Tasa de fallos</p>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Porcentaje de impresiones fallidas que absorbés como costo. Con filamento económico o piezas complejas, subilo a 15–20%.
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-1">Amortización</p>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Divide el costo de tu impresora por las horas de vida útil estimadas. Así sabés cuánto te cuesta cada hora de máquina.
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-1">Mano de obra</p>
            <p className="text-zinc-400 text-sm leading-relaxed">
              El tiempo de post-procesado (lijado, soporte, pintura) suele ser más caro que la impresión en sí. No lo ignores.
            </p>
          </div>
        </div>

      </div>
    </main>
  )
}
