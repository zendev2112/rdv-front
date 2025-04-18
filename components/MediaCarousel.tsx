'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'

interface MediaItem {
  id: string
  title: string
  imageUrl: string
  badgeText: string
  duration: string
  videoUrl?: string
}

interface MediaCarouselProps {
  title?: string
  items: MediaItem[]
}

export default function MediaCarousel({ title, items }: MediaCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return

    const scrollAmount = direction === 'left' ? -200 : 200
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  const handleScroll = () => {
    if (!carouselRef.current) return
    
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
    setShowLeftArrow(scrollLeft > 0)
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10)
  }

  return (
    <div className="w-full py-6">
      {title && (
        <div className="flex items-center mb-6 pb-2 border-b border-[#292929]/20">
          <h2 className="text-2xl font-bold text-[#292929]">{title}</h2>
          <div className="ml-auto h-1 w-24 bg-primary-red"></div>
        </div>
      )}

      <div className="relative">
        {/* Left scroll button */}
        {showLeftArrow && (
          <button 
            onClick={() => scrollCarousel('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors hidden md:block"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </button>
        )}

        {/* Carousel container */}
        <div 
          ref={carouselRef}
          className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory"
          onScroll={handleScroll}
        >
          {items.map((item) => (
            <div 
              key={item.id} 
              className="min-w-[180px] md:min-w-[200px] h-[320px] md:h-[350px] flex-shrink-0 snap-start"
            >
              <Link 
                href={item.videoUrl || '#'}
                onClick={(e) => {
                  if (!item.videoUrl) {
                    e.preventDefault();
                    console.log(`Video clicked: ${item.id}`);
                  }
                }}
              >
                <div className="relative w-full h-full rounded-lg overflow-hidden group cursor-pointer bg-black">
                  {/* Background image - vertical mobile style */}
                  <div className="absolute inset-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 180px, 200px"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50"></div>
                  </div>
                  
                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-primary-red text-white text-xs font-medium px-2 py-1 rounded">
                      {item.badgeText}
                    </span>
                  </div>
                  
                  {/* Play icon and duration */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/80 rounded-full p-3 shadow-md group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                      <Play fill="currentColor" className="h-5 w-5 text-primary-red" />
                    </div>
                  </div>
                  
                  <div className="absolute bottom-16 right-3">
                    <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {item.duration}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                    <h3 className="text-white font-medium text-sm line-clamp-2 pb-2">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Right scroll button */}
        {showRightArrow && (
          <button 
            onClick={() => scrollCarousel('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors hidden md:block"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6 text-gray-800" />
          </button>
        )}
      </div>
    </div>
  )
}