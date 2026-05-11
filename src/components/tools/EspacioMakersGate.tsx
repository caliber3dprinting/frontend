'use client'

import { SignInButton, SignUpButton } from '@clerk/nextjs'

const FEATURES = [
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
    ),
    title: 'Calculadora de costos',
    text: 'Conocé el costo real de cada impresión: material, energía, amortización de máquina y mano de obra. Resultados en tiempo real.',
  },
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    ),
    title: 'Presupuestador',
    text: 'Generá presupuestos detallados para tus clientes en segundos. Profesionalizá tu servicio con documentos claros y prolijos.',
  },
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    ),
    title: 'Comunidad Caliber',
    text: 'Un espacio construido por y para la comunidad de impresores 3D. Acceso libre y gratuito para todos los registrados.',
  },
]

export default function EspacioMakersGate() {
  return (
    <main className="min-h-screen bg-zinc-950 pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">

        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 mb-6">
          <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
          </svg>
        </div>

        <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">
          Para la comunidad maker · Acceso gratuito
        </span>

        <h1 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-4 leading-tight">
          Espacio <span className="text-orange-500">Makers</span>
        </h1>

        <p className="text-zinc-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          Un espacio construido para quienes hacen posible la impresión 3D.
          Calculá, presupuestá y profesionalizá tu trabajo — completamente gratis.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  {f.icon}
                </svg>
              </div>
              <p className="text-white font-semibold text-sm mb-1">{f.title}</p>
              <p className="text-zinc-500 text-sm leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <SignUpButton mode="modal" forceRedirectUrl="/espacio-makers">
            <button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-3.5 rounded-xl text-base transition-colors">
              Crear cuenta gratis
            </button>
          </SignUpButton>
          <SignInButton mode="modal" forceRedirectUrl="/espacio-makers">
            <button className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold px-8 py-3.5 rounded-xl text-base transition-colors">
              Ya tengo cuenta
            </button>
          </SignInButton>
        </div>

        <p className="mt-5 text-zinc-600 text-xs">
          Sin tarjeta de crédito · Sin suscripción · Sin spam
        </p>

      </div>
    </main>
  )
}
