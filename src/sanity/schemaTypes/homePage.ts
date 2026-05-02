import { defineField, defineType } from 'sanity'

export const homePageType = defineType({
  name: 'homePage',
  title: 'Página de Inicio',
  type: 'document',
  fields: [
    defineField({ name: 'hero_title', title: 'Título principal (Hero)', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'hero_subtitle', title: 'Subtítulo (Hero)', type: 'text', rows: 2 }),
    defineField({ name: 'hero_cta_label', title: 'Texto del botón (Hero)', type: 'string' }),
    defineField({ name: 'hero_image', title: 'Imagen Hero', type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', type: 'string', title: 'Texto alternativo' })] }),
    defineField({ name: 'about_preview_title', title: 'Título sección "Sobre nosotros"', type: 'string' }),
    defineField({ name: 'about_preview_text', title: 'Texto sección "Sobre nosotros"', type: 'text', rows: 4 }),
    defineField({ name: 'about_preview_image', title: 'Imagen sección "Sobre nosotros"', type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', type: 'string', title: 'Texto alternativo' })] }),
  ],
  preview: { select: { title: 'hero_title' } },
})
