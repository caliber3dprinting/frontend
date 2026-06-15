'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

type TurnstileApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string
  reset: (widgetId?: string) => void
  remove: (widgetId?: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

interface TurnstileProps {
  siteKey: string
  /** Se llama con el token cuando el usuario pasa la verificación. */
  onVerify: (token: string) => void
  /** Se llama cuando el token expira o hay un error (token ya no válido). */
  onExpire?: () => void
  /**
   * Cambiar este número fuerza un reinicio del widget para obtener un token
   * nuevo (los tokens de Turnstile son de un solo uso).
   */
  resetSignal?: number
}

/**
 * Widget de Cloudflare Turnstile con renderizado explícito.
 * El script ya está permitido en la CSP (challenges.cloudflare.com).
 */
export default function Turnstile({ siteKey, onVerify, onExpire, resetSignal = 0 }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [ready, setReady] = useState(false)

  // Guardamos los callbacks en refs para que el efecto de render no dependa de
  // ellos (evita re-renderizar el widget en cada render del padre).
  const onVerifyRef = useRef(onVerify)
  const onExpireRef = useRef(onExpire)
  onVerifyRef.current = onVerify
  onExpireRef.current = onExpire

  // Si el script ya estaba cargado (p. ej. al volver a montar), marcamos listo.
  useEffect(() => {
    if (window.turnstile) setReady(true)
  }, [])

  // Render del widget una vez que la API está disponible.
  useEffect(() => {
    if (!ready || !window.turnstile || !containerRef.current) return
    if (widgetIdRef.current !== null) return

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: 'dark',
      callback: (token: string) => onVerifyRef.current(token),
      'expired-callback': () => onExpireRef.current?.(),
      'error-callback': () => onExpireRef.current?.(),
    })

    return () => {
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [ready, siteKey])

  // Reinicio bajo demanda (token de un solo uso ya consumido).
  useEffect(() => {
    if (resetSignal === 0) return
    if (widgetIdRef.current !== null && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current)
    }
  }, [resetSignal])

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
        onReady={() => setReady(true)}
      />
      <div ref={containerRef} />
    </>
  )
}
