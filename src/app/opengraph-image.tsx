import { ImageResponse } from 'next/og'

export const alt = 'Caliber 3D Printing — Impresión 3D profesional en Playa del Carmen'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: '#09090b',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '70px 80px',
          position: 'relative',
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

        {/* Texto principal */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            paddingRight: '80px',
          }}
        >
          <span
            style={{
              color: '#f97316',
              fontSize: 24,
              fontWeight: 600,
              marginBottom: 24,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            caliber3d.mx
          </span>
          <span
            style={{
              color: '#ffffff',
              fontSize: 60,
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
              fontSize: 28,
              display: 'flex',
            }}
          >
            Playa del Carmen · Enviamos a todo México
          </span>
        </div>

        {/* Ícono decorativo */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: 220,
            height: 220,
            borderRadius: '50%',
            border: '4px solid #f97316',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              color: '#f97316',
              fontSize: 52,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              display: 'flex',
            }}
          >
            C3D
          </span>
          <span
            style={{
              color: '#52525b',
              fontSize: 16,
              letterSpacing: '0.15em',
              marginTop: 8,
              display: 'flex',
            }}
          >
            PRINTING
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
