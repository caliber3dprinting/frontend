'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

const schema = z.object({
  name: z.string().min(2, 'Ingresa tu nombre completo'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  category: z.string().optional(),
  description: z.string().min(10, 'Cuéntanos un poco más sobre tu proyecto (mínimo 10 caracteres)'),
})

type FormValues = z.infer<typeof schema>

const CATEGORIES = [
  'Decoración del hogar',
  'Figuras y coleccionables',
  'Repuestos y funcional',
  'Joyería y accesorios',
  'Prototipos',
  'Otro',
]

export default function QuoteForm() {
  const searchParams = useSearchParams()
  const referencia = searchParams.get('referencia')

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: referencia ? `Hola, me interesa algo similar a: ${referencia}\n\n` : '',
    },
  })

  const onSubmit = async (data: FormValues) => {
    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? 'Error al enviar')
      }

      setStatus('success')
      reset()
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Error inesperado')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-10 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-2xl font-bold text-white mb-2">¡Cotización recibida!</h3>
        <p className="text-zinc-400 mb-6">
          Nos pondremos en contacto contigo en menos de 24 horas.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-orange-400 hover:text-orange-300 underline text-sm"
        >
          Enviar otra solicitud
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {/* Nombre y email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-1.5">
            Nombre completo <span className="text-orange-400">*</span>
          </label>
          <input
            id="name"
            type="text"
            placeholder="Tu nombre"
            {...register('name')}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1.5">
            Email <span className="text-orange-400">*</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="tu@email.com"
            {...register('email')}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Teléfono y categoría */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-zinc-300 mb-1.5">
            WhatsApp / Teléfono
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="+52 984 000 0000"
            {...register('phone')}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-zinc-300 mb-1.5">
            Tipo de proyecto
          </label>
          <select
            id="category"
            {...register('category')}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition appearance-none cursor-pointer"
          >
            <option value="">Selecciona una categoría</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Descripción */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-1.5">
          Cuéntanos tu idea <span className="text-orange-400">*</span>
        </label>
        <textarea
          id="description"
          rows={5}
          placeholder="Describe tu proyecto: tamaño aproximado, uso, referencias visuales, colores, cantidad de piezas..."
          {...register('description')}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
        )}
      </div>

      {/* Error global */}
      {status === 'error' && (
        <div className="bg-red-950/50 border border-red-800 rounded-xl px-4 py-3 text-red-300 text-sm">
          {errorMessage}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-orange-500 hover:bg-orange-400 disabled:bg-orange-500/50 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-6 rounded-xl transition-colors text-base"
      >
        {status === 'loading' ? 'Enviando...' : 'Solicitar cotización gratuita'}
      </button>

      <p className="text-center text-xs text-zinc-500">
        Sin compromiso · Respondemos en menos de 24 horas · Operamos desde Playa del Carmen
      </p>
    </form>
  )
}
