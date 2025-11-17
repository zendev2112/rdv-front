'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useScrollDirection } from './hooks/useScrollDirection'

const sections = [
  { name: 'Inicio', href: '/' },
  { name: 'Coronel Suárez', href: '/coronel-suarez' },
  { name: 'Pueblos Alemanes', href: '/pueblos-alemanes' },
  { name: 'Huanguelén', href: '/huanguelen' },
  { name: 'La Sexta', href: '/la-sexta' },
  { name: 'Agro', href: '/agro' },
  { name: 'Actualidad', href: '/actualidad' },
  { name: 'Lifestyle', href: '/lifestyle' },
  { name: 'Deportes', href: '/deportes' },
  { name: 'IActualidad', href: '/iactualidad' },
]

export default function MobileSectionNav() {
  const pathname = usePathname()
  const scrollDirection = useScrollDirection()

  return (
    <nav
      className={`md:hidden fixed left-0 right-0 z-[40] bg-primary-red text-white border-b border-light-gray text-base transition-transform duration-300 ease-out ${
        scrollDirection === 'down' ? '-translate-y-full' : 'translate-y-0'
      }`}
      style={{
        top: '60px', // ✅ MOVED TO INLINE STYLE
        height: '48px',
        minHeight: '48px',
        maxHeight: '48px',
      }}
    >
      <div
        className="flex items-center px-4 space-x-6 whitespace-nowrap overflow-x-auto scrollbar-hide"
        style={{
          height: '48px', // ✅ EXPLICIT HEIGHT INSTEAD OF 100%
          minHeight: '48px',
          alignItems: 'center',
        }}
      >
        {sections.map((section) => {
          const isActive = pathname === section.href
          return (
            <Link
              key={section.href}
              href={section.href}
              className={`font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 flex-shrink-0 text-sm ${
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
  )
}
