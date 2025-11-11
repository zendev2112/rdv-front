'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, Bell, ChevronDown, ChevronUp } from 'lucide-react'
import { useScrollDirection } from './hooks/useScrollDirection'
import SearchBar from './SearchBar'

// ✅ MOBILE SECTIONS - KEEP AS IS (HARDCODED)
const mobileSections = [
  { name: 'Inicio', href: '/' },
  { name: 'Coronel Suárez', href: '/coronel-suarez' },
  { name: 'Pueblos Alemanes', href: '/pueblos-alemanes' },
  { name: 'Huanguelén', href: '/huanguelen' },
  { name: 'La Sexta', href: '/la-sexta' },
  { name: 'Agro', href: '/agro' },
  { name: 'Lifestyle', href: '/lifestyle' },
]

interface Section {
  id: string
  name: string
  slug: string
  level: number
  parent_id: string | null
  breadcrumb_slugs: string[]
}

interface MenuSection {
  label: string
  href: string
  children: { label: string; href: string }[]
}

export default function Header() {
  const scrollDirection = useScrollDirection()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openSections, setOpenSections] = useState<Set<string>>(new Set())
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuSections, setMenuSections] = useState<MenuSection[]>([])

  // ✅ FETCH SECTIONS FOR DESKTOP MENU ONLY
  useEffect(() => {
    fetch('/api/sections')
      .then((res) => res.json())
      .then((data) => {
        if (data.sections) {
          const topLevelSections = data.sections.filter((s: Section) => s.level === 0)

          const menu = topLevelSections.map((section: Section) => {
            const children = data.sections
              .filter((s: Section) => s.parent_id === section.id)
              .map((child: Section) => ({
                label: child.name,
                href: `/${child.breadcrumb_slugs.join('/')}`,
              }))

            return {
              label: section.name,
              href: `/${section.slug}`,
              children,
            }
          })

          setMenuSections(menu)
        }
      })
      .catch((error) => console.error('Error fetching sections:', error))
  }, [])

  const toggleSection = (sectionLabel: string) => {
    const newOpenSections = new Set(openSections)
    if (newOpenSections.has(sectionLabel)) {
      newOpenSections.delete(sectionLabel)
    } else {
      newOpenSections.add(sectionLabel)
    }
    setOpenSections(newOpenSections)
  }

  const renderMenu = (sections: MenuSection[]) => {
    return sections.map((section) => {
      const hasChildren = section.children && section.children.length > 0
      const isExpanded = openSections.has(section.label)

      if (hasChildren) {
        return (
          <div key={section.label} className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <Link
                href={section.href}
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
                {section.children.map((child) => (
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
          href={section.href}
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
        <div className="w-full py-2 md:py-7 flex justify-center items-center border-b border-white/10 md:border-b-0">
          <div className="hidden md:flex w-full mx-auto px-4 xl:px-8 max-w-[1200px] items-center justify-between relative">
            {/* Left section */}
            <div className="flex items-center gap-1 lg:gap-2 z-10">
              <button
                className="text-white p-1 flex-shrink-0"
                aria-label="Abrir menú"
                onClick={() => setMobileMenuOpen((open) => !open)}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 lg:w-6 lg:h-6" />
                ) : (
                  <Menu className="w-5 h-5 lg:w-6 lg:h-6" />
                )}
              </button>
              <span className="text-white font-bold text-xs lg:text-sm uppercase whitespace-nowrap">
                SECCIONES
              </span>
              <button
                className="text-white p-1 flex-shrink-0"
                aria-label="Buscar"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="w-5 h-5 lg:w-6 lg:h-6" />
              </button>
            </div>

            {/* Center - Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Link href="/" className="text-center">
                <div className="relative h-12 w-40 sm:h-14 sm:w-44 lg:h-16 lg:w-52">
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

            {/* Right section */}
            <div className="flex z-10">
              <button className="text-white p-1 flex-shrink-0" aria-label="Notifications">
                <Bell className="w-5 h-5 lg:w-6 lg:h-6" />
              </button>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="flex w-full items-center justify-between md:hidden px-4 py-1">
            <div className="flex-1" />
            <div className="flex justify-center flex-1">
              <Link href="/" className="text-center">
                <div className="relative h-8 w-28">
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

        {/* ✅ MOBILE SECTION NAV - UNCHANGED (HARDCODED) */}
        <nav className="md:hidden w-full border-t border-white/10 relative">
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
                  className={`font-bold transition-all duration-200 focus:outline-none flex-shrink-0 px-2 py-2 rounded-full active:bg-white/20 ${
                    isActive ? 'text-white' : 'text-white/90 hover:text-white'
                  }`}
                  style={{
                    fontSize: '14px',
                    lineHeight: '20px',
                    position: 'relative',
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {section.name}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-2 right-2 bg-white"
                      style={{
                        height: '2px',
                        marginTop: '4px',
                      }}
                    />
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* ✅ DESKTOP DROPDOWN MENU - DYNAMIC FROM DATABASE */}
        <div
          className={`${
            mobileMenuOpen
              ? 'max-h-[80vh] py-4'
              : 'max-h-0 py-0 overflow-hidden'
          } transition-all duration-300 ease-in-out bg-white text-gray-800 shadow-lg`}
        >
          <div className="container mx-auto px-4 xl:px-8 max-w-[1200px]">
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
