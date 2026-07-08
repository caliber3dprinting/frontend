import type { NextConfig } from "next";

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://clerk.caliber3d.mx https://challenges.cloudflare.com https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://*.clerk.accounts.dev https://clerk.caliber3d.mx",
      "img-src 'self' data: blob: https://res.cloudinary.com https://cdn.sanity.io https://img.clerk.com",
      "font-src 'self' https://*.clerk.accounts.dev https://clerk.caliber3d.mx",
      "worker-src blob:",
      "connect-src 'self' https://cdn.sanity.io https://*.api.sanity.io https://*.clerk.accounts.dev https://clerk.caliber3d.mx https://api.clerk.com wss://*.clerk.accounts.dev wss://clerk.caliber3d.mx https://challenges.cloudflare.com https://clerk-telemetry.com https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net",
      "frame-src https://*.clerk.accounts.dev https://clerk.caliber3d.mx https://challenges.cloudflare.com https://www.google.com https://maps.google.com",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://*.clerk.accounts.dev https://clerk.caliber3d.mx",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.87'],
  async headers() {
    return [
      // El Studio necesita CSP más permisivo (carga recursos de Sanity)
      {
        source: '/studio/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
      {
        source: '/((?!studio).*)',
        headers: securityHeaders,
      },
    ]
  },
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    remotePatterns: [
      // Sanity CDN
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
      // Cloudinary (imágenes migradas que conserven URL original)
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
