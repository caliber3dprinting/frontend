import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/ui/Breadcrumb'

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description:
    'Términos y condiciones de uso de Caliber 3D Printing. Conoce las reglas que rigen el uso del sitio y la contratación de nuestros servicios de impresión 3D en México.',
  robots: { index: true, follow: true },
}

const LAST_UPDATE = '21 de mayo de 2025'

export default function TerminosYCondicionesPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-25 space-y-10">

      <Breadcrumb items={[{ label: 'Términos y Condiciones' }]} />

      <header className="space-y-3">
        <h1
          className="font-display font-black text-white"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
        >
          Términos y Condiciones
        </h1>
        <p className="text-zinc-500 text-sm">Última actualización: {LAST_UPDATE}</p>
        <p className="text-zinc-300 leading-relaxed">
          Al acceder y utilizar el sitio web <strong className="text-white">caliber3d.mx</strong>,
          así como al solicitar cualquier servicio de impresión 3D, aceptas quedar vinculado por
          los presentes Términos y Condiciones. Si no estás de acuerdo, te pedimos que no utilices
          el sitio ni solicites nuestros servicios.
        </p>
      </header>

      {/* 1. Objeto */}
      <section className="space-y-3">
        <h2 className="font-display font-black text-white text-xl">1. Objeto</h2>
        <p className="text-zinc-300 text-sm leading-relaxed">
          Caliber 3D Printing (<strong className="text-zinc-200">"Caliber 3D"</strong>,{' '}
          <strong className="text-zinc-200">"nosotros"</strong> o{' '}
          <strong className="text-zinc-200">"el Prestador"</strong>), con domicilio en Playa
          del Carmen, Quintana Roo, México, ofrece servicios de fabricación digital mediante
          impresión 3D, incluyendo repuestos, piezas técnicas, prototipos y figuras personalizadas.
          El presente documento regula la relación entre Caliber 3D y cualquier persona que
          utilice el sitio o contrate sus servicios (<strong className="text-zinc-200">"el Usuario"</strong>).
        </p>
      </section>

      {/* 2. Uso del sitio */}
      <section className="space-y-3">
        <h2 className="font-display font-black text-white text-xl">2. Uso del sitio web</h2>
        <p className="text-zinc-300 text-sm leading-relaxed">
          El Usuario se compromete a utilizar el sitio de conformidad con la ley, la moral y el orden
          público, y a abstenerse de:
        </p>
        <ul className="text-zinc-300 text-sm space-y-1.5 list-disc list-inside leading-relaxed">
          <li>Reproducir, distribuir o modificar los contenidos del sitio sin autorización escrita de Caliber 3D.</li>
          <li>Utilizar el sitio con fines ilegales, fraudulentos o que perjudiquen a terceros.</li>
          <li>Enviar información falsa, incompleta o que induzca a error en el formulario de cotización.</li>
          <li>Intentar acceder sin autorización a secciones restringidas o sistemas internos.</li>
          <li>Cargar archivos que contengan virus o código malicioso.</li>
        </ul>
      </section>

      {/* 3. Proceso de cotización */}
      <section className="space-y-4">
        <h2 className="font-display font-black text-white text-xl">3. Proceso de cotización y contratación</h2>
        <div className="space-y-3 text-zinc-300 text-sm leading-relaxed">
          <p>
            Las cotizaciones solicitadas a través del formulario del sitio son{' '}
            <strong className="text-zinc-200">estimaciones preliminares</strong> y no constituyen
            una oferta vinculante hasta que Caliber 3D las confirme por escrito (correo electrónico
            o WhatsApp) especificando precio definitivo, materiales, tiempos de entrega y condiciones.
          </p>
          <p>
            El contrato de servicio se perfecciona cuando el Usuario confirma la cotización y realiza
            el pago o anticipo acordado, conforme al Código de Comercio vigente en México.
          </p>
          <p>
            Caliber 3D se reserva el derecho de rechazar solicitudes de proyectos que sean técnicamente
            inviables, contrarios a la ley, o que impliquen la reproducción sin autorización de obras
            protegidas por derechos de autor.
          </p>
        </div>
      </section>

      {/* 4. Precios y pagos */}
      <section className="space-y-3">
        <h2 className="font-display font-black text-white text-xl">4. Precios y condiciones de pago</h2>
        <div className="space-y-3 text-zinc-300 text-sm leading-relaxed">
          <p>
            Todos los precios se expresan en <strong className="text-zinc-200">pesos mexicanos (MXN)</strong> e
            incluyen el Impuesto al Valor Agregado (IVA) cuando así se indique expresamente.
          </p>
          <p>
            Las condiciones de pago (anticipo, saldo, método) se establecen en la cotización confirmada.
            Caliber 3D podrá solicitar un anticipo de entre el 30% y el 50% del total antes de iniciar
            la fabricación, según la complejidad del pedido.
          </p>
          <p>
            Los precios publicados en el catálogo son referenciales y pueden variar según la configuración
            específica de cada pieza, el material elegido y los acabados requeridos.
          </p>
        </div>
      </section>

      {/* 5. Entrega */}
      <section className="space-y-3">
        <h2 className="font-display font-black text-white text-xl">5. Tiempos de entrega</h2>
        <p className="text-zinc-300 text-sm leading-relaxed">
          Los tiempos de producción indicados en la cotización son estimados y pueden verse afectados
          por la complejidad del diseño, disponibilidad de materiales, o causas de fuerza mayor.
          Caliber 3D informará al Usuario con la mayor antelación posible ante cualquier retraso
          significativo. La entrega se realizará en las modalidades acordadas: retiro en taller
          (Playa del Carmen) o envío a domicilio con cargo al costo de mensajería.
        </p>
      </section>

      {/* 6. Cancelaciones y devoluciones */}
      <section className="space-y-4">
        <h2 className="font-display font-black text-white text-xl">6. Cancelaciones y devoluciones</h2>
        <div className="space-y-3 text-zinc-300 text-sm leading-relaxed">
          <p>
            Dado que los productos son fabricados a medida, aplican las siguientes condiciones:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
              <h3 className="text-green-400 font-semibold text-sm">Cancelación antes de producción</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                El Usuario puede cancelar sin penalización dentro de las <strong className="text-zinc-200">24 horas</strong>{' '}
                siguientes a la confirmación. Se reembolsará el 100% de cualquier anticipo recibido.
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
              <h3 className="text-yellow-400 font-semibold text-sm">Cancelación durante producción</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Si la fabricación ya ha iniciado, el anticipo no es reembolsable salvo defecto
                imputable a Caliber 3D.
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
              <h3 className="text-orange-400 font-semibold text-sm">Pieza con defecto de fabricación</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Si la pieza entregada presenta defectos imputables a Caliber 3D, se realizará una
                reimpresión sin costo adicional o, si no es posible, el reembolso total.
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
              <h3 className="text-red-400 font-semibold text-sm">Error en diseño del cliente</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Si el defecto proviene de un error en el archivo o especificaciones proporcionadas
                por el Usuario, Caliber 3D ofrecerá una reimpresión con descuento a convenir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Propiedad intelectual */}
      <section className="space-y-3">
        <h2 className="font-display font-black text-white text-xl">7. Propiedad intelectual</h2>
        <div className="space-y-3 text-zinc-300 text-sm leading-relaxed">
          <p>
            <strong className="text-zinc-200">Contenidos del sitio:</strong> Todos los textos,
            imágenes, logotipos, diseños y demás contenidos del sitio web son propiedad de
            Caliber 3D o de sus licenciantes y están protegidos por la{' '}
            <strong className="text-zinc-200">Ley Federal del Derecho de Autor</strong> y la{' '}
            <strong className="text-zinc-200">Ley de la Propiedad Industrial</strong> vigentes
            en México. Queda prohibida su reproducción total o parcial sin autorización.
          </p>
          <p>
            <strong className="text-zinc-200">Archivos del cliente:</strong> El Usuario declara
            y garantiza que tiene todos los derechos necesarios sobre los archivos y diseños que
            envía para fabricación, y que su producción no infringe derechos de terceros.
            Caliber 3D no asume ninguna responsabilidad por infracciones derivadas de archivos
            proporcionados por el Usuario.
          </p>
          <p>
            <strong className="text-zinc-200">Fotografías de piezas fabricadas:</strong> Caliber 3D
            puede fotografiar las piezas terminadas con fines de exhibición en su portafolio o redes
            sociales, salvo que el Usuario indique expresamente su oposición al momento de realizar
            el pedido.
          </p>
        </div>
      </section>

      {/* 8. Limitación de responsabilidad */}
      <section className="space-y-3">
        <h2 className="font-display font-black text-white text-xl">8. Limitación de responsabilidad</h2>
        <div className="space-y-3 text-zinc-300 text-sm leading-relaxed">
          <p>
            Caliber 3D no será responsable de daños indirectos, incidentales o consecuentes
            derivados del uso del sitio o de los servicios prestados, incluyendo lucro cesante
            o daño emergente, salvo que exista dolo o culpa grave imputable al Prestador.
          </p>
          <p>
            Las piezas impresas en 3D son de uso general según las especificaciones acordadas.
            El Usuario es responsable de validar que el material y la resistencia de la pieza
            sean aptos para su aplicación específica, especialmente en usos estructurales,
            médicos o de seguridad crítica.
          </p>
          <p>
            El sitio web puede experimentar interrupciones técnicas. Caliber 3D no garantiza
            disponibilidad continua ni la ausencia de errores, aunque adoptará medidas razonables
            para minimizar tales situaciones.
          </p>
        </div>
      </section>

      {/* 9. Herramientas de usuario */}
      <section className="space-y-3">
        <h2 className="font-display font-black text-white text-xl">9. Herramientas de usuario registrado</h2>
        <p className="text-zinc-300 text-sm leading-relaxed">
          Las herramientas de calculadora de costos y presupuestador de impresión 3D se proporcionan
          como utilidades de apoyo. Los resultados son estimaciones basadas en los parámetros
          introducidos por el Usuario y <strong className="text-zinc-200">no constituyen cotizaciones
          formales</strong>. Para obtener un precio definitivo, deberás solicitar una cotización
          oficial a través del formulario correspondiente.
        </p>
      </section>

      {/* 10. Ley y jurisdicción */}
      <section className="space-y-3">
        <h2 className="font-display font-black text-white text-xl">10. Ley aplicable y jurisdicción</h2>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-3">
          <p className="text-zinc-300 text-sm leading-relaxed">
            El presente contrato se rige e interpreta de conformidad con las leyes de los{' '}
            <strong className="text-white">Estados Unidos Mexicanos</strong>, en particular:
          </p>
          <ul className="text-zinc-400 text-sm space-y-1 list-disc list-inside">
            <li>Código de Comercio</li>
            <li>Ley Federal de Protección al Consumidor (LFPC)</li>
            <li>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</li>
            <li>Ley Federal del Derecho de Autor</li>
            <li>Código Civil Federal (supletoriamente)</li>
          </ul>
          <p className="text-zinc-300 text-sm leading-relaxed">
            Para cualquier controversia derivada de estos Términos, las partes se someten a la
            jurisdicción de los tribunales competentes de{' '}
            <strong className="text-white">Playa del Carmen, Quintana Roo, México</strong>,
            renunciando a cualquier otro fuero que pudiera corresponderles por razón de su
            domicilio presente o futuro.
          </p>
          <p className="text-zinc-400 text-sm">
            Sin perjuicio de lo anterior, si eres consumidor, tienes derecho a acudir a la{' '}
            <strong className="text-zinc-200">
              Procuraduría Federal del Consumidor (PROFECO)
            </strong>{' '}
            en caso de conflicto.
          </p>
        </div>
      </section>

      {/* 11. Contacto */}
      <section className="space-y-3">
        <h2 className="font-display font-black text-white text-xl">11. Contacto</h2>
        <p className="text-zinc-300 text-sm leading-relaxed">
          Para cualquier consulta sobre estos Términos y Condiciones, puedes contactarnos en:
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="mailto:contacto@caliber3d.mx"
            className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors text-sm"
          >
            contacto@caliber3d.mx
          </a>
          <span className="hidden sm:block text-zinc-700">|</span>
          <Link
            href="/cotizar"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
          >
            Formulario de cotización
          </Link>
        </div>
      </section>

      {/* Footer links */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Link
          href="/aviso-de-privacidad"
          className="inline-flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium px-6 py-3 rounded-xl transition-colors"
        >
          Ver Aviso de Privacidad
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
