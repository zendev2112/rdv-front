import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Article {
  titleHighlight: string;
  titleRegular: string;
  imageUrl: string;
}

interface TechSectionProps {
  articles: Article[];
}

export default function TechSection({ articles }: TechSectionProps) {
  return (
    <section className="container mx-auto px-4 py-6 border-t border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold uppercase text-tech mb-6">TECNOLOGÍA</h2>
        <Link href="#" className="text-gray-700 hover:text-blue-800 flex items-center">
          <span className="text-sm mr-1">Ver más</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <article 
            key={index} 
            className={`${
              index < articles.length - 1 ? "md:border-r md:border-gray-200 md:pr-4" : ""
            }`}
          >
            <div className="mb-3">
              <Image
                src={article.imageUrl}
                alt={`${article.titleHighlight} ${article.titleRegular}`}
                width={400}
                height={300}
                className="w-full h-auto"
              />
            </div>
            <h3 className="text-lg leading-tight hover:underline">
              <Link href="#">
                <span className="font-bold">{article.titleHighlight}.</span> {article.titleRegular}
              </Link>
            </h3>
          </article>
        ))}
      </div>
    </section>
  );
}