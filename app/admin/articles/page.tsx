import ServerArticlesList from '../components/ServerArticlesList'
import Link from 'next/link'

// Define the proper types for page props
interface PageProps {
  searchParams: {
    section?: string;
    status?: string;
    search?: string;
    [key: string]: string | string[] | undefined;
  };
}

// This is now a Server Component - no 'use client' directive needed
export default function ArticlesPage({ searchParams }: PageProps) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de artículos</h1>
        <Link 
          href="/admin/articles/new" 
          className="px-4 py-2 bg-primary-red text-white rounded hover:bg-red-700"
        >
          Nuevo artículo
        </Link>
      </div>
      
      {/* Server-rendered articles list with search params */}
      <ServerArticlesList showAll={true} searchParams={searchParams} />
    </div>
  )
}