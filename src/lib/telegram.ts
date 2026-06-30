// Notificaciones a Telegram vía Bot API. Igual que Turnstile/Resend, degrada con
// elegancia: si faltan TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID, simplemente no
// envía nada (no rompe el flujo de cotización).

const API_BASE = 'https://api.telegram.org'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/** Envía un mensaje HTML al chat configurado. Resuelve a `false` si no hay
 *  credenciales o si la API responde con error (sin lanzar). */
export async function sendTelegramMessage(html: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    console.warn('[telegram] TELEGRAM_BOT_TOKEN/CHAT_ID no configurados — notificación omitida')
    return false
  }

  try {
    const res = await fetch(`${API_BASE}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: html,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    })
    if (!res.ok) {
      console.error('[telegram] sendMessage falló:', res.status, await res.text())
      return false
    }
    return true
  } catch (err) {
    console.error('[telegram] error de red:', err)
    return false
  }
}

export interface QuoteTelegramData {
  name: string
  vertical?: string // tipo de proyecto (category del form)
  source?: string // utm_source o referrer
  medium?: string
  campaign?: string
  city?: string
  country?: string
  hasImage?: boolean
}

/** Notifica la llegada de una nueva cotización con fuente, vertical y ciudad. */
export async function notifyQuoteTelegram(data: QuoteTelegramData): Promise<boolean> {
  const { name, vertical, source, medium, campaign, city, country, hasImage } = data

  const fuente = [source, medium, campaign].filter(Boolean).join(' / ') || 'directo'
  const ubicacion = [city, country].filter(Boolean).join(', ') || 'desconocida'

  const lines = [
    '🔔 <b>Nueva cotización</b> — Caliber 3D',
    '',
    `👤 <b>Cliente:</b> ${escapeHtml(name)}`,
    `🏷️ <b>Vertical:</b> ${escapeHtml(vertical || 'Sin categoría')}`,
    `📈 <b>Fuente:</b> ${escapeHtml(fuente)}`,
    `📍 <b>Ciudad:</b> ${escapeHtml(ubicacion)}`,
    hasImage ? '🖼️ <i>Incluye imagen de referencia</i>' : '',
  ].filter(Boolean)

  return sendTelegramMessage(lines.join('\n'))
}
