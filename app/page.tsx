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
import Header from '@/components/Header'
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

  const videos = await fetchLatestVideos(5)
  const featuredVideo = videos[0]
  const recentVideos = videos.slice(1)

  const actualidadArticles = await fetchSectionArticles('ActualidadSection')
  const latestHeadlines = await fetchLatestHeadlines()

  // Other section data...

  // Sample data for FeaturedSection
  const featuredArticle = {
    title:
      'Los mercados en alerta: el impacto de la última decisión del Banco Central',
    timestamp: 'Hace 2 horas',
  }

  const recommendations = [
    {
      title: 'Suscripción Digital',
      description:
        'Accede a todo el contenido exclusivo de LA NACION por un precio especial',
    },
    {
      title: 'Club LA NACION',
      description:
        'Descuentos exclusivos para suscriptores en restaurantes, entretenimiento y más',
    },
  ]

  // Sample data for OpinionSection
  const opinionSectionData = {
    opinionCards: [
      {
        author: 'Carlos Pagni',
        title: 'El dilema de Milei: economía o geopolítica',
        avatarUrl: '/placeholder.svg?height=60&width=60',
      },
      {
        author: 'Jorge Fernández Díaz',
        title: 'La democracia frente al espejo: los desafíos del consenso',
        avatarUrl: '/placeholder.svg?height=60&width=60',
      },
      {
        author: 'Beatriz Sarlo',
        title: 'El valor de la cultura en tiempos de crisis',
        avatarUrl: '/placeholder.svg?height=60&width=60',
      },
      {
        author: 'Joaquín Morales Solá',
        title: 'Entre la soberanía y la integración: el desafío argentino',
        avatarUrl: '/placeholder.svg?height=60&width=60',
      },
    ],
    featuredOpinion: {
      author: 'Fernando Savater',
      title: 'La libertad como valor esencial: más allá de las ideologías',
      imageUrl: '/placeholder.svg?height=250&width=400',
      excerpt:
        'En un mundo cada vez más polarizado, la defensa de la libertad individual se vuelve un imperativo ético que trasciende las divisiones partidarias.',
    },
    editorials: [
      { title: 'La inflación y el desafío de la estabilización económica' },
      { title: 'Educación: el mejor camino hacia el desarrollo' },
      { title: 'Seguridad ciudadana: un derecho fundamental' },
      { title: 'La calidad institucional como pilar democrático' },
    ],
    smallOpinionCard: {
      author: 'Marcos Novaro',
      title: 'Crisis y oportunidad: repensar el rol del Estado en la economía',
    },
  }

  // Sample data for WellnessSection
  const wellnessSectionData = {
    featuredArticle: {
      title:
        'Hábitos saludables: cómo incorporar más movimiento a tu rutina diaria sin ir al gimnasio',
      subtitle:
        'Pequeños cambios que pueden marcar una gran diferencia en tu bienestar físico y mental',
      author: 'Carolina Martínez',
      imageUrl: '/placeholder.svg?height=340&width=600',
      excerpt:
        'Expertos en salud coinciden en que no es necesario pasar horas en el gimnasio para mantenerse activo. Actividades cotidianas bien planificadas pueden tener un impacto significativo.',
    },
    smallArticles: [
      {
        title:
          'Cinco alimentos que protegen tu sistema inmunológico durante el cambio de estación',
        author: 'Martín Giménez',
        imageUrl: '/placeholder.svg?height=200&width=300',
      },
      {
        title:
          'Mindfulness: técnicas para integrar la atención plena en momentos de estrés laboral',
        author: 'Laura Fernández',
        imageUrl: '/placeholder.svg?height=200&width=300',
      },
    ],
  }

  // Sample data for FarmingSection
  const farmingSectionData = {
    mainArticle: {
      title:
        'El desafío de la biotecnología agrícola: cómo el cambio climático transforma los cultivos en Argentina',
      subtitle:
        'Nuevas tecnologías genéticas permiten desarrollar variedades resistentes a la sequía y altas temperaturas, fundamentales en un contexto de calentamiento global',
      author: 'Fernando Bertello',
      imageUrl: '/placeholder.svg?height=400&width=600',
    },
    sideArticles: [
      {
        title:
          'Leche: se elevó el precio mínimo obligatorio en plena polémica por las importaciones',
        author: 'Mariano Wainfeld',
        imageUrl: '/placeholder.svg?height=150&width=200',
      },
      {
        title:
          'La maquinaria agrícola muestra señales de recuperación tras un año complejo',
        subtitle:
          'Proyectan un aumento del 15% en las ventas para el tercer trimestre',
        imageUrl: '/placeholder.svg?height=150&width=200',
      },
      {
        title:
          'Drones en el campo: cómo la tecnología aérea revoluciona el monitoreo de cultivos',
        author: 'María Fernanda López',
        imageUrl: '/placeholder.svg?height=150&width=200',
      },
    ],
  }

  // Sample data for LifestyleFeature
  const lifestyleFeatureData = {
    sectionTitle: 'CIENCIA Y SALUD',
    mainArticle: {
      titleHighlight: 'Avance científico',
      titleRegular:
        'Descubren un mecanismo cerebral que podría revolucionar el tratamiento de la enfermedad de Alzheimer',
      subtitle:
        'Investigadores del CONICET lograron identificar una proteína clave en el desarrollo de la enfermedad neurodegenerativa que afecta a millones de personas en todo el mundo',
      imageUrl: '/placeholder.svg?height=500&width=900',
    },
    smallArticles: [
      {
        titleHighlight: 'Estudio inédito',
        titleRegular:
          'La actividad física regular podría prevenir hasta el 20% de los casos de depresión',
        imageUrl: '/placeholder.svg?height=100&width=150',
      },
      {
        titleHighlight: 'Nutrición',
        titleRegular:
          'Los cinco alimentos que potencian la función cognitiva según nuevas investigaciones',
        imageUrl: '/placeholder.svg?height=100&width=150',
      },
      {
        titleHighlight: 'Tecnología médica',
        titleRegular:
          'El nuevo dispositivo que permite detectar enfermedades cardíacas en etapas tempranas',
        imageUrl: '/placeholder.svg?height=100&width=150',
      },
    ],
  }

  // Sample data for TechSection
  const techSectionData = {
    articles: [
      {
        titleHighlight: 'Inteligencia artificial',
        titleRegular:
          'El ChatGPT argentino: cómo funciona el asistente que está entrenado con datos locales',
        imageUrl: '/placeholder.svg?height=300&width=400',
      },
      {
        titleHighlight: 'Innovación',
        titleRegular:
          'Apple presentó su nueva línea de iPads con mejoras significativas en rendimiento y pantalla',
        imageUrl: '/placeholder.svg?height=300&width=400',
      },
      {
        titleHighlight: 'Ciberseguridad',
        titleRegular:
          'Alertan sobre una nueva modalidad de estafa digital que afecta a usuarios de homebanking',
        imageUrl: '/placeholder.svg?height=300&width=400',
      },
    ],
  }

  // Sample data for HashtagSection
  const hashtagSectionData = {
    hashtagName: 'virales',
    featuredItem: {
      imageUrl: '/placeholder.svg?height=400&width=400',
      title: 'El fenómeno de la semana',
      description:
        'Las conversaciones que marcaron agenda en redes sociales y los temas más comentados por los usuarios',
    },
    contentCards: [
      {
        imageUrl: '/placeholder.svg?height=200&width=300',
        highlightedText: 'Virales.',
        regularText: 'Los 5 videos que todos compartieron esta semana',
      },
      {
        imageUrl: '/placeholder.svg?height=200&width=300',
        highlightedText: 'Debate.',
        regularText: '¿Es correcto publicar fotos de tus hijos en redes?',
      },
      {
        imageUrl: '/placeholder.svg?height=200&width=300',
        highlightedText: 'Fenómeno.',
        regularText: 'Por qué todos hablan de este nuevo challenge',
      },
      {
        imageUrl: '/placeholder.svg?height=200&width=300',
        highlightedText: 'Polémica.',
        regularText:
          'El tuit que generó controversia en el mundo del espectáculo',
      },
      {
        imageUrl: '/placeholder.svg?height=200&width=300',
        highlightedText: 'Innovación.',
        regularText: 'La nueva función de Instagram que cambia todo',
      },
      {
        imageUrl: '/placeholder.svg?height=200&width=300',
        highlightedText: 'Tendencia.',
        regularText: 'El hashtag que se convirtió en movimiento social',
      },
    ],
  }

  // Sample data for TopReads
  const topReadsData = {
    articles: [
      {
        id: 1,
        title:
          'El dólar blue superó los $1300 y alcanzó un nuevo récord histórico en medio de la incertidumbre económica',
        summary:
          'El dólar paralelo sigue su tendencia alcista mientras los mercados aguardan nuevas medidas económicas del gobierno',
        imageUrl: '/placeholder.svg?height=100&width=150',
      },
      {
        id: 2,
        title:
          'La Corte Suprema decidirá esta semana sobre la validez del DNU de Milei que modificó más de 300 leyes',
        summary:
          'La decisión podría tener un impacto significativo en las reformas impulsadas por el gobierno',
      },
      {
        id: 3,
        title:
          'Alerta meteorológica: anuncian tormentas fuertes con posible caída de granizo en Buenos Aires y otras provincias',
        summary:
          'El Servicio Meteorológico Nacional emitió un comunicado especial advirtiendo sobre condiciones climáticas adversas',
        imageUrl: '/placeholder.svg?height=100&width=150',
      },
      {
        id: 4,
        title:
          'Furia se convirtió en la nueva eliminada del reality y estalló la polémica en las redes sociales',
        summary:
          'La participante más controvertida abandonó la casa tras una reñida votación que sorprendió a los seguidores del programa',
      },
      {
        id: 5,
        title:
          'Dengue: confirman más de 50.000 casos en el país y expertos advierten que podría extenderse hasta mayo',
        summary:
          'Las autoridades sanitarias recomiendan extremar las medidas de prevención ante el aumento de casos',
        imageUrl: '/placeholder.svg?height=100&width=150',
      },
    ],
  }

  // Sample data for FeaturedSportsNote
  const featuredSportsNoteData = {
    quoteText: 'El Dibu habla de todo',
    headlineText:
      'Emiliano Martínez reveló cómo maneja la presión en los penales y explicó su ritual antes de cada partido',
    caption:
      'El arquero de la selección argentina contó detalles de su preparación mental y física en una entrevista exclusiva',
    imageUrl: '/placeholder.svg?height=340&width=600',
    hasVideo: true,
  }

  // Sample data for BusinessMainFeature
  const businessMainFeatureData = {
    mainArticle: {
      titleBold: 'Emprendimientos que crecen',
      titleRegular:
        'La startup argentina que desarrolló una plataforma de IA y fue adquirida por una multinacional',
      caption:
        'Crearon un software que optimiza procesos en empresas de logística y ahora expanden su tecnología a nivel global',
      imageUrl: '/placeholder.svg?height=400&width=600',
      author: 'Martín Bidegaray',
    },
    sideArticles: [
      {
        titleBold: 'Empresas en movimiento',
        titleRegular:
          'Mercado Libre duplicará su capacidad logística con un nuevo centro en Córdoba',
        imageUrl: '/placeholder.svg?height=75&width=100',
        author: 'Pablo Fernández Blanco',
      },
      {
        titleBold: 'Análisis financiero',
        titleRegular:
          'Las acciones tecnológicas que mejor resistieron la caída global de los mercados',
        imageUrl: '/placeholder.svg?height=75&width=100',
      },
      {
        titleBold: 'Oportunidades',
        titleRegular:
          'Cinco sectores que continuarán contratando personal a pesar de la recesión económica',
        imageUrl: '/placeholder.svg?height=75&width=100',
        author: 'Carlos Manzoni',
      },
      {
        titleBold: 'Tendencias',
        titleRegular:
          'El boom de las fintech en Argentina: facturan US$12 millones y emplean a más de 15.000 personas',
        imageUrl: '/placeholder.svg?height=75&width=100',
      },
    ],
  }

  // Sample data for EntertainmentMainFeature
  const entertainmentMainFeatureData = {
    mainFeature: {
      quoteText: 'Nunca me consideré un gran actor',
      titleText:
        'Ricardo Darín reflexiona sobre su carrera y revela detalles de su próximo proyecto con Netflix',
      subheading:
        'El popular actor argentino habla sobre sus inicios, el peso de la fama y cómo elige sus proyectos en una era dominada por las plataformas de streaming',
      author: {
        name: 'Pablo Mascareño',
        avatarUrl: '/placeholder.svg?height=30&width=30',
      },
      imageUrl: '/placeholder.svg?height=700&width=500',
    },
    secondaryFeatures: [
      {
        titleBold: 'Premio Oscar',
        titleRegular:
          'Los secretos detrás de la próxima película argentina que aspira a la estatuilla dorada',
        imageUrl: '/placeholder.svg?height=75&width=100',
        author: 'Marcela Leonardi',
      },
      {
        titleBold: 'Fenómeno',
        titleRegular:
          'El regreso de Soda Stereo: anuncian nuevo material inédito y sorprenden a los fans',
        imageUrl: '/placeholder.svg?height=75&width=100',
      },
    ],
    adData: {
      title: 'Test de daltonismo',
      description:
        '¿Podés ver el número oculto en esta imagen? Descubre cómo está tu visión cromática',
      imageUrl: '/placeholder.svg?height=200&width=200',
    },
  }

  // Sample data for LifestyleFourColumnGrid
  const lifestyleFourColumnGridData = {
    sectionTitle: 'TIPS Y CONSEJOS',
    articles: [
      {
        titleHighlight: 'Beneficios inesperados',
        titleRegular:
          'Cinco razones por las que deberías incorporar limón a tu agua todos los días',
        imageUrl: '/placeholder.svg?height=200&width=300',
        author: 'Daniela Chueke',
        source: 'Clarín/Argentina',
      },
      {
        titleHighlight: 'Tecnología del hogar',
        titleRegular:
          'Cómo convertir tu casa en un espacio inteligente sin gastar una fortuna',
        imageUrl: '/placeholder.svg?height=200&width=300',
        author: 'Santiago Martínez',
      },
      {
        titleHighlight: 'Conexión natural',
        titleRegular:
          'La técnica japonesa que reduce el estrés en solo 15 minutos al día y puedes practicar en cualquier lugar',
        imageUrl: '/placeholder.svg?height=200&width=300',
        source: 'El Tiempo/Colombia',
      },
    ],
    adContent: {
      price: 'Ar$ 34.025,20',
      imageUrl: '/placeholder.svg?height=180&width=180',
      ctaText: 'Generar',
    },
  }

  // Sample data for RealEstateFourColumnGrid
  const realEstateFourColumnGridData = {
    properties: [
      {
        titleHighlight: 'Mercado inmobiliario',
        titleRegular:
          'Cuáles son los barrios de Buenos Aires donde más subieron los precios de los alquileres',
        imageUrl: '/placeholder.svg?height=200&width=300',
        author: 'Mauricio Giambartolomei',
        badgeText: 'FOTOS Y VIDEO',
      },
      {
        titleHighlight: 'Arquitectura',
        titleRegular:
          'Una casa de 100 años totalmente renovada: la transformación que respeta el estilo original',
        imageUrl: '/placeholder.svg?height=200&width=300',
        author: 'Fabián López',
        badgeText: 'FOTOS',
      },
      {
        titleHighlight: 'Tendencia',
        titleRegular:
          'Aumenta la demanda de propiedades en barrios cerrados: los factores que explican el fenómeno',
        imageUrl: '/placeholder.svg?height=200&width=300',
        author: 'María Julieta Rumi',
      },
    ],
    adContent: {
      price: 'Ar$ 34.025,20',
      imageUrl: '/placeholder.svg?height=180&width=180',
      ctaText: 'Generar',
    },
  }

  // Sample data for AgroFourColumnGrid
  const agroFourColumnGridData = {
    articles: [
      {
        titleHighlight: 'Clima',
        titleRegular:
          'Las zonas afectadas por las lluvias excesivas y cómo impacta en la cosecha de maíz y soja',
        imageUrl: '/placeholder.svg?height=200&width=300',
        author: 'Fernando Bertello',
      },
      {
        titleHighlight: 'Exportaciones',
        titleRegular:
          'El agro generó US$33.000 millones en 2024 y se convirtió en el principal sector exportador del país',
        imageUrl: '/placeholder.svg?height=200&width=300',
        author: 'Belkis Martínez',
      },
      {
        titleHighlight: 'Innovación',
        titleRegular:
          'La tecnología que reduce un 30% el uso de agua en cultivos y revoluciona el riego por goteo',
        imageUrl: '/placeholder.svg?height=200&width=300',
        author: 'José Luis Brea',
      },
    ],
    adContent: {
      price: 'Ar$ 34.025,20',
      imageUrl: '/placeholder.svg?height=180&width=180',
      ctaText: 'Generar',
    },
  }

  // Sample data for LifestyleSection
  const lifestyleSectionData = {
    sectionTitle: 'ESTILO DE VIDA',
    mainArticle: {
      title: 'Vivir conscientemente: el arte de disfrutar el momento presente',
      subtitle:
        'Frente a un mundo hiperconectado y acelerado, cada vez más personas buscan formas de desacelerar y conectar con su entorno de manera más plena',
      author: 'Martina Canavesi',
      imageUrl: '/placeholder.svg?height=600&width=400',
    },
    storyCards: [
      {
        title:
          'Yoga para principiantes: cinco posturas fáciles para incorporar a tu rutina diaria',
        subtitle:
          'Estas asanas básicas te ayudarán a ganar flexibilidad y reducir el estrés sin necesidad de experiencia previa',
        author: 'Laura Giménez',
        imageUrl: '/placeholder.svg?height=150&width=200',
        hasFeaturedBadge: true,
      },
      {
        title:
          'Decoración minimalista: cómo lograr espacios armoniosos con menos elementos',
        subtitle:
          'El minimalismo no se trata solo de tener menos cosas, sino de elegir con propósito cada objeto que habita tu hogar',
        author: 'Carlos Martínez',
        imageUrl: '/placeholder.svg?height=150&width=200',
      },
      {
        title:
          'La revolución del slow fashion: marcas argentinas que apuestan por la moda sostenible',
        subtitle:
          'Conocé las propuestas locales que están cambiando la forma de producir y consumir ropa',
        author: 'Julieta Rossi',
        imageUrl: '/placeholder.svg?height=150&width=200',
      },
      {
        title:
          'Alimentación intuitiva: por qué los nutricionistas recomiendan escuchar a tu cuerpo',
        subtitle:
          'Este enfoque propone dejar de lado las dietas restrictivas y aprender a identificar las señales naturales de hambre y saciedad',
        author: 'Federico Sánchez',
        imageUrl: '/placeholder.svg?height=150&width=200',
      },
    ],
  }

  // Define custom ads for sidelines (optional)
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
    <SidelinesLayout leftAd={leftSideAds} rightAd={rightSideAds}>
      {/* Top bar moved above the header */}
      <div className="bg-gray-100 px-4 py-1 flex items-center text-sm overflow-x-auto whitespace-nowrap">
        <div className="flex items-center space-x-4">
          <span>Coronel Suárez</span>
          <div className="flex items-center">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 mr-1"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            <span>18.1°</span>
          </div>
        </div>
        <div className="flex items-center space-x-4 ml-4">
          <Link href="#" className="hover:text-blue-800 flex items-center">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 mr-1"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle cx="12" cy="12" r="5" fill="currentColor" />
            </svg>
            EN VIVO
          </Link>
          <Link href="#" className="hover:text-blue-800">
            COCINA
          </Link>
          <Link href="#" className="hover:text-blue-800">
            LIFESTYLE
          </Link>
          <Link href="#" className="hover:text-blue-800">
            AGRO
          </Link>
          <Link href="#" className="hover:text-blue-800">
            99.5 + MÚSICA
          </Link>
        </div>
      </div>

      {/* Header moved below top bar */}
      <Header />

      {/* Content with padding - updated value to accommodate both top bar and header */}
      <div className="pt-[calc(1.5rem+100px)]">
        {/* Currency rates */}
        <div className="border-b border-gray-200 overflow-x-auto">
          <div className="container mx-auto px-4 py-2 flex items-center text-sm space-x-4 whitespace-nowrap">
            <span>
              Dólar oficial <strong>$1095,50</strong>
            </span>
            <span>
              Dólar blue <strong>$1310,00</strong>
            </span>
            <span>
              Dólar tarjeta <strong>$1424,15</strong>
            </span>
            <span>
              Dólar CCL <strong>$1337,00</strong>
            </span>
            <span>
              Dólar MEP <strong>$1335,86</strong>
            </span>
            <div className="flex-1"></div>
            <Link href="#" className="text-gray-700 hover:text-blue-800">
              Juegos
            </Link>
            <Link href="#" className="text-gray-700 hover:text-blue-800">
              Suscriptores
            </Link>
            <Link href="#" className="text-gray-700 hover:text-blue-800">
              Newsletters
            </Link>
          </div>
        </div>

        {/* Breaking news ticker */}
        <div className="border-b border-light-gray overflow-x-auto">
          <div className="container mx-auto px-4 py-2 flex items-center text-sm space-x-2 whitespace-nowrap">
            <span className="bg-primary-red text-white px-2 py-0.5 text-xs rounded">
              EN VIVO
            </span>
            <span className="font-bold">Medidas de Milei</span>
            <span className="text-neutral-gray">Hace 22 min</span>
            <span className="mx-2">•</span>
            <span className="font-bold">
              Derrumbe de las bolsas en Asia y Europa
            </span>
            <span className="text-neutral-gray">Hace 3 min</span>
            <span className="mx-2">•</span>
            <span className="font-bold">Dólar hoy</span>
            <span className="text-neutral-gray">Hace 4 min</span>
            <div className="flex-1"></div>
            <Link href="#" className="text-dark-gray hover:text-primary-red">
              Javier Milei
            </Link>
            <Link href="#" className="text-dark-gray hover:text-primary-red">
              Dólar hoy
            </Link>
            <Link href="#" className="text-dark-gray hover:text-primary-red">
              Corte Suprema
            </Link>
            <Link href="#" className="text-dark-gray hover:text-primary-red">
              Fútbol argentino
            </Link>
          </div>
        </div>
        {/* Main content */}
        <PrincipalSection serverData={principalSectionArticles} />

        <NoticiasImportantesSection serverData={noticiasImportantesArticles} />

        {/* Weather section */}
        <ClimaSection />

        <PueblosAlemanesSection serverData={pueblosAlemanesArticles} />

        <FarmaciasDeTurno />

        <VolgaTVSection
          featuredVideo={featuredVideo}
          recentVideos={recentVideos}
        />

        <HuanguelenSection serverData={huanguelenArticles} />

        <LaSextaSection serverData={laSextaArticles} />

        {/* Advertisement banner */}
        <div className="container mx-auto px-4 py-6">
          <div className="bg-gray-100 p-4 text-center">
            <p className="text-xs text-gray-500 mb-2">AD</p>
            <div className="h-16 flex items-center justify-center">
              <p className="text-gray-400">Advertisement Banner</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <ActualidadSection serverData={actualidadArticles} />
          </div>
          <div className="w-full md:w-80 flex-shrink-0">
            <UltimasNoticiasSection headlines={latestHeadlines} />
          </div>
        </div>

        {/* Add MediaCarousel Section */}
        <section className="container mx-auto px-4 py-6 border-t border-gray-200">
          <MediaCarousel
            title="VOLGA TV"
            items={[
              {
                id: '1',
                title:
                  "Entrevista exclusiva: 'La tecnología cambiará el periodismo para siempre'",
                imageUrl:
                  '/placeholder.svg?height=220&width=320&text=Interview',
                badgeText: 'ENTREVISTAS',
                duration: '5:42',
                videoUrl: '#',
              },
              {
                id: '2',
                title: 'La historia detrás del éxito del equipo nacional',
                imageUrl: '/placeholder.svg?height=220&width=320&text=Sports',
                badgeText: 'DEPORTES',
                duration: '7:18',
                videoUrl: '#',
              },
              {
                id: '3',
                title:
                  'Nuevas tendencias en la gastronomía local: sabores que sorprenden',
                imageUrl: '/placeholder.svg?height=220&width=320&text=Food',
                badgeText: 'LIFESTYLE',
                duration: '4:30',
                videoUrl: '#',
              },
              {
                id: '4',
                title: 'Análisis político: ¿Qué esperar en los próximos meses?',
                imageUrl: '/placeholder.svg?height=220&width=320&text=Politics',
                badgeText: 'POLÍTICA',
                duration: '8:05',
                videoUrl: '#',
              },
              {
                id: '5',
                title: 'Avances tecnológicos que cambiarán nuestra vida diaria',
                imageUrl: '/placeholder.svg?height=220&width=320&text=Tech',
                badgeText: 'TECNOLOGÍA',
                duration: '6:15',
                videoUrl: '#',
              },
            ]}
          />
        </section>

        {/* Politics and Economy Section */}
        <PoliticaYEconomiaSection
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
        />

        <AdPlaceholder />

        {/* Agro Four Column Grid Section */}
        <section className="container mx-auto px-4 py-6 border-t border-gray-200">
          <AgroSection
            categories={[
              { name: 'REGIONALES', href: '#' },
              { name: 'TECNOLOGÍAS', href: '#' },
              { name: 'GANADERÍA', href: '#' },
              { name: 'AGRICULTURA', href: '#' },
              { name: 'REMATES', href: '#' },
            ]}
            articles={[
              {
                id: 'agro-1',
                title: {
                  highlight: 'Clima',
                  regular:
                    'Las zonas afectadas por las lluvias excesivas y cómo impacta en la cosecha de maíz y soja',
                },
                author: 'Fernando Bertello',
                imageUrl: '/placeholder.svg?height=200&width=300',
              },
              {
                id: 'agro-2',
                title: {
                  highlight: 'Exportaciones',
                  regular:
                    'El agro generó US$33.000 millones en 2024 y se convirtió en el principal sector exportador del país',
                },
                author: 'Belkis Martínez',
                imageUrl: '/placeholder.svg?height=200&width=300',
                summary:
                  'Las ventas al exterior de productos agropecuarios superaron las expectativas del gobierno y del sector privado',
              },
              {
                id: 'agro-3',
                title: {
                  highlight: 'Innovación',
                  regular:
                    'La tecnología que reduce un 30% el uso de agua en cultivos y revoluciona el riego por goteo',
                },
                author: 'José Luis Brea',
                imageUrl: '/placeholder.svg?height=200&width=300',
              },
              {
                id: 'agro-4',
                title: {
                  highlight: 'Ganadería',
                  regular:
                    'Presentaron nueva técnica para mejorar la eficiencia reproductiva en rodeos bovinos',
                },
                author: 'Gabriela Origlia',
                imageUrl: '/placeholder.svg?height=200&width=300',
                hasVideo: true,
              },
            ]}
          />
        </section>

        {/* Add Radio Player Showcase */}
        {/* Radio Player Showcase - Full Width */}
        <div className="container mx-auto px-4 py-6">
          <RadioPlayerShowcase
            frequency="99.5"
            stationName="Radio del Volga"
            radioLink="https://app.radiodelvolga.com.ar/"
          />
        </div>

        <AdPlaceholder />

        {/* Sports News Section */}
        <DeportesSection
          mainArticle={{
            title: (
              <>
                <span className="font-bold">De la mano de "Maravilla".</span>{' '}
                Con un triplete de Martínez, Racing activó el 'modo copero' y se
                acercó a los puestos de clasificación
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
                  <span className="font-bold">Argentinos, de lujo.</span> Media
                  hora a toda orquesta, taco, sombrero, golazos... y un
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
        />

        {/* Stories and Characters Section with shadcn */}
        <HistoriasYRelatosSection
          mainArticle={{
            title: (
              <>
                <span className="font-bold">"Hola mi vida".</span> Tini Stoessel
                tuvo un gesto inesperado con un fan que se volvió viral en redes
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
                  se animó con un proyecto de US$4 millones a pasos de la cancha
                  de polo
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
                  historia del joven que dejó la ciudad para convertirse en guía
                  de montaña
                </>
              ),
              author: 'Federico Wiemeyer',
              imageUrl: '/placeholder.svg?height=150&width=200',
            },
          ]}
        />

        {/* Foodit Section */}
        <RecetasSection
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
        />

        <QuinielaSection />

        {/* Opinion Section */}
        <OpinionSection
          opinionCards={opinionSectionData.opinionCards}
          featuredOpinion={opinionSectionData.featuredOpinion}
          editorials={opinionSectionData.editorials}
          smallOpinionCard={opinionSectionData.smallOpinionCard}
        />

        {/* Wellness Section */}
        <BienestarSection
          featuredArticle={wellnessSectionData.featuredArticle}
          smallArticles={wellnessSectionData.smallArticles}
        />

        {/* World Section (formerly Farming Section) */}
        <MundoSection
          mainArticle={farmingSectionData.mainArticle}
          sideArticles={farmingSectionData.sideArticles}
        />

        <IActualidad
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
        />

        {/* Tech Section */}
        <section className="container mx-auto px-4 py-6 border-t border-gray-200">
          <TechSection articles={techSectionData.articles} />
        </section>

        <section className="container mx-auto px-4 py-6 border-t border-gray-200">
          <CienciaYSaludSection
            sectionTitle="CIENCIA Y SALUD"
            logo={{
              src: '/images/ciencia-salud-logo.png',
              alt: 'Ciencia y Salud',
            }}
            mainArticle={lifestyleFeatureData.mainArticle}
            smallArticles={lifestyleFeatureData.smallArticles}
          />
        </section>

        {/* Hashtag Section */}
        <section className="container mx-auto px-4 py-6 border-t border-gray-200">
          <TendenciasSection
            hashtagName={hashtagSectionData.hashtagName}
            featuredItem={hashtagSectionData.featuredItem}
            contentCards={hashtagSectionData.contentCards}
          />
        </section>

        {/* Top Reads Section */}
        <section className="container mx-auto px-4 py-6 border-t border-gray-200">
          <TopReads articles={topReadsData.articles} />
        </section>

        {/* Business Main Feature Section */}
        <NegociosSection
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
        />

        {/* Entertainment Main Feature Section */}
        <section className="container mx-auto px-4 py-6 border-t border-gray-200">
          <EspectaculosSection
            mainFeature={entertainmentMainFeatureData.mainFeature}
            secondaryFeatures={entertainmentMainFeatureData.secondaryFeatures}
          />
        </section>

        {/* Lifestyle Section */}
        <section className="container mx-auto px-4 py-6 border-t border-gray-200">
          <LifestyleSection
            sectionTitle="SALUD"
            categories={[
              { name: 'VIAJES', href: '#' },
              { name: 'DESCANSO', href: '#' },
              { name: 'MENTE', href: '#' },
              { name: 'FITNESS', href: '#' },
              { name: 'NUTRICION', href: '#' },
              { name: 'VIDA SANA', href: '#' },
            ]}
            articles={[
              {
                id: 'lifestyle-1',
                title: {
                  highlight: 'Bienestar',
                  regular:
                    'Vivir conscientemente: el arte de disfrutar el momento presente',
                },
                summary:
                  'Frente a un mundo hiperconectado y acelerado, cada vez más personas buscan formas de desacelerar y conectar con su entorno',
                author: 'Martina Canavesi',
                imageUrl:
                  '/placeholder.svg?height=250&width=300&text=Mindfulness',
              },
              {
                id: 'lifestyle-2',
                title: {
                  highlight: 'Yoga',
                  regular:
                    'Cinco posturas fáciles para incorporar a tu rutina diaria',
                },
                summary:
                  'Estas asanas básicas te ayudarán a ganar flexibilidad y reducir el estrés sin necesidad de experiencia previa',
                author: 'Laura Giménez',
                imageUrl: '/placeholder.svg?height=250&width=300&text=Yoga',
                hasFeaturedBadge: true,
              },
              {
                id: 'lifestyle-3',
                title: {
                  highlight: 'Decoración',
                  regular:
                    'Cómo lograr espacios armoniosos con menos elementos',
                },
                author: 'Carlos Martínez',
                imageUrl:
                  '/placeholder.svg?height=250&width=300&text=Minimalismo',
                summary:
                  'El minimalismo no se trata solo de tener menos cosas, sino de elegir con propósito cada objeto que habita tu hogar',
              },
              {
                id: 'lifestyle-4',
                title: {
                  highlight: 'Alimentación',
                  regular:
                    'Por qué los nutricionistas recomiendan escuchar a tu cuerpo',
                },
                author: 'Federico Sánchez',
                imageUrl:
                  '/placeholder.svg?height=250&width=300&text=Nutrición',
                summary:
                  'Este enfoque propone dejar de lado las dietas restrictivas y aprender a identificar las señales naturales de hambre y saciedad',
              },
            ]}
          />
        </section>

        {/* Cultura Section */}
        <section className="container mx-auto px-4 py-6 border-t border-gray-200">
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
        </section>

        {/* Real Estate Four Column Grid Section */}
        <section className="container mx-auto px-4 py-6 border-t border-gray-200">
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
        </section>

        {/* You May Be Interested In Section */}
        <YouMayBeInterestedSection
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

        <MobileNavBar />
      </div>
    </SidelinesLayout>
  )
}
