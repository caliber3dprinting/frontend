# Analytics — Eventos de conversión GA4

Eventos personalizados que el sitio envía a Google Analytics 4. El measurement ID
se inyecta vía `NEXT_PUBLIC_GA_ID` y el componente `<GoogleAnalytics>` de
`@next/third-parties/google` (ver `src/app/layout.tsx`). Los eventos se disparan
con el helper tipado `trackEvent()` de [`src/lib/analytics.ts`](src/lib/analytics.ts).

## Cómo funciona

- `trackEvent(name, params)` llama a `sendGAEvent('event', name, params)`, que hace
  `dataLayer.push(['event', name, params])` (el patrón estándar de gtag).
- Si GA no está inicializado, `sendGAEvent` solo emite un `console.warn` (no rompe).
- Sin `NEXT_PUBLIC_GA_ID` configurado, el script de GA no se monta y los eventos
  simplemente no se envían (sin errores).

## Eventos

| Evento | Parámetros | Dónde se dispara |
|---|---|---|
| `submit_quote_form` | `category`, `has_image` | `src/components/forms/QuoteForm.tsx` — respuesta OK del POST a `/api/quotes` |
| `submit_quote_form_error` | `reason` | `src/components/forms/QuoteForm.tsx` — error en el submit |
| `calculator_complete` | `action` (`copy`\|`save`), `estimated_cost`, `quantity` | `src/components/tools/CalculadoraCostos.tsx` — al copiar desglose o guardar cálculo (con `costoUnidad > 0`) |
| `click_whatsapp` | `location` (`footer`\|`product`\|`blog`\|`float`), `slug?` | Footer, página de producto, página de blog, botón flotante (Tarea 4) |
| `click_email` | `location` (`footer`) | `src/components/layout/Footer.tsx` — link `mailto:` |
| `view_product` | `slug`, `name` | `src/app/catalogo/[slug]/page.tsx` — una vez por vista |
| `view_blog_post` | `slug` | `src/app/blog/[slug]/page.tsx` — una vez por vista |
| `scroll_75` | `slug` | `src/app/blog/[slug]/page.tsx` — al alcanzar el 75% del scroll |
| `cta_click` | `cta_id` | CTAs del home (`HeroSection`, `QuoteCTA`) |

### Eventos declarados pero aún sin emisor

Definidos en el tipo `GAEventName` para uso futuro, todavía sin punto de disparo:

- `click_phone` — no hay link `tel:` en el sitio actualmente. Conectar cuando se agregue.
- `calculator_step` — la calculadora no tiene wizard por pasos (recalcula en vivo).

## Configuración manual en GA4 (pendiente del dueño)

En el dashboard de GA4 → **Administrar → Eventos → Marcar como evento clave**,
marcar como **eventos clave (key events)**:

- `submit_quote_form`
- `click_whatsapp`
- `click_email`
- `calculator_complete`

Esto habilita medir conversiones reales (hoy "Eventos clave: sin datos").

## Componentes reutilizables

- [`TrackedLink`](src/components/analytics/TrackedLink.tsx) — ancla `<a>` que
  dispara un evento al clic (para wa.me / mailto: / tel: en Server Components).
- [`TrackView`](src/components/analytics/TrackView.tsx) — dispara un evento de
  vista una sola vez al montar.
- [`ScrollDepthTracker`](src/components/analytics/ScrollDepthTracker.tsx) —
  dispara `scroll_75` al alcanzar el 75% del scroll.
- [`Analytics`](src/components/analytics/Analytics.tsx) — carga GA en todo el
  sitio excepto `/studio` y `/admin` (evita trackear la actividad interna de admin).

## Mejoras futuras

- **WhatsApp inline a mitad del blog**: insertar un CTA de WhatsApp dentro del
  contenido del post (tras ~60% del texto), además del botón flotante. Requiere
  partir el array de Portable Text en `RichText` / Sanity, por lo que se pospone:
  es invasivo y de bajo retorno mientras el botón flotante ya captura el contacto.
