import { getFeaturedProducts, getTestimonials, getBlogPosts } from '@/lib/sanity'
import HeroSection from '@/components/home/HeroSection'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import AboutPreview from '@/components/home/AboutPreview'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import LatestPosts from '@/components/home/LatestPosts'
import QuoteCTA from '@/components/home/QuoteCTA'

export const revalidate = 60

const HOME_DATA = {
  hero_title: 'Impresión 3D de alta precisión',
  hero_subtitle: 'Enviamos a todo México | Taller físico en la Riviera Maya',
  hero_cta_label: 'Solicitar Presupuesto',
  hero_image: '/logo-en-3d.webp',
  about_preview_title: 'Conoce Caliber 3D',
  about_preview_text:
    'De la idea a la realidad con precisión milimétrica. Desde nuestro taller en Playa del Carmen, operamos más de 5 impresoras 3D listas para materializar tus ideas. Fabricamos repuestos, piezas únicas y soluciones técnicas enfocadas en la durabilidad, el acabado perfecto y el diseño a medida.',
  about_preview_image: '/maquina-produciendo-en-naranja.webp',
}

export default async function HomePage() {
  const [products, testimonials, blogResult] = await Promise.all([
    getFeaturedProducts(6).catch(() => []),
    getTestimonials(4).catch(() => []),
    getBlogPosts({ pageSize: 3 }).catch(() => ({ data: [], meta: { pagination: { page: 1, pageSize: 3, pageCount: 0, total: 0 } } })),
  ])

  return (
    <>
      <HeroSection data={HOME_DATA} />
      <FeaturedProducts products={products} />
      <AboutPreview data={HOME_DATA} />
      <TestimonialsSection testimonials={testimonials} />
      <LatestPosts posts={blogResult.data} />
      <QuoteCTA />
    </>
  )
}
