import type { ProductReview } from '@/lib/types'
import { StarRatingDisplay } from './StarRatingInput'

interface ProductReviewListProps {
  reviews: ProductReview[]
}

function timeAgo(iso: string) {
  const diff  = Date.now() - new Date(iso).getTime()
  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days  = Math.floor(diff / 86_400_000)
  if (mins < 1)   return 'Ahora mismo'
  if (mins < 60)  return `Hace ${mins} min`
  if (hours < 24) return `Hace ${hours} h`
  if (days < 30)  return `Hace ${days} día${days !== 1 ? 's' : ''}`
  return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function ReviewsStats({ reviews }: { reviews: ProductReview[] }) {
  if (reviews.length === 0) return null

  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  const rounded = Math.round(avg * 10) / 10

  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }))

  return (
    <div className="flex flex-col sm:flex-row gap-6 p-6 bg-zinc-900 border border-zinc-800 rounded-2xl mb-8">
      {/* Big average */}
      <div className="text-center sm:border-r sm:border-zinc-800 sm:pr-6 flex flex-col items-center justify-center">
        <div className="text-5xl font-black text-white">{rounded.toFixed(1)}</div>
        <StarRatingDisplay rating={Math.round(avg)} size="sm" />
        <div className="text-zinc-500 text-xs mt-1">
          {reviews.length} reseña{reviews.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Bar breakdown */}
      <div className="flex-1 space-y-1.5">
        {counts.map(({ star, count }) => {
          const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0
          return (
            <div key={star} className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="w-4 text-right">{star}</span>
              <svg className="w-3.5 h-3.5 text-orange-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <div className="flex-1 bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-orange-400 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-4">{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function ProductReviewList({ reviews }: ProductReviewListProps) {
  if (reviews.length === 0) {
    return (
      <p className="text-zinc-500 text-sm text-center py-6">
        Aún no hay reseñas. ¡Sé el primero en opinar!
      </p>
    )
  }

  return (
    <ul className="space-y-6">
      {reviews.map((review) => (
        <li key={review.id} className="flex items-start gap-4 pb-6 border-b border-zinc-800 last:border-0">
          {/* Avatar */}
          {review.authorAvatar ? (
            <img
              src={review.authorAvatar}
              alt={review.authorName}
              className="w-10 h-10 rounded-full object-cover shrink-0 mt-0.5"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-white font-bold text-sm shrink-0 mt-0.5">
              {review.authorName.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <span className="font-semibold text-white text-sm">{review.authorName}</span>
              <StarRatingDisplay rating={review.rating} size="sm" />
              <time className="text-zinc-500 text-xs ml-auto" dateTime={review.createdAt}>
                {timeAgo(review.createdAt)}
              </time>
            </div>
            {review.content && (
              <p className="text-zinc-300 text-sm mt-1 leading-relaxed whitespace-pre-wrap">
                {review.content}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
