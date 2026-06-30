import { defineField, defineType } from 'sanity'

// Snapshot diario de métricas de GA4 que baja el cron (/api/cron/ga-sync).
// El _id es determinístico (`ga-YYYY-MM-DD`) para que createOrReplace sea
// idempotente: re-correr el cron de un día sobrescribe en vez de duplicar.
export const gaDailySnapshotType = defineType({
  name: 'gaDailySnapshot',
  title: 'GA4 — Snapshot diario',
  type: 'document',
  fields: [
    defineField({ name: 'date', title: 'Fecha (YYYY-MM-DD)', type: 'string' }),
    defineField({ name: 'sessions', title: 'Sesiones', type: 'number' }),
    defineField({ name: 'totalUsers', title: 'Usuarios', type: 'number' }),
    defineField({ name: 'newUsers', title: 'Usuarios nuevos', type: 'number' }),
    defineField({ name: 'pageViews', title: 'Vistas de página', type: 'number' }),
    defineField({ name: 'engagementRate', title: 'Tasa de interacción', type: 'number' }),
    defineField({ name: 'avgSessionSec', title: 'Duración media sesión (s)', type: 'number' }),
    defineField({ name: 'keyEventQuote', title: 'Eventos submit_quote_form', type: 'number' }),
    defineField({ name: 'keyEventWhatsapp', title: 'Eventos click_whatsapp', type: 'number' }),
    defineField({ name: 'conversions', title: 'Conversiones', type: 'number' }),
    defineField({
      name: 'topChannels',
      title: 'Canales',
      type: 'array',
      of: [
        defineField({
          name: 'channel',
          type: 'object',
          fields: [
            { name: 'name', type: 'string' },
            { name: 'sessions', type: 'number' },
            { name: 'conversions', type: 'number' },
          ],
        }),
      ],
    }),
    defineField({
      name: 'topPages',
      title: 'Top páginas',
      type: 'array',
      of: [
        defineField({
          name: 'page',
          type: 'object',
          fields: [
            { name: 'path', type: 'string' },
            { name: 'views', type: 'number' },
          ],
        }),
      ],
    }),
    defineField({
      name: 'topCities',
      title: 'Top ciudades',
      type: 'array',
      of: [
        defineField({
          name: 'cityStat',
          type: 'object',
          fields: [
            { name: 'city', type: 'string' },
            { name: 'sessions', type: 'number' },
          ],
        }),
      ],
    }),
    defineField({ name: 'fetchedAt', title: 'Descargado el', type: 'datetime' }),
  ],
  orderings: [{ title: 'Más recientes', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] }],
  preview: {
    select: { title: 'date', sessions: 'sessions' },
    prepare({ title, sessions }) {
      return { title: `📊 ${title}`, subtitle: `${sessions ?? 0} sesiones` }
    },
  },
})
