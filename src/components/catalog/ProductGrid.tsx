import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/lib/types'
import { getSanityImageUrl } from '@/lib/sanity'

// ─── ProductCard ────────────────────────────────

interface ProductCardProps {
  product: Product
  priority?: boolean
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const imgUrl = getSanityImageUrl(product.cover_image, 'medium')

  return (
    <Link
      href={`/catalogo/${product.slug}`}
      className="group block bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-orange-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/5"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-zinc-800">
        <Image
          src={imgUrl}
          alt={product.cover_image?.alt ?? product.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badges superpuestos */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {product.categories?.slice(0, 2).map((cat) => (
            <span
              key={cat.id}
              className="bg-orange-500/90 backdrop-blur-sm text-white text-xs px-2.5 py-0.5 rounded-full font-medium"
            >
              {cat.name}
            </span>
          ))}
        </div>
        {product.material && (
          <span className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-zinc-300 text-xs px-2.5 py-0.5 rounded-full">
            {product.material}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug">
          {product.title}
        </h3>
        <p className="text-orange-400 text-sm font-medium mt-3 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
          Solicitar cotización
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
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
