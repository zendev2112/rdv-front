'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Image from 'next/image'
import {
  Search,
  Bell,
  Menu,
  X,
  Download,
  Smartphone,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'

// --- 1. Updated menu structure - Pymes y Emprendimientos as its own section ---
const menuSections = [
  { label: 'Radio del Volga', href: '/radio-del-volga' },
  { label: 'Mapa del Sitio', href: '/mapa-del-sitio' },
  { label: 'Coronel Suárez', href: '/coronel-suarez' },
  {
    label: 'Pueblos Alemanes',
    children: [
      { label: 'Santa Trinidad', href: '/santa-trinidad' },
      { label: 'San José', href: '/san-jose' },
      { label: 'Santa María', href: '/santa-maria' },
    ],
  },
  { label: 'Huanguelén', href: '/huanguelen' },
  { label: 'La Sexta', href: '/la-sexta' },
  { label: 'Política', href: '/politica' },
  {
    label: 'Economía',
    children: [
      { label: 'Actualidad', href: '/economia/actualidad' },
      { label: 'Dólar', href: '/economia/dolar' },
      { label: 'Propiedades', href: '/economia/propiedades' },
    ],
  },
  {
    label: 'Pymes y Emprendimientos',
    children: [
      { label: 'Inmuebles', href: '/pymes/inmuebles' },
      { label: 'Campos', href: '/pymes/campos' },
      { label: 'Construcción y Diseño', href: '/pymes/construccion-diseno' },
    ],
  },
  {
    label: 'Agro',
    children: [
      { label: 'Agricultura', href: '/agro/agricultura' },
      { label: 'Ganadería', href: '/agro/ganaderia' },
      { label: 'Tecnologías', href: '/agro/tecnologias' },
    ],
  },
  {
    label: 'Sociedad',
    children: [
      { label: 'Educación', href: '/sociedad/educacion' },
      { label: 'Policiales', href: '/sociedad/policiales' },
      { label: 'Efemérides', href: '/sociedad/efemerides' },
      { label: 'Ciencia', href: '/sociedad/ciencia' },
    ],
  },
  {
    label: 'Salud',
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

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openSections, setOpenSections] = useState(new Set())

  // Toggle subsection visibility
  const toggleSection = (sectionLabel) => {
    const newOpenSections = new Set(openSections)
    if (newOpenSections.has(sectionLabel)) {
      newOpenSections.delete(sectionLabel)
    } else {
      newOpenSections.add(sectionLabel)
    }
    setOpenSections(newOpenSections)
  }

  // --- Render menu with collapsible subsections ---
  const renderMenu = (items, level = 0) => {
    return (
      <ul className={level === 0 ? 'pl-0' : 'pl-4'}>
        {items.map((item) => (
          <li key={item.label} className="mb-1">
            {item.href ? (
              <Link
                href={item.href}
                className={`block py-2 text-gray-800 hover:text-primary-red text-sm ${
                  level === 0 ? 'font-semibold' : ''
                } transition-colors`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ) : (
              <button
                onClick={() => toggleSection(item.label)}
                className="w-full flex items-center justify-between py-2 text-gray-800 text-sm font-semibold hover:text-primary-red transition-colors"
              >
                <span>{item.label}</span>
                {openSections.has(item.label) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            )}
            {item.children && openSections.has(item.label) && (
              <div className="overflow-hidden">
                {renderMenu(item.children, level + 1)}
              </div>
            )}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary-red text-white border-b border-light-gray w-full shadow-md transition-all duration-200">
      {/* Main header area */}
      <div className="container mx-auto px-3 py-2 md:py-3 flex justify-between items-center">
        {/* Left section - Menu and Search */}
        <div className="flex items-center">
          {/* Mobile menu toggle */}
          <button
            className="text-white p-2"
            aria-label="Abrir menú"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Center section - Logo */}
        <div className="flex-1 flex justify-center">
          <Link href="/" className="text-center">
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
              <span className="text-[10px] sm:text-sm font-extrabold">
                {' '}
                APP
              </span>
            </div>
          </Button>
        </div>
      </div>

      {/* Mobile and Desktop menu - slides down when menu is open */}
      <div
        className={`${
          mobileMenuOpen ? 'max-h-[80vh] py-4' : 'max-h-0 py-0 overflow-hidden'
        } transition-all duration-300 ease-in-out bg-white text-gray-800 shadow-lg`}
      >
        <div className="container mx-auto px-4">
          <div className="max-h-[70vh] overflow-y-auto">
            <nav className="flex flex-col">
              {/* Menu links */}
              {renderMenu(menuSections)}
              {/* Subscribe button */}
              <div className="pt-4 pb-2 border-t border-gray-200 mt-4">
                <button className="bg-primary-red text-white rounded px-4 py-2 text-sm font-medium w-full hover:bg-opacity-90 transition-opacity">
                  SUSCRIBIRSE
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
