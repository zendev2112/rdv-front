import React from "react";
import Image from "next/image";
import Link from "next/link";

interface MainArticle {
  titleBold: string;
  titleRegular: string;
  caption: string;
  imageUrl: string;
  author?: string;
}

interface SideArticle {
  titleBold: string;
  titleRegular: string;
  imageUrl: string;
  author?: string;
}

interface BusinessMainFeatureProps {
  mainArticle: MainArticle;
  sideArticles: SideArticle[];
}

export default function BusinessMainFeature({
  mainArticle,
  sideArticles,
}: BusinessMainFeatureProps) {
  return (
    <section className="container mx-auto px-4 py-6 border-t border-gray-200">
      <h2 className="text-xl uppercase font-serif font-bold text-red-600 mb-6">
        COMUNIDAD DE negocios
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column - Main article */}
        <div>
          <article>
            <div className="mb-4">
              <Image
                src={mainArticle.imageUrl}
                alt={`${mainArticle.titleBold} ${mainArticle.titleRegular}`}
                width={600}
                height={400}
                className="w-full object-cover"
              />
            </div>
            <h3 className="text-2xl font-serif mb-2 leading-tight">
              <Link href="#" className="hover:text-blue-800">
                <span className="font-bold">{mainArticle.titleBold}.</span> {mainArticle.titleRegular}
              </Link>
            </h3>
            <p className="text-sm text-gray-600 mb-2">{mainArticle.caption}</p>
            {mainArticle.author && (
              <p className="text-xs text-gray-500">Por {mainArticle.author}</p>
            )}
          </article>
        </div>
        
        {/* Right column - Side articles */}
        <div className="space-y-4">
          {sideArticles.map((article, index) => (
            <article key={index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0">
              <div className="flex-1">
                <h4 className="text-lg font-serif leading-tight mb-2">
                  <Link href="#" className="hover:text-blue-800">
                    <span className="font-semibold">{article.titleBold}.</span> {article.titleRegular}
                  </Link>
                </h4>
                {article.author && (
                  <p className="text-xs text-gray-500">Por {article.author}</p>
                )}
              </div>
              <div className="flex-shrink-0">
                <Image
                  src={article.imageUrl}
                  alt={`${article.titleBold} ${article.titleRegular}`}
                  width={100}
                  height={75}
                  className="w-24 h-auto object-cover"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}