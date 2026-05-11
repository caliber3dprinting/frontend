'use client'

import { SignInButton, SignUpButton } from '@clerk/nextjs'

const BENEFITS = [
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    ),
    title: 'PDF con tu marca',
    text: 'Generá presupuestos profesionales con tu logo, nombre y datos de contacto listos para enviar al cliente.',
  },
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
      />
    ),
    title: 'Historial en tu cuenta',
    text: 'Cada presupuesto queda guardado. Accedé, revisá y regenerá el PDF desde cualquier dispositivo.',
  },
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
      />
    ),
    title: 'Accesorios y extras',
    text: 'Sumá listones, bases, envasado o cualquier extra por pieza y el total se calcula solo.',
  },
]

export default function PresupuestadorGate() {
  return (
    <main className="min-h-screen bg-zinc-950 pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">

        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 mb-6">
          <svg
            className="w-8 h-8 text-orange-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>

        <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">
          Herramienta gratuita
        </span>

        <h1 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-4 leading-tight">
          Presupuestador para<br />técnicos en impresión <span className="text-orange-500">3D</span>
        </h1>

        <p className="text-zinc-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          Armá presupuestos profesionales con desglose de costos, accesorios y PDF listo para tu cliente — todo desde tu cuenta.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
          {BENEFITS.map((b) => (
            <div key={b.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center mb-3">
                <svg
                  className="w-5 h-5 text-orange-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  {b.icon}
                </svg>
              </div>
              <p className="text-white font-semibold text-sm mb-1">{b.title}</p>
              <p className="text-zinc-500 text-sm leading-relaxed">{b.text}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <SignUpButton mode="modal" forceRedirectUrl="/presupuestador">
            <button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-3.5 rounded-xl text-base transition-colors">
              Crear cuenta gratis
            </button>
          </SignUpButton>
          <SignInButton mode="modal" forceRedirectUrl="/presupuestador">
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
