'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, Bell, ChevronRight } from 'lucide-react'
import { useScrollDirection } from './hooks/useScrollDirection'
import SearchBar from './SearchBar'

// ✅ MOBILE SECTIONS - KEEP AS IS (HARDCODED)
const mobileSections = [
  { name: 'Inicio', href: '/' },
  { name: 'Coronel Suárez', href: '/coronel-suarez' },
  { name: 'Pueblos Alemanes', href: '/pueblos-alemanes' },
  { name: 'Farmacias de Turno', href: '/farmacias-de-turno' },
  { name: 'Huanguelén', href: '/huanguelen' },
  { name: 'La Sexta', href: '/la-sexta' },
  { name: 'Actualidad', href: '/actualidad' },
  { name: 'Agro', href: '/agro' },
  { name: 'Economia', href: '/economia' },
  { name: 'Lifestyle', href: '/lifestyle' },
  { name: 'Deportes', href: '/deportes' },
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
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuSections, setMenuSections] = useState<MenuSection[]>([])
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // ✅ FETCH SECTIONS FOR DESKTOP MENU ONLY
  useEffect(() => {
    fetch('/api/sections')
      .then((res) => res.json())
      .then((data) => {
        if (data.sections) {
          const topLevelSections = data.sections.filter((s: Section) => s.level === 0)

          // ✅ Define the desired order
          const sectionOrder = [
            'Coronel Suárez',
            'Pueblos Alemanes',
            'Farmacias de Turno',
            'Huanguelén',
            'La Sexta',
            'Actualidad',
            'Agro',
            'Economia',
            'Lifestyle',
            'Deportes',
          ]

          // ✅ Sort sections by the desired order
          const sortedSections = topLevelSections.sort((a: Section, b: Section) => {
            const indexA = sectionOrder.indexOf(a.name)
            const indexB = sectionOrder.indexOf(b.name)
            return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
          })

          const menu = sortedSections.map((section: Section) => {
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

          // ✅ Insert "Farmacias de Turno" after "Pueblos Alemanes"
          const pueblosIndex = menu.findIndex(s => s.label === 'Pueblos Alemanes')
          if (pueblosIndex !== -1) {
            menu.splice(pueblosIndex + 1, 0, {
              label: 'Farmacias de Turno',
              href: '/farmacias-de-turno',
              children: [],
            })
          }

          setMenuSections(menu)
        }
      })
      .catch((error) => console.error('Error fetching sections:', error))
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-primary-red text-white w-full shadow-md transition-transform duration-300 ease-out ${
          scrollDirection === 'down' ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        {/* Desktop/Main Header */}
        <div className="w-full py-2 xl:py-7 flex justify-center items-center border-b border-white/10 xl:border-b-0">
          <div className="hidden xl:flex w-[70%] mx-auto items-center justify-between relative">
            {/* Left section - at left edge */}
            <div className="flex items-center gap-1 lg:gap-2 z-10">
              <button
                className={`text-white p-1 flex-shrink-0 ${mobileMenuOpen ? 'hidden' : ''}`}
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

            {/* Right section - at right edge */}
            <div className="flex z-10">
              <button
                className="text-white p-1 flex-shrink-0"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 lg:w-6 lg:h-6" />
              </button>
            </div>
          </div>

          {/* Tablet/Mobile Header (below 1280px) - NO left section */}
          <div className="flex xl:hidden w-full items-center justify-between px-4 py-1">
            <div className="flex-1" />
            <div className="flex justify-center flex-1">
              <Link href="/" className="text-center">
                <div className="relative h-10 w-32">
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
        <nav className="xl:hidden w-full border-t border-white/10 relative">
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
      </header>

      {/* ✅ DESKTOP SLIDING MENU PANEL - LEFT SIDELINE WIDTH (15%) */}
      <div
        className={`hidden xl:block fixed top-0 left-0 h-screen w-[15%] bg-white shadow-2xl z-[60] transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Menu Header */}
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between py-3 px-4">
            <div className="relative h-10 w-32">
              <Image
                src="/images/logo.svg"
                alt="Logo"
                fill
                style={{
                  objectFit: 'contain',
                  objectPosition: 'left center',
                  filter:
                    'invert(100%) sepia(2%) saturate(10%) hue-rotate(336deg) brightness(102%) contrast(106%)',
                }}
              />
            </div>
            <div className="flex items-center justify-center w-4 h-4">
              <X
                className="w-4 h-4 text-gray-800 cursor-pointer hover:opacity-70 transition-opacity"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Cerrar menú"
                style={{ display: 'block' }}
              />
            </div>
          </div>
        </div>


          <nav
            className="overflow-y-auto overflow-x-visible h-[calc(100vh-73px)]"
            style={{ overflowX: 'visible' }}
          >
            {menuSections.map((section) => {
              const hasChildren =
                section.children && section.children.length > 0
              const isHovered = hoveredSection === section.label

              return (
                <div 
                  key={section.label} 
                  className="border-b border-gray-200"
                  ref={(el) => {
                    if (el) sectionRefs.current[section.label] = el
                  }}
                >
                  <div
                    className="relative"
                    onMouseEnter={() => {
                      if (hasChildren) {
                        setHoveredSection(section.label)
                      }
                    }}
                    onMouseLeave={() => setHoveredSection(null)}
                  >
                    <Link
                      href={section.href}
                      className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 transition-colors text-gray-800 font-bold text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>{section.label}</span>
                      {hasChildren && (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )}
                    </Link>

                    {/* Submenu Panel - positioned relative to parent section */}
                    {hasChildren && isHovered && (
                      <div
                        className="fixed bg-white shadow-2xl border border-gray-200 min-w-[12rem] z-[70]"
                        style={{ 
                          left: '15%', 
                          top: sectionRefs.current[section.label]?.getBoundingClientRect().top || 0
                        }}
                        onMouseEnter={() => setHoveredSection(section.label)}
                        onMouseLeave={() => setHoveredSection(null)}
                      >
                        {section.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block py-2 px-4 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-primary-red transition-colors whitespace-nowrap"
                            onClick={() => {
                              setMobileMenuOpen(false)
                              setHoveredSection(null)
                            }}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </nav>
        </div>
      

      {/* Overlay */}
      {mobileMenuOpen && (
        <div
          className="hidden xl:block fixed inset-0 bg-black/50 z-[55]"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}