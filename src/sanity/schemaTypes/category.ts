import { defineField, defineType } from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Categoría',
  type: 'document',
  fields: [
    defineField({
      name: 'categoryType',
      title: 'Tipo',
      type: 'string',
      options: {
        list: [
          { title: 'Producto', value: 'product' },
          { title: 'Blog', value: 'blog' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'name', title: 'Nombre', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' }, validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 2 }),
    defineField({ name: 'icon', title: 'Ícono (emoji o nombre)', type: 'string' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'categoryType' },
    prepare: ({ title, subtitle }) => ({
      title,
      subtitle: subtitle === 'product' ? 'Producto' : subtitle === 'blog' ? 'Blog' : '',
    }),
  },
})
