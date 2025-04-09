import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Article {
  id: number;
  titleHighlight: string;
  titleRegular: string;
  imageUrl?: string;
}

interface TopReadsProps {
  articles: Article[];
}

export default function TopReads({ articles }: TopReadsProps) {
  return (
    <section className="container mx-auto px-4 py-6 border-t border-gray-200">
      <h2 className="text-xl uppercase tracking-wide font-serif font-bold mb-6">MÁS LEÍDAS</h2>
      
      <div className="space-y-6">
        {articles.map((article) => (
          <article key={article.id} className="flex gap-4 items-start">
            <div className="text-4xl font-light font-serif text-gray-400 flex-shrink-0 w-10 text-right">
              {article.id}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row gap-4">
                <div className={`flex-1 ${article.imageUrl ? 'md:w-2/3' : 'w-full'}`}>
                  <h3 
                    className="text-lg leading-tight" 
                    title={`${article.titleHighlight} ${article.titleRegular}`}
                  >
                    <Link href="#" className="hover:text-blue-800">
                      <span className="font-bold">{article.titleHighlight}.</span> {article.titleRegular}
                    </Link>
                  </h3>
                </div>
                
                {article.imageUrl && (
                  <div className="md:w-1/3 flex-shrink-0">
                    <Image
                      src={article.imageUrl}
                      alt={`${article.titleHighlight} ${article.titleRegular}`}
                      width={150}
                      height={100}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}