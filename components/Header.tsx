'use client'

import Image from 'next/image'
import { Search, Bell, Menu, X, Download, Smartphone } from 'lucide-react'
import Link from 'next/link'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  // Track scroll position to adjust header positioning
  useEffect(() => {
    const handleScroll = () => {
      // Determine if we've scrolled past the top bar (approx 1.5rem = 24px)
      const isScrolled = window.scrollY > 24
      setScrolled(isScrolled)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={`fixed ${scrolled ? 'top-0' : 'top-[calc(1.5rem)]'} left-0 right-0 z-50 bg-primary-red text-white border-b border-light-gray w-full shadow-md transition-all duration-200`}
    >
      {/* Main header area */}
      <div className="container mx-auto px-3 py-2 md:py-3 flex justify-between items-center">
        {/* Left section - Menu and Search */}
        <div className="flex items-center">
          {/* Mobile menu toggle */}
          <button
            className="mr-3 md:mr-4 flex items-center text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 md:w-6 md:h-6 mr-1 md:mr-2" />
            ) : (
              <Menu className="w-5 h-5 md:w-6 md:h-6 mr-1 md:mr-2" />
            )}
            <span className="font-bold text-xs md:text-sm hidden sm:inline">SECCIONES</span>
          </button>
          <button className="text-white" aria-label="Search">
            <Search className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Center section - Logo */}
        <div className="flex-1 flex justify-center">
          <Link href="/" className="text-center">
            {/* Use a smaller logo size on mobile */}
            <div className="relative h-8 w-32 sm:h-10 sm:w-48 md:h-16 md:w-64">
              <Image
                src="/images/logo.svg"
                alt="Noticias Logo"
                fill
                priority
                style={{ objectFit: 'contain' }}
                className="brightness-0 invert"
              />
            </div>
          </Link>
        </div>

        {/* Right section - Bell icon and app button */}
        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
          <button className="text-white p-1" aria-label="Notifications">
            <Bell className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          
          {/* App Download Button - Truly Mobile Friendly */}
          <Button
            variant="outline"
            size="sm"
            className="px-1.5 py-1 h-auto bg-white text-[#ff0808] border-2 border-white hover:bg-[#ff0808] hover:text-white hover:border-white transition-all duration-200 flex items-center gap-1 sm:gap-2 font-bold shadow-md"
          >
            <div className="bg-[#ff0808] text-white rounded-full p-1 flex items-center justify-center shrink-0">
              <Smartphone className="h-3 w-3" />
            </div>
            <div className="flex flex-col items-start leading-none sm:leading-normal">
              <span className="text-[9px] sm:text-xs">VOLGA BENEFICIOS </span>
              <span className="text-[10px] sm:text-sm font-extrabold"> APP</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Mobile menu - slides down when menu is open */}
      <div
        className={`${
          mobileMenuOpen ? 'max-h-screen py-2' : 'max-h-0 py-0 overflow-hidden'
        } transition-all duration-300 ease-in-out bg-white text-dark-gray`}
      >
        <div className="container mx-auto px-4">
          <nav className="flex flex-col">
            {/* Mobile menu links */}
            {[
              'Política',
              'Economía',
              'Sociedad',
              'Mundo',
              'Opinión',
              'Deportes',
              'Lifestyle',
            ].map((item) => (
              <Link
                key={item}
                href="#"
                className="py-2 border-b border-light-gray text-dark-gray hover:text-primary-red text-sm md:text-base"
              >
                {item}
              </Link>
            ))}
            {/* Additional mobile-only links */}
            <div className="pt-3 pb-2">
              <Link
                href="#"
                className="block py-1.5 text-dark-gray hover:text-primary-red text-sm"
              >
                Mi Cuenta
              </Link>
              <Link
                href="#"
                className="block py-1.5 text-dark-gray hover:text-primary-red text-sm"
              >
                Newsletters
              </Link>
              <Link
                href="#"
                className="block py-1.5 text-dark-gray hover:text-primary-red text-sm"
              >
                Club LA NACIÓN
              </Link>
              <Link
                href="#"
                className="block py-1.5 text-dark-gray hover:text-primary-red text-sm"
              >
                Ayuda
              </Link>
            </div>
            {/* Mobile subscribe button */}
            <div className="pt-3 pb-2">
              <button className="bg-primary-red text-white rounded px-4 py-2 text-sm font-medium w-full hover:bg-opacity-90 transition-opacity">
                SUSCRIBIRSE
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}