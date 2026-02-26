'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Heart, Tag, MoreHorizontal } from 'lucide-react'

const NAV_ITEMS = [
  { icon: Home, label: 'Inicio', href: '/beneficios' },
  { icon: Search, label: 'Buscar', href: '/beneficios/buscar' },
  { icon: Tag, label: 'Ofertas', href: '/beneficios/ofertas' },
  { icon: Heart, label: 'Favoritos', href: '/beneficios/favoritos' },
  { icon: MoreHorizontal, label: 'Más', href: '/beneficios/mas' },
]

export default function BeneficiosFooter() {
  const pathname = usePathname()

  return (
    <nav
      className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-primary-red text-white border-t border-light-gray shadow-lg flex justify-around items-center h-14"
      aria-label="Navegación inferior"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon
        const isActive =
          pathname === item.href ||
          (item.href !== '/beneficios' && pathname.startsWith(item.href + '/'))

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            className="flex flex-col items-center text-xs focus:outline-none focus:ring-2 focus:ring-white/20"
            style={{
              color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.75)',
              textDecoration: 'none',
              fontWeight: isActive ? 700 : 400,
            }}
          >
            <Icon className="w-5 h-5 mb-0.5" strokeWidth={isActive ? 2.5 : 2} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
