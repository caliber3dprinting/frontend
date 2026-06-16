'use client'

import { useEffect } from 'react'
import { trackEvent, type GAEventParams } from '@/lib/analytics'

/**
 * Dispara `scroll_75` una única vez cuando el usuario alcanza el 75% del scroll
 * vertical de la página. Listener pasivo y auto-removible para no afectar el scroll.
 */
export default function ScrollDepthTracker({ params }: { params?: GAEventParams }) {
  useEffect(() => {
    let fired = false

    function onScroll() {
      if (fired) return
      const scrolled = window.scrollY + window.innerHeight
      const total = document.documentElement.scrollHeight
      if (total > 0 && scrolled / total >= 0.75) {
        fired = true
        trackEvent('scroll_75', params)
        window.removeEventListener('scroll', onScroll)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    // Comprobación inicial: si la página ya entra completa en el viewport.
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
