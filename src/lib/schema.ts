// Generadores de JSON-LD (schema.org) tipados y centralizados.
// Se inyectan con el componente <JsonLd data={...} />.

const SITE_URL = 'https://caliber3d.mx'

// Datos de negocio reutilizados por LocalBusiness y Organization.
const SAME_AS = [
  'https://www.instagram.com/caliber3d.mx/',
  'https://www.facebook.com/caliber3d.mx',
]

const BUSINESS_DESCRIPTION =
  'Servicio de impresión 3D FDM y resina en Playa del Carmen: repuestos, piezas técnicas, ' +
  'prototipos, maquetas y figuras personalizadas para empresas y particulares de la Riviera Maya.'

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#business`,
    name: 'Caliber 3D Printing',
    description: BUSINESS_DESCRIPTION,
    url: SITE_URL,
    image: `${SITE_URL}/caliber-3d-logo.svg`,
    telephone: '+529982017863',
    email: 'caliber.3dprinting@gmail.com',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Playa del Carmen',
      addressRegion: 'Quintana Roo',
      postalCode: '77710',
      addressCountry: 'MX',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 20.6296,
      longitude: -87.0739,
    },
    areaServed: [
      { '@type': 'City', name: 'Playa del Carmen' },
      { '@type': 'City', name: 'Cancún' },
      { '@type': 'City', name: 'Tulum' },
      { '@type': 'City', name: 'Cozumel' },
      { '@type': 'City', name: 'Puerto Morelos' },
      { '@type': 'City', name: 'Solidaridad' },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '09:00',
        closes: '14:00',
      },
    ],
    sameAs: SAME_AS,
  }
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Caliber 3D Printing',
    description: BUSINESS_DESCRIPTION,
    url: SITE_URL,
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/caliber-3d-logo.svg` },
    email: 'caliber.3dprinting@gmail.com',
    sameAs: SAME_AS,
  }
}

export function productSchema(p: {
  name: string
  image?: string
  description: string
  slug: string
  priceFrom?: number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    ...(p.image ? { image: p.image } : {}),
    description: p.description,
    brand: { '@type': 'Brand', name: 'Caliber 3D Printing' },
    // Offer solo cuando hay precio: un Offer sin price genera warnings en Google.
    ...(p.priceFrom
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'MXN',
            price: p.priceFrom,
            availability: 'https://schema.org/InStock',
            url: `${SITE_URL}/catalogo/${p.slug}`,
            seller: { '@type': 'Organization', name: 'Caliber 3D Printing', url: SITE_URL },
          },
        }
      : {}),
  }
}

export function articleSchema(a: {
  title: string
  description: string
  image?: string
  slug: string
  publishedAt: string
  updatedAt?: string
  author?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.description,
    ...(a.image ? { image: a.image } : {}),
    datePublished: a.publishedAt,
    dateModified: a.updatedAt ?? a.publishedAt,
    author: { '@type': 'Person', name: a.author ?? 'Caliber 3D Printing' },
    publisher: {
      '@type': 'Organization',
      name: 'Caliber 3D Printing',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/caliber-3d-logo.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${a.slug}` },
  }
}

export function breadcrumbSchema(items: { name: string; url?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      ...(it.url ? { item: it.url } : {}),
    })),
  }
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: { '@type': 'Answer', text: it.answer },
    })),
  }
}
