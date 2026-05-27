function h(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// ─── Shared send helper ───────────────────────────────────────────────────────

async function sendEmail(payload: Record<string, unknown>) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('RESEND_API_KEY no configurado')

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM ?? 'Caliber 3D <onboarding@resend.dev>',
      to: [process.env.QUOTE_RECIPIENT ?? 'caliber.3dprinting@gmail.com'],
      ...payload,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Resend error ${res.status}: ${err}`)
  }
}

// ─── New-user notification ────────────────────────────────────────────────────

export interface NewUserData {
  name: string
  email: string
  avatarUrl?: string
}

export async function sendNewUserEmail(data: NewUserData) {
  const { name, email, avatarUrl } = data

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #18181b; color: #fafafa; border-radius: 12px; overflow: hidden;">
      <div style="background: #f97316; padding: 24px 32px;">
        <h1 style="margin: 0; font-size: 22px; color: #fff;">🎉 Nuevo usuario registrado</h1>
        <p style="margin: 4px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">Caliber 3D — Playa del Carmen</p>
      </div>
      <div style="padding: 32px;">
        ${avatarUrl ? `<img src="${h(avatarUrl)}" alt="Avatar" style="width:64px;height:64px;border-radius:50%;object-fit:cover;margin-bottom:16px;" />` : ''}
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #3f3f46; color: #a1a1aa; font-size: 13px; width: 120px;">Nombre</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #3f3f46; font-weight: 600;">${h(name)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #a1a1aa; font-size: 13px;">Email</td>
            <td style="padding: 10px 0;"><a href="mailto:${h(email)}" style="color: #f97316; text-decoration: none;">${h(email)}</a></td>
          </tr>
        </table>
      </div>
      <div style="padding: 16px 32px; background: #27272a; font-size: 12px; color: #71717a; text-align: center;">
        Caliber 3D · Playa del Carmen · caliber3dprinting@gmail.com
      </div>
    </div>
  `

  await sendEmail({
    reply_to: email,
    subject: `Nuevo usuario: ${name}`,
    html,
  })
}

// ─── New-comment notification ─────────────────────────────────────────────────

export interface NewCommentData {
  authorName: string
  authorEmail: string
  authorAvatar?: string
  content: string
  postTitle: string
  postSlug: string
}

export async function sendNewCommentEmail(data: NewCommentData) {
  const { authorName, authorEmail, authorAvatar, content, postTitle, postSlug } = data
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://caliber3d.mx'

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #18181b; color: #fafafa; border-radius: 12px; overflow: hidden;">
      <div style="background: #3b82f6; padding: 24px 32px;">
        <h1 style="margin: 0; font-size: 22px; color: #fff;">💬 Nuevo comentario en el blog</h1>
        <p style="margin: 4px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">Pendiente de moderación</p>
      </div>
      <div style="padding: 32px;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
          ${authorAvatar
            ? `<img src="${h(authorAvatar)}" alt="Avatar" style="width:48px;height:48px;border-radius:50%;object-fit:cover;" />`
            : `<div style="width:48px;height:48px;border-radius:50%;background:#3b82f6;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;color:#fff;">${h(authorName.charAt(0).toUpperCase())}</div>`
          }
          <div>
            <div style="font-weight:600;">${h(authorName)}</div>
            <div style="color:#a1a1aa;font-size:13px;">${h(authorEmail)}</div>
          </div>
        </div>

        <div style="background:#27272a;border-radius:8px;padding:16px;line-height:1.7;margin-bottom:20px;border-left:3px solid #3b82f6;">
          ${h(content)}
        </div>

        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #3f3f46;color:#a1a1aa;font-size:13px;width:120px;">Post</td>
            <td style="padding:8px 0;border-bottom:1px solid #3f3f46;">
              <a href="${siteUrl}/blog/${h(postSlug)}" style="color:#f97316;text-decoration:none;">${h(postTitle)}</a>
            </td>
          </tr>
        </table>

        <div style="margin-top:24px;">
          <a href="${siteUrl}/studio/structure/blogComment"
             style="display:inline-block;background:#3b82f6;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
            Moderar en Sanity Studio
          </a>
        </div>
      </div>
      <div style="padding:16px 32px;background:#27272a;font-size:12px;color:#71717a;text-align:center;">
        Caliber 3D · Playa del Carmen · caliber3dprinting@gmail.com
      </div>
    </div>
  `

  await sendEmail({
    reply_to: authorEmail,
    subject: `Nuevo comentario de ${authorName} en "${postTitle}"`,
    html,
  })
}

// ─── New-review notification ──────────────────────────────────────────────────

export interface NewReviewData {
  authorName: string
  authorEmail: string
  authorAvatar?: string
  rating: number
  content?: string
  productTitle: string
  productSlug: string
}

export async function sendNewReviewEmail(data: NewReviewData) {
  const { authorName, authorEmail, authorAvatar, rating, content, productTitle, productSlug } = data
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://caliber3d.mx'
  const stars = '⭐'.repeat(rating)

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #18181b; color: #fafafa; border-radius: 12px; overflow: hidden;">
      <div style="background: #f97316; padding: 24px 32px;">
        <h1 style="margin: 0; font-size: 22px; color: #fff;">⭐ Nueva reseña de producto</h1>
        <p style="margin: 4px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">Pendiente de moderación</p>
      </div>
      <div style="padding: 32px;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
          ${authorAvatar
            ? `<img src="${h(authorAvatar)}" alt="Avatar" style="width:48px;height:48px;border-radius:50%;object-fit:cover;" />`
            : `<div style="width:48px;height:48px;border-radius:50%;background:#f97316;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;color:#fff;">${h(authorName.charAt(0).toUpperCase())}</div>`
          }
          <div>
            <div style="font-weight:600;">${h(authorName)}</div>
            <div style="color:#a1a1aa;font-size:13px;">${h(authorEmail)}</div>
          </div>
        </div>

        <div style="font-size:24px;margin-bottom:16px;">${stars} <span style="font-size:16px;color:#a1a1aa;">(${rating}/5)</span></div>

        ${content ? `
        <div style="background:#27272a;border-radius:8px;padding:16px;line-height:1.7;margin-bottom:20px;border-left:3px solid #f97316;">
          ${h(content)}
        </div>` : '<p style="color:#71717a;font-style:italic;margin-bottom:20px;">Sin texto adicional</p>'}

        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #3f3f46;color:#a1a1aa;font-size:13px;width:120px;">Producto</td>
            <td style="padding:8px 0;border-bottom:1px solid #3f3f46;">
              <a href="${siteUrl}/catalogo/${h(productSlug)}" style="color:#f97316;text-decoration:none;">${h(productTitle)}</a>
            </td>
          </tr>
        </table>

        <div style="margin-top:24px;">
          <a href="${siteUrl}/studio/structure/productReview"
             style="display:inline-block;background:#f97316;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
            Moderar en Sanity Studio
          </a>
        </div>
      </div>
      <div style="padding:16px 32px;background:#27272a;font-size:12px;color:#71717a;text-align:center;">
        Caliber 3D · Playa del Carmen · caliber3dprinting@gmail.com
      </div>
    </div>
  `

  await sendEmail({
    reply_to: authorEmail,
    subject: `Nueva reseña ${stars} de ${authorName} en "${productTitle}"`,
    html,
  })
}

