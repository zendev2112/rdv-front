'use client'

import React from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'

interface ArticleProps {
  title: string
  titleHighlight?: string
  imageUrl: string
  author?: string
  badge?: {
    text: string
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    bgColor?: string
    textColor?: string
  }
}

interface YouMayBeInterestedSectionProps {
  articles: ArticleProps[]
}

export default function YouMayBeInterestedSection({ articles }: YouMayBeInterestedSectionProps) {
  // Default position is top-left if not specified
  const getBadgePosition = (position?: string) => {
    switch (position) {
      case 'top-right':
        return 'top-2 right-2'
      case 'bottom-left':
        return 'bottom-2 left-2'
      case 'bottom-right':
        return 'bottom-2 right-2'
      default:
        return 'top-2 left-2'
    }
  }

  return (
    <section className="container mx-auto px-4 py-6 border-t border-gray-200">
      <h2 className="text-2xl font-bold mb-6 uppercase">
        TE PUEDE INTERESAR
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.slice(0, 4).map((article, index) => (
          <Card 
            key={index} 
            className="overflow-hidden border-0 shadow-sm bg-white h-full"
          >
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover"
              />
              {/* Hover effect with gray overlay */}
              <div className="absolute inset-0 bg-gray-800 bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
              
              {article.badge && (
                <div className={`absolute ${getBadgePosition(article.badge.position)} ${article.badge.bgColor || 'bg-black'} ${article.badge.textColor || 'text-white'} text-xs px-2 py-1 rounded z-10`}>
                  {article.badge.text}
                </div>
              )}
            </div>
            
            <CardContent className="p-4">
              <h3 className="text-lg font-bold mb-2 leading-tight">
                {article.titleHighlight && (
                  <span className="text-primary-red font-bold">{article.titleHighlight}. </span>
                )}
                {article.title}
              </h3>
              
              {article.author && (
                <p className="text-sm text-dark-gray mt-2">
                  Por {article.author}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}