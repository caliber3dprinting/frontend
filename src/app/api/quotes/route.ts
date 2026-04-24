import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createQuoteRequest, uploadFileToStrapi } from '@/lib/strapi'
import { sendQuoteEmail } from '@/lib/mailer'

const MAX_FILE_SIZE = 15 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'image/gif']

const ALLOWED_CATEGORIES = [
  'Decoración del hogar',
  'Figuras y coleccionables',
  'Repuestos y funcional',
  'Joyería y accesorios',
  'Prototipos',
  'Otro',
] as const

const quoteSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido').max(100, 'Nombre demasiado largo'),
  email: z.string().email('Email inválido').max(254, 'Email inválido'),
  phone: z
    .string()
    .max(30, 'Teléfono inválido')
    .regex(/^[\d\s\+\-\(\)]*$/, 'Teléfono inválido')
    .optional()
    .or(z.literal('')),
  description: z.string().min(10, 'Cuéntanos un poco más sobre tu proyecto').max(5000, 'Descripción demasiado larga'),
  category: z.enum(ALLOWED_CATEGORIES).optional().or(z.literal('')),
  notes: z.string().max(2000, 'Notas demasiado largas').optional().or(z.literal('')),
})

// In-memory rate limiter: 5 requests per IP per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60_000
  const limit = 5

  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs })
    return false
  }

  if (entry.count >= limit) return true

  entry.count++
  return false
}

// Prevent excessively large rate limit maps from accumulating in memory
setInterval(() => {
  const now = Date.now()
  for (const [key, val] of rateLimitMap) {
    if (now > val.resetAt) rateLimitMap.delete(key)
  }
}, 5 * 60_000)

function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '_')
    .slice(0, 200)
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Espera un momento e intenta de nuevo.' },
      { status: 429 }
    )
  }

  try {
    const formData = await req.formData()

    const fields = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: (formData.get('phone') as string) || undefined,
      description: formData.get('description') as string,
      category: (formData.get('category') as string) || undefined,
      notes: (formData.get('notes') as string) || undefined,
    }

    const parsed = quoteSchema.safeParse(fields)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    let fileId: number | undefined
    const file = formData.get('file') as File | null
    if (file && file.size > 0) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: 'Formato de imagen no soportado. Usa JPG, PNG o WebP.' },
          { status: 400 }
        )
      }
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: 'La imagen no puede superar los 15 MB.' },
          { status: 400 }
        )
      }
      const safeFilename = sanitizeFilename(file.name)
      fileId = await uploadFileToStrapi(file, safeFilename)
    }

    const cleanData = {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || undefined,
      description: parsed.data.description,
      category: parsed.data.category || undefined,
      notes: parsed.data.notes || undefined,
    }

    const result = await createQuoteRequest({
      ...cleanData,
      ...(fileId !== undefined ? { file_reference: fileId } : {}),
    })

    try {
      await sendQuoteEmail({ ...cleanData, fileId })
    } catch (err) {
      console.warn('[/api/quotes] Email notification failed:', err)
    }

    return NextResponse.json({ success: true, id: result.id }, { status: 201 })
  } catch (err) {
    console.error('[/api/quotes]', err)
    return NextResponse.json(
      { error: 'Error al enviar la cotización. Intenta de nuevo o contáctanos por WhatsApp.' },
      { status: 500 }
    )
  }
}
