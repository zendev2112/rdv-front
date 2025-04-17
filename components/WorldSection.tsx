'use client'

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Article {
  id?: string;
  title: string;
  subtitle?: string;
  author?: string;
  imageUrl: string;
}

interface WorldSectionProps {
  mainArticle: Article;
  sideArticles: Article[];
}

export default function WorldSection({
  mainArticle,
  sideArticles,
}: WorldSectionProps) {
  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        {/* Section header with red accent */}
        <div className="flex items-center mb-5 pb-2 border-b border-[#292929]/20">
          <h2 className="text-xl font-bold text-[#292929]">
            MUNDO
          </h2>
          <div className="ml-auto h-1 w-24 bg-primary-red"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Main article with image on top, text on bottom */}
          <div>
            <a 
              href="#" 
              className="block bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
              onClick={(e) => {
                e.preventDefault();
                console.log(`Main article clicked`);
              }}
            >
              {/* Image container - Full width on top */}
              <div className="relative w-full aspect-[16/9] overflow-hidden">
                <Image
                  src={mainArticle.imageUrl}
                  alt={mainArticle.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gray-800 bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              
              {/* Content area - Below image */}
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2 leading-tight text-[#292929] line-clamp-3">
                  <span className="text-primary-red font-bold">Mundo.</span>{' '}
                  {mainArticle.title}
                </h3>
                
                {mainArticle.subtitle && (
                  <p className="text-sm text-dark-gray mb-2 line-clamp-3">
                    {mainArticle.subtitle}
                  </p>
                )}
                
                {mainArticle.author && (
                  <p className="text-sm text-dark-gray mt-2">
                    Por {mainArticle.author}
                  </p>
                )}
              </div>
            </a>
          </div>
          
          {/* Right Column: Stacked side articles with image on left, text on right */}
          <div className="space-y-4">
            {sideArticles.map((article, index) => (
              <a 
                href="#" 
                key={index}
                className="flex bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group h-32"
                onClick={(e) => {
                  e.preventDefault();
                  console.log(`Side article ${index} clicked`);
                }}
              >
                {/* Image container - Left side */}
                <div className="relative w-1/3 overflow-hidden">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gray-800 bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
                </div>
                
                {/* Content area - Right side */}
                <div className="p-3 w-2/3 flex flex-col justify-center">
                  <h3 className="text-base font-bold leading-tight text-[#292929] line-clamp-2">
                    <span className="text-primary-red font-bold">Mundo.</span>{' '}
                    {article.title}
                  </h3>
                  
                  {article.subtitle && (
                    <p className="text-xs text-dark-gray line-clamp-1 mb-1">
                      {article.subtitle}
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
      </div>
    </section>
  );
}