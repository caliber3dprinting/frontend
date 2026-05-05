import { NextRequest } from 'next/server'

const TARGET = 'https://frontend-api.clerk.services'

async function proxy(request: NextRequest, paramsPromise: Promise<{ path?: string[] }>) {
  try {
    const { path: segments } = await paramsPromise
    const path = (segments ?? []).join('/')
    const search = request.nextUrl.searchParams.toString()
    const url = `${TARGET}/${path}${search ? `?${search}` : ''}`

    const headers = new Headers(request.headers)
    headers.set('x-forwarded-host', request.headers.get('host') ?? '')
    headers.set('host', new URL(url).host)

    return fetch(url, {
      method: request.method,
      headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
    })
  } catch (err) {
    console.error('[clerk-proxy]', err)
    return new Response('proxy error', { status: 502 })
  }
}

export const GET    = (req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) => proxy(req, params)
export const POST   = (req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) => proxy(req, params)
export const PUT    = (req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) => proxy(req, params)
export const PATCH  = (req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) => proxy(req, params)
export const DELETE = (req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) => proxy(req, params)
