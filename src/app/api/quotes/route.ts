import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendQuoteEmail } from '@/lib/mailer'
import { createQuoteRequest } from '@/lib/strapi'

const quoteSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  description: z.string().min(10, 'Cuéntanos un poco más sobre tu proyecto'),
  category: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = quoteSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    // Email es la acción principal — si falla, devolvemos error
    await sendQuoteEmail(parsed.data)

    // Guardado en Strapi es opcional — no bloquea la respuesta
    createQuoteRequest(parsed.data).catch((err) =>
      console.warn('[/api/quotes] Strapi save failed (non-critical):', err)
    )

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('[/api/quotes]', err)
    return NextResponse.json(
      { error: 'Error al enviar la cotización. Intenta de nuevo o contáctanos por WhatsApp.' },
      { status: 500 }
    )
  }
}
