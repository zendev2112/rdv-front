/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
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
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'radiodelvolga.com.ar',
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
  async redirects() {
    return [
      // pfbid slug migrations — 301 permanent redirects to clean slugs
      { source: '/deportes/pfbid02PY9wVEUCEEfq5A7TCjJsa64FFouVyoLX9NtMgAeiVhRdEC3yM1beZz23eaJTFsMKl', destination: '/deportes/lrf-femenino-independiente-cerro-la-fecha-con-una-goleada', permanent: true },
      { source: '/coronel-suarez/pfbid028DqfkjTNsPoCbA2jduG4atEi8nT1oYRpdDzuRjYuHea4qENpcwBQyfjvcgKWa234l', destination: '/coronel-suarez/coronel-suarez-inaugura-su-primer-museo', permanent: true },
      { source: '/deportes/pfbid0ezSSidipEZ7tqReDsnvMf135eXCk7oL6BcV3fYr7VdgEhGyWqHMPN2reiBktjdV4l', destination: '/deportes/torneo-patoruzito-en-blanco-y-negro', permanent: true },
      { source: '/coronel-suarez/pfbid02YH77HqkWX8XyW7LHis9vRtr2NyxbDVyEzs6MXSgejMdMgzpTNHCEfn7QvDvhgJt4l', destination: '/coronel-suarez/talleres-municipales-celebraron-su-cierre-anual-en-el-mercado-de-las-artes', permanent: true },
      { source: '/coronel-suarez/pfbid0KZVzzYFYE6fMJFZJHCyjtabyh9SVmEfhRuBipAcUwQAuwrzZvGCpb3LMhETbT5Zsl', destination: '/coronel-suarez/la-tranca-representa-a-coronel-suarez-en-el-encuentro-nacional-de-danza-folklorica-en-jujuy', permanent: true },
      { source: '/deportes/pfbid02XizyvS4Gn8ZGpqacKTJgqFbYb1ugwxa18P15TW28WrYB6aG6BW1rj9RYDRjo4yGyl', destination: '/deportes/lrf-definidos-los-cruces-de-octavos', permanent: true },
      { source: '/coronel-suarez/pfbid024hqWR6An2wMornSVgUdWDsfpHWM2JBziyxS5mrrFEXRK5PhiiJ1ZyCP3fSd4Wd66l', destination: '/coronel-suarez/el-municipio-pide-solidaridad-para-eliminar-la-pirotecnia-en-las-fiestas', permanent: true },
      { source: '/coronel-suarez/pfbid038YBrt7MMEjr8Givr656yPsSSeSkRpiB6aJcKn73PihbU9z8LNSxaRQqb8wKjiTGl', destination: '/coronel-suarez/smurfit-westrock-cerro-la-4-edicion-del-programa-recreo-en-coronel-suarez', permanent: true },
      { source: '/coronel-suarez/pfbid021Zg5u3GhWmF1DuCYjJA4Dfr5pZPoa184Y3Gc2xHSAnJx1fMeXuYw8PYDh3fKEsndl', destination: '/coronel-suarez/corte-de-agua-programado-en-neuquen-y-b-de-irigoyen', permanent: true },
      { source: '/la-sexta/pfbid02Fzmo98nvLqzJcFZ4UGJR8iWHFyZ4QzcHPKeT6pTvK5wU37UKfL6vFAuNpVXD3tnXl', destination: '/la-sexta/vuelco-de-una-peugeot-partner-cerca-de-la-madrid', permanent: true },
      { source: '/pueblos-alemanes/santa-maria/pfbid02WVgqFo8k54NMoTvw7gvTnVEm2gtZSWZQDZqe46Q6vQRPmE6UFQs91iwqx47Ezg3Hl', destination: '/pueblos-alemanes/santa-maria/vacunacion-antirrabica-gratuita-para-perros-y-gatos-en-pueblo-santa-maria', permanent: true },
      { source: '/cultura/pfbid02gqah3hNUV4fMjDiPYBrT56aiQv8jeQoyqwEauq7hL5rcYMqF7RPuEtbvZYrYYKPxl', destination: '/cultura/la-parroquia-san-jose-obrero-sede-del-exitoso-concierto-navideno-sinfonico-coral', permanent: true },
      { source: '/deportes/pfbid0e9JXiuF9RJnAac9RsQ6tkMAtJpqHtdSurzZNURvF1P8HkHPhRGiKoz1UzBJXaEL9l', destination: '/deportes/comienza-la-28-edicion-del-torneo-futbol-del-recuerdo', permanent: true },
      { source: '/coronel-suarez/pfbid0PYpFc2J1d8G2bU42sqFoDHEvg63NvBYScvz9oVEjqNZULG16hhccYuoKigfQyrNyl', destination: '/coronel-suarez/el-domingo-21-de-diciembre-se-realizara-la-16-edicion-de-suarez-peatonal', permanent: true },
      { source: '/pueblos-alemanes/san-jose/pfbid0yjXWAQ4mXxtE24trhrTTw6YBTT1uQ22MywPjNRieC2hR3cnVgCqbF3S1a2tWcxNLl', destination: '/pueblos-alemanes/san-jose/independiente-de-san-jose-organiza-su-fiesta-del-deporte', permanent: true },
      { source: '/sociedad/educacion/pfbid0rwc7pcNnkBEDHRAEvz7kQBiXexXVA11pa8s8egXWa4wrMd98WEJznXJctumEEEtcl', destination: '/sociedad/educacion/gran-acto-de-fin-de-ciclo-en-el-triunfo', permanent: true },
      { source: '/coronel-suarez/pfbid02DCGhaDDyokdJBp7CYnMabc5UdPZ9KUhLBb8RLE6gbcoqkfzWeu2iTaAo2w2AF7W7l', destination: '/coronel-suarez/el-newcom-festejo-el-cierre-de-ano-con-celebracion-y-reconocimientos', permanent: true },
      { source: '/pueblos-alemanes/pfbid0362HkSGBN4911gLSvhdoP1EK2KxVLSM2L5h6NTMxwMGQRQY1Hih91aZePVeYxDo5Kl', destination: '/pueblos-alemanes/voley-de-independiente-un-ano-de-crecimiento-y-proyeccion', permanent: true },
      { source: '/sociedad/educacion/pfbid029dY7Mo9iEvQByzdDtxySCtow1cETzdCLbZCWAVc1wN7BRez8hCru6oq91WXh4KRUl', destination: '/sociedad/educacion/la-escuela-de-educacion-artistica-n-1-celebro-dos-decadas-con-arte-y-comunidad', permanent: true },
      { source: '/coronel-suarez/pfbid0NQkYGsqGv3YhikDev6KERidsuk1xBfuRVHLBvQd42fmwhMvj96zpdX1rdK3sRHPHl', destination: '/coronel-suarez/fallecio-hugo-gardiner-historico-jinete-suarense', permanent: true },
      { source: '/deportes/pfbid02t2KPd4iQQhuUNXTzL539rAZw5qhZevqJ1adYxSaAss3HnKVre8Y5RuDTfesyPKe4l', destination: '/deportes/torneo-futbol-del-recuerdo-este-viernes-se-juegan-los-8vos-de-final', permanent: true },
      { source: '/coronel-suarez/pfbid02QwFSkExN8ruZ9ou2A2i6fAwZgz7C5deaXn8gYJmSArAecixth9zvYfpKdnjqqKRzl', destination: '/coronel-suarez/bicicleteada-recreativa-suarez-pineyro-asado-musica-y-naturaleza', permanent: true },
      { source: '/coronel-suarez/pfbid02LmTaemcSZerWs9tyLYZxaDYQhEdDVTae2asrHC1kRjwgFfFz8bHmEGFpy2PcvUhJl', destination: '/coronel-suarez/recoleccion-de-residuos-modifica-horarios-en-coronel-suarez', permanent: true },
      { source: '/coronel-suarez/pfbid02JKxWDinYSmNAR58WDkJSM9krKnmhrEE1jsPx6yRvTJetknCKP3FzAtrh8yYFB8vml', destination: '/coronel-suarez/edes-corte-de-luz-programado-en-coronel-suarez-este-viernes-22-de-mayo', permanent: true },
    ]
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        },
      ],
    }
  },
}

module.exports = nextConfig
