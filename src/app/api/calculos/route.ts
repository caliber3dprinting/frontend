import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { client } from '@/sanity/lib/client'

const calculoSchema = z.object({
  nombrePieza: z.string().min(1, 'El nombre es requerido').max(200),
  resultado: z.number().min(0),
  costoBase: z.number().min(0),
  peso: z.number().min(0),
  costoFilamento: z.number().min(0),
  tiempo: z.number().min(0),
  consumo: z.number().min(0),
  costoKwh: z.number().min(0),
  costoMaquina: z.number().min(0),
  vidaUtil: z.number().min(0),
  postProcesado: z.number().min(0),
  valorHora: z.number().min(0),
  tasaFallos: z.number().min(0).max(100),
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

  const parsed = calculoSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  try {
    await client.create({
      _type: 'calculo',
      userId,
      ...parsed.data,
      creadoEn: new Date().toISOString(),
    })
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('[/api/calculos POST]', err)
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
      `*[_type == "calculo" && userId == $userId] | order(creadoEn desc) {
        _id, nombrePieza, resultado, costoBase, creadoEn
      }`,
      { userId },
      { cache: 'no-store' }
    )
    return NextResponse.json(data)
  } catch (err) {
    console.error('[/api/calculos GET]', err)
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 })
  }
}
