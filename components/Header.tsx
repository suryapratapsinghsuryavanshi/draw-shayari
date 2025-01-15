'use client'

import { motion } from 'framer-motion'
import { GithubIcon } from 'lucide-react'
import Link from 'next/link'

export default function Header() {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/10 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center"
          >
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Draw Shayari
            </h1>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="https://github.com/suryapratapsinghsuryavanshi/jrscript"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200 group"
            >
              <GithubIcon className="w-6 h-6 text-[#a954f5]/70 group-hover:text-[#cf4ec2] transition-colors duration-200" />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
} 