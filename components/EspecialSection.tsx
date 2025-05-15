'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  imgUrl?: string;
  image?: any;
  overline?: string;
  source?: string;
  section?: string;
  published_at?: string;
}

interface EspecialSectionProps {
  title?: string;
  subtitle?: string;
  isDisabled?: boolean;
  disabledMessage?: string;
  backgroundImage?: string;
  themeColor?: string;
  articles?: Article[];
}

const EspecialSection: React.FC<EspecialSectionProps> = ({
  title = "ESPECIAL",
  subtitle = "Contenido exclusivo",
  isDisabled = true,
  disabledMessage = "Esta sección estará disponible próximamente",
  backgroundImage = '/placeholder.svg?height=400&width=1200&text=Especial',
  themeColor = "#990000",
  articles = []
}) => {
  // The component is intentionally disabled for future use
  if (isDisabled) {
    return (
      <section className="container mx-auto px-4 py-6 border-t border-gray-200">
        <div className="relative rounded-lg overflow-hidden bg-gray-100 p-6 text-center">
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-white bg-opacity-90 p-6 rounded-lg max-w-md">
              <AlertTriangle className="w-10 h-10 text-yellow-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">{title}</h2>
              <p className="text-gray-700 mb-4">{disabledMessage}</p>
              <div className="inline-block px-4 py-2 bg-gray-200 rounded-md text-gray-700">
                Próximamente
              </div>
            </div>
          </div>
          <div className="h-64 md:h-96 w-full relative opacity-50">
            <Image
              src={backgroundImage}
              alt="Coming Soon"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>
    );
  }

  // This part will be used in the future when the section is enabled
  return (
    <section className="container mx-auto px-4 py-6 border-t border-gray-200">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 
            className="text-2xl font-bold"
            style={{ color: themeColor }}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-600">{subtitle}</p>
          )}
        </div>
        <Link 
          href="/especial" 
          className="text-sm hover:underline flex items-center"
          style={{ color: themeColor }}
        >
          Ver más
          <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none">
            <path 
              d="M9 18L15 12L9 6" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>

      {/* This is just a placeholder for future content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <p className="col-span-3 text-center py-8 text-gray-500">
          Contenido especial no disponible
        </p>
      </div>
    </section>
  );
};

export default EspecialSection;