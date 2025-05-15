'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden p-8 text-center">
      <h2 className="text-xl font-bold text-red-600 mb-4">
        Error al cargar el artículo
      </h2>
      <p className="text-gray-700 mb-6">
        Lo sentimos, ha ocurrido un error al intentar cargar este artículo.
      </p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Intentar nuevamente
        </button>
        <Link
          href="/admin/articles"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Volver a la lista
        </Link>
      </div>
    </div>
  );
}