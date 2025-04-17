'use client'

import React from "react";
import Image from "next/image";
import Link from "next/link";

// Define types for our component props
interface OpinionCard {
  author: string;
  title: string;
  avatarUrl: string;
}

interface FeaturedOpinion {
  author: string;
  title: string;
  imageUrl: string;
  excerpt?: string;
}

interface Editorial {
  title: string;
}

interface SmallOpinionCard {
  author: string;
  title: string;
}

interface OpinionSectionProps {
  opinionCards: OpinionCard[];
  featuredOpinion: FeaturedOpinion;
  editorials: Editorial[];
  smallOpinionCard: SmallOpinionCard;
}

export default function OpinionSection({
  opinionCards,
  featuredOpinion,
  editorials,
  smallOpinionCard,
}: OpinionSectionProps) {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {/* Section header with red accent - matching MasNoticiasSection */}
        <div className="flex items-center mb-6 pb-2 border-b border-[#292929]/20">
          <h2 className="text-2xl font-bold text-[#292929]">
            OPINIÓN
          </h2>
          <div className="ml-auto h-1 w-24 bg-primary-red"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column: Vertical list of OpinionCard */}
          <div className="space-y-6">
            {opinionCards.map((card, index) => (
              <article 
                key={index} 
                className="flex items-start hover:bg-gray-50 p-3 rounded-md transition-colors duration-300"
              >
                <div className="mr-4 flex-shrink-0">
                  <Image
                    src={card.avatarUrl}
                    alt={card.author}
                    width={60}
                    height={60}
                    className="rounded-full h-14 w-14 object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-dark-gray mb-1">{card.author}</h3>
                  <h4 className="font-bold text-lg leading-tight text-[#292929] hover:text-primary-red transition-colors">
                    <Link href="#">{card.title}</Link>
                  </h4>
                </div>
              </article>
            ))}
          </div>
          
          {/* Center column: FeaturedOpinionCard */}
          <div className="border-l border-r border-gray-200 px-6">
            <article className="group">
              <div className="mb-4 relative aspect-[4/3] w-full overflow-hidden rounded-md">
                <Image
                  src={featuredOpinion.imageUrl}
                  alt={featuredOpinion.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Hover effect with gray overlay - matching MasNoticiasSection */}
                <div className="absolute inset-0 bg-gray-800 bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 leading-tight text-[#292929]">
                <span className="text-primary-red font-bold">Opinión.</span>{' '}
                <Link href="#" className="hover:text-primary-red transition-colors">{featuredOpinion.title}</Link>
              </h3>
              
              {featuredOpinion.excerpt && (
                <p className="text-dark-gray mb-4 line-clamp-3">{featuredOpinion.excerpt}</p>
              )}
              
              <div className="text-sm text-dark-gray">
                Por {featuredOpinion.author}
              </div>
            </article>
          </div>
          
          {/* Right column: EditorialsCard and SmallOpinionCard */}
          <div className="space-y-8">
            {/* EditorialsCard - styled like the headlines in MasNoticiasSection */}
            <div className="bg-white border border-gray-100 rounded-md overflow-hidden">
              <div className="border-l-4 border-primary-red pl-4 py-4 mb-2">
                <h3 className="text-xl font-bold leading-tight text-[#292929]">
                  EDITORIALES
                </h3>
              </div>
              
              <ul className="space-y-0">
                {editorials.map((editorial, index) => (
                  <li 
                    key={index}
                    className="relative pl-8 pr-4 py-3 border-t border-gray-100 first:border-t-0"
                  >
                    {/* Dot and line styling - matching MasNoticiasSection */}
                    <div className="absolute left-4 top-0 bottom-0 flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-primary-red mt-4"></div>
                      {index < editorials.length - 1 && (
                        <div className="w-0.5 bg-gray-200 flex-grow"></div>
                      )}
                    </div>
                    
                    <Link 
                      href="#" 
                      className="text-base font-medium leading-tight text-[#292929] hover:text-primary-red transition-colors block"
                    >
                      {editorial.title}
                    </Link>
                  </li>
                ))}
              </ul>
              
              <div className="p-4 text-right border-t border-gray-100">
                <Link href="#" className="text-xs font-medium text-primary-red hover:underline inline-flex items-center">
                  Ver más editoriales
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* SmallOpinionCard - consistent with the card style */}
            <div className="bg-white border border-gray-100 rounded-md p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-sm text-dark-gray mb-1">{smallOpinionCard.author}</h3>
              <h4 className="font-bold text-lg leading-tight text-[#292929] hover:text-primary-red transition-colors">
                <Link href="#">{smallOpinionCard.title}</Link>
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}