import { NextRequest, NextResponse } from 'next/server'
import { createQuoteRequest } from '@/lib/strapi'
import { z } from 'zod'

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

    const result = await createQuoteRequest(parsed.data)

    return NextResponse.json({ success: true, id: result.id }, { status: 201 })
  } catch (err) {
    console.error('[/api/quotes]', err)
    return NextResponse.json(
      { error: 'Error interno. Intenta de nuevo o contáctanos por WhatsApp.' },
      { status: 500 }
    )
  }
}
