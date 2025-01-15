'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <motion.footer 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 py-4 text-center backdrop-blur-md bg-white/10 border-t border-white/10"
    >
      <p className="text-ms flex items-center justify-center gap-1 text-[#7752ae]/70">
        Made with <Heart className="w-4 h-4 text-pink-500 fill-pink-500" /> in India
      </p>
    </motion.footer>
  )
} 