'use client'
import { useScroll, motion } from 'framer-motion'

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[200] h-[2px] origin-left bg-orange-500"
      style={{ scaleX: scrollYProgress }}
    />
  )
}
