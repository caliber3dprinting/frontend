import Link from 'next/link'

const TOOLS = [
  {
    label: 'Calculadora de costos',
    description: 'Material, energía, máquina y mano de obra en tiempo real.',
    available: true,
  },
  {
    label: 'Presupuestador',
    description: 'Documentos profesionales para tus clientes en segundos.',
    available: true,
  },
  {
    label: 'Calculadora de escala',
    description: 'El porcentaje exacto para llevar un diámetro a la medida que necesitás.',
    available: true,
  },
]

export default function EspacioMakersCTA() {
  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Text side */}
          <div>
            <span className="inline-block text-orange-500 text-xs font-bold uppercase tracking-widest mb-4">
              Para impresores y diseñadores 3D
            </span>

            <h2 className="font-display text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
              Un espacio para<br />
              quienes hacen<br />
              <span className="text-orange-500">posible el 3D</span>
            </h2>

            <p className="text-zinc-400 text-base leading-relaxed mb-4">
              Detrás de cada pieza impresa hay alguien que calibró la máquina, calculó los costos
              y entregó un trabajo impecable. En Caliber sabemos lo que implica ese trabajo —
              porque lo hacemos todos los días.
            </p>
            <p className="text-zinc-400 text-base leading-relaxed mb-8">
              Por eso construimos el <span className="text-white font-semibold">Espacio Makers</span>:
              un lugar donde impresores y diseñadores 3D encuentran las herramientas que necesitan
              para profesionalizar su trabajo, calcular con precisión y conectar con una comunidad
              que habla su mismo idioma.
            </p>

            {/* Tool list */}
            <div className="space-y-3 mb-8">
              {TOOLS.map((tool) => (
                <div
                  key={tool.label}
                  className="flex items-start gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3"
                >
                  <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${tool.available ? 'bg-orange-500' : 'bg-zinc-600'}`} />
                  <div>
                    <p className="text-white text-sm font-semibold">
                      {tool.label}
                      {!tool.available && (
                        <span className="ml-2 text-xs font-normal text-zinc-500">Próximamente</span>
                      )}
                    </p>
                    <p className="text-zinc-500 text-xs leading-relaxed mt-0.5">{tool.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/espacio-makers"
              className="inline-flex items-center gap-2 border border-orange-500 text-orange-500 hover:bg-orange-500/10 font-bold px-7 py-3.5 rounded-xl text-sm transition-colors"
            >
              Ingresar al Espacio Makers
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            <p className="mt-4 text-zinc-600 text-xs">
              Acceso gratuito · Solo necesitás registrarte
            </p>
          </div>

          {/* Image / mockup side */}
          <div className="relative">
            {/* Glow */}
            <div className="absolute inset-0 bg-orange-500/5 rounded-2xl blur-3xl pointer-events-none" />

            <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden aspect-[4/3]">
              {/* Mock UI header */}
              <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800 bg-zinc-950">
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="ml-3 h-5 w-32 rounded bg-zinc-800" />
              </div>

              {/* Mock tabs */}
              <div className="flex gap-1 px-5 pt-4 border-b border-zinc-800">
                <div className="px-4 py-2 rounded-t border-b-2 border-orange-500 text-orange-500 text-xs font-semibold">
                  Calculadora de costos
                </div>
                <div className="px-4 py-2 text-zinc-600 text-xs">
                  Presupuestador
                </div>
              </div>

              {/* Mock content */}
              <div className="px-5 pt-5 pb-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Peso del filamento',
                    'Costo por kg',
                    'Tiempo de impresión',
                    'Consumo eléctrico',
                  ].map((label) => (
                    <div key={label} className="bg-zinc-800/60 rounded-lg p-3">
                      <div className="text-zinc-500 text-xs mb-1">{label}</div>
                      <div className="h-5 w-16 bg-zinc-700 rounded" />
                    </div>
                  ))}
                </div>

                <div className="bg-zinc-800/40 border border-orange-500/20 rounded-xl p-4 mt-4">
                  <div className="text-zinc-500 text-xs mb-1">Costo total de producción</div>
                  <div className="text-orange-400 text-2xl font-black">$312.50</div>
                  <div className="text-zinc-600 text-xs mt-1">Incluye tasa de fallos 8%</div>
                </div>
              </div>

              {/* Overlay label */}
              <div className="absolute bottom-4 right-4 bg-zinc-950/80 backdrop-blur-sm border border-zinc-700 rounded-lg px-3 py-2">
                <p className="text-orange-500 text-xs font-bold">Espacio Makers</p>
                <p className="text-zinc-500 text-xs">caliber3d.com</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
