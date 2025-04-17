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
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        {/* Section header with red accent */}
        <div className="flex items-center mb-6 pb-2 border-b border-[#292929]/20">
          <h2 className="text-2xl font-bold text-[#292929]">
            ACTUALIDAD
          </h2>
          <div className="ml-auto h-1 w-24 bg-[#ff0808]"></div>
        </div>
        

        
        {/* Articles Grid - 4×3 layout with white backgrounds */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {articles.slice(0, 12).map((article, index) => (
            <a 
              key={article.id}
              href="#"
              className="block overflow-hidden border-0 shadow-sm rounded-md hover:shadow-md transition-shadow duration-300 cursor-pointer group h-full bg-white"
              onClick={(e) => {
                e.preventDefault();
                console.log(`Article clicked: ${article.id}`);
              }}
            >
              <div className="relative aspect-video overflow-hidden w-full" style={{ height: '190px' }}>
                {article.isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="bg-primary-red rounded-full p-2">
                      <Play className="h-5 w-5 text-white" />
                    </div>
                  </div>
                )}
                <Image 
                  src={article.imageUrl} 
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Hover effect with gray overlay */}
                <div className="absolute inset-0 bg-gray-800 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <div className="p-3">
                <h3 className="text-lg font-bold mb-2 leading-tight line-clamp-2 text-[#292929]">
                  <span className="text-primary-red font-bold">Noticia.</span>{' '}
                  {article.title}
                </h3>
                {article.summary && (
                  <p className="text-sm text-dark-gray mb-1 line-clamp-2">
                    {article.summary}
                  </p>
                )}
                <div className="flex items-center mt-1">
                  <p className="text-sm text-dark-gray">
                    Por {article.author}
                  </p>
                  {index % 4 === 0 && (
                    <span className="ml-auto text-xs bg-primary-red text-white px-2 py-0.5 rounded-sm">
                      DESTACADO
                    </span>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}