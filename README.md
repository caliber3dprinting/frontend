# Caliber 3D — Frontend

Sitio web de Caliber 3D, emprendimiento de impresión 3D personalizada en Playa del Carmen. Construido con Next.js 16 (App Router) y Strapi v5 como CMS headless.

---

## Estado actual del proyecto

### ✅ Completado

- Estructura de rutas: `/`, `/catalogo`, `/catalogo/[slug]`, `/nosotros`, `/cotizar`
- Componentes: Navbar, Footer, HeroSection, FeaturedProducts, AboutPreview, TestimonialsSection, QuoteCTA, ProductGrid, ProductGallery, CategoryFilter, QuoteForm
- Integración con Strapi v5: productos, categorías, testimonios, HomePage, AboutPage, GlobalConfig
- Filtro de catálogo por categoría (en memoria, compatible con Strapi v5)
- Rich text con `@strapi/blocks-react-renderer` (descripciones de productos y story de nosotros)
- ISR (revalidación cada hora en producción)
- Imágenes desde Strapi local con `dangerouslyAllowLocalIP`


####  Pendientes:

Ir a **Content Manager → GlobalConfig → editar → Save & Publish**:

| Campo | Ejemplo |
|-------|---------|
| `tiktok_url` | `https://tiktok.com/@caliber3d` |


#### . Testimonios — sección vacía
La sección de testimonios en la home no muestra nada porque no hay entradas.

Ir a **Content Manager → Testimonial → Create new entry** y agregar al menos 2–3 testimonios reales o de prueba:
- `author_name`, `author_city`, `content`, `rating` (1–5)
- Opcionalmente vincular al producto relacionado


## Tecnologías

- **Next.js 16** — App Router, React 19, ISR
- **Strapi v5** — CMS headless (backend separado)
- **Tailwind CSS v4** — tema oscuro con acento naranja
- **@strapi/blocks-react-renderer** — Rich Text (Blocks editor)
- **TypeScript**

## Páginas

| Ruta | Descripción | Datos de Strapi |
|------|-------------|-----------------|
| `/` | Inicio: hero, productos destacados, nosotros preview, testimonios, CTA | HomePage, Products (featured), Testimonials |
| `/catalogo` | Catálogo con filtro por categoría y paginación | Products, Categories |
| `/catalogo/[slug]` | Detalle de producto con galería | Product (by slug) |
| `/nosotros` | Historia, valores, equipo | AboutPage |
| `/cotizar` | Formulario de solicitud de presupuesto | QuoteRequest (POST) |

## Variables de entorno

Crear `.env.local` en la raíz:

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=tu_token_de_api_de_strapi
NEXT_PUBLIC_WHATSAPP=529841234567
```

> `NEXT_PUBLIC_WHATSAPP` es el número de fallback si GlobalConfig no tiene datos. Usar el mismo formato: código de país sin `+`.

## Comandos

```bash
npm run dev      # desarrollo en http://localhost:3000
npm run build    # build de producción
npm start        # servidor de producción
```

## Estructura de Content Types en Strapi

### Collection Types

**Product**
| Campo | Tipo |
|-------|------|
| `title` | Text |
| `slug` | UID (basado en title) |
| `description` | Rich Text (Blocks) |
| `material` | Text |
| `featured` | Boolean |
| `cover_image` | Media (single) |
| `gallery` | Media (multiple) |
| `category` | Relation → Category (manyToOne) |
| `testimonials` | Relation → Testimonial (oneToMany) |

**Category**
| Campo | Tipo |
|-------|------|
| `name` | Text |
| `slug` | UID (basado en name) |
| `description` | Text |
| `icon` | Text |

**Testimonial**
| Campo | Tipo |
|-------|------|
| `author_name` | Text |
| `author_city` | Text |
| `content` | Text (long) |
| `rating` | Number (1–5) |
| `product` | Relation → Product (manyToOne) |

**QuoteRequest**
| Campo | Tipo |
|-------|------|
| `name` | Text |
| `email` | Email |
| `phone` | Text |
| `description` | Text (long) |
| `category` | Text |

### Single Types

**HomePage**
| Campo | Tipo |
|-------|------|
| `hero_title` | Text |
| `hero_subtitle` | Text |
| `hero_cta_label` | Text |
| `hero_image` | Media (single) |
| `about_preview_title` | Text |
| `about_preview_text` | Text |
| `about_preview_image` | Media (single) |

**AboutPage**
| Campo | Tipo |
|-------|------|
| `title` | Text |
| `story` | Rich Text (Blocks) |
| `team_photo` | Media (single) |
| `team_caption` | Text |
| `values` | Componente repetible `shared.value` (title: Text, text: Text) |

**GlobalConfig**
| Campo | Tipo |
|-------|------|
| `whatsapp_number` | Text (sin +, con código de país) |
| `contact_email` | Email |
| `instagram_url` | Text |
| `facebook_url` | Text |
| `tiktok_url` | Text |
| `business_hours` | Text |
| `address` | Text |

## Permisos en Strapi

**Settings → Users & Permissions → Roles → Public:**

| Content Type | find | findOne | create |
|---|---|---|---|
| Product | ✅ | ✅ | — |
| Category | ✅ | — | — |
| Testimonial | ✅ | — | — |
| HomePage | ✅ | — | — |
| AboutPage | ✅ | — | — |
| GlobalConfig | ✅ | — | — |
| QuoteRequest | — | — | ✅ |
