import type { PortableTextBlock } from '@portabletext/react'

// ─────────────────────────────────────────────
// Sanity image shape (resolved via GROQ asset->)
// ─────────────────────────────────────────────

export interface SanityImage {
  _type: 'image'
  url: string
  alt: string | null
  width: number | null
  height: number | null
  asset: { _ref: string; _type: 'reference' }
}

// ─────────────────────────────────────────────
// Collection Types
// ─────────────────────────────────────────────

export interface Category {
  id: string
  documentId: string
  name: string
  slug: string
  description: string | null
  icon: string | null
}

export interface Product {
  id: string
  documentId: string
  title: string
  slug: string
  description: PortableTextBlock[] | null
  material: string | null
  featured: boolean
  status: 'draft' | 'published'
  cover_image: SanityImage | null
  gallery: SanityImage[]
  categories: Category[]
  createdAt: string
  updatedAt: string
}

export interface Testimonial {
  id: string
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
}

export interface Quote {
  _id: string
  name: string
  email: string
  phone?: string
  description: string
  category?: string
  notes?: string
  status: 'new' | 'reviewing' | 'quoted' | 'closed'
  submittedAt: string
}

// ─────────────────────────────────────────────
// Single Types
// ─────────────────────────────────────────────

export interface HomePage {
  hero_title: string
  hero_subtitle: string
  hero_cta_label: string
  hero_image: SanityImage | string | null
  about_preview_title: string
  about_preview_text: string
  about_preview_image: SanityImage | string | null
}

export interface AboutPage {
  title: string
  story: PortableTextBlock[]
  team_photo: SanityImage | null
  team_caption: string | null
  values: { id: string; title: string; text: string }[]
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
  id: string
  documentId: string
  title: string
  slug: string
  excerpt: string
  content: PortableTextBlock[] | null
  cover_image: SanityImage | null
  categories: Category[]
  author: string | null
  reading_time: number | null
  meta_title: string | null
  meta_description: string | null
  faq: { question: string; answer: string }[] | null
  publishedAt: string
  createdAt: string
  updatedAt: string
}

// ─────────────────────────────────────────────
// Community — Comments & Reviews
// ─────────────────────────────────────────────

export interface BlogComment {
  id: string
  clerkUserId: string
  authorName: string
  authorEmail: string | null
  authorAvatar: string | null
  content: string
  post: Pick<BlogPost, 'id' | 'title' | 'slug'>
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

export interface ProductReview {
  id: string
  clerkUserId: string
  authorName: string
  authorEmail: string | null
  authorAvatar: string | null
  rating: number
  content: string | null
  product: Pick<Product, 'id' | 'title' | 'slug'>
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
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
  categorySlug?: string
  page?: number
  pageSize?: number
}
