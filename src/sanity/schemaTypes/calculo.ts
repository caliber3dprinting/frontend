import { defineField, defineType } from 'sanity'

export const calculoType = defineType({
  name: 'calculo',
  title: 'Cálculo guardado',
  type: 'document',
  fields: [
    defineField({ name: 'userId', title: 'Usuario ID', type: 'string' }),
    defineField({ name: 'nombrePieza', title: 'Nombre de la pieza', type: 'string' }),
    defineField({ name: 'resultado', title: 'Costo total (con fallos)', type: 'number' }),
    defineField({ name: 'costoBase', title: 'Costo base', type: 'number' }),
    defineField({ name: 'peso', title: 'Peso (g)', type: 'number' }),
    defineField({ name: 'costoFilamento', title: 'Costo filamento ($/kg)', type: 'number' }),
    defineField({ name: 'tiempo', title: 'Tiempo (h)', type: 'number' }),
    defineField({ name: 'consumo', title: 'Consumo (W)', type: 'number' }),
    defineField({ name: 'costoKwh', title: 'Costo kWh', type: 'number' }),
    defineField({ name: 'costoMaquina', title: 'Costo máquina', type: 'number' }),
    defineField({ name: 'vidaUtil', title: 'Vida útil (h)', type: 'number' }),
    defineField({ name: 'postProcesado', title: 'Post-procesado (min)', type: 'number' }),
    defineField({ name: 'valorHora', title: 'Valor hora trabajo', type: 'number' }),
    defineField({ name: 'tasaFallos', title: 'Tasa de fallos (%)', type: 'number' }),
    defineField({ name: 'creadoEn', title: 'Creado en', type: 'datetime' }),
  ],
  orderings: [
    { title: 'Más recientes', name: 'dateDesc', by: [{ field: 'creadoEn', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'nombrePieza', subtitle: 'resultado' },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Sin nombre',
        subtitle: subtitle != null ? `$${Number(subtitle).toFixed(2)}` : '',
      }
    },
  },
})
