import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Article {
  title: string;
  subtitle?: string;
  author?: string;
  imageUrl: string;
  excerpt?: string;
}

interface WellnessSectionProps {
  featuredArticle: Article;
  smallArticles: Article[];
}

export default function WellnessSection({
  featuredArticle,
  smallArticles,
}: WellnessSectionProps) {
  return (
    <section className="container mx-auto px-4 py-6 border-t border-gray-200">
      <h2 className="text-2xl font-bold mb-6 uppercase">BIENESTAR</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column: Featured article and small articles */}
        <div className="space-y-8">
          {/* Featured Article */}
          <article>
            <h3 className="text-2xl font-bold mb-2 font-serif leading-tight">
              <Link href="#" className="hover:text-blue-800">
                {featuredArticle.title}
              </Link>
            </h3>
            {featuredArticle.subtitle && (
              <p className="text-lg mb-3">{featuredArticle.subtitle}</p>
            )}
            <div className="mb-3">
              <Image
                src={featuredArticle.imageUrl}
                alt={featuredArticle.title}
                width={600}
                height={340}
                className="w-full h-auto"
              />
            </div>
            {featuredArticle.excerpt && (
              <p className="text-gray-700 mb-3">{featuredArticle.excerpt}</p>
            )}
            {featuredArticle.author && (
              <p className="text-sm text-gray-500">Por {featuredArticle.author}</p>
            )}
          </article>

          {/* Small Articles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {smallArticles.map((article, index) => (
              <article key={index} className="border-t border-gray-200 pt-4">
                <div className="mb-2">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    width={300}
                    height={200}
                    className="w-full h-auto"
                  />
                </div>
                <h4 className="font-bold font-serif mb-2 leading-tight">
                  <Link href="#" className="hover:text-blue-800">
                    {article.title}
                  </Link>
                </h4>
                {article.excerpt && (
                  <p className="text-sm text-gray-700 mb-2">{article.excerpt}</p>
                )}
                {article.author && (
                  <p className="text-xs text-gray-500">Por {article.author}</p>
                )}
              </article>
            ))}
          </div>
        </div>

        {/* Right column: Additional content would go here */}
        <div className="space-y-6">
          {/* This space is intentionally left empty per requirements */}
          {/* Additional content can be added here in the future */}
        </div>
      </div>
    </section>
  );
}