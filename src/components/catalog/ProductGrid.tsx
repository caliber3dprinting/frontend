import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/lib/types'
import { getStrapiImageUrl } from '@/lib/strapi'

// ─── ProductCard ────────────────────────────────

interface ProductCardProps {
  product: Product
  priority?: boolean
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const imgUrl = getStrapiImageUrl(product.cover_image, 'medium')

  return (
    <Link
      href={`/catalogo/${product.slug}`}
      className="group block bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-zinc-800">
        <Image
          src={imgUrl}
          alt={product.cover_image?.alternativeText ?? product.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.category && (
          <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
            {product.category.name}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors line-clamp-2">
          {product.title}
        </h3>
        {product.material && (
          <p className="text-zinc-500 text-xs mt-1">{product.material}</p>
        )}
        <p className="text-orange-400 text-sm font-medium mt-3">
          Solicitar cotización →
        </p>
      </div>
    </Link>
  )
}

// ─── ProductGrid ────────────────────────────────

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-zinc-500 text-lg">
          No hay trabajos en esta categoría todavía.
        </p>
        <Link href="/cotizar" className="text-orange-400 hover:text-orange-300 mt-2 inline-block underline">
          ¿Tienes una idea? Cotiza la tuya
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, idx) => (
        <ProductCard key={product.id} product={product} priority={idx === 0} />
      ))}
    </div>
  )
}
