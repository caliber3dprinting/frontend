/**
 * Convierte un archivo markdown a Strapi Blocks JSON y actualiza el post.
 *
 * Uso:
 *   STRAPI_TOKEN=xxx node scripts/markdown-to-strapi.mjs <slug> <archivo.md>
 *
 * Ejemplo:
 *   STRAPI_TOKEN=xxx node scripts/markdown-to-strapi.mjs soluciones-impresion-3d-hoteles post.md
 */

import { readFileSync } from 'fs'

const STRAPI_URL = 'https://backend-production-e1964.up.railway.app'
const TOKEN      = process.env.STRAPI_TOKEN
const [,, SLUG, FILE] = process.argv

if (!TOKEN || !SLUG || !FILE) {
  console.error('Uso: STRAPI_TOKEN=xxx node scripts/markdown-to-strapi.mjs <slug> <archivo.md>')
  process.exit(1)
}

// ─── Limpiar artefactos de IA ─────────────────────────────────────────────────

function clean(text) {
  return text
    .replace(/\[cite_start\]/g, '')
    .replace(/\[cite:\s*\d+\]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

// ─── Parser de inline (bold, italic, text plano) ─────────────────────────────

function parseInline(raw) {
  const text = clean(raw)
  const result = []
  let i = 0
  let buf = ''

  const flush = (extra = {}) => {
    if (buf) { result.push({ type: 'text', text: buf, ...extra }); buf = '' }
  }

  while (i < text.length) {
    // **bold**
    if (text[i] === '*' && text[i + 1] === '*') {
      flush()
      i += 2
      let bold = ''
      while (i < text.length && !(text[i] === '*' && text[i + 1] === '*')) bold += text[i++]
      i += 2
      if (bold.trim()) result.push({ type: 'text', text: bold.trim(), bold: true })
    }
    // *italic*
    else if (text[i] === '*' && text[i + 1] !== '*') {
      flush()
      i += 1
      let italic = ''
      while (i < text.length && text[i] !== '*') italic += text[i++]
      i += 1
      if (italic.trim()) result.push({ type: 'text', text: italic.trim(), italic: true })
    }
    else {
      buf += text[i++]
    }
  }

  flush()
  return result.length > 0 ? result : [{ type: 'text', text: text }]
}

// ─── Parser de markdown a Strapi Blocks ──────────────────────────────────────

function markdownToBlocks(md) {
  const lines = md.split('\n')
  const blocks = []
  let list = null   // bloque de lista en construcción

  const flushList = () => {
    if (list) { blocks.push(list); list = null }
  }

  for (let i = 0; i < lines.length; i++) {
    const raw  = lines[i]
    const line = clean(raw)

    // Línea vacía → cierra lista pendiente
    if (!line) { flushList(); continue }

    // Encabezado: ## texto
    const heading = line.match(/^(#{1,6})\s+(.+)$/)
    if (heading) {
      flushList()
      blocks.push({ type: 'heading', level: heading[1].length, children: parseInline(heading[2]) })
      continue
    }

    // Lista sin orden: * texto  o  - texto
    const ulItem = line.match(/^[\*\-]\s+(.+)$/)
    if (ulItem) {
      if (list?.format !== 'unordered') { flushList(); list = { type: 'list', format: 'unordered', children: [] } }
      list.children.push({ type: 'list-item', children: parseInline(ulItem[1]) })
      continue
    }

    // Lista con orden: 1. texto
    const olItem = line.match(/^\d+[.)]\s+(.+)$/)
    if (olItem) {
      if (list?.format !== 'ordered') { flushList(); list = { type: 'list', format: 'ordered', children: [] } }
      list.children.push({ type: 'list-item', children: parseInline(olItem[1]) })
      continue
    }

    // Párrafo (agrupa líneas consecutivas no especiales)
    flushList()
    let para = line
    while (
      i + 1 < lines.length &&
      clean(lines[i + 1]) &&
      !clean(lines[i + 1]).match(/^#{1,6}\s/) &&
      !clean(lines[i + 1]).match(/^[\*\-]\s/) &&
      !clean(lines[i + 1]).match(/^\d+[.)]\s/)
    ) {
      i++
      para += ' ' + clean(lines[i])
    }

    blocks.push({ type: 'paragraph', children: parseInline(para) })
  }

  flushList()
  return blocks
}

// ─── Leer el archivo y convertir ─────────────────────────────────────────────

const markdown = readFileSync(FILE, 'utf-8')
const content  = markdownToBlocks(markdown)

console.log(`Convertidos ${content.length} bloques desde "${FILE}"`)

// ─── Buscar el post por slug ──────────────────────────────────────────────────

const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` }

console.log(`Buscando post con slug: "${SLUG}"...`)
const findRes  = await fetch(`${STRAPI_URL}/api/blog-posts?filters[slug][$eq]=${SLUG}&fields[0]=documentId&fields[1]=title`, { headers })

if (!findRes.ok) {
  console.error(`Error ${findRes.status}: ${await findRes.text()}`)
  process.exit(1)
}

const found = (await findRes.json()).data?.[0]
if (!found) {
  console.error(`No se encontró ningún post con slug "${SLUG}".`)
  process.exit(1)
}

console.log(`Post encontrado: "${found.title}" (${found.documentId})`)

// ─── Actualizar ───────────────────────────────────────────────────────────────

const upRes = await fetch(`${STRAPI_URL}/api/blog-posts/${found.documentId}`, {
  method: 'PUT',
  headers,
  body: JSON.stringify({ data: { content } }),
})

if (!upRes.ok) {
  console.error(`Error al actualizar: ${upRes.status} ${await upRes.text()}`)
  process.exit(1)
}

console.log('✓ Post actualizado correctamente.')
