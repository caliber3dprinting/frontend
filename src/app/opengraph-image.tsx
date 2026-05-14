import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'Caliber 3D Printing — Impresión 3D profesional en Playa del Carmen'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const bannerData = await readFile(join(process.cwd(), 'public/og-banner.jpg'), 'base64')
  const bannerSrc = `data:image/jpeg;base64,${bannerData}`

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        {/* Imagen de fondo */}
        <img
          src={bannerSrc}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'right center',
          }}
        />

        {/* Overlay oscuro degradado */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to right, rgba(9,9,11,0.97) 50%, rgba(9,9,11,0.65) 100%)',
            display: 'flex',
          }}
        />

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

        {/* Contenido */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '70px 90px',
          }}
        >
          <span
            style={{
              color: '#f97316',
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 20,
              display: 'flex',
            }}
          >
            caliber3d.mx
          </span>
          <span
            style={{
              color: '#ffffff',
              fontSize: 62,
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: 28,
              display: 'flex',
              flexWrap: 'wrap',
              maxWidth: '620px',
            }}
          >
            Impresión 3D de alta precisión
          </span>
          <span
            style={{
              color: '#d4d4d8',
              fontSize: 26,
              display: 'flex',
            }}
          >
            Playa del Carmen · Enviamos a todo México
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
