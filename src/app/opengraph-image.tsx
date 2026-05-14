import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'Caliber 3D Printing — Impresión 3D profesional en Playa del Carmen'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const logoData = await readFile(join(process.cwd(), 'public/logo-en-3d.webp'), 'base64')
  const logoSrc = `data:image/webp;base64,${logoData}`

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: '#09090b',
          alignItems: 'center',
          position: 'relative',
          padding: '70px 80px',
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
          }}
        />

        {/* Texto */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            paddingRight: '60px',
          }}
        >
          <span
            style={{
              color: '#f97316',
              fontSize: 26,
              fontWeight: 600,
              marginBottom: 20,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
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
              marginBottom: 28,
            }}
          >
            Impresión 3D de alta precisión
          </span>
          <span
            style={{
              color: '#a1a1aa',
              fontSize: 28,
              lineHeight: 1.4,
            }}
          >
            Playa del Carmen · Enviamos a todo México
          </span>
        </div>

        {/* Logo */}
        <img
          src={logoSrc}
          width={280}
          height={280}
          style={{ objectFit: 'contain' }}
        />
      </div>
    ),
    { ...size }
  )
}
