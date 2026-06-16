'use client'

import { usePathname } from 'next/navigation'
import { GoogleAnalytics } from '@next/third-parties/google'

/**
 * Carga Google Analytics en todo el sitio EXCEPTO /studio y /admin.
 * Sin esto, GA trackea la actividad del propio admin en Sanity Studio
 * (donde la pestaña se titula "New Categoría" al crear documentos), inflando
 * las métricas con pageviews internos que no son tráfico real.
 */
export default function Analytics({ gaId }: { gaId: string }) {
  const pathname = usePathname()
  if (pathname?.startsWith('/studio') || pathname?.startsWith('/admin')) {
    return null
  }
  return <GoogleAnalytics gaId={gaId} />
}
