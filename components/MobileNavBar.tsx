'use client'

import Link from 'next/link'
import { Home, LayoutGrid, Tv, Search } from 'lucide-react'

const YOUTUBE_CHANNEL_ID = 'UCp-yOJF49Ps2gLJvWZ3nr8A'
const YOUTUBE_APP_URL = `youtube://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}`
const YOUTUBE_WEB_URL = `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}`

export default function MobileNavBar() {
  const handleVolgaTVClick = (e: React.MouseEvent) => {
    e.preventDefault()
    // Try to open in YouTube app
    window.location.href = YOUTUBE_APP_URL
    // Fallback to web after a short delay
    setTimeout(() => {
      window.location.href = YOUTUBE_WEB_URL
    }, 500)
  }

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
      <a
        href={YOUTUBE_WEB_URL}
        onClick={handleVolgaTVClick}
        className="flex flex-col items-center text-xs text-gray-700 hover:text-primary-red"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Tv className="w-5 h-5 mb-0.5" />
        VOLGA TV
      </a>
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
