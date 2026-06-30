import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getQuotes } from '@/lib/sanity'
import type { Quote } from '@/lib/types'
import type { Metadata } from 'next'
import { setQuoteStatus } from './actions'

export const metadata: Metadata = { title: 'Admin — Cotizaciones' }

const STATUS_LABELS: Record<Quote['status'], string> = {
  new: 'Nueva',
  reviewing: 'En revisión',
  quoted: 'Presupuestada',
  closed: 'Cerrada',
}

const STATUS_COLORS: Record<Quote['status'], string> = {
  new: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  reviewing: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  quoted: 'bg-green-500/15 text-green-400 border-green-500/30',
  closed: 'bg-zinc-700/50 text-zinc-400 border-zinc-600/30',
}

const NEXT_STATUS: Record<Quote['status'], Quote['status']> = {
  new: 'reviewing',
  reviewing: 'quoted',
  quoted: 'closed',
  closed: 'new',
}

const NEXT_LABEL: Record<Quote['status'], string> = {
  new: '→ En revisión',
  reviewing: '→ Presupuestada',
  quoted: '→ Cerrar',
  closed: '→ Reabrir',
}

export default async function AdminPage() {
  const user = await currentUser()
  const email = user?.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress

  if (email !== process.env.ADMIN_EMAIL) redirect('/')

  const quotes = await getQuotes()

  const counts = {
    new: quotes.filter((q) => q.status === 'new').length,
    reviewing: quotes.filter((q) => q.status === 'reviewing').length,
    quoted: quotes.filter((q) => q.status === 'quoted').length,
    closed: quotes.filter((q) => q.status === 'closed').length,
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-24">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Cotizaciones</h1>
          <p className="text-zinc-400 text-sm mt-1">{quotes.length} en total</p>
        </div>
        <Link href="/admin/analytics" className="text-sm text-orange-400 hover:text-orange-300 underline shrink-0">
          Analytics →
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {(Object.entries(counts) as [Quote['status'], number][]).map(([status, count]) => (
          <div key={status} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-2xl font-bold text-white">{count}</p>
            <p className="text-xs text-zinc-400 mt-0.5">{STATUS_LABELS[status]}</p>
          </div>
        ))}
      </div>

      {quotes.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">No hay cotizaciones aún.</div>
      ) : (
        <div className="space-y-4">
          {quotes.map((q) => (
            <article key={q._id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-white">{q.name}</p>
                  <p className="text-sm text-zinc-400">{q.email}{q.phone ? ` · ${q.phone}` : ''}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${STATUS_COLORS[q.status]}`}>
                    {STATUS_LABELS[q.status]}
                  </span>
                  <form
                    action={async () => {
                      'use server'
                      await setQuoteStatus(q._id, NEXT_STATUS[q.status])
                    }}
                  >
                    <button
                      type="submit"
                      className="text-xs px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                    >
                      {NEXT_LABEL[q.status]}
                    </button>
                  </form>
                </div>
              </div>

              {q.category && (
                <p className="text-xs text-orange-400 font-medium mb-2">{q.category}</p>
              )}

              <p className="text-sm text-zinc-300 whitespace-pre-wrap">{q.description}</p>

              {q.notes && (
                <p className="mt-2 text-sm text-zinc-500 italic">Notas: {q.notes}</p>
              )}

              <p className="mt-3 text-xs text-zinc-600">
                {new Date(q.submittedAt).toLocaleString('es-MX', {
                  day: '2-digit', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </p>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
