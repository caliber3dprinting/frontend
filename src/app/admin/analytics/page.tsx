import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchDashboard, isGA4Configured } from '@/lib/ga4'
import { businessDate } from '@/lib/cron'
import { SessionsChart, ChannelsChart } from '@/components/admin/AnalyticsCharts'

export const metadata: Metadata = { title: 'Admin — Analytics' }
// Datos en vivo: nunca prerenderizar ni cachear.
export const dynamic = 'force-dynamic'

const RANGE_DAYS = 28

function KpiCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-zinc-400 mt-0.5">{label}</p>
      {hint && <p className="text-[11px] text-zinc-600 mt-0.5">{hint}</p>}
    </div>
  )
}

export default async function AnalyticsPage() {
  const user = await currentUser()
  const email = user?.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress
  if (email !== process.env.ADMIN_EMAIL) redirect('/')

  const start = businessDate(-RANGE_DAYS)
  const end = businessDate(-1)

  if (!isGA4Configured()) {
    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-24">
        <Header />
        <div className="bg-amber-950/40 border border-amber-800/50 rounded-xl p-6 text-amber-200 text-sm">
          GA4 no está configurado. Agrega <code>GA4_PROPERTY_ID</code>, <code>GA4_CLIENT_EMAIL</code> y{' '}
          <code>GA4_PRIVATE_KEY</code> en las variables de entorno para ver métricas en vivo.
        </div>
      </main>
    )
  }

  let data: Awaited<ReturnType<typeof fetchDashboard>> | null = null
  let error: string | null = null
  try {
    data = await fetchDashboard(start, end)
  } catch (err) {
    error = err instanceof Error ? err.message : String(err)
  }

  if (error || !data) {
    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-24">
        <Header />
        <div className="bg-red-950/40 border border-red-800/50 rounded-xl p-6 text-red-300 text-sm">
          No se pudieron cargar las métricas de GA4: {error}
        </div>
      </main>
    )
  }

  const { overview, timeseries, topChannels, topCities } = data
  const fmt = (n: number) => n.toLocaleString('es-MX')
  const mins = Math.floor(overview.avgSessionSec / 60)
  const secs = Math.round(overview.avgSessionSec % 60)

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-24">
      <Header range={`${start} → ${end}`} />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <KpiCard label="Sesiones" value={fmt(overview.sessions)} />
        <KpiCard label="Usuarios" value={fmt(overview.totalUsers)} hint={`${fmt(overview.newUsers)} nuevos`} />
        <KpiCard label="Vistas de página" value={fmt(overview.pageViews)} />
        <KpiCard label="Duración media" value={`${mins}m ${secs}s`} />
        <KpiCard label="Cotizaciones (GA)" value={fmt(overview.keyEventQuote)} hint="submit_quote_form" />
        <KpiCard label="Clics WhatsApp" value={fmt(overview.keyEventWhatsapp)} />
        <KpiCard label="Conversiones" value={fmt(overview.conversions)} />
        <KpiCard label="Interacción" value={`${(overview.engagementRate * 100).toFixed(1)}%`} />
      </div>

      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-zinc-300 mb-4">Sesiones y usuarios por día</h2>
        <SessionsChart data={timeseries} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-zinc-300 mb-4">Canales de adquisición</h2>
          <ChannelsChart data={topChannels} />
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-zinc-300 mb-4">Top ciudades</h2>
          {topCities.length === 0 ? (
            <p className="text-sm text-zinc-500 py-12 text-center">Sin datos de ciudades.</p>
          ) : (
            <ul className="space-y-2">
              {topCities.map((c) => (
                <li key={c.city} className="flex items-center justify-between text-sm">
                  <span className="text-zinc-300">{c.city}</span>
                  <span className="text-orange-400 font-semibold">{fmt(c.sessions)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

function Header({ range }: { range?: string }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-zinc-400 text-sm mt-1">{range ?? 'En vivo desde GA4'}</p>
      </div>
      <Link href="/admin" className="text-sm text-orange-400 hover:text-orange-300 underline shrink-0">
        ← Cotizaciones
      </Link>
    </div>
  )
}
