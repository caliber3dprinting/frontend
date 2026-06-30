// Cliente mínimo de la GA4 Data API por REST. No usamos @google-analytics/data
// (depende de gRPC, que no corre en runtimes edge/Workers): firmamos un JWT
// RS256 con Web Crypto y pedimos un access token OAuth2 de service account.
//
// Requiere: GA4_PROPERTY_ID, GA4_CLIENT_EMAIL, GA4_PRIVATE_KEY.
// GA4_PRIVATE_KEY admite el PEM con saltos `\n` literales o el PEM en base64.

const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const SCOPE = 'https://www.googleapis.com/auth/analytics.readonly'

export function isGA4Configured(): boolean {
  return Boolean(
    process.env.GA4_PROPERTY_ID &&
      process.env.GA4_CLIENT_EMAIL &&
      process.env.GA4_PRIVATE_KEY
  )
}

// ─── base64 helpers ──────────────────────────────────────────────────────────

function base64UrlFromBytes(bytes: Uint8Array): string {
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlFromString(str: string): string {
  return base64UrlFromBytes(new TextEncoder().encode(str))
}

function bytesFromBase64(b64: string): Uint8Array {
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

function normalizePrivateKey(raw: string): string {
  let value = raw.trim()
  // Quita comillas envolventes si quedaron pegadas al cargar la var en el dashboard
  // (causa común de "Invalid character" al decodificar).
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1)
  }
  // Si no es un PEM, asumimos que viene en base64 y lo decodificamos.
  if (!value.includes('BEGIN')) value = atob(value)
  return value.replace(/\\n/g, '\n')
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  // Deja solo caracteres base64 válidos: descarta cabeceras, saltos, comillas y
  // cualquier basura que se haya colado al pegar la clave en el hosting.
  const body = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/[^A-Za-z0-9+/=]/g, '')
  return bytesFromBase64(body).buffer as ArrayBuffer
}

// ─── OAuth2 (service account JWT bearer) ─────────────────────────────────────

let cachedToken: { token: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.token
  }

  const clientEmail = process.env.GA4_CLIENT_EMAIL!
  const privateKeyPem = normalizePrivateKey(process.env.GA4_PRIVATE_KEY!)

  const now = Math.floor(Date.now() / 1000)
  const header = base64UrlFromString(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claim = base64UrlFromString(
    JSON.stringify({
      iss: clientEmail,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    })
  )
  const signingInput = `${header}.${claim}`

  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(privateKeyPem),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    new TextEncoder().encode(signingInput)
  )
  const jwt = `${signingInput}.${base64UrlFromBytes(new Uint8Array(signature))}`

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })
  if (!res.ok) {
    throw new Error(`GA4 token error ${res.status}: ${await res.text()}`)
  }
  const data = (await res.json()) as { access_token: string; expires_in: number }
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  }
  return data.access_token
}

// ─── runReport ───────────────────────────────────────────────────────────────

interface ReportRow {
  dimensionValues?: { value: string }[]
  metricValues?: { value: string }[]
}

interface RunReportBody {
  dateRanges: { startDate: string; endDate: string }[]
  metrics: { name: string }[]
  dimensions?: { name: string }[]
  dimensionFilter?: unknown
  orderBys?: unknown[]
  limit?: number
}

async function runReport(body: RunReportBody): Promise<ReportRow[]> {
  const token = await getAccessToken()
  const propertyId = process.env.GA4_PROPERTY_ID!
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  )
  if (!res.ok) {
    throw new Error(`GA4 runReport error ${res.status}: ${await res.text()}`)
  }
  const data = (await res.json()) as { rows?: ReportRow[] }
  return data.rows ?? []
}

const num = (v?: string) => (v ? Number(v) || 0 : 0)

// ─── Shapes públicos ─────────────────────────────────────────────────────────

export interface DailySnapshot {
  date: string
  sessions: number
  totalUsers: number
  newUsers: number
  pageViews: number
  engagementRate: number
  avgSessionSec: number
  keyEventQuote: number
  keyEventWhatsapp: number
  conversions: number
  topChannels: { name: string; sessions: number; conversions: number }[]
  topPages: { path: string; views: number }[]
  topCities: { city: string; sessions: number }[]
}

