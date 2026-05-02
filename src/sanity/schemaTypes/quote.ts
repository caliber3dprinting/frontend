import { defineField, defineType } from 'sanity'

export const quoteType = defineType({
  name: 'quote',
  title: 'Cotización',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nombre', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'phone', title: 'Teléfono', type: 'string' }),
    defineField({ name: 'description', title: 'Descripción', type: 'text' }),
    defineField({ name: 'category', title: 'Categoría', type: 'string' }),
    defineField({ name: 'notes', title: 'Notas adicionales', type: 'text' }),
    defineField({
      name: 'status',
      title: 'Estado',
      type: 'string',
      initialValue: 'new',
      options: {
        list: [
          { title: 'Nueva', value: 'new' },
          { title: 'En revisión', value: 'reviewing' },
          { title: 'Presupuestada', value: 'quoted' },
          { title: 'Cerrada', value: 'closed' },
        ],
      },
    }),
    defineField({ name: 'submittedAt', title: 'Fecha de envío', type: 'datetime' }),
  ],
  orderings: [{ title: 'Más recientes', name: 'dateDesc', by: [{ field: 'submittedAt', direction: 'desc' }] }],
  preview: {
    select: { title: 'name', subtitle: 'email', status: 'status' },
    prepare({ title, subtitle }) {
      return { title, subtitle }
    },
  },
})
