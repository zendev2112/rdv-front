'use client'

import React, { useState } from 'react'
import { Play } from 'lucide-react' // Remove the Image import

interface VideoItem {
  id: string
  title: string
  thumbnailUrl: string
  publishedAt: string
  viewCount?: string
  duration?: string
}

interface VolgaTVSectionProps {
  featuredVideo: VideoItem
  recentVideos: VideoItem[]
}

export default function VolgaTVSection({ featuredVideo, recentVideos }: VolgaTVSectionProps) {
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null)
  
  const handlePlayVideo = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    setPlayingVideoId(id)
  }

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        {/* Section header with red accent and Volga TV branding */}
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#292929]/20">
          <div className="flex items-center gap-3">
            <div className="bg-[#ff0808] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
              TV
            </div>
            <h2 className="text-2xl font-bold text-[#292929]">VOLGA TV</h2>
          </div>
          <div className="flex items-center">
            <div className="h-1 w-12 bg-[#ff0808] mr-3"></div>
            <a
              href="https://www.youtube.com/@volgatvok"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[#ff0808] hover:underline flex items-center"
            >
              Ver canal
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1"
              >
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
              </svg>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured video - takes up 2/3 of the screen on desktop */}
          <div className="lg:col-span-2">
            {playingVideoId === featuredVideo.id ? (
              <div className="relative aspect-video w-full mb-3 rounded-md overflow-hidden">
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
                className="block group"
                onClick={(e) => handlePlayVideo(featuredVideo.id, e)}
              >
                <div className="relative aspect-video w-full mb-3 cursor-pointer group">
                  <img
                    src={featuredVideo.thumbnailUrl} 
                    alt={featuredVideo.title}
                    className="absolute top-0 left-0 w-full h-full object-cover rounded-md"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = `/placeholder.svg?height=400&width=700&text=${featuredVideo.id}`;
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all rounded-md">
                    <div className="bg-[#ff0808] rounded-full p-4 transform group-hover:scale-110 transition-transform">
                      <Play className="h-8 w-8 text-white" fill="white" />
                    </div>
                  </div>
                  {featuredVideo.duration && (
                    <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {featuredVideo.duration}
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-[#292929] mb-2 line-clamp-2 group-hover:text-[#ff0808] transition-colors">
                  {featuredVideo.title}
                </h3>
                <div className="flex items-center text-sm text-[#292929]/70">
                  <span>{featuredVideo.publishedAt}</span>
                  {featuredVideo.viewCount && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{featuredVideo.viewCount} visualizaciones</span>
                    </>
                  )}
                </div>
              </a>
            )}
          </div>

          {/* Recent videos - takes up 1/3 of the screen on desktop */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {recentVideos.map((video) => (
                <div key={video.id}>
                  {playingVideoId === video.id ? (
                    <div className="relative aspect-video w-full mb-2 rounded-md overflow-hidden">
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
                      className="flex gap-3 group"
                      onClick={(e) => handlePlayVideo(video.id, e)}
                    >
                      {/* Video thumbnail */}
                      <div className="relative w-36 shrink-0 aspect-video rounded-md overflow-hidden">
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="absolute top-0 left-0 w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = `/placeholder.svg?height=150&width=250&text=${video.id}`;
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-[#ff0808] rounded-full p-2">
                            <Play className="h-4 w-4 text-white" fill="white" />
                          </div>
                        </div>
                        {video.duration && (
                          <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-[10px] px-1 rounded">
                            {video.duration}
                          </div>
                        )}
                      </div>

                      {/* Video info */}
                      <div>
                        <h4 className="text-sm font-medium text-[#292929] line-clamp-2 group-hover:text-[#ff0808] transition-colors">
                          {video.title}
                        </h4>
                        <div className="flex items-center text-xs text-[#292929]/70 mt-1">
                          <span>{video.publishedAt}</span>
                          {video.viewCount && (
                            <>
                              <span className="mx-1">•</span>
                              <span>{video.viewCount}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </a>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-gray-100 pt-4">
              <a
                href="https://www.youtube.com/@volgatvok/videos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center block w-full bg-[#faf6ef] hover:bg-[#f5f0e5] text-[#292929] px-4 py-3 rounded-md font-medium text-sm transition-colors"
              >
                Ver más videos de Volga TV
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}