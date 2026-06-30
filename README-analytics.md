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

## Dashboard interno — `/admin/analytics`

Panel gateado por `ADMIN_EMAIL` (mismo guard que `/admin`) con KPIs en vivo desde
la **GA4 Data API** (REST + JWT firmado con Web Crypto — sin gRPC, corre en edge),
más notificación a Telegram por cada cotización y reportes automáticos.

### Piezas

| Pieza | Archivo |
|---|---|
| Telegram (cotización: fuente/vertical/ciudad) | [`src/lib/telegram.ts`](src/lib/telegram.ts), disparado en [`api/quotes/route.ts`](src/app/api/quotes/route.ts) |
| Cliente GA4 Data API (REST + JWT) | [`src/lib/ga4.ts`](src/lib/ga4.ts) |
| Dashboard en vivo + Recharts | [`src/app/admin/analytics/page.tsx`](src/app/admin/analytics/page.tsx), [`src/components/admin/AnalyticsCharts.tsx`](src/components/admin/AnalyticsCharts.tsx) |
| Snapshot diario (Sanity) | doc `gaDailySnapshot` + [`api/cron/ga-sync`](src/app/api/cron/ga-sync/route.ts) |
| Reporte semanal por email | [`api/cron/weekly-report`](src/app/api/cron/weekly-report/route.ts) (Resend) |
| Programación (cron) | [`.github/workflows/ga-daily-sync.yml`](.github/workflows/ga-daily-sync.yml), [`weekly-report.yml`](.github/workflows/weekly-report.yml) |

> **Almacenamiento:** los snapshots y la atribución de cotizaciones se guardan en
> **Sanity** (no Postgres). El cron diario es una **GitHub Action** que llama al
> endpoint protegido — el sitio no usa Netlify ni cron nativo.

### Credenciales a generar

1. **GA4 Service Account** — en Google Cloud: habilitar *Google Analytics Data API*,
   crear service account + clave JSON, y dar a su `client_email` rol **Viewer** en
   la propiedad GA4. Anotar el **Property ID numérico** (no el `G-XXXX`).
2. **Telegram Bot** — `@BotFather` → `/newbot` (token) y obtener el **chat ID**
   (`api.telegram.org/bot<TOKEN>/getUpdates`).
3. **Resend** — ya configurado (`RESEND_API_KEY`).

### Variables de entorno (`.env.local` + dashboard de hosting)

```bash
GA4_PROPERTY_ID=421398765
GA4_CLIENT_EMAIL=caliber-analytics@proyecto.iam.gserviceaccount.com
GA4_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
# (admite el PEM con \n literales o el PEM en base64)
TELEGRAM_BOT_TOKEN=123456:ABC...
TELEGRAM_CHAT_ID=987654321
CRON_SECRET=<aleatorio-largo>          # protege los endpoints /api/cron/*
REPORT_RECIPIENT=tucorreo@ejemplo.com  # opcional; default ADMIN_EMAIL/QUOTE_RECIPIENT
```

Todas degradan con elegancia: si falta una credencial, esa pieza se omite sin
romper el sitio (mismo patrón que Turnstile).

### Secrets de GitHub Actions (Settings → Secrets → Actions)

- `CRON_SECRET` — el mismo valor que en el hosting.
- `SITE_URL` — base de producción, ej. `https://caliber3d.mx`.

Disparo manual de prueba: pestaña **Actions → (workflow) → Run workflow**, o
`curl -H "Authorization: Bearer $CRON_SECRET" $SITE_URL/api/cron/ga-sync`.
Backfill de un día: `.../api/cron/ga-sync?date=2026-06-29`.

## Mejoras futuras

- **WhatsApp inline a mitad del blog**: insertar un CTA de WhatsApp dentro del
  contenido del post (tras ~60% del texto), además del botón flotante. Requiere
  partir el array de Portable Text en `RichText` / Sanity, por lo que se pospone:
  es invasivo y de bajo retorno mientras el botón flotante ya captura el contacto.
