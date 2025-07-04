'use client'

import React from 'react'
import { Clock } from 'lucide-react'

interface HeadlineItem {
  id: string
  title: string
  timestamp?: string
}

interface MasNoticiasSectionProps {
  headlines: HeadlineItem[]
}

export default function MasNoticiasSection({ headlines }: MasNoticiasSectionProps) {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {/* Section header with red accent */}
        <div className="flex items-center mb-6 pb-2 border-b border-[#292929]/20">
          <h2 className="text-2xl font-bold text-[#292929]">
            MÁS NOTICIAS
          </h2>
          <div className="ml-auto h-1 w-24 bg-primary-red"></div>
        </div>
        
        {/* Vertical headlines only */}
        <div className="max-w-xl mx-auto">
          <div className="bg-white border border-gray-100 rounded-md overflow-hidden">
            <div className="border-l-4 border-primary-red pl-4 py-4 mb-2">
              <h3 className="text-xl font-bold leading-tight text-[#292929]">
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
                    <div className="w-2 h-2 rounded-full bg-primary-red mt-4"></div>
                    {index < headlines.length - 1 && (
                      <div className="w-0.5 bg-gray-200 flex-grow"></div>
                    )}
                  </div>
                  
                  <a 
                    href="#" 
                    className="text-base font-medium leading-tight text-[#292929] hover:text-primary-red transition-colors block"
                    onClick={(e) => {
                      e.preventDefault()
                      console.log(`Headline clicked: ${headline.id}`)
                    }}
                  >
                    {headline.title}
                  </a>
                  {headline.timestamp && (
                    <div className="flex items-center mt-2">
                      <Clock className="h-3 w-3 text-dark-gray mr-1" />
                      <p className="text-xs text-dark-gray">
                        {headline.timestamp}
                      </p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            
            <div className="p-4 text-right border-t border-gray-100">
              <a href="#" className="text-xs font-medium text-primary-red hover:underline inline-flex items-center">
                Ver todas las noticias
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}