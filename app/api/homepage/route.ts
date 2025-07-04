import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ''
const supabase = createClient(supabaseUrl, supabaseKey)

// NO CACHE, NO TTL, NO BULLSHIT
// const CACHE_TTL = 0 // DELETED
// const isDevelopment = process.env.NODE_ENV === 'development' // DELETED

// NO CACHE INTERFACE
// interface CacheEntry { // DELETED

// Function to fetch articles for a specific section
async function fetchSectionArticles(section: string, limit: number = 30) {
  let query = supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .ilike('front', `%${section}%`)
    .order('created_at', { ascending: false })
    .limit(limit)

  const { data, error } = await query

  if (error) {
    console.error(`Error fetching ${section}:`, error)
    return []
  }

  return data || []
}

export async function GET(request: NextRequest) {
  try {
    console.log(
      `🔄 FRESH FETCH - NO CACHE - Fetching all sections from Supabase`
    )

    // Fetch ALL sections in parallel for maximum performance
    const [
      // Main news sections
      principalArticles,
      noticiasImportantesArticles,
      actualidadArticles,
      masNoticiasArticles,

      // Regional sections
      pueblosAlemanesArticles,
      huanguelenArticles,
      laSextaArticles,

      // Specialized sections
      politicaYEconomiaArticles,
      agroArticles,
      deportesArticles,
      culturaArticles,

      // Lifestyle and entertainment
      historiasYRelatosArticles,
      recetasArticles,
      opinionArticles,
      bienestarArticles,
      mundoArticles,

      // Technology and business
      iActualidadArticles,
      negociosArticles,
      cienciaYSaludArticles,
      techArticles,

      // Entertainment and culture
      espectaculosArticles,
      salidasArticles,
      lifestyleArticles,
      propiedadesArticles,

      // Other sections
      tendenciasArticles,
      estrenosArticles,
      youMayBeInterestedArticles,
      mediaCarouselArticles,
      volgaTVArticles,

      // Special sections
      climaArticles,
      farmaciasArticles,
      quinielaArticles,
      radioArticles,
    ] = await Promise.all([
      // Main news sections
      fetchSectionArticles('PrincipalSection', 10),
      fetchSectionArticles('NoticiasImportantesSection', 8),
      fetchSectionArticles('ActualidadSection', 15),
      fetchSectionArticles('MasNoticiasSection', 10),

      // Regional sections
      fetchSectionArticles('PueblosAlemanesSection', 6),
      fetchSectionArticles('HuanguelenSection', 6),
      fetchSectionArticles('LaSextaSection', 6),

      // Specialized sections
      fetchSectionArticles('PoliticaYEconomiaSection', 8),
      fetchSectionArticles('AgroSection', 8),
      fetchSectionArticles('DeportesSection', 6),
      fetchSectionArticles('CulturaSection', 6),

      // Lifestyle and entertainment
      fetchSectionArticles('HistoriasYRelatosSection', 6),
      fetchSectionArticles('RecetasSection', 4),
      fetchSectionArticles('OpinionSection', 8),
      fetchSectionArticles('BienestarSection', 6),
      fetchSectionArticles('MundoSection', 6),

      // Technology and business
      fetchSectionArticles('IActualidadSection', 6),
      fetchSectionArticles('NegociosSection', 8),
      fetchSectionArticles('CienciaYSaludSection', 6),
      fetchSectionArticles('TechSection', 6),

      // Entertainment and culture
      fetchSectionArticles('EspectaculosSection', 6),
      fetchSectionArticles('SalidasSection', 8),
      fetchSectionArticles('LifestyleSection', 8),
      fetchSectionArticles('PropiedadesSection', 8),

      // Other sections
      fetchSectionArticles('TendenciasSection', 8),
      fetchSectionArticles('EstrenosSection', 6),
      fetchSectionArticles('YouMayBeInterestedSection', 8),
      fetchSectionArticles('MediaCarouselSection', 10),
      fetchSectionArticles('VolgaTVSection', 8),

      // Special sections
      fetchSectionArticles('ClimaSection', 1),
      fetchSectionArticles('FarmaciasSection', 5),
      fetchSectionArticles('QuinielaSection', 1),
      fetchSectionArticles('RadioSection', 1),
    ])

    const aggregatedData = {
      // Main news sections
      principal: principalArticles,
      noticiasImportantes: noticiasImportantesArticles,
      actualidad: actualidadArticles,
      masNoticias: masNoticiasArticles,

      // Regional sections
      pueblosAlemanes: pueblosAlemanesArticles,
      huanguelen: huanguelenArticles,
      laSexta: laSextaArticles,

      // Specialized sections
      politicaYEconomia: politicaYEconomiaArticles,
      agro: agroArticles,
      deportes: deportesArticles,
      cultura: culturaArticles,

      // Lifestyle and entertainment
      historiasYRelatos: historiasYRelatosArticles,
      recetas: recetasArticles,
      opinion: opinionArticles,
      bienestar: bienestarArticles,
      mundo: mundoArticles,

      // Technology and business
      iActualidad: iActualidadArticles,
      negocios: negociosArticles,
      cienciaYSalud: cienciaYSaludArticles,
      tech: techArticles,

      // Entertainment and culture
      espectaculos: espectaculosArticles,
      salidas: salidasArticles,
      lifestyle: lifestyleArticles,
      propiedades: propiedadesArticles,

      // Other sections
      tendencias: tendenciasArticles,
      estrenos: estrenosArticles,
      youMayBeInterested: youMayBeInterestedArticles,
      mediaCarousel: mediaCarouselArticles,
      volgaTV: volgaTVArticles,

      // Special sections
      clima: climaArticles,
      farmacias: farmaciasArticles,
      quiniela: quinielaArticles,
      radio: radioArticles,

      // Metadata
      lastUpdated: new Date().toISOString(),
      totalArticles: [
        principalArticles,
        noticiasImportantesArticles,
        actualidadArticles,
        masNoticiasArticles,
        pueblosAlemanesArticles,
        huanguelenArticles,
        laSextaArticles,
        politicaYEconomiaArticles,
        agroArticles,
        deportesArticles,
        culturaArticles,
        historiasYRelatosArticles,
        recetasArticles,
        opinionArticles,
        bienestarArticles,
        mundoArticles,
        iActualidadArticles,
        negociosArticles,
        cienciaYSaludArticles,
        techArticles,
        espectaculosArticles,
        salidasArticles,
        lifestyleArticles,
        propiedadesArticles,
        tendenciasArticles,
        estrenosArticles,
        youMayBeInterestedArticles,
        mediaCarouselArticles,
        volgaTVArticles,
        climaArticles,
        farmaciasArticles,
        quinielaArticles,
        radioArticles,
      ].reduce((total, articles) => total + articles.length, 0),

      // Section counts for monitoring
      sectionCounts: {
        principal: principalArticles.length,
        noticiasImportantes: noticiasImportantesArticles.length,
        actualidad: actualidadArticles.length,
        masNoticias: masNoticiasArticles.length,
        pueblosAlemanes: pueblosAlemanesArticles.length,
        huanguelen: huanguelenArticles.length,
        laSexta: laSextaArticles.length,
        politicaYEconomia: politicaYEconomiaArticles.length,
        agro: agroArticles.length,
        deportes: deportesArticles.length,
        cultura: culturaArticles.length,
        historiasYRelatos: historiasYRelatosArticles.length,
        recetas: recetasArticles.length,
        opinion: opinionArticles.length,
        bienestar: bienestarArticles.length,
        mundo: mundoArticles.length,
        iActualidad: iActualidadArticles.length,
        negocios: negociosArticles.length,
        cienciaYSalud: cienciaYSaludArticles.length,
        tech: techArticles.length,
        espectaculos: espectaculosArticles.length,
        salidas: salidasArticles.length,
        lifestyle: lifestyleArticles.length,
        propiedades: propiedadesArticles.length,
        tendencias: tendenciasArticles.length,
        estrenos: estrenosArticles.length,
        youMayBeInterested: youMayBeInterestedArticles.length,
        mediaCarousel: mediaCarouselArticles.length,
        volgaTV: volgaTVArticles.length,
        clima: climaArticles.length,
        farmacias: farmaciasArticles.length,
        quiniela: quinielaArticles.length,
        radio: radioArticles.length,
      },
    }

    console.log(
      `✅ FRESH DATA: ${aggregatedData.totalArticles} total articles across ${
        Object.keys(aggregatedData.sectionCounts).length
      } sections`
    )

    // NO CACHE, NO ETAG, NO BULLSHIT
    return NextResponse.json(aggregatedData, {
      status: 200,
      headers: {
        // NUCLEAR NO-CACHE HEADERS
        'Cache-Control':
          'no-store, no-cache, must-revalidate, max-age=0, s-maxage=0',
        Pragma: 'no-cache',
        Expires: '0',
        'X-Cache': 'DISABLED-FOREVER',
      },
    })
  } catch (error) {
    console.error('Homepage aggregation error:', error)

    return NextResponse.json(
      { error: 'Failed to fetch homepage data' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    )
  }
}
