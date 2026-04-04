import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import RichText from '@/components/ui/RichText'
import { getProductBySlug, getProducts, getStrapiImageUrl } from '@/lib/strapi'
import ProductGallery from '@/components/catalog/ProductGallery'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

// Genera las rutas estáticas en build time para todos los productos publicados
export async function generateStaticParams() {
  const { data } = await getProducts({ pageSize: 100 })
  return data.map((p) => ({ slug: p.slug }))
}

// Metadata dinámica por producto
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Producto no encontrado' }

  return {
    title: product.title,
    description: `Impresión 3D personalizada: ${product.title}. ${product.material ? `Material: ${product.material}.` : ''} Solicita tu cotización.`,
    openGraph: {
      images: product.cover_image
        ? [{ url: getStrapiImageUrl(product.cover_image, 'large') }]
        : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  const allImages = [
    ...(product.cover_image ? [product.cover_image] : []),
    ...product.gallery,
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-zinc-400 mb-8">
        <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
        <span>/</span>
        <Link href="/catalogo" className="hover:text-white transition-colors">Catálogo</Link>
        {product.category && (
          <>
            <span>/</span>
            <Link
              href={`/catalogo?categoria=${product.category.slug}`}
              className="hover:text-white transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-zinc-200">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Galería */}
        <ProductGallery images={allImages} title={product.title} />

        {/* Info */}
        <div className="flex flex-col gap-6">
          {product.category && (
            <span className="inline-block w-fit bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-medium px-3 py-1 rounded-full">
              {product.category.name}
            </span>
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
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}?text=Hola! Me interesa una pieza similar a: ${product.title}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3 px-6 rounded-xl text-center transition-colors"
            >
              Preguntar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
