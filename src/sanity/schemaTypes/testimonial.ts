import { defineField, defineType } from 'sanity'

export const testimonialType = defineType({
  name: 'testimonial',
  title: 'Testimonio',
  type: 'document',
  fields: [
    defineField({ name: 'author_name', title: 'Nombre del autor', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'author_city', title: 'Ciudad', type: 'string' }),
    defineField({ name: 'content', title: 'Contenido', type: 'text', rows: 4, validation: (r) => r.required() }),
    defineField({ name: 'rating', title: 'Puntuación (1-5)', type: 'number', validation: (r) => r.required().min(1).max(5) }),
    defineField({ name: 'product', title: 'Producto relacionado', type: 'reference', to: [{ type: 'product' }] }),
  ],
})
