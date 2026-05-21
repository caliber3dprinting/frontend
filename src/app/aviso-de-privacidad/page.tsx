import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/ui/Breadcrumb'

export const metadata: Metadata = {
  title: 'Aviso de Privacidad',
  description:
    'Aviso de privacidad de Caliber 3D Printing. Conoce cómo tratamos tus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).',
  robots: { index: true, follow: true },
}

const LAST_UPDATE = '21 de mayo de 2025'

export default function AvisoDePrivacidadPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-25 space-y-10">

      <Breadcrumb items={[{ label: 'Aviso de Privacidad' }]} />

      <header className="space-y-3">
        <h1
          className="font-display font-black text-white"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
        >
          Aviso de Privacidad
        </h1>
        <p className="text-zinc-500 text-sm">Última actualización: {LAST_UPDATE}</p>
        <p className="text-zinc-300 leading-relaxed">
          El presente Aviso de Privacidad se emite en cumplimiento de la{' '}
          <strong className="text-white">
            Ley Federal de Protección de Datos Personales en Posesión de los
            Particulares (LFPDPPP)
          </strong>{' '}
          y su Reglamento, publicados en el Diario Oficial de la Federación.
        </p>
      </header>

      {/* 1. Responsable */}
      <section className="space-y-3">
        <h2 className="font-display font-black text-white text-xl">
          1. Identidad y domicilio del Responsable
        </h2>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-2 text-zinc-300 text-sm leading-relaxed">
          <p><span className="text-zinc-400">Nombre comercial:</span> <strong className="text-white">Caliber 3D Printing</strong></p>
          <p><span className="text-zinc-400">Sitio web:</span> <strong className="text-white">caliber3d.mx</strong></p>
          <p><span className="text-zinc-400">Domicilio:</span> Playa del Carmen, Quintana Roo, México</p>
          <p><span className="text-zinc-400">Correo para privacidad:</span>{' '}
            <a href="mailto:caliber.3dprinting@gmail.com" className="text-orange-400 hover:text-orange-300 transition-colors">
              caliber.3dprinting@gmail.com
            </a>
          </p>
        </div>
        <p className="text-zinc-400 text-sm">
          En adelante <strong className="text-zinc-200">"Caliber 3D"</strong> o{' '}
          <strong className="text-zinc-200">"el Responsable"</strong>.
        </p>
      </section>

      {/* 2. Datos personales */}
      <section className="space-y-3">
        <h2 className="font-display font-black text-white text-xl">
          2. Datos personales que recabamos
        </h2>
        <p className="text-zinc-300 text-sm leading-relaxed">
          Caliber 3D recaba los siguientes datos personales a través del formulario de cotización
          y, en su caso, mediante el registro de usuario:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-2">
            <h3 className="text-white font-semibold text-sm">Formulario de cotización</h3>
            <ul className="text-zinc-400 text-sm space-y-1 list-disc list-inside">
              <li>Nombre completo (requerido)</li>
              <li>Correo electrónico (requerido)</li>
              <li>Número de teléfono / WhatsApp (opcional)</li>
              <li>Descripción e imágenes del proyecto</li>
              <li>Categoría y notas adicionales</li>
            </ul>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-2">
            <h3 className="text-white font-semibold text-sm">Registro de usuario (opcional)</h3>
            <ul className="text-zinc-400 text-sm space-y-1 list-disc list-inside">
              <li>Nombre y correo electrónico (vía Clerk)</li>
              <li>Datos de cotizaciones guardadas</li>
              <li>Historial de cálculos de costos</li>
              <li>Dirección IP y datos de sesión</li>
            </ul>
          </div>
        </div>
        <p className="text-zinc-500 text-sm">
          No recabamos datos personales sensibles en los términos del artículo 3, fracción VI de la LFPDPPP.
        </p>
      </section>

      {/* 3. Finalidades */}
      <section className="space-y-3">
        <h2 className="font-display font-black text-white text-xl">
          3. Finalidades del tratamiento
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-orange-400 font-semibold text-sm mb-2">Finalidades primarias (necesarias para el servicio)</h3>
            <ul className="text-zinc-300 text-sm space-y-1 list-disc list-inside leading-relaxed">
              <li>Atender y dar seguimiento a solicitudes de cotización de impresión 3D.</li>
              <li>Contactarte mediante correo electrónico o WhatsApp para discutir tu proyecto.</li>
              <li>Gestionar el acceso a las herramientas de usuario registrado (calculadora, presupuestador).</li>
              <li>Cumplir obligaciones derivadas de la relación comercial.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-zinc-400 font-semibold text-sm mb-2">Finalidades secundarias (puedes oponerte)</h3>
            <ul className="text-zinc-300 text-sm space-y-1 list-disc list-inside leading-relaxed">
              <li>Envío de comunicaciones sobre nuevos servicios, promociones o contenido relevante.</li>
              <li>Análisis estadístico y mejora del sitio web.</li>
            </ul>
            <p className="text-zinc-500 text-sm mt-2">
              Si no deseas que tus datos se usen para estas finalidades secundarias, envía un correo a{' '}
              <a href="mailto:caliber.3dprinting@gmail.com" className="text-orange-400 hover:text-orange-300">
                caliber.3dprinting@gmail.com
              </a>{' '}
              indicando tu oposición.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Transferencias */}
      <section className="space-y-3">
        <h2 className="font-display font-black text-white text-xl">
          4. Transferencias de datos
        </h2>
        <p className="text-zinc-300 text-sm leading-relaxed">
          Caliber 3D no vende ni cede tus datos personales a terceros con fines comerciales.
          Sin embargo, para prestar el servicio compartimos datos con los siguientes proveedores tecnológicos,
          quienes actúan como encargados del tratamiento:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="py-3 pr-4 text-zinc-400 font-medium">Proveedor</th>
                <th className="py-3 pr-4 text-zinc-400 font-medium">Finalidad</th>
                <th className="py-3 text-zinc-400 font-medium">País</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              <tr>
                <td className="py-3 pr-4 text-white">Clerk</td>
                <td className="py-3 pr-4 text-zinc-300">Autenticación y gestión de cuentas de usuario</td>
                <td className="py-3 text-zinc-400">EE.UU.</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-white">Sanity.io</td>
                <td className="py-3 pr-4 text-zinc-300">Almacenamiento de solicitudes de cotización</td>
                <td className="py-3 text-zinc-400">EE.UU.</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-white">Resend / Gmail</td>
                <td className="py-3 pr-4 text-zinc-300">Envío de correos de confirmación y notificación</td>
                <td className="py-3 text-zinc-400">EE.UU.</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-white">Google Analytics</td>
                <td className="py-3 pr-4 text-zinc-300">Análisis de tráfico y comportamiento en el sitio</td>
                <td className="py-3 text-zinc-400">EE.UU.</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-white">Cloudflare</td>
                <td className="py-3 pr-4 text-zinc-300">Alojamiento web y distribución de contenido (CDN)</td>
                <td className="py-3 text-zinc-400">EE.UU.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-zinc-500 text-sm">
          Estas transferencias son necesarias para la prestación del servicio (art. 37, fracción VII de la LFPDPPP)
          y no requieren tu consentimiento expreso.
        </p>
      </section>

      {/* 5. Cookies */}
      <section className="space-y-3">
        <h2 className="font-display font-black text-white text-xl">
          5. Uso de cookies y tecnologías de seguimiento
        </h2>
        <p className="text-zinc-300 text-sm leading-relaxed">
          Este sitio utiliza las siguientes tecnologías de seguimiento:
        </p>
        <div className="space-y-3">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20 rounded px-2 py-0.5">Esenciales</span>
              <span className="text-white text-sm font-medium">Cookies de sesión (Clerk)</span>
            </div>
            <p className="text-zinc-400 text-sm">Necesarias para mantener tu sesión iniciada. No pueden desactivarse sin afectar el funcionamiento de las herramientas de usuario.</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded px-2 py-0.5">Analíticas</span>
              <span className="text-white text-sm font-medium">Google Analytics (GA4)</span>
            </div>
            <p className="text-zinc-400 text-sm">
              Recopilan datos anónimos sobre visitas, páginas consultadas y duración de sesión (cookies <code className="text-zinc-300">_ga</code>, <code className="text-zinc-300">_gid</code>).
              Puedes desactivarlas instalando el{' '}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-300 transition-colors"
              >
                complemento de inhabilitación de Google Analytics
              </a>.
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded px-2 py-0.5">Almacenamiento local</span>
              <span className="text-white text-sm font-medium">localStorage del navegador</span>
            </div>
            <p className="text-zinc-400 text-sm">La herramienta de presupuestador guarda tu marca y configuración localmente en tu navegador (<code className="text-zinc-300">presupuestador_brand</code>). Estos datos no se envían a nuestros servidores y puedes eliminarlos borrando los datos del sitio en la configuración de tu navegador.</p>
          </div>
        </div>
        <p className="text-zinc-500 text-sm">
          La ley mexicana no exige un banner de consentimiento para cookies analíticas, pero tienes el derecho de
          gestionar o rechazar las cookies no esenciales desde la configuración de tu navegador.
        </p>
      </section>

      {/* 6. Derechos ARCO */}
      <section className="space-y-4">
        <h2 className="font-display font-black text-white text-xl">
          6. Derechos ARCO
        </h2>
        <p className="text-zinc-300 text-sm leading-relaxed">
          Conforme a la LFPDPPP, tienes derecho a:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { letter: 'A', title: 'Acceso', desc: 'Conocer qué datos tuyos tenemos y cómo los usamos.' },
            { letter: 'R', title: 'Rectificación', desc: 'Corregir datos inexactos o incompletos.' },
            { letter: 'C', title: 'Cancelación', desc: 'Solicitar la eliminación de tus datos.' },
            { letter: 'O', title: 'Oposición', desc: 'Oponerte al tratamiento de tus datos.' },
          ].map(({ letter, title, desc }) => (
            <div key={letter} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
              <div className="font-display font-black text-orange-500 text-3xl leading-none">{letter}</div>
              <div className="font-semibold text-white text-sm">{title}</div>
              <p className="text-zinc-400 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-2">
          <h3 className="text-white font-semibold text-sm">¿Cómo ejercer tus derechos?</h3>
          <p className="text-zinc-300 text-sm leading-relaxed">
            Envía tu solicitud a{' '}
            <a href="mailto:caliber.3dprinting@gmail.com" className="text-orange-400 hover:text-orange-300 transition-colors">
              caliber.3dprinting@gmail.com
            </a>{' '}
            con el asunto <strong className="text-zinc-200">"Ejercicio de derechos ARCO"</strong> incluyendo:
          </p>
          <ul className="text-zinc-400 text-sm space-y-1 list-disc list-inside">
            <li>Tu nombre completo y correo electrónico registrado.</li>
            <li>El derecho que deseas ejercer (Acceso, Rectificación, Cancelación u Oposición).</li>
            <li>Descripción clara de los datos sobre los que deseas ejercer el derecho.</li>
          </ul>
          <p className="text-zinc-500 text-sm">
            Responderemos en un plazo máximo de <strong className="text-zinc-300">20 días hábiles</strong>,
            conforme al artículo 24 de la LFPDPPP.
          </p>
        </div>
      </section>

      {/* 7. Plazo de conservación */}
      <section className="space-y-3">
        <h2 className="font-display font-black text-white text-xl">
          7. Plazo de conservación de datos
        </h2>
        <p className="text-zinc-300 text-sm leading-relaxed">
          Conservamos tus datos personales durante el tiempo necesario para cumplir con las finalidades
          descritas en este aviso y, en todo caso, por el periodo que establezcan las disposiciones
          legales aplicables. Una vez concluida la relación comercial o a solicitud tuya mediante
          el ejercicio del derecho de cancelación, bloquearemos y suprimiremos tus datos en un
          plazo razonable.
        </p>
      </section>

      {/* 8. Cambios al aviso */}
      <section className="space-y-3">
        <h2 className="font-display font-black text-white text-xl">
          8. Modificaciones al Aviso de Privacidad
        </h2>
        <p className="text-zinc-300 text-sm leading-relaxed">
          Caliber 3D podrá actualizar este Aviso de Privacidad en cualquier momento. Los cambios
          se publicarán en esta página con la fecha de actualización correspondiente. Te recomendamos
          revisarlo periódicamente. El uso continuado del sitio tras la publicación de cambios
          constituye tu aceptación de los mismos.
        </p>
      </section>

      {/* 9. INAI */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-2">
        <h2 className="font-display font-black text-white text-lg">
          9. Autoridad de protección de datos
        </h2>
        <p className="text-zinc-300 text-sm leading-relaxed">
          Si consideras que tu derecho a la protección de datos personales ha sido vulnerado, puedes
          acudir ante el{' '}
          <strong className="text-white">
            Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales (INAI)
          </strong>
          , en{' '}
          <a
            href="https://www.inai.org.mx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 hover:text-orange-300 transition-colors"
          >
            www.inai.org.mx
          </a>
          .
        </p>
      </section>

      {/* Footer links */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Link
          href="/terminos-y-condiciones"
          className="inline-flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium px-6 py-3 rounded-xl transition-colors"
        >
          Ver Términos y Condiciones
        </Link>
        <Link
          href="/cotizar"
          className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Solicitar cotización
        </Link>
      </div>

    </main>
  )
}
