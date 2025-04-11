'use client'

import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

interface NewsArticle {
  id: string
  title: {
    highlight?: string
    regular: string
  }
  author?: string
  imageUrl: string
  hasVideo?: boolean
}

interface NewsSectionGridProps {
  
  sectionColor?:
    | 'politics'
    | 'business'
    | 'opinion'
    | 'sports'
    | 'lifestyle'
    | 'tech'
    | 'agro'
    | 'default'
  articles: NewsArticle[]
}

export default function NewsSectionGrid({
  
  sectionColor = 'default',
  articles,
}: NewsSectionGridProps) {
  // Color system mapping for section headers and accents
  const colorMap = {
    politics: { bg: '#0a3d62', text: '#ffffff' },
    business: { bg: '#2c6e49', text: '#ffffff' },
    opinion: { bg: '#5e3b73', text: '#ffffff' },
    sports: { bg: '#e67e22', text: '#ffffff' },
    lifestyle: { bg: '#2a9d8f', text: '#ffffff' },
    tech: { bg: '#3498db', text: '#ffffff' },
    agro: { bg: '#558b2f', text: '#ffffff' },
    default: { bg: '#ff0808', text: '#ffffff' },
  }

  // Get section color from the map
  const sectionStyle = colorMap[sectionColor]

  return (
    <section className="py-6 border-t border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        {/* Section header with color from the palette */}
        <div
          className="mb-6 pb-2 border-b-2 flex"
          style={{ borderColor: sectionStyle.bg }}
        >

        </div>

        {/* Article grid with alternating cream backgrounds */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {articles.map((article, index) => (
            <Card
              key={article.id}
              className={`overflow-hidden border-0 flex flex-col ${
                index < 3 ? 'border-r border-gray-200' : ''
              } ${index % 2 === 1 ? 'bg-[#faf6ef]' : 'bg-white'}`}
            >
              <div className="relative aspect-video w-full">
                {article.hasVideo && (
                  <Badge
                    variant="default"
                    className="absolute top-2 left-2 bg-black text-white z-10"
                  >
                    VIDEO
                  </Badge>
                )}
                <Image
                  src={article.imageUrl}
                  alt={article.title.regular}
                  fill
                  className="object-cover"
                  priority={index < 2}
                />
              </div>
              <CardContent className="px-4 pt-4 pb-0 flex-grow flex flex-col">
                <h3 className="text-lg font-bold mb-1 leading-tight">
                  {article.title.highlight && (
                    <span className="font-bold text-primary-red">
                      {article.title.highlight}.{' '}
                    </span>
                  )}
                  {article.title.regular}
                </h3>
              </CardContent>
              {article.author && (
                <CardFooter className="px-4 pt-2 pb-4">
                  <p className="text-sm text-dark-gray">Por {article.author}</p>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>

        {/* Red accent line at the bottom */}
        <div className="h-1 bg-primary-red w-1/4 mt-8 mx-auto"></div>
      </div>
    </section>
  )
}
