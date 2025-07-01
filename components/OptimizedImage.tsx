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
  const [loading, setLoading] = useState(true)

  // Fallback placeholder when no src or error
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

  // Loading placeholder
  const LoadingPlaceholder = () => (
    <div
      className={`bg-gray-100 animate-pulse flex items-center justify-center ${className} ${
        fill ? 'absolute inset-0' : ''
      }`}
      style={!fill && width && height ? { width, height } : {}}
    >
      <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
    </div>
  )

  return (
    <div className={fill ? 'relative w-full h-full' : ''}>
      {loading && <LoadingPlaceholder />}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        priority={priority}
        sizes={sizes}
        quality={85} // Good balance between quality and file size
        onLoad={() => setLoading(false)}
        onError={() => {
          console.error('Next.js Image failed to load:', src)
          setError(true)
          setLoading(false)
        }}
        // Enable placeholder blur for better UX
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      />
    </div>
  )
}