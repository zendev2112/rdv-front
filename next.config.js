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
      'resizer.glanacion.com',
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
      {
        protocol: 'https',
        hostname: 'resizer.glanacion.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'www.infobae.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '**.cdninstagram.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'pxcdn.lanueva.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'fotos.perfil.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'dib.com.ar',
        pathname: '**',
      },
    ],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  env: {
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
}

module.exports = nextConfig;
