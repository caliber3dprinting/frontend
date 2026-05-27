import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/admin(.*)',
])

// El webhook de Clerk viene de los servidores de Clerk, no de un usuario
// autenticado, así que debe quedar fuera del middleware de auth.
const isPublicWebhook = createRouteMatcher([
  '/api/webhooks/clerk(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (isPublicWebhook(req)) return
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
