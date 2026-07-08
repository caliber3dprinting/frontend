// Generadores de JSON-LD (schema.org) tipados y centralizados.
// Se inyectan con el componente <JsonLd data={...} />.
// Los datos de negocio (NAP) viven en un único lugar: src/lib/business.ts

import { BUSINESS, BUSINESS_SAME_AS } from './business'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://caliber3d.mx'

const BUSINESS_DESCRIPTION =
  'Servicio de impresión 3D FDM y resina en Playa del Carmen: repuestos, piezas técnicas, ' +
  'prototipos, maquetas y figuras personalizadas para empresas y particulares de la Riviera Maya.'

// Construye el bloque openingHoursSpecification desde BUSINESS.openingHours,
// omitiendo los días cerrados (null).
function openingHoursSpecification() {
  const { weekdays, saturday, sunday } = BUSINESS.openingHours
  const spec: Array<{
    '@type': 'OpeningHoursSpecification'
    dayOfWeek: string[]
    opens: string
    closes: string
  }> = []

  if (weekdays) {
    spec.push({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: weekdays.opens,
      closes: weekdays.closes,
    })
  }
  if (saturday) {
    spec.push({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday'],
      opens: saturday.opens,
      closes: saturday.closes,
    })
  }
  if (sunday) {
    spec.push({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Sunday'],
      opens: sunday.opens,
      closes: sunday.closes,
    })
  }
  return spec
}

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#business`,
    name: BUSINESS.legalName,
    description: BUSINESS_DESCRIPTION,
    url: SITE_URL,
    image: `${SITE_URL}/caliber-3d-logo.svg`,
    telephone: BUSINESS.phoneE164,
    email: BUSINESS.email,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      ...(BUSINESS.address.street ? { streetAddress: BUSINESS.address.street } : {}),
      addressLocality: BUSINESS.address.locality,
      addressRegion: BUSINESS.address.region,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.geo.latitude,
      longitude: BUSINESS.geo.longitude,
    },
    areaServed: BUSINESS.areaServed.map((name) => ({ '@type': 'City', name })),
    openingHoursSpecification: openingHoursSpecification(),
    sameAs: BUSINESS_SAME_AS,
  }
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: BUSINESS.legalName,
    description: BUSINESS_DESCRIPTION,
    url: SITE_URL,
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/caliber-3d-logo.svg` },
    email: BUSINESS.email,
    sameAs: BUSINESS_SAME_AS,
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
    brand: { '@type': 'Brand', name: BUSINESS.legalName },
    // Offer solo cuando hay precio: un Offer sin price genera warnings en Google.
    ...(p.priceFrom
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'MXN',
            price: p.priceFrom,
            availability: 'https://schema.org/InStock',
            url: `${SITE_URL}/catalogo/${p.slug}`,
            seller: { '@type': 'Organization', name: BUSINESS.legalName, url: SITE_URL },
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
    author: { '@type': 'Person', name: a.author ?? BUSINESS.legalName },
    publisher: {
      '@type': 'Organization',
      name: BUSINESS.legalName,
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
