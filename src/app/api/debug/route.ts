import { NextResponse } from 'next/server'

// Ruta temporal de diagnóstico — eliminar cuando todo funcione
export async function GET() {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'NO DEFINIDO'
  const hasToken = !!process.env.STRAPI_API_TOKEN
  const tokenPreview = process.env.STRAPI_API_TOKEN
    ? process.env.STRAPI_API_TOKEN.slice(0, 8) + '...'
    : 'NO DEFINIDO'

  // Intentar conectar a Strapi
  let strapiStatus: string
  try {
    const res = await fetch(`${strapiUrl}/api/home-page`, {
      headers: hasToken
        ? { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` }
        : {},
      cache: 'no-store',
    })
    strapiStatus = `${res.status} ${res.statusText}`
  } catch (e) {
    strapiStatus = `ERROR: ${e instanceof Error ? e.message : String(e)}`
  }

  return NextResponse.json({
    NEXT_PUBLIC_STRAPI_URL: strapiUrl,
    STRAPI_API_TOKEN_set: hasToken,
    STRAPI_API_TOKEN_preview: tokenPreview,
    strapi_connection: strapiStatus,
  })
}
