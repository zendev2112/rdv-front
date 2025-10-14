'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

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

  return (
    <nav className="md:hidden border-b border-gray-200 bg-white overflow-x-auto">
      <div className="flex items-center px-4 py-2 space-x-4 whitespace-nowrap">
        {sections.map((section) => {
          const isActive = pathname === section.href
          return (
            <Link
              key={section.href}
              href={section.href}
              className={`text-sm font-medium transition-colors ${
                isActive
                  ? 'text-primary-red border-b-2 border-primary-red pb-1'
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
