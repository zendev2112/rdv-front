"use client"

import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import OptimizedImage from './OptimizedImage'
import { getArticleUrl } from '@/lib/utils'

interface Article {
  title: string
  excerpt: string
  imgUrl: string
  slug: string
  section_path: string
}

interface RecetasSectionProps {
  serverData?: Article[]
}

export default function RecetasSection({ serverData }: RecetasSectionProps) {
  if (!serverData || serverData.length === 0) return null

  const mainArticle = serverData[0]

  return (
    <>
      {/* ✅ MOBILE VERSION */}
      <section className="md:hidden container mx-auto px-4 py-8 border-t border-gray-300">
        {/* Logo and Description */}
        <div className="mb-6">
          <div className="relative w-full h-24 mb-4">
            <Image
              src="/images/logo-recetario.svg"
              alt="Recetario"
              fill
              className="object-contain object-left"
              priority
              unoptimized
            />
          </div>
          <div className="flex items-center gap-1 text-gray-700 text-base font-medium">
            <span>recetas, menús y tips para cocinar</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>

        {/* Main Article */}
        <Link
          href={getArticleUrl(mainArticle.section_path, mainArticle.slug)}
          className="block group"
        >
          {/* Image */}
          <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg mb-4">
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
            <OptimizedImage
              src={mainArticle.imgUrl}
              alt={mainArticle.title}
              fill
              className="object-cover transition-opacity duration-300 group-hover:opacity-90"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Title */}
          <h2 className="font-serif text-xl font-semibold leading-tight mb-3">
            {mainArticle.title}
          </h2>

          {/* Excerpt */}
          <p className="font-serif text-base text-gray-600 leading-relaxed">
            {mainArticle.excerpt}
          </p>
        </Link>
      </section>

      {/* ✅ DESKTOP VERSION */}
      <section className="hidden md:block container mx-auto px-8 py-8 border-t border-gray-300">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column - Logo and Description */}
          <div className="col-span-3">
            <div className="relative w-full h-32 mb-4">
              <Image
                src="/images/logo-recetario.svg"
                alt="Recetario"
                fill
                className="object-contain object-left"
                priority
                unoptimized
              />
            </div>
            <div className="text-gray-700 space-y-1 text-lg font-medium">
              <p>recetas,</p>
              <p>menús y tips</p>
              <div className="flex items-center">
                <p>para cocinar</p>
                <ChevronRight className="h-5 w-5 ml-1" />
              </div>
            </div>
          </div>

          {/* Right Column - Main Article */}
          <div className="col-span-9">
            <Link
              href={getArticleUrl(mainArticle.section_path, mainArticle.slug)}
              className="grid grid-cols-12 gap-6 group"
            >
              {/* Article Content */}
              <div className="col-span-7">
                <h2 className="font-serif text-2xl font-semibold leading-tight mb-3">
                  {mainArticle.title}
                </h2>
                <p className="font-serif text-base text-gray-600 leading-relaxed">
                  {mainArticle.excerpt}
                </p>
              </div>

              {/* Article Image */}
              <div className="col-span-5">
                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg">
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
                  <OptimizedImage
                    src={mainArticle.imgUrl}
                    alt={mainArticle.title}
                    fill
                    className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}