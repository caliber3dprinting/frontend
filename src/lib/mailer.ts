import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export interface QuoteEmailData {
  name: string
  email: string
  phone?: string
  category?: string
  description: string
}

export async function sendQuoteEmail(data: QuoteEmailData) {
  const { name, email, phone, category, description } = data

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
            <td style="padding: 10px 0; border-bottom: 1px solid #3f3f46; font-weight: 600;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #3f3f46; color: #a1a1aa; font-size: 13px;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #3f3f46;">
              <a href="mailto:${email}" style="color: #f97316; text-decoration: none;">${email}</a>
            </td>
          </tr>
          ${phone ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #3f3f46; color: #a1a1aa; font-size: 13px;">WhatsApp / Tel.</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #3f3f46;">
              <a href="https://wa.me/${phone.replace(/\D/g, '')}" style="color: #25D366; text-decoration: none;">${phone}</a>
            </td>
          </tr>` : ''}
          ${category ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #3f3f46; color: #a1a1aa; font-size: 13px;">Tipo de proyecto</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #3f3f46;">${category}</td>
          </tr>` : ''}
        </table>

        <div style="margin-top: 24px;">
          <p style="color: #a1a1aa; font-size: 13px; margin: 0 0 8px;">Descripción del proyecto</p>
          <div style="background: #27272a; border-radius: 8px; padding: 16px; line-height: 1.7; white-space: pre-wrap;">${description}</div>
        </div>

        <div style="margin-top: 28px; display: flex; gap: 12px;">
          <a href="mailto:${email}?subject=Re: Cotización Caliber 3D"
             style="display: inline-block; background: #f97316; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
            Responder por email
          </a>
          ${phone ? `
          <a href="https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${name}, te contactamos de Caliber 3D sobre tu cotización.`)}"
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

  await transporter.sendMail({
    from: `"Caliber 3D" <${process.env.GMAIL_USER}>`,
    to: process.env.QUOTE_RECIPIENT ?? 'caliber3dprinting@gmail.com',
    replyTo: email,
    subject: `Nueva cotización de ${name}${category ? ` — ${category}` : ''}`,
    html,
  })
}
