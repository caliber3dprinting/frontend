import { defineField, defineType } from 'sanity'

export const presupuestoType = defineType({
  name: 'presupuesto',
  title: 'Presupuesto',
  type: 'document',
  fields: [
    defineField({ name: 'userId', title: 'Usuario ID', type: 'string' }),
    defineField({ name: 'nombre', title: 'Nombre del presupuesto', type: 'string' }),
    defineField({ name: 'cliente', title: 'Cliente', type: 'string' }),
    defineField({ name: 'pieza', title: 'Pieza', type: 'string' }),
    defineField({ name: 'costoPieza', title: 'Costo impresión por pieza', type: 'number' }),
    defineField({ name: 'cantidad', title: 'Cantidad', type: 'number' }),
    defineField({ name: 'manoDeObra', title: 'Mano de obra por pieza', type: 'number' }),
    defineField({
      name: 'accesorios',
      title: 'Accesorios',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'nombre', type: 'string', title: 'Nombre' }),
            defineField({ name: 'costo', type: 'number', title: 'Costo por pieza' }),
          ],
        },
      ],
    }),
    defineField({ name: 'totalSinAccesorios', title: 'Total sin accesorios', type: 'number' }),
    defineField({ name: 'totalConAccesorios', title: 'Total con accesorios', type: 'number' }),
    defineField({ name: 'marcaNegocio', title: 'Nombre del negocio', type: 'string' }),
    defineField({ name: 'telefono', title: 'Teléfono', type: 'string' }),
    defineField({ name: 'emailContacto', title: 'Email de contacto', type: 'string' }),
    defineField({ name: 'creadoEn', title: 'Creado en', type: 'datetime' }),
  ],
  orderings: [
    { title: 'Más recientes', name: 'dateDesc', by: [{ field: 'creadoEn', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'nombre', subtitle: 'cliente' },
    prepare({ title, subtitle }) {
      return { title: title || 'Sin nombre', subtitle: subtitle || 'Sin cliente' }
    },
  },
})
