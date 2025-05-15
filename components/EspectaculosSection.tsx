'use client'

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from 'lucide-react'

interface CategoryLink {
  name: string;
  href: string;
}

interface MainFeature {
  quoteText: string;
  titleText: string;
  subheading: string;
  author: {
    name: string;
    avatarUrl?: string;
  };
  imageUrl: string;
  hasVideo?: boolean;
}

interface SecondaryFeature {
  titleBold: string;
  titleRegular: string;
  imageUrl: string;
  author?: string;
  hasVideo?: boolean;
}

interface EspectaculosSectionProps {
  logo?: {
    src: string;
    alt: string;
  };
  categories?: CategoryLink[];
  mainFeature: MainFeature;
  secondaryFeatures: SecondaryFeature[];
}

export default function EspectaculosSection({
  logo,
  categories = [],
  mainFeature,
  secondaryFeatures,
}: EspectaculosSectionProps) {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="flex flex-col space-y-4 mb-6">
          {/* Logo if provided */}
          {logo && (
            <div className="relative w-48 h-16">
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                className="object-contain object-left"
                priority
                unoptimized
              />
            </div>
          )}

          {/* Title and red accent line */}
          <div className="flex items-center pb-2 border-b border-[#292929]/20">
            <h2 className="text-2xl font-bold text-[#292929]">ESPECTÁCULOS</h2>
            <div className="ml-auto h-1 w-24 bg-[#ff0808]"></div>
          </div>

          {/* Categories in IActualidad style - below title */}
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {categories.map((category, index) => (
                <Link
                  href={category.href}
                  key={index}
                  className="text-xs font-medium text-dark-gray hover:text-primary-red transition-colors flex items-center"
                >
                  {category.name}
                  <ChevronRight size={12} className="ml-0.5" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Content layout */}
        <div className="flex flex-col space-y-6">
          {/* Main article - full width, image on left, text on right */}
          <div className="overflow-hidden border-0 shadow-sm bg-white rounded-md hover:shadow-md transition-shadow duration-300 group">
            <Link href="#" className="flex flex-col md:flex-row">
              {/* Image on the left - fixed height on desktop */}
              <div className="relative md:w-1/2 aspect-video md:aspect-[4/3] h-auto overflow-hidden">
                {mainFeature.hasVideo && (
                  <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded z-10">
                    VIDEO
                  </div>
                )}
                <Image
                  src={mainFeature.imageUrl}
                  alt={mainFeature.titleText}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gray-800 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>

              {/* Text content on the right */}
              <div className="md:w-1/2 p-5 flex flex-col justify-center">
                <h3 className="text-3xl font-bold mb-3 leading-tight text-[#292929]">
                  <span className="text-primary-red font-bold">
                    "{mainFeature.quoteText}".{' '}
                  </span>
                  {mainFeature.titleText}
                </h3>

                <p className="text-dark-gray text-base mb-4 line-clamp-3">
                  {mainFeature.subheading}
                </p>

                <div className="flex items-center">
                  {mainFeature.author.avatarUrl && (
                    <Image
                      src={mainFeature.author.avatarUrl}
                      alt={mainFeature.author.name}
                      width={30}
                      height={30}
                      className="w-6 h-6 rounded-full mr-2"
                    />
                  )}
                  <p className="text-sm text-dark-gray">
                    Por{' '}
                    <span className="font-medium">
                      {mainFeature.author.name}
                    </span>
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Secondary articles row - 2 articles side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {secondaryFeatures.slice(0, 2).map((feature, index) => (
              <div
                key={index}
                className="overflow-hidden border-0 shadow-sm bg-white rounded-md hover:shadow-md transition-shadow duration-300 group h-full"
              >
                <Link href="#" className="flex items-center h-full">
                  {/* Text on the left */}
                  <div className="p-4 w-2/3 flex flex-col justify-center">
                    <h4 className="text-lg font-bold mb-2 leading-tight text-[#292929]">
                      <span className="text-primary-red font-bold">
                        {feature.titleBold}.{' '}
                      </span>
                      {feature.titleRegular}
                    </h4>

                    {feature.author && (
                      <p className="text-sm text-dark-gray mt-auto">
                        Por{' '}
                        <span className="font-medium">{feature.author}</span>
                      </p>
                    )}
                  </div>

                  {/* Image on the right */}
                  <div className="relative w-1/3 aspect-square overflow-hidden">
                    {feature.hasVideo && (
                      <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded z-10">
                        VIDEO
                      </div>
                    )}
                    <Image
                      src={feature.imageUrl}
                      alt={`${feature.titleBold} ${feature.titleRegular}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gray-800 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}