import { defineField, defineType } from 'sanity'

export const productReviewType = defineType({
  name: 'productReview',
  title: 'Reseña de Producto',
  type: 'document',
  fields: [
    defineField({ name: 'clerkUserId',  title: 'Clerk User ID',    type: 'string', readOnly: true }),
    defineField({ name: 'authorName',   title: 'Nombre del autor', type: 'string', readOnly: true, validation: (r) => r.required() }),
    defineField({ name: 'authorEmail',  title: 'Email del autor',  type: 'string', readOnly: true }),
    defineField({ name: 'authorAvatar', title: 'Avatar URL',       type: 'url',    readOnly: true }),
    defineField({
      name: 'rating',
      title: 'Puntuación (1-5)',
      type: 'number',
      validation: (r) => r.required().min(1).max(5),
    }),
    defineField({
      name: 'content',
      title: 'Reseña (opcional)',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'product',
      title: 'Producto',
      type: 'reference',
      to: [{ type: 'product' }],
      readOnly: true,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'status',
      title: 'Estado',
      type: 'string',
      options: {
        list: [
          { title: 'Pendiente', value: 'pending' },
          { title: 'Aprobado',  value: 'approved' },
          { title: 'Rechazado', value: 'rejected' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: {
      title:       'authorName',
      subtitle:    'content',
      rating:      'rating',
      status:      'status',
      productName: 'product.title',
    },
    prepare({ title, rating, status, productName }) {
      const stars = '⭐'.repeat(rating ?? 0)
      const icon  = status === 'approved' ? '✅' : status === 'rejected' ? '❌' : '⏳'
      return {
        title:    `${icon} ${title} — ${stars}`,
        subtitle: productName ?? '',
      }
    },
  },
})
