  /** @type {import('next').NextConfig} */
  const nextConfig = {
    reactStrictMode: true,
    images: {
      dangerouslyAllowSVG: true,
      contentDispositionType: 'attachment',
      contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
      domains: [
        'i.ytimg.com', // For standard YouTube thumbnails
        'img.youtube.com', // For additional YouTube image types
      ],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**.ytimg.com',
        },
        {
          protocol: 'https',
          hostname: '**.youtube.com',
        },
      ],
    },
    experimental: {
      serverComponentsExternalPackages: ['@supabase/supabase-js'],
    },
    env: {
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
  }

  module.exports = nextConfig
