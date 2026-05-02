import { SignUp } from '@clerk/nextjs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Crear cuenta',
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <SignUp />
    </div>
  )
}
