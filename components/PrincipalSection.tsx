'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// Utility function to handle cascading displacement
function displaceArticles(type, newArticle, currentState) {
  const { main, upper, lower } = currentState;

  // Create new state
  const newState = {
    main: null,
    upper: [...upper],
    lower: [...lower],
  };

  if (type === 'principal') {
    // New Principal arrives
    newState.main = newArticle; // New Principal
    if (main) newState.upper[0] = main; // Former Principal → Upper1
    if (upper[0]) newState.upper[1] = upper[0]; // Former Upper1 → Upper2
    if (upper[1]) newState.lower.unshift(upper[1]); // Former Upper2 → Lower1
  } else if (type === 'secundario') {
    // New Secundario arrives
    newState.main = main; // Keep Principal
    newState.upper[0] = newArticle; // New Secundario → Upper1
    if (upper[0]) newState.upper[1] = upper[0]; // Former Upper1 → Upper2
    if (upper[1]) newState.lower.unshift(upper[1]); // Former Upper2 → Lower1
  } else if (type === 'normal') {
    // New Normal arrives
    newState.main = main; // Keep Principal
    newState.upper[0] = upper[0]; // Keep Upper1
    newState.upper[1] = newArticle; // New Normal → Upper2
    if (upper[1]) newState.lower.unshift(upper[1]); // Former Upper2 → Lower1
  }

  // Ensure lower row has max 3 articles
  newState.lower = newState.lower.slice(0, 3);

  return newState;
}

interface Article {
  id: string
  title: string
  slug: string
  excerpt?: string
  imgUrl?: string
  overline?: string
  order?: string
  created_at?: string
  section?: string
}

