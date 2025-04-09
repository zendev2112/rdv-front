import React from "react";
import Image from "next/image";
import Link from "next/link";

interface MainArticle {
  titleHighlight: string;
  titleRegular: string;
  subtitle: string;
  imageUrl: string;
}

interface SmallArticle {
  titleHighlight: string;
  titleRegular: string;
  imageUrl: string;
}

interface LifestyleFeatureProps {
  mainArticle: MainArticle;
  smallArticles: SmallArticle[];
  sectionTitle: string;
}

export default function LifestyleFeature({
  mainArticle,
  smallArticles,
  sectionTitle,
}: LifestyleFeatureProps) {
  return (
    <section className="container mx-auto px-4 py-6 border-t border-gray-200">
      <h2 className="text-2xl font-bold mb-6 uppercase">{sectionTitle}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Main featured article - spans all columns */}
        <article className="md:col-span-4 mb-8">
          <div className="mb-4">
            <Image 
              src={mainArticle.imageUrl}
              alt={`${mainArticle.titleHighlight} ${mainArticle.titleRegular}`}
              width={900}
              height={500}
              className="w-full h-auto"
            />
          </div>
          <h3 className="text-2xl mb-2 leading-tight">
            <span className="text-red-600 font-bold">{mainArticle.titleHighlight}.</span>{" "}
            {mainArticle.titleRegular}
          </h3>
          <p className="text-gray-600">{mainArticle.subtitle}</p>
        </article>

        {/* Row of 3 article cards */}
        {smallArticles.map((article, index) => (
          <article 
            key={index} 
            className={`flex flex-col md:flex-row gap-4 ${
              index > 0 ? 'md:border-l md:border-gray-200 md:pl-4' : ''
            }`}
          >
            <div className="md:flex-1">
              <h4 className="text-base leading-tight mb-2">
                <Link href="#" className="hover:underline">
                  <span className="text-red-600 font-bold">{article.titleHighlight}.</span>{" "}
                  {article.titleRegular}
                </Link>
              </h4>
            </div>
            <div className="md:w-1/3 order-first md:order-last">
              <Image 
                src={article.imageUrl}
                alt={`${article.titleHighlight} ${article.titleRegular}`}
                width={150}
                height={100}
                className="w-full h-auto"
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}