import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { z } from 'zod'
import { client } from '@/sanity/lib/client'
import { sendNewCommentEmail } from '@/lib/mailer'
import type { BlogComment } from '@/lib/types'

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

const commentSchema = z.object({
  content:  z.string().min(3, 'El comentario es muy corto').max(2000, 'Máximo 2000 caracteres'),
  postId:   z.string().min(1, 'Post requerido'),
  postSlug: z.string().min(1),
  postTitle: z.string().min(1),
})

// ─── GET — approved comments for a post ──────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const postSlug = searchParams.get('postSlug')

  if (!postSlug) {
    return NextResponse.json({ error: 'postSlug requerido' }, { status: 400 })
  }

  try {
    const comments = await client.fetch<BlogComment[]>(
      `*[_type == "blogComment" && post->slug.current == $postSlug && status == "approved"]
       | order(_createdAt asc) {
         "id": _id,
         clerkUserId,
         authorName,
         authorAvatar,
         content,
         "createdAt": _createdAt
       }`,
      { postSlug },
      { cache: 'no-store' }
    )
    return NextResponse.json(comments)
  } catch (err) {
    console.error('[/api/comments GET]', err)
    return NextResponse.json({ error: 'Error al obtener comentarios' }, { status: 500 })
  }
}

// ─── POST — create comment ────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Auth check
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Debes iniciar sesión para comentar' }, { status: 401 })
  }

  // Rate limit por userId
  if (isRateLimited(userId)) {
    return NextResponse.json(
      { error: 'Demasiados comentarios. Esperá un minuto.' },
      { status: 429 }
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const parsed = commentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { content, postId, postSlug, postTitle } = parsed.data

  // Get user info from Clerk
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 401 })
  }

  const authorName   = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.username || 'Usuario'
  const authorEmail  = user.emailAddresses[0]?.emailAddress ?? ''
  const authorAvatar = user.imageUrl ?? undefined

  // Check for duplicate (same user, same post, pending or approved)
  const existing = await client.fetch<{ _id: string }[]>(
    `*[_type == "blogComment" && clerkUserId == $userId && post._ref == $postId && status in ["pending","approved"]][0..0]{ _id }`,
    { userId, postId }
  )

  if (existing.length > 0) {
    return NextResponse.json(
      { error: 'Ya tenés un comentario en este artículo. Esperá a que sea aprobado.' },
      { status: 409 }
    )
  }

  try {
    await client.create({
      _type: 'blogComment',
      clerkUserId: userId,
      authorName,
      authorEmail,
      authorAvatar,
      content,
      post: { _type: 'reference', _ref: postId },
      status: 'pending',
    })

    // Email notification (fire-and-forget)
    sendNewCommentEmail({
      authorName,
      authorEmail,
      authorAvatar,
      content,
      postTitle,
      postSlug,
    }).catch((err) => console.warn('[/api/comments] Email failed:', err))

    return NextResponse.json(
      { success: true, message: 'Tu comentario está pendiente de moderación. ¡Gracias!' },
      { status: 201 }
    )
  } catch (err) {
    console.error('[/api/comments POST]', err)
    return NextResponse.json({ error: 'Error al guardar el comentario' }, { status: 500 })
  }
}
