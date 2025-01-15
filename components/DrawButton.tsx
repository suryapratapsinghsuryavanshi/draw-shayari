'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import TextInputModal from './TextInputModal'
import { Motion, AnimatePresence } from 'framer-motion'
import { Paintbrush } from 'lucide-react'

export default function DrawButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 px-6 py-3 rounded-full shadow-lg hover:shadow-xl"
      >
        <Paintbrush 
          className={`w-5 h-5 transition-transform duration-300 ${
            isHovered ? 'rotate-12 scale-110' : ''
          }`}
        />
        <span className="font-medium">Start Drawing</span>
        <span className="absolute -z-10 inset-0 rounded-full bg-white/10 blur-sm transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
      </Button>

      <AnimatePresence>
        {isModalOpen && (
          <TextInputModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
          />
        )}
      </AnimatePresence>
    </>
  )
}

