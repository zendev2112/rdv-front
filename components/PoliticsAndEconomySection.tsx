'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

// Using consistent interfaces with your existing components
interface NewsArticle {
  id: string
  title: {
    highlight?: string
    regular: string
  }
  summary?: string
  author?: string
  imageUrl: string
  hasVideo?: boolean
}

interface PoliticsAndEconomySectionProps {
  mainArticle: NewsArticle
  sideArticles: NewsArticle[]
}

export default function PoliticsAndEconomySection({
  mainArticle,
  sideArticles,
}: PoliticsAndEconomySectionProps) {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        {/* Section header with red accent */}
        <div className="flex items-center mb-6 pb-2 border-b border-[#292929]/20">
          <h2 className="text-2xl font-bold text-[#292929]">
            POLÍTICA Y ECONOMÍA
          </h2>
          <div className="ml-auto h-1 w-24 bg-[#ff0808]"></div>
        </div>

        {/* Two 50/50 column grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Featured Article - 50% width on desktop */}
          <div>
            <Card className="overflow-hidden border-0 shadow-sm bg-white h-full">
              {/* Main article image on top */}
              <div className="relative aspect-[16/9] w-full">
                {mainArticle.hasVideo && (
                  <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded z-10">
                    VIDEO
                  </div>
                )}
                <Image
                  src={mainArticle.imageUrl}
                  alt={mainArticle.title.regular}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Text content below */}
              <CardContent className="p-5">
                {/* Title with highlighted part */}
                <h3 className="text-xl font-bold mb-3 text-[#292929]">
                  {mainArticle.title.highlight && (
                    <span className="text-[#ff0808] font-extrabold">{mainArticle.title.highlight}. </span>
                  )}
                  {mainArticle.title.regular}
                </h3>

                {/* Summary */}
                {mainArticle.summary && (
                  <p className="text-[#292929]/80 text-sm mb-4 line-clamp-3">
                    {mainArticle.summary}
                  </p>
                )}

                {/* Author name */}
                {mainArticle.author && (
                  <p className="text-xs text-[#292929]/70">
                    Por {mainArticle.author}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Side Articles - 50% width container */}
          <div className="space-y-4">
            {sideArticles.map((article) => (
              <Card key={article.id} className="overflow-hidden border-0 shadow-sm bg-white">
                {/* Layout with text left, image right */}
                <div className="flex flex-col sm:flex-row">
                  {/* Text content */}
                  <CardContent className="p-4 sm:w-2/3 flex flex-col justify-center">
                    <h3 className="text-base font-bold mb-2 text-[#292929]">
                      {article.title.highlight && (
                        <span className="text-[#ff0808] font-extrabold">{article.title.highlight}. </span>
                      )}
                      {article.title.regular}
                    </h3>
                    
                    {article.author && (
                      <p className="text-xs text-[#292929]/70 mt-auto">
                        Por {article.author}
                      </p>
                    )}
                  </CardContent>
                  
                  {/* Article image */}
                  <div className="relative sm:w-1/3 aspect-video sm:aspect-square">
                    {article.hasVideo && (
                      <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded z-10">
                        VIDEO
                      </div>
                    )}
                    <Image
                      src={article.imageUrl}
                      alt={article.title.regular}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}