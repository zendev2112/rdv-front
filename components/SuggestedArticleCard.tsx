import Link from 'next/link'
import OptimizedImage from './OptimizedImage'
import { getArticleUrl } from '@/lib/utils'

interface SuggestedArticle {
  id: string
  title: string
  slug: string
  imgUrl?: string
  overline?: string
  created_at?: string
  section?: string
  section_path?: string
}

interface Props {
  article: SuggestedArticle
}

export default function SuggestedArticleCard({ article }: Props) {
  return (
    <div className="my-6 not-prose border-t border-b border-gray-200 py-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
        Seguí leyendo
      </p>
      <Link
        href={getArticleUrl(
          article.section_path || article.section,
          article.slug,
        )}
        className="flex gap-4 group"
      >
        {article.imgUrl && (
          <div
            className="relative flex-shrink-0 overflow-hidden"
            style={{ width: '33%', aspectRatio: '16/10' }}
          >
            <OptimizedImage
              src={article.imgUrl}
              alt={article.title}
              fill
              className="object-cover transition-opacity duration-300 group-hover:opacity-85"
              sizes="33vw"
            />
          </div>
        )}
        <div className="flex flex-col justify-center flex-1 min-w-0">
          {article.overline && (
            <span className="text-primary-red text-xs font-bold uppercase tracking-wide mb-1 block">
              {article.overline}
            </span>
          )}
          <h3 className="font-serif text-xl font-bold leading-snug group-hover:text-primary-red transition-colors duration-200">
            {article.title}
          </h3>
        </div>
      </Link>
    </div>
  )
}
