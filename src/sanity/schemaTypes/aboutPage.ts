import { defineField, defineType } from 'sanity'

export const aboutPageType = defineType({
  name: 'aboutPage',
  title: 'Página "Sobre Nosotros"',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'story', title: 'Historia', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'team_photo', title: 'Foto del equipo', type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', type: 'string', title: 'Texto alternativo' })] }),
    defineField({ name: 'team_caption', title: 'Leyenda foto del equipo', type: 'string' }),
    defineField({
      name: 'values',
      title: 'Valores',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'title', title: 'Título', type: 'string' }),
          defineField({ name: 'text', title: 'Texto', type: 'text', rows: 3 }),
        ],
      }],
    }),
  ],
  preview: { select: { title: 'title' } },
})
