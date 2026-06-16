'use client'

import { trackEvent, type GAEventName, type GAEventParams } from '@/lib/analytics'

type TrackedLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: GAEventName
  eventParams?: GAEventParams
}

/**
 * Ancla `<a>` que dispara un evento GA4 al hacer clic. Pensado para enlaces
 * externos o de protocolo (wa.me, mailto:, tel:) embebidos en Server Components.
 * Para navegación interna con next/link, agregar onClick directo en el componente.
 */
export default function TrackedLink({
  event,
  eventParams,
  onClick,
  children,
  ...rest
}: TrackedLinkProps) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        trackEvent(event, eventParams)
        onClick?.(e)
      }}
    >
      {children}
    </a>
  )
}
