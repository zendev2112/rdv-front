'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';

// This interface aligns with your database schema
interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  article?: string;
  status?: string;
  featured?: boolean;
  imgUrl?: string;
  published_at?: string;
  airtable_id?: string;
  created_at?: string;
  updated_at?: string;
  image?: any; // jsonb in the database
  overline?: string;
  "ig - post"?: string;
  "fb - post"?: string;
  "tw - post"?: string;
  "yt - video"?: string;
  "article - images"?: string;
  url?: string;
  source?: string;
  section?: string;
  "airtable - id"?: string;
  tags?: string;
  social_media_text?: string;
}

interface CulturaSectionProps {
  mainArticle: Article;
  sideArticles: Article[];
  title?: string;
}

const CulturaSection: React.FC<CulturaSectionProps> = ({
  mainArticle,
  sideArticles,
  title = "CULTURA",
}) => {
  // Format the title with the optional overline
  const formatTitle = (article: Article): React.ReactNode => {
    if (article.overline) {
      return (
        <>
          <span className="font-bold">{article.overline}.</span>{' '}
          {article.title}
        </>
      );
    }
    
    return article.title;
  };

  // Determine if an article has video content
  const hasVideo = (article: Article): boolean => {
    // Check if article has a YouTube video link
    return Boolean(article["yt - video"]);
  };

  return (
    <section className="container mx-auto px-4 py-6 border-t border-gray-200">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary-800">{title}</h2>
        <Link 
          href="/cultura" 
          className="text-sm text-blue-600 hover:underline flex items-center"
        >
          Ver más
          <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none">
            <path 
              d="M9 18L15 12L9 6" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Article */}
        <div className="md:col-span-2 space-y-4">
          <div className="relative overflow-hidden rounded-lg">
            <Link href={`/article/${mainArticle.slug}`}>
              <Image
                src={mainArticle.imgUrl || (mainArticle.image?.url as string) || '/placeholder.svg'}
                alt={mainArticle.title}
                width={600}
                height={400}
                className="w-full object-cover rounded-lg"
              />
              {hasVideo(mainArticle) && (
                <div className="absolute bottom-3 left-3 bg-red-600 text-white p-1 rounded-md flex items-center">
                  <Play size={16} className="mr-1" />
                  <span className="text-xs">VIDEO</span>
                </div>
              )}
              {mainArticle.section && (
                <div className="absolute top-3 left-3 bg-white/80 text-primary-800 px-2 py-1 rounded text-xs font-medium">
                  {mainArticle.section.toUpperCase()}
                </div>
              )}
            </Link>
          </div>
          
          <div>
            <Link href={`/article/${mainArticle.slug}`} className="hover:text-blue-600">
              <h3 className="text-xl font-semibold mb-2">
                {formatTitle(mainArticle)}
              </h3>
            </Link>
            {mainArticle.excerpt && (
              <p className="text-gray-700 mb-3 line-clamp-3">{mainArticle.excerpt}</p>
            )}
            {mainArticle.source && (
              <p className="text-sm text-gray-500">Por {mainArticle.source}</p>
            )}
            <div className="text-xs text-gray-400 mt-2">
              {mainArticle.published_at && (
                new Date(mainArticle.published_at).toLocaleDateString('es-AR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })
              )}
            </div>
          </div>
        </div>

        {/* Side Articles */}
        <div className="space-y-6">
          {sideArticles.map((article) => (
            <div key={article.id} className="flex flex-col space-y-3">
              <div className="relative overflow-hidden rounded-lg">
                <Link href={`/article/${article.slug}`}>
                  <Image
                    src={article.imgUrl || (article.image?.url as string) || '/placeholder.svg'}
                    alt={article.title}
                    width={300}
                    height={200}
                    className="w-full object-cover rounded-lg"
                  />
                  {hasVideo(article) && (
                    <div className="absolute bottom-2 left-2 bg-red-600 text-white p-1 rounded-md flex items-center">
                      <Play size={12} className="mr-1" />
                      <span className="text-xs">VIDEO</span>
                    </div>
                  )}
                  {article.section && (
                    <div className="absolute top-2 left-2 bg-white/80 text-primary-800 px-2 py-0.5 rounded text-xs font-medium">
                      {article.section.toUpperCase()}
                    </div>
                  )}
                </Link>
              </div>
              
              <div>
                <Link href={`/article/${article.slug}`} className="hover:text-blue-600">
                  <h4 className="text-base font-medium mb-1">
                    {formatTitle(article)}
                  </h4>
                </Link>
                {article.excerpt && (
                  <p className="text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>
                )}
                {article.source && (
                  <p className="text-xs text-gray-500 mt-1">Por {article.source}</p>
                )}
                <div className="text-xs text-gray-400 mt-1">
                  {article.published_at && (
                    new Date(article.published_at).toLocaleDateString('es-AR', {
                      day: 'numeric',
                      month: 'long'
                    })
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CulturaSection;