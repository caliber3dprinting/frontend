import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getGlobalConfig } from '@/lib/strapi'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'Caliber 3D — Impresiones 3D a Medida en Playa del Carmen',
    template: '%s | Caliber 3D',
  },
  description:
    'Fabricamos tus ideas en 3D. Figuras personalizadas, repuestos, decoración y más. Cotiza sin compromiso.',
  openGraph: {
    siteName: 'Caliber 3D',
    locale: 'es_MX',
    type: 'website',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // GlobalConfig se carga aquí para que Navbar y Footer tengan
  // datos dinámicos (WhatsApp, redes sociales) sin prop drilling.
  // Fallback mientras el single type no exista en Strapi.
  const config = await getGlobalConfig().catch(() => ({
    whatsapp_number: '',
    contact_email: '',
    instagram_url: null,
    facebook_url: null,
    tiktok_url: null,
    business_hours: null,
    address: null,
  }))

  return (
    <html lang="es" className={inter.variable}>
      <body className="bg-zinc-950 text-zinc-100 antialiased">
        <Navbar whatsapp={config.whatsapp_number} />
        <main className="min-h-screen">{children}</main>
        <Footer config={config} />
      </body>
    </html>
  )
}
