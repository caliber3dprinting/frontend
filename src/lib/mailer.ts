function h(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
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