export interface QuoteEmailData {
  name: string
  email: string
  phone?: string
  category?: string
  description: string
  notes?: string
  attachment?: { filename: string; content: Buffer; contentType: string }
}

export async function sendQuoteEmail(data: QuoteEmailData) {
  const { name, email, phone, category, description, notes, attachment } = data

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('RESEND_API_KEY no configurado')

  const safePhone = phone ? phone.replace(/\D/g, '') : ''

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #18181b; color: #fafafa; border-radius: 12px; overflow: hidden;">
      <div style="background: #f97316; padding: 24px 32px;">
        <h1 style="margin: 0; font-size: 22px; color: #fff;">Nueva solicitud de cotización</h1>
        <p style="margin: 4px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">Caliber 3D — Playa del Carmen</p>
      </div>

      <div style="padding: 32px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #3f3f46; color: #a1a1aa; font-size: 13px; width: 140px;">Nombre</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #3f3f46; font-weight: 600;">${h(name)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #3f3f46; color: #a1a1aa; font-size: 13px;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #3f3f46;">
              <a href="mailto:${h(email)}" style="color: #f97316; text-decoration: none;">${h(email)}</a>
            </td>
          </tr>
          ${phone ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #3f3f46; color: #a1a1aa; font-size: 13px;">WhatsApp / Tel.</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #3f3f46;">
              <a href="https://wa.me/${safePhone}" style="color: #25D366; text-decoration: none;">${h(phone)}</a>
            </td>
          </tr>` : ''}
          ${category ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #3f3f46; color: #a1a1aa; font-size: 13px;">Tipo de proyecto</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #3f3f46;">${h(category)}</td>
          </tr>` : ''}
        </table>

        <div style="margin-top: 24px;">
          <p style="color: #a1a1aa; font-size: 13px; margin: 0 0 8px;">Descripción del proyecto</p>
          <div style="background: #27272a; border-radius: 8px; padding: 16px; line-height: 1.7; white-space: pre-wrap;">${h(description)}</div>
        </div>

        ${notes ? `
        <div style="margin-top: 20px;">
          <p style="color: #a1a1aa; font-size: 13px; margin: 0 0 8px;">Notas / Medidas de referencia</p>
          <div style="background: #27272a; border-radius: 8px; padding: 16px; line-height: 1.7; white-space: pre-wrap;">${h(notes)}</div>
        </div>` : ''}

        ${attachment ? `
        <div style="margin-top: 20px;">
          <p style="color: #a1a1aa; font-size: 13px; margin: 0 0 8px;">Imagen de referencia</p>
          <p style="color: #71717a; font-size: 12px; margin: 0;">Ver adjunto: ${h(attachment.filename)}</p>
        </div>` : ''}

        <div style="margin-top: 28px;">
          <a href="mailto:${h(email)}?subject=Re: Cotizaci%C3%B3n Caliber 3D"
             style="display: inline-block; background: #f97316; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin-right: 12px;">
            Responder por email
          </a>
          ${phone ? `
          <a href="https://wa.me/${safePhone}?text=${encodeURIComponent(`Hola ${name}, te contactamos de Caliber 3D sobre tu cotización.`)}"
             style="display: inline-block; background: #25D366; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
            Responder por WhatsApp
          </a>` : ''}
        </div>
      </div>

      <div style="padding: 16px 32px; background: #27272a; font-size: 12px; color: #71717a; text-align: center;">
        Caliber 3D · Playa del Carmen, Quintana Roo · caliber3dprinting@gmail.com
      </div>
    </div>
  `

  const payload: Record<string, unknown> = {
    from: process.env.RESEND_FROM ?? 'Caliber 3D <onboarding@resend.dev>',
    to: [process.env.QUOTE_RECIPIENT ?? 'caliber.3dprinting@gmail.com'],
    reply_to: email,
    subject: `Nueva cotización de ${name}${category ? ` — ${category}` : ''}`,
    html,
  }

  if (attachment) {
    payload.attachments = [
      {
        filename: attachment.filename,
        content: attachment.content.toString('base64'),
        content_type: attachment.contentType,
      },
    ]
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Resend error ${res.status}: ${err}`)
  }
}
