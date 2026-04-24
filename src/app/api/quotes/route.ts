import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createQuoteRequest, uploadFileToStrapi } from '@/lib/strapi'
import { sendQuoteEmail } from '@/lib/mailer'

const MAX_FILE_SIZE = 15 * 1024 * 1024 // 15 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'image/gif']

const quoteSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  description: z.string().min(10, 'Cuéntanos un poco más sobre tu proyecto'),
  category: z.string().optional(),
  notes: z.string().optional(),
})

export async function POST(req: NextRequest) {
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

    // Validar y subir imagen si viene
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
      fileId = await uploadFileToStrapi(file, file.name)
    }

    // Guardar en Strapi (primario)
    const result = await createQuoteRequest({
      ...parsed.data,
      ...(fileId !== undefined ? { file_reference: fileId } : {}),
    })

    // Email de notificación — awaited para que no lo corte Netlify al cerrar la función
    try {
      await sendQuoteEmail({ ...parsed.data, fileId })
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
