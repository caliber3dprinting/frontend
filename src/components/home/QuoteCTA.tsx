import Link from 'next/link'

export default function QuoteCTA() {
  return (
    <section className="py-24 bg-zinc-900/40 relative overflow-hidden">
      {/* Decorative glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(249,115,22,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        {/* Icon */}
        <div className="inline-flex w-16 h-16 bg-orange-500/10 border border-orange-500/20 rounded-2xl items-center justify-center mb-6">
          <svg className="w-8 h-8 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"/>
          </svg>
        </div>

        <h2 className="font-display font-black text-white mb-4"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
          ¿Tienes una idea en mente?
        </h2>
        <p className="text-zinc-400 text-lg leading-relaxed mb-10">
          Cuéntanos qué quieres crear. Sin compromiso, sin costos ocultos.
          Respondemos cada cotización en menos de 24 horas desde Playa del Carmen.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/cotizar"
            className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-xl text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Solicitar cotización gratis
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </Link>
          <Link
            href="/catalogo"
            className="inline-flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all"
          >
            Explorar catálogo
          </Link>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-zinc-500">
          {['Sin costo de consulta', 'Respuesta en 24h', 'Operamos desde PDC'].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500/60" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
