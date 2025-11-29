'use client'

import { useEffect, useState, useRef } from 'react'
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
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const embedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Instagram embeds
    if (embedType === 'instagram') {
      // Check if script already exists
      const existingScript = document.querySelector(
        'script[src*="instagram.com/embed.js"]'
      )

      if (existingScript) {
        // Script exists, just process
        if ((window as any).instgrm) {
          setTimeout(() => {
            ;(window as any).instgrm.Embeds.process()
          }, 100)
        }
      } else {
        // Load script for the first time
        const script = document.createElement('script')
        script.async = true
        script.src = '//www.instagram.com/embed.js'

        script.onload = () => {
          setScriptLoaded(true)
          if ((window as any).instgrm) {
            ;(window as any).instgrm.Embeds.process()
          }
        }

        document.body.appendChild(script)
      }
    }

    // Twitter embeds
    if (embedType === 'twitter') {
      const existingScript = document.querySelector(
        'script[src*="platform.twitter.com"]'
      )

      if (existingScript) {
        if ((window as any).twttr) {
          setTimeout(() => {
            ;(window as any).twttr.widgets.load()
          }, 100)
        }
      } else {
        const script = document.createElement('script')
        script.async = true
        script.src = 'https://platform.twitter.com/widgets.js'
        script.charset = 'utf-8'

        script.onload = () => {
          if ((window as any).twttr) {
            ;(window as any).twttr.widgets.load()
          }
        }

        document.body.appendChild(script)
      }
    }
  }, [mounted, embedType, content])

  // Additional effect to retry processing after script loads
  useEffect(() => {
    if (scriptLoaded && embedType === 'instagram') {
      const retryProcess = () => {
        if ((window as any).instgrm && embedRef.current) {
          ;(window as any).instgrm.Embeds.process()
        }
      }

      // Retry a few times with increasing delays
      const timeouts = [
        setTimeout(retryProcess, 500),
        setTimeout(retryProcess, 1000),
        setTimeout(retryProcess, 2000),
      ]

      return () => {
        timeouts.forEach((timeout) => clearTimeout(timeout))
      }
    }
  }, [scriptLoaded, embedType])

  if (!mounted) {
    return (
      <div className="min-h-64 bg-gray-100 rounded my-8 animate-pulse"></div>
    )
  }

  switch (embedType) {
    case 'instagram':
      return (
        <div ref={embedRef} className="flex justify-center my-8">
          <blockquote
            className="instagram-media"
            data-instgrm-permalink={content}
            data-instgrm-version="14"
            style={{
              background: '#FFF',
              border: '0',
              borderRadius: '3px',
              boxShadow:
                '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
              margin: '1px',
              maxWidth: '540px',
              minWidth: '326px',
              padding: '0',
              width: '99%',
            }}
          >
            <a href={content} target="_blank" rel="noopener noreferrer">
              View this post on Instagram
            </a>
          </blockquote>
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
