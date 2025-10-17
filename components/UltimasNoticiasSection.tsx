'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import { getArticleUrl } from '@/lib/utils'

interface HeadlineItem {
  id: string
  title: string
  timestamp?: string
  slug?: string
  section?: string
  section_path?: string
}

function getRelativeTime(dateString?: string) {
  if (!dateString) return ''
  const then = new Date(dateString)
  const now = new Date()
  if (isNaN(then.getTime())) return ''
  const diffMs = now.getTime() - then.getTime()
  if (diffMs < 0) return ''
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'Hace menos de 1 minuto'
  if (diffMins < 60)
    return `Hace ${diffMins} minuto${diffMins === 1 ? '' : 's'}`
  const diffHours = Math.floor(diffMins / 60)
  return `Hace ${diffHours} hora${diffHours === 1 ? '' : 's'}`
}

function ClientTimestamp({ timestamp }: { timestamp?: string }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <span className="text-xs text-gray-600">Cargando...</span>
  }

  return (
    <div className="flex items-center mt-2">
      <Clock className="h-3 w-3 text-gray-600 mr-1" />
      <p className="text-xs text-gray-600">{getRelativeTime(timestamp)}</p>
    </div>
  )
}

interface UltimasNoticiasSectionProps {
  headlines: HeadlineItem[]
}

export default function UltimasNoticiasSection({
  headlines,
}: UltimasNoticiasSectionProps) {
  return (
    <div className="md:col-span-3">
      {/* Header with Title */}
      <div className="flex justify-start mb-6">
        <div className="text-left">
          <div className="w-16 h-1 bg-primary-red mb-2"></div>
          <h2 className="text-2xl font-bold uppercase">ÚLTIMAS NOTICIAS</h2>
        </div>
      </div>

      {/* Headlines list */}
      <div className="bg-white border border-gray-200">
        <ul className="space-y-0">
          {headlines.map((headline, index) => (
            <li
              key={headline.id}
              className="relative pl-8 pr-4 py-4 border-b border-gray-200 last:border-b-0"
            >
              {/* Dot and line styling */}
              <div className="absolute left-4 top-0 bottom-0 flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-primary-red mt-5"></div>
                {index < headlines.length - 1 && (
                  <div className="w-0.5 bg-gray-300 flex-grow"></div>
                )}
              </div>

              <Link
                href={
                  headline.slug
                    ? getArticleUrl(
                        headline.section_path || headline.section,
                        headline.slug
                      )
                    : '#'
                }
                className="text-sm md:text-sm font-bold leading-6 sm:leading-tight text-gray-900 hover:text-primary-red transition-colors block"
              >
                {headline.title}
              </Link>

              {/* Client-only timestamp */}
              {headline.timestamp && (
                <ClientTimestamp timestamp={headline.timestamp} />
              )}
            </li>
          ))}
        </ul>

        <div className="p-4 text-right border-t border-gray-200">
          <Link
            href="/noticias"
            className="text-sm font-semibold text-primary-red hover:underline inline-flex items-center"
          >
            Ver todas las noticias
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-1"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
