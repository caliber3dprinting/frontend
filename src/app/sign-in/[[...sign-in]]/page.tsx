import { SignIn } from '@clerk/nextjs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Iniciar sesión',
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <SignIn />
    </div>
  )
}
