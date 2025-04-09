// components/EditorialSection.tsx
interface Article {
  title: string
  author: string
}

interface Editorial {
  title: string
  items: string[]
}

interface Props {
  featuredArticles: Article[]
  editorials: Editorial
  additionalArticles: Article[]
  ad: {
    title: string
    description: string
    cta: string
  }
}

export default function EditorialSection({
  featuredArticles,
  editorials,
  additionalArticles,
  ad,
}: Props) {
  return (
    <section className="mt-12 pt-8 border-t border-gray-200">
      {/* Featured Articles */}
      <div className="space-y-4 mb-8">
        {featuredArticles.map((article, index) => (
          <div key={index}>
            <h3 className="font-bold">{article.title}</h3>
            <p className="text-sm text-gray-600">Por {article.author}</p>
          </div>
        ))}
      </div>

      {/* Editorials List */}
      <div className="mb-8">
        <h4 className="font-bold text-lg mb-3">EDITORIALES</h4>
        <ul className="list-disc pl-5 space-y-2">
          {editorials.items.map((item, index) => (
            <li key={index} className="text-sm">
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Additional Articles */}
      <div className="space-y-4 mb-8">
        {additionalArticles.map((article, index) => (
          <div key={index}>
            <h3 className="font-bold">{article.title}</h3>
            <p className="text-sm text-gray-600">Por {article.author}</p>
          </div>
        ))}
      </div>

      {/* Ad (Repeated from previous) */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h5 className="font-bold">{ad.title}</h5>
        <p className="text-gray-600 mt-1">{ad.description}</p>
        <button className="text-blue-600 hover:underline mt-2">
          {ad.cta} →
        </button>
      </div>
    </section>
  )
}
