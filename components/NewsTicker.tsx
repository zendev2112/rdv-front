'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'

type Headline = {
  id: string
  title: string
  slug: string
  section?: string
  timestamp?: string
}

export default function NewsTicker({ headlines }: { headlines: Headline[] }) {
  if (!headlines?.length) return null

  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef<number | null>(null)

  const DISPLAY_MS = 4500 // time each headline is visible
  const TRANSITION_MS = 600 // must match CSS duration

  useEffect(() => {
    if (paused || headlines.length <= 1) return

    intervalRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % headlines.length)
    }, DISPLAY_MS)

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [paused, headlines.length])

  useEffect(() => {
    // when headlines change, reset index safely
    setIndex(0)
  }, [headlines])

  const onEnter = () => setPaused(true)
  const onLeave = () => setPaused(false)
  const onFocus = () => setPaused(true)
  const onBlur = () => setPaused(false)

  return (
    <div className="border-b border-light-gray bg-white">
      <div
        className="container mx-auto px-4 py-2 overflow-hidden"
        tabIndex={0}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        // small region for touch to pause
        onTouchStart={onEnter}
        onTouchEnd={onLeave}
      >
        <div className="relative h-8 md:h-7"> {/* a bit taller to avoid vertical clipping */}
          {headlines.map((headline, i) => {
            const active = i === index
            return (
              <div
                key={headline.id}
                aria-hidden={!active}
                className={`absolute inset-0 flex items-center text-sm transition-opacity ease-in-out ${
                  active ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                style={{ transitionDuration: `${TRANSITION_MS}ms` }}
                role="article"
              >
                <Link
                  href={`/${headline.section || 'noticias'}/${headline.slug}`}
                  className="block w-full whitespace-nowrap font-bold hover:text-primary-red transition-colors"
                >
                  {headline.title}
                </Link>
                <span className="ml-2 text-neutral-gray hidden md:inline">•</span>
              </div>
            )
          })}
        </div>

        {/* visually-hidden live region for screen readers */}
        <div className="sr-only" aria-live="polite">
          {headlines[index]?.title}
        </div>
      </div>
    </div>
  )
}
