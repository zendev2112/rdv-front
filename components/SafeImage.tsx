'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function SafeImage({ 
  src, 
  alt, 
  fill = false, 
  className = '', 
  priority = false 
}) {
  const [imgError, setImgError] = useState(false);
  
  // Handle missing source
  if (!src) {
    return (
      <div className={`relative w-full h-full bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400">No image</span>
      </div>
    );
  }
  
  // Decode URL in case it's encoded
  let decodedSrc;
  try {
    decodedSrc = decodeURIComponent(src);
  } catch (e) {
    // If decoding fails, use original
    decodedSrc = src;
  }
  
  // Use proxy for problematic images like Instagram
  const isProblematicImage = decodedSrc.includes('cdninstagram.com') || 
                             decodedSrc.includes('instagram.com') ||
                             decodedSrc.includes('fotos.perfil.com') ||
                             decodedSrc.includes('facebook.com') ||
                             decodedSrc.includes('fbcdn.net') ||
                             decodedSrc.length > 300;
  
  // If there was an error loading the image or it's problematic, use the proxy URL
  const finalSrc = (imgError || isProblematicImage)
    ? `/api/imageproxy?url=${encodeURIComponent(decodedSrc)}`
    : decodedSrc;
  
  // If image already failed through proxy or it's a problematic image type, use regular img tag
  if (imgError || isProblematicImage) {
    return (
      <div className={`relative w-full h-full ${fill ? 'absolute inset-0' : ''}`} style={{overflow: 'hidden'}}>
        <img 
          src={finalSrc}
          alt={alt || "Article image"}
          className={`${fill ? 'absolute inset-0 w-full h-full' : ''} object-cover ${className}`}
          loading={priority ? "eager" : "lazy"}
          onError={() => {
            // If using proxy already failed, show placeholder
            if (imgError || finalSrc.includes('imageproxy')) {
              setImgError(true);
            }
          }}
        />
      </div>
    );
  }
  
  // For normal URLs, use Next.js Image with error handling
  return (
    <div className={`relative ${fill ? 'h-full w-full' : ''}`}>
      <Image
        src={finalSrc}
        alt={alt || "Article image"}
        fill={fill}
        width={fill ? undefined : 1200}
        height={fill ? undefined : 630}
        className={className}
        priority={priority}
        unoptimized={finalSrc.includes('?') || finalSrc.includes('=')}
        onError={() => setImgError(true)}
      />
    </div>
  );
}