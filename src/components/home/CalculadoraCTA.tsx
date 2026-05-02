import Link from 'next/link'

export default function CalculadoraCTA() {
  return (
    <section className="py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl px-6 sm:px-10 py-10 flex flex-col sm:flex-row items-start sm:items-center gap-8">

          {/* Decorative glow */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Icon */}
          <div className="shrink-0 w-14 h-14 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <svg className="w-7 h-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-1">Gratis para usuarios registrados</p>
            <h2 className="text-white text-xl sm:text-2xl font-bold leading-snug mb-2">
              ¿Querés saber el costo exacto antes de cotizar?
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Nuestra calculadora considera material, energía, amortización de máquina y mano de obra.
              Resultados en tiempo real, sin enviar ningún dato.
            </p>
          </div>

          {/* CTA */}
          <div className="shrink-0">
            <Link
              href="/calculadora"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors whitespace-nowrap"
            >
              Usar calculadora
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}
