'use client'

import { useState } from 'react'
import CalculadoraCostos from '@/components/tools/CalculadoraCostos'
import Link from 'next/link'

type Tab = 'calculadora' | 'presupuestador'

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: 'calculadora',
    label: 'Calculadora de costos',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'presupuestador',
    label: 'Presupuestador',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
]

export default function EspacioMakersContent() {
  const [activeTab, setActiveTab] = useState<Tab>('calculadora')

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 mb-8 border-b border-zinc-800">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'text-orange-500 border-orange-500'
                : 'text-zinc-500 border-transparent hover:text-zinc-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'calculadora' && (
        <div>
          <CalculadoraCostos />
          <div className="mt-12 mb-6 max-w-3xl bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <svg className="w-5 h-5 text-orange-500 shrink-0 mt-0.5 sm:mt-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-zinc-400 text-sm leading-relaxed">
              ¿No sabés de dónde sacar algún dato? Tenemos una{' '}
              <Link
                href="/blog/como-calcular-costo-impresion-3d"
                className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors"
              >
                guía completa con glosario
              </Link>
              {' '}que explica cómo encontrar cada valor: consumo en la ficha técnica, kWh en la factura de luz, amortización y más.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'presupuestador' && (
        <div className="flex flex-col items-center justify-center py-20 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-3">
            Próximamente
          </span>
          <h2 className="text-2xl font-bold text-white mb-3">
            Presupuestador en construcción
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Estamos terminando el presupuestador para que puedas generar documentos profesionales
            para tus clientes en segundos. Va a estar disponible muy pronto.
          </p>
        </div>
      )}
    </div>
  )
}
