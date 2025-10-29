'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { extractYouTubeId } from '@/lib/articleEmbeds'

interface EmbedRendererProps {
  embedType: string
  content: string
}

export default function EmbedRenderer({
  embedType,
  content,
}: EmbedRendererProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Reload Instagram embeds
    if (embedType === 'instagram' && (window as any).instgrm) {
      ;(window as any).instgrm.Embeds.process()
    }
    // Reload Twitter embeds
    if (embedType === 'twitter' && (window as any).twttr) {
      ;(window as any).twttr.widgets.load()
    }
  }, [embedType])

  // Don't render blockquotes on server - only render on client
  if (!mounted) {
    return <div className="min-h-64 bg-gray-100 rounded my-8"></div>
  }

  switch (embedType) {
    case 'instagram':
      return (
        <div className="flex justify-center my-8">
          <blockquote
            className="instagram-media"
            data-instgrm-permalink={content}
            data-instgrm-version="14"
          ></blockquote>
        </div>
      )

    case 'facebook':
      return (
        <div className="flex justify-center my-8">
          <iframe
            src={`https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(
              content
            )}&width=500`}
            width="500"
            height="600"
            style={{ border: 'none', overflow: 'hidden' }}
            scrolling="no"
            frameBorder="0"
            allowFullScreen={true}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          ></iframe>
        </div>
      )

    case 'twitter':
      return (
        <div className="flex justify-center my-8">
          <blockquote className="twitter-tweet">
            <a href={content}></a>
          </blockquote>
        </div>
      )

    case 'youtube':
      return (
        <div className="flex justify-center my-8">
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${extractYouTubeId(content)}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      )

    case 'image':
      return (
        <div className="relative h-96 my-8 rounded-lg overflow-hidden">
          <Image
            src={content}
            alt="Article image"
            fill
            className="object-cover"
          />
        </div>
      )

    default:
      return null
  }
}
