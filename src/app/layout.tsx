import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ScrollProgressBar from '@/components/ui/ScrollProgressBar'
import PageLoader from '@/components/ui/PageLoader'
import { getGlobalConfig } from '@/lib/strapi'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap', preload: true })

export const metadata: Metadata = {
  title: {
    default: 'Caliber 3D Printing — Impresión 3D a Medida, Playa del Carmen',
    template: '%s | Caliber 3D Printing',
  },
  description:
    'Impresión 3D a medida en Playa del Carmen. Fabricamos repuestos 3D, piezas técnicas y figuras personalizadas con precisión profesional. Solicita tu cotización sin compromiso.',
  openGraph: {
    siteName: 'Caliber 3D Printing',
    locale: 'es_MX',
    type: 'website',
  },
}

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://caliber3d.mx/#business',
  name: 'Caliber 3D Printing',
  url: 'https://caliber3d.mx',
  image: 'https://caliber3d.mx/caliber-3d-logo.svg',
  telephone: '+529982017863',
  email: 'caliber.3dprinting@gmail.com',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Playa del Carmen',
    addressRegion: 'Quintana Roo',
    postalCode: '77710',
    addressCountry: 'MX',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 20.6296,
    longitude: -87.0739,
  },
  areaServed: [
    { '@type': 'City', name: 'Playa del Carmen' },
    { '@type': 'City', name: 'Cancún' },
    { '@type': 'City', name: 'Tulum' },
    { '@type': 'City', name: 'Cozumel' },
    { '@type': 'City', name: 'Puerto Morelos' },
    { '@type': 'City', name: 'Solidaridad' },
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday'],
      opens: '09:00',
      closes: '14:00',
    },
  ],
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
    whatsapp_number: process.env.NEXT_PUBLIC_WHATSAPP ?? '529982017863',
    contact_email: 'caliber.3dprinting@gmail.com',
    instagram_url: 'https://www.instagram.com/caliber3d.mx/',
    facebook_url: "https://www.facebook.com/caliber3d.mx",
    tiktok_url: null,
    business_hours: "Lunes a viernes de 08 a 18 hrs, sábados de 9 a 14 hrs",
    address: 'Playa del Carmen, Quintana Roo',
  }))

  return (
    <html lang="es" className={inter.variable}>
      {/* Preconnect para el backend de imágenes — reduce el tiempo de conexión del LCP */}
      <link rel="preconnect" href="https://backend-production-e1964.up.railway.app" />
      <link rel="dns-prefetch" href="https://backend-production-e1964.up.railway.app" />
      <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      <body className="bg-zinc-950 text-zinc-100 antialiased" suppressHydrationWarning>
        <PageLoader />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd).replace(/</g, '\\u003c'),
          }}
        />
        <ScrollProgressBar />
        <Navbar whatsapp={config.whatsapp_number} />
        <main className="min-h-screen">{children}</main>
        <Footer config={config} />
      </body>
    </html>
  )
}
