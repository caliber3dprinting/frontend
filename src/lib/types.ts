// ─────────────────────────────────────────────
// Strapi v5 response shape helpers
// ─────────────────────────────────────────────

export interface StrapiImage {
  id: number
  url: string
  alternativeText: string | null
  width: number
  height: number
  formats?: {
    thumbnail?: { url: string }
    small?: { url: string }
    medium?: { url: string }
    large?: { url: string }
  }
}

// ─────────────────────────────────────────────
// Collection Types
// ─────────────────────────────────────────────

export interface Category {
  id: number
  documentId: string
  name: string
  slug: string
  description: string | null
  icon: string | null
}

export interface Product {
  id: number
  documentId: string
  title: string
  slug: string
  description: StrapiBlocks | null // Rich text (Blocks)
  material: string | null
  featured: boolean
  status: 'draft' | 'published'
  cover_image: StrapiImage | null
  gallery: StrapiImage[]
  category: Category | null
  createdAt: string
  updatedAt: string
}

export interface Testimonial {
  id: number
  documentId: string
  author_name: string
  author_city: string | null
  content: string
  rating: number
  product: Pick<Product, 'id' | 'title' | 'slug'> | null
}

export interface QuoteRequestPayload {
  name: string
  email: string
  phone?: string
  description: string
  category?: string
  notes?: string
  file_reference?: number  // ID del archivo subido a Strapi
}

// ─────────────────────────────────────────────
// Single Types
// ─────────────────────────────────────────────

export interface HomePage {
  hero_title: string
  hero_subtitle: string
  hero_cta_label: string
  hero_image: StrapiImage | null
  about_preview_title: string
  about_preview_text: string
  about_preview_image: StrapiImage | null
}

// Strapi v5 Blocks editor returns an array of block nodes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StrapiBlocks = any[]

export interface AboutPage {
  title: string
  story: StrapiBlocks // Rich text → Blocks JSON (usa BlocksRenderer)
  team_photo: StrapiImage | null
  team_caption: string | null
  values: { id: number; title: string; text: string }[]
}

export interface GlobalConfig {
  whatsapp_number: string
  contact_email: string
  instagram_url: string | null
  facebook_url: string | null
  tiktok_url: string | null
  business_hours: string | null
  address: string | null
}

// ─────────────────────────────────────────────
// Blog
// ─────────────────────────────────────────────

export interface BlogPost {
  id: number
  documentId: string
  title: string
  slug: string
  excerpt: string
  content: StrapiBlocks | null
  cover_image: StrapiImage | null
  category: string | null
  author: string | null
  reading_time: number | null
  meta_title: string | null
  meta_description: string | null
  publishedAt: string
  createdAt: string
  updatedAt: string
}

// ─────────────────────────────────────────────
// Query param helpers
// ─────────────────────────────────────────────

export interface ProductFilters {
  categorySlug?: string
  featured?: boolean
  page?: number
  pageSize?: number
}

export interface BlogFilters {
  category?: string
  page?: number
  pageSize?: number
}
