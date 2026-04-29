import type { Metadata } from 'next'
export const revalidate = 60
import { getBlogPosts } from '@/lib/strapi'
import BlogCard from '@/components/blog/BlogCard'
import Breadcrumb from '@/components/ui/Breadcrumb'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://caliber3d.mx'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Blog de Impresión 3D | Guías, Materiales y Proyectos',
  description:
    'Aprende sobre impresión 3D: guías prácticas, comparativas de materiales, proyectos reales y consejos de Caliber 3D Printing en Playa del Carmen.',
  alternates: {
    canonical: `${BASE_URL}/blog`,
  },
  openGraph: {
    title: 'Blog de Impresión 3D | Caliber 3D Printing',
    description:
      'Guías prácticas, comparativas de materiales y proyectos reales de impresión 3D.',
    url: `${BASE_URL}/blog`,
    type: 'website',
  },
}

const CATEGORIES = [
  { value: '', label: 'Todo' },
  { value: 'guides', label: 'Guías' },
  { value: 'materials', label: 'Materiales' },
  { value: 'projects', label: 'Proyectos' },
  { value: 'news', label: 'Novedades' },
  { value: 'tips', label: 'Consejos' },
]

interface BlogPageProps {
  searchParams: Promise<{ categoria?: string; pagina?: string }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { categoria, pagina } = await searchParams
  const page = pagina ? parseInt(pagina, 10) : 1

  let posts: Awaited<ReturnType<typeof getBlogPosts>>

  try {
    posts = await getBlogPosts({ category: categoria, page, pageSize: 9 })
  } catch {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-30">
        <h1 className="text-4xl font-bold text-white mb-6">Blog</h1>
        <p className="text-zinc-400">
          No se pudo cargar el blog en este momento.{' '}
          <a href="/blog" className="text-orange-500 hover:text-orange-400 underline underline-offset-2">
            Reintentar
          </a>
        </p>
      </section>
    )
  }

  const { data, meta } = posts

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Blog de Caliber 3D Printing',
            description: 'Guías, materiales y proyectos de impresión 3D',
            url: `${BASE_URL}/blog`,
            publisher: {
              '@type': 'Organization',
              name: 'Caliber 3D Printing',
              url: BASE_URL,
            },
          }),
        }}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-30">
        {/* Header */}
        <div className="mb-10">
          <Breadcrumb items={[{ label: 'Blog', href: '/blog' }]} />
          <h1 className="text-4xl font-bold text-white mt-4 mb-2">Blog</h1>
          <p className="text-zinc-400">
            {meta.pagination.total} artículo{meta.pagination.total !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Filtro de categorías */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map(({ value, label }) => {
            const isActive = (value === '' && !categoria) || value === categoria
            const href = value
              ? `/blog?categoria=${value}`
              : '/blog'
            return (
              <a
                key={value}
                href={href}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  isActive
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white'
                }`}
              >
                {label}
              </a>
            )
          })}
        </div>

        {/* Grid */}
        {data.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-zinc-400 text-lg">No hay artículos en esta categoría aún.</p>
            <a href="/blog" className="mt-4 inline-block text-orange-500 hover:text-orange-400 underline underline-offset-2">
              Ver todos los artículos
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Paginación */}
        {meta.pagination.pageCount > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            {Array.from({ length: meta.pagination.pageCount }, (_, i) => i + 1).map((p) => (
              <a
                key={p}
                href={`/blog?${categoria ? `categoria=${categoria}&` : ''}pagina=${p}`}
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
    </>
  )
}
