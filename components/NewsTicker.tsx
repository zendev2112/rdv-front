'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Play, Pause } from 'lucide-react'

type Headline = {
  id: string
  title: string
  slug: string
  section?: string
}

const RADIO_STREAM_URL = 'https://stream.xweb.ar/8056/stream'

export default function NewsTicker({ headlines }: { headlines: Headline[] }) {
  if (!headlines?.length) return null

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const DISPLAY_MS = 4500

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % headlines.length)
    }, DISPLAY_MS)

    return () => clearInterval(interval)
  }, [headlines.length])

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

  // ✅ Trim long titles to prevent breaking layout
  const truncateTitle = (title: string, maxLength: number = 80) => {
    if (title.length <= maxLength) return title
    return title.substring(0, maxLength).trim() + '...'
  }

return (
  <div className="bg-white">
    <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-4">
      {/* ✅ DESKTOP RADIO BUTTON */}
      <button
        onClick={handleRadioToggle}
        className="hidden md:flex items-center gap-2 bg-primary-red text-white px-4 py-1.5 rounded-full hover:bg-red-700 transition-colors font-semibold text-sm"
      >
        {isPlaying ? (
          <>
            <Pause className="w-4 h-4" />
            99.5 EN VIVO
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            99.5 EN VIVO
          </>
        )}
      </button>

      {/* ✅ TICKER WITH TRIMMED TITLES */}
      <div className="flex-1 text-sm font-bold transition-opacity duration-500 ease-in-out overflow-hidden">
        <Link
          href={`/${headlines[currentIndex]?.section || 'noticias'}/${
            headlines[currentIndex]?.slug
          }`}
          className="hover:text-primary-red transition-colors block truncate"
        >
          {truncateTitle(headlines[currentIndex]?.title)}
        </Link>
      </div>
    </div>
  </div>
)
}