function SafeImage({
  src,
  alt,
  fill = false,
  className = '',
  priority = false,
}) {
  if (!src) {
    return (
      <div
        className={`relative w-full h-full bg-gray-200 flex items-center justify-center ${className}`}
      >
        <span className="text-gray-400">No image</span>
      </div>
    )
  }

  return (
    <div
      className={`relative w-full h-full ${fill ? 'absolute inset-0' : ''}`}
      style={{ overflow: 'hidden' }}
    >
      <img
        src={src}
        alt={alt || 'Article image'}
        className={`w-full h-full object-cover ${className}`}
        loading={priority ? 'eager' : 'lazy'}
        onError={(e) => {
          console.error('Direct image failed to load:', src)
          const proxyUrl = `/api/imageproxy?url=${encodeURIComponent(src)}`
          e.currentTarget.src = proxyUrl

          e.currentTarget.onerror = () => {
            console.error('Proxy image also failed:', proxyUrl)
            e.currentTarget.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Cpath d='M30 40 L50 65 L70 40' stroke='%23cccccc' fill='none' stroke-width='2'/%3E%3Ccircle cx='50' cy='30' r='10' fill='%23cccccc'/%3E%3C/svg%3E"
          }
        }}
      />
    </div>
  )
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

export default function PrincipalSection() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const previousArticlesRef = useRef<Article[]>([])
  // We'll use a separate ref to track the lower row positions
  const lowerRowOrderRef = useRef<string[]>([])
  const [layout, setLayout] = useState({
    main: null,
    upper: [null, null],
    lower: [],
  });

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);
        const response = await fetch(
          '/api/articles?front=PrincipalSection&status=published'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }

        const result = await response.json();
        const apiArticles = Array.isArray(result) ? result : [];
        
        // CRITICAL CHANGE: Compare with existing articles before updating
        const existingIds = new Set(articles.map(a => a.id));
        const hasNewArticles = apiArticles.some(a => !existingIds.has(a.id));
        
        if (hasNewArticles || articles.length === 0) {
          // We have new articles, set them
          setArticles(apiArticles);
          
          // CRITICAL: Reset previousArticlesRef when new articles come in
          // This ensures the cascade logic starts from a clean state
          previousArticlesRef.current = [];
        }
        // If no new articles, don't update state at all
      } catch (err) {
        console.error('Error fetching principal section articles:', err);
        setError('Failed to load articles');
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
    const interval = setInterval(fetchArticles, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []); // Keep empty dependency array

  // Replace your entire processedArticles useMemo with this simpler version

const processedArticles = useMemo(() => {
  // For first load, keep your existing initialization code
  if (previousArticlesRef.current.length === 0) {
    // Your existing first load code is fine - keep it
    console.log('🔄 INITIAL LAYOUT - First Load');
    // First create a map of articles by their explicit orders
    const articlesByOrder = {
      principal: articles.filter(a => a.order === 'principal'),
      secundario: articles.filter(a => a.order === 'secundario'), 
      normal: articles.filter(a => a.order === 'normal'),
      other: articles.filter(a => !a.order || (a.order !== 'principal' && a.order !== 'secundario' && a.order !== 'normal'))
    };
    
    // Sort each category by creation date
    Object.keys(articlesByOrder).forEach(key => {
      articlesByOrder[key].sort((a, b) => {
        if (a.created_at && b.created_at) {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return 0;
      });
    });
    
    // Create array in exact layout order [MAIN, Upper1, Upper2, Lower1, Lower2, Lower3]
    const initialLayout = [];
    
    // Add articles in the correct order with their correct positions
    // Add principal article
    if (articlesByOrder.principal.length > 0) {
      initialLayout.push({ ...articlesByOrder.principal[0] });
    } else if (articlesByOrder.other.length > 0) {
      // No principal article, use the newest unassigned article
      initialLayout.push({ ...articlesByOrder.other.shift(), order: 'principal' });
    }
    
    // Add secundario article
    if (articlesByOrder.secundario.length > 0) {
      initialLayout.push({ ...articlesByOrder.secundario[0] });
    } else if (articlesByOrder.other.length > 0) {
      // No secundario article, use the newest unassigned article
      initialLayout.push({ ...articlesByOrder.other.shift(), order: 'secundario' });
    }
    
    // Add normal article
    if (articlesByOrder.normal.length > 0) {
      initialLayout.push({ ...articlesByOrder.normal[0] });
    } else if (articlesByOrder.other.length > 0) {
      // No normal article, use the newest unassigned article
      initialLayout.push({ ...articlesByOrder.other.shift(), order: 'normal' });
    }
    
    // Add remaining articles to lower row (up to 3)
    // First add any remaining explicitly ordered articles
    const remainingArticles = [
      ...articlesByOrder.principal.slice(1),
      ...articlesByOrder.secundario.slice(1),
      ...articlesByOrder.normal.slice(1),
      ...articlesByOrder.other
    ];
    
    // Sort by date again
    remainingArticles.sort((a, b) => {
      if (a.created_at && b.created_at) {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return 0;
    });
    
    // Add up to 3 articles to the lower row
    for (let i = 0; i < Math.min(remainingArticles.length, 3); i++) {
      const lowerArticle = { ...remainingArticles[i] };
      delete lowerArticle.order; // Remove order to put in lower row
      initialLayout.push(lowerArticle);
    }
    
    // Initialize lowerRowOrderRef with lower row article IDs
    const lowerRowArticles = initialLayout.slice(3);
    lowerRowOrderRef.current = lowerRowArticles.map(article => article.id);
    
    return initialLayout;
  }
  
  // Find new articles
  const newArticles = articles.filter(article => 
    !previousArticlesRef.current.some(prevArticle => prevArticle.id === article.id)
  );
  
  // If no new articles, return previous layout
  if (newArticles.length === 0) {
    return previousArticlesRef.current;
  }
  
  console.log('🆕 NEW ARTICLES DETECTED:', newArticles.length, newArticles.map(a => a.title));
  
  // Get existing articles by position
  const existingPrincipal = previousArticlesRef.current.find(a => a.order === 'principal');
  const existingSecundario = previousArticlesRef.current.find(a => a.order === 'secundario');
  const existingNormal = previousArticlesRef.current.find(a => a.order === 'normal');
  const existingLower = previousArticlesRef.current.filter(a => !a.order || a.order === '');
  
  // Get the highest priority new article
  const newArticle = newArticles[0]; // Just use the first new article for simplicity
  const newArticleType = newArticle.order || 'principal'; // Default to principal
  
  console.log(`🔄 Processing article: ${newArticleType} - ${newArticle.title}`);
  
  // Start with an empty new layout
  const newLayout = [];
  
  // Apply displacement rules based on article type
  if (newArticleType === 'principal' || !newArticleType) {
    console.log('📊 NEW PRINCIPAL ARTICLE');
    
    // 1. New article becomes principal
    newLayout.push({...newArticle, order: 'principal'});
    
    // 2. Former principal becomes secundario (Upper1)
    if (existingPrincipal) {
      newLayout.push({...existingPrincipal, order: 'secundario'});
    }
    
    // 3. Former secundario becomes normal (Upper2)
    if (existingSecundario) {
      newLayout.push({...existingSecundario, order: 'normal'});
    }
    
    // 4. Former normal goes to lower row (removing order)
    if (existingNormal) {
      const normalToLower = {...existingNormal};
      delete normalToLower.order;
      newLayout.push(normalToLower);
    }
    
    // 5. Add remaining lower row articles (except the new one)
    const remainingLower = existingLower.filter(a => a.id !== newArticle.id);
    
    // Only add enough to fill lower row (up to 3 total including former normal)
    const lowerCount = existingNormal ? 1 : 0;
    for (let i = 0; i < Math.min(remainingLower.length, 3 - lowerCount); i++) {
      const article = {...remainingLower[i]};
      delete article.order;
      newLayout.push(article);
    }
  } 
  else if (newArticleType === 'secundario') {
    console.log('📊 NEW SECUNDARIO ARTICLE');
    
    // 1. Keep principal
    if (existingPrincipal) {
      newLayout.push(existingPrincipal);
    }
    
    // 2. New article becomes secundario (Upper1)
    newLayout.push({...newArticle, order: 'secundario'});
    
    // 3. Former secundario becomes normal (Upper2)
    if (existingSecundario) {
      newLayout.push({...existingSecundario, order: 'normal'});
    }
    
    // 4. Former normal goes to lower row (removing order)
    if (existingNormal) {
      const normalToLower = {...existingNormal};
      delete normalToLower.order;
      newLayout.push(normalToLower);
    }
    
    // 5. Add remaining lower row articles (except the new one)
    const remainingLower = existingLower.filter(a => a.id !== newArticle.id);
    
    // Only add enough to fill lower row (up to 3 total including former normal)
    const lowerCount = existingNormal ? 1 : 0;
    for (let i = 0; i < Math.min(remainingLower.length, 3 - lowerCount); i++) {
      const article = {...remainingLower[i]};
      delete article.order;
      newLayout.push(article);
    }
  }
  else if (newArticleType === 'normal') {
    console.log('📊 NEW NORMAL ARTICLE');
    
    // 1. Keep principal
    if (existingPrincipal) {
      newLayout.push(existingPrincipal);
    }
    
    // 2. Keep secundario (Upper1)
    if (existingSecundario) {
      newLayout.push(existingSecundario);
    }
    
    // 3. New article becomes normal (Upper2)
    newLayout.push({...newArticle, order: 'normal'});
    
    // 4. Former normal goes to lower row (removing order)
    if (existingNormal) {
      const normalToLower = {...existingNormal};
      delete normalToLower.order;
      newLayout.push(normalToLower);
    }
    
    // 5. Add remaining lower row articles (except the new one)
    const remainingLower = existingLower.filter(a => a.id !== newArticle.id);
    
    // Only add enough to fill lower row (up to 3 total including former normal)
    const lowerCount = existingNormal ? 1 : 0;
    for (let i = 0; i < Math.min(remainingLower.length, 3 - lowerCount); i++) {
      const article = {...remainingLower[i]};
      delete article.order;
      newLayout.push(article);
    }
  }
  
  // Update lower row order tracking
  const lowerRowArticles = newLayout.filter(a => !a.order);
  lowerRowOrderRef.current = lowerRowArticles.map(a => a.id);
  
  // Save for next time
  previousArticlesRef.current = newLayout;
  
  return newLayout;
}, [articles]);

// Add this after the useEffect and before your return statements

// Get main article (Principal)
const mainArticle = processedArticles.find(article => article.order === 'principal');

// IMPORTANT: Very precisely select upper row articles
const secundarioArticle = processedArticles.find(article => article.order === 'secundario');
const normalArticle = processedArticles.find(article => article.order === 'normal');

// Create array with exactly these two articles in correct order
const upperRowArticles = [];
if (secundarioArticle) upperRowArticles.push(secundarioArticle);
if (normalArticle) upperRowArticles.push(normalArticle);

// Get lower row articles using a simpler, more reliable approach
const lowerRowArticles = processedArticles.filter(article => {
  // An article is in the lower row if:
  // 1. It has no order property at all (order property has been deleted)
  // 2. AND its ID is in the lowerRowOrderRef.current array
  return !Object.prototype.hasOwnProperty.call(article, 'order') && 
    lowerRowOrderRef.current.includes(article.id);
});

// Sort them according to lowerRowOrderRef order
lowerRowArticles.sort((a, b) => {
  const indexA = lowerRowOrderRef.current.indexOf(a.id);
  const indexB = lowerRowOrderRef.current.indexOf(b.id);
  return indexA - indexB;
});

// Fallback only if absolutely necessary
if (lowerRowArticles.length === 0) {
  const fallbackLowerRow = processedArticles
    .filter(article => !Object.prototype.hasOwnProperty.call(article, 'order'))
    .slice(0, 3);
  
  // Make sure these have no order property
  fallbackLowerRow.forEach(article => {
    delete article.order;
  });
  
  lowerRowArticles.push(...fallbackLowerRow);
}

// MOVE DEBUG USEEFFECT HERE - before any conditional returns
// Debug logs for article movement (can be removed in production)
useEffect(() => {
  if (process.env.NODE_ENV === 'development') {
    console.log('PrincipalSection - Current Layout:');
    console.log('Main Article:', mainArticle?.title);
    console.log('Upper Row:', upperRowArticles.map(a => ({id: a.id, title: a.title, order: a.order})));
    console.log('Lower Row:', lowerRowArticles.map(a => ({id: a.id, title: a.title})));
    console.log('Lower Row Order:', lowerRowOrderRef.current);
  }
}, [mainArticle, upperRowArticles, lowerRowArticles]);

// Check if we have a main article before rendering
if (loading && (!mainArticle || articles.length === 0)) {
  return <div className="container mx-auto p-4">Loading...</div>
}

if (error && (!mainArticle || articles.length === 0)) {
  return <div className="container mx-auto p-4 text-red-500">{error}</div>
}

if (!mainArticle) {
  return <div className="container mx-auto p-4">No principal article available</div>;
}

  if (loading && articles.length === 0) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  if (error && articles.length === 0) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>
  }

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-4 md:h-[650px]">
        {/* Main article (40% width) */}
        <div className="md:w-2/5 h-full relative group">
          <Link
            href={`/${
              mainArticle.section
                ? getSectionPath(mainArticle.section)
                : 'sin-categoria'
            }/${mainArticle.slug}`}
            className="block h-full flex flex-col"
          >
            <div className="relative w-full p-4 pb-1" style={{ height: '70%' }}>
              <div className="relative w-full h-full overflow-hidden rounded">
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10 rounded"></div>
                <SafeImage
                  src={mainArticle.imgUrl}
                  alt={mainArticle.title}
                  fill
                  className="object-cover rounded transition-opacity duration-300 group-hover:opacity-90"
                  priority
                />
              </div>
            </div>
            <div
              className="bg-white flex-shrink-0 p-4 pt-2 transition-opacity duration-300 group-hover:opacity-90"
              style={{ height: '30%' }}
            >
              <h1 className="text-2xl font-bold mb-1 leading-tight">
                {mainArticle.overline && (
                  <span className="text-primary-red">
                    {mainArticle.overline}.{' '}
                  </span>
                )}
                {mainArticle.title}
              </h1>
            </div>
          </Link>
          {/* Vertical divider line after main article */}
          <div className="absolute top-0 -right-2 w-px h-full bg-gray-100 opacity-50"></div>
        </div>

        {/* Secondary articles (60% width) */}
        <div className="md:w-3/5 h-full flex flex-col relative overflow-visible">
          {/* Top row - two articles */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative"
            style={{ height: '45%' }}
          >
            {upperRowArticles.map((article, index) => (
              <div key={article.id} className="relative h-full group">
                <Link
                  href={`/${
                    article.section
                      ? getSectionPath(article.section)
                      : 'sin-categoria'
                  }/${article.slug}`}
                  className="block h-full flex flex-col"
                >
                  <div
                    className="relative w-full p-4 pb-1"
                    style={{ height: '65%' }}
                  >
                    <div className="relative w-full h-full overflow-hidden rounded">
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10 rounded"></div>
                      <SafeImage
                        src={article.imgUrl}
                        alt={article.title}
                        fill
                        className="object-cover rounded transition-opacity duration-300 group-hover:opacity-90"
                      />
                    </div>
                  </div>
                  <div className="p-4 pt-2 flex-1 flex flex-col justify-start transition-opacity duration-300 group-hover:opacity-90">
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
                {/* Vertical divider between top row articles */}
                {index === 0 && upperRowArticles.length > 1 && (
                  <div className="absolute top-0 -right-2 w-px h-full bg-gray-100 opacity-50"></div>
                )}
              </div>
            ))}
          </div>

          {/* Horizontal divider between top and bottom rows */}
          <div className="w-full h-px bg-gray-100 opacity-50 my-2 flex-shrink-0"></div>

          {/* Bottom row - three articles */}
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative"
            style={{ height: '48%' }}
          >
            {lowerRowArticles.map((article, index) => (
              <div key={article.id} className="relative h-full group">
                <Link
                  href={`/${
                    article.section
                      ? getSectionPath(article.section)
                      : 'sin-categoria'
                  }/${article.slug}`}
                  className="block h-full flex flex-col"
                >
                  <div className="relative w-full p-4 pb-1">
                    <div className="relative w-full h-48 sm:h-32 overflow-hidden rounded">
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10 rounded"></div>
                      <SafeImage
                        src={article.imgUrl}
                        alt={article.title}
                        fill
                        className="object-cover rounded transition-opacity duration-300 group-hover:opacity-90"
                      />
                    </div>
                  </div>
                  <div className="p-4 pt-2 flex-1 flex flex-col justify-start transition-opacity duration-300 group-hover:opacity-90">
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
                {/* Vertical dividers between bottom row articles */}
                {index < lowerRowArticles.length - 1 && (
                  <div className="absolute top-0 -right-2 w-px h-full bg-gray-100 opacity-50"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )

}
