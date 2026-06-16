'use client'

import { useEffect, useRef } from 'react'
import { trackEvent, type GAEventName, type GAEventParams } from '@/lib/analytics'

/**
 * Dispara un evento de "vista" una sola vez al montar. Se monta dentro de
 * Server Components (páginas de producto / blog) que no pueden usar hooks.
 */
export default function TrackView({
  event,
  params,
}: {
  event: GAEventName
  params?: GAEventParams
}) {
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true
    trackEvent(event, params)
    // params se serializa al montar; no queremos re-disparar si cambia su identidad.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
