'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

export function FacebookEmbed({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Parse FB posts only after FB SDK is loaded
    if (window.FB && containerRef.current) {
      window.FB.XFBML.parse(containerRef.current);
    }
  }, [url]);

  if (!url) return null;
  
  return (
    <div className="my-6 flex justify-center w-full" ref={containerRef}>
      <div className="fb-post" data-href={url} data-width="500"></div>
    </div>
  );
}

export function InstagramEmbed({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Load Instagram embed script
    if (window.instgrm && containerRef.current) {
      window.instgrm.Embeds.process(containerRef.current);
    }
  }, [url]);

  if (!url) return null;
  
  return (
    <div className="my-6 flex justify-center w-full" ref={containerRef}>
      <blockquote
        className="instagram-media"
        data-instgrm-captioned
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{ 
          maxWidth: '540px',
          width: '100%',
          background: '#FFF',
          borderRadius: '3px',
          border: '1px solid #dbdbdb',
          boxShadow: 'none',
          display: 'block',
          margin: '0 auto',
          minWidth: '326px',
          padding: '0'
        }}
      >
        <div style={{ padding: '16px' }}>
          <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#0095F6', textDecoration: 'none' }}>
            Ver esta publicación en Instagram
          </a>
        </div>
      </blockquote>
    </div>
  );
}

export function TwitterEmbed({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Load Twitter widgets
    if (window.twttr && containerRef.current) {
      window.twttr.widgets.load(containerRef.current);
    }
  }, [url]);

  if (!url) return null;
  
  return (
    <div className="my-6 flex justify-center w-full" ref={containerRef}>
      <blockquote className="twitter-tweet" data-dnt="true">
        <a href={url}>Cargar tweet</a>
      </blockquote>
    </div>
  );
}

export function YouTubeEmbed({ url }: { url: string }) {
  if (!url) return null;
  
  // Extract video ID from YouTube URL
  let videoId = '';
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  
  if (match && match[1]) {
    videoId = match[1];
  } else {
    return null;
  }
  
  return (
    <div className="my-6 flex justify-center w-full">
      <div className="w-full max-w-[560px] aspect-video">
        <iframe 
          width="100%" 
          height="100%" 
          src={`https://www.youtube.com/embed/${videoId}`} 
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    </div>
  );
}

// Add TypeScript declarations for social media SDK globals
declare global {
  interface Window {
    FB: {
      XFBML: {
        parse: (element?: HTMLElement) => void;
      };
    };
    twttr: {
      widgets: {
        load: (element?: HTMLElement) => void;
      };
    };
    instgrm: {
      Embeds: {
        process: (element?: HTMLElement) => void;
      };
    };
  }
}