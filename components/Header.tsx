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
  { label: 'Actualidad', href: '/actualidad' },
  {
    label: 'Economía',
    children: [
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
      {/* Main header area - INCREASED PADDING */}
      <div className="container mx-auto px-2 py-4 md:py-5 flex justify-between items-center relative">
        {/* Left section: only show on desktop */}
        <div className="hidden md:flex items-center gap-1.5 pl-0">
          <div className="-ml-6 md:-ml-8 flex items-center gap-1.5">
            {/* Mobile menu toggle */}
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

            {/* SECCIONES text */}
            <span className="text-white font-bold text-xs md:text-sm uppercase">
              SECCIONES
            </span>
          </div>

          {/* Magnifying glass icon */}
          <button className="text-white p-1 ml-2" aria-label="Buscar">
            <Search className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Center section - Logo - responsive size */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link href="/" className="text-center">
            <div className="relative h-12 w-40 sm:h-14 sm:w-44 md:h-14 md:w-40 lg:h-12 lg:w-36 xl:h-10 xl:w-32">
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

        {/* Right section - Bell icon */}
        <div className="flex items-center">
          <button className="text-white p-1" aria-label="Notifications">
            <Bell className="w-5 h-5 md:w-6 md:h-6" />
          </button>
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
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
