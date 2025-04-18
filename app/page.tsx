import Image from 'next/image'
import { Search, Bell, Menu, Play, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import OpinionSection from '../components/OpinionSection'
import WellnessSection from '../components/WellnessSection'
import WorldSection from '../components/WorldSection'
import LifestyleFeature from '../components/LifestyleFeature'
import TechSection from '../components/TechSection'
import HashtagSection from '../components/HashtagSection'
import TopReads from '../components/TopReads'
import MovieReleases from '@/components/MovieReleasesSection'
import BusinessMainFeature from '../components/BusinessMainFeature'
import EntertainmentMainFeature from '../components/EntertainmentMainFeature'
import SalidasSection from '../components/SalidasSection' // Changed import
import RealEstateFourColumnGrid from '../components/RealEstateFourColumnGrid'
import AgroFourColumnGrid from '../components/AgroFourColumnGrid'
import LifestyleSection from '../components/LifestyleSection'
import Footer from '../components/Footer'
import MainSection from '@/components/MainSection'
import NewsSectionGrid from '@/components/NewsSectionGrid'
import WeatherSection from '@/components/WeatherSection'
import Header from '@/components/Header'
import FarmaciasDeTurno from '@/components/FarmaciasDeTurno'
import ActualidadSection from '@/components/ActualidadSection'
import PoliticsAndEconomySection from '@/components/PoliticsAndEconomySection'
import AdPlaceholder from '@/components/AdPlaceholder'
import MasNoticiasSection from '@/components/MasNoticiasSection'
import VolgaTVSection from '@/components/VolgaTVSection'
import RadioPlayerShowcase from '@/components/RadioPlayerShowcase'
import { SportsNewsSection } from '@/components/SportsNewsSection'
import { StoriesAndCharactersSection } from '@/components/StoriesAndCharactersSection'
import YouMayBeInterestedSection from '@/components/YouMayBeInterestedSection'
import FooditSection from '@/components/FooditSection'
import QuinielaSection from '@/components/QuinielaSection'
import IActualidad from '@/components/IActualidad'
import ScienceAndHealth from '@/components/ScienceAndHealth'
import MediaCarousel from '@/components/MediaCarousel'

export default function Home() {
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

  return (
    <div className="min-h-screen bg-white">
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
        <MainSection />

        {/* Additional news grid section */}
        <NewsSectionGrid
          sectionColor="default"
          articles={[
            {
              id: '1',
              title: {
                highlight: 'Análisis',
                regular: 'Nuevas turbulencias en todos los frentes',
              },
              author: 'Claudio Jacquelin',
              imageUrl: '/placeholder.svg?height=200&width=300',
            },
            {
              id: '2',
              title: {
                highlight: 'Límites al operativo',
                regular:
                  'El juez Gallardo ordenó que la Policía porteña custodie la marcha de jubilados y corrió a las fuerzas de Bullrich',
              },
              imageUrl: '/placeholder.svg?height=200&width=300',
            },
            {
              id: '3',
              title: {
                highlight: 'Las definiciones de Kovadloff',
                regular:
                  'Las "contradicciones" de Milei, un peronismo "amnésico" y la "profunda crisis" de la política',
              },
              imageUrl: '/placeholder.svg?height=200&width=300',
              hasVideo: true,
            },
            {
              id: '4',
              title: {
                highlight: 'Empate en Florida',
                regular:
                  'Messi convirtió un gol y jugó un gran partido, pero Inter Miami no pudo ante Toronto',
              },
              imageUrl: '/placeholder.svg?height=200&width=300',
            },
          ]}
        />

        {/* Weather section */}
        <WeatherSection />

        {/* Advertisement banner */}
        <div className="container mx-auto px-4 py-6">
          <div className="bg-gray-100 p-4 text-center">
            <p className="text-xs text-gray-500 mb-2">AD</p>
            <div className="h-16 flex items-center justify-center">
              <p className="text-gray-400">Advertisement Banner</p>
            </div>
          </div>
        </div>

        {/* Add ActualidadSection here */}
        <ActualidadSection
          featuredArticle={{
            id: 'featured-1',
            title:
              'Las bolsas asiáticas y europeas se desploman y caen los futuros de EE.UU',
            summary:
              'Los mercados globales experimentan turbulencias tras el anuncio de nuevas políticas económicas. Analistas advierten sobre posibles consecuencias a largo plazo.',
            imageUrl: '/placeholder.svg?height=400&width=600',
            author: 'Carlos Martinez',
          }}
          articles={[
            {
              id: '1',
              title:
                'Elecciones 2024: los candidatos presentan sus propuestas económicas',
              imageUrl: '/placeholder.svg?height=150&width=250',
              author: 'Laura Fernandez',
            },
            {
              id: '2',
              title:
                'Avance científico: descubren nueva técnica para tratamiento del Alzheimer',
              summary: 'Investigadores locales logran importante hallazgo',
              imageUrl: '/placeholder.svg?height=150&width=250',
              author: 'Manuel Gimenez',
            },
            {
              id: '3',
              title:
                'El brutal planchazo en el partido: roja directa y polémica en las redes',
              imageUrl: '/placeholder.svg?height=150&width=250',
              author: 'Juan Deportes',
              isVideo: true,
            },
            {
              id: '4',
              title:
                'Recomendaciones para cuidar la salud mental en tiempos de crisis',
              imageUrl: '/placeholder.svg?height=150&width=250',
              author: 'Ana Salud',
            },
            {
              id: '5',
              title:
                'Nuevas tecnologías agrícolas revolucionan el campo argentino',
              imageUrl: '/placeholder.svg?height=150&width=250',
              author: 'Roberto Campo',
            },
            {
              id: '6',
              title:
                'Receta del día: tarta invertida con pistachos para sorprender',
              imageUrl: '/placeholder.svg?height=150&width=250',
              author: 'María Cocina',
            },
            {
              id: '7',
              title:
                'El fenómeno cultural que está cambiando los hábitos de consumo',
              imageUrl: '/placeholder.svg?height=150&width=250',
              author: 'Pedro Sociedad',
            },
            {
              id: '8',
              title: 'Entrevista exclusiva: "Nunca me consideré un gran actor"',
              imageUrl: '/placeholder.svg?height=150&width=250',
              author: 'Lucía Espectáculos',
              isVideo: true,
            },
            {
              id: '9',
              title:
                'Consejos para convertir tu casa en un espacio inteligente',
              imageUrl: '/placeholder.svg?height=150&width=250',
              author: 'Fernando Tecnología',
            },
            {
              id: '10',
              title:
                'La odisea del segundo viaje humanitario a zonas de conflicto',
              imageUrl: '/placeholder.svg?height=150&width=250',
              author: 'Carolina Internacional',
            },
            {
              id: '11',
              title:
                'Cinco razones por las que deberías incorporar limón a tu agua',
              imageUrl: '/placeholder.svg?height=150&width=250',
              author: 'Martín Nutrición',
            },
            {
              id: '12',
              title:
                'Lo mejor de Montevideo: guía completa para una escapada perfecta',
              imageUrl: '/placeholder.svg?height=150&width=250',
              author: 'Javier Viajes',
            },
          ]}
        />

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

        <FarmaciasDeTurno />

        {/* Politics and Economy Section */}
        <PoliticsAndEconomySection
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

        <VolgaTVSection
          featuredVideo={{
            id: 'lsng3PUSsPk', // This is the YouTube video ID
            title: 'Recetas del Volga - Especial Strudel',
            thumbnailUrl:
              'https://i.ytimg.com/an_webp/lsng3PUSsPk/mqdefault_6s.webp?du=3000&sqp=CKGt_r8G&rs=AOn4CLA5k94pmcT3ANQY-sZLcyEcs0qiwQ',
            publishedAt: 'Mayo 2023',
            viewCount: '2.3K',
            duration: '4:13',
          }}
          recentVideos={[
            {
              id: 'oamFbnsVhEk',
              title: 'La Casa del Terror llego a Coronel Suarez',
              thumbnailUrl:
                'https://i.ytimg.com/an_webp/lsng3PUSsPk/mqdefault_6s.webp?du=3000&sqp=CKGt_r8G&rs=AOn4CLA5k94pmcT3ANQY-sZLcyEcs0qiwQ',
              publishedAt: 'Abril 2023',
              viewCount: '1.2K',
              duration: '2:42',
            },
            {
              id: 'ZZ4cEA-vYsM',
              title: 'Recetas del Volga - Der Kreppel',
              thumbnailUrl:
                'https://i.ytimg.com/an_webp/ZZ4cEA-vYsM/mqdefault_6s.webp?du=3000&sqp=CMev_r8G&rs=AOn4CLAL9I5vSxkSMmZ-DYZ7h51_96U1BA',
              publishedAt: 'Abril 2023',
              viewCount: '952',
              duration: '2:58',
            },
            {
              id: '5qUla4Twb_U',
              title: 'Recetas del Volga - Runde Sunde',
              thumbnailUrl:
                'https://i.ytimg.com/vi/5qUla4Twb_U/hqdefault.jpg?sqp=-oaymwFBCNACELwBSFryq4qpAzMIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB8AEB-AH-CYAC0AWKAgwIABABGGUgZShlMA8=&rs=AOn4CLCI30kV_9XJUxsRvgOFnLgAM5iwyQ',
              publishedAt: 'Marzo 2023',
              viewCount: '1.5K',
              duration: '3:10',
            },
            {
              id: 'E-VHv8mCOCU',
              title: 'Recetas del Volga - Moultasche',
              thumbnailUrl:
                'https://i.ytimg.com/an_webp/E-VHv8mCOCU/mqdefault_6s.webp?du=3000&sqp=COat_r8G&rs=AOn4CLCNUWWp2xa8M2K-irjspkzFlNQJUw',
              publishedAt: 'Febrero 2023',
              viewCount: '3.1K',
              duration: '5:42',
            },
          ]}
        />

        <AdPlaceholder />

        <MasNoticiasSection
          articles={[
            // First 6 articles for the main grid
            {
              id: '1',
              title:
                'El Gobierno anuncia nuevas medidas económicas para contener la inflación',
              summary:
                'Paquete de medidas busca estabilizar precios en sectores clave de la economía',
              author: 'Carlos Rodriguez',
              imageUrl: '/placeholder.svg?height=200&width=300',
            },
            {
              id: '2',
              title:
                'Avances en investigación contra el cáncer muestran resultados prometedores',
              author: 'Laura Fernandez',
              imageUrl: '/placeholder.svg?height=200&width=300',
            },
            {
              id: '3',
              title:
                'El clásico de fútbol termina en empate tras un partido de alta intensidad',
              summary:
                'Los equipos no lograron romper la paridad en un encuentro con pocas situaciones claras',
              imageUrl: '/placeholder.svg?height=200&width=300',
            },
            {
              id: '4',
              title:
                'Nueva exposición de arte contemporáneo llega al museo principal',
              author: 'María González',
              imageUrl: '/placeholder.svg?height=200&width=300',
            },
            {
              id: '5',
              title:
                'El fenómeno climático afectará a la región durante los próximos meses',
              summary:
                'Meteorólogos advierten sobre posibles consecuencias en la agricultura',
              author: 'Juan Pérez',
              imageUrl: '/placeholder.svg?height=200&width=300',
            },
            {
              id: '6',
              title:
                'Tecnología innovadora promete revolucionar la industria de la energía renovable',
              imageUrl: '/placeholder.svg?height=200&width=300',
            },

            // Additional 4 articles for the bottom row
            {
              id: '7',
              title:
                'Destacan la importancia de la educación financiera desde edades tempranas',
              author: 'Elena Sánchez',
              imageUrl: '/placeholder.svg?height=200&width=300',
            },
            {
              id: '8',
              title:
                'Nuevo estudio revela beneficios inesperados de la práctica regular de meditación',
              summary:
                'Investigadores destacan efectos positivos en la memoria y concentración',
              imageUrl: '/placeholder.svg?height=200&width=300',
            },
            {
              id: '9',
              title:
                'Festival gastronómico internacional regresa con edición ampliada este año',
              author: 'Roberto Martínez',
              imageUrl: '/placeholder.svg?height=200&width=300',
            },
            {
              id: '10',
              title:
                'Lanzan convocatoria para proyectos de innovación social con financiamiento estatal',
              summary:
                'Las propuestas seleccionadas recibirán apoyo técnico y económico',
              imageUrl: '/placeholder.svg?height=200&width=300',
            },
          ]}
          headlines={[
            {
              id: 'h1',
              title:
                'Anuncian cambios en el gabinete ministerial tras reunión de emergencia',
              timestamp: 'Hace 10 minutos',
            },
            {
              id: 'h2',
              title:
                'Suman 5 medallas para la delegación nacional en competencia internacional',
              timestamp: 'Hace 25 minutos',
            },
            {
              id: 'h3',
              title:
                'Alertan por tormentas fuertes con posibilidad de granizo en el centro del país',
              timestamp: 'Hace 42 minutos',
            },
            {
              id: 'h4',
              title:
                'La bolsa local reacciona positivamente ante nuevos datos económicos',
              timestamp: 'Hace 1 hora',
            },
            {
              id: 'h5',
              title:
                'Investigación revela nuevos hallazgos sobre hábitos de consumo digital',
              timestamp: 'Hace 1 hora',
            },
          ]}
        />

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
        <SportsNewsSection
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
        <StoriesAndCharactersSection
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
        <FooditSection
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
        <WellnessSection
          featuredArticle={wellnessSectionData.featuredArticle}
          smallArticles={wellnessSectionData.smallArticles}
        />

        {/* World Section (formerly Farming Section) */}
        <WorldSection
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
          <ScienceAndHealth
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
          <HashtagSection
            hashtagName={hashtagSectionData.hashtagName}
            featuredItem={hashtagSectionData.featuredItem}
            contentCards={hashtagSectionData.contentCards}
          />
        </section>

        {/* Top Reads Section */}
        <section className="container mx-auto px-4 py-6 border-t border-gray-200">
          <TopReads articles={topReadsData.articles} />
        </section>

        {/* Movie Releases Section - Updated to use 3 articles */}
        <section className="container mx-auto px-4 py-6 border-t border-gray-200">
          <MovieReleases
            articles={[
              {
                id: 1,
                title: 'El Dibu habla de todo',
                quoteText: 'El Dibu habla de todo',
                headlineText:
                  'Emiliano Martínez reveló cómo maneja la presión en los penales y explicó su ritual antes de cada partido',
                summary:
                  'El arquero de la selección argentina contó detalles de su preparación mental y física en una entrevista exclusiva',
                imageUrl: '/placeholder.svg?height=340&width=600',
                hasVideo: true,
              },
              {
                id: 2,
                title: 'Oppenheimer llega a los cines',
                headlineText:
                  'Christopher Nolan regresa con un drama histórico que explora la creación de la bomba atómica',
                summary:
                  'La película recibió elogios de la crítica por sus actuaciones y su impactante dirección visual',
                imageUrl: '/placeholder.svg?height=340&width=600',
                hasVideo: false,
              },
              {
                id: 3,
                title: 'Spider-Man: nueva película',
                quoteText: 'Es el mejor guion hasta ahora',
                headlineText:
                  'Tom Holland confirma que la próxima entrega de Spider-Man comenzará a filmarse en 2025',
                summary:
                  'El actor británico regresará para su cuarta película en solitario como el héroe arácnido',
                imageUrl: '/placeholder.svg?height=340&width=600',
                hasVideo: false,
              },
            ]}
          />
        </section>

        {/* Business Main Feature Section */}
        <BusinessMainFeature
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
          <EntertainmentMainFeature
            mainFeature={entertainmentMainFeatureData.mainFeature}
            secondaryFeatures={entertainmentMainFeatureData.secondaryFeatures}
          />
        </section>

        {/* Salidas Section - Replaced LifestyleFourColumnGrid */}
        <section className="container mx-auto px-4 py-6 border-t border-gray-200">
          <SalidasSection
            categories={[
              { name: 'RESTAURANTES', href: '#' },
              { name: 'VINOS', href: '#' },
              { name: 'TEATRO', href: '#' },
              { name: 'FIESTAS REGIONALES', href: '#' },
            ]}
            articles={[
              {
                id: 'salidas-1',
                title: {
                  highlight: 'Teatro',
                  regular:
                    'Las obras imperdibles que se estrenan este mes en la cartelera porteña',
                },
                summary:
                  'Un recorrido por las propuestas más destacadas que llegan a los escenarios de la ciudad',
                author: 'María Guerrero',
                imageUrl: '/placeholder.svg?height=250&width=300&text=Teatro',
                hasVideo: false,
              },
              {
                id: 'salidas-2',
                title: {
                  highlight: 'Música',
                  regular:
                    'La agenda de conciertos para el fin de semana: todas las opciones',
                },
                author: 'Pablo Rocker',
                imageUrl:
                  '/placeholder.svg?height=250&width=300&text=Conciertos',
                hasVideo: false,
              },
              {
                id: 'salidas-3',
                title: {
                  highlight: 'Gastronomía',
                  regular:
                    'Cinco restaurantes con vista panorámica para disfrutar de la ciudad',
                },
                summary:
                  'Propuestas culinarias que combinan buena mesa y paisajes urbanos espectaculares',
                author: 'Sofía Gourmet',
                imageUrl:
                  '/placeholder.svg?height=250&width=300&text=Restaurantes',
                hasVideo: false,
              },
              {
                id: 'salidas-4',
                title: {
                  highlight: 'Cine',
                  regular:
                    'Festival de cine independiente: guía completa de proyecciones y eventos especiales',
                },
                author: 'Lucas Director',
                imageUrl: '/placeholder.svg?height=250&width=300&text=Cine',
                hasVideo: true,
              },
            ]}
          />
        </section>

        {/* Real Estate Four Column Grid Section */}
        <section className="container mx-auto px-4 py-6 border-t border-gray-200">
          <RealEstateFourColumnGrid
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

        {/* Agro Four Column Grid Section */}
        <section className="container mx-auto px-4 py-6 border-t border-gray-200">
          <AgroFourColumnGrid
            articles={agroFourColumnGridData.articles}
            adContent={agroFourColumnGridData.adContent}
          />
        </section>

        {/* Lifestyle Section */}
        <section className="container mx-auto px-4 py-6 border-t border-gray-200">
          <LifestyleSection
            sectionTitle={lifestyleSectionData.sectionTitle}
            mainArticle={lifestyleSectionData.mainArticle}
            storyCards={lifestyleSectionData.storyCards}
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

        <Footer />
      </div>
    </div>
  )
}
