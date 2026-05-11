import type { Metadata } from 'next'
import { auth } from '@clerk/nextjs/server'
import Presupuestador from '@/components/tools/Presupuestador'
import PresupuestadorGate from '@/components/tools/PresupuestadorGate'

export const metadata: Metadata = {
  title: 'Presupuestador 3D | Caliber 3D',
  description:
    'Herramienta gratuita para técnicos en impresión 3D: armá presupuestos profesionales con desglose de costos, accesorios y exportación a PDF con tu marca.',
}

export default async function PresupuestadorPage() {
  const { userId } = await auth()

  if (!userId) return <PresupuestadorGate />

  return (
    <main className="min-h-screen bg-zinc-950 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="max-w-2xl mb-10">
          <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">
            Herramienta gratuita
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white mt-2 mb-4 leading-tight">
            Presupuestador<br />de impresión <span className="text-orange-500">3D</span>
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed">
            Ingresá el costo de impresión, la mano de obra y los accesorios del pedido.
            El presupuesto se calcula en tiempo real y podés exportarlo a PDF con tu marca.
          </p>
        </div>

        <Presupuestador />

      </div>
    </main>
  )
}
