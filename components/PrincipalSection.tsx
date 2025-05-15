'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  imgUrl?: string;
  overline?: string;
  order?: string;
  created_at?: string; 
  section?: string;
}

// Update SafeImage component (lines 15-51)
function SafeImage({ src, alt, fill = false, className = '', priority = false }) {
  // Handle missing source
  if (!src) {
    return (
      <div className={`relative w-full h-full bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400">No image</span>
      </div>
    );
  }
  
  // Try direct image first
  return (
    <div className={`relative w-full h-full ${fill ? 'absolute inset-0' : ''}`} style={{overflow: 'hidden'}}>
      <img 
        src={src}
        alt={alt || "Article image"}
        className={`w-full h-full object-cover ${className}`}
        loading={priority ? "eager" : "lazy"}
        onError={(e) => {
          console.error("Direct image failed to load:", src);
          // Try proxy if direct image fails
          const proxyUrl = `/api/imageproxy?url=${encodeURIComponent(src)}`;
          e.currentTarget.src = proxyUrl;
          
          // Add second error handler for proxy fallback
          e.currentTarget.onerror = () => {
            console.error("Proxy image also failed:", proxyUrl);
            // Use inline SVG placeholder instead of external file
            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Cpath d='M30 40 L50 65 L70 40' stroke='%23cccccc' fill='none' stroke-width='2'/%3E%3Ccircle cx='50' cy='30' r='10' fill='%23cccccc'/%3E%3C/svg%3E";
          };
        }}
      />
    </div>
  );
}

function getSectionPath(section: string | undefined): string {
  if (!section) {
    return 'sin-categoria';
  }
  
  // If section contains dots, convert to slashes for URL
  if (section.includes('.')) {
    return section.split('.').join('/');
  }
  
  return section;
}


export default function PrincipalSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const previousArticlesRef = useRef<Article[]>([]);

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);
        // Use the existing articles API endpoint
        const response = await fetch('/api/articles?front=PrincipalSection&status=published');
        
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        
        // Your API returns the array directly
        const result = await response.json();
        const newArticles = Array.isArray(result) ? result : [];
        
        // Only update articles if there are actual changes
        if (JSON.stringify(newArticles) !== JSON.stringify(articles)) {
          // Store current articles before updating
          previousArticlesRef.current = [...articles];
          setArticles(newArticles);
        }
      } catch (err) {
        console.error('Error fetching principal section articles:', err);
        setError('Failed to load articles');
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
    
    // Add polling to check for new articles every 5 minutes
    const interval = setInterval(fetchArticles, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [articles]);

  // Modify the processedArticles useMemo function to implement the complete ordering logic

  const processedArticles = useMemo(() => {
    // Define priority levels with their respective position values
    const orderPriority = {
      'principal': 0,
      'secundario': 1,
      'normal': 2,
      undefined: 3
    };
    
    // Get new articles (not in previous batch)
    const newArticles = articles.filter(article => 
      !previousArticlesRef.current.some(prevArticle => prevArticle.id === article.id)
    );
    
    // Get existing articles (were in previous batch)
    const existingArticles = articles.filter(article => 
      previousArticlesRef.current.some(prevArticle => prevArticle.id === article.id)
    );
    
    // Group articles by their order property
    const groupedArticles = {
      principal: [],
      secundario: [],
      normal: []
    };
    
    // First process new articles to insert them at the right position
    newArticles.forEach(article => {
      const orderType = article.order || 'normal';
      if (orderType in groupedArticles) {
        groupedArticles[orderType].push(article);
      } else {
        // If the order is something else, treat as normal
        groupedArticles.normal.push(article);
      }
    });
    
    // Then process existing articles
    existingArticles.forEach(article => {
      const orderType = article.order || 'normal';
      if (orderType in groupedArticles) {
        groupedArticles[orderType].push(article);
      } else {
        // If the order is something else, treat as normal
        groupedArticles.normal.push(article);
      }
    });
    
    // Sort articles within each group by creation date (newest first)
    Object.keys(groupedArticles).forEach(orderType => {
      groupedArticles[orderType].sort((a, b) => {
        if (a.created_at && b.created_at) {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return 0;
      });
    });
    
    // Combine all groups in order of priority
    const sortedArticles = [
      ...groupedArticles.principal,
      ...groupedArticles.secundario,
      ...groupedArticles.normal
    ];
    
    return sortedArticles;
  }, [articles]);

  // Get the main article - must have 'principal' order
  const mainArticle = processedArticles.find(article => article.order === 'principal') || processedArticles[0];

  // Get remaining articles, excluding the main article
  const remainingArticles = processedArticles.filter(article => article !== mainArticle);

  // Prioritize 'secundario' articles first for top row
  const secundarioArticles = remainingArticles.filter(article => article.order === 'secundario');
  const otherArticles = remainingArticles.filter(article => article.order !== 'secundario');

  // Top row gets 'secundario' articles first, then others to fill
  const topRowArticles = [
    ...secundarioArticles.slice(0, 2),
    ...otherArticles.slice(0, 2 - secundarioArticles.length)
  ].slice(0, 2);

  // Bottom row gets remaining articles
  const bottomRowArticles = remainingArticles
    .filter(article => !topRowArticles.includes(article))
    .slice(0, 3);

  if (loading && articles.length === 0) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error && articles.length === 0) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  if (!mainArticle) {
    return null; // No articles to display
  }

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Main article (40% width) */}
        <div className="md:w-2/5">
          <Link
            href={`/${mainArticle.section ? getSectionPath(mainArticle.section) : 'sin-categoria'}/${mainArticle.slug}`}
            className="block group"
          >
            <div className="relative h-96 w-full mb-4">
              <SafeImage
                src={mainArticle.imgUrl}
                alt={mainArticle.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="bg-white">
              <h1 className="text-2xl font-bold mb-3 leading-tight">
                {mainArticle.overline && (
                  <span className="text-primary-red">
                    {mainArticle.overline}.{' '}
                  </span>
                )}
                {mainArticle.title}
              </h1>
            </div>
          </Link>
        </div>

        {/* Secondary articles (60% width) */}
        <div className="md:w-3/5 flex flex-col space-y-4">
          {/* Top row - two articles (30% each) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topRowArticles.map((article) => (
              <Link
                key={article.id}
                href={`/${article.section ? getSectionPath(article.section) : 'sin-categoria'}/${article.slug}`}
                className="block group"
              >
                <div className="relative h-52 w-full mb-2">
                  <SafeImage
                    src={article.imgUrl}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-2">
                  <h2 className="text-lg font-bold leading-tight">
                    {article.overline && (
                      <span className="text-primary-red">
                        {article.overline}.{' '}
                      </span>
                    )}
                    {article.title}
                  </h2>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom row - three articles (20% each) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {bottomRowArticles.map((article) => (
              <Link
                key={article.id}
                href={`/${article.section ? getSectionPath(article.section) : 'sin-categoria'}/${article.slug}`}
                className="block group"
              >
                <div className="relative h-40 w-full mb-2">
                  <SafeImage
                    src={article.imgUrl}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-2">
                  <h2 className="text-sm font-bold leading-tight">
                    {article.overline && (
                      <span className="text-primary-red">
                        {article.overline}.{' '}
                      </span>
                    )}
                    {article.title}
                  </h2>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
