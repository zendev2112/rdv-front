import React from "react";
import Image from "next/image";
import Link from "next/link";

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

interface HashtagSectionProps {
  hashtagName: string;
  featuredItem: FeaturedItem;
  contentCards: ContentCard[];
}

export default function HashtagSection({
  hashtagName,
  featuredItem,
  contentCards,
}: HashtagSectionProps) {
  return (
    <section className="container mx-auto px-4 py-6 border-t border-gray-200">
      {/* Hashtag Title - styled as a graphic label */}
      <div className="inline-block mb-6 relative">
        <span className="bg-yellow-400 absolute inset-0 transform skew-x-12"></span>
        <h2 className="text-2xl md:text-3xl font-black px-6 py-1 relative">
          #{hashtagName}
        </h2>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Featured circular image with title/description */}
        <div className="md:w-1/3 flex flex-col items-center text-center">
          <div className="mb-4 w-48 h-48 md:w-64 md:h-64 relative overflow-hidden rounded-full">
            <Image
              src={featuredItem.imageUrl}
              alt={featuredItem.title}
              fill
              className="object-cover"
            />
          </div>
          <h3 className="text-xl font-bold mb-2">{featuredItem.title}</h3>
          <p className="text-gray-600">{featuredItem.description}</p>
        </div>
        
        {/* Right: 3-column grid of content cards */}
        <div className="md:w-2/3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {contentCards.map((card, index) => (
              <div key={index} className="flex flex-col items-center">
                <Link href="#" className="block w-full">
                  <div className="mb-3 aspect-video relative">
                    <Image
                      src={card.imageUrl}
                      alt={`${card.highlightedText} ${card.regularText}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-center px-2">
                    <span className="font-bold underline">{card.highlightedText}</span>{" "}
                    <span className="text-sm">{card.regularText}</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}