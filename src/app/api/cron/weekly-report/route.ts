import { NextRequest, NextResponse } from 'next/server'
import { authorizeCron, businessDate } from '@/lib/cron'
import { sendAnalyticsReportEmail } from '@/lib/mailer'
import { client } from '@/sanity/lib/client'

// Cron semanal (lunes 8am MX): arma un resumen de los últimos 7 días con los
// snapshots de GA4 guardados en Sanity + las cotizaciones recibidas, y lo envía
// por email vía Resend.
export const dynamic = 'force-dynamic'

interface Snapshot {
  date: string
  sessions?: number
  totalUsers?: number
  newUsers?: number
  pageViews?: number
  keyEventQuote?: number
  keyEventWhatsapp?: number
  conversions?: number
  topChannels?: { name: string; sessions: number }[]
  topCities?: { city: string; sessions: number }[]
}

interface QuoteRow {
  category?: string
  source?: string
  city?: string
}

function sum(rows: Snapshot[], key: keyof Snapshot): number {
  return rows.reduce((acc, r) => acc + (Number(r[key]) || 0), 0)
}

function topAgg(
  rows: Snapshot[],
  list: 'topChannels' | 'topCities',
  labelKey: 'name' | 'city'
): { label: string; sessions: number }[] {
  const map = new Map<string, number>()
  for (const r of rows) {
    for (const item of r[list] ?? []) {
      const label = (item as Record<string, unknown>)[labelKey] as string
      map.set(label, (map.get(label) ?? 0) + (item.sessions || 0))
    }
  }
  return [...map.entries()]
    .map(([label, sessions]) => ({ label, sessions }))
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 5)
}

function h(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export async function GET(req: NextRequest) {
  if (!authorizeCron(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const start = businessDate(-7)
  const end = businessDate(-1)
  const startIso = new Date(Date.now() - 7 * 86_400_000).toISOString()

  try {
    const [snapshots, quotes] = await Promise.all([
      client.fetch<Snapshot[]>(
        `*[_type == "gaDailySnapshot" && date >= $start && date <= $end] | order(date asc)`,
        { start, end },
        { cache: 'no-store' }
      ),
      client.fetch<QuoteRow[]>(
        `*[_type == "quote" && submittedAt >= $startIso]{ category, source, city }`,
        { startIso },
        { cache: 'no-store' }
      ),
    ])

    const totals = {
      sessions: sum(snapshots, 'sessions'),
      users: sum(snapshots, 'totalUsers'),
      newUsers: sum(snapshots, 'newUsers'),
      pageViews: sum(snapshots, 'pageViews'),
      quoteEvents: sum(snapshots, 'keyEventQuote'),
      whatsapp: sum(snapshots, 'keyEventWhatsapp'),
      conversions: sum(snapshots, 'conversions'),
    }

    // Verticales de las cotizaciones de la semana.
    const verticalMap = new Map<string, number>()
    for (const q of quotes) {
      const v = q.category || 'Sin categoría'
      verticalMap.set(v, (verticalMap.get(v) ?? 0) + 1)
    }
    const verticals = [...verticalMap.entries()].sort((a, b) => b[1] - a[1])

    const channels = topAgg(snapshots, 'topChannels', 'name')
    const cities = topAgg(snapshots, 'topCities', 'city')

    const row = (label: string, value: string | number) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #3f3f46;color:#a1a1aa;font-size:13px;">${label}</td>
        <td style="padding:8px 0;border-bottom:1px solid #3f3f46;font-weight:600;text-align:right;">${value}</td>
      </tr>`

    const listBlock = (title: string, items: { label: string; sessions: number }[]) =>
      items.length
        ? `<div style="margin-top:20px;">
             <p style="color:#a1a1aa;font-size:13px;margin:0 0 8px;">${title}</p>
             ${items
               .map(
                 (i) =>
                   `<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:14px;">
                      <span>${h(i.label)}</span><span style="color:#f97316;font-weight:600;">${i.sessions}</span>
                    </div>`
               )
               .join('')}
           </div>`
        : ''

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#18181b;color:#fafafa;border-radius:12px;overflow:hidden;">
        <div style="background:#f97316;padding:24px 32px;">
          <h1 style="margin:0;font-size:22px;color:#fff;">📊 Reporte semanal — Caliber 3D</h1>
          <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">${start} → ${end}</p>
        </div>
        <div style="padding:32px;">
          <table style="width:100%;border-collapse:collapse;">
            ${row('Sesiones', totals.sessions.toLocaleString('es-MX'))}
            ${row('Usuarios', totals.users.toLocaleString('es-MX'))}
            ${row('Usuarios nuevos', totals.newUsers.toLocaleString('es-MX'))}
            ${row('Vistas de página', totals.pageViews.toLocaleString('es-MX'))}
            ${row('Cotizaciones (evento GA)', totals.quoteEvents)}
            ${row('Clics WhatsApp', totals.whatsapp)}
            ${row('Conversiones', totals.conversions)}
            ${row('<b>Cotizaciones recibidas</b>', `<b>${quotes.length}</b>`)}
          </table>

          ${
            verticals.length
              ? `<div style="margin-top:20px;">
                   <p style="color:#a1a1aa;font-size:13px;margin:0 0 8px;">Cotizaciones por vertical</p>
                   ${verticals
                     .map(
                       ([v, n]) =>
                         `<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:14px;">
                            <span>${h(v)}</span><span style="color:#f97316;font-weight:600;">${n}</span>
                          </div>`
                     )
                     .join('')}
                 </div>`
              : ''
          }
          ${listBlock('Top canales (sesiones)', channels)}
          ${listBlock('Top ciudades (sesiones)', cities)}

          ${
            snapshots.length === 0
              ? `<p style="margin-top:24px;color:#71717a;font-style:italic;">Sin snapshots de GA4 para este rango. Verifica que el cron diario esté corriendo.</p>`
              : ''
          }
        </div>
        <div style="padding:16px 32px;background:#27272a;font-size:12px;color:#71717a;text-align:center;">
          Caliber 3D · Reporte automático · ${snapshots.length} día(s) de datos
        </div>
      </div>`

    await sendAnalyticsReportEmail(`Reporte semanal Caliber 3D — ${start} a ${end}`, html)
    return NextResponse.json({ ok: true, days: snapshots.length, quotes: quotes.length })
  } catch (err) {
    console.error('[/api/cron/weekly-report]', err)
    return NextResponse.json(
      { error: 'weekly-report falló', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
