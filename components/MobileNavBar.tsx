import Link from 'next/link'
import { Home, LayoutGrid, Tv, Search } from 'lucide-react'

export default function MobileNavBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg flex justify-around items-center h-14 lg:hidden">
      <Link
        href="/"
        className="flex flex-col items-center text-xs text-gray-700 hover:text-primary-red"
      >
        <Home className="w-5 h-5 mb-0.5" />
        Inicio
      </Link>
      <Link
        href="/secciones"
        className="flex flex-col items-center text-xs text-gray-700 hover:text-primary-red"
      >
        <LayoutGrid className="w-5 h-5 mb-0.5" />
        Secciones
      </Link>
      <Link
        href="/tv"
        className="flex flex-col items-center text-xs text-gray-700 hover:text-primary-red"
      >
        <Tv className="w-5 h-5 mb-0.5" />
        VOLGA TV
      </Link>
      <Link
        href="/buscar"
        className="flex flex-col items-center text-xs text-gray-700 hover:text-primary-red"
      >
        <Search className="w-5 h-5 mb-0.5" />
        Buscar
      </Link>
    </nav>
  )
}
