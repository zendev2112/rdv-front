'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Clock } from 'lucide-react'

interface HeadlineItem {
  id: string
  title: string
  timestamp?: string
  slug?: string
  section?: string
}

function getSectionPath(section: string | undefined): string {
  if (!section) return 'sin-categoria'
  if (section.includes('.')) return section.split('.').join('/')
  return section
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

// Client-only timestamp component
function ClientTimestamp({ timestamp }: { timestamp?: string }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <span className="text-xs text-dark-gray">Cargando...</span>
  }

  return (
    <div className="flex items-center mt-2">
      <Clock className="h-3 w-3 text-dark-gray mr-1" />
      <p className="text-xs text-dark-gray">{getRelativeTime(timestamp)}</p>
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
    <section className="py-8">
      <div className="container mx-auto px-4">
        {/* Section header with red accent */}
        <div className="flex items-center mb-6 pb-2 border-b border-[#292929]/20">
          <h2 className="text-2xl font-bold text-[#292929]">
            ÚLTIMAS NOTICIAS
          </h2>
          <div className="ml-auto h-1 w-24 bg-primary-red"></div>
        </div>

        {/* Vertical headlines only */}
        <div className="max-w-xl mx-auto">
          <div className="bg-white border border-gray-100 rounded-md overflow-hidden">
            <ul className="space-y-0">
              {headlines.map((headline, index) => (
                <li
                  key={headline.id}
                  className="relative pl-8 pr-4 py-3 border-t border-gray-100 first:border-t-0"
                >
                  {/* Dot and line styling */}
                  <div className="absolute left-4 top-0 bottom-0 flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-primary-red mt-4"></div>
                    {index < headlines.length - 1 && (
                      <div className="w-0.5 bg-gray-200 flex-grow"></div>
                    )}
                  </div>

                  <Link
                    href={
                      headline.slug
                        ? `/${getSectionPath(headline.section)}/${
                            headline.slug
                          }`
                        : '#'
                    }
                    className="text-base font-medium leading-tight text-[#292929] hover:text-primary-red transition-colors block"
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

            <div className="p-4 text-right border-t border-gray-100">
              <Link
                href="/noticias"
                className="text-xs font-medium text-primary-red hover:underline inline-flex items-center"
              >
                Ver todas las noticias
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
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
      </div>
    </section>
  )
}
