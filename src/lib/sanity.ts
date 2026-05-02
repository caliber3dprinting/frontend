import { client } from '@/sanity/lib/client'
import { sanityImageUrl } from '@/sanity/lib/image'
import type {
  Product,
  Category,
  Testimonial,
  HomePage,
  AboutPage,
  GlobalConfig,
  ProductFilters,
  BlogPost,
  BlogFilters,
  SanityImage,
} from './types'

export { sanityImageUrl as getSanityImageUrl }

// ─────────────────────────────────────────────
// Shared image projection
// ─────────────────────────────────────────────

const IMAGE_PROJECTION = `{
  "_type": "image",
  "url": asset->url,
  "alt": alt,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  asset
}`

// ─────────────────────────────────────────────
// Core fetch wrapper with Next.js cache
// ─────────────────────────────────────────────

const defaultRevalidate = process.env.NODE_ENV === 'development' ? 0 : 60

async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  tags?: string[]
): Promise<T> {
  return client.fetch<T>(query, params, {
    next: { revalidate: defaultRevalidate, ...(tags ? { tags } : {}) },
  })
}

// ─────────────────────────────────────────────
// Products
// ─────────────────────────────────────────────

const PRODUCT_FIELDS = `
  "id": _id,
  "documentId": _id,
  title,
  "slug": slug.current,
  description,
  material,
  featured,
  "status": select(defined(status) => status, "published"),
  "cover_image": cover_image ${IMAGE_PROJECTION},
  "gallery": gallery[]{${IMAGE_PROJECTION}},
  "categories": categories[]->{
    "id": _id,
    "documentId": _id,
    name,
    "slug": slug.current,
    description,
    icon
  },
  "createdAt": _createdAt,
  "updatedAt": _updatedAt
`

export async function getProducts(filters: ProductFilters = {}): Promise<{
  data: Product[]
  meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } }
}> {
  const { categorySlug, featured, page = 1, pageSize = 12 } = filters

  const all = await sanityFetch<Product[]>(
    `*[_type == "product" && status == "published"] | order(_createdAt desc) {${PRODUCT_FIELDS}}`,
    {},
    ['products']
  )

  const filtered = all
    .filter((p) => featured === undefined || p.featured === featured)
    .filter((p) => !categorySlug || p.categories?.some((c) => c.slug === categorySlug))

  const total = filtered.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const start = (page - 1) * pageSize
  const data = filtered.slice(start, start + pageSize)

  return { data, meta: { pagination: { page, pageSize, pageCount, total } } }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return sanityFetch<Product | null>(
    `*[_type == "product" && slug.current == $slug][0] {${PRODUCT_FIELDS}}`,
    { slug },
    [`product-${slug}`]
  )
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  const featured = await getProducts({ featured: true, pageSize: limit })
  if (featured.data.length > 0) return featured.data
  const recent = await getProducts({ pageSize: limit })
  return recent.data
}

// ─────────────────────────────────────────────
// Categories
// ─────────────────────────────────────────────

export async function getCategories(type: 'product' | 'blog' = 'product'): Promise<Category[]> {
  return sanityFetch<Category[]>(
    `*[_type == "category" && categoryType == $type] | order(name asc) {
      "id": _id, "documentId": _id, name, "slug": slug.current, description, icon
    }`,
    { type },
    [`categories-${type}`]
  )
}

// ─────────────────────────────────────────────
// Testimonials
// ─────────────────────────────────────────────

export async function getTestimonials(limit = 6): Promise<Testimonial[]> {
  return sanityFetch<Testimonial[]>(
    `*[_type == "testimonial"] | order(_createdAt desc) [0...$limit] {
      "id": _id,
      "documentId": _id,
      author_name,
      author_city,
      content,
      rating,
      "product": product->{
        "id": _id, title, "slug": slug.current
      }
    }`,
    { limit },
    ['testimonials']
  )
}

// ─────────────────────────────────────────────
// Single Types
// ─────────────────────────────────────────────

export async function getHomePage(): Promise<HomePage | null> {
  return sanityFetch<HomePage | null>(
    `*[_type == "homePage"][0] {
      hero_title,
      hero_subtitle,
      hero_cta_label,
      "hero_image": hero_image ${IMAGE_PROJECTION},
      about_preview_title,
      about_preview_text,
      "about_preview_image": about_preview_image ${IMAGE_PROJECTION}
    }`,
    {},
    ['home-page']
  )
}

export async function getAboutPage(): Promise<AboutPage | null> {
  return sanityFetch<AboutPage | null>(
    `*[_type == "aboutPage"][0] {
      title,
      story,
      "team_photo": team_photo ${IMAGE_PROJECTION},
      team_caption,
      "values": values[]{ "id": _key, title, text }
    }`,
    {},
    ['about-page']
  )
}

export async function getGlobalConfig(): Promise<GlobalConfig | null> {
  return sanityFetch<GlobalConfig | null>(
    `*[_type == "globalConfig"][0] {
      whatsapp_number,
      contact_email,
      instagram_url,
      facebook_url,
      tiktok_url,
      business_hours,
      address
    }`,
    {},
    ['global-config']
  )
}

// ─────────────────────────────────────────────
// Blog
// ─────────────────────────────────────────────

const BLOG_FIELDS = `
  "id": _id,
  "documentId": _id,
  title,
  "slug": slug.current,
  excerpt,
  content,
  "cover_image": cover_image ${IMAGE_PROJECTION},
  "categories": categories[]->{
    "id": _id, "documentId": _id, name, "slug": slug.current
  },
  author,
  reading_time,
  meta_title,
  meta_description,
  "publishedAt": coalesce(publishedAt, _createdAt),
  "createdAt": _createdAt,
  "updatedAt": _updatedAt
`

export async function getBlogPosts(filters: BlogFilters = {}): Promise<{
  data: BlogPost[]
  meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } }
}> {
  const { categorySlug, page = 1, pageSize = 9 } = filters

  const all = await sanityFetch<BlogPost[]>(
    `*[_type == "blogPost"] | order(coalesce(publishedAt, _createdAt) desc) {${BLOG_FIELDS}}`,
    {},
    ['blog-posts']
  )

  const filtered = all.filter(
    (p) => !categorySlug || p.categories?.some((c) => c.slug === categorySlug)
  )

  const total = filtered.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const start = (page - 1) * pageSize
  const data = filtered.slice(start, start + pageSize)

  return { data, meta: { pagination: { page, pageSize, pageCount, total } } }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return sanityFetch<BlogPost | null>(
    `*[_type == "blogPost" && slug.current == $slug][0] {${BLOG_FIELDS}}`,
    { slug },
    [`blog-post-${slug}`]
  )
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const results = await sanityFetch<Array<{ slug: string }>>(
    `*[_type == "blogPost"] { "slug": slug.current }`,
    {},
    ['blog-posts']
  )
  return results.map((r) => r.slug)
}

// ─────────────────────────────────────────────
// Re-export image helper (backward compat alias)
// ─────────────────────────────────────────────

export { sanityImageUrl as getStrapiImageUrl }

export type { SanityImage }
