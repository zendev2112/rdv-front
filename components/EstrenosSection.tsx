'use client'

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface MovieArticle {
  id: number;
  title: string;
  quoteText?: string;
  headlineText: string;
  summary?: string;
  imageUrl: string;
  hasVideo?: boolean;
}

interface EstrenosSectionProps {
  articles: MovieArticle[];
}

export default function EstrenosSection({ articles }: EstrenosSectionProps) {
  return (
    <section className="border-t border-b border-gray-200 my-4">
      <div className="container mx-auto px-4 py-6">
        {/* Section header with red accent - matching MasNoticiasSection style */}
        <div className="flex items-center mb-6 pb-2 border-b border-[#292929]/20">
          <h2 className="text-2xl font-bold text-[#292929]">ESTRENOS</h2>
          <div className="ml-auto h-1 w-24 bg-primary-red"></div>
        </div>

        {/* Grid with 3 equal articles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
            >
              <Link
                href="#"
                className="flex flex-col h-full"
                onClick={(e) => {
                  e.preventDefault()
                  console.log(`Movie article clicked: ${article.id}`)
                }}
              >
                {/* Image on top with fixed aspect ratio */}
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={article.imageUrl}
                    alt={article.title || article.headlineText}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Video badge if applicable */}
                  {article.hasVideo && (
                    <div className="absolute top-2 left-2 bg-black text-white text-xs px-1 py-0.5">
                      VIDEO
                    </div>
                  )}
                  {/* Hover effect with gray overlay */}
                  <div className="absolute inset-0 bg-gray-800 bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
                </div>

                {/* Content area below image - now part of the link */}
                <div className="p-4 flex-grow">
                  {/* Title with quote if available and red text prefix */}
                  <h3 className="text-lg font-bold mb-2 leading-tight text-[#292929] group-hover:text-primary-red transition-colors">
                    <span className="text-primary-red font-bold">
                      Estrenos.
                    </span>{' '}
                    {article.quoteText && (
                      <span className="font-bold">"{article.quoteText}".</span>
                    )}{' '}
                    {article.headlineText}
                  </h3>

                  {/* Summary if available */}
                  {article.summary && (
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {article.summary}
                    </p>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}