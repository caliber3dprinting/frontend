import { NextRequest, NextResponse } from 'next/server'
import { authorizeCron } from '@/lib/cron'

// Diagnóstico de Telegram (protegido con CRON_SECRET). Reporta si las env vars
// están presentes y devuelve la respuesta CRUDA de la API de Telegram para ver
// el error real (ej. "chat not found", "chat_id is empty"). No expone secretos.
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  if (!authorizeCron(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const token = process.env.TELEGRAM_BOT_TOKEN ?? ''
  const chatId = process.env.TELEGRAM_CHAT_ID ?? ''

  const diag = {
    hasToken: Boolean(token),
    tokenLooksValid: /^\d+:/.test(token), // formato NUMERO:LETRAS
    hasChatId: Boolean(chatId),
    chatIdLength: chatId.length,
    chatIdIsNumeric: /^-?\d+$/.test(chatId),
  }

  if (!token || !chatId) {
    return NextResponse.json({ ...diag, sent: false, reason: 'faltan env vars' })
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: '🧪 Test de diagnóstico Caliber 3D — Telegram OK.',
      }),
    })
    const telegram = await res.json()
    return NextResponse.json({ ...diag, sent: res.ok, telegram })
  } catch (err) {
    return NextResponse.json({
      ...diag,
      sent: false,
      error: err instanceof Error ? err.message : String(err),
    })
  }
}
