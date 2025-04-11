'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { Play } from 'lucide-react'

interface Article {
  id: string
  title: string
  summary?: string
  imageUrl: string
  author: string
  isVideo?: boolean
}

interface ActualidadSectionProps {
  featuredArticle: Article
  articles: Article[]
}

export default function ActualidadSection({
  featuredArticle,
  articles,
}: ActualidadSectionProps) {
  return (
    <section className="py-8 bg-[#faf6ef]">
      <div className="container mx-auto px-4">
        {/* Section header with red accent */}
        <div className="flex items-center mb-6 pb-2 border-b border-[#292929]/20">
          <h2 className="text-2xl font-bold text-[#292929]">
            ACTUALIDAD
          </h2>
          <div className="ml-auto h-1 w-24 bg-[#ff0808]"></div>
        </div>
        
        {/* Featured Article - full width with side-by-side layout */}
        <div className="mb-8">
          <Card className="overflow-hidden border-0 shadow-sm bg-white">
            <div className="flex flex-col md:flex-row">
              {/* Text content - 50% width on desktop */}
              <div className="md:w-1/2 p-6 flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-3 line-clamp-3 text-[#292929]">
                  {featuredArticle.title}
                </h3>
                {featuredArticle.summary && (
                  <p className="text-[#292929]/80 mb-4 line-clamp-4">
                    {featuredArticle.summary}
                  </p>
                )}
                <p className="text-sm text-[#292929]/70 mt-auto">
                  Por {featuredArticle.author}
                </p>
              </div>
              
              {/* Image - 50% width on desktop */}
              <div className="md:w-1/2 relative aspect-video md:aspect-auto">
                {featuredArticle.isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="bg-[#ff0808] bg-opacity-80 rounded-full p-4">
                      <Play className="h-10 w-10 text-white" />
                    </div>
                  </div>
                )}
                <Image 
                  src={featuredArticle.imageUrl} 
                  alt={featuredArticle.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </Card>
        </div>
        
        {/* Articles Grid - 4×3 layout with alternating backgrounds */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {articles.slice(0, 12).map((article, index) => (
            <Card 
              key={article.id} 
              className={`overflow-hidden border-0 shadow-sm h-full ${
                index % 2 === 0 ? 'bg-white' : 'bg-[#faf6ef]'
              }`}
            >
              <div className="relative aspect-video w-full">
                {article.isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="bg-[#ff0808] bg-opacity-80 rounded-full p-2">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                  </div>
                )}
                <Image 
                  src={article.imageUrl} 
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-base font-bold mb-1 line-clamp-2 text-[#292929]">
                  {article.title}
                </h3>
                {article.summary && (
                  <p className="text-[#292929]/80 mb-2 text-sm line-clamp-2">
                    {article.summary}
                  </p>
                )}
                <div className="flex items-center mt-2">
                  <p className="text-xs text-[#292929]/70">
                    Por {article.author}
                  </p>
                  {index % 4 === 0 && (
                    <span className="ml-auto text-xs bg-[#ff0808] text-white px-2 py-0.5 rounded-sm">
                      DESTACADO
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}