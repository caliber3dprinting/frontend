import { defineField, defineType } from 'sanity'

export const productType = defineType({
  name: 'product',
  title: 'Producto',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Descripción', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'material', title: 'Material', type: 'string' }),
    defineField({
      name: 'price',
      title: 'Precio desde (MXN)',
      description: 'Precio base opcional. Si se completa, habilita el rich result de oferta con precio en Google.',
      type: 'number',
      validation: (r) => r.min(0),
    }),
    defineField({ name: 'featured', title: 'Destacado', type: 'boolean', initialValue: false }),
    defineField({
      name: 'status',
      title: 'Estado',
      type: 'string',
      options: { list: ['draft', 'published'], layout: 'radio' },
      initialValue: 'published',
    }),
    defineField({ name: 'cover_image', title: 'Imagen principal', type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', type: 'string', title: 'Texto alternativo' })] }),
    defineField({ name: 'gallery', title: 'Galería', type: 'array', of: [{ type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Texto alternativo' }] }] }),
    defineField({
      name: 'categories',
      title: 'Categorías',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
    }),
  ],
})
