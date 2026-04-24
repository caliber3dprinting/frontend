import qs from 'qs'
import type {
  Product,
  Category,
  Testimonial,
  HomePage,
  AboutPage,
  GlobalConfig,
  ProductFilters,
  QuoteRequestPayload,
  StrapiImage,
  BlogPost,
  BlogFilters,
} from './types'

// ─────────────────────────────────────────────
// Base config
// ─────────────────────────────────────────────

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337'
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN ?? ''

/**
 * Resuelve la URL completa de una imagen de Strapi.
 * En producción las imágenes pueden estar en Cloudinary (URL absoluta).
 * En desarrollo apuntan a /uploads/... (URL relativa).
 */
export function getStrapiImageUrl(image: StrapiImage | null, size?: keyof NonNullable<StrapiImage['formats']>): string {
  if (!image) return '/placeholder-product.jpg'
  if (size && image.formats?.[size]) {
    const formatUrl = image.formats[size]!.url
    return formatUrl.startsWith('http') ? formatUrl : `${STRAPI_URL}${formatUrl}`
  }
  return image.url.startsWith('http') ? image.url : `${STRAPI_URL}${image.url}`
}

// ─────────────────────────────────────────────
// Core fetch wrapper
// ─────────────────────────────────────────────

interface FetchOptions {
  method?: 'GET' | 'POST'
  body?: object
  tags?: string[]          // Next.js cache tags para revalidación
  revalidate?: number      // segundos — 0 = sin caché (útil para formularios)
}

async function strapiRequest<T>(
  path: string,
  query?: Record<string, unknown>,
  options: FetchOptions = {}
): Promise<T> {
  const defaultRevalidate = process.env.NODE_ENV === 'development' ? 0 : 3600
  const { method = 'GET', body, tags, revalidate = defaultRevalidate } = options

  const queryString = query ? `?${qs.stringify(query, { encodeValuesOnly: true })}` : ''
  const url = `${STRAPI_URL}/api${path}${queryString}`

  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
    },
    ...(body ? { body: JSON.stringify({ data: body }) } : {}),
    next: {
      revalidate,
      ...(tags ? { tags } : {}),
    },
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Strapi error [${res.status}] at ${path}: ${error}`)
  }

  return res.json() as Promise<T>
}

// ─────────────────────────────────────────────
// Products
// ─────────────────────────────────────────────

export async function getProducts(filters: ProductFilters = {}): Promise<{
  data: Product[]
  meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } }
}> {
  const { categorySlug, featured, page = 1, pageSize = 12 } = filters

  const res = await strapiRequest<{
    data: Product[]
    meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } }
  }>('/products', {
    populate: { cover_image: true, category: true },
    pagination: { page: 1, pageSize: 100 },
    sort: ['createdAt:desc'],
  }, { tags: ['products'] })

  // Filtros en memoria (evita problemas con Strapi v5 y filtros de relaciones/booleanos)
  const filtered = res.data
    .filter((p) => featured === undefined || p.featured === featured)
    .filter((p) => !categorySlug || p.category?.slug === categorySlug)

  // Paginación manual
  const total = filtered.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const start = (page - 1) * pageSize
  const data = filtered.slice(start, start + pageSize)

  return { data, meta: { pagination: { page, pageSize, pageCount, total } } }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const res = await strapiRequest<{ data: Product[] }>('/products', {
    populate: { cover_image: true, gallery: true, category: true },
    filters: { slug: { $eq: slug } },
  }, { tags: [`product-${slug}`] })

  return res.data[0] ?? null
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  const res = await getProducts({ featured: true, pageSize: limit })
  return res.data
}

// ─────────────────────────────────────────────
// Categories
// ─────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const res = await strapiRequest<{ data: Category[] }>('/categories', {
    sort: ['name:asc'],
  }, { tags: ['categories'] })
  return res.data
}

// ─────────────────────────────────────────────
// Testimonials
// ─────────────────────────────────────────────

export async function getTestimonials(limit = 6): Promise<Testimonial[]> {
  const res = await strapiRequest<{ data: Testimonial[] }>('/testimonials', {
    populate: ['product'],
    pagination: { pageSize: limit },
    sort: ['createdAt:desc'],
  }, { tags: ['testimonials'] })
  return res.data
}

// ─────────────────────────────────────────────
// Single Types
// ─────────────────────────────────────────────

export async function getHomePage(): Promise<HomePage> {
  const res = await strapiRequest<{ data: HomePage }>('/home-page', {
    populate: { hero_image: true, about_preview_image: true },
  }, { tags: ['home-page'] })
  return res.data
}

export async function getAboutPage(): Promise<AboutPage> {
  const res = await strapiRequest<{ data: AboutPage }>('/about-page', {
    populate: { team_photo: true, values: true },
  }, { tags: ['about-page'] })
  return res.data
}

export async function getGlobalConfig(): Promise<GlobalConfig> {
  const res = await strapiRequest<{ data: GlobalConfig }>('/global-config', {}, {
    tags: ['global-config'],
  })
  return res.data
}

// ─────────────────────────────────────────────
// Blog
// ─────────────────────────────────────────────

export async function getBlogPosts(filters: BlogFilters = {}): Promise<{
  data: BlogPost[]
  meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } }
}> {
  const { category, page = 1, pageSize = 9 } = filters

  const res = await strapiRequest<{
    data: BlogPost[]
    meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } }
  }>('/blog-posts', {
    populate: { cover_image: true },
    pagination: { page: 1, pageSize: 100 },
    sort: ['publishedAt:desc'],
  }, { tags: ['blog-posts'] })

  const filtered = res.data.filter((p) => !category || p.category === category)
  const total = filtered.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const start = (page - 1) * pageSize
  const data = filtered.slice(start, start + pageSize)

  return { data, meta: { pagination: { page, pageSize, pageCount, total } } }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const res = await strapiRequest<{ data: BlogPost[] }>('/blog-posts', {
    populate: { cover_image: true },
    filters: { slug: { $eq: slug } },
  }, { tags: [`blog-post-${slug}`] })

  return res.data[0] ?? null
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const res = await strapiRequest<{ data: BlogPost[] }>('/blog-posts', {
    fields: ['slug'],
    pagination: { pageSize: 200 },
  }, { tags: ['blog-posts'] })
  return res.data.map((p) => p.slug)
}

// ─────────────────────────────────────────────
// Quote Request (POST — sin caché)
// ─────────────────────────────────────────────

export async function uploadFileToStrapi(file: Blob, filename: string): Promise<number> {
  const form = new FormData()
  form.append('files', file, filename)

  const res = await fetch(`${STRAPI_URL}/api/upload`, {
    method: 'POST',
    headers: {
      ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
    },
    body: form,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Strapi upload error [${res.status}]: ${text}`)
  }

  const data: Array<{ id: number }> = await res.json()
  return data[0].id
}

export async function createQuoteRequest(payload: QuoteRequestPayload): Promise<{ id: number }> {
  const res = await strapiRequest<{ data: { id: number } }>(
    '/quote-requests',
    undefined,
    { method: 'POST', body: payload, revalidate: 0 }
  )
  return res.data
}
