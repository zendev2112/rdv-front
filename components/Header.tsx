'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, Bell, ChevronDown, ChevronUp } from 'lucide-react'
import { useScrollDirection } from './hooks/useScrollDirection'
import SearchBar from './SearchBar'

// ✅ Mobile horizontal sections
const mobileSections = [
  { name: 'Inicio', href: '/' },
  { name: 'Coronel Suárez', href: '/coronel-suarez' },
  { name: 'Pueblos Alemanes', href: '/pueblos-alemanes' },
  { name: 'Huanguelén', href: '/huanguelen' },
  { name: 'La Sexta', href: '/la-sexta' },
  { name: 'Agro', href: '/agro' },
  { name: 'Lifestyle', href: '/lifestyle' },
]

// ✅ Desktop dropdown menu sections (keep your existing structure)
const menuSections = [
  {
    label: 'Coronel Suárez',
    href: '/coronel-suarez',
    children: [],
  },
  {
    label: 'Pueblos Alemanes',
    href: '/pueblos-alemanes',
    children: [
      { label: 'Santa Trinidad', href: '/pueblos-alemanes/santa-trinidad' },
      { label: 'San José', href: '/pueblos-alemanes/san-jose' },
      { label: 'Santa María', href: '/pueblos-alemanes/santa-maria' },
    ],
  },
  {
    label: 'Huanguelén',
    href: '/huanguelen',
    children: [],
  },
  {
    label: 'La Sexta',
    href: '/la-sexta',
    children: [],
  },
  {
    label: 'Agro',
    href: '/agro',
    children: [],
  },
  {
    label: 'Lifestyle',
    href: '/lifestyle',
    children: [],
  },
  {
    label: 'Farmacias de Turno',
    href: '/farmacias-de-turno',
    children: [],
  },
]

export default function Header() {
  const scrollDirection = useScrollDirection()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openSections, setOpenSections] = useState<Set<string>>(new Set())
  const [searchOpen, setSearchOpen] = useState(false)

  const toggleSection = (sectionLabel: string) => {
    const newOpenSections = new Set(openSections)
    if (newOpenSections.has(sectionLabel)) {
      newOpenSections.delete(sectionLabel)
    } else {
      newOpenSections.add(sectionLabel)
    }
    setOpenSections(newOpenSections)
  }

  const renderMenu = (sections: typeof menuSections) => {
    return sections.map((section) => {
      const hasChildren = section.children && section.children.length > 0
      const isExpanded = openSections.has(section.label)

      if (hasChildren) {
        return (
          <div key={section.label} className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <Link
                href={section.href!}
                className="flex-1 py-3 px-4 hover:bg-gray-50 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {section.label}
              </Link>
              <button
                onClick={() => toggleSection(section.label)}
                className="px-4 py-3 hover:bg-gray-50"
                aria-label={`Toggle ${section.label} subsections`}
              >
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>

            {isExpanded && (
              <div className="bg-gray-50 pl-6">
                {section.children!.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="block py-2 px-4 text-sm hover:text-primary-red hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )
      }

      return (
        <Link
          key={section.href}
          href={section.href!}
          className="block py-3 px-4 border-b border-gray-200 hover:bg-gray-50 font-medium"
          onClick={() => setMobileMenuOpen(false)}
        >
          {section.label}
        </Link>
      )
    })
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-primary-red text-white w-full shadow-md transition-transform duration-300 ease-out ${
          scrollDirection === 'down' ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        {/* Desktop/Main Header */}
        <div className="w-full px-4 py-3 md:py-4 flex items-center border-b border-white/10 md:border-b-0">
          <div className="hidden md:flex w-full mx-auto max-w-screen-lg items-center">
            <div className="flex items-center gap-3 flex-1 -ml-5">
              <button
                className="text-white p-1"
                aria-label="Abrir menú"
                onClick={() => setMobileMenuOpen((open) => !open)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
              <span className="text-white font-bold text-xs md:text-sm uppercase">
                SECCIONES
              </span>
              <button
                className="text-white p-1 ml-2"
                aria-label="Buscar"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
            <div className="flex justify-center flex-1">
              <Link href="/" className="text-center">
                <div className="relative h-12 w-40 sm:h-14 sm:w-44 md:h-18 md:w-60 lg:h-18 lg:w-60 xl:h-18 xl:w-60">
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
            <div className="flex justify-end flex-1 -mr-5">
              <button className="text-white p-1" aria-label="Notifications">
                <Bell className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="flex w-full items-center justify-between md:hidden">
            <div className="flex-1" />
            <div className="flex justify-center flex-1">
              <Link href="/" className="text-center">
                <div className="relative h-12 w-40">
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
            <div className="flex justify-end flex-1">
              <button className="text-white p-1" aria-label="Notifications">
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ✅ MOBILE SECTION NAV - INTEGRATED HERE */}
        <nav className="md:hidden w-full border-t border-white/10">
          <div
            className="flex items-center px-4 space-x-6 whitespace-nowrap overflow-x-auto scrollbar-hide"
            style={{
              height: '48px',
              minHeight: '48px',
              alignItems: 'center',
            }}
          >
            {mobileSections.map((section) => {
              const isActive = pathname === section.href
              return (
                <Link
                  key={section.href}
                  href={section.href}
                  className={`font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 flex-shrink-0 ${
                    isActive
                      ? 'text-white bg-white/10 px-3 py-1.5 rounded-md'
                      : 'text-white/90 hover:text-white'
                  }`}
                  style={{
                    fontSize: '14px',
                    lineHeight: '20px',
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {section.name}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Desktop/Mobile Dropdown Menu */}
        <div
          className={`${
            mobileMenuOpen
              ? 'max-h-[80vh] py-4'
              : 'max-h-0 py-0 overflow-hidden'
          } transition-all duration-300 ease-in-out bg-white text-gray-800 shadow-lg`}
        >
          <div className="container mx-auto px-4">
            <div className="max-h-[70vh] overflow-y-auto">
              <nav className="flex flex-col">{renderMenu(menuSections)}</nav>
            </div>
          </div>
        </div>
      </header>

      <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