/** Métricas overview de un rango (para los KPIs en vivo del dashboard). */
export async function fetchOverview(
  startDate: string,
  endDate: string
): Promise<Omit<DailySnapshot, 'date' | 'topChannels' | 'topPages' | 'topCities'>> {
  const rows = await runReport({
    dateRanges: [{ startDate, endDate }],
    metrics: [
      { name: 'sessions' },
      { name: 'totalUsers' },
      { name: 'newUsers' },
      { name: 'screenPageViews' },
      { name: 'engagementRate' },
      { name: 'averageSessionDuration' },
      { name: 'conversions' },
    ],
  })
  const m = rows[0]?.metricValues ?? []
  const [quote, whatsapp] = await Promise.all([
    fetchEventCount(startDate, endDate, 'submit_quote_form'),
    fetchEventCount(startDate, endDate, 'click_whatsapp'),
  ])
  return {
    sessions: num(m[0]?.value),
    totalUsers: num(m[1]?.value),
    newUsers: num(m[2]?.value),
    pageViews: num(m[3]?.value),
    engagementRate: num(m[4]?.value),
    avgSessionSec: num(m[5]?.value),
    conversions: num(m[6]?.value),
    keyEventQuote: quote,
    keyEventWhatsapp: whatsapp,
  }
}

async function fetchEventCount(
  startDate: string,
  endDate: string,
  eventName: string
): Promise<number> {
  const rows = await runReport({
    dateRanges: [{ startDate, endDate }],
    metrics: [{ name: 'eventCount' }],
    dimensions: [{ name: 'eventName' }],
    dimensionFilter: {
      filter: { fieldName: 'eventName', stringFilter: { value: eventName } },
    },
  })
  return num(rows[0]?.metricValues?.[0]?.value)
}

async function fetchTopChannels(startDate: string, endDate: string) {
  const rows = await runReport({
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'sessionDefaultChannelGroup' }],
    metrics: [{ name: 'sessions' }, { name: 'conversions' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 8,
  })
  return rows.map((r) => ({
    name: r.dimensionValues?.[0]?.value ?? '(other)',
    sessions: num(r.metricValues?.[0]?.value),
    conversions: num(r.metricValues?.[1]?.value),
  }))
}

async function fetchTopPages(startDate: string, endDate: string) {
  const rows = await runReport({
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 10,
  })
  return rows.map((r) => ({
    path: r.dimensionValues?.[0]?.value ?? '/',
    views: num(r.metricValues?.[0]?.value),
  }))
}

async function fetchTopCities(startDate: string, endDate: string) {
  const rows = await runReport({
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'city' }],
    metrics: [{ name: 'sessions' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 8,
  })
  return rows.map((r) => ({
    city: r.dimensionValues?.[0]?.value ?? '(not set)',
    sessions: num(r.metricValues?.[0]?.value),
  }))
}

/** Snapshot completo de un día (lo usa el cron para guardar en Sanity). */
export async function fetchDailySnapshot(date: string): Promise<DailySnapshot> {
  const [overview, topChannels, topPages, topCities] = await Promise.all([
    fetchOverview(date, date),
    fetchTopChannels(date, date),
    fetchTopPages(date, date),
    fetchTopCities(date, date),
  ])
  return { date, ...overview, topChannels, topPages, topCities }
}

/** Todo lo que necesita el dashboard /admin/analytics en una sola llamada. */
export async function fetchDashboard(startDate: string, endDate: string) {
  const [overview, timeseries, topChannels, topCities] = await Promise.all([
    fetchOverview(startDate, endDate),
    fetchDailyTimeseries(startDate, endDate),
    fetchTopChannels(startDate, endDate),
    fetchTopCities(startDate, endDate),
  ])
  return { overview, timeseries, topChannels, topCities }
}

/** Distribución diaria de sesiones/usuarios para los gráficos en vivo. */
export async function fetchDailyTimeseries(startDate: string, endDate: string) {
  const rows = await runReport({
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'date' }],
    metrics: [{ name: 'sessions' }, { name: 'totalUsers' }, { name: 'conversions' }],
    orderBys: [{ dimension: { dimensionName: 'date' } }],
  })
  return rows.map((r) => {
    const d = r.dimensionValues?.[0]?.value ?? ''
    return {
      date: d.length === 8 ? `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}` : d,
      sessions: num(r.metricValues?.[0]?.value),
      users: num(r.metricValues?.[1]?.value),
      conversions: num(r.metricValues?.[2]?.value),
    }
  })
}
