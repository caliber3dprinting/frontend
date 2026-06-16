import type { Metadata } from 'next'
import { Barlow, Barlow_Condensed } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import SiteChrome from '@/components/layout/SiteChrome'
import { getGlobalConfig, getCategories } from '@/lib/sanity'
import { getWhatsappNumber } from '@/lib/whatsapp'
import Analytics from '@/components/analytics/Analytics'
import JsonLd from '@/components/seo/JsonLd'
import { localBusinessSchema } from '@/lib/schema'

// Fuentes vía next/font: se auto-hospedan, se precargan y eliminan el
// @import render-blocking de Google Fonts. Barlow = cuerpo, Condensed = títulos.
const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-body',
  display: 'swap',
  preload: true,
})
const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700', '900'],
  variable: '--font-display',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL('https://caliber3d.mx'),
  title: {
    default: 'Caliber 3D Printing — Impresión 3D, Playa del Carmen',
    template: '%s | Caliber 3D Printing',
  },
  description:
    'Impresión 3D a medida en Playa del Carmen: repuestos, piezas técnicas y figuras personalizadas con precisión profesional. Cotiza sin compromiso.',
  openGraph: {
    siteName: 'Caliber 3D Printing',
    locale: 'es_MX',
    type: 'website',
    url: 'https://caliber3d.mx',
    title: 'Caliber 3D Printing — Impresión 3D, Playa del Carmen',
    description:
      'Impresión 3D a medida en Playa del Carmen. Fabricamos repuestos 3D, piezas técnicas y figuras personalizadas con precisión profesional.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Caliber 3D Printing — Impresión 3D, Playa del Carmen',
    description:
      'Impresión 3D a medida en Playa del Carmen. Fabricamos repuestos 3D, piezas técnicas y figuras personalizadas con precisión profesional.',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // GlobalConfig se carga aquí para que Navbar y Footer tengan
  // datos dinámicos (WhatsApp, redes sociales) sin prop drilling.
  // Fallback mientras el single type no exista en Sanity.
  const FALLBACK_CONFIG = {
    whatsapp_number: getWhatsappNumber(),
    contact_email: 'caliber.3dprinting@gmail.com',
    instagram_url: 'https://www.instagram.com/caliber3d.mx/',
    facebook_url: 'https://www.facebook.com/caliber3d.mx',
    tiktok_url: null,
    business_hours: 'Lunes a viernes de 08 a 18 hrs, sábados de 9 a 14 hrs',
    address: 'Playa del Carmen, Quintana Roo',
  }
  const [config, categories] = await Promise.all([
    getGlobalConfig().catch(() => null),
    getCategories('blog').catch(() => []),
  ])
  const resolvedConfig = config ?? FALLBACK_CONFIG

  return (
    <ClerkProvider>
      <html lang="es" className={`${barlow.variable} ${barlowCondensed.variable}`} data-scroll-behavior="smooth">
        {/* Preconnect para el CDN de imágenes de Sanity — reduce el tiempo de conexión del LCP */}
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <body className="bg-zinc-950 text-zinc-100 antialiased" suppressHydrationWarning>
          <JsonLd data={localBusinessSchema()} />
          <SiteChrome config={resolvedConfig} categories={categories}>{children}</SiteChrome>
        </body>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <Analytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </html>
    </ClerkProvider>
  )
}
