'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useUser } from '@clerk/nextjs'
import AuthGate from './AuthGate'

const schema = z.object({
  content: z
    .string()
    .min(3, 'El comentario es muy corto')
    .max(2000, 'Máximo 2000 caracteres'),
})

type FormValues = z.infer<typeof schema>

interface CommentFormProps {
  postId: string
  postSlug: string
  postTitle: string
  /** Callback para refrescar la lista tras un comentario exitoso */
  onSuccess?: () => void
}

export default function CommentForm({ postId, postSlug, postTitle, onSuccess }: CommentFormProps) {
  const { user } = useUser()
  const [serverMsg, setServerMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const contentLen = watch('content')?.length ?? 0

  async function onSubmit(values: FormValues) {
    setLoading(true)
    setServerMsg(null)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, postId, postSlug, postTitle }),
      })
      const data = await res.json()
      if (!res.ok) {
        setServerMsg({ type: 'error', text: data.error ?? 'Error al enviar' })
      } else {
        setServerMsg({ type: 'success', text: data.message ?? '¡Comentario enviado!' })
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
    <AuthGate action="para comentar">
      <div className="flex items-start gap-4">
        {/* Avatar del usuario */}
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

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-3">
          <div>
            <textarea
              {...register('content')}
              placeholder="Escribí tu comentario..."
              rows={4}
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
              disabled={loading || !!serverMsg?.type === true && serverMsg?.type === 'success'}
              className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-5 py-2 rounded-xl text-sm transition-colors flex items-center gap-2"
            >
              {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              {loading ? 'Enviando…' : 'Publicar comentario'}
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
