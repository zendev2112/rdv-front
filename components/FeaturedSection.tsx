import React from "react";

interface FeaturedArticle {
  title: string;
  timestamp: string;
}

interface Recommendation {
  title: string;
  description: string;
}

interface FeaturedSectionProps {
  featuredArticle: FeaturedArticle;
  recommendations: Recommendation[];
}

export default function FeaturedSection({
  featuredArticle,
  recommendations,
}: FeaturedSectionProps) {
  return (
    <div className="bg-gray-100 p-6 rounded-lg">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-baseline">
          <h1 className="text-2xl font-bold mr-2">LA NACION</h1>
          <h2 className="text-lg">QUÉ SALE?</h2>
        </div>
      </div>

      {/* Featured Article Section */}
      <div className="mb-6">
        <h3 className="text-xl font-bold">{featuredArticle.title}</h3>
        <p className="text-gray-500 text-xs mt-1">{featuredArticle.timestamp}</p>
        <hr className="border-gray-200 my-4" />
      </div>

      {/* Recommendations Section */}
      <div>
        <h3 className="text-base font-bold mb-4">Recomendados</h3>
        {recommendations.map((recommendation, index) => (
          <div 
            key={index} 
            className="bg-white p-4 rounded-lg shadow-sm mb-4"
          >
            <h4 className="text-lg font-bold mb-2">{recommendation.title}</h4>
            <p className="text-gray-600 text-sm mb-4">{recommendation.description}</p>
            <button className="text-blue-600 font-medium hover:underline">
              Probar ahora
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}