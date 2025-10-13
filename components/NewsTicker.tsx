'use client'

import Link from 'next/link'

type Headline = {
  id: string
  title: string
  slug: string
  section?: string
}

export default function NewsTicker({ headlines }: { headlines: Headline[] }) {
  if (!headlines?.length) return null

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-2">
        <div className="flex flex-wrap text-sm font-bold">
          {headlines.map((headline) => (
            <Link
              key={headline.id}
              href={`/${headline.section || 'noticias'}/${headline.slug}`}
              className="hover:text-primary-red transition-colors mx-4"
            >
              {headline.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
