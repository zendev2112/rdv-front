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
      className={`md:hidden fixed top-[64px] left-0 right-0 z-[90] bg-cream border-b border-gray-200 overflow-x-auto scrollbar-hide transition-all duration-500 ease-in-out ${
        scrollDirection === 'down' ? '-translate-y-[128px]' : 'translate-y-0'
      }`}
    >
      <div className="flex items-center px-4 py-3 space-x-6 whitespace-nowrap">
        {sections.map((section) => {
          const isActive = pathname === section.href
          return (
            <Link
              key={section.href}
              href={section.href}
              className={`text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-primary-red bg-white/50 px-3 py-1.5 rounded-md'
                  : 'text-gray-700 hover:text-primary-red'
              }`}
            >
              {section.name}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
