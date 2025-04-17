import React from "react";
import Image from "next/image";
import Link from "next/link";

interface MovieReleasesProps {
  quoteText: string;
  headlineText: string;
  caption: string;
  imageUrl: string;
  hasVideo?: boolean;
}

export default function MovieReleases({
  quoteText,
  headlineText,
  caption,
  imageUrl,
  hasVideo = false,
}: MovieReleasesProps) {
  return (
    <section className="border-t border-b border-gray-200 my-4">
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6 uppercase text-primary-red">DEPORTES</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
          {/* Left column - Headline and caption */}
          <div>
            <h3 className="text-xl font-serif leading-tight mb-3">
              <span className="font-bold">"{quoteText}".</span> {headlineText}
            </h3>
            <p className="text-sm text-gray-600">{caption}</p>
          </div>
          
          {/* Right column - Image with optional video label */}
          <div className="relative">
            <Image
              src={imageUrl}
              alt={`${quoteText} ${headlineText}`}
              width={600}
              height={340}
              className="w-full h-auto aspect-video object-cover"
            />
            {hasVideo && (
              <div className="absolute top-2 left-2 bg-black text-white text-xs px-1 py-0.5">
                VIDEO
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}