import { defineArrayMember, defineField, defineType } from 'sanity'

export const presupuestoType = defineType({
  name: 'presupuesto',
  title: 'Presupuesto',
  type: 'document',
  fields: [
    defineField({ name: 'userId', title: 'Usuario ID', type: 'string' }),
    defineField({ name: 'nombre', title: 'Nombre del presupuesto', type: 'string' }),
    defineField({ name: 'cliente', title: 'Cliente', type: 'string' }),
    defineField({
      name: 'piezas',
      title: 'Piezas',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'nombre', type: 'string', title: 'Nombre de la pieza' }),
            defineField({ name: 'precioPieza', type: 'number', title: 'Precio por pieza' }),
            defineField({ name: 'cantidad', type: 'number', title: 'Cantidad' }),
            defineField({ name: 'manoDeObra', type: 'number', title: 'Mano de obra por pieza' }),
            defineField({ name: 'mostrarManoDeObra', type: 'boolean', title: 'Mostrar en PDF' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'accesorios',
      title: 'Accesorios (globales)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'nombre', type: 'string', title: 'Nombre' }),
            defineField({ name: 'costo', type: 'number', title: 'Costo por unidad' }),
          ],
        }),
      ],
    }),
    defineField({ name: 'totalConAccesorios', title: 'Total general', type: 'number' }),
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
