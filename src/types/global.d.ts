export {}

declare global {
  interface Window {
    // gtag lo inyecta el script de Google Analytics (@next/third-parties).
    // Lo declaramos para el fallback de trackEvent cuando sendGAEvent no esté disponible.
    gtag?: (...args: unknown[]) => void
  }
}
