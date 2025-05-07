'use client'

import ArticleEditor from '../components/ArticleEditor'

export default function EditArticlePage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Editar Artículo</h1>
      <ArticleEditor articleId={params.id} />
    </div>
  )
}