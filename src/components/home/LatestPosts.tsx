'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import type { BlogPost } from '@/lib/types'
import { getStrapiImageUrl } from '@/lib/strapi'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function PostCard({ post, index, inView }: { post: BlogPost; index: number; inView: boolean }) {
  const imageUrl = getStrapiImageUrl(post.cover_image, 'medium')
  const categories = post.categories ?? []

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.25, 0.4, 0.25, 1] }}
      className="group flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-600 transition-all duration-300 hover:-translate-y-0.5"
    >
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
          {categories.slice(0, 2).map((cat) => (
            <span key={cat.id} className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2.5 py-0.5 rounded-full font-medium">
              {cat.name}
            </span>
          ))}
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          {post.reading_time && <span>{post.reading_time} min</span>}
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-base font-bold text-white leading-snug group-hover:text-orange-400 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2 flex-1">
          {post.excerpt}
        </p>

        <Link
          href={`/blog/${post.slug}`}
          className="mt-1 inline-flex items-center gap-1.5 text-orange-500 hover:text-orange-400 text-sm font-medium transition-colors"
        >
          Leer artículo
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </motion.article>
  )
}

export default function LatestPosts({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null

  const headerRef = useRef(null)
  const gridRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-10% 0px' })
  const gridInView = useInView(gridRef, { once: true, margin: '-5% 0px' })

  return (
    <section className="py-24 bg-zinc-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          ref={headerRef}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <div>
            <p className="text-orange-500 text-sm font-semibold tracking-widest uppercase mb-2">
              Blog & Recursos
            </p>
            <h2
              className="font-display font-black text-white accent-line"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
            >
              Últimas publicaciones
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-zinc-400 hover:text-orange-400 text-sm font-medium transition-colors flex items-center gap-1.5 shrink-0 mb-1"
          >
            Ver todo el blog
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </motion.div>

        {/* Grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} inView={gridInView} />
          ))}
        </div>

      </div>
    </section>
  )
}
