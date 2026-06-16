# SEO Setup — Checklist manual (Google Search Console + Bing)

Hoy el sitio no aparece en Google ni buscando "caliber3d.mx". Estos pasos se
ejecutan **una vez** desde tus cuentas de Google/Bing; el código ya está listo
para soportarlos.

## 1. Verificar la propiedad en Google Search Console

Entrá a https://search.google.com/search-console y agregá la propiedad
`https://caliber3d.mx`. Dos métodos:

### Opción A — DNS (recomendado, cubre todo el dominio)
Agregá el registro TXT que te da GSC en tu DNS (Cloudflare). Es el método más
robusto y no depende del deploy.

### Opción B — Meta tag (ya soportado en el código)
1. GSC te da un tag tipo `<meta name="google-site-verification" content="XXXX" />`.
2. Copiá **solo el valor** `XXXX` y seteá la env var en Cloudflare Pages:
   ```
   GOOGLE_SITE_VERIFICATION=XXXX
   ```
3. Redeploy. El `layout.tsx` inyecta el meta tag automáticamente cuando la env
   var existe (vía `metadata.verification.google` de Next.js).
4. En GSC, tocá "Verificar".

## 2. Enviar el sitemap
En GSC → **Sitemaps** → enviar:
```
https://caliber3d.mx/sitemap.xml
```

## 3. Solicitar indexación de las URLs prioritarias
En GSC → **Inspección de URLs**, pegá cada una y "Solicitar indexación":
- https://caliber3d.mx/
- https://caliber3d.mx/catalogo
- https://caliber3d.mx/cotizar
- https://caliber3d.mx/calculadora
- https://caliber3d.mx/nosotros
- https://caliber3d.mx/blog
- Los 3-4 posts de blog más fuertes (los que ya tengan tráfico o mejor contenido)

## 4. Conectar GSC con GA4
GA4 → **Administrar → Vinculación de productos → Search Console** → vincular la
propiedad. Permite ver consultas de búsqueda dentro de GA4.

## 5. Bing Webmaster Tools
https://www.bing.com/webmasters — agregá el sitio (podés **importar desde GSC**
en un clic) y enviá el mismo sitemap `https://caliber3d.mx/sitemap.xml`.

---

## Notas técnicas (ya implementadas en el repo)
- `robots.txt` apunta al sitemap y bloquea `/admin`, `/studio`, `/api`, `/sign-in`, `/sign-up`.
- `sitemap.xml` se genera dinámicamente desde Sanity (productos + posts) más las rutas estáticas.
- GA4 ya **no** trackea `/studio` ni `/admin` (eliminaba ruido de admin como las vistas "New Categoría").
- JSON-LD (`LocalBusiness`, `Product`, `Article`, `BreadcrumbList`, `Organization`) inyectado por ruta.

## Pendiente de datos reales
- `streetAddress` exacto para el `LocalBusiness` (hoy solo localidad/CP).
- Perfil de TikTok para `sameAs` (hoy solo Instagram y Facebook).
