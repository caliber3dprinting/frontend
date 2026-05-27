import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { z } from 'zod'
import { client } from '@/sanity/lib/client'
import { sendNewReviewEmail } from '@/lib/mailer'
import type { ProductReview } from '@/lib/types'

// ─── Rate limit ───────────────────────────────────────────────────────────────

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(key: string): boolean {
  const now = Date.now()
  const windowMs = 60_000
  const limit = 3
  const entry = rateLimitMap.get(key)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs })
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

// ─── Validation ───────────────────────────────────────────────────────────────

const reviewSchema = z.object({
  rating:       z.number().int().min(1).max(5),
  content:      z.string().max(2000, 'Máximo 2000 caracteres').optional().or(z.literal('')),
  productId:    z.string().min(1, 'Producto requerido'),
  productSlug:  z.string().min(1),
  productTitle: z.string().min(1),
})

// ─── GET — approved reviews for a product ────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const productSlug = searchParams.get('productSlug')

  if (!productSlug) {
    return NextResponse.json({ error: 'productSlug requerido' }, { status: 400 })
  }

  try {
    const reviews = await client.fetch<ProductReview[]>(
      `*[_type == "productReview" && product->slug.current == $productSlug && status == "approved"]
       | order(_createdAt desc) {
         "id": _id,
         clerkUserId,
         authorName,
         authorAvatar,
         rating,
         content,
         "createdAt": _createdAt
       }`,
      { productSlug },
      { cache: 'no-store' }
    )
    return NextResponse.json(reviews)
  } catch (err) {
    console.error('[/api/reviews GET]', err)
    return NextResponse.json({ error: 'Error al obtener reseñas' }, { status: 500 })
  }
}

// ─── POST — create review ─────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Auth check
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Debes iniciar sesión para dejar una reseña' }, { status: 401 })
  }

  // Rate limit por userId
  if (isRateLimited(userId)) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Esperá un minuto.' },
      { status: 429 }
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const parsed = reviewSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { rating, content, productId, productSlug, productTitle } = parsed.data

  // Get user info from Clerk
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 401 })
  }

  const authorName   = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.username || 'Usuario'
  const authorEmail  = user.emailAddresses[0]?.emailAddress ?? ''
  const authorAvatar = user.imageUrl ?? undefined

  // One review per user per product
  const existing = await client.fetch<{ _id: string }[]>(
    `*[_type == "productReview" && clerkUserId == $userId && product._ref == $productId && status in ["pending","approved"]][0..0]{ _id }`,
    { userId, productId }
  )

  if (existing.length > 0) {
    return NextResponse.json(
      { error: 'Ya enviaste una reseña para este producto.' },
      { status: 409 }
    )
  }

  try {
    await client.create({
      _type: 'productReview',
      clerkUserId: userId,
      authorName,
      authorEmail,
      authorAvatar,
      rating,
      content: content || undefined,
      product: { _type: 'reference', _ref: productId },
      status: 'pending',
    })

    // Email notification (fire-and-forget)
    sendNewReviewEmail({
      authorName,
      authorEmail,
      authorAvatar,
      rating,
      content: content || undefined,
      productTitle,
      productSlug,
    }).catch((err) => console.warn('[/api/reviews] Email failed:', err))

    return NextResponse.json(
      { success: true, message: 'Tu reseña está pendiente de moderación. ¡Gracias!' },
      { status: 201 }
    )
  } catch (err) {
    console.error('[/api/reviews POST]', err)
    return NextResponse.json({ error: 'Error al guardar la reseña' }, { status: 500 })
  }
}
