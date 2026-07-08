import { defineField, defineType } from 'sanity'

export const blogPostType = defineType({
  name: 'blogPost',
  title: 'Post del Blog',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'excerpt', title: 'Resumen', type: 'text', rows: 3, validation: (r) => r.required() }),
    defineField({ name: 'content', title: 'Contenido', type: 'array', of: [{ type: 'block' }, { type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Texto alternativo' }, { name: 'caption', type: 'string', title: 'Leyenda' }] }, { type: 'answerBox' }] }),
    defineField({ name: 'cover_image', title: 'Imagen de portada', type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', type: 'string', title: 'Texto alternativo' })] }),
    defineField({ name: 'categories', title: 'Categorías', type: 'array', of: [{ type: 'reference', to: [{ type: 'category' }] }] }),
    defineField({ name: 'author', title: 'Autor', type: 'string' }),
    defineField({ name: 'reading_time', title: 'Tiempo de lectura (min)', type: 'number' }),
    defineField({ name: 'publishedAt', title: 'Fecha de publicación', type: 'datetime' }),
    defineField({ name: 'meta_title', title: 'Meta título (SEO)', type: 'string' }),
    defineField({ name: 'meta_description', title: 'Meta descripción (SEO)', type: 'text', rows: 2 }),
    defineField({
      name: 'faq',
      title: 'Preguntas frecuentes (FAQ Schema)',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'faqItem',
          title: 'Pregunta',
          fields: [
            defineField({ name: 'question', title: 'Pregunta', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'answer', title: 'Respuesta', type: 'text', rows: 3, validation: (r) => r.required() }),
          ],
          preview: { select: { title: 'question', subtitle: 'answer' } },
        },
      ],
    }),
  ],
  orderings: [{ title: 'Más reciente', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
})
