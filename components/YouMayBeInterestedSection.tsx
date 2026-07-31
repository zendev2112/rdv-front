import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface YouMayBeInterestedSectionProps {
  // Server-computed list + heading. The selection strategy lives in the article
  // page (recency anchored to relevance); this component only renders. When the
  // list is a genuine-related set the heading is "Te puede interesar"; when it is
  // the low-volume fallback it is "Últimas noticias" — honest, never disguised.
  articles: any[]
  heading?: string
}

export default function YouMayBeInterestedSection({
  articles,
  heading = 'Te puede interesar',
}: YouMayBeInterestedSectionProps) {
  if (!articles || articles.length === 0) return null

  return (
    <section className="py-12 border-t border-gray-200 mt-16">
      <div className="mb-6">
        <h2 className="font-serif text-xl font-bold mb-4 text-gray-900 text-left px-0 md:px-0">
          {heading}
        </h2>
        <div className="border-t border-gray-300 my-4 px-4 md:px-0"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-0 md:gap-8 px-0 md:px-0">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/${article.section_path.replace(/\./g, '/')}/${article.slug}`}
            className="group mb-8 md:mb-0"
          >
            {article.imgUrl && (
              <div className="relative w-screen md:w-full aspect-[3/2] overflow-hidden bg-gray-100 md:rounded-lg mb-3 md:mb-3 -mx-4 md:mx-0">
                <Image
                  src={article.imgUrl}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 33vw"
                  className="object-cover group-hover:opacity-75 transition-opacity duration-300"
                />
              </div>
            )}

            <h3 className="font-serif text-base font-bold text-gray-900 px-0 md:px-0 text-left">
              {article.overline && (
                <span className="text-base font-semibold text-primary-red">
                  {article.overline}.{' '}
                </span>
              )}
              {article.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  )
}
