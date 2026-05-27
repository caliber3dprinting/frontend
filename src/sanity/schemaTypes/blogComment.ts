import { defineField, defineType } from 'sanity'

export const blogCommentType = defineType({
  name: 'blogComment',
  title: 'Comentario de Blog',
  type: 'document',
  fields: [
    defineField({ name: 'clerkUserId',  title: 'Clerk User ID',    type: 'string', readOnly: true }),
    defineField({ name: 'authorName',   title: 'Nombre del autor', type: 'string', readOnly: true, validation: (r) => r.required() }),
    defineField({ name: 'authorEmail',  title: 'Email del autor',  type: 'string', readOnly: true }),
    defineField({ name: 'authorAvatar', title: 'Avatar URL',       type: 'url',    readOnly: true }),
    defineField({
      name: 'content',
      title: 'Comentario',
      type: 'text',
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'post',
      title: 'Post de blog',
      type: 'reference',
      to: [{ type: 'blogPost' }],
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
      title:    'authorName',
      subtitle: 'content',
      status:   'status',
    },
    prepare({ title, subtitle, status }) {
      const icon = status === 'approved' ? '✅' : status === 'rejected' ? '❌' : '⏳'
      return { title: `${icon} ${title}`, subtitle }
    },
  },
})
