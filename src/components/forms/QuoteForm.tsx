'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Turnstile from './Turnstile'
import { trackEvent } from '@/lib/analytics'

const MAX_FILE_MB = 15
const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

const schema = z.object({
  name: z.string().min(2, 'Ingresa tu nombre completo'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  category: z.string().optional(),
  description: z.string().min(10, 'Cuéntanos un poco más sobre tu proyecto (mínimo 10 caracteres)'),
  notes: z.string().optional(),
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

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function QuoteForm() {
  const searchParams = useSearchParams()
  const referencia = searchParams.get('referencia')

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const topRef = useRef<HTMLDivElement>(null)

  // Anti-spam
  const honeypotRef = useRef<HTMLInputElement>(null)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileReset, setTurnstileReset] = useState(0)

  useEffect(() => {
    if (status === 'success') {
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [status])

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

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null
    setFileError('')
    setFile(null)
    setPreview(null)

    if (!selected) return

    if (!selected.type.startsWith('image/')) {
      setFileError('Solo se aceptan imágenes (JPG, PNG, WebP, HEIC).')
      e.target.value = ''
      return
    }
    if (selected.size > MAX_FILE_BYTES) {
      setFileError(`La imagen es demasiado grande. Máximo ${MAX_FILE_MB} MB.`)
      e.target.value = ''
      return
    }

    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  function removeFile() {
    setFile(null)
    setPreview(null)
    setFileError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onSubmit = async (data: FormValues) => {
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setStatus('error')
      setErrorMessage('Completa la verificación de seguridad antes de enviar.')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      const fd = new FormData()
      fd.append('name', data.name)
      fd.append('email', data.email)
      if (data.phone) fd.append('phone', data.phone)
      if (data.category) fd.append('category', data.category)
      fd.append('description', data.description)
      if (data.notes) fd.append('notes', data.notes)
      if (file) fd.append('file', file)
      // Honeypot: los humanos lo dejan vacío; los bots lo rellenan.
      fd.append('website', honeypotRef.current?.value ?? '')
      if (turnstileToken) fd.append('cf-turnstile-response', turnstileToken)

      const res = await fetch('/api/quotes', { method: 'POST', body: fd })

      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? 'Error al enviar')
      }

      setStatus('success')
      trackEvent('submit_quote_form', {
        category: data.category || 'unknown',
        has_image: Boolean(file),
      })
      reset()
      removeFile()
    } catch (err) {
      setStatus('error')
      const message = err instanceof Error ? err.message : 'Error inesperado'
      setErrorMessage(message)
      trackEvent('submit_quote_form_error', { reason: message })
    } finally {
      // El token de Turnstile es de un solo uso: lo limpiamos y pedimos uno nuevo.
      setTurnstileToken('')
      setTurnstileReset((n) => n + 1)
    }
  }

  if (status === 'success') {
    return (
      <div ref={topRef} className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-10 text-center">
        <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
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
          {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
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
          {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
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
          rows={4}
          placeholder="Describe tu proyecto: uso, cantidad de piezas, acabado, colores..."
          {...register('description')}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
        />
        {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>}
      </div>

      {/* Imagen de referencia */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1.5">
          Imagen de referencia
          <span className="ml-2 text-zinc-500 font-normal">(opcional · máx. {MAX_FILE_MB} MB)</span>
        </label>

        {!file ? (
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed border-zinc-700 hover:border-orange-500/50 rounded-xl py-8 px-4 cursor-pointer transition-colors group"
          >
            <svg className="w-8 h-8 text-zinc-600 group-hover:text-orange-500/60 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M3.75 3h16.5M12 3v9m0 0l-3-3m3 3l3-3" />
            </svg>
            <span className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors text-center">
              Toca para subir una foto<br />
              <span className="text-xs text-zinc-600">JPG, PNG, WebP, HEIC — fotos del celular bienvenidas</span>
            </span>
            <input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <div className="relative bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden">
            {preview && (
              <img
                src={preview}
                alt="Vista previa"
                className="w-full max-h-56 object-contain bg-zinc-900"
              />
            )}
            <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-700">
              <div className="flex items-center gap-2 min-w-0">
                <svg className="w-4 h-4 text-orange-400 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M1 5.25A2.25 2.25 0 013.25 3h13.5A2.25 2.25 0 0119 5.25v9.5A2.25 2.25 0 0116.75 17H3.25A2.25 2.25 0 011 14.75v-9.5zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 00.75-.75v-2.69l-2.22-2.219a.75.75 0 00-1.06 0l-1.91 1.909.47.47a.75.75 0 11-1.06 1.06L6.53 8.091a.75.75 0 00-1.06 0l-3 3v-.031zm9-3.81a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-zinc-300 truncate">{file.name}</span>
                <span className="text-xs text-zinc-500 shrink-0">{formatBytes(file.size)}</span>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="ml-3 text-zinc-500 hover:text-red-400 transition-colors shrink-0"
                aria-label="Quitar imagen"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {fileError && <p className="mt-1.5 text-sm text-red-400">{fileError}</p>}
      </div>

      {/* Notas / medidas */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-zinc-300 mb-1.5">
          Medidas y detalles de la imagen
          <span className="ml-2 text-zinc-500 font-normal">(opcional)</span>
        </label>
        <textarea
          id="notes"
          rows={3}
          placeholder="Ej: La pieza mide aprox. 8 cm de alto × 5 cm de ancho. En la imagen, la parte de arriba es la que más importa. Material preferido: PLA blanco."
          {...register('notes')}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
        />
      </div>

      {/* Honeypot anti-spam — invisible para humanos, tentador para bots */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
        <label htmlFor="website">No llenar este campo</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          ref={honeypotRef}
        />
      </div>

      {/* Verificación Turnstile (solo si hay site key configurada) */}
      {TURNSTILE_SITE_KEY && (
        <Turnstile
          siteKey={TURNSTILE_SITE_KEY}
          onVerify={setTurnstileToken}
          onExpire={() => setTurnstileToken('')}
          resetSignal={turnstileReset}
        />
      )}

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
        {status === 'loading' ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
            </svg>
            Enviando...
          </span>
        ) : 'Solicitar cotización gratuita'}
      </button>

      <p className="text-center text-xs text-zinc-500">
        Sin compromiso · Respondemos en menos de 24 horas · Operamos desde Playa del Carmen
      </p>
    </form>
  )
}
