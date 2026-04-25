'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export default function PageLoader() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (document.readyState === 'complete') {
      setVisible(false)
      return
    }
    const onLoad = () => setVisible(false)
    window.addEventListener('load', onLoad)
    // Failsafe: never block content longer than 4s on very slow connections
    const timeout = setTimeout(() => setVisible(false), 4000)
    return () => {
      window.removeEventListener('load', onLoad)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-950"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <div className="relative flex items-center justify-center">
            {/* Outer spinning arc */}
            <motion.div
              className="absolute w-24 h-24 rounded-full border-2 border-zinc-800 border-t-orange-500"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
            />
            {/* Inner pulsing glow */}
            <motion.div
              className="absolute w-16 h-16 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)' }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <Image
                src="/caliber-3d-logo.svg"
                alt="Caliber 3D Printing"
                width={52}
                height={52}
                priority
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
