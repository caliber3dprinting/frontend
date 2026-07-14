import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import RichText from '@/components/ui/RichText'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { getProductBySlug, getProducts, getSanityImageUrl, getProductReviews } from '@/lib/sanity'
import ProductGallery from '@/components/catalog/ProductGallery'
import { ProductCard } from '@/components/catalog/ProductGrid'
import ProductReviewList, { ReviewsStats } from '@/components/community/ProductReviewList'
import ProductReviewForm from '@/components/community/ProductReviewForm'
import TrackView from '@/components/analytics/TrackView'
import TrackedLink from '@/components/analytics/TrackedLink'
import JsonLd from '@/components/seo/JsonLd'
import { productSchema, breadcrumbSchema } from '@/lib/schema'
import { buildWhatsappUrl } from '@/lib/whatsapp'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://caliber3d.mx'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

// Si Sanity no está disponible en build time, retorna [] y las páginas
// se generan on-demand en runtime (dynamicParams = true)
export const dynamicParams = true
export const revalidate = 3600

export async function generateStaticParams() {
  try {
    const { data } = await getProducts({ pageSize: 100 })
    return data.map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

// Metadata dinámica por producto
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Producto no encontrado' }

  const materialNote = product.material ? ` en ${product.material}` : ''
  const desc = `${product.title}${materialNote}: impresión 3D a medida en Playa del Carmen. Cotizá por WhatsApp. Envíos en toda la Riviera Maya.`

  // Título ≤60 chars con keyword local + marca; degrada si el nombre es largo.
  const SUFFIX = ' | Caliber 3D'
  const full = `${product.title} — Impresión 3D en Playa del Carmen${SUFFIX}`
  const short = `${product.title} — Impresión 3D${SUFFIX}`
  let title = full
  if (title.length > 60) title = short
  if (title.length > 60) title = product.title.slice(0, 60 - SUFFIX.length - 1).trimEnd() + '…' + SUFFIX

  const canonicalUrl = `${BASE_URL}/catalogo/${slug}`

  return {
    // absolute evita que el template del layout agregue una segunda marca.
    title: { absolute: title },
    description: desc.length > 160 ? desc.slice(0, 157) + '…' : desc,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      url: canonicalUrl,
      images: product.cover_image
        ? [{ url: getSanityImageUrl(product.cover_image, 'large') }]
        : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  // Productos relacionados: misma categoría, excluyendo el actual
  const firstCategorySlug = product.categories?.[0]?.slug
  const [relatedRes, reviews] = await Promise.all([
    getProducts({ categorySlug: firstCategorySlug, pageSize: 4 }).catch(() => ({ data: [] })),
    getProductReviews(slug).catch(() => []),
  ])
  const related = relatedRes.data
    .filter((p) => p.slug !== slug)
    .slice(0, 3)

  const allImages = [
    ...(product.cover_image ? [product.cover_image] : []),
    ...(product.gallery ?? []),
  ]

  const coverUrl = product.cover_image ? getSanityImageUrl(product.cover_image, 'large') : undefined
  const materialNote = product.material ? ` en ${product.material}` : ''

  // aggregateRating a partir de reseñas aprobadas (getProductReviews ya filtra).
  const reviewCount = reviews.length
  const aggregateRating =
    reviewCount > 0
      ? {
          ratingValue: Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviewCount) * 10) / 10,
          reviewCount,
        }
      : undefined

  // Devuelve null si el producto no tiene ni precio ni reseñas: en ese caso no
  // emitimos markup de Product para no generar el error crítico de Google.
  const prodSchema = productSchema({
    name: product.title,
    image: coverUrl,
    description: `${product.title}${materialNote}. Impresión 3D a medida en Playa del Carmen.`,
    slug: product.slug,
    priceFrom: product.price ?? undefined,
    aggregateRating,
  })

  const breadcrumbItems = [
    { name: 'Inicio', url: BASE_URL },
    { name: 'Catálogo', url: `${BASE_URL}/catalogo` },
    ...(product.categories?.[0]
      ? [{ name: product.categories[0].name, url: `${BASE_URL}/catalogo?categoria=${product.categories[0].slug}` }]
      : []),
    { name: product.title },
  ]

  return (
    <>
      {prodSchema && <JsonLd data={prodSchema} />}
      <JsonLd data={breadcrumbSchema(breadcrumbItems)} />
      <TrackView event="view_product" params={{ slug: product.slug, name: product.title }} />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-30">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Breadcrumb items={[
          { label: 'Catálogo', href: '/catalogo' },
          ...(product.categories?.length > 0 ? [{ label: product.categories[0].name, href: `/catalogo?categoria=${product.categories[0].slug}` }] : []),
          { label: product.title },
        ]} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Galería */}
        <ProductGallery images={allImages} title={product.title} />

        {/* Info */}
        <div className="flex flex-col gap-6">
          {product.categories?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.categories.map((cat) => (
                <span key={cat.id} className="inline-block bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-medium px-3 py-1 rounded-full">
                  {cat.name}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            {product.title}
          </h1>

          {product.material && (
            <p className="text-zinc-400 text-sm">
              <span className="text-zinc-300 font-medium">Material:</span> {product.material}
            </p>
          )}

          {product.description && (
            <div className="space-y-2">
              <RichText content={product.description} />
            </div>
          )}

          {/* CTA principal */}
          <div className="mt-auto pt-6 border-t border-zinc-800 flex flex-col sm:flex-row gap-3">
            <Link
              href={`/cotizar?referencia=${product.slug}`}
              className="flex-1 bg-orange-500 hover:bg-orange-400 text-white font-semibold py-3 px-6 rounded-xl text-center transition-colors"
            >
              Solicitar cotización
            </Link>
            <TrackedLink
              event="click_whatsapp"
              eventParams={{ location: 'product', slug: product.slug }}
              href={buildWhatsappUrl(`Hola! Me interesa una pieza similar a: ${product.title}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3 px-6 rounded-xl text-center transition-colors"
            >
              Preguntar por WhatsApp
            </TrackedLink>
          </div>
        </div>
      </div>

      {/* ─── Reseñas ─── */}
      <div className="mt-20 pt-12 border-t border-zinc-800">
        <h2 className="text-2xl font-bold text-white mb-8">
          Reseñas
          {reviews.length > 0 && (
            <span className="ml-2 text-base font-normal text-zinc-500">
              ({reviews.length})
            </span>
          )}
        </h2>

        {/* Estadísticas de rating */}
        <ReviewsStats reviews={reviews} />

        {/* Lista de reseñas aprobadas */}
        <ProductReviewList reviews={reviews} />

        {/* Formulario de nueva reseña */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold text-white mb-4">Dejá tu reseña</h3>
          <ProductReviewForm
            productId={product.id}
            productSlug={product.slug}
            productTitle={product.title}
          />
        </div>
      </div>

      {/* Productos relacionados */}
      {related.length > 0 && (
        <div className="mt-20 pt-12 border-t border-zinc-800">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Proyectos similares</h2>
            <Link
              href={firstCategorySlug ? `/catalogo?categoria=${firstCategorySlug}` : '/catalogo'}
              className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
            >
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
    </>
  )
}
