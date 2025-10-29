import Image from 'next/image'
import { Search, Bell, Menu, Play, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import OpinionSection from '../components/OpinionSection'
import BienestarSection from '../components/BienestarSection'
import MundoSection from '../components/MundoSection'
import TechSection from '../components/TechSection'
import TendenciasSection from '../components/TendenciasSection'
import TopReads from '../components/TopReads'
import HuanguelenSection from '@/components/HuanguelenSection'
import NegociosSection from '../components/NegociosSection'
import EspectaculosSection from '../components/EspectaculosSection'
import LaSextaSection from '../components/LaSextaSection' // Changed import
import PropiedadesSection from '../components/PropiedadesSection'
import AgroSection from '@/components/AgroSection'
import LifestyleSection from '../components/LifestyleSection'
import Footer from '../components/Footer'
import PrincipalSection from '@/components/PrincipalSection'
import NoticiasImportantesSection from '@/components/NoticiasImportantesSection'
import ClimaSection from '@/components/ClimaSection'
import FarmaciasDeTurno from '@/components/FarmaciasDeTurno'
import ActualidadSection from '@/components/ActualidadSection'
import PoliticaYEconomiaSection from '@/components/PoliticaYEconomiaSection'
import AdPlaceholder from '@/components/AdPlaceholder'
import UltimasNoticiasSection from '@/components/UltimasNoticiasSection'
import VolgaTVSection from '@/components/VolgaTVSection'
import RadioPlayerShowcase from '@/components/RadioPlayerShowcase'
import { DeportesSection } from '@/components/DeportesSection'
import { HistoriasYRelatosSection } from '@/components/HistoriasYRelatosSection'
import YouMayBeInterestedSection from '@/components/YouMayBeInterestedSection'
import RecetasSection from '@/components/RecetasSection'
import QuinielaSection from '@/components/QuinielaSection'
import IActualidad from '@/components/IActualidad'
import CienciaYSaludSection from '@/components/CienciaYSaludSection'
import MediaCarousel from '@/components/MediaCarousel'
import PueblosAlemanesSection from '@/components/PueblosAlemanesSection'
import CulturaSection from '@/components/CulturaSection'
import MobileNavBar from '@/components/MobileNavBar'
import { fetchSectionArticles } from '@/utils/api'
import { fetchLatestHeadlines } from '@/utils/api'
import { fetchLatestVideos } from '@/lib/youtube/fetchLatestVideos'
import SidelinesLayout from '@/components/SidelinesLayout'
import { SkyscraperAd, SidebarRectangleAd } from '@/components/ads/SkyscraperAd'
import DollarRates from '@/components/DollarRates'
import NewsTicker from '@/components/NewsTicker'
import { fetchYouTubeRSS } from '@/lib/youtube/fetchYouTubeRSS'
import MobileDollarRates from '@/components/MobileDollarRates'


export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'
export const runtime = 'nodejs'
export const maxDuration = 30


// This is a Server Component
export default async function Home() {
  // Fetch data for each section
  const principalSectionArticles = await fetchSectionArticles(
    'PrincipalSection'
  )
  const noticiasImportantesArticles = await fetchSectionArticles(
    'NoticiasImportantesSection'
  )
  const pueblosAlemanesArticles = await fetchSectionArticles(
    'PueblosAlemanesSection'
  )
  const huanguelenArticles = await fetchSectionArticles('HuanguelenSection')
  const laSextaArticles = await fetchSectionArticles('LaSextaSection')

  const youtubeVideos = await fetchYouTubeRSS(process.env.CHANNEL_ID!)
  const featuredVideo = youtubeVideos[0] || null
  const recentVideos = youtubeVideos.slice(1, 4)

  const actualidadArticles = await fetchSectionArticles('ActualidadSection')
  const latestHeadlines = await fetchLatestHeadlines()
  const agroArticles = await fetchSectionArticles('AgroSection')
  const lifestyleArticles = await fetchSectionArticles('LifestyleSection')


  // Define custom ads for sidelines (optional)
  const sidelineWidth = 15
  const leftSideAds = (
    <div className="space-y-4">
      <SkyscraperAd position="left" />
    </div>
  )

  const rightSideAds = (
    <div className="space-y-4">
      <SkyscraperAd position="right" />
      <SidebarRectangleAd />
    </div>
  )

  return (
    <>
      {/* MOBILE VERSION - NO SidelinesLayout */}
      <div className="md:hidden pt-[184px]">
        <div className="container mx-auto max-w-[1600px] px-4">
          {/* Currency rates */}
          <div className="hidden md:block border-b border-gray-200 overflow-x-auto">
            <DollarRates />
          </div>

          <div className="pt-12 md:pt-0"></div>

          {/* Breaking news ticker */}
          <div className="hidden md:block border-b border-light-gray overflow-x-auto">
            <div className="py-2 flex items-center text-sm space-x-2 whitespace-nowrap">
              <span className="bg-primary-red text-white px-2 py-0.5 text-xs rounded">
                EN VIVO
              </span>
              <NewsTicker headlines={latestHeadlines} />
            </div>
          </div>
          {/* Main content */}
          <PrincipalSection serverData={principalSectionArticles} />

          <div className="md:hidden">
            <MobileDollarRates />
          </div>

          <NoticiasImportantesSection
            serverData={noticiasImportantesArticles}
          />

          <VolgaTVSection
            featuredVideo={featuredVideo}
            recentVideos={recentVideos}
          />

          <PueblosAlemanesSection serverData={pueblosAlemanesArticles} />

          <FarmaciasDeTurno />

          {/* Weather section */}
          <ClimaSection />

          <HuanguelenSection serverData={huanguelenArticles} />

          <LaSextaSection serverData={laSextaArticles} />

          {/* Advertisement banner */}
          <div className="py-6">
            <div className="bg-gray-100 p-4 text-center">
              <p className="text-xs text-gray-500 mb-2">AD</p>
              <div className="h-16 flex items-center justify-center">
                <p className="text-gray-400">Advertisement Banner</p>
              </div>
            </div>
          </div>

          {/*           <div className="py-6 flex flex-col md:flex-row gap-8">
            <div className="flex-1 min-w-0">
              <ActualidadSection serverData={actualidadArticles} />
            </div>
            <div className="w-full md:w-80 flex-shrink-0">
              <UltimasNoticiasSection headlines={latestHeadlines} />
            </div>
          </div> */}

          {/* Politics and Economy Section */}
          {/*           <PoliticaYEconomiaSection
            mainArticle={{
              id: 'politics-main-1',
              title: {
                highlight: 'Debate previsional',
                regular:
                  'Números claves que difieren según el lugar del país y que impactan con fuerza',
              },
              summary:
                'El debate sobre el sistema previsional continúa generando controversia mientras los distintos sectores intentan llegar a un acuerdo.',
              author: 'Jorge Fontevecchia',
              imageUrl: '/placeholder.svg?height=400&width=600',
              hasVideo: false,
            }}
            sideArticles={[
              {
                id: 'politics-side-1',
                title: {
                  highlight: 'Fondo monetario',
                  regular:
                    'La Argentina logró consolidar el respaldo del FMI para las próximas etapas del acuerdo',
                },
                author: 'Manuel Adorni',
                imageUrl: '/placeholder.svg?height=200&width=300',
                hasVideo: false,
              },
              {
                id: 'politics-side-2',
                title: {
                  highlight: 'Los desafíos',
                  regular:
                    'Inflación y salarios: la compleja ecuación que el gobierno intenta resolver',
                },
                author: 'Cecilia Boufflet',
                imageUrl: '/placeholder.svg?height=200&width=300',
                hasVideo: false,
              },
              {
                id: 'politics-side-3',
                title: {
                  highlight: 'Análisis',
                  regular:
                    'Las cinco claves para entender el panorama político de cara a las elecciones',
                },
                author: 'Carlos Pagni',
                imageUrl: '/placeholder.svg?height=200&width=300',
                hasVideo: true,
              },
            ]}
          /> */}

          <AdPlaceholder />

          {/* Agro Four Column Grid Section */}
          <section className="py-6 border-t border-gray-200">
            <AgroSection serverData={agroArticles} />
          </section>

          {/* Add Radio Player Showcase */}
          {/* Radio Player Showcase - Full Width */}
          <div className="py-6">
            <RadioPlayerShowcase
              frequency="99.5"
              stationName="Radio del Volga"
              radioLink="https://app.radiodelvolga.com.ar/"
            />
          </div>

          <AdPlaceholder />

          {/* Sports News Section */}
          {/*           <DeportesSection
            mainArticle={{
              title: (
                <>
                  <span className="font-bold">De la mano de "Maravilla".</span>{' '}
                  Con un triplete de Martínez, Racing activó el 'modo copero' y
                  se acercó a los puestos de clasificación
                </>
              ),
              content:
                'El delantero fue la indiscutida figura en el triunfo por 4-1, convirtiendo un triplete tras un año sin marcar de a tres. El equipo de Gustavo Costas volvió a mostrar su mejor versión y se reencuentra con la victoria tras dos partidos sin conseguirla.',
              author: 'Franco Tossi',
              imageUrl: '/placeholder.svg?height=400&width=500',
            }}
            sideArticles={[
              {
                title: (
                  <>
                    <span className="font-bold">Insólito.</span> En la Liga de
                    España, dos compañeros casi terminan a las trompadas en el
                    banco de suplentes
                  </>
                ),
                content:
                  'Durante el partido entre Villarreal y Atlético de Madrid, las cámaras captaron un fuerte cruce entre dos futbolistas del equipo colchonero que estaban en el banco.',
                author: 'Redacción Deportes',
                imageUrl: '/placeholder.svg?height=200&width=250',
                hasVideo: true,
              },
              {
                title: (
                  <>
                    <span className="font-bold">Argentinos, de lujo.</span>{' '}
                    Media hora a toda orquesta, taco, sombrero, golazos... y un
                    agradecimiento a "Chiqui" Tapia
                  </>
                ),
                content:
                  'El equipo de La Paternal desplegó un fútbol de alto nivel durante el primer tiempo y se impuso con autoridad frente a Barracas Central por 3-0, consolidándose en los primeros puestos del torneo.',
                author: 'Germán Wille',
                imageUrl: '/placeholder.svg?height=200&width=250',
                hasVideo: true,
              },
            ]}
          /> */}

          {/* Stories and Characters Section with shadcn */}
          {/*           <HistoriasYRelatosSection
            mainArticle={{
              title: (
                <>
                  <span className="font-bold">"Hola mi vida".</span> Tini
                  Stoessel tuvo un gesto inesperado con un fan que se volvió
                  viral en redes
                </>
              ),
              author: 'Martín Fernández Cruz',
              imageUrl: '/placeholder.svg?height=400&width=400',
            }}
            sideArticles={[
              {
                title: (
                  <>
                    <span className="font-bold">Historias.</span> Es argentino y
                    se animó con un proyecto de US$4 millones a pasos de la
                    cancha de polo
                  </>
                ),
                author: 'Ariel Goldfarb',
                imageUrl: '/placeholder.svg?height=150&width=200',
              },
              {
                title: (
                  <>
                    <span className="font-bold">
                      Prometió volver con un Rosario bendecido en Calcuta.
                    </span>{' '}
                    Vivía lejos y supo que su madre tenía cáncer "Es una locura"
                  </>
                ),
                author: 'Carina Durn',
                imageUrl: '/placeholder.svg?height=150&width=200',
              },
              {
                title: (
                  <>
                    <span className="font-bold">Relatos inspiradores.</span> La
                    historia del joven que dejó la ciudad para convertirse en
                    guía de montaña
                  </>
                ),
                author: 'Federico Wiemeyer',
                imageUrl: '/placeholder.svg?height=150&width=200',
              },
            ]}
          /> */}

          {/* Foodit Section */}
          {/*           <RecetasSection
            logoSrc="/placeholder.svg?height=80&width=150"
            categories={[
              { name: 'MENU', href: '#' },
              { name: 'TIPS Y SECRETOS DE COCINA', href: '#' },
              { name: 'RECETAS FACILES', href: '#' },
            ]}
            mainArticle={{
              titleBold: 'Dulce y crocante.',
              titleRegular:
                'Una tarta invertida con pistachos para decirle adiós a la clásica de jamón y queso',
              content:
                'La dulzura de las cebollas combina de maravilla con el perfume de las hierbas y el toque del fruto seco que está de moda; una receta para un almuerzo diferente y lleno de sabor',
              imageUrl: '/placeholder.svg?height=300&width=400',
              imageAlt: 'Tarta invertida con pistachos',
            }}
          /> */}

          {/* <QuinielaSection /> */}

          {/* Opinion Section */}
          {/*           <OpinionSection
            opinionCards={opinionSectionData.opinionCards}
            featuredOpinion={opinionSectionData.featuredOpinion}
            editorials={opinionSectionData.editorials}
            smallOpinionCard={opinionSectionData.smallOpinionCard}
          /> */}

          {/* Wellness Section */}
          {/*           <BienestarSection
            featuredArticle={wellnessSectionData.featuredArticle}
            smallArticles={wellnessSectionData.smallArticles}
          /> */}

          {/* World Section (formerly Farming Section) */}
          {/*           <MundoSection
            mainArticle={farmingSectionData.mainArticle}
            sideArticles={farmingSectionData.sideArticles}
          /> */}

          {/*           <IActualidad
            logo={{
              src: '/images/iactualidad-logo.png',
              alt: 'iActualidad Logo',
            }}
            categories={[
              { name: 'INTELIGENCIA ARTIFICIAL', href: '#' },
              { name: 'BITCOIN', href: '#' },
              { name: 'CRIPTOMONEDAS', href: '#' },
              { name: 'ROBOTICA', href: '#' },
            ]}
            mainArticle={{
              title:
                'Bitcoin alcanza nuevo máximo histórico superando los 80.000 dólares',
              content:
                'La criptomoneda más popular del mundo continúa su tendencia alcista impulsada por la creciente adopción institucional y la reciente aprobación de ETFs por la SEC.',
              author: 'Carlos Rodríguez',
              imageUrl: '/placeholder.svg?height=400&width=600',
            }}
            sideArticles={[
              {
                title: 'La inflación de abril fue del 8,8%, según el INDEC',
                subtitle:
                  'Es el dato mensual más bajo desde febrero del año pasado. Igualmente, el acumulado de los últimos 12 meses alcanza el 289,4%.',
                author: 'María López',
                imageUrl: '/placeholder.svg?height=150&width=150',
              },
              {
                title:
                  'Presentan un proyecto de ley para modernizar el sistema financiero',
                subtitle:
                  'La iniciativa busca impulsar la inversión y facilitar el acceso al crédito para pequeñas y medianas empresas.',
                author: 'Juan Pérez',
                imageUrl: '/placeholder.svg?height=150&width=150',
              },
            ]}
          /> */}

          {/* Tech Section */}
          {/*           <section className="py-6 border-t border-gray-200">
            <TechSection articles={techSectionData.articles} />
          </section> */}

          {/*           <section className="py-6 border-t border-gray-200">
            <CienciaYSaludSection
              sectionTitle="CIENCIA Y SALUD"
              logo={{
                src: '/images/ciencia-salud-logo.png',
                alt: 'Ciencia y Salud',
              }}
              mainArticle={lifestyleFeatureData.mainArticle}
              smallArticles={lifestyleFeatureData.smallArticles}
            />
          </section> */}

          {/* Hashtag Section */}
          {/*           <section className="py-6 border-t border-gray-200">
            <TendenciasSection
              hashtagName={hashtagSectionData.hashtagName}
              featuredItem={hashtagSectionData.featuredItem}
              contentCards={hashtagSectionData.contentCards}
            />
          </section> */}

          {/* Top Reads Section */}
          {/*           <section className="py-6 border-t border-gray-200">
            <TopReads articles={topReadsData.articles} />
          </section> */}

          {/* Business Main Feature Section */}
          {/*           <NegociosSection
            logo={{
              src: '/images/business-logo.png',
              alt: 'Business Section Logo',
            }}
            categories={[
              { name: 'PROPIEDADES', href: '#' },
              { name: 'EMPRENDEDORES', href: '#' },
              { name: 'PYMES', href: '#' },
              { name: 'CAMPO', href: '#' },
              { name: 'INDICES', href: '#' },
              { name: 'DOLAR HOY', href: '#' },
            ]}
            mainArticle={{
              id: 'business-main-1',
              title: {
                highlight: 'Inversiones',
                regular:
                  'Las acciones argentinas registran su mejor semana del año con subas de hasta 15%',
              },
              summary:
                'El mercado financiero local mostró un fuerte repunte impulsado por el anuncio de nuevas medidas económicas y la mejora en las perspectivas de inversión extranjera.',
              author: 'Carlos Martínez',
              imageUrl: '/placeholder.svg?height=400&width=600',
              hasVideo: false,
            }}
            sideArticles={[
              {
                id: 'business-side-1',
                title: {
                  highlight: 'Tecnología',
                  regular:
                    'La startup argentina que revoluciona el sector fintech recibió inversión millonaria',
                },
                author: 'Laura González',
                imageUrl: '/placeholder.svg?height=200&width=300',
                hasVideo: false,
              },
              {
                id: 'business-side-2',
                title: {
                  highlight: 'Comercio exterior',
                  regular:
                    'Crecen las exportaciones de servicios basados en conocimiento',
                },
                author: 'Martín Rodríguez',
                imageUrl: '/placeholder.svg?height=200&width=300',
                hasVideo: true,
              },
              {
                id: 'business-side-3',
                title: {
                  highlight: 'Análisis',
                  regular:
                    'Los sectores que más empleo generaron en el último trimestre',
                },
                author: 'Julia Fernández',
                imageUrl: '/placeholder.svg?height=200&width=300',
                hasVideo: false,
              },
            ]}
          /> */}

          {/* Entertainment Main Feature Section */}
          {/*           <section className="py-6 border-t border-gray-200">
            <EspectaculosSection
              mainFeature={entertainmentMainFeatureData.mainFeature}
              secondaryFeatures={entertainmentMainFeatureData.secondaryFeatures}
            />
          </section> */}

          {/* Lifestyle Section */}
          {/*           <section className="py-6 border-t border-gray-200">
            <LifestyleSection serverData={lifestyleArticles}

            />
          </section> */}

          {/* Cultura Section */}
          {/*           <section className="py-6 border-t border-gray-200">
            <CulturaSection
              mainArticle={{
                id: 'cultura-main',
                title:
                  'Arte contemporáneo llega al museo municipal con exposición internacional',
                slug: 'arte-contemporaneo-exposicion-internacional-museo',
                excerpt:
                  'Con más de 50 obras de artistas locales e internacionales, la muestra explora la relación entre la percepción humana y las nuevas tecnologías digitales, creando experiencias inmersivas.',
                source: 'Lucía Méndez',
                imgUrl: '/placeholder.svg?height=400&width=600',
                section: 'EXPOSICIÓN',
                overline: 'Arte contemporáneo',
                published_at: '2025-05-10T14:30:00Z',
              }}
              sideArticles={[
                {
                  id: 'cultura-side-1',
                  title:
                    'Vuelve "Casa de muñecas" con un elenco renovado y una visión contemporánea',
                  slug: 'casa-de-munecas-elenco-renovado-vision-contemporanea',
                  excerpt:
                    'La obra de Henrik Ibsen sorprende con una reinterpretación que acerca el clásico a las preocupaciones actuales sobre género y autonomía personal.',
                  source: 'Gabriel Torres',
                  imgUrl: '/placeholder.svg?height=200&width=300',
                  section: 'ESCENA',
                  overline: 'Teatro',
                  published_at: '2025-05-11T09:15:00Z',
                },
                {
                  id: 'cultura-side-2',
                  title:
                    'El escritor local presentó su nuevo libro en una sala colmada',
                  slug: 'escritor-local-presento-nuevo-libro',
                  source: 'Marina Peralta',
                  imgUrl: '/placeholder.svg?height=200&width=300',
                  section: 'LETRAS',
                  overline: 'Literatura',
                  'yt - video': 'https://youtube.com/watch?v=abcdefg12345',
                  published_at: '2025-05-09T18:45:00Z',
                },
                {
                  id: 'cultura-side-3',
                  title:
                    'Jazz en el parque: el ciclo musical que revitaliza los espacios públicos',
                  slug: 'jazz-parque-ciclo-musical-espacios-publicos',
                  excerpt:
                    'Cada fin de semana, músicos locales ofrecen conciertos gratuitos en diferentes plazas de la ciudad, atrayendo a un público diverso.',
                  source: 'Diego Martínez',
                  imgUrl: '/placeholder.svg?height=200&width=300',
                  section: 'MÚSICA',
                  overline: 'Ciclo cultural',
                  published_at: '2025-05-08T16:20:00Z',
                },
              ]}
            />
          </section> */}

          {/* Real Estate Four Column Grid Section */}
          {/*           <section className="py-6 border-t border-gray-200">
            <PropiedadesSection
              categories={[
                { name: 'INMUEBLES COMERCIALES', href: '#' },
                { name: 'CONSTRUCCION Y DISEÑO', href: '#' },
                { name: 'CASAS Y DEPARTAMENTOS', href: '#' },
                { name: 'INVERSIONES', href: '#' },
              ]}
              properties={[
                {
                  id: 'property-1',
                  title: {
                    highlight: 'Mercado inmobiliario',
                    regular:
                      'Cuáles son los barrios de Buenos Aires donde más subieron los precios de los alquileres',
                  },
                  author: 'Mauricio Giambartolomei',
                  imageUrl: '/placeholder.svg?height=200&width=300',
                  badgeText: 'FOTOS Y VIDEO',
                },
                {
                  id: 'property-2',
                  title: {
                    highlight: 'Arquitectura',
                    regular:
                      'Una casa de 100 años totalmente renovada: la transformación que respeta el estilo original',
                  },
                  author: 'Fabián López',
                  imageUrl: '/placeholder.svg?height=200&width=300',
                  badgeText: 'FOTOS',
                },
                {
                  id: 'property-3',
                  title: {
                    highlight: 'Tendencia',
                    regular:
                      'Aumenta la demanda de propiedades en barrios cerrados: los factores que explican el fenómeno',
                  },
                  author: 'María Julieta Rumi',
                  imageUrl: '/placeholder.svg?height=200&width=300',
                },
                {
                  id: 'property-4',
                  title: {
                    highlight: 'Inversiones',
                    regular:
                      'Las zonas con mayor potencial de valorización para comprar propiedades este año',
                  },
                  author: 'Carlos Martínez',
                  imageUrl: '/placeholder.svg?height=200&width=300',
                  summary:
                    'Un análisis de las áreas emergentes que ofrecen las mejores oportunidades para inversores inmobiliarios',
                },
              ]}
            />
          </section> */}

          {/* You May Be Interested In Section */}
          {/*           <YouMayBeInterestedSection
            articles={[
              {
                title:
                  '¿Qué importante cambio rige para obtener la ciudadanía italiana?',
                titleHighlight: 'Trivia',
                imageUrl: '/placeholder.svg?height=200&width=300',
                author: 'Cintia Perazo',
                badge: {
                  text: 'TEST DE INTERÉS GENERAL',
                  position: 'bottom-left',
                },
              },
              {
                title:
                  'Las mejores piscinas naturales del nordeste de Brasil, para nadar entre peces de colores',
                titleHighlight: 'Imperdible',
                imageUrl: '/placeholder.svg?height=200&width=300',
                author: 'Silvina Pini',
              },
              {
                title:
                  'Buscaba un lugar para casarse y encontró un parador en la playa que lo convirtió en cocinero',
                titleHighlight: 'Cambio de vida',
                imageUrl: '/placeholder.svg?height=200&width=300',
                author: 'Ana van Gelderen',
                badge: {
                  text: 'CAMBIO DE VIDA',
                  position: 'bottom-left',
                },
              },
              {
                title:
                  'Te llevamos a ver Dua Lipa, Oasis y Coldplay alrededor del mundo',
                titleHighlight: 'LA NACION World Tour 2025',
                imageUrl: '/placeholder.svg?height=200&width=300',
                badge: {
                  text: 'VIDEO',
                  position: 'bottom-left',
                },
              },
            ]}
          />
         */}
        </div>
      </div>

      {/* DESKTOP VERSION - WITH SidelinesLayout */}
      <div className="hidden xl:block">
        <SidelinesLayout
          leftAd={leftSideAds}
          rightAd={rightSideAds}
          sidelineWidth={sidelineWidth}
        >
          <div className="pt-[100px]">
            <div className="container mx-auto max-w-[1600px] px-4">
              {/* Currency rates */}
              <div className="hidden md:block border-b border-gray-200 overflow-x-auto">
                <DollarRates />
              </div>

              <div className="pt-12 md:pt-0"></div>

              {/* Breaking news ticker */}
              <div className="hidden md:block border-b border-light-gray overflow-x-auto">
                <div className="py-2 flex items-center text-sm space-x-2 whitespace-nowrap">
                  <span className="bg-primary-red text-white px-2 py-0.5 text-xs rounded">
                    EN VIVO
                  </span>
                  <NewsTicker headlines={latestHeadlines} />
                </div>
              </div>
              {/* Main content */}
              <PrincipalSection serverData={principalSectionArticles} />

              <div className="md:hidden">
                <MobileDollarRates />
              </div>

              <NoticiasImportantesSection
                serverData={noticiasImportantesArticles}
              />

              <VolgaTVSection
                featuredVideo={featuredVideo}
                recentVideos={recentVideos}
              />

              <PueblosAlemanesSection serverData={pueblosAlemanesArticles} />

              <FarmaciasDeTurno />

              {/* Weather section */}
              <ClimaSection />

              <HuanguelenSection serverData={huanguelenArticles} />

              <LaSextaSection serverData={laSextaArticles} />

              {/* Advertisement banner */}
              <div className="py-6">
                <div className="bg-gray-100 p-4 text-center">
                  <p className="text-xs text-gray-500 mb-2">AD</p>
                  <div className="h-16 flex items-center justify-center">
                    <p className="text-gray-400">Advertisement Banner</p>
                  </div>
                </div>
              </div>

              {/*           <div className="py-6 flex flex-col md:flex-row gap-8">
            <div className="flex-1 min-w-0">
              <ActualidadSection serverData={actualidadArticles} />
            </div>
            <div className="w-full md:w-80 flex-shrink-0">
              <UltimasNoticiasSection headlines={latestHeadlines} />
            </div>
          </div> */}

              {/* Politics and Economy Section */}
              {/*           <PoliticaYEconomiaSection
            mainArticle={{
              id: 'politics-main-1',
              title: {
                highlight: 'Debate previsional',
                regular:
                  'Números claves que difieren según el lugar del país y que impactan con fuerza',
              },
              summary:
                'El debate sobre el sistema previsional continúa generando controversia mientras los distintos sectores intentan llegar a un acuerdo.',
              author: 'Jorge Fontevecchia',
              imageUrl: '/placeholder.svg?height=400&width=600',
              hasVideo: false,
            }}
            sideArticles={[
              {
                id: 'politics-side-1',
                title: {
                  highlight: 'Fondo monetario',
                  regular:
                    'La Argentina logró consolidar el respaldo del FMI para las próximas etapas del acuerdo',
                },
                author: 'Manuel Adorni',
                imageUrl: '/placeholder.svg?height=200&width=300',
                hasVideo: false,
              },
              {
                id: 'politics-side-2',
                title: {
                  highlight: 'Los desafíos',
                  regular:
                    'Inflación y salarios: la compleja ecuación que el gobierno intenta resolver',
                },
                author: 'Cecilia Boufflet',
                imageUrl: '/placeholder.svg?height=200&width=300',
                hasVideo: false,
              },
              {
                id: 'politics-side-3',
                title: {
                  highlight: 'Análisis',
                  regular:
                    'Las cinco claves para entender el panorama político de cara a las elecciones',
                },
                author: 'Carlos Pagni',
                imageUrl: '/placeholder.svg?height=200&width=300',
                hasVideo: true,
              },
            ]}
          /> */}

              <AdPlaceholder />

              {/* Agro Four Column Grid Section */}
              <section className="py-6 border-t border-gray-200">
                <AgroSection serverData={agroArticles} />
              </section>

              {/* Add Radio Player Showcase */}
              {/* Radio Player Showcase - Full Width */}
              <div className="py-6">
                <RadioPlayerShowcase
                  frequency="99.5"
                  stationName="Radio del Volga"
                  radioLink="https://app.radiodelvolga.com.ar/"
                />
              </div>

              <AdPlaceholder />

              {/* Sports News Section */}
              {/*           <DeportesSection
            mainArticle={{
              title: (
                <>
                  <span className="font-bold">De la mano de "Maravilla".</span>{' '}
                  Con un triplete de Martínez, Racing activó el 'modo copero' y
                  se acercó a los puestos de clasificación
                </>
              ),
              content:
                'El delantero fue la indiscutida figura en el triunfo por 4-1, convirtiendo un triplete tras un año sin marcar de a tres. El equipo de Gustavo Costas volvió a mostrar su mejor versión y se reencuentra con la victoria tras dos partidos sin conseguirla.',
              author: 'Franco Tossi',
              imageUrl: '/placeholder.svg?height=400&width=500',
            }}
            sideArticles={[
              {
                title: (
                  <>
                    <span className="font-bold">Insólito.</span> En la Liga de
                    España, dos compañeros casi terminan a las trompadas en el
                    banco de suplentes
                  </>
                ),
                content:
                  'Durante el partido entre Villarreal y Atlético de Madrid, las cámaras captaron un fuerte cruce entre dos futbolistas del equipo colchonero que estaban en el banco.',
                author: 'Redacción Deportes',
                imageUrl: '/placeholder.svg?height=200&width=250',
                hasVideo: true,
              },
              {
                title: (
                  <>
                    <span className="font-bold">Argentinos, de lujo.</span>{' '}
                    Media hora a toda orquesta, taco, sombrero, golazos... y un
                    agradecimiento a "Chiqui" Tapia
                  </>
                ),
                content:
                  'El equipo de La Paternal desplegó un fútbol de alto nivel durante el primer tiempo y se impuso con autoridad frente a Barracas Central por 3-0, consolidándose en los primeros puestos del torneo.',
                author: 'Germán Wille',
                imageUrl: '/placeholder.svg?height=200&width=250',
                hasVideo: true,
              },
            ]}
          /> */}

              {/* Stories and Characters Section with shadcn */}
              {/*           <HistoriasYRelatosSection
            mainArticle={{
              title: (
                <>
                  <span className="font-bold">"Hola mi vida".</span> Tini
                  Stoessel tuvo un gesto inesperado con un fan que se volvió
                  viral en redes
                </>
              ),
              author: 'Martín Fernández Cruz',
              imageUrl: '/placeholder.svg?height=400&width=400',
            }}
            sideArticles={[
              {
                title: (
                  <>
                    <span className="font-bold">Historias.</span> Es argentino y
                    se animó con un proyecto de US$4 millones a pasos de la
                    cancha de polo
                  </>
                ),
                author: 'Ariel Goldfarb',
                imageUrl: '/placeholder.svg?height=150&width=200',
              },
              {
                title: (
                  <>
                    <span className="font-bold">
                      Prometió volver con un Rosario bendecido en Calcuta.
                    </span>{' '}
                    Vivía lejos y supo que su madre tenía cáncer "Es una locura"
                  </>
                ),
                author: 'Carina Durn',
                imageUrl: '/placeholder.svg?height=150&width=200',
              },
              {
                title: (
                  <>
                    <span className="font-bold">Relatos inspiradores.</span> La
                    historia del joven que dejó la ciudad para convertirse en
                    guía de montaña
                  </>
                ),
                author: 'Federico Wiemeyer',
                imageUrl: '/placeholder.svg?height=150&width=200',
              },
            ]}
          /> */}

              {/* Foodit Section */}
              {/*           <RecetasSection
            logoSrc="/placeholder.svg?height=80&width=150"
            categories={[
              { name: 'MENU', href: '#' },
              { name: 'TIPS Y SECRETOS DE COCINA', href: '#' },
              { name: 'RECETAS FACILES', href: '#' },
            ]}
            mainArticle={{
              titleBold: 'Dulce y crocante.',
              titleRegular:
                'Una tarta invertida con pistachos para decirle adiós a la clásica de jamón y queso',
              content:
                'La dulzura de las cebollas combina de maravilla con el perfume de las hierbas y el toque del fruto seco que está de moda; una receta para un almuerzo diferente y lleno de sabor',
              imageUrl: '/placeholder.svg?height=300&width=400',
              imageAlt: 'Tarta invertida con pistachos',
            }}
          /> */}

              {/* <QuinielaSection /> */}

              {/* Opinion Section */}
              {/*           <OpinionSection
            opinionCards={opinionSectionData.opinionCards}
            featuredOpinion={opinionSectionData.featuredOpinion}
            editorials={opinionSectionData.editorials}
            smallOpinionCard={opinionSectionData.smallOpinionCard}
          /> */}

              {/* Wellness Section */}
              {/*           <BienestarSection
            featuredArticle={wellnessSectionData.featuredArticle}
            smallArticles={wellnessSectionData.smallArticles}
          /> */}

              {/* World Section (formerly Farming Section) */}
              {/*           <MundoSection
            mainArticle={farmingSectionData.mainArticle}
            sideArticles={farmingSectionData.sideArticles}
          /> */}

              {/*           <IActualidad
            logo={{
              src: '/images/iactualidad-logo.png',
              alt: 'iActualidad Logo',
            }}
            categories={[
              { name: 'INTELIGENCIA ARTIFICIAL', href: '#' },
              { name: 'BITCOIN', href: '#' },
              { name: 'CRIPTOMONEDAS', href: '#' },
              { name: 'ROBOTICA', href: '#' },
            ]}
            mainArticle={{
              title:
                'Bitcoin alcanza nuevo máximo histórico superando los 80.000 dólares',
              content:
                'La criptomoneda más popular del mundo continúa su tendencia alcista impulsada por la creciente adopción institucional y la reciente aprobación de ETFs por la SEC.',
              author: 'Carlos Rodríguez',
              imageUrl: '/placeholder.svg?height=400&width=600',
            }}
            sideArticles={[
              {
                title: 'La inflación de abril fue del 8,8%, según el INDEC',
                subtitle:
                  'Es el dato mensual más bajo desde febrero del año pasado. Igualmente, el acumulado de los últimos 12 meses alcanza el 289,4%.',
                author: 'María López',
                imageUrl: '/placeholder.svg?height=150&width=150',
              },
              {
                title:
                  'Presentan un proyecto de ley para modernizar el sistema financiero',
                subtitle:
                  'La iniciativa busca impulsar la inversión y facilitar el acceso al crédito para pequeñas y medianas empresas.',
                author: 'Juan Pérez',
                imageUrl: '/placeholder.svg?height=150&width=150',
              },
            ]}
          /> */}

              {/* Tech Section */}
              {/*           <section className="py-6 border-t border-gray-200">
            <TechSection articles={techSectionData.articles} />
          </section> */}

              {/*           <section className="py-6 border-t border-gray-200">
            <CienciaYSaludSection
              sectionTitle="CIENCIA Y SALUD"
              logo={{
                src: '/images/ciencia-salud-logo.png',
                alt: 'Ciencia y Salud',
              }}
              mainArticle={lifestyleFeatureData.mainArticle}
              smallArticles={lifestyleFeatureData.smallArticles}
            />
          </section> */}

              {/* Hashtag Section */}
              {/*           <section className="py-6 border-t border-gray-200">
            <TendenciasSection
              hashtagName={hashtagSectionData.hashtagName}
              featuredItem={hashtagSectionData.featuredItem}
              contentCards={hashtagSectionData.contentCards}
            />
          </section> */}

              {/* Top Reads Section */}
              {/*           <section className="py-6 border-t border-gray-200">
            <TopReads articles={topReadsData.articles} />
          </section> */}

              {/* Business Main Feature Section */}
              {/*           <NegociosSection
            logo={{
              src: '/images/business-logo.png',
              alt: 'Business Section Logo',
            }}
            categories={[
              { name: 'PROPIEDADES', href: '#' },
              { name: 'EMPRENDEDORES', href: '#' },
              { name: 'PYMES', href: '#' },
              { name: 'CAMPO', href: '#' },
              { name: 'INDICES', href: '#' },
              { name: 'DOLAR HOY', href: '#' },
            ]}
            mainArticle={{
              id: 'business-main-1',
              title: {
                highlight: 'Inversiones',
                regular:
                  'Las acciones argentinas registran su mejor semana del año con subas de hasta 15%',
              },
              summary:
                'El mercado financiero local mostró un fuerte repunte impulsado por el anuncio de nuevas medidas económicas y la mejora en las perspectivas de inversión extranjera.',
              author: 'Carlos Martínez',
              imageUrl: '/placeholder.svg?height=400&width=600',
              hasVideo: false,
            }}
            sideArticles={[
              {
                id: 'business-side-1',
                title: {
                  highlight: 'Tecnología',
                  regular:
                    'La startup argentina que revoluciona el sector fintech recibió inversión millonaria',
                },
                author: 'Laura González',
                imageUrl: '/placeholder.svg?height=200&width=300',
                hasVideo: false,
              },
              {
                id: 'business-side-2',
                title: {
                  highlight: 'Comercio exterior',
                  regular:
                    'Crecen las exportaciones de servicios basados en conocimiento',
                },
                author: 'Martín Rodríguez',
                imageUrl: '/placeholder.svg?height=200&width=300',
                hasVideo: true,
              },
              {
                id: 'business-side-3',
                title: {
                  highlight: 'Análisis',
                  regular:
                    'Los sectores que más empleo generaron en el último trimestre',
                },
                author: 'Julia Fernández',
                imageUrl: '/placeholder.svg?height=200&width=300',
                hasVideo: false,
              },
            ]}
          /> */}

              {/* Entertainment Main Feature Section */}
              {/*           <section className="py-6 border-t border-gray-200">
            <EspectaculosSection
              mainFeature={entertainmentMainFeatureData.mainFeature}
              secondaryFeatures={entertainmentMainFeatureData.secondaryFeatures}
            />
          </section> */}

              {/* Lifestyle Section */}
              {/*           <section className="py-6 border-t border-gray-200">
            <LifestyleSection serverData={lifestyleArticles}

            />
          </section> */}

              {/* Cultura Section */}
              {/*           <section className="py-6 border-t border-gray-200">
            <CulturaSection
              mainArticle={{
                id: 'cultura-main',
                title:
                  'Arte contemporáneo llega al museo municipal con exposición internacional',
                slug: 'arte-contemporaneo-exposicion-internacional-museo',
                excerpt:
                  'Con más de 50 obras de artistas locales e internacionales, la muestra explora la relación entre la percepción humana y las nuevas tecnologías digitales, creando experiencias inmersivas.',
                source: 'Lucía Méndez',
                imgUrl: '/placeholder.svg?height=400&width=600',
                section: 'EXPOSICIÓN',
                overline: 'Arte contemporáneo',
                published_at: '2025-05-10T14:30:00Z',
              }}
              sideArticles={[
                {
                  id: 'cultura-side-1',
                  title:
                    'Vuelve "Casa de muñecas" con un elenco renovado y una visión contemporánea',
                  slug: 'casa-de-munecas-elenco-renovado-vision-contemporanea',
                  excerpt:
                    'La obra de Henrik Ibsen sorprende con una reinterpretación que acerca el clásico a las preocupaciones actuales sobre género y autonomía personal.',
                  source: 'Gabriel Torres',
                  imgUrl: '/placeholder.svg?height=200&width=300',
                  section: 'ESCENA',
                  overline: 'Teatro',
                  published_at: '2025-05-11T09:15:00Z',
                },
                {
                  id: 'cultura-side-2',
                  title:
                    'El escritor local presentó su nuevo libro en una sala colmada',
                  slug: 'escritor-local-presento-nuevo-libro',
                  source: 'Marina Peralta',
                  imgUrl: '/placeholder.svg?height=200&width=300',
                  section: 'LETRAS',
                  overline: 'Literatura',
                  'yt - video': 'https://youtube.com/watch?v=abcdefg12345',
                  published_at: '2025-05-09T18:45:00Z',
                },
                {
                  id: 'cultura-side-3',
                  title:
                    'Jazz en el parque: el ciclo musical que revitaliza los espacios públicos',
                  slug: 'jazz-parque-ciclo-musical-espacios-publicos',
                  excerpt:
                    'Cada fin de semana, músicos locales ofrecen conciertos gratuitos en diferentes plazas de la ciudad, atrayendo a un público diverso.',
                  source: 'Diego Martínez',
                  imgUrl: '/placeholder.svg?height=200&width=300',
                  section: 'MÚSICA',
                  overline: 'Ciclo cultural',
                  published_at: '2025-05-08T16:20:00Z',
                },
              ]}
            />
          </section> */}

              {/* Real Estate Four Column Grid Section */}
              {/*           <section className="py-6 border-t border-gray-200">
            <PropiedadesSection
              categories={[
                { name: 'INMUEBLES COMERCIALES', href: '#' },
                { name: 'CONSTRUCCION Y DISEÑO', href: '#' },
                { name: 'CASAS Y DEPARTAMENTOS', href: '#' },
                { name: 'INVERSIONES', href: '#' },
              ]}
              properties={[
                {
                  id: 'property-1',
                  title: {
                    highlight: 'Mercado inmobiliario',
                    regular:
                      'Cuáles son los barrios de Buenos Aires donde más subieron los precios de los alquileres',
                  },
                  author: 'Mauricio Giambartolomei',
                  imageUrl: '/placeholder.svg?height=200&width=300',
                  badgeText: 'FOTOS Y VIDEO',
                },
                {
                  id: 'property-2',
                  title: {
                    highlight: 'Arquitectura',
                    regular:
                      'Una casa de 100 años totalmente renovada: la transformación que respeta el estilo original',
                  },
                  author: 'Fabián López',
                  imageUrl: '/placeholder.svg?height=200&width=300',
                  badgeText: 'FOTOS',
                },
                {
                  id: 'property-3',
                  title: {
                    highlight: 'Tendencia',
                    regular:
                      'Aumenta la demanda de propiedades en barrios cerrados: los factores que explican el fenómeno',
                  },
                  author: 'María Julieta Rumi',
                  imageUrl: '/placeholder.svg?height=200&width=300',
                },
                {
                  id: 'property-4',
                  title: {
                    highlight: 'Inversiones',
                    regular:
                      'Las zonas con mayor potencial de valorización para comprar propiedades este año',
                  },
                  author: 'Carlos Martínez',
                  imageUrl: '/placeholder.svg?height=200&width=300',
                  summary:
                    'Un análisis de las áreas emergentes que ofrecen las mejores oportunidades para inversores inmobiliarios',
                },
              ]}
            />
          </section> */}

              {/* You May Be Interested In Section */}
              {/*           <YouMayBeInterestedSection
            articles={[
              {
                title:
                  '¿Qué importante cambio rige para obtener la ciudadanía italiana?',
                titleHighlight: 'Trivia',
                imageUrl: '/placeholder.svg?height=200&width=300',
                author: 'Cintia Perazo',
                badge: {
                  text: 'TEST DE INTERÉS GENERAL',
                  position: 'bottom-left',
                },
              },
              {
                title:
                  'Las mejores piscinas naturales del nordeste de Brasil, para nadar entre peces de colores',
                titleHighlight: 'Imperdible',
                imageUrl: '/placeholder.svg?height=200&width=300',
                author: 'Silvina Pini',
              },
              {
                title:
                  'Buscaba un lugar para casarse y encontró un parador en la playa que lo convirtió en cocinero',
                titleHighlight: 'Cambio de vida',
                imageUrl: '/placeholder.svg?height=200&width=300',
                author: 'Ana van Gelderen',
                badge: {
                  text: 'CAMBIO DE VIDA',
                  position: 'bottom-left',
                },
              },
              {
                title:
                  'Te llevamos a ver Dua Lipa, Oasis y Coldplay alrededor del mundo',
                titleHighlight: 'LA NACION World Tour 2025',
                imageUrl: '/placeholder.svg?height=200&width=300',
                badge: {
                  text: 'VIDEO',
                  position: 'bottom-left',
                },
              },
            ]}
          />
         */}
            </div>
          </div>
        </SidelinesLayout>
      </div>

      <MobileNavBar />
    </>
  )
}
