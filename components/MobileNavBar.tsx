import Link from 'next/link'
import { Home, Newspaper, Tv, ShoppingBag, User } from 'lucide-react'

export default function MobileNavBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg flex justify-around items-center h-14 lg:hidden">
      <Link href="/" className="flex flex-col items-center text-xs text-gray-700 hover:text-primary-red">
        <Home className="w-5 h-5 mb-0.5" />
        Inicio
      </Link>
      <Link href="/actualidad" className="flex flex-col items-center text-xs text-gray-700 hover:text-primary-red">
        <Newspaper className="w-5 h-5 mb-0.5" />
        Noticias
      </Link>
      <Link href="/tv" className="flex flex-col items-center text-xs text-gray-700 hover:text-primary-red">
        <Tv className="w-5 h-5 mb-0.5" />
        TV
      </Link>
      <Link href="/compras" className="flex flex-col items-center text-xs text-gray-700 hover:text-primary-red">
        <ShoppingBag className="w-5 h-5 mb-0.5" />
        Compras
      </Link>
      <Link href="/perfil" className="flex flex-col items-center text-xs text-gray-700 hover:text-primary-red">
        <User className="w-5 h-5 mb-0.5" />
        Perfil
      </Link>
    </nav>
  )
}