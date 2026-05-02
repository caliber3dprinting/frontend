import Image from 'next/image'
import Link from 'next/link'
import { getStrapiImageUrl } from '@/lib/strapi'
import type { BlogPost } from '@/lib/types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function BlogCard({ post }: { post: BlogPost }) {
  const imageUrl = getStrapiImageUrl(post.cover_image, 'medium')
  const categories = post.categories ?? []

  return (
    <article className="group flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-600 transition-all duration-300 hover:-translate-y-0.5">
      <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/9] overflow-hidden bg-zinc-800">
        <Image
          src={imageUrl}
          alt={post.cover_image?.alternativeText ?? post.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-col flex-1 p-6 gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/blog?categoria=${cat.slug}`}
              className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2.5 py-0.5 rounded-full font-medium hover:bg-orange-500/20 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          {post.reading_time && (
            <span>{post.reading_time} min de lectura</span>
          )}
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h2 className="text-lg font-bold text-white leading-snug group-hover:text-orange-400 transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>

        <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 flex-1">
          {post.excerpt}
        </p>

        <Link
          href={`/blog/${post.slug}`}
          className="mt-2 inline-flex items-center gap-1.5 text-orange-500 hover:text-orange-400 text-sm font-medium transition-colors"
        >
          Leer artículo
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </article>
  )
}
