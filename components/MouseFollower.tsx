'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MouseFollower() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed pointer-events-none z-[-1] w-[500px] h-[500px] rounded-full"
        animate={{
          x: mousePosition.x - 250,
          y: mousePosition.y - 250,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 200,
          mass: 0.5,
        }}
        style={{
          background: 'radial-gradient(circle, rgba(169,84,245,0.15) 0%, rgba(207,78,194,0.08) 45%, rgba(255,255,255,0) 70%)',
        }}
      />
    </AnimatePresence>
  )
} 