import { ImageResponse } from 'next/og'

export const alt = 'Caliber 3D Printing — Impresión 3D profesional en Playa del Carmen'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://caliber3d.mx'

export default async function Image() {
  const logoRes = await fetch(`${BASE_URL}/logo-en-3d.jpg`)
  const logoBuffer = await logoRes.arrayBuffer()
  const logoBase64 = Buffer.from(logoBuffer).toString('base64')
  const logoSrc = `data:image/jpeg;base64,${logoBase64}`

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: '#09090b',
        }}
      >
        {/* Barra naranja izquierda */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '10px',
            background: '#f97316',
            display: 'flex',
          }}
        />

        {/* Panel izquierdo: texto */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '70px 60px 70px 90px',
            flex: 1,
          }}
        >
          <span
            style={{
              color: '#f97316',
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 24,
              display: 'flex',
            }}
          >
            caliber3d.mx
          </span>
          <span
            style={{
              color: '#ffffff',
              fontSize: 58,
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: 32,
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            Impresión 3D de alta precisión
          </span>
          <span
            style={{
              color: '#a1a1aa',
              fontSize: 26,
              display: 'flex',
            }}
          >
            Playa del Carmen · Enviamos a todo México
          </span>
        </div>

        {/* Panel derecho: imagen */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '380px',
            flexShrink: 0,
            background: '#111113',
          }}
        >
          <img
            src={logoSrc}
            width={320}
            height={320}
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>
    ),
    { ...size }
  )
}
