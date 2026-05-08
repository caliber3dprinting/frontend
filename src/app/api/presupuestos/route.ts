import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { client } from '@/sanity/lib/client'

const accesorioSchema = z.object({
  nombre: z.string().max(100),
  costo: z.number().min(0),
})

const piezaSchema = z.object({
  nombre: z.string().max(200),
  precioPieza: z.number().min(0),
  cantidad: z.number().int().min(1),
  manoDeObra: z.number().min(0),
  mostrarManoDeObra: z.boolean(),
})

const presupuestoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').max(200),
  cliente: z.string().max(200).optional().or(z.literal('')),
  piezas: z.array(piezaSchema).min(1).max(20),
  accesorios: z.array(accesorioSchema).max(20),
  totalConAccesorios: z.number().min(0),
  marcaNegocio: z.string().max(200).optional().or(z.literal('')),
  telefono: z.string().max(50).optional().or(z.literal('')),
  emailContacto: z.string().max(254).optional().or(z.literal('')),
})

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const parsed = presupuestoSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  try {
    await client.create({
      _type: 'presupuesto',
      userId,
      ...parsed.data,
      creadoEn: new Date().toISOString(),
    })
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('[/api/presupuestos POST]', err)
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
  }
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const data = await client.fetch(
      `*[_type == "presupuesto" && userId == $userId] | order(creadoEn desc) {
        _id, nombre, cliente, totalConAccesorios, creadoEn,
        piezas[]{ nombre, cantidad }
      }`,
      { userId },
      { cache: 'no-store' }
    )
    return NextResponse.json(data)
  } catch (err) {
    console.error('[/api/presupuestos GET]', err)
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 })
  }
}
