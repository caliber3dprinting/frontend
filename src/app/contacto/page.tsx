import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/ui/Breadcrumb'
import TrackedLink from '@/components/analytics/TrackedLink'
import JsonLd from '@/components/seo/JsonLd'
import { localBusinessSchema } from '@/lib/schema'
import { BUSINESS } from '@/lib/business'
import { buildWhatsappUrl } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Contacto — Impresión 3D en Playa del Carmen',
  description:
    'Contactá a Caliber 3D: impresión 3D en Playa del Carmen y toda la Riviera Maya. WhatsApp directo, horarios, áreas de servicio y cotización en 24 horas.',
  alternates: { canonical: '/contacto' },
}

// Mapa embebido sin API key: centra en las coordenadas del negocio.
// ⚠️ Cuando el Perfil de Empresa de Google esté verificado, reemplazar por el
// embed oficial del perfil (más preciso y con la ficha del negocio).
const MAP_SRC = `https://maps.google.com/maps?q=${BUSINESS.geo.latitude},${BUSINESS.geo.longitude}&z=13&output=embed`

export default function ContactoPage() {
  const waUrl = buildWhatsappUrl(
    'Hola, me gustaría cotizar una impresión 3D',
    BUSINESS.whatsapp,
  )

  return (
    <main className="min-h-screen bg-zinc-950 pt-28 pb-20">
      <JsonLd data={localBusinessSchema()} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Contacto' }]} />

        <header className="mt-6 mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">Contacto</h1>
          <p className="text-zinc-400 leading-relaxed max-w-2xl">
            {BUSINESS.name} — impresión 3D a medida en {BUSINESS.address.locality} y
            toda la Riviera Maya. Escribinos por WhatsApp o solicitá tu cotización;
            respondemos en menos de 24 horas.
          </p>
        </header>

        {/* CTAs principales */}
        <div className="grid gap-4 sm:grid-cols-2 mb-12">
          <TrackedLink
            event="click_whatsapp"
            eventParams={{ location: 'contacto' }}
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 rounded-xl bg-green-600 hover:bg-green-500 px-6 py-4 text-base font-semibold text-white transition-colors"
          >
            <svg aria-hidden="true" className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Escribir por WhatsApp
          </TrackedLink>
          <Link
            href="/cotizar"
            className="flex items-center justify-center gap-3 rounded-xl bg-orange-600 hover:bg-orange-500 px-6 py-4 text-base font-semibold text-white transition-colors"
          >
            Solicitar cotización
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Datos de contacto */}
          <div className="space-y-8">
            <section>
              <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">
                Datos de contacto
              </h2>
              <ul className="space-y-3 text-zinc-300">
                <li>
                  <span className="text-zinc-500">Teléfono / WhatsApp:</span>{' '}
                  <a href={`tel:${BUSINESS.phoneE164}`} className="hover:text-white transition-colors">
                    {BUSINESS.phone}
                  </a>
                </li>
                <li>
                  <span className="text-zinc-500">Email:</span>{' '}
                  <a href={`mailto:${BUSINESS.email}`} className="hover:text-white transition-colors">
                    {BUSINESS.email}
                  </a>
                </li>
                <li>
                  <span className="text-zinc-500">Ubicación:</span>{' '}
                  {BUSINESS.address.locality}, {BUSINESS.address.region}, México
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">
                Horarios de atención
              </h2>
              <ul className="space-y-1.5 text-zinc-300">
                <li>Lunes a viernes: <span className="text-white">las 24 horas</span></li>
                <li>Sábados: <span className="text-white">8:00 a 13:00 hs</span></li>
                <li>Domingos: <span className="text-zinc-500">cerrado</span></li>
              </ul>
            </section>

            <section>
              <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">
                Áreas de servicio
              </h2>
              <div className="flex flex-wrap gap-2">
                {BUSINESS.areaServed.map((area) => (
                  <span
                    key={area}
                    className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-sm text-zinc-400"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Mapa */}
          <div>
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">
              Cómo encontrarnos
            </h2>
            <div className="overflow-hidden rounded-xl border border-zinc-800">
              <iframe
                title={`Ubicación de ${BUSINESS.name} en ${BUSINESS.address.locality}`}
                src={MAP_SRC}
                width="100%"
                height="360"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
