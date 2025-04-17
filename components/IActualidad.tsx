'use client'

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Article {
  id?: string;
  title: string;
  subtitle?: string;
  content?: string;
  author?: string;
  imageUrl: string;
}

interface CategoryLink {
  name: string;
  href: string;
}

interface IActualidadProps {
  logo: {
    src: string;
    alt: string;
  };
  categories: CategoryLink[];
  mainArticle: Article;
  sideArticles: Article[];
}

export default function IActualidad({
  logo,
  categories,
  mainArticle,
  sideArticles,
}: IActualidadProps) {
  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        {/* Divisory line */}
        <div className="border-b border-[#292929]/20 mb-6"></div>
        
        {/* Logo row */}
        <div className="mb-4">
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
        </div>
        
        {/* Categories moved to left */}
        <div className="mb-4">
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
        </div>
        
        {/* Main content layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main article with MasNoticias card behavior */}
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
                {/* Image container - LARGER */}
                <div className="md:w-1/2 relative aspect-[16/9] md:aspect-[3/2] overflow-hidden">
                  <Image
                    src={mainArticle.imageUrl}
                    alt={mainArticle.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Hover effect with gray overlay */}
                  <div className="absolute inset-0 bg-gray-800 bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
                </div>
                
                {/* Content area */}
                <div className="md:w-1/2 p-4 md:p-6">
                  <h2 className="text-xl md:text-2xl font-bold mb-3 leading-tight">
                    <span className="text-primary-red font-bold">Actualidad.</span>{' '}
                    {mainArticle.title}
                  </h2>
                  
                  {mainArticle.content && (
                    <p className="text-dark-gray mb-3">
                      {mainArticle.content}
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
          
          {/* Side articles with text on LEFT and image on RIGHT - larger size */}
          <div className="md:col-span-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sideArticles.map((article, index) => (
                <a 
                  href="#" 
                  key={index}
                  className="flex bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group h-40"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log(`Side article ${index} clicked`);
                  }}
                >
                  {/* Content area - LEFT */}
                  <div className="p-4 w-1/2 flex flex-col justify-center">
                    <h3 className="text-base font-bold leading-tight">
                      <span className="text-primary-red font-bold">Actualidad.</span>{' '}
                      {article.title}
                    </h3>
                  </div>
                  
                  {/* Image container - RIGHT - larger size */}
                  <div className="relative w-1/2 overflow-hidden">
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Hover effect with gray overlay */}
                    <div className="absolute inset-0 bg-gray-800 bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
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