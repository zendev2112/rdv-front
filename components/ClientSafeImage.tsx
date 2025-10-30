'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ClientSafeImage({ 
  src, 
  alt, 
  fill = false, 
  className = '', 
  priority = false,
  orientation = 'landscape' // ✅ ADD: orientation prop
}) {
  const [imgError, setImgError] = useState(false);
  const [imageDimensions, setImageDimensions] = useState(null);
  
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
    decodedSrc = src;
  }
  
  // Use proxy for problematic images
  const isProblematicImage = decodedSrc.includes('cdninstagram.com') || 
                             decodedSrc.includes('instagram.com') ||
                             decodedSrc.includes('fotos.perfil.com') ||
                             decodedSrc.includes('facebook.com') ||
                             decodedSrc.includes('fbcdn.net') ||
                             decodedSrc.length > 300;
  
  const finalSrc = (imgError || isProblematicImage)
    ? `/api/imageproxy?url=${encodeURIComponent(decodedSrc)}`
    : decodedSrc;
  
  // ✅ PORTRAIT IMAGE: Don't use fill, let it be auto width
  if (orientation === 'portrait' && !fill) {
    return (
      <div className="relative w-full flex justify-center mb-8">
        {imgError || isProblematicImage ? (
          <img 
            src={finalSrc}
            alt={alt || "Article image"}
            className="h-[70vh] md:h-[80vh] w-auto object-cover rounded-lg"
            loading={priority ? "eager" : "lazy"}
            onError={(e) => {
              console.error("Image failed to load:", finalSrc);
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        ) : (
          <Image
            src={finalSrc}
            alt={alt || "Article image"}
            width={600}
            height={900}
            className="h-[70vh] md:h-[80vh] w-auto object-cover rounded-lg"
            priority={priority}
            unoptimized={finalSrc.includes('?') || finalSrc.includes('=')}
            onError={() => {
              console.error("Next.js Image failed to load:", finalSrc);
              setImgError(true);
            }}
          />
        )}
      </div>
    );
  }

  // ✅ SQUARE IMAGE
  if (orientation === 'square' && !fill) {
    return (
      <div className="relative w-full flex justify-center mb-8">
        {imgError || isProblematicImage ? (
          <img 
            src={finalSrc}
            alt={alt || "Article image"}
            className="h-[50vh] md:h-[60vh] w-auto object-cover rounded-lg"
            loading={priority ? "eager" : "lazy"}
            onError={(e) => {
              console.error("Image failed to load:", finalSrc);
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        ) : (
          <Image
            src={finalSrc}
            alt={alt || "Article image"}
            width={800}
            height={800}
            className="h-[50vh] md:h-[60vh] w-auto object-cover rounded-lg"
            priority={priority}
            unoptimized={finalSrc.includes('?') || finalSrc.includes('=')}
            onError={() => {
              console.error("Next.js Image failed to load:", finalSrc);
              setImgError(true);
            }}
          />
        )}
      </div>
    );
  }
  
  // ✅ LANDSCAPE IMAGE (default - existing behavior)
  if (imgError || isProblematicImage) {
    return (
      <div className={`relative w-full h-full ${fill ? 'absolute inset-0' : ''}`} style={{overflow: 'hidden'}}>
        <img 
          src={finalSrc}
          alt={alt || "Article image"}
          className={`${fill ? 'absolute inset-0 w-full h-full' : ''} object-cover ${className}`}
          loading={priority ? "eager" : "lazy"}
          onError={(e) => {
            console.error("Image failed to load:", finalSrc);
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
      </div>
    );
  }
  
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
        onError={() => {
          console.error("Next.js Image failed to load:", finalSrc);
          setImgError(true);
        }}
      />
    </div>
  );
}