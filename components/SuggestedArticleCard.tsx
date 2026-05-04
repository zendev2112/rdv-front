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

function formatDateShort(dateString?: string): string {
  if (!dateString) return ''
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

export default function SuggestedArticleCard({ article }: Props) {
  return (
    <div className="my-8 not-prose">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
        Seguí leyendo
      </p>
      <Link
        href={getArticleUrl(
          article.section_path || article.section,
          article.slug,
        )}
        className="flex gap-4 group border-t border-b border-gray-200 py-4"
      >
        {article.imgUrl && (
          <div className="relative flex-shrink-0 w-28 h-20 overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10" />
            <OptimizedImage
              src={article.imgUrl}
              alt={article.title}
              fill
              className="object-cover transition-opacity duration-300 group-hover:opacity-90"
              sizes="112px"
            />
          </div>
        )}
        <div className="flex flex-col justify-center">
          <h3 className="font-serif text-base font-bold leading-snug">
            {article.overline && (
              <span className="text-primary-red">{article.overline}. </span>
            )}
            {article.title}
          </h3>
          {article.created_at && (
            <p className="text-xs text-gray-500 mt-1">
              {formatDateShort(article.created_at)}
            </p>
          )}
        </div>
      </Link>
    </div>
  )
}
