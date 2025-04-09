import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Article {
  title: string;
  subtitle?: string;
  author?: string;
  imageUrl: string;
  hasFeaturedBadge?: boolean;
}

interface LifestyleSectionProps {
  mainArticle: Article;
  storyCards: Article[];
  sectionTitle: string;
}

export default function LifestyleSection({
  mainArticle,
  storyCards,
  sectionTitle,
}: LifestyleSectionProps) {
  return (
    <section className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6 uppercase">{sectionTitle}</h2>
      
      {/* Main Feature - 2 column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Left column: Text content */}
        <div className="flex flex-col justify-center">
          <h3 className="text-2xl font-serif font-bold mb-4 leading-tight">
            {mainArticle.title}
          </h3>
          {mainArticle.subtitle && (
            <p className="text-gray-700 mb-4 font-serif">{mainArticle.subtitle}</p>
          )}
          {mainArticle.author && (
            <p className="text-sm text-gray-500">Por {mainArticle.author}</p>
          )}
        </div>
        
        {/* Right column: Image */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <Image
              src={mainArticle.imageUrl}
              alt={mainArticle.title}
              width={400}
              height={600}
              className="rounded w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
      
      {/* Divider */}
      <div className="border-t border-gray-200 my-6"></div>
      
      {/* Story Cards - 2 column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
        {storyCards.map((card, index) => (
          <article key={index} className="flex flex-col md:flex-row gap-4">
            <div className="md:w-1/3 relative">
              <Image
                src={card.imageUrl}
                alt={card.title}
                width={200}
                height={150}
                className="w-full h-auto object-cover"
              />
              {card.hasFeaturedBadge && (
                <div className="absolute top-2 right-2 bg-yellow-300 text-black text-xs px-2 py-1 rounded-full">
                  DESTACADO
                </div>
              )}
            </div>
            <div className="md:w-2/3">
              <h4 className="text-lg font-bold mb-2 leading-tight">
                <Link href="#" className="hover:text-blue-800">
                  {card.title}
                </Link>
              </h4>
              {card.subtitle && (
                <p className="text-sm text-gray-700 mb-2">{card.subtitle}</p>
              )}
              {card.author && (
                <p className="text-xs text-gray-500">Por {card.author}</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}