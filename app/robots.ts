import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default rule for all bots
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
        crawlDelay: 1,
      },

      // Google bots (including AI/Gemini)
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 0,
      },
      {
        userAgent: 'Googlebot-News',
        allow: '/',
        crawlDelay: 0,
      },

      // Perplexity AI
      {
        userAgent: 'Perplexity',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },

      // OpenAI (ChatGPT, GPT-4)
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
      },

      // Anthropic (Claude)
      {
        userAgent: 'Anthropic-ai',
        allow: '/',
      },
      {
        userAgent: 'Claude-web',
        allow: '/',
      },

      // Microsoft Bing
      {
        userAgent: 'Bingbot',
        allow: '/',
      },
      {
        userAgent: 'MSNBot',
        allow: '/',
      },

      // DuckDuckGo
      {
        userAgent: 'DuckDuckBot',
        allow: '/',
      },

      // Yandex
      {
        userAgent: 'Yandex',
        allow: '/',
      },
    ],

    // ✅ UPDATED PATHS
    sitemap: [
      'https://www.radiodelvolga.com.ar/sitemap.xml',
      'https://www.radiodelvolga.com.ar/sitemap-news', // ← CHANGED
      'https://radiodelvolga.com.ar/sitemap.xml',
      'https://radiodelvolga.com.ar/sitemap-news', // ← CHANGED
    ],
  }
}
