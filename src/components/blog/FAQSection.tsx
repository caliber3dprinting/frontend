import JsonLd from '@/components/seo/JsonLd'
import { faqSchema } from '@/lib/schema'

export type FAQItem = { question: string; answer: string }

/**
 * Sección de preguntas frecuentes al final del post. Renderiza la lista visual
 * y emite el JSON-LD FAQPage correspondiente (AEO). Consume el campo `faq`
 * del schema blogPost de Sanity.
 */
export default function FAQSection({ faqs }: { faqs: FAQItem[] }) {
  if (!faqs || faqs.length === 0) return null

  return (
    <section className="mt-16 pt-12 border-t border-zinc-800">
      <JsonLd data={faqSchema(faqs)} />
      <h2 className="text-2xl font-bold text-white mb-8">Preguntas frecuentes</h2>
      <dl className="space-y-6">
        {faqs.map((item, i) => (
          <div key={i} className="border border-zinc-800 rounded-xl p-6">
            <dt className="text-base font-semibold text-white mb-2">{item.question}</dt>
            <dd className="text-zinc-400 leading-relaxed">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
