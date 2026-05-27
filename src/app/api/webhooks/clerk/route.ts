/**
 * Clerk webhook — notifica al admin cuando se registra un nuevo usuario.
 *
 * Setup:
 *  1. En el Clerk Dashboard → Webhooks → Add Endpoint
 *     URL: https://caliber3d.mx/api/webhooks/clerk
 *     Events: user.created
 *  2. Copiar el "Signing Secret" del webhook y pegarlo en .env:
 *     CLERK_WEBHOOK_SECRET=whsec_xxxxx
 */

import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { sendNewUserEmail } from '@/lib/mailer'

interface ClerkUserEvent {
  type: string
  data: {
    id: string
    first_name: string | null
    last_name: string | null
    image_url: string | null
    email_addresses: Array<{ email_address: string; verification: { status: string } | null }>
  }
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('[clerk-webhook] CLERK_WEBHOOK_SECRET no configurado')
    return NextResponse.json({ error: 'Webhook secret missing' }, { status: 500 })
  }

  // Read raw body and headers
  const body = await req.text()
  const headersList = await headers()
  const svixId        = headersList.get('svix-id')
  const svixTimestamp = headersList.get('svix-timestamp')
  const svixSignature = headersList.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
  }

  // Verify signature
  const wh = new Webhook(webhookSecret)
  let event: ClerkUserEvent

  try {
    event = wh.verify(body, {
      'svix-id':        svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as ClerkUserEvent
  } catch (err) {
    console.error('[clerk-webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Only handle user.created
  if (event.type !== 'user.created') {
    return NextResponse.json({ received: true })
  }

  const { first_name, last_name, image_url, email_addresses } = event.data

  const name  = `${first_name ?? ''} ${last_name ?? ''}`.trim() || 'Nuevo usuario'
  const email = email_addresses.find((e) => e.verification?.status === 'verified')?.email_address
             ?? email_addresses[0]?.email_address
             ?? ''

  if (!email) {
    return NextResponse.json({ received: true })
  }

  sendNewUserEmail({
    name,
    email,
    avatarUrl: image_url ?? undefined,
  }).catch((err) => console.warn('[clerk-webhook] Email failed:', err))

  return NextResponse.json({ received: true })
}
