// Fuente única de verdad de los datos de negocio (NAP: Name, Address, Phone).
// Todo el JSON-LD (LocalBusiness/Organization), el fallback de GlobalConfig y
// cualquier punto de contacto deben consumir de aquí. NO hardcodear teléfonos,
// emails, direcciones ni redes en ningún otro archivo.
//
// Consistencia NAP: estos valores deben coincidir EXACTAMENTE con el Perfil de
// Empresa de Google una vez verificado (mismo nombre, dirección y teléfono).

type DayHours = { opens: string; closes: string }

// Tipado explícito para que cualquier día pueda ser DayHours o null (cerrado)
// sin que `as const` lo colapse a un literal.
const OPENING_HOURS: {
  weekdays: DayHours | null
  saturday: DayHours | null
  sunday: DayHours | null
} = {
  weekdays: { opens: '00:00', closes: '23:59' }, // 24 horas
  saturday: { opens: '08:00', closes: '13:00' },
  sunday: null,
}

export const BUSINESS = {
  name: 'Caliber 3D',
  legalName: 'Caliber 3D Printing',

  // Teléfono / WhatsApp — mismo número, distintos formatos
  phone: '+52 998 201 7863', // formato humano (display)
  phoneE164: '+529982017863', // formato E.164 para schema.org / tel:
  whatsapp: '529982017863', // solo dígitos para wa.me

  email: 'caliber.3dprinting@gmail.com',

  address: {
    street: 'Privada Zafiro, Fraccionamiento La Joya, casa 38',
    locality: 'Playa del Carmen',
    region: 'Quintana Roo',
    postalCode: '77710', // ⚠️ confirmar CP exacto de La Joya
    country: 'MX',
  },

  // Áreas de servicio (para areaServed en schema y contenido local/AEO)
  areaServed: [
    'Playa del Carmen',
    'Cancún',
    'Tulum',
    'Cozumel',
    'Puerto Aventuras',
    'Akumal',
    'Puerto Morelos',
    'Riviera Maya',
    'Quintana Roo',
  ],

  // Coordenadas del taller, derivadas del Plus Code de Google Maps
  // "76GJJV9W+F5" (JV9W+F5 Playa del Carmen).
  geo: { latitude: 20.61869, longitude: -87.10456 },

  // Horarios: lunes a viernes abierto 24 hs; sábados 08:00–13:00; domingos cerrado.
  openingHours: OPENING_HOURS,
  // Versión legible para el footer / display.
  hoursText: 'Lunes a viernes las 24 hs · Sábados de 8:00 a 13:00 hs',

  social: {
    instagram: 'https://www.instagram.com/caliber3d.mx/',
    facebook: 'https://www.facebook.com/caliber3d.mx', // ⚠️ confirmar URL exacta
    tiktok: '', // sin TikTok
    googleBusiness: '', // se completa cuando el perfil esté verificado
  },
} as const

// URLs públicas de perfiles sociales/externos, para `sameAs` en JSON-LD.
// Filtra vacíos para no emitir entradas nulas.
export const BUSINESS_SAME_AS: string[] = (
  [
    BUSINESS.social.instagram,
    BUSINESS.social.facebook,
    BUSINESS.social.tiktok,
    BUSINESS.social.googleBusiness,
  ] as string[]
).filter((url) => Boolean(url))
