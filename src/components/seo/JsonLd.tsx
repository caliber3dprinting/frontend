/**
 * Inyecta un bloque JSON-LD (schema.org). Server Component.
 * Escapa `<` para evitar romper el script / XSS si algún dato lo contiene.
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}
