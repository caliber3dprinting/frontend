import { getHomePage, getFeaturedProducts, getTestimonials } from '@/lib/strapi'
import HeroSection from '@/components/home/HeroSection'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import AboutPreview from '@/components/home/AboutPreview'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import QuoteCTA from '@/components/home/QuoteCTA'

// ISR: revalidar la home cada hora
export const revalidate = 3600

export default async function HomePage() {
  // Todas las llamadas corren en paralelo; si algún content type
  // todavía no existe en Strapi, se usa un fallback vacío.
  const [homeData, products, testimonials] = await Promise.all([
    getHomePage().catch(() => ({
      hero_title: 'Impresiones 3D a Medida',
      hero_subtitle: 'Fabricamos tus ideas en 3D en Playa del Carmen.',
      hero_cta_label: 'Solicitar cotización',
      hero_image: null,
      about_preview_title: 'Quiénes somos',
      about_preview_text:
        'Lorem ipsum dolor sit amet — aquí irá tu presentación. Contá quiénes son, cómo nació el emprendimiento y qué los diferencia. Este texto lo editás desde el panel de Strapi en HomePage → about_preview_text.',
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
