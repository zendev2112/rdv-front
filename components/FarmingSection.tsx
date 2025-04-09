import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Article {
  title: string;
  subtitle?: string;
  author?: string;
  imageUrl: string;
}

interface FarmingSectionProps {
  mainArticle: Article;
  sideArticles: Article[];
}

export default function FarmingSection({
  mainArticle,
  sideArticles,
}: FarmingSectionProps) {
  return (
    <section className="container mx-auto px-4 py-6 border-t border-gray-200">
      <h2 className="text-2xl font-bold mb-6 uppercase">CAMPO</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {/* Left column: Main featured article */}
        <div>
          <article>
            <div className="mb-4">
              <Image
                src={mainArticle.imageUrl}
                alt={mainArticle.title}
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
            <h3 className="text-2xl font-bold font-serif mb-2 leading-tight">
              <Link href="#" className="hover:text-blue-800">
                {mainArticle.title}
              </Link>
            </h3>
            {mainArticle.subtitle && (
              <p className="text-gray-700 mb-3">{mainArticle.subtitle}</p>
            )}
            {mainArticle.author && (
              <p className="text-sm text-gray-500">Por {mainArticle.author}</p>
            )}
          </article>
        </div>
        
        {/* Right column: Stacked article cards */}
        <div className="space-y-4">
          {sideArticles.map((article, index) => (
            <article key={index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0">
              <div className="flex-1">
                <h4 className="text-lg font-bold font-serif mb-2 leading-tight">
                  <Link href="#" className="hover:text-blue-800">
                    {article.title}
                  </Link>
                </h4>
                {article.subtitle && (
                  <p className="text-sm text-gray-700 mb-1">{article.subtitle}</p>
                )}
                {article.author && (
                  <p className="text-xs text-gray-500">Por {article.author}</p>
                )}
              </div>
              <div className="w-1/3 flex-shrink-0">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  width={200}
                  height={150}
                  className="w-full h-auto"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}