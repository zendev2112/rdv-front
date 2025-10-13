'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Headline = {
  id: string
  title: string
  slug: string
  section?: string
}

export default function NewsTicker({ headlines }: { headlines: Headline[] }) {
  if (!headlines?.length) return null

  const [currentIndex, setCurrentIndex] = useState(0)
  const DISPLAY_MS = 4500 // Time each headline is visible

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % headlines.length)
    }, DISPLAY_MS)

    return () => clearInterval(interval)
  }, [headlines.length])

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-2">
        <div className="text-sm font-bold transition-opacity duration-500 ease-in-out">
          <Link
            href={`/${headlines[currentIndex]?.section || 'noticias'}/${
              headlines[currentIndex]?.slug
            }`}
            className="hover:text-primary-red transition-colors"
          >
            {headlines[currentIndex]?.title}
          </Link>
        </div>
      </div>
    </div>
  )
}
