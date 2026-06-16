const WHATSAPP_FALLBACK = '529982017863'

/**
 * Número de WhatsApp de Caliber 3D, normalizado a solo dígitos.
 * Nunca devuelve undefined: usa el override (ej. el número de Sanity),
 * luego la env var, y por último el fallback hardcodeado.
 */
export function getWhatsappNumber(override?: string | null): string {
  const raw = override || process.env.NEXT_PUBLIC_WHATSAPP || WHATSAPP_FALLBACK
  return raw.replace(/\D/g, '')
}

/**
 * Construye un enlace wa.me con mensaje opcional prellenado por contexto.
 * Centraliza la construcción para que nunca se genere un `wa.me/undefined`.
 */
export function buildWhatsappUrl(message?: string, numberOverride?: string | null): string {
  const number = getWhatsappNumber(numberOverride)
  const text = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${number}${text}`
}
