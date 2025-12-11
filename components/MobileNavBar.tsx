'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Home, LayoutGrid, Tv, Search, Play, Pause } from 'lucide-react'
import SearchBar from './SearchBar'

const YOUTUBE_CHANNEL_ID = 'UCp-yOJF49Ps2gLJvWZ3nr8A'
const YOUTUBE_WEB_URL = `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}`
const YOUTUBE_INTENT_URL = `intent://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}#Intent;package=com.google.android.youtube;scheme=https;end`
const RADIO_STREAM_URL = 'https://stream.xweb.ar/8056/stream'

export default function MobileNavBar() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  const handleVolgaTVClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const isAndroid = /android/i.test(navigator.userAgent)

    if (isAndroid) {
      window.location.href = YOUTUBE_INTENT_URL
    } else {
      const youtubeAppUrl = `youtube://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}`
      window.location.href = youtubeAppUrl
      setTimeout(() => {
        window.location.href = YOUTUBE_WEB_URL
      }, 1500)
    }
  }

  const handleRadioToggle = () => {
    if (!audio) {
      const newAudio = new Audio(RADIO_STREAM_URL)
      newAudio.play()
      setAudio(newAudio)
      setIsPlaying(true)
    } else {
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
      } else {
        audio.play()
        setIsPlaying(true)
      }
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

        {/* ✅ RADIO PLAY BUTTON - CENTER */}
        <button
          onClick={handleRadioToggle}
          className="flex flex-col items-center text-xs text-white/95 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 mb-0.5 text-current" />
          ) : (
            <Play className="w-5 h-5 mb-0.5 text-current" />
          )}
          99.5 EN VIVO
        </button>

        <a
          href={YOUTUBE_WEB_URL}
          onClick={handleVolgaTVClick}
          className="flex flex-col items-center text-xs text-white/95 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <Tv className="w-5 h-5 mb-0.5 text-current" />
          VOLGA TV
        </a>
        <button
          onClick={() => setSearchOpen(true)}
          className="flex flex-col items-center text-xs text-white/95 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <Search className="w-5 h-5 mb-0.5 text-current" />
          Buscar
        </button>
      </nav>

      <SearchBar
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        isMobile
      />
    </>
  )
}
