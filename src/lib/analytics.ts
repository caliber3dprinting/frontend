'use client'

import { sendGAEvent } from '@next/third-parties/google'

/**
 * Eventos de conversión que enviamos a GA4. Mantener esta lista tipada evita
 * typos en los nombres de evento (que en GA4 son irreversibles una vez creados).
 * Ver README-analytics.md para el detalle de parámetros y dónde se dispara cada uno.
 */
export type GAEventName =
  | 'submit_quote_form'
  | 'submit_quote_form_error'
  | 'click_whatsapp'
  | 'click_phone'
  | 'click_email'
  | 'calculator_complete'
  | 'calculator_step'
  | 'view_product'
  | 'view_blog_post'
  | 'scroll_75'
  | 'cta_click'

export type GAEventParams = Record<string, string | number | boolean>

export function trackEvent(name: GAEventName, params?: GAEventParams) {
  if (typeof window === 'undefined') return
  try {
    // sendGAEvent hace dataLayer.push(['event', name, params]) — patrón gtag.
    sendGAEvent('event', name, params ?? {})
  } catch {
    // Fallback a gtag directo si sendGAEvent no está disponible.
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, params ?? {})
    }
  }
}
