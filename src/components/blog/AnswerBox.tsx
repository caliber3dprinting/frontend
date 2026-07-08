import { ReactNode } from 'react'

type Props = {
  question: string
  children: ReactNode
}

/**
 * Caja de respuesta directa para AEO (Answer Engine Optimization).
 * Resalta una pregunta + respuesta corta dentro del contenido para que los
 * LLMs y AI Overviews la extraigan fácilmente. Usa microdata schema.org
 * Question/Answer además del estilo visual.
 */
export function AnswerBox({ question, children }: Props) {
  return (
    <div
      className="my-8 rounded-xl border-l-4 border-orange-500 bg-zinc-900/60 p-6"
      itemScope
      itemType="https://schema.org/Question"
    >
      <p
        className="mb-3 text-xs font-semibold uppercase tracking-widest text-orange-400"
        itemProp="name"
      >
        {question}
      </p>
      <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
        <div itemProp="text" className="text-[1.0625rem] leading-relaxed text-zinc-200">
          {children}
        </div>
      </div>
    </div>
  )
}
