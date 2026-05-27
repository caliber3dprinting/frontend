import type { BlogComment } from '@/lib/types'

interface CommentListProps {
  comments: BlogComment[]
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days  = Math.floor(diff / 86_400_000)
  if (mins < 1)   return 'Ahora mismo'
  if (mins < 60)  return `Hace ${mins} min`
  if (hours < 24) return `Hace ${hours} h`
  if (days < 30)  return `Hace ${days} día${days !== 1 ? 's' : ''}`
  return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="text-zinc-500 text-sm text-center py-6">
        Aún no hay comentarios. ¡Sé el primero!
      </p>
    )
  }

  return (
    <ul className="space-y-6">
      {comments.map((comment) => (
        <li key={comment.id} className="flex items-start gap-4">
          {/* Avatar */}
          {comment.authorAvatar ? (
            <img
              src={comment.authorAvatar}
              alt={comment.authorName}
              className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center text-white font-bold text-sm shrink-0 mt-0.5">
              {comment.authorName.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-semibold text-white text-sm">{comment.authorName}</span>
              <time className="text-zinc-500 text-xs" dateTime={comment.createdAt}>
                {timeAgo(comment.createdAt)}
              </time>
            </div>
            <p className="text-zinc-300 text-sm mt-1 leading-relaxed whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}
