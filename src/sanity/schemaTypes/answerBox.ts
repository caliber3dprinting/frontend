import { defineType, defineField } from 'sanity'

// Bloque de "Caja de Respuesta" para AEO. Se inserta dentro del contenido del
// post y se renderiza con <AnswerBox /> (ver RichText.tsx).
export const answerBoxType = defineType({
  name: 'answerBox',
  type: 'object',
  title: 'Caja de Respuesta (AEO)',
  fields: [
    defineField({
      name: 'question',
      type: 'string',
      title: 'Pregunta',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'answer',
      type: 'text',
      title: 'Respuesta directa (100-300 caracteres)',
      rows: 3,
      validation: (r) => r.required().min(50).max(500),
    }),
  ],
  preview: {
    select: { title: 'question', subtitle: 'answer' },
  },
})
