'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { Category } from '@/lib/types'

interface CategoryFilterProps {
  categories: Category[]
  activeSlug?: string
}

export default function CategoryFilter({ categories, activeSlug }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSelect = (slug?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (slug) {
      params.set('categoria', slug)
    } else {
      params.delete('categoria')
    }
    params.delete('pagina') // reset pagination on filter change
    router.push(`/catalogo?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleSelect(undefined)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          !activeSlug
            ? 'bg-orange-500 text-white'
            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
        }`}
      >
        Todos
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleSelect(cat.slug)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeSlug === cat.slug
              ? 'bg-orange-500 text-white'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
