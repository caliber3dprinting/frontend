'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import PageLoader from '@/components/ui/PageLoader'
import ScrollProgressBar from '@/components/ui/ScrollProgressBar'
import type { GlobalConfig, Category } from '@/lib/types'

interface SiteChromeProps {
  children: React.ReactNode
  config: GlobalConfig
  categories: Category[]
}

export default function SiteChrome({ children, config, categories }: SiteChromeProps) {
  const pathname = usePathname()
  const isStudio = pathname?.startsWith('/studio')

  if (isStudio) {
    return <>{children}</>
  }

  return (
    <>
      <PageLoader />
      <ScrollProgressBar />
      <Navbar whatsapp={config.whatsapp_number} />
      <main className="min-h-screen">{children}</main>
      <Footer config={config} categories={categories} />
    </>
  )
}
