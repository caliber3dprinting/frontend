import type { Metadata } from 'next'
import { Suspense } from 'react'
import QuoteForm from '@/components/forms/QuoteForm'

export const metadata: Metadata = {
  title: 'Solicitar cotización',
  description: 'Cuéntanos tu idea y recibe un presupuesto personalizado para tu impresión 3D en menos de 24 horas.',
}

export default function QuotePage() {
  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">Solicita tu cotización</h1>
        <p className="text-zinc-400 leading-relaxed">
          Cuéntanos tu idea con el mayor detalle posible. Si tienes referencias visuales
          o archivos 3D, puedes mencionarlos y te pediremos que los compartas por WhatsApp.
          Respondemos en menos de 24 horas.
        </p>
      </div>

      {/* Suspense es necesario porque QuoteForm usa useSearchParams() */}
      <Suspense fallback={<div className="h-96 bg-zinc-800/50 rounded-2xl animate-pulse" />}>
        <QuoteForm />
      </Suspense>
    </section>
  )
}
