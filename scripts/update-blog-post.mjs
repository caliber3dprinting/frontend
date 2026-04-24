/**
 * Sube el contenido de un post al editor Blocks de Strapi.
 * Uso: node --env-file=.env.local scripts/update-blog-post.mjs
 */

// Podés pasar el token y la URL como variables de entorno en la misma línea:
// STRAPI_TOKEN=xxx node scripts/update-blog-post.mjs
const STRAPI_URL = process.env.STRAPI_URL ?? 'https://backend-production-e1964.up.railway.app'
const TOKEN      = process.env.STRAPI_TOKEN ?? process.env.STRAPI_API_TOKEN
const SLUG       = 'guia-materiales-impresion-3d-pla-vs-petg-abs'

if (!TOKEN) {
  console.error('Falta el token. Correlo así:')
  console.error('  STRAPI_TOKEN=tu_token node scripts/update-blog-post.mjs')
  process.exit(1)
}

// ─── Contenido convertido a Strapi Blocks JSON ───────────────────────────────

const content = [
  {
    type: 'paragraph',
    children: [
      { type: 'text', text: 'La impresión 3D por deposición fundida (FDM) ha democratizado la creación de prototipos y piezas finales, pero la primera y más importante decisión técnica es ' },
      { type: 'text', text: 'elegir el material correcto', bold: true },
      { type: 'text', text: '. Esta elección no solo define el aspecto visual, sino que determina si tu pieza resistirá la fuerza, el calor o la exposición al sol.' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      { type: 'text', text: 'En el mercado mexicano, tres materiales dominan la escena FDM: PLA, PETG y ABS. En Caliber 3D, como taller local en Playa del Carmen, sabemos que el clima de la Riviera Maya (calor y humedad) es un factor crítico que muchos olvidan.' },
    ],
  },

  // ─── PLA ───────────────────────────────────────────────────────────────────
  {
    type: 'heading', level: 2,
    children: [{ type: 'text', text: '1. PLA: El Rey de la Facilidad y la Estética' }],
  },
  {
    type: 'paragraph',
    children: [
      { type: 'text', text: 'El ' },
      { type: 'text', text: 'Ácido Poliláctico (PLA)', bold: true },
      { type: 'text', text: ' es el material más común para impresoras 3D FDM. Se deriva de fuentes renovables como el almidón de maíz o la caña de azúcar, lo que lo hace biodegradable bajo condiciones industriales.' },
    ],
  },
  {
    type: 'heading', level: 3,
    children: [{ type: 'text', text: 'Ventajas del PLA' }],
  },
  {
    type: 'list', format: 'unordered',
    children: [
      { type: 'list-item', children: [{ type: 'text', text: 'Estética superior:', bold: true }, { type: 'text', text: ' Es el material que mejor se imprime, logrando capas finas y detalles nítidos.' }] },
      { type: 'list-item', children: [{ type: 'text', text: 'Fácil de imprimir:', bold: true }, { type: 'text', text: ' No requiere cama caliente y apenas tiene problemas de ' }, { type: 'text', text: 'warping', italic: true }, { type: 'text', text: ' (deformación de la base).' }] },
      { type: 'list-item', children: [{ type: 'text', text: 'Variedad de colores:', bold: true }, { type: 'text', text: ' Desde acabados mate hasta seda, pasando por translúcidos y brillos.' }] },
      { type: 'list-item', children: [{ type: 'text', text: 'No tóxico:', bold: true }, { type: 'text', text: ' Seguro para el manejo diario (aunque no todos están certificados para grado alimenticio).' }] },
    ],
  },
  {
    type: 'heading', level: 3,
    children: [{ type: 'text', text: 'Cuándo elegir PLA' }],
  },
  {
    type: 'paragraph',
    children: [{ type: 'text', text: 'Perfecto para modelos estéticos, maquetas de arquitectura, figuras decorativas, prototipos rápidos no funcionales y organizadores de escritorio.' }],
  },

  // ─── PETG ──────────────────────────────────────────────────────────────────
  {
    type: 'heading', level: 2,
    children: [{ type: 'text', text: '2. PETG: El Equilibrio entre Fuerza y Practicidad' }],
  },
  {
    type: 'paragraph',
    children: [
      { type: 'text', text: 'El ' },
      { type: 'text', text: 'Tereftalato de Polietileno Glicol (PETG)', bold: true },
      { type: 'text', text: ' es el hermano resistente del PET, el plástico usado en botellas de agua. Es el punto medio perfecto entre la facilidad del PLA y la resistencia del ABS.' },
    ],
  },
  {
    type: 'heading', level: 3,
    children: [{ type: 'text', text: 'Ventajas del PETG' }],
  },
  {
    type: 'list', format: 'unordered',
    children: [
      { type: 'list-item', children: [{ type: 'text', text: 'Resistencia mecánica y al impacto:', bold: true }, { type: 'text', text: ' Mucho más fuerte que el PLA, ideal para piezas funcionales.' }] },
      { type: 'list-item', children: [{ type: 'text', text: 'Resistencia al calor (media):', bold: true }, { type: 'text', text: ' Soporta hasta aprox. 70–80 °C sin deformarse, superior al PLA.' }] },
      { type: 'list-item', children: [{ type: 'text', text: 'Resistencia química:', bold: true }, { type: 'text', text: ' Aguanta bien el contacto con algunos aceites y solventes.' }] },
      { type: 'list-item', children: [{ type: 'text', text: 'Translúcido:', bold: true }, { type: 'text', text: ' Excelente para difusores de luz y prototipos de envases.' }] },
    ],
  },
  {
    type: 'heading', level: 3,
    children: [{ type: 'text', text: 'Cuándo elegir PETG' }],
  },
  {
    type: 'paragraph',
    children: [{ type: 'text', text: 'Excelente para piezas mecánicas, soportes de electrónica que calientan un poco, repuestos de electrodomésticos y objetos para exterior que no estén expuestos a condiciones extremas.' }],
  },

  // ─── ABS ───────────────────────────────────────────────────────────────────
  {
    type: 'heading', level: 2,
    children: [{ type: 'text', text: '3. ABS: Resistencia Industrial para Expertos' }],
  },
  {
    type: 'paragraph',
    children: [
      { type: 'text', text: 'El ' },
      { type: 'text', text: 'Acrilonitrilo Butadieno Estireno (ABS)', bold: true },
      { type: 'text', text: ' es un plástico de ingeniería muy utilizado en la industria (como los bloques de LEGO). Es famoso por su resistencia, pero difícil de imprimir correctamente en FDM.' },
    ],
  },
  {
    type: 'heading', level: 3,
    children: [{ type: 'text', text: 'Ventajas del ABS' }],
  },
  {
    type: 'list', format: 'unordered',
    children: [
      { type: 'list-item', children: [{ type: 'text', text: 'Alta resistencia al calor:', bold: true }, { type: 'text', text: ' Soporta hasta aprox. 100 °C.' }] },
      { type: 'list-item', children: [{ type: 'text', text: 'Alta tenacidad:', bold: true }, { type: 'text', text: ' Resistente y duradero.' }] },
      { type: 'list-item', children: [{ type: 'text', text: 'Post-procesado:', bold: true }, { type: 'text', text: ' Se puede lijar y pulir fácilmente con vapores de acetona para un acabado liso y brillante.' }] },
    ],
  },
  {
    type: 'heading', level: 3,
    children: [{ type: 'text', text: 'Cuándo elegir ABS' }],
  },
  {
    type: 'paragraph',
    children: [
      { type: 'text', text: 'Piezas industriales expuestas a alto calor, interiores de vehículos, repuestos mecánicos complejos. ' },
      { type: 'text', text: 'Nota: Para la mayoría de usos domésticos y comerciales, el PETG es una alternativa más práctica y limpia.', italic: true },
    ],
  },

  // ─── Conclusión ────────────────────────────────────────────────────────────
  {
    type: 'heading', level: 2,
    children: [{ type: 'text', text: 'Conclusión: ¿Qué material 3D elegir en la Riviera Maya?' }],
  },
  {
    type: 'paragraph',
    children: [{ type: 'text', text: 'Aquí tienes la clave rápida para decidir:' }],
  },
  {
    type: 'list', format: 'ordered',
    children: [
      { type: 'list-item', children: [{ type: 'text', text: 'Si buscas estética y detalle (ej. una figura):', bold: true }, { type: 'text', text: ' Elige ' }, { type: 'text', text: 'PLA', bold: true }, { type: 'text', text: '.' }] },
      { type: 'list-item', children: [{ type: 'text', text: 'Si buscas resistencia y utilidad (ej. un soporte mecánico):', bold: true }, { type: 'text', text: ' Elige ' }, { type: 'text', text: 'PETG', bold: true }, { type: 'text', text: '.' }] },
      { type: 'list-item', children: [{ type: 'text', text: 'Si buscas resistencia al calor industrial (ej. bajo el capó de un auto):', bold: true }, { type: 'text', text: ' Elige ' }, { type: 'text', text: 'ABS', bold: true }, { type: 'text', text: '.' }] },
    ],
  },
  {
    type: 'paragraph',
    children: [
      { type: 'text', text: 'En ' },
      { type: 'text', text: 'Caliber 3D Printing', bold: true },
      { type: 'text', text: ' te asesoramos en cada proyecto para garantizar que la pieza final no solo se vea bien, sino que cumpla su función. ¡Pide tu cotización personalizada y lleva tu idea a la realidad!' },
    ],
  },
]

// ─── Subir a Strapi ──────────────────────────────────────────────────────────

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${TOKEN}`,
}

console.log(`Conectando a Strapi: ${STRAPI_URL}`)
console.log(`Buscando post con slug: "${SLUG}"...`)

// 1. Buscar el post por slug para obtener su documentId
const findRes = await fetch(
  `${STRAPI_URL}/api/blog-posts?filters[slug][$eq]=${SLUG}&fields[0]=documentId&fields[1]=title`,
  { headers }
)

if (!findRes.ok) {
  console.error(`Error al buscar el post: ${findRes.status} ${await findRes.text()}`)
  process.exit(1)
}

const findData = await findRes.json()
const post = findData.data?.[0]

if (!post) {
  console.error(`No se encontró ningún post con slug "${SLUG}".`)
  console.error('Verificá que el slug en el script coincide exactamente con el de Strapi.')
  process.exit(1)
}

const { documentId, title } = post
console.log(`Post encontrado: "${title}" (documentId: ${documentId})`)

// 2. Actualizar el contenido
console.log('Actualizando contenido...')

const updateRes = await fetch(`${STRAPI_URL}/api/blog-posts/${documentId}`, {
  method: 'PUT',
  headers,
  body: JSON.stringify({ data: { content } }),
})

if (!updateRes.ok) {
  console.error(`Error al actualizar: ${updateRes.status} ${await updateRes.text()}`)
  process.exit(1)
}

console.log('✓ Contenido actualizado correctamente.')
console.log(`  → ${STRAPI_URL}/admin/content-manager/collection-types/api::blog-post.blog-post/${documentId}`)
