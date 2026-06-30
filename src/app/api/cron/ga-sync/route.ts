import { NextRequest, NextResponse } from 'next/server'
import { authorizeCron, businessDate } from '@/lib/cron'
import { fetchDailySnapshot, isGA4Configured } from '@/lib/ga4'
import { client } from '@/sanity/lib/client'

// Cron diario: baja las métricas de GA4 del día indicado (por defecto ayer, ya
// cerrado) y las guarda en Sanity como `gaDailySnapshot`. Idempotente vía
// createOrReplace con _id determinístico `ga-<fecha>`.
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  if (!authorizeCron(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  if (!isGA4Configured()) {
    return NextResponse.json(
      { skipped: true, reason: 'GA4 no configurado' },
      { status: 200 }
    )
  }

  // ?date=YYYY-MM-DD para backfill manual; si no, ayer.
  const dateParam = req.nextUrl.searchParams.get('date')
  const date = dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam) ? dateParam : businessDate(-1)

  try {
    const snapshot = await fetchDailySnapshot(date)
    await client.createOrReplace({
      _id: `ga-${date}`,
      _type: 'gaDailySnapshot',
      ...snapshot,
      fetchedAt: new Date().toISOString(),
    })
    return NextResponse.json({ ok: true, date, sessions: snapshot.sessions })
  } catch (err) {
    console.error('[/api/cron/ga-sync]', err)
    return NextResponse.json(
      { error: 'ga-sync falló', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
