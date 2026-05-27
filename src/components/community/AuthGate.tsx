'use client'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'

interface AuthGateProps {
  /** Texto del call-to-action, ej. "para comentar" */
  action?: string
  children: React.ReactNode
}

/**
 * Muestra el contenido solo si el usuario está autenticado.
 * Si no, muestra un banner con links de sign-in / sign-up.
 */
export default function AuthGate({ action = 'para continuar', children }: AuthGateProps) {
  const { isLoaded, isSignedIn } = useUser()

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-6 py-8 text-center">
        <div className="text-4xl mb-3">🔒</div>
        <p className="text-white font-semibold mb-1">Iniciá sesión {action}</p>
        <p className="text-zinc-400 text-sm mb-6">
          Es gratis y solo toma unos segundos.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/sign-in"
            className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/sign-up"
            className="inline-block bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
          >
            Crear cuenta
          </Link>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
