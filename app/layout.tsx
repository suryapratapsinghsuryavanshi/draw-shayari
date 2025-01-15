import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MouseFollower from '@/components/MouseFollower'
import './globals.css'

export const metadata: Metadata = {
  title: 'Draw Shayari',
  description: 'Create beautiful shayari images',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-[#f8f2ff] via-[#f0e6ff] to-[#fdf2ff]">
        <MouseFollower />
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
