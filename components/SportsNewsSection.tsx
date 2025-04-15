"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface SportArticle {
  title: React.ReactNode
  content?: string
  author?: string
  imageUrl: string
  hasVideo?: boolean
}

interface SportsNewsSectionProps {
  mainArticle: SportArticle
  sideArticles: SportArticle[]
}

export function SportsNewsSection({ mainArticle, sideArticles }: SportsNewsSectionProps) {
  return (
    <section className="container mx-auto px-4 py-6 border-t border-gray-200">
      <h2 className="text-2xl font-bold mb-6 uppercase">
        ACTUALIDAD DEPORTIVA
      </h2>

      {/* Main Article */}
      <Card className="border-0 shadow-none mb-8">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Text Content - Left */}
            <div className="md:w-1/2">
              <h3 className="text-3xl font-bold mb-3 leading-tight">
                <span className="text-primary-red font-bold">Deportes.</span>{' '}
                {mainArticle.title}
              </h3>
              {mainArticle.content && (
                <p className="text-base text-dark-gray mb-4">
                  {mainArticle.content}
                </p>
              )}
              {mainArticle.author && (
                <p className="text-sm text-dark-gray">Por {mainArticle.author}</p>
              )}
            </div>
            
            {/* Image - Right */}
            <div className="md:w-1/2">
              <div className="relative w-full h-[300px]">
                <Image
                  src={mainArticle.imageUrl || '/placeholder.svg?height=600&width=800'}
                  alt="Imagen principal"
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
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      {/* Side Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sideArticles.map((article, index) => (
          <Card key={index} className="border-0 shadow-none">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Text Content - Left */}
                <div className="md:w-2/3">
                  <h3 className="text-lg font-bold mb-2 leading-tight">
                    <span className="text-primary-red font-bold">Deportes.</span>{' '}
                    {article.title}
                  </h3>
                  {article.content && (
                    <p className="text-sm text-dark-gray mb-2">
                      {article.content}
                    </p>
                  )}
                  {article.author && (
                    <p className="text-sm text-dark-gray">Por {article.author}</p>
                  )}
                </div>
                
                {/* Image - Right */}
                <div className="md:w-1/3">
                  <div className="relative w-full h-[180px]">
                    <Image
                      src={article.imageUrl || '/placeholder.svg?height=400&width=500'}
                      alt="Imagen secundaria"
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
    </section>
  )
}