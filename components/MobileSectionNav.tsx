'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useScrollDirection } from './hooks/useScrollDirection'
import { useEffect, useState } from 'react'

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
  const [screenWidth, setScreenWidth] = useState(0)

  useEffect(() => {
    // Get actual screen width (not viewport)
    setScreenWidth(window.screen.width)

    // Force consistent measurement
    const handleResize = () => {
      setScreenWidth(window.screen.width)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <nav
      className={`md:hidden fixed top-[60px] z-[40] bg-primary-red text-white border-b border-light-gray transition-transform duration-300 ease-out ${
        scrollDirection === 'down' ? '-translate-y-[104px]' : 'translate-y-0'
      }`}
      style={{
        left: 0,
        right: 0,
        width: screenWidth > 0 ? `${screenWidth}px` : '100vw',
      }}
    >
      <div className="flex items-center px-4 py-2 space-x-6 whitespace-nowrap overflow-x-auto scrollbar-hide">
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
