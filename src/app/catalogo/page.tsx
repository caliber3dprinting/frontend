import type { Metadata } from 'next'
import { getProducts, getCategories } from '@/lib/strapi'
import CategoryFilter from '@/components/catalog/CategoryFilter'
import ProductGrid from '@/components/catalog/ProductGrid'

export const metadata: Metadata = {
  title: 'Catálogo',
  description: 'Explora nuestros trabajos de impresión 3D: decoración, repuestos, figuras personalizadas y más.',
}

// Los filtros llegan como search params (?categoria=decoracion&pagina=2)
// Next.js los provee automáticamente como prop en page components.
interface CatalogPageProps {
  searchParams: Promise<{ categoria?: string; pagina?: string }>
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const { categoria, pagina } = await searchParams
  const page = pagina ? parseInt(pagina, 10) : 1

  const [{ data: products, meta }, categories] = await Promise.all([
    getProducts({ categorySlug: categoria, page, pageSize: 12 }),
    getCategories(),
  ])

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-30">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-2">Catálogo</h1>
        <p className="text-zinc-400">
          {meta.pagination.total} trabajo{meta.pagination.total !== 1 ? 's' : ''} disponible{meta.pagination.total !== 1 ? 's' : ''}
        </p>
      </div>

      {/* CategoryFilter es un Client Component — maneja los clicks sin perder el estado de URL */}
      <CategoryFilter
        categories={categories}
        activeSlug={categoria}
      />

      <div className="mt-8">
        <ProductGrid products={products} />
      </div>

      {/* Paginación simple */}
      {meta.pagination.pageCount > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          {Array.from({ length: meta.pagination.pageCount }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/catalogo?${categoria ? `categoria=${categoria}&` : ''}pagina=${p}`}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? 'bg-orange-500 text-white'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </section>
  )
}
