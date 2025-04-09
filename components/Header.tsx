'use client'

import Image from 'next/image'
import { Search, Bell, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-primary-red text-white border-b border-light-gray">
      {/* Main header area */}
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left section - Menu and Search */}
        <div className="flex items-center">
          {/* Mobile menu toggle */}
          <button 
            className="mr-4 flex items-center text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 mr-2" />
            ) : (
              <Menu className="w-6 h-6 mr-2" />
            )}
            <span className="font-bold hidden sm:inline">SECCIONES</span>
          </button>
          <button className="text-white">
            <Search className="w-6 h-6" />
          </button>
        </div>

        {/* Center section - Logo */}
        <div className="flex-1 flex justify-center">
          <Link href="/" className="text-center">
            {/* Use a smaller logo size on mobile */}
            <div className="relative h-10 w-48 sm:h-16 sm:w-64">
              {/* Fallback to text logo if image isn't available */}
              <div className="absolute inset-0 flex items-center justify-center">
 
              </div>
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

        {/* Right section - Bell icon and buttons with responsive design */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button className="text-white">
            <Bell className="w-6 h-6" />
          </button>
          {/* Hide login button on smallest screens */}
          <button className="hidden sm:block border border-white rounded px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium bg-transparent text-white hover:bg-white hover:text-primary-red transition-colors">
            INICIAR SESIÓN
          </button>
          {/* Simplified subscribe button for mobile */}
          <button className="bg-dark-gray text-white rounded px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium flex items-center hover:opacity-90 transition-opacity">
            <span className="bg-white text-primary-red rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center mr-1 sm:mr-2">
              <svg
                viewBox="0 0 24 24"
                className="w-2 h-2 sm:w-3 sm:h-3"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5V19M5 12H19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="hidden xs:inline">SUSCRIBITE</span> 
            <span className="hidden sm:inline">POR $900</span>
          </button>
        </div>
      </div>

      {/* Mobile menu - slides down when menu is open */}
      <div 
        className={`${
          mobileMenuOpen ? 'max-h-screen py-4' : 'max-h-0 py-0 overflow-hidden'
        } transition-all duration-300 ease-in-out bg-white text-dark-gray`}
      >
        <div className="container mx-auto px-4">
          <nav className="flex flex-col">
            {/* Mobile menu links */}
            {['Política', 'Economía', 'Sociedad', 'Mundo', 'Opinión', 'Deportes', 'Lifestyle'].map((item) => (
              <Link 
                key={item} 
                href="#" 
                className="py-3 border-b border-light-gray text-dark-gray hover:text-primary-red"
              >
                {item}
              </Link>
            ))}
            {/* Additional mobile-only links */}
            <div className="pt-4 pb-2">
              <Link href="#" className="block py-2 text-dark-gray hover:text-primary-red">
                Mi Cuenta
              </Link>
              <Link href="#" className="block py-2 text-dark-gray hover:text-primary-red">
                Newsletters
              </Link>
              <Link href="#" className="block py-2 text-dark-gray hover:text-primary-red">
                Club LA NACIÓN
              </Link>
              <Link href="#" className="block py-2 text-dark-gray hover:text-primary-red">
                Ayuda
              </Link>
            </div>
            {/* Mobile subscribe button */}
            <div className="pt-4 pb-2">
              <button className="bg-primary-red text-white rounded px-4 py-3 text-sm font-medium w-full hover:bg-opacity-90 transition-opacity">
                SUSCRIBIRSE
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}