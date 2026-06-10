'use client'

import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src?: string
  alt: string
  fill?: boolean
  className?: string
  priority?: boolean
  width?: number
  height?: number
  sizes?: string
}

export default function OptimizedImage({
  src,
  alt,
  fill = false,
  className = '',
  priority = false,
  width,
  height,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
}: OptimizedImageProps) {
  const [error, setError] = useState(false)

  // Fallback placeholder when no src or on load error
  if (error || !src) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className} ${
          fill ? 'absolute inset-0' : ''
        }`}
        style={!fill && width && height ? { width, height } : {}}
      >
        <span className="text-gray-400 text-sm">
          {error ? 'Error loading image' : 'No image'}
        </span>
      </div>
    )
  }

  // The image is rendered visible from the SSR HTML — no JS-gated opacity fade.
  // next/image's native blur placeholder covers the load gap, so the real
  // pixels paint as soon as they download instead of waiting for hydration.
  // This is what keeps the LCP image from being stuck invisible (opacity-0)
  // until the client bundle loads.
  return (
    <div className={fill ? 'relative w-full h-full' : ''}>
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={className}
        priority={priority}
        sizes={sizes}
        quality={85} // Good balance between quality and file size
        onError={() => {
          console.error('Next.js Image failed to load:', src)
          setError(true)
        }}
        // Native blur placeholder for a smooth load (no client-JS gate)
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      />
    </div>
  )
}
