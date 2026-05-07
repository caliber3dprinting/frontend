import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { client } from '@/sanity/lib/client'

export const metadata: Metadata = {
  title: 'Mis presupuestos | Caliber 3D',
}

type Presupuesto = {
  _id: string
  nombre: string
  cliente?: string
  pieza?: string
  cantidad: number
  totalSinAccesorios: number
  totalConAccesorios: number
  creadoEn: string
}

type Calculo = {
  _id: string
  nombrePieza: string
  resultado: number
  costoBase: number
  creadoEn: string
}

function fmt(n: number) {
  return n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function fmtFecha(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default async function HistorialPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const [presupuestos, calculos] = await Promise.all([
    client.fetch<Presupuesto[]>(
      `*[_type == "presupuesto" && userId == $userId] | order(creadoEn desc) {
        _id, nombre, cliente, pieza, cantidad,
        totalSinAccesorios, totalConAccesorios, creadoEn
      }`,
      { userId },
      { cache: 'no-store' }
    ),
    client.fetch<Calculo[]>(
      `*[_type == "calculo" && userId == $userId] | order(creadoEn desc) {
        _id, nombrePieza, resultado, costoBase, creadoEn
      }`,
      { userId },
      { cache: 'no-store' }
    ),
  ])

  return (
    <main className="min-h-screen bg-zinc-950 pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">
              Tu cuenta
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white mt-2">
              Historial guardado
            </h1>
          </div>
          <Link
            href="/presupuestador"
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Nuevo presupuesto
          </Link>
        </div>

        {/* ── Presupuestos ── */}
        <section className="mb-12">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-orange-500 rounded-full shrink-0" />
            Presupuestos ({presupuestos.length})
          </h2>

          {presupuestos.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center">
              <p className="text-zinc-500 text-sm mb-4">
                Todavía no guardaste ningún presupuesto.
              </p>
              <Link
                href="/presupuestador"
                className="text-orange-400 hover:text-orange-300 text-sm font-semibold transition-colors"
              >
                Crear el primero →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {presupuestos.map((p) => (
                <div
                  key={p._id}
                  className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-white text-sm leading-tight pr-2">
                      {p.nombre}
                    </h3>
                    <span className="text-xs text-zinc-600 shrink-0">{fmtFecha(p.creadoEn)}</span>
                  </div>

                  {p.cliente && (
                    <p className="text-xs text-zinc-500 mb-2">Cliente: {p.cliente}</p>
                  )}
                  {p.pieza && (
                    <p className="text-xs text-zinc-500 mb-2">Pieza: {p.pieza}</p>
                  )}

                  <div className="border-t border-zinc-800 pt-3 mt-3 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">{p.cantidad} {p.cantidad === 1 ? 'pieza' : 'piezas'}</span>
                    </div>
                    {p.totalSinAccesorios !== p.totalConAccesorios && (
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-600">Sin accesorios</span>
                        <span className="font-mono text-zinc-400">${fmt(p.totalSinAccesorios)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-zinc-400">Total</span>
                      <span className="font-mono text-orange-400">${fmt(p.totalConAccesorios)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Cálculos ── */}
        <section>
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-blue-500 rounded-full shrink-0" />
            Cálculos guardados ({calculos.length})
          </h2>

          {calculos.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center">
              <p className="text-zinc-500 text-sm mb-4">
                Todavía no guardaste ningún cálculo desde la calculadora.
              </p>
              <Link
                href="/calculadora"
                className="text-orange-400 hover:text-orange-300 text-sm font-semibold transition-colors"
              >
                Ir a la calculadora →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {calculos.map((c) => (
                <div
                  key={c._id}
                  className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-white text-sm leading-tight pr-2">
                      {c.nombrePieza}
                    </h3>
                    <span className="text-xs text-zinc-600 shrink-0">{fmtFecha(c.creadoEn)}</span>
                  </div>

                  <div className="border-t border-zinc-800 pt-3 mt-3 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-600">Costo base</span>
                      <span className="font-mono text-zinc-400">${fmt(c.costoBase)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-zinc-400">Costo real</span>
                      <span className="font-mono text-blue-400">${fmt(c.resultado)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  )
}
