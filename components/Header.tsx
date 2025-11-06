'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Image from 'next/image'
import { useScrollDirection } from './hooks/useScrollDirection'
import { usePathname } from 'next/navigation'
import {
  Search,
  Bell,
  Menu,
  X,
  Download,
  Smartphone,
  ChevronDown,
  ChevronUp,
  ChevronRight,
} from 'lucide-react'
import SearchBar from './SearchBar'

// --- 1. Updated menu structure - Pymes y Emprendimientos as its own section ---
const menuSections = [
  { label: 'Radio del Volga', href: '/radio-del-volga' },
  { label: 'Mapa del Sitio', href: '/mapa-del-sitio' },
  { label: 'Coronel Suárez', href: '/coronel-suarez' },
  {
    label: 'Pueblos Alemanes',
    href: '/pueblos-alemanes',
    children: [
      { label: 'Santa Trinidad', href: '/santa-trinidad' },
      { label: 'San José', href: '/san-jose' },
      { label: 'Santa María', href: '/santa-maria' },
    ],
  },
  { label: 'Huanguelén', href: '/huanguelen' },
  { label: 'La Sexta', href: '/la-sexta' },
  { label: 'Política', href: '/politica' },
  { label: 'Actualidad', href: '/actualidad' },
  {
    label: 'Economía',
    href: '/economia',
    children: [
      { label: 'Dólar', href: '/economia/dolar' },
      { label: 'Propiedades', href: '/economia/propiedades' },
    ],
  },
  {
    label: 'Pymes y Emprendimientos',
    href: '/pymes-emprendimientos',
    children: [
      { label: 'Inmuebles', href: '/pymes/inmuebles' },
      { label: 'Campos', href: '/pymes/campos' },
      { label: 'Construcción y Diseño', href: '/pymes/construccion-diseno' },
    ],
  },
  {
    label: 'Agro',
    href: '/agro',
    children: [
      { label: 'Agricultura', href: '/agro/agricultura' },
      { label: 'Ganadería', href: '/agro/ganaderia' },
      { label: 'Tecnologías', href: '/agro/tecnologias' },
    ],
  },
  {
    label: 'Sociedad',
    href: '/sociedad',
    children: [
      { label: 'Educación', href: '/sociedad/educacion' },
      { label: 'Policiales', href: '/sociedad/policiales' },
      { label: 'Efemérides', href: '/sociedad/efemerides' },
      { label: 'Ciencia', href: '/sociedad/ciencia' },
    ],
  },
  {
    label: 'Salud',
    href: '/salud',
    children: [
      { label: 'Vida en Armonía', href: '/salud/vida-en-armonia' },
      { label: 'Nutrición y energía', href: '/salud/nutricion-energia' },
      { label: 'Fitness', href: '/salud/fitness' },
      { label: 'Salud mental', href: '/salud/salud-mental' },
    ],
  },
  { label: 'Cultura', href: '/cultura' },
  { label: 'Opinión', href: '/opinion' },
  { label: 'Deportes', href: '/deportes' },
  {
    label: 'Lifestyle',
    href: '/lifestyle',
    children: [
      { label: 'Turismo', href: '/lifestyle/turismo' },
      { label: 'Horóscopo', href: '/lifestyle/horoscopo' },
      { label: 'Feriados', href: '/lifestyle/feriados' },
      { label: 'Loterías y Quinielas', href: '/lifestyle/loterias-quinielas' },
      { label: 'Moda y Belleza', href: '/lifestyle/moda-belleza' },
      { label: 'Mascotas', href: '/lifestyle/mascotas' },
    ],
  },
  { label: 'Volga Beneficios', href: '/volga-beneficios' },
  { label: 'Vinos', href: '/vinos' },
  { label: 'El Recetario', href: '/el-recetario' },
]

const sections = [
  { name: 'Inicio', href: '/' },
  { name: 'Coronel Suárez', href: '/coronel-suarez' },
  { name: 'Pueblos Alemanes', href: '/pueblos-alemanes' },
  { name: 'Huanguelén', href: '/huanguelen' },
  { name: 'La Sexta', href: '/la-sexta' },
  { name: 'Agro', href: '/agro' },
  { name: 'Lifestyle', href: '/lifestyle' },
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

  // --- Render menu with collapsible subsections ---
  const renderMenu = (sections: typeof menuSections) => {
    return sections.map((section) => {
      const hasChildren = section.children && section.children.length > 0
      const isExpanded = openSections.has(section.label)

      if (hasChildren) {
        return (
          <div key={section.label} className="border-b border-gray-200">
            {/* Parent section - clickable link with expand button */}
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

            {/* Subsections - shown when expanded */}
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

      // No children - direct link
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
        {/* Main header area */}
        <div className="w-full px-4 py-3 md:py-4 flex items-center border-b border-white/10 md:border-b-0">
          {/* Desktop: constrained inner flex, centered, with left/center/right */}
          <div className="hidden md:flex w-full mx-auto max-w-screen-lg items-center">
            {/* Left: nav */}
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
            {/* Center: logo */}
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
            {/* Right: bell */}
            <div className="flex justify-end flex-1 -mr-5">
              <button className="text-white p-1" aria-label="Notifications">
                <Bell className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </div>
          {/* Mobile: only logo (center) and bell (right) */}
          <div className="flex w-full items-center justify-between md:hidden">
            <div className="flex-1" /> {/* empty left */}
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

        {/* Mobile Section Navigation - INTEGRATED INSIDE HEADER */}
        <nav className="md:hidden w-full overflow-x-auto scrollbar-hide">
          <div className="flex items-center px-4 py-2 space-x-6 whitespace-nowrap">
            {sections.map((section) => {
              const isActive = pathname === section.href
              return (
                <Link
                  key={section.href}
                  href={section.href}
                  className={`text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 ${
                    isActive
                      ? 'text-white bg-white/10 px-3 py-1.5 rounded-md'
                      : 'text-white/90 hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {section.name}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Mobile and Desktop menu - slides down when menu is open */}
        <div
          className={`${
            mobileMenuOpen
              ? 'max-h-[80vh] py-4'
              : 'max-h-0 py-0 overflow-hidden'
          } transition-all duration-300 ease-in-out bg-white text-gray-800 shadow-lg`}
        >
          <div className="container mx-auto px-4">
            <div className="max-h-[70vh] overflow-y-auto">
              <nav className="flex flex-col">
                {/* Menu links */}
                {renderMenu(menuSections)}
              </nav>
            </div>
          </div>
        </div>
      </header>
      <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
