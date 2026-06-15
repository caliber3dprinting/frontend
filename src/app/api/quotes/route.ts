import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendQuoteEmail } from '@/lib/mailer'
import { client } from '@/sanity/lib/client'

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

// Verifica el token de Cloudflare Turnstile contra el endpoint de siteverify.
// Si TURNSTILE_SECRET_KEY no está configurado, se omite (degradación elegante)
// para no romper el formulario antes de cargar las llaves en producción.
async function verifyTurnstile(token: string | null, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    console.warn('[/api/quotes] TURNSTILE_SECRET_KEY no configurado — verificación omitida')
    return true
  }
  if (!token) return false

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    })
    const data = (await res.json()) as { success?: boolean }
    return data.success === true
  } catch (err) {
    console.error('[/api/quotes] Turnstile verify failed:', err)
    return false
  }
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

    // Honeypot: si el campo trampa viene con contenido, es un bot. Respondemos
    // con éxito falso para no darle pistas, sin enviar email ni guardar nada.
    const honeypot = formData.get('website')
    if (typeof honeypot === 'string' && honeypot.trim() !== '') {
      return NextResponse.json({ success: true }, { status: 201 })
    }

    // Verificación Turnstile
    const turnstileToken = formData.get('cf-turnstile-response')
    const isHuman = await verifyTurnstile(
      typeof turnstileToken === 'string' ? turnstileToken : null,
      ip
    )
    if (!isHuman) {
      return NextResponse.json(
        { error: 'No pudimos verificar que no eres un robot. Recarga la página e intenta de nuevo.' },
        { status: 403 }
      )
    }

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

    let attachment: { filename: string; content: Buffer; contentType: string } | undefined
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
      const buffer = Buffer.from(await file.arrayBuffer())
      attachment = { filename: sanitizeFilename(file.name), content: buffer, contentType: file.type }
    }

    const cleanData = {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || undefined,
      description: parsed.data.description,
      category: parsed.data.category || undefined,
      notes: parsed.data.notes || undefined,
    }

    await Promise.allSettled([
      sendQuoteEmail({ ...cleanData, attachment }).catch((err) =>
        console.warn('[/api/quotes] Email failed:', err)
      ),
      client.create({
        _type: 'quote',
        ...cleanData,
        submittedAt: new Date().toISOString(),
        status: 'new',
      }).catch((err) => console.warn('[/api/quotes] Sanity write failed:', err)),
    ])

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('[/api/quotes]', err)
    return NextResponse.json(
      { error: 'Error al enviar la cotización. Intenta de nuevo o contáctanos por WhatsApp.' },
      { status: 500 }
    )
  }
}
