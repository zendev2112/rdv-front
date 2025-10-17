'use client'

import React, { useState } from 'react'
import { Play } from 'lucide-react'
import OptimizedImage from './OptimizedImage'

interface VideoItem {
  id: string
  title: string
  thumbnailUrl: string
  publishedAt: string
}

interface VolgaTVSectionProps {
  featuredVideo: VideoItem
  recentVideos: VideoItem[]
}

export default function VolgaTVSection({
  featuredVideo,
  recentVideos,
}: VolgaTVSectionProps) {
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null)

  const handlePlayVideo = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    setPlayingVideoId(id)
  }

  return (
    <main className="py-0 md:py-6">
      {/* Horizontal divider to separate from section above */}
      <div className="w-full md:w-full h-[1px] bg-gray-300 md:bg-gray-400 mb-6 md:mb-6 md:opacity-50"></div>

      {/* Header with Title and Link */}
      <div className="flex justify-between items-start mb-6">
        {/* Section Title - Top Left */}
        <div className="text-left">
          <div className="w-16 h-1 bg-primary-red mb-2"></div>
          <h2 className="text-2xl font-bold uppercase">VOLGA TV</h2>
        </div>
        
        {/* YouTube Channel Link - Top Right */}
        <a
          href="https://www.youtube.com/@VolgaTV"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary-red hover:underline font-semibold"
        >
          Más Videos de Volga TV en Youtube
        </a>
      </div>

      {/* Main video - Full width (12 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
        <div className="md:col-span-12 relative">
          {playingVideoId === featuredVideo.id ? (
            <div className="relative w-full aspect-[16/9]">
              <iframe
                src={`https://www.youtube.com/embed/${featuredVideo.id}?autoplay=1`}
                title={featuredVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              ></iframe>
            </div>
          ) : (
            <a
              href={`https://www.youtube.com/watch?v=${featuredVideo.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full flex flex-col group"
              onClick={(e) => handlePlayVideo(featuredVideo.id, e)}
            >
              {/* Featured video image - aspect-[16/9] */}
              <div className="relative w-full aspect-[16/9]">
                <div className="relative w-full h-full overflow-hidden">
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
                  <OptimizedImage
                    src={featuredVideo.thumbnailUrl}
                    alt={featuredVideo.title}
                    fill
                    className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                    sizes="(max-width: 768px) 100vw, 100vw"
                  />
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="bg-primary-red rounded-full p-4 transform group-hover:scale-110 transition-transform">
                      <Play className="h-8 w-8 text-white" fill="white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Title area - CONSISTENT SPACING */}
              <div className="bg-white pt-3 pb-6 md:pb-0">
                <h1 className="text-lg md:text-2xl font-bold leading-tight">
                  {featuredVideo.title}
                </h1>
              </div>
            </a>
          )}

          {/* Mobile divisory line */}
          <div className="md:hidden w-full h-[1px] bg-gray-300"></div>
        </div>
      </div>

      {/* Secondary videos - 4 columns each (3 videos) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {recentVideos.map((video, idx) => (
          <div key={video.id} className="md:col-span-4 relative">
            {playingVideoId === video.id ? (
              <div className="relative w-full aspect-[16/9]">
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                ></iframe>
              </div>
            ) : (
              <a
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full flex flex-col group"
                onClick={(e) => handlePlayVideo(video.id, e)}
              >
                <div className="relative w-full aspect-[16/9]">
                  <div className="relative w-full h-full overflow-hidden">
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
                    <OptimizedImage
                      src={video.thumbnailUrl}
                      alt={video.title}
                      fill
                      className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div className="bg-primary-red rounded-full p-3 transform group-hover:scale-110 transition-transform">
                        <Play className="h-6 w-6 text-white" fill="white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Title area - CONSISTENT SPACING */}
                <div className="pt-2 pb-6 md:pb-0 flex-1">
                  <h2 className="text-base md:text-base font-bold leading-tight">
                    {video.title}
                  </h2>
                </div>
              </a>
            )}

            {/* Vertical divider between videos (desktop) */}
            {idx < recentVideos.length - 1 && (
              <div className="absolute top-0 -right-4 w-[1px] h-full bg-gray-400 opacity-50 hidden md:block"></div>
            )}

            {/* Mobile divisory line */}
            <div className="md:hidden w-full h-[1px] bg-gray-300"></div>
          </div>
        ))}
      </div>
    </main>
  )
}