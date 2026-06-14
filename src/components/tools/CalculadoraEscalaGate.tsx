'use client'

import { SignInButton, SignUpButton } from '@clerk/nextjs'

const BENEFITS = [
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
    ),
    title: 'Escala exacta',
    text: 'Ingresá el diámetro que tenés y al que querés llegar — te decimos el porcentaje justo para Bambu Studio o Cura.',
  },
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    ),
    title: 'Holgura y ajuste',
    text: 'Sumá tolerancia para que dos piezas encajen con juego, y mirá cómo queda la altura al escalar.',
  },
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    ),
    title: 'Resultado instantáneo',
    text: 'El cálculo se actualiza en tiempo real. Copialo y pegalo directo en tu slicer.',
  },
]

export default function CalculadoraEscalaGate() {
  return (
    <main className="min-h-screen bg-zinc-950 pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">

        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 mb-6">
          <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
        </div>

        <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">
          Herramienta gratuita
        </span>

        <h1 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-4 leading-tight">
          Calculadora de escala<br />para impresión <span className="text-orange-500">3D</span>
        </h1>

        <p className="text-zinc-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          ¿Tu jarra mide 85 mm por dentro y el vaso 91? Te decimos exactamente qué porcentaje
          aumentar o achicar en el slicer para que encaje perfecto.
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
          <SignUpButton mode="modal" forceRedirectUrl="/calculadora-escala">
            <button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-3.5 rounded-xl text-base transition-colors">
              Crear cuenta gratis
            </button>
          </SignUpButton>
          <SignInButton mode="modal" forceRedirectUrl="/calculadora-escala">
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
