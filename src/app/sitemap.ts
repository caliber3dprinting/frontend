import type { MetadataRoute } from 'next'
import { getProducts } from '@/lib/strapi'

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
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/cotizar`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/nosotros`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  let productRoutes: MetadataRoute.Sitemap = []
  try {
    const { data } = await getProducts({ pageSize: 100 })
    productRoutes = data.map((product) => ({
      url: `${BASE_URL}/catalogo/${product.slug}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {
    // Si Strapi no responde, el sitemap se genera solo con rutas estáticas
  }

  return [...staticRoutes, ...productRoutes]
}
