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
      className={`md:hidden fixed top-[64px] left-0 right-0 z-[90] bg-primary-red text-white border-b border-light-gray overflow-x-auto scrollbar-hide transition-all duration-500 ease-in-out ${
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
  )
}
