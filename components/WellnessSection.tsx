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
  excerpt?: string;
}

interface WellnessSectionProps {
  featuredArticle: Article;
  smallArticles: Article[];
}

export default function WellnessSection({
  featuredArticle,
  smallArticles,
}: WellnessSectionProps) {
  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        {/* Section header with red accent */}
        <div className="flex items-center mb-5 pb-2 border-b border-[#292929]/20">
          <h2 className="text-xl font-bold text-[#292929]">
            BIENESTAR
          </h2>
          <div className="ml-auto h-1 w-24 bg-primary-red"></div>
        </div>
        
        <div className="space-y-6">
          {/* Featured Article - slightly smaller */}
          <div className="w-full">
            <a 
              href="#" 
              className="block bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
              onClick={(e) => {
                e.preventDefault();
                console.log(`Featured article clicked`);
              }}
            >
              <div className="flex flex-col md:flex-row">
                {/* Image container - slightly smaller */}
                <div className="relative md:w-2/5 aspect-[16/9] overflow-hidden">
                  <Image
                    src={featuredArticle.imageUrl}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gray-800 bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
                </div>
                
                {/* Content area - with larger font */}
                <div className="p-4 md:p-5 md:w-3/5 flex flex-col">
                  <h3 className="text-xl font-bold mb-2 leading-tight text-[#292929] line-clamp-2">
                    <span className="text-primary-red font-bold">Bienestar.</span>{' '}
                    {featuredArticle.title}
                  </h3>
                  
                  {featuredArticle.author && (
                    <p className="text-sm text-dark-gray mt-auto">
                      Por {featuredArticle.author}
                    </p>
                  )}
                </div>
              </div>
            </a>
          </div>
          
          {/* Small Articles - bigger size and more space between them */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {smallArticles.map((article, index) => (
              <a 
                href="#" 
                key={index}
                className="flex bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group h-32"
                onClick={(e) => {
                  e.preventDefault();
                  console.log(`Small article ${index} clicked`);
                }}
              >
                {/* Image container - slightly larger */}
                <div className="relative w-1/3 overflow-hidden">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gray-800 bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
                </div>
                
                {/* Content area - bigger */}
                <div className="p-3 w-2/3 flex flex-col justify-center">
                  <h3 className="text-base font-bold leading-tight text-[#292929] line-clamp-2">
                    <span className="text-primary-red font-bold">Bienestar.</span>{' '}
                    {article.title}
                  </h3>
                  
                  {article.author && (
                    <p className="text-xs text-dark-gray mt-2">
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