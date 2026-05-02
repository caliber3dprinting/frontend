import { defineField, defineType } from 'sanity'

export const globalConfigType = defineType({
  name: 'globalConfig',
  title: 'Configuración Global',
  type: 'document',
  fields: [
    defineField({ name: 'whatsapp_number', title: 'Número de WhatsApp', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'contact_email', title: 'Email de contacto', type: 'string' }),
    defineField({ name: 'instagram_url', title: 'URL de Instagram', type: 'url' }),
    defineField({ name: 'facebook_url', title: 'URL de Facebook', type: 'url' }),
    defineField({ name: 'tiktok_url', title: 'URL de TikTok', type: 'url' }),
    defineField({ name: 'business_hours', title: 'Horario de atención', type: 'string' }),
    defineField({ name: 'address', title: 'Dirección', type: 'string' }),
  ],
  preview: { select: { title: 'whatsapp_number' }, prepare: () => ({ title: 'Configuración Global' }) },
})
