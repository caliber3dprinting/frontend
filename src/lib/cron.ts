import type { NextRequest } from 'next/server'

// Autoriza un endpoint de cron. Acepta el secreto por header Authorization:
// `Bearer <CRON_SECRET>` (lo que mandan las GitHub Actions) o por query `?secret=`.
// Si CRON_SECRET no está configurado, se bloquea por seguridad (no degrada abierto).
export function authorizeCron(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false

  const auth = req.headers.get('authorization')
  if (auth === `Bearer ${secret}`) return true

  const qs = req.nextUrl.searchParams.get('secret')
  return qs === secret
}

// Fecha YYYY-MM-DD en la zona horaria del negocio (Playa del Carmen, America/Cancun).
// `offsetDays` negativo retrocede días (ej. -1 = ayer).
export function businessDate(offsetDays = 0): string {
  const tz = 'America/Cancun'
  const now = new Date(Date.now() + offsetDays * 86_400_000)
  // en-CA da formato YYYY-MM-DD directamente.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}
