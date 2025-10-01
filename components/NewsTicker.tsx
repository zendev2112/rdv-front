import Link from 'next/link'

type Headline = {
  id: string
  title: string
  slug: string
  section?: string
  timestamp?: string
}

export default function NewsTicker({ headlines }: { headlines: Headline[] }) {
  if (!headlines?.length) return null

  return (
    <div className="border-b border-light-gray overflow-x-auto bg-white">
      <div className="container mx-auto px-4 py-2 flex items-center text-sm space-x-4 whitespace-nowrap animate-marquee">
        {headlines.map((headline, idx) => (
          <span key={headline.id} className="flex items-center">
            <Link
              href={`/${headline.section || 'noticias'}/${headline.slug}`}
              className="font-bold hover:text-primary-red transition-colors"
            >
              {headline.title}
            </Link>
            {idx < headlines.length - 1 && (
              <span className="mx-2 text-neutral-gray">•</span>
            )}
          </span>
        ))}
      </div>
     
    </div>
  )
}
