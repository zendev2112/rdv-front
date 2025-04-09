import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Article {
  titleHighlight: string;
  titleRegular: string;
  imageUrl: string;
  author?: string;
  source?: string;
}

interface AdContent {
  price: string;
  imageUrl: string;
  ctaText: string;
}

interface LifestyleFourColumnGridProps {
  articles: Article[];
  adContent: AdContent;
  sectionTitle: string;
}

export default function LifestyleFourColumnGrid({
  articles,
  adContent,
  sectionTitle,
}: LifestyleFourColumnGridProps) {
  return (
    <section className="container mx-auto px-4 py-6 border-t border-gray-200">
      <h2 className="text-2xl font-bold mb-6 uppercase">{sectionTitle}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* First 3 columns: Article cards */}
        {articles.slice(0, 3).map((article, index) => (
          <article key={index} className="mb-6">
            <div className="mb-3">
              <Image
                src={article.imageUrl}
                alt={`${article.titleHighlight} ${article.titleRegular}`}
                width={300}
                height={200}
                className="w-full h-32 object-cover"
              />
            </div>
            <h3 className="mb-2 leading-tight">
              <Link href="#" className="hover:underline">
                <span className="text-lifestyle font-bold">{article.titleHighlight}.</span>{" "}
                <span className="font-serif">{article.titleRegular}</span>
              </Link>
            </h3>
            {(article.author || article.source) && (
              <p className="text-xs text-gray-500">
                {article.author && `Por ${article.author}`}
                {article.author && article.source && " - "}
                {article.source}
              </p>
            )}
          </article>
        ))}
        
        {/* 4th column: Ad */}
        <div className="bg-purple-100 rounded-lg overflow-hidden flex flex-col">
          <div className="text-center pt-6 px-4 mb-2">
            <Image
              src="/placeholder.svg?height=60&width=120"
              alt="Adobe Creative Cloud"
              width={120}
              height={60}
              className="h-8 w-auto mx-auto"
            />
          </div>
          
          <div className="px-4 text-center">
            <p className="text-sm mb-1">Plan Creative Cloud completo</p>
            <p className="text-xl font-bold mb-3">{adContent.price}/mes*</p>
          </div>
          
          <div className="flex justify-center mb-4 relative">
            <div className="absolute top-0 right-10 w-12 h-12 rounded-full bg-purple-300"></div>
            <div className="absolute bottom-6 left-10 w-8 h-8 rounded-full bg-purple-200"></div>
            <Image
              src={adContent.imageUrl}
              alt="Adobe Creative"
              width={180}
              height={180}
              className="relative z-10"
            />
          </div>
          
          <div className="text-center px-4 mb-4">
            <p className="text-sm mb-4">Crea lo que quieras, donde quieras</p>
            <button className="bg-purple-700 text-white py-2 px-6 rounded-full text-sm hover:bg-purple-800">
              {adContent.ctaText}
            </button>
          </div>
          
          <div className="bg-purple-700 text-white text-xs p-2 mt-auto text-center">
            * Precio válido por 3 meses
          </div>
        </div>
      </div>
      
      {/* LN Movilidad section preview */}
      <div className="mt-8 border-t border-gray-200 pt-4">
        <div className="flex items-center mb-4">
          <h3 className="text-lg font-bold mr-6">LN MOVILIDAD</h3>
          <div className="flex space-x-4 text-sm">
            <Link href="#" className="text-gray-600 hover:text-blue-800 pb-1 border-b-2 border-blue-700">
              TEST DRIVE
            </Link>
            <Link href="#" className="text-gray-600 hover:text-blue-800">
              LANZAMIENTOS
            </Link>
            <Link href="#" className="text-gray-600 hover:text-blue-800">
              SEGURIDAD VIAL
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}