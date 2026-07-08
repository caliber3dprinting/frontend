import type { Metadata } from 'next'
import Link from 'next/link'
import { getProducts, getCategories } from '@/lib/sanity'
import CategoryFilter from '@/components/catalog/CategoryFilter'
import ProductGrid from '@/components/catalog/ProductGrid'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { buildWhatsappUrl } from '@/lib/whatsapp'

export const revalidate = 60

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://caliber3d.mx'

export const metadata: Metadata = {
  title: { absolute: 'Catálogo de Impresión 3D en Playa del Carmen | Caliber 3D' },
  description:
    'Explorá nuestro catálogo de piezas impresas en 3D: trofeos, cake toppers, maquetas, prototipos, repuestos y más. Envíos en toda la Riviera Maya.',
  alternates: {
    canonical: `${BASE_URL}/catalogo`,
  },
}

interface CatalogPageProps {
  searchParams: Promise<{ categoria?: string; pagina?: string }>
}

// ─── Contacto de fallback (se usa cuando Sanity no responde) ──────────────────
const CONTACT_EMAIL = 'caliber.3dprinting@gmail.com'
// ─────────────────────────────────────────────────────────────────────────────

function CatalogError() {
  const waUrl = buildWhatsappUrl('Hola, quiero ver el catálogo de productos')

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-30">
      <div className="mb-10">
        <Breadcrumb items={[{ label: 'Catálogo' }]} />
        <h1 className="text-4xl font-bold text-white mt-4 mb-2">Catálogo</h1>
      </div>

      <div className="flex flex-col items-center justify-center py-24 text-center">
        {/* Ícono */}
        <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-white mb-3">
          El catálogo no está disponible ahora
        </h2>
        <p className="text-zinc-400 max-w-md mb-10 leading-relaxed">
          Estamos teniendo problemas técnicos para mostrar nuestros productos. Podés contactarnos directamente y te enviamos el catálogo completo.
        </p>

        {/* Botones de contacto */}
        <div className="flex flex-col sm:flex-row gap-4">
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Escribirnos por WhatsApp
            </a>
          )}
          {CONTACT_EMAIL && (
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Consulta%20sobre%20cat%C3%A1logo`}
              className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              Enviar email
            </a>
          )}
        </div>

        {/* Reintentar */}
        <p className="mt-10 text-zinc-600 text-sm">
          ¿Ya se resolvió el problema?{' '}
          <a href="/catalogo" className="text-orange-500 hover:text-orange-400 underline underline-offset-2">
            Reintentar
          </a>
        </p>
      </div>
    </section>
  )
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const { categoria, pagina } = await searchParams
  const page = pagina ? parseInt(pagina, 10) : 1

  let products: Awaited<ReturnType<typeof getProducts>>
  let categories: Awaited<ReturnType<typeof getCategories>>

  try {
    ;[products, categories] = await Promise.all([
      getProducts({ categorySlug: categoria, page, pageSize: 12 }),
      getCategories('product'),
    ])
  } catch {
    return <CatalogError />
  }

  const { data, meta } = products
  const activeCategory = categoria ? categories.find((c) => c.slug === categoria) : null

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-30">
      <div className="mb-10">
        <Breadcrumb items={[
          { label: 'Catálogo', href: activeCategory ? '/catalogo' : undefined },
          ...(activeCategory ? [{ label: activeCategory.name }] : []),
        ]} />
        <h1 className="text-4xl font-bold text-white mt-4 mb-2">Catálogo</h1>
        <p className="text-zinc-400">
          {meta.pagination.total} trabajo{meta.pagination.total !== 1 ? 's' : ''} disponible{meta.pagination.total !== 1 ? 's' : ''}
        </p>
      </div>

      <CategoryFilter
        categories={categories}
        activeSlug={categoria}
      />

      <div className="mt-8">
        <ProductGrid products={data} />
      </div>

      {meta.pagination.pageCount > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          {Array.from({ length: meta.pagination.pageCount }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/catalogo?${categoria ? `categoria=${categoria}&` : ''}pagina=${p}`}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? 'bg-orange-500 text-white'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
