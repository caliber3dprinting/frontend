import { getHomePage, getFeaturedProducts, getTestimonials } from '@/lib/strapi'
import HeroSection from '@/components/home/HeroSection'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import AboutPreview from '@/components/home/AboutPreview'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import QuoteCTA from '@/components/home/QuoteCTA'

export const revalidate = 3600

export default async function HomePage() {
  // Todas las llamadas corren en paralelo; si algún content type
  // todavía no existe en Strapi, se usa un fallback vacío.
  const [homeData, products, testimonials] = await Promise.all([
    getHomePage().catch(() => ({
      hero_title: 'Impresión 3D de alta precisión',
      hero_subtitle: 'Servicio de impresiones 3D con precisión milimétrica',
      hero_cta_label: 'Solicitar Presupuesto',
      hero_image: null,
      about_preview_title: 'Conoce Caliber 3D',
      about_preview_text:
        'De la idea a la realidad con precisión milimétrica. Desde nuestro taller en Playa del Carmen, operamos más de 5 impresoras 3D listas para materializar tus ideas. Fabricamos repuestos, piezas únicas y soluciones técnicas enfocadas en la durabilidad, el acabado perfecto y el diseño a medida.',
      about_preview_image: null,
    })),
    getFeaturedProducts(6).catch(() => []),
    getTestimonials(4).catch(() => []),
  ])

  return (
    <>
      <HeroSection data={homeData} />
      <FeaturedProducts products={products} />
      <AboutPreview data={homeData} />
      <TestimonialsSection testimonials={testimonials} />
      <QuoteCTA />
    </>
  )
}
