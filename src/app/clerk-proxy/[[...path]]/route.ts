import { NextRequest, NextResponse } from 'next/server'

const CLERK_API = 'https://frontend-api.clerk.services'

async function proxy(request: NextRequest, paramsPromise: Promise<{ path?: string[] }>) {
  const { path: segments } = await paramsPromise
  const path = (segments ?? []).join('/')
  const url = `${CLERK_API}/${path}${request.nextUrl.search}`

  const headers = new Headers(request.headers)
  headers.set('host', 'frontend-api.clerk.services')
  headers.delete('connection')

  const body = request.method !== 'GET' && request.method !== 'HEAD'
    ? await request.arrayBuffer()
    : undefined

  const res = await fetch(url, { method: request.method, headers, body })

  const responseHeaders = new Headers(res.headers)
  responseHeaders.delete('content-encoding')

  return new NextResponse(res.body, { status: res.status, headers: responseHeaders })
}

export const GET = (req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) => proxy(req, params)
export const POST = (req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) => proxy(req, params)
export const PUT = (req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) => proxy(req, params)
export const PATCH = (req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) => proxy(req, params)
export const DELETE = (req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) => proxy(req, params)
