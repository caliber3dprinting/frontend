import type { MetadataRoute } from 'next'
import { getProducts, getBlogPosts } from '@/lib/sanity'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://caliber3d.mx'

// Se revalida cada hora igual que el resto del sitio
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/catalogo`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/cotizar`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/calculadora`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/calculadora-escala`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/nosotros`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  let productRoutes: MetadataRoute.Sitemap = []
  try {
    const { data } = await getProducts({ pageSize: 100 })
    productRoutes = data.map((product) => ({
      url: `${BASE_URL}/catalogo/${product.slug}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  } catch {
    // Si Sanity no responde, el sitemap se genera solo con rutas estáticas
  }

  let blogRoutes: MetadataRoute.Sitemap = []
  try {
    const { data } = await getBlogPosts({ pageSize: 200 })
    blogRoutes = data.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch {
    // Si Sanity no responde, se omiten los posts del blog
  }

  return [...staticRoutes, ...productRoutes, ...blogRoutes]
}
