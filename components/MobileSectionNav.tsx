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
  { name: 'Lifestyle', href: '/lifestyle' },
]

export default function MobileSectionNav() {
  const pathname = usePathname()
  const scrollDirection = useScrollDirection()

  return (
    <nav
      className={`md:hidden fixed top-[60px] left-0 right-0 z-[40] bg-primary-red text-white border-b border-light-gray transition-transform duration-300 ease-out ${
        scrollDirection === 'down' ? '-translate-y-[104px]' : 'translate-y-0'
      }`}
    >
      <div
        className="flex items-center px-4 space-x-6 whitespace-nowrap overflow-x-auto scrollbar-hide"
        style={{
          height: '48px',
          minHeight: '48px',
          maxHeight: '48px',
          paddingTop: '8px',
          paddingBottom: '8px',
          boxSizing: 'border-box'
        }}
      >
        {sections.map((section) => {
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
                whiteSpace: 'nowrap'
              }}
              aria-current={isActive ? 'page' : undefined}
            >
              {section.name}
            </Link>
          )
        })}
      </div>

      <style jsx>{`
        nav {
          height: 48px !important;
          min-height: 48px !important;
        }
      `}</style>
    </nav>
  )
}
