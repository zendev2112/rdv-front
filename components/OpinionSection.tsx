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
    <section className="container mx-auto px-4 py-6 border-t border-gray-200">
      <h2 className="text-2xl font-bold mb-6 uppercase">OPINIÓN</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column: Vertical list of OpinionCard */}
        <div className="space-y-6">
          {opinionCards.map((card, index) => (
            <article key={index} className="flex items-start">
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
                <h3 className="font-medium text-gray-600 mb-1">{card.author}</h3>
                <h4 className="font-bold text-lg leading-tight hover:text-blue-800">
                  <Link href="#">{card.title}</Link>
                </h4>
              </div>
            </article>
          ))}
        </div>
        
        {/* Center column: FeaturedOpinionCard */}
        <div className="border-l border-r border-gray-200 px-6">
          <article>
            <h3 className="text-2xl font-bold mb-4 leading-tight hover:text-blue-800">
              <Link href="#">{featuredOpinion.title}</Link>
            </h3>
            <div className="mb-4">
              <Image
                src={featuredOpinion.imageUrl}
                alt={featuredOpinion.title}
                width={400}
                height={250}
                className="w-full h-auto"
              />
            </div>
            {featuredOpinion.excerpt && (
              <p className="text-gray-700 mb-4">{featuredOpinion.excerpt}</p>
            )}
            <div className="font-medium text-gray-600">
              Por {featuredOpinion.author}
            </div>
          </article>
        </div>
        
        {/* Right column: EditorialsCard and SmallOpinionCard */}
        <div className="space-y-8">
          {/* EditorialsCard */}
          <div>
            <h3 className="font-bold text-lg mb-3 uppercase">EDITORIALES</h3>
            <ul className="space-y-4">
              {editorials.map((editorial, index) => (
                <li key={index} className="pb-3 border-b border-gray-200 last:border-b-0">
                  <Link href="#" className="font-semibold hover:text-blue-800">
                    {editorial.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* SmallOpinionCard */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-600 mb-1">{smallOpinionCard.author}</h3>
            <h4 className="font-bold text-lg leading-tight hover:text-blue-800">
              <Link href="#">{smallOpinionCard.title}</Link>
            </h4>
          </div>
        </div>
      </div>
    </section>
  );
}