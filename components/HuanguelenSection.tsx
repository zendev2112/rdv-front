'use client'

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useArticles } from "../hooks/useArticles";
import { useState } from "react";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  imgUrl?: string;
  overline?: string;
  order?: string; // "principal", "secundario", "normal"
  created_at?: string;
  section?: string;
  author?: string;
  isVideo?: boolean;
  hasVideo?: boolean;
}

interface HuanguelenSectionProps {
  serverData?: Article[];
}

function getSectionPath(section: string | undefined): string {
  if (!section) {
    return 'sin-categoria'
  }
  if (section.includes('.')) {
    return section.split('.').join('/')
  }
  return section
}

export default function HuanguelenSection({ serverData }: HuanguelenSectionProps) {
  const {
    articles: clientArticles,
    loading,
    error,
  } = useArticles('HuanguelenSection', 3);

  const articles = serverData && serverData.length > 0 ? serverData : clientArticles;

  const processedArticles = React.useMemo(() => {
    const sorted = [...articles].sort((a, b) =>
      a.created_at && b.created_at
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : 0
    );

    let slots = sorted.slice(0, 3);

    const principal = sorted.find((a) => a.order === 'principal');
    const secundario = sorted.find((a) => a.order === 'secundario');
    const normal = sorted.find((a) => a.order === 'normal');

    if (principal) {
      slots = slots.filter((a) => a.id !== principal.id);
      slots.splice(0, 0, principal);
    }

    if (secundario) {
      slots = slots.filter((a) => a.id !== secundario.id);
      while (slots.length < 2) {
        const nextArticle = sorted.find((a) => !slots.some((s) => s.id === a.id));
        if (nextArticle) slots.push(nextArticle);
        else break;
      }
      slots.splice(1, 0, secundario);
    }

    if (normal) {
      slots = slots.filter((a) => a.id !== normal.id);
      while (slots.length < 3) {
        const nextArticle = sorted.find((a) => !slots.some((s) => s.id === a.id));
        if (nextArticle) slots.push(nextArticle);
        else break;
      }
      slots.splice(2, 0, normal);
    }

    while (slots.length < 3) {
      const nextArticle = sorted.find((a) => !slots.some((s) => s.id === a.id));
      if (nextArticle) slots.push(nextArticle);
      else break;
    }

    return slots.slice(0, 3);
  }, [articles]);

  if (loading && articles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        Loading Huanguelén...
      </div>
    );
  }

  if (error && articles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <section className="my-4">
      <div className="container mx-auto px-4 py-6">
        {/* Section header */}
        <div className="flex items-center mb-6 pb-2 border-b border-[#292929]/20">
          <h2 className="text-2xl font-bold text-[#292929]">HUANGUELÉN</h2>
          <div className="ml-auto h-1 w-24 bg-primary-red"></div>
        </div>

        {/* Grid with 3 equal articles and divisory lines */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {processedArticles.map((article, idx) => {
            // --- Add blinking preview state ---
            const [imgLoaded, setImgLoaded] = useState(false);

            return (
              <div
                key={article.id}
                className={`bg-white rounded-none overflow-visible group flex flex-col h-full relative
                  ${idx > 0 ? 'md:border-l md:border-gray-200' : ''}
                `}
              >
                <Link
                  href={`/${getSectionPath(article.section)}/${article.slug}`}
                  className="flex flex-col h-full"
                >
                  <div className="relative w-11/12 mx-auto aspect-video overflow-hidden">
                    {/* Blinking preview overlay */}
                    {!imgLoaded && (
                      <div className="absolute inset-0 bg-gray-200 animate-pulse z-10" />
                    )}
                    <Image
                      src={article.imgUrl || ''}
                      alt={article.title}
                      fill
                      className={`object-cover transition-opacity duration-300 group-hover:opacity-90 ${!imgLoaded ? 'opacity-0' : 'opacity-100'}`}
                      onLoad={() => setImgLoaded(true)}
                    />
                    <div className="absolute inset-0 bg-gray-800 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 pointer-events-none"></div>
                  </div>
                  <div className="p-4 pt-3 w-11/12 mx-auto" style={{ paddingLeft: 0 }}>
                    <h3 className="text-lg font-bold mb-2 leading-tight text-[#292929]">
                      {article.overline && (
                        <span className="text-primary-red font-bold">
                          {article.overline}.{' '}
                        </span>
                      )}
                      {article.title}
                    </h3>
                    {article.author && (
                      <p className="text-xs text-dark-gray mb-2">
                        Por {article.author}
                      </p>
                    )}
                    {article.summary && (
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {article.summary}
                      </p>
                    )}
                  </div>
                </Link>
                {/* Vertical divider between articles, except last */}
                {idx < processedArticles.length - 1 && (
                  <div className="hidden md:block absolute top-0 right-0 h-full w-px bg-gray-300 opacity-80 z-20 pointer-events-none"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}