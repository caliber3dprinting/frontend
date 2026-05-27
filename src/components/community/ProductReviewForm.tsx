'use client'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useUser } from '@clerk/nextjs'
import AuthGate from './AuthGate'
import StarRatingInput from './StarRatingInput'

const schema = z.object({
  rating:  z.number().int().min(1, 'Seleccioná al menos 1 estrella').max(5, 'Puntuación inválida'),
  content: z.string().max(2000, 'Máximo 2000 caracteres').optional().or(z.literal('')),
})

type FormValues = z.infer<typeof schema>

interface ProductReviewFormProps {
  productId:    string
  productSlug:  string
  productTitle: string
  onSuccess?: () => void
}

export default function ProductReviewForm({
  productId,
  productSlug,
  productTitle,
  onSuccess,
}: ProductReviewFormProps) {
  const { user } = useUser()
  const [serverMsg, setServerMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 0 },
  })

  const contentLen = watch('content')?.length ?? 0

  async function onSubmit(values: FormValues) {
    setLoading(true)
    setServerMsg(null)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, productId, productSlug, productTitle }),
      })
      const data = await res.json()
      if (!res.ok) {
        setServerMsg({ type: 'error', text: data.error ?? 'Error al enviar' })
      } else {
        setServerMsg({ type: 'success', text: data.message ?? '¡Reseña enviada!' })
        reset()
        onSuccess?.()
      }
    } catch {
      setServerMsg({ type: 'error', text: 'Error de conexión. Intentá de nuevo.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthGate action="para dejar una reseña">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        {user?.imageUrl ? (
          <img
            src={user.imageUrl}
            alt={user.fullName ?? 'Avatar'}
            className="w-10 h-10 rounded-full object-cover shrink-0 mt-1"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm shrink-0 mt-1">
            {(user?.firstName ?? user?.username ?? 'U').charAt(0).toUpperCase()}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-4">
          {/* Stars */}
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Tu puntuación *</label>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <StarRatingInput
                  value={field.value}
                  onChange={field.onChange}
                  size="lg"
                  disabled={loading}
                />
              )}
            />
            {errors.rating && (
              <p className="text-red-400 text-xs mt-1">{errors.rating.message}</p>
            )}
          </div>

          {/* Text */}
          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              Comentario <span className="text-zinc-600">(opcional)</span>
            </label>
            <textarea
              {...register('content')}
              placeholder="¿Qué te pareció la pieza?"
              rows={3}
              disabled={loading}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 text-sm resize-none focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-60"
            />
            <div className="flex items-center justify-between mt-1">
              {errors.content ? (
                <p className="text-red-400 text-xs">{errors.content.message}</p>
              ) : (
                <span />
              )}
              <span className={`text-xs ${contentLen > 1800 ? 'text-orange-400' : 'text-zinc-600'}`}>
                {contentLen}/2000
              </span>
            </div>
          </div>

          {serverMsg && (
            <p className={`text-sm px-4 py-2.5 rounded-xl ${
              serverMsg.type === 'success'
                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {serverMsg.text}
            </p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading || serverMsg?.type === 'success'}
              className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-5 py-2 rounded-xl text-sm transition-colors flex items-center gap-2"
            >
              {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              {loading ? 'Enviando…' : 'Enviar reseña'}
            </button>
            <span className="text-zinc-500 text-xs">
              Queda pendiente de moderación
            </span>
          </div>
        </form>
      </div>
    </AuthGate>
  )
}
