"use client"

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from './ui/badge'
import { Card, CardContent } from './ui/card'

interface TechArticle {
  titleHighlight: string;
  titleRegular: string;
  imageUrl: string;
  summary?: string;
  author?: string;
  hasVideo?: boolean;
}

interface TechSectionProps {
  articles: TechArticle[];
}

export default function TechSection({ articles }: TechSectionProps) {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">TECNOLOGÍA</h2>
        <a href="#" className="text-primary-red text-sm font-medium hover:underline">
          Ver más
        </a>
      </div>

      {/* Tech Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <a 
            key={index} 
            href="#" 
            className="block bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
            onClick={(e) => {
              e.preventDefault();
              console.log(`Tech article ${index} clicked`);
            }}
          >
            <Card className="border-0 shadow-none h-full">
              <CardContent className="p-0 flex flex-col h-full">
                {/* Article Image */}
                <div className="relative w-full h-[200px] mb-4">
                  <Image
                    src={article.imageUrl}
                    alt={`${article.titleHighlight} ${article.titleRegular}`}
                    fill
                    className="object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Hover effect with gray overlay */}
                  <div className="absolute inset-0 bg-gray-800 bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
                  {article.hasVideo && (
                    <Badge
                      className="absolute top-2 left-2 bg-black text-white border-0 rounded px-2 py-1 text-xs"
                      variant="outline"
                    >
                      VIDEO
                    </Badge>
                  )}
                </div>
                
                {/* Article Content */}
                <div className="px-4 pb-4">
                  <h3 className="text-lg font-bold mb-2 leading-tight">
                    <span className="text-primary-red font-bold">{article.titleHighlight}.</span>{' '}
                    {article.titleRegular}
                  </h3>
                  {article.summary && (
                    <p className="text-sm text-dark-gray mb-2">
                      {article.summary}
                    </p>
                  )}
                  {article.author && (
                    <p className="text-sm text-dark-gray">Por {article.author}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  )
}