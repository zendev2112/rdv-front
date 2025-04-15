"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface StoryArticle {
  title: React.ReactNode
  summary?: string
  author?: string
  imageUrl: string
  hasVideo?: boolean
}

interface StoriesAndCharactersSectionProps {
  mainArticle: StoryArticle
  sideArticles: StoryArticle[]
}

export function StoriesAndCharactersSection({
  mainArticle,
  sideArticles
}: StoriesAndCharactersSectionProps) {
  return (
    <section className="container mx-auto px-4 py-6 border-t border-gray-200">
      <h2 className="text-2xl font-bold mb-6 uppercase">
        HISTORIAS Y PERSONAJES
      </h2>

      {/* Two Column Layout */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* First Column - Main Article (Image on top, text at bottom) */}
        <div className="w-full md:w-1/2">
          <Card className="border-0 shadow-none h-full">
            <CardContent className="p-0 flex flex-col h-full">
              {/* Main Article Image on Top */}
              <div className="relative w-full h-[340px] mb-4">
                <Image
                  src={mainArticle.imageUrl}
                  alt="Main story image"
                  fill
                  className="object-cover rounded-md"
                  priority
                />
                {/* Hover effect with gray overlay */}
                <div className="absolute inset-0 bg-gray-800 bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
                {mainArticle.hasVideo && (
                  <Badge
                    className="absolute top-2 left-2 bg-black text-white border-0 rounded px-2 py-1 text-xs"
                    variant="outline"
                  >
                    VIDEO
                  </Badge>
                )}
              </div>
              
              {/* Main Article Text Below Image */}
              <div className="flex-grow">
                <h3 className="text-3xl font-bold mb-3 leading-tight">
                  <span className="text-primary-red font-bold">Historia.</span>{' '}
                  {mainArticle.title}
                </h3>
                {mainArticle.summary && (
                  <p className="text-base text-dark-gray mb-4">
                    {mainArticle.summary}
                  </p>
                )}
                {mainArticle.author && (
                  <p className="text-sm text-dark-gray">Por {mainArticle.author}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Second Column - Stacked Side Articles (Text left, image right) */}
        <div className="w-full md:w-1/2">
          <div className="space-y-6">
            {sideArticles.map((article, index) => (
              <Card key={index} className="border-0 shadow-none">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Text Content on Left */}
                    <div className="sm:w-3/5">
                      <h3 className="text-lg font-bold mb-2 leading-tight">
                        <span className="text-primary-red font-bold">Personaje.</span>{' '}
                        {article.title}
                      </h3>
                      {article.summary && (
                        <p className="text-sm text-dark-gray mb-2">
                          {article.summary}
                        </p>
                      )}
                      {article.author && (
                        <p className="text-sm text-dark-gray">Por {article.author}</p>
                      )}
                    </div>
                    
                    {/* Image on Right */}
                    <div className="sm:w-2/5">
                      <div className="relative w-full h-[120px]">
                        <Image
                          src={article.imageUrl}
                          alt={`Side story image ${index + 1}`}
                          fill
                          className="object-cover rounded-md"
                        />
                        {/* Hover effect with gray overlay */}
                        <div className="absolute inset-0 bg-gray-800 bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
                        {article.hasVideo && (
                          <Badge
                            className="absolute top-2 left-2 bg-black text-white border-0 rounded px-2 py-1 text-xs"
                            variant="outline"
                          >
                            VIDEO
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}