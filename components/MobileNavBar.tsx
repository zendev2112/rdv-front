'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Home, LayoutGrid, Tv, Search } from 'lucide-react'
import SearchBar from './SearchBar'

const YOUTUBE_CHANNEL_ID = 'UCp-yOJF49Ps2gLJvWZ3nr8A'
const YOUTUBE_WEB_URL = `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}`
const YOUTUBE_INTENT_URL = `intent://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}#Intent;package=com.google.android.youtube;scheme=https;end`

export default function MobileNavBar() {
  const [searchOpen, setSearchOpen] = useState(false)

  const handleVolgaTVClick = (e: React.MouseEvent) => {
    e.preventDefault()

    // Detect if user is on Android
    const isAndroid = /android/i.test(navigator.userAgent)

    if (isAndroid) {
      // Try Android intent (opens app or prompts to install)
      window.location.href = YOUTUBE_INTENT_URL
    } else {
      // For iOS/other, try youtube:// scheme
      const youtubeAppUrl = `youtube://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}`
      window.location.href = youtubeAppUrl

      // Fallback to web if app doesn't open
      setTimeout(() => {
        window.location.href = YOUTUBE_WEB_URL
      }, 1500)
    }
  }

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-primary-red text-white border-t border-light-gray shadow-lg flex justify-around items-center h-14 xl:hidden">
        <Link
          href="/"
          className="flex flex-col items-center text-xs text-white/95 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <Home className="w-5 h-5 mb-0.5 text-current" />
          Inicio
        </Link>
        <Link
          href="/secciones"
          className="flex flex-col items-center text-xs text-white/95 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <LayoutGrid className="w-5 h-5 mb-0.5 text-current" />
          Secciones
        </Link>
        <a
          href={YOUTUBE_WEB_URL}
          onClick={handleVolgaTVClick}
          className="flex flex-col items-center text-xs text-white/95 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <Tv className="w-5 h-5 mb-0.5 text-current" />
          VOLGA TV
        </a>
        {/* ✅ UPDATED: BUTTON INSTEAD OF LINK - OPENS SEARCH MODAL */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex flex-col items-center text-xs text-white/95 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <Search className="w-5 h-5 mb-0.5 text-current" />
          Buscar
        </button>
      </nav>

      {/* ✅ ADD SEARCH BAR COMPONENT */}
      <SearchBar
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        isMobile
      />
    </>
  )
}
