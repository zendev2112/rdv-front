'use client'

import React from 'react'
import Image from 'next/image'
import { Clock } from 'lucide-react'

interface NewsArticle {
  id: string
  title: string
  summary?: string
  author?: string
  imageUrl: string
}

interface HeadlineItem {
  id: string
  title: string
  timestamp?: string
}

interface MasNoticiasSectionProps {
  articles: NewsArticle[]
  headlines: HeadlineItem[]
}

export default function MasNoticiasSection({ articles, headlines }: MasNoticiasSectionProps) {
  // Split articles into two groups: first 6 and remaining 4
  const mainArticles = articles.slice(0, 6);
  const bottomArticles = articles.slice(6, 10);

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {/* Section header with red accent */}
        <div className="flex items-center mb-6 pb-2 border-b border-[#292929]/20">
          <h2 className="text-2xl font-bold text-[#292929]">
            MÁS NOTICIAS
          </h2>
          <div className="ml-auto h-1 w-24 bg-[#ff0808]"></div>
        </div>
        
        {/* Main layout with 2-column grid + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* First 6 articles in 2×3 grid (spanning 3 columns) */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mainArticles.map((article) => (
                <a 
                  href="#" 
                  key={article.id}
                  className="block bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
                  onClick={(e) => {
                    e.preventDefault()
                    console.log(`Article clicked: ${article.id}`)
                  }}
                >
                  {/* Image container with fixed aspect ratio */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Content area */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2 text-[#292929] line-clamp-3">
                      {article.title}
                    </h3>
                    
                    {article.summary && (
                      <p className="text-sm text-[#292929]/70 mb-2 line-clamp-2">
                        {article.summary}
                      </p>
                    )}
                    
                    {article.author && (
                      <p className="text-xs text-[#292929]/60">
                        Por {article.author}
                      </p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
          
          {/* Redesigned Sidebar with lines and dots */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-md overflow-hidden">
              <div className="border-l-4 border-[#ff0808] pl-4 py-4 mb-2">
                <h3 className="text-xl font-bold text-[#292929]">
                  Últimas noticias
                </h3>
              </div>
              
              <ul className="space-y-0">
                {headlines.map((headline, index) => (
                  <li 
                    key={headline.id}
                    className="relative pl-8 pr-4 py-3 border-t border-gray-100 first:border-t-0"
                  >
                    {/* Dot and line styling */}
                    <div className="absolute left-4 top-0 bottom-0 flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-[#ff0808] mt-4"></div>
                      {index < headlines.length - 1 && (
                        <div className="w-0.5 bg-gray-200 flex-grow"></div>
                      )}
                    </div>
                    
                    <a 
                      href="#" 
                      className="text-base font-medium text-[#292929] hover:text-[#ff0808] transition-colors block"
                      onClick={(e) => {
                        e.preventDefault()
                        console.log(`Headline clicked: ${headline.id}`)
                      }}
                    >
                      {headline.title}
                    </a>
                    {headline.timestamp && (
                      <div className="flex items-center mt-2">
                        <Clock className="h-3 w-3 text-[#292929]/40 mr-1" />
                        <p className="text-xs text-[#292929]/60">
                          {headline.timestamp}
                        </p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
              
              <div className="p-4 text-right border-t border-gray-100">
                <a href="#" className="text-xs font-medium text-[#ff0808] hover:underline inline-flex items-center">
                  Ver todas las noticias
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* Bottom row with 4 articles spanning full width */}
          <div className="lg:col-span-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {bottomArticles.map((article) => (
                <a 
                  href="#" 
                  key={article.id}
                  className="block bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
                  onClick={(e) => {
                    e.preventDefault()
                    console.log(`Article clicked: ${article.id}`)
                  }}
                >
                  {/* Image container with fixed aspect ratio */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Content area */}
                  <div className="p-4">
                    <h3 className="text-base font-bold mb-2 text-[#292929] line-clamp-3">
                      {article.title}
                    </h3>
                    
                    {article.summary && (
                      <p className="text-sm text-[#292929]/70 mb-2 line-clamp-2">
                        {article.summary}
                      </p>
                    )}
                    
                    {article.author && (
                      <p className="text-xs text-[#292929]/60">
                        Por {article.author}
                      </p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}