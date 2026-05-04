import Link from 'next/link'
import OptimizedImage from './OptimizedImage'
import { getArticleUrl } from '@/lib/utils'

interface SuggestedArticle {
  id: string
  title: string
  slug: string
  imgUrl?: string
  created_at?: string
  section?: string
  section_path?: string
}

interface Props {
  article: SuggestedArticle
}

export default function SuggestedArticleCard({ article }: Props) {
  return (
    <div className="not-prose my-8 w-full bg-gray-50 border border-gray-200 rounded-sm overflow-hidden">
      <Link
        href={getArticleUrl(
          article.section_path || article.section,
          article.slug,
        )}
        className="flex w-full group no-underline"
        style={{ textDecoration: 'none' }}
      >
        {article.imgUrl && (
          <div
            className="relative flex-shrink-0 overflow-hidden"
            style={{ width: '32%', aspectRatio: '16/9' }}
          >
            <OptimizedImage
              src={article.imgUrl}
              alt={article.title}
              fill
              className="object-cover transition-opacity duration-300 group-hover:opacity-60"
              sizes="32vw"
            />
          </div>
        )}
        <div className="flex flex-col justify-center flex-1 min-w-0 px-4 py-3 gap-1">
          <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
            Seguí leyendo
          </span>
          <div
            className="font-serif font-bold leading-snug text-gray-900 group-hover:text-primary-red transition-colors duration-200"
            style={{ fontSize: '11px', textDecoration: 'none' }}
          >
            {article.title}
          </div>
        </div>
      </Link>
    </div>
  )
}
