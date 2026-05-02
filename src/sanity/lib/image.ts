import createImageUrlBuilder from '@sanity/image-url'
import { dataset, projectId } from '../env'

const builder = createImageUrlBuilder({ projectId, dataset })

const SIZE_WIDTHS = { thumbnail: 150, small: 300, medium: 600, large: 1200 } as const

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sanityImageUrl(source: any, size?: keyof typeof SIZE_WIDTHS): string {
  if (!source) return '/placeholder-product.jpg'
  if (typeof source === 'string') return source
  if (source.url && !source.asset) return source.url
  try {
    const img = builder.image(source).auto('format').quality(80)
    return (size ? img.width(SIZE_WIDTHS[size]) : img).url()
  } catch {
    return source.url ?? '/placeholder-product.jpg'
  }
}
