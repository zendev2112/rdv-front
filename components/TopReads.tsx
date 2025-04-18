'use client'

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface TopReadArticle {
  id: number;
  title: string;
  summary: string;
  imageUrl?: string;
}

interface TopReadsProps {
  articles: TopReadArticle[];
}

export default function TopReads({ articles }: TopReadsProps) {
  // Separate the first article from the rest
  const featuredArticle = articles.find(article => article.id === 1);
  const remainingArticles = articles.filter(article => article.id !== 1);

  // Function to format title with bold parts
  const formatTitle = (title: string) => {
    // If title contains quotes, bold the text within quotes
    if (title.includes('"') || title.includes('"')) {
      return title.split(/("[^"]+")/).map((part, index) => {
        if (part.startsWith('"') && part.endsWith('"')) {
          return <strong key={index}>{part}</strong>;
        }
        return part;
      });
    }
    
    // If no quotes, return as is
    return title;
  };

  return (
    <section className="container mx-auto px-4 py-6 border-t border-gray-200">
      <div className="flex items-center mb-6 pb-2 border-b border-[#292929]/20">
        <h2 className="text-2xl font-bold text-[#292929]">
          MAS LEÍDAS
        </h2>
        <div className="ml-auto h-1 w-24 bg-primary-red"></div>
      </div>

      <div className="flex flex-col md:flex-row h-[450px] gap-4">
        {/* Featured Article (id === 1) - 30% width, 100% height */}
        {featuredArticle && (
          <div className="w-full md:w-[30%] h-full">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden h-full">
              <CardContent className="p-0 flex flex-col h-full">
                <Link 
                  href="#" 
                  className="flex flex-col h-full group"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log(`Featured article clicked: ${featuredArticle.id}`);
                  }}
                >
                  {/* Image positioned at the top, taller */}
                  <div className="relative w-full h-[60%]">
                    <Image
                      src={featuredArticle.imageUrl || '/placeholder.svg?height=300&width=400'}
                      alt={featuredArticle.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gray-800 bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
                  </div>
                  
                  {/* Content area with number left, text right */}
                  <div className="flex flex-row h-[40%]">
                    {/* Number on left */}
                    <div className="text-5xl font-light text-primary-red pl-4 pt-4 pr-2 w-[25%] flex items-start justify-center">
                      {featuredArticle.id}
                    </div>
                    
                    {/* Text content on right */}
                    <div className="p-4 flex-grow flex flex-col justify-between w-[75%]">
                      <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-primary-red transition-colors">
                        <span className="text-primary-red font-bold">Destacado.</span>{' '}
                        {formatTitle(featuredArticle.title)}
                      </h3>
                      <p className="text-dark-gray text-sm">
                        {featuredArticle.summary}
                      </p>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Remaining Articles - 70% width, divided into 2 columns */}
        <div className="w-full md:w-[70%] h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            <div className="flex flex-col gap-4">
              {/* Articles 2 and 3 in first column */}
              {remainingArticles.slice(0, 2).map(article => (
                <Card 
                  key={article.id} 
                  className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden h-1/2"
                >
                  <CardContent className="p-0 h-full">
                    <Link 
                      href="#" 
                      className="flex h-full group"
                      onClick={(e) => {
                        e.preventDefault();
                        console.log(`Article clicked: ${article.id}`);
                      }}
                    >
                      {/* Text on left (65% width) */}
                      <div className="w-[65%] p-4">
                        <div className="text-4xl font-light text-primary-red mb-2">
                          {article.id}
                        </div>
                        <h3 className="text-base font-bold leading-tight mb-2 group-hover:text-primary-red transition-colors">
                          <span className="text-primary-red font-bold">Noticia.</span>{' '}
                          {formatTitle(article.title)}
                        </h3>
                        <p className="text-dark-gray text-xs line-clamp-3">
                          {article.summary}
                        </p>
                      </div>
                      
                      {/* Image on right (35% width) */}
                      <div className="relative w-[35%]">
                        <Image
                          src={article.imageUrl || '/placeholder.svg?height=200&width=150'}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gray-800 bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex flex-col gap-4">
              {/* Articles 4 and 5 in second column */}
              {remainingArticles.slice(2, 4).map(article => (
                <Card 
                  key={article.id} 
                  className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden h-1/2"
                >
                  <CardContent className="p-0 h-full">
                    <Link 
                      href="#" 
                      className="flex h-full group"
                      onClick={(e) => {
                        e.preventDefault();
                        console.log(`Article clicked: ${article.id}`);
                      }}
                    >
                      {/* Text on left (65% width) */}
                      <div className="w-[65%] p-4">
                        <div className="text-4xl font-light text-primary-red mb-2">
                          {article.id}
                        </div>
                        <h3 className="text-base font-bold leading-tight mb-2 group-hover:text-primary-red transition-colors">
                          <span className="text-primary-red font-bold">Noticia.</span>{' '}
                          {formatTitle(article.title)}
                        </h3>
                        <p className="text-dark-gray text-xs line-clamp-3">
                          {article.summary}
                        </p>
                      </div>
                      
                      {/* Image on right (35% width) */}
                      <div className="relative w-[35%]">
                        <Image
                          src={article.imageUrl || '/placeholder.svg?height=200&width=150'}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gray-800 bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}