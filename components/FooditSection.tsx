"use client"

import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

interface FooditSectionProps {
  logoSrc?: string
  categories?: {
    name: string
    href: string
  }[]
  mainArticle?: {
    titleBold: string
    titleRegular: string
    content: string
    imageUrl: string
    imageAlt: string
  }
}

export default function FooditSection({
  logoSrc = "/images/logo-recetario.svg",
  categories = [
    { name: "MENU", href: "#" },
    { name: "TIPS Y SECRETOS DE COCINA", href: "#" },
    { name: "RECETAS FACILES", href: "#" },
  ],
  mainArticle = {
    titleBold: "Dulce y crocante.",
    titleRegular:
      "Una tarta invertida con pistachos para decirle adiós a la clásica de jamón y queso",
    content:
      "La dulzura de las cebollas combina de maravilla con el perfume de las hierbas y el toque del fruto seco que está de moda; una receta para un almuerzo diferente y lleno de sabor",
    imageUrl: "/placeholder.svg?height=300&width=400",
    imageAlt: "Tarta invertida con pistachos",
  },
}: FooditSectionProps) {
  return (
    <section className="container mx-auto px-4 py-6 border-t border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Foodit Logo and Description */}
        <div className="md:col-span-1">
          <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              <div className="mb-4">
                {/* Increased logo size */}
                <div className="relative w-full h-32">
                  <Image
                    src="/images/logo-recetario.svg"
                    alt="Foodit"
                    fill
                    className="object-contain object-left"
                    priority
                    unoptimized
                  />
                </div>
                {/* Increased text size and adjusted alignment */}
                <div className="text-dark-gray space-y-1 mt-4 text-lg">
                  <p className="font-medium">recetas,</p>
                  <p className="font-medium">menús y tips</p>
                  <div className="flex items-center">
                    <p className="font-medium">para cocinar</p>
                    <ChevronRight className="h-5 w-5 ml-1" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recipe Article - stretched to fit categories on one row */}
        <div className="md:col-span-2">
          <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-3/5">
                  <div className="flex flex-wrap gap-6 mb-6 text-sm">
                    {categories.map((category, index) => (
                      <Link 
                        key={index} 
                        href={category.href} 
                        className={cn(
                          buttonVariants({ variant: "link" }),
                          "text-dark-gray hover:text-blue-800 p-0 h-auto whitespace-nowrap"
                        )}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 leading-tight">
                    <span className="text-primary-red font-bold">{mainArticle.titleBold}</span> {mainArticle.titleRegular}
                  </h3>
                  <p className="text-dark-gray">
                    {mainArticle.content}
                  </p>
                </div>
                <div className="md:w-2/5">
                  <AspectRatio ratio={4/3} className="overflow-hidden rounded-md">
                    <Image
                      src={mainArticle.imageUrl}
                      alt={mainArticle.imageAlt}
                      fill
                      className="object-cover"
                    />
                    {/* Hover effect with gray overlay */}
                    <div className="absolute inset-0 bg-gray-800 bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
                  </AspectRatio>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}