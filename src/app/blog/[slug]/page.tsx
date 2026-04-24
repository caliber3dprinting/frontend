import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getBlogPostBySlug, getAllBlogSlugs, getStrapiImageUrl } from '@/lib/strapi'
import RichText from '@/components/ui/RichText'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://caliber3d.mx'

const CATEGORY_LABELS: Record<string, string> = {
  guides: 'Guías',
  materials: 'Materiales',
  projects: 'Proyectos',
  news: 'Novedades',
  tips: 'Consejos',
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = true

export async function generateStaticParams() {
  try {
    const slugs = await getAllBlogSlugs()
    return slugs.map((slug) => ({ slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return { title: 'Artículo no encontrado' }

  const title = post.meta_title ?? `${post.title} | Blog Caliber 3D`
  const description = post.meta_description ?? post.excerpt
  const imageUrl = post.cover_image
    ? getStrapiImageUrl(post.cover_image, 'large')
    : undefined

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/blog/${post.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: post.author ? [post.author] : undefined,
      images: imageUrl ? [{ url: imageUrl, alt: post.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) notFound()

  const imageUrl = post.cover_image ? getStrapiImageUrl(post.cover_image, 'large') : null
  const categoryLabel = post.category ? (CATEGORY_LABELS[post.category] ?? post.category) : null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    url: `${BASE_URL}/blog/${post.slug}`,
    image: imageUrl ?? undefined,
    author: {
      '@type': 'Person',
      name: post.author ?? 'Caliber 3D Printing',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Caliber 3D Printing',
      url: BASE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${post.slug}`,
    },
  }

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-30">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-zinc-400 mb-10">
          <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          {categoryLabel && (
            <>
              <span>/</span>
              <Link
                href={`/blog?categoria=${post.category}`}
                className="hover:text-white transition-colors"
              >
                {categoryLabel}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-zinc-200 truncate max-w-[200px]">{post.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          {categoryLabel && (
            <span className="inline-block bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-medium px-3 py-1 rounded-full mb-4">
              {categoryLabel}
            </span>
          )}

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            {post.title}
          </h1>

          <p className="text-lg text-zinc-400 leading-relaxed mb-6">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 border-b border-zinc-800 pb-6">
            {post.author && (
              <span className="text-zinc-300 font-medium">{post.author}</span>
            )}
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            {post.reading_time && (
              <span>{post.reading_time} min de lectura</span>
            )}
          </div>
        </header>

        {/* Imagen de portada */}
        {imageUrl && (
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-12 bg-zinc-800">
            <Image
              src={imageUrl}
              alt={post.cover_image?.alternativeText ?? post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        )}

        {/* Contenido */}
        {post.content && (
          <div className="prose-blog">
            <RichText content={post.content} />
          </div>
        )}

        {/* CTA final */}
        <div className="mt-16 p-8 bg-zinc-900 border border-zinc-800 rounded-2xl text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            ¿Querés hacer realidad tu proyecto?
          </h2>
          <p className="text-zinc-400 mb-6 max-w-md mx-auto">
            Cotizá tu pieza en minutos. Impresión 3D de precisión profesional en Playa del Carmen.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/cotizar"
              className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Solicitar cotización
            </Link>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}?text=Hola!%20Le%C3%AD%20el%20art%C3%ADculo%20%22${encodeURIComponent(post.title)}%22%20y%20tengo%20una%20consulta`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>

        {/* Link de vuelta */}
        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Volver al blog
          </Link>
        </div>
      </article>
    </>
  )
}
