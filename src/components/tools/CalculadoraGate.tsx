'use client'

import { SignInButton, SignUpButton } from '@clerk/nextjs'

const BENEFITS = [
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
    ),
    title: 'Costos en tiempo real',
    text: 'Ingresá material, energía y tiempo — el resultado se actualiza al instante sin enviar nada a ningún servidor.',
  },
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    ),
    title: 'Tu cuenta, tus datos',
    text: 'Tus cálculos y configuraciones quedan guardados. Accedé desde cualquier dispositivo.',
  },
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    title: '100% gratuita',
    text: 'Sin planes de pago, sin límite de usos. Registrate una vez y usala siempre.',
  },
]

export default function CalculadoraGate() {
  return (
    <main className="min-h-screen bg-zinc-950 pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">

        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 mb-6">
          <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">
          Herramienta gratuita
        </span>

        <h1 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-4 leading-tight">
          Calculadora de costos<br />de impresión <span className="text-orange-500">3D</span>
        </h1>

        <p className="text-zinc-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          Sabé exactamente cuánto cuesta producir cada pieza antes de cotizar.
          Material, energía, desgaste de máquina y mano de obra — todo en un cálculo.
        </p>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
          {BENEFITS.map((b) => (
            <div key={b.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  {b.icon}
                </svg>
              </div>
              <p className="text-white font-semibold text-sm mb-1">{b.title}</p>
              <p className="text-zinc-500 text-sm leading-relaxed">{b.text}</p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <SignUpButton mode="modal" forceRedirectUrl="/calculadora">
            <button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-3.5 rounded-xl text-base transition-colors">
              Crear cuenta gratis
            </button>
          </SignUpButton>
          <SignInButton mode="modal" forceRedirectUrl="/calculadora">
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
