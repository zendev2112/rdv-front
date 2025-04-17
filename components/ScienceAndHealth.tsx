'use client'

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Article {
  titleHighlight: string;
  titleRegular: string;
  subtitle?: string;
  imageUrl: string;
  author?: string;
}

interface ScienceAndHealthProps {
  sectionTitle: string;
  logo?: {
    src: string;
    alt: string;
  };
  mainArticle: Article;
  smallArticles: Article[];
}

export default function ScienceAndHealth({
  sectionTitle,
  logo,
  mainArticle,
  smallArticles,
}: ScienceAndHealthProps) {
  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        {/* Divisory line */}
        <div className="border-b border-[#292929]/20 mb-6"></div>
        
        {/* Section title instead of logo */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{sectionTitle}</h2>
        </div>
        
        {/* Main content layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main article - full width */}
          <div className="md:col-span-12">
            <a 
              href="#" 
              className="block bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
              onClick={(e) => {
                e.preventDefault();
                console.log(`Main article clicked`);
              }}
            >
              <div className="flex flex-col md:flex-row">
                {/* Image container */}
                <div className="md:w-1/2 relative aspect-[16/9] md:aspect-[3/2] overflow-hidden">
                  <Image
                    src={mainArticle.imageUrl}
                    alt={mainArticle.titleRegular}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gray-800 bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
                </div>
                
                {/* Content area */}
                <div className="md:w-1/2 p-4 md:p-6">
                  <h2 className="text-xl md:text-2xl font-bold mb-3 leading-tight">
                    <span className="text-primary-red font-bold">{mainArticle.titleHighlight}.</span>{' '}
                    {mainArticle.titleRegular}
                  </h2>
                  
                  {mainArticle.subtitle && (
                    <p className="text-dark-gray mb-3">
                      {mainArticle.subtitle}
                    </p>
                  )}
                  
                  {mainArticle.author && (
                    <p className="text-sm text-dark-gray">
                      Por {mainArticle.author}
                    </p>
                  )}
                </div>
              </div>
            </a>
          </div>
          
          {/* Side articles - three columns */}
          <div className="md:col-span-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {smallArticles.map((article, index) => (
                <a 
                  href="#" 
                  key={index}
                  className="flex flex-col bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log(`Side article ${index} clicked`);
                  }}
                >
                  {/* Image container - TOP */}
                  <div className="relative w-full h-[160px] overflow-hidden">
                    <Image
                      src={article.imageUrl}
                      alt={article.titleRegular}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gray-800 bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
                  </div>
                  
                  {/* Content area - BOTTOM */}
                  <div className="p-4 flex-grow">
                    <h3 className="text-base font-bold leading-tight mb-2">
                      <span className="text-primary-red font-bold">{article.titleHighlight}.</span>{' '}
                      {article.titleRegular}
                    </h3>
                    
                    {article.author && (
                      <p className="text-sm text-dark-gray">
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
  );
}