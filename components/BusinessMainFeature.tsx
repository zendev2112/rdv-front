'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface CategoryLink {
  name: string;
  href: string;
}

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

interface BusinessMainFeatureProps {
  logo?: {
    src: string;
    alt: string;
  };
  categories?: CategoryLink[];
  mainArticle: NewsArticle;
  sideArticles: NewsArticle[];
}

export default function BusinessMainFeature({
  logo,
  categories = [],
  mainArticle,
  sideArticles,
}: BusinessMainFeatureProps) {
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

          {/* Categories in IActualidad style */}
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {categories.map((category, index) => (
                <Link 
                  href={category.href} 
                  key={index}
                  className="text-xs font-medium text-dark-gray hover:text-primary-red transition-colors flex items-center"
                >
                  {category.name}
                  <ChevronRight size={12} className="ml-0.5" />
                </Link>
              ))}
            </div>
          )}

          {/* Title and red accent line */}
          <div className="flex items-center pb-2 border-b border-[#292929]/20">
            <h2 className="text-2xl font-bold text-[#292929]">
              {!logo && "COMUNIDAD DE NEGOCIOS"}
            </h2>
            <div className="ml-auto h-1 w-24 bg-[#ff0808]"></div>
          </div>
        </div>

        {/* Two column grid layout exactly like PoliticsAndEconomySection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Featured Article - 50% width on desktop */}
          <div>
            <a 
              href="#" 
              className="block overflow-hidden border-0 shadow-sm bg-white rounded-md hover:shadow-md transition-shadow duration-300 group h-full"
              onClick={(e) => {
                e.preventDefault();
                console.log(`Main article clicked: ${mainArticle.id}`);
              }}
            >
              {/* Main article image on top */}
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                {mainArticle.hasVideo && (
                  <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded z-10">
                    VIDEO
                  </div>
                )}
                <Image
                  src={mainArticle.imageUrl}
                  alt={mainArticle.title.regular}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  priority
                />
                {/* Hover effect with gray overlay */}
                <div className="absolute inset-0 bg-gray-800 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>

              {/* Text content below */}
              <div className="p-5">
                {/* Title with highlighted part */}
                <h3 className="text-3xl font-bold mb-3 leading-tight text-[#292929]">
                  {mainArticle.title.highlight && (
                    <span className="text-primary-red font-bold">{mainArticle.title.highlight}. </span>
                  )}
                  {mainArticle.title.regular}
                </h3>

                {/* Summary */}
                {mainArticle.summary && (
                  <p className="text-dark-gray text-base mb-4 line-clamp-3">
                    {mainArticle.summary}
                  </p>
                )}

                {/* Author name */}
                {mainArticle.author && (
                  <p className="text-sm text-dark-gray">
                    Por {mainArticle.author}
                  </p>
                )}
              </div>
            </a>
          </div>

          {/* Side Articles - 50% width container */}
          <div className="space-y-4">
            {sideArticles.map((article) => (
              <a 
                key={article.id} 
                href="#"
                className="block overflow-hidden border-0 shadow-sm bg-white rounded-md hover:shadow-md transition-shadow duration-300 group"
                onClick={(e) => {
                  e.preventDefault();
                  console.log(`Side article clicked: ${article.id}`);
                }}
              >
                {/* Layout with text left, image right */}
                <div className="flex flex-col sm:flex-row">
                  {/* Text content */}
                  <div className="p-4 sm:w-2/3 flex flex-col justify-center">
                    <h3 className="text-lg font-bold mb-2 leading-tight text-[#292929]">
                      {article.title.highlight && (
                        <span className="text-primary-red font-bold">{article.title.highlight}. </span>
                      )}
                      {article.title.regular}
                    </h3>
                    
                    {article.author && (
                      <p className="text-sm text-dark-gray mt-auto">
                        Por {article.author}
                      </p>
                    )}
                  </div>
                  
                  {/* Article image */}
                  <div className="relative sm:w-1/3 aspect-video sm:aspect-square overflow-hidden">
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
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}