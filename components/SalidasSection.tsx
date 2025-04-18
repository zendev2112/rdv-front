'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface CategoryLink {
  name: string;
  href: string;
}

interface Article {
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

interface SalidasSectionProps {
  logo?: {
    src: string;
    alt: string;
  };
  categories?: CategoryLink[];
  articles: Article[];
}

export default function SalidasSection({
  logo,
  categories = [],
  articles,
}: SalidasSectionProps) {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="flex flex-col space-y-4 mb-6">
          {/* Logo if provided */}
          {logo && (
            <div className="relative w-48 h-16">
              <Image 
                src={logo.src} 
                alt={logo.alt}
                fill
                className="object-contain object-left"
                priority
                unoptimized
              />
            </div>
          )}

          {/* Title and orange accent line */}
          <div className="flex items-center pb-2 border-b border-[#292929]/20">
            <h2 className="text-2xl font-bold text-[#292929]">
              SALIDAS
            </h2>
            <div className="ml-auto h-1 w-24 bg-[#e67e22]"></div>
          </div>

          {/* Categories in IActualidad style - below title */}
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {categories.map((category, index) => (
                <Link 
                  href={category.href} 
                  key={index}
                  className="text-xs font-medium text-dark-gray hover:text-[#e67e22] transition-colors flex items-center"
                >
                  {category.name}
                  <ChevronRight size={12} className="ml-0.5" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Four column grid layout for articles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {articles.slice(0, 4).map((article) => (
            <a 
              key={article.id} 
              href="#" 
              className="block overflow-hidden border-0 shadow-sm bg-white rounded-md hover:shadow-md transition-shadow duration-300 group h-full"
              onClick={(e) => {
                e.preventDefault();
                console.log(`Article clicked: ${article.id}`);
              }}
            >
              {/* Article image on top */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                {article.hasVideo && (
                  <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded z-10">
                    VIDEO
                  </div>
                )}
                <Image
                  src={article.imageUrl}
                  alt={article.title.regular}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Hover effect with gray overlay */}
                <div className="absolute inset-0 bg-gray-800 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>

              {/* Text content below */}
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2 leading-tight text-[#292929]">
                  {article.title.highlight && (
                    <span className="text-[#e67e22] font-bold">{article.title.highlight}. </span>
                  )}
                  {article.title.regular}
                </h3>
                
                {article.summary && (
                  <p className="text-dark-gray text-sm mb-3 line-clamp-2">
                    {article.summary}
                  </p>
                )}
                
                {article.author && (
                  <p className="text-xs text-dark-gray mt-auto">
                    Por {article.author}
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}