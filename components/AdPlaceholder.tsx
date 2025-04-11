'use client'

import React from 'react'

interface AdPlaceholderProps {
  title?: string
  subtitle?: string
  ctaText?: string
  onClick?: () => void
}

export default function AdPlaceholder({
  title = 'Advertisement Title',
  subtitle = 'Secondary promotional message here',
  ctaText = 'Read more',
  onClick = () => console.log('Ad clicked')
}: AdPlaceholderProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-[#f5f5f5] shadow-sm my-6 p-0">
      {/* Diagonal line pattern using before pseudo-element */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #e0e0e0 0px, #e0e0e0 1px, transparent 1px, transparent 10px)',
          opacity: 0.5
        }}
      />
      
      {/* Content container */}
      <div className="relative flex flex-col sm:flex-row items-center p-4 sm:p-5 z-10">
        {/* Ad label */}
        <span className="absolute top-2 left-2 text-xs font-medium text-gray-400 uppercase">
          Ad
        </span>
        
        {/* Left section - logo placeholder */}
        <div className="w-full sm:w-20 h-20 bg-gray-300 rounded flex items-center justify-center shrink-0 mb-4 sm:mb-0 mt-3 sm:mt-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        </div>
        
        {/* Center section - text content */}
        <div className="flex-grow px-4 text-center sm:text-left">
          <h3 className="font-bold text-lg text-gray-800 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
        
        {/* Right section - CTA button */}
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={onClick}
            className="bg-black text-white px-5 py-2 rounded text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            {ctaText}
          </button>
        </div>
      </div>
    </div>
  )
}