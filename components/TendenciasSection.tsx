'use client'

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FeaturedItem {
  imageUrl: string;
  title: string;
  description: string;
}

interface ContentCard {
  imageUrl: string;
  highlightedText: string;
  regularText: string;
}

interface TendenciasSectionProps {
  hashtagName: string;
  featuredItem: FeaturedItem;
  contentCards: ContentCard[];
}

export default function TendenciasSection({
  hashtagName,
  featuredItem,
  contentCards,
}: TendenciasSectionProps) {
  return (
    <section className="container mx-auto px-4 py-8 border-t border-gray-200">
      {/* Hashtag Title - styled as a graphic label */}
      <div className="inline-block mb-8 relative">
        <span className="bg-primary-red absolute inset-0 transform skew-x-12 rounded-r-md"></span>
        <h2 className="text-2xl md:text-3xl font-black px-6 py-2 relative text-white">
          #{hashtagName}
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Featured circular image with title/description */}
        <div className="md:w-1/3 flex flex-col items-center text-center">
          <Link href="#" className="group flex flex-col items-center">
            <div className="mb-6 w-48 h-48 md:w-64 md:h-64 relative overflow-hidden rounded-full shadow-lg border-4 border-white">
              <Image
                src={featuredItem.imageUrl}
                alt={featuredItem.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            <Badge className="mb-3 bg-primary-red hover:bg-primary-red text-white">
              Destacado
            </Badge>
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary-red transition-colors">
              {featuredItem.title}
            </h3>
            <p className="text-dark-gray">{featuredItem.description}</p>
          </Link>
        </div>

        {/* Right: 3-column grid of content cards */}
        <div className="md:w-2/3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {contentCards.map((card, index) => (
              <Card
                key={index}
                className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
              >
                <Link href="#" className="block w-full">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={card.imageUrl}
                      alt={`${card.highlightedText} ${card.regularText}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gray-800 bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-12"></div>
                  </div>
                  <CardContent className="p-3">
                    <div className="text-center">
                      <span className="text-primary-red font-bold">
                        {card.highlightedText}
                      </span>{' '}
                      <span className="text-dark-gray">{card.regularText}</span>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}