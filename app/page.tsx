import Image from 'next/image'
import { Search, Bell, Menu, Play, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import FeaturedSection from '../components/FeaturedSection' // Add this import
import OpinionSection from '../components/OpinionSection'
import WellnessSection from '../components/WellnessSection'
import FarmingSection from '../components/FarmingSection'
import LifestyleFeature from '../components/LifestyleFeature'
import TechSection from '../components/TechSection'
import HashtagSection from '../components/HashtagSection'
import TopReads from '../components/TopReads'
import FeaturedSportsNote from '../components/FeaturedSportsNote'
import BusinessMainFeature from '../components/BusinessMainFeature'
import EntertainmentMainFeature from '../components/EntertainmentMainFeature'
import LifestyleFourColumnGrid from '../components/LifestyleFourColumnGrid'
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
    hashtagName: 'tendencias',
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
        titleHighlight: 'Crisis cambiaria',
        titleRegular:
          'El dólar blue superó los $1300 y alcanzó un nuevo récord histórico en medio de la incertidumbre económica',
        imageUrl: '/placeholder.svg?height=100&width=150',
      },
      {
        id: 2,
        titleHighlight: 'Audiencia clave',
        titleRegular:
          'La Corte Suprema decidirá esta semana sobre la validez del DNU de Milei que modificó más de 300 leyes',
      },
      {
        id: 3,
        titleHighlight: 'Pronóstico',
        titleRegular:
          'Alerta meteorológica: anuncian tormentas fuertes con posible caída de granizo en Buenos Aires y otras provincias',
        imageUrl: '/placeholder.svg?height=100&width=150',
      },
      {
        id: 4,
        titleHighlight: 'Gran Hermano',
        titleRegular:
          'Furia se convirtió en la nueva eliminada del reality y estalló la polémica en las redes sociales',
      },
      {
        id: 5,
        titleHighlight: 'Salud pública',
        titleRegular:
          'Dengue: confirman más de 50.000 casos en el país y expertos advierten que podría extenderse hasta mayo',
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
      {/* Top bar */}
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
          <Link href="#" className="hover:text-blue-800">
            CLUB LN
          </Link>
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
            FOODIT
          </Link>
          <Link href="#" className="hover:text-blue-800">
            CANCHALLENA
          </Link>
          <Link href="#" className="hover:text-blue-800">
            BONVIVIR
          </Link>
          <Link href="#" className="hover:text-blue-800">
            LN 104.9 + MÚSICA
          </Link>
        </div>
      </div>

      {/* Header */}
      <Header />

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
            LN Juegos
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
            title: 'Consejos para convertir tu casa en un espacio inteligente',
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
            'https://i.ytimg.com/an_webp/lsng3PUSsPk/mqdefault_6s.webp?du=3000&sqp=CObT3L8G&rs=AOn4CLDk09J84xvon5wiTO62nws9LQ5JOQ',
          publishedAt: 'Mayo 2023',
          viewCount: '2.3K',
          duration: '4:13',
        }}
        recentVideos={[
          {
            id: 'oamFbnsVhEk',
            title: 'La Casa del Terror llego a Coronel Suarez',
            thumbnailUrl:
              'https://i.ytimg.com/an_webp/oamFbnsVhEk/mqdefault_6s.webp?du=3000&sqp=CNCz3L8G&rs=AOn4CLDiDLur5Txhq04hWTBFSkTmsm6V9Q',
            publishedAt: 'Abril 2023',
            viewCount: '1.2K',
            duration: '2:42',
          },
          {
            id: 'ZZ4cEA-vYsM',
            title: 'Recetas del Volga - Der Kreppel',
            thumbnailUrl:
              'https://i.ytimg.com/an_webp/ZZ4cEA-vYsM/mqdefault_6s.webp?du=3000&sqp=CMWs3L8G&rs=AOn4CLBrfP3gMYRoKVxIRBzAch0TKm8U9g',
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
              'https://i.ytimg.com/an_webp/E-VHv8mCOCU/mqdefault_6s.webp?du=3000&sqp=COXS3L8G&rs=AOn4CLBMOukFWGOvB9LsTpF0WdQAGea5mw',
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
              <span className="font-bold">De la mano de "Maravilla".</span> Con
              un triplete de Martínez, Racing activó el 'modo copero' y se
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
                España, dos compañeros casi terminan a las trompadas en el banco
                de suplentes
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

      {/* Stories and Characters Section */}
      <section className="container mx-auto px-4 py-6 border-t border-gray-200">
        <h2 className="text-2xl font-bold mb-6 uppercase">
          HISTORIAS Y PERSONAJES
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main article */}
          <div className="md:col-span-1">
            <Image
              src="/placeholder.svg?height=400&width=400"
              alt="Tini Stoessel"
              width={400}
              height={400}
              className="w-full h-auto mb-4"
            />
            <h3 className="text-2xl font-bold mb-1">
              <span className="font-bold">"Hola mi vida".</span> Tini Stoessel
              tuvo...
            </h3>
          </div>

          {/* Side articles */}
          <div className="md:col-span-2 space-y-6">
            {/* Article 1 */}
            <div className="flex gap-4">
              <div className="w-2/3">
                <h3 className="text-xl font-bold mb-2">
                  <span className="font-bold">Historias.</span> Es argentino y
                  se animó con un proyecto de US$4 millones a pasos de la cancha
                  de polo
                </h3>
                <p className="text-sm text-gray-500">Por Ariel Goldfarb</p>
              </div>
              <div className="w-1/3">
                <Image
                  src="/placeholder.svg?height=150&width=200"
                  alt="Emprendedor argentino"
                  width={200}
                  height={150}
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Article 2 */}
            <div className="flex gap-4">
              <div className="w-2/3">
                <h3 className="text-xl font-bold mb-2">
                  <span className="font-bold">
                    Prometió volver con un Rosario bendecido en Calcuta.
                  </span>{' '}
                  Vivía lejos y supo que su madre tenía cáncer "Es una locura"
                </h3>
                <p className="text-sm text-gray-500">Por Carina Durn</p>
              </div>
              <div className="w-1/3">
                <Image
                  src="/placeholder.svg?height=150&width=200"
                  alt="Hombre con gafas"
                  width={200}
                  height={150}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* You May Be Interested In Section */}
      <section className="container mx-auto px-4 py-6 border-t border-gray-200">
        <h2 className="text-2xl font-bold mb-6 uppercase">
          TE PUEDE INTERESAR
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Article 1 */}
          <div className="mb-6">
            <div className="relative">
              <Image
                src="/placeholder.svg?height=200&width=300"
                alt="Pasaporte italiano"
                width={300}
                height={200}
                className="w-full h-auto mb-3"
              />
              <div className="absolute bottom-3 left-0 bg-black text-white text-xs px-2 py-1">
                TEST DE INTERÉS GENERAL
              </div>
            </div>
            <h3 className="text-lg font-bold mb-1">
              <span className="font-bold">Trivia.</span> ¿Qué importante cambio
              rige para obtener la ciudadanía italiana?
            </h3>
            <p className="text-sm text-gray-500">Por Cintia Perazo</p>
          </div>

          {/* Article 2 */}
          <div className="mb-6">
            <Image
              src="/placeholder.svg?height=200&width=300"
              alt="Piscinas naturales de Brasil"
              width={300}
              height={200}
              className="w-full h-auto mb-3"
            />
            <h3 className="text-lg font-bold mb-1">
              <span className="font-bold">Imperdible.</span> Las mejores
              piscinas naturales del nordeste de Brasil, para nadar entre peces
              de colores
            </h3>
            <p className="text-sm text-gray-500">Por Silvina Pini</p>
          </div>

          {/* Article 3 */}
          <div className="mb-6">
            <div className="relative">
              <Image
                src="/placeholder.svg?height=200&width=300"
                alt="Pareja en la playa"
                width={300}
                height={200}
                className="w-full h-auto mb-3"
              />
              <div className="absolute bottom-3 left-0 bg-black text-white text-xs px-2 py-1">
                CAMBIO DE VIDA
              </div>
            </div>
            <h3 className="text-lg font-bold mb-1">
              <span className="font-bold">Cambio de vida.</span> Buscaba un
              lugar para casarse y encontró un parador en la playa que lo
              convirtió en cocinero
            </h3>
            <p className="text-sm text-gray-500">Por Ana van Gelderen</p>
          </div>

          {/* Article 4 */}
          <div className="mb-6">
            <div className="relative">
              <Image
                src="/placeholder.svg?height=200&width=300"
                alt="Concierto"
                width={300}
                height={200}
                className="w-full h-auto mb-3"
              />
              <div className="absolute bottom-3 left-0 bg-black text-white text-xs px-2 py-1">
                VIDEO
              </div>
            </div>
            <h3 className="text-lg font-bold mb-1">
              <span className="font-bold">LA NACION World Tour 2025.</span> Te
              llevamos a ver Dua Lipa, Oasis y Coldplay alrededor del mundo
            </h3>
          </div>

          {/* Article 5 */}
          <div className="mb-6">
            <div className="relative">
              <Image
                src="/placeholder.svg?height=200&width=300"
                alt="Casa de campo"
                width={300}
                height={200}
                className="w-full h-auto mb-3"
              />
              <div className="absolute bottom-3 left-0 bg-black text-white text-xs px-2 py-1">
                FOTOS
              </div>
            </div>
            <h3 className="text-lg font-bold mb-1">
              <span className="font-bold">Espectacular hallazgo.</span> La
              misteriosa casa de campo
            </h3>
          </div>

          {/* Article 6 */}
          <div className="mb-6">
            <Image
              src="/placeholder.svg?height=200&width=300"
              alt="Gala de eliminación"
              width={300}
              height={200}
              className="w-full h-auto mb-3"
            />
            <h3 className="text-lg font-bold mb-1">
              <span className="font-bold">Rating.</span> La gala de eliminación
              con votos
            </h3>
          </div>

          {/* Article 7 */}
          <div className="mb-6">
            <div className="relative">
              <Image
                src="/placeholder.svg?height=200&width=300"
                alt="Construcción antigua"
                width={300}
                height={200}
                className="w-full h-auto mb-3"
              />
              <div className="absolute top-3 left-3 bg-white text-black text-xs px-2 py-1 rounded">
                Living
              </div>
            </div>
            <h3 className="text-lg font-bold mb-1">
              <span className="font-bold">Mirando al monte.</span> Una
              construcción antigua en
            </h3>
          </div>

          {/* Article 8 */}
          <div className="mb-6">
            <div className="relative">
              <Image
                src="/placeholder.svg?height=200&width=300"
                alt="Plantas de jardín"
                width={300}
                height={200}
                className="w-full h-auto mb-3"
              />
              <div className="absolute top-3 left-3 bg-green-600 text-white text-xs px-2 py-1 rounded">
                Jardín
              </div>
            </div>
            <h3 className="text-lg font-bold mb-1">
              <span className="font-bold">¿Cuál es cuál?.</span> Te ayudamos a
              identificar "las
            </h3>
          </div>
        </div>
      </section>

      {/* Foodit Section */}
      <section className="container mx-auto px-4 py-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Foodit Logo and Description */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <Image
                src="/placeholder.svg?height=80&width=150"
                alt="Foodit"
                width={150}
                height={80}
                className="h-16 w-auto mb-2"
              />
              <div className="text-gray-600">
                <p>recetas,</p>
                <p>menús y tips</p>
                <p>
                  para cocinar
                  <ChevronRight className="inline w-4 h-4" />
                </p>
              </div>
            </div>
            <button className="border border-gray-300 rounded px-4 py-2 text-sm font-medium">
              SUSCRIBITE A FOODIT
            </button>
          </div>

          {/* Recipe Article */}
          <div className="md:col-span-2">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <div className="flex space-x-4 mb-4 text-sm">
                  <Link href="#" className="text-gray-600 hover:text-blue-800">
                    MASTERCLASS
                  </Link>
                  <Link href="#" className="text-gray-600 hover:text-blue-800">
                    TIPS Y SECRETOS DE COCINA
                  </Link>
                  <Link href="#" className="text-gray-600 hover:text-blue-800">
                    RECETAS FACILES
                  </Link>
                </div>
                <h3 className="text-2xl font-bold mb-3">
                  <span className="font-bold">Dulce y crocante.</span> Una tarta
                  invertida con pistachos para decirle adiós a la clásica de
                  jamón y queso
                </h3>
                <p className="text-gray-700">
                  La dulzura de las cebollas combina de maravilla con el perfume
                  de las hierbas y el toque del fruto seco que está de moda; una
                  receta para un almuerzo diferente y lleno de sabor
                </p>
              </div>
              <div className="md:w-1/2">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  alt="Tarta invertida con pistachos"
                  width={400}
                  height={300}
                  className="w-full h-auto rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LN Juegos Section */}
      <section className="container mx-auto px-4 py-6 border-t border-gray-200">
        <div className="mb-6">
          <Image
            src="/placeholder.svg?height=60&width=150"
            alt="LN Juegos"
            width={150}
            height={60}
            className="h-10 w-auto"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Game 1 - Nexos */}
          <div className="relative border border-gray-200 rounded p-4 bg-purple-50">
            <div className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">
              NUEVO
            </div>
            <div className="flex justify-center mb-4">
              <Image
                src="/placeholder.svg?height=100&width=100"
                alt="Nexos game"
                width={100}
                height={100}
                className="h-20 w-auto"
              />
            </div>
            <h3 className="text-lg font-bold text-center mb-1">Nexos</h3>
            <p className="text-sm text-center">
              ¿Podés descubrir las relaciones?
            </p>
          </div>

          {/* Game 2 */}
          <div className="border border-gray-200 rounded p-4 bg-blue-50">
            <div className="flex justify-center mb-4">
              <Image
                src="/placeholder.svg?height=100&width=100"
                alt="Game 2"
                width={100}
                height={100}
                className="h-20 w-auto"
              />
            </div>
          </div>

          {/* Game 3 */}
          <div className="border border-gray-200 rounded p-4 bg-blue-100">
            <div className="flex justify-center mb-4">
              <Image
                src="/placeholder.svg?height=100&width=100"
                alt="Game 3"
                width={100}
                height={100}
                className="h-20 w-auto"
              />
            </div>
          </div>

          {/* Game 4 */}
          <div className="border border-gray-200 rounded p-4 bg-yellow-50">
            <div className="flex justify-center mb-4">
              <Image
                src="/placeholder.svg?height=100&width=100"
                alt="Game 4"
                width={100}
                height={100}
                className="h-20 w-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Opinion Section */}
      <section className="container mx-auto px-4 py-6 border-t border-gray-200">
        <OpinionSection
          opinionCards={opinionSectionData.opinionCards}
          featuredOpinion={opinionSectionData.featuredOpinion}
          editorials={opinionSectionData.editorials}
          smallOpinionCard={opinionSectionData.smallOpinionCard}
        />
      </section>

      {/* Wellness Section */}
      <section className="container mx-auto px-4 py-6 border-t border-gray-200">
        <WellnessSection
          featuredArticle={wellnessSectionData.featuredArticle}
          smallArticles={wellnessSectionData.smallArticles}
        />
      </section>

      {/* Farming Section */}
      <section className="container mx-auto px-4 py-6 border-t border-gray-200">
        <FarmingSection
          mainArticle={farmingSectionData.mainArticle}
          sideArticles={farmingSectionData.sideArticles}
        />
      </section>

      {/* Lifestyle Feature Section */}
      <section className="container mx-auto px-4 py-6 border-t border-gray-200">
        <LifestyleFeature
          sectionTitle={lifestyleFeatureData.sectionTitle}
          mainArticle={lifestyleFeatureData.mainArticle}
          smallArticles={lifestyleFeatureData.smallArticles}
        />
      </section>

      {/* Tech Section */}
      <section className="container mx-auto px-4 py-6 border-t border-gray-200">
        <TechSection articles={techSectionData.articles} />
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

      {/* Featured Sports Note Section */}
      <section className="container mx-auto px-4 py-6 border-t border-gray-200">
        <FeaturedSportsNote
          quoteText={featuredSportsNoteData.quoteText}
          headlineText={featuredSportsNoteData.headlineText}
          caption={featuredSportsNoteData.caption}
          imageUrl={featuredSportsNoteData.imageUrl}
          hasVideo={featuredSportsNoteData.hasVideo}
        />
      </section>

      {/* Business Main Feature Section */}
      <section className="container mx-auto px-4 py-6 border-t border-gray-200">
        <BusinessMainFeature
          mainArticle={businessMainFeatureData.mainArticle}
          sideArticles={businessMainFeatureData.sideArticles}
        />
      </section>

      {/* Entertainment Main Feature Section */}
      <section className="container mx-auto px-4 py-6 border-t border-gray-200">
        <EntertainmentMainFeature
          mainFeature={entertainmentMainFeatureData.mainFeature}
          secondaryFeatures={entertainmentMainFeatureData.secondaryFeatures}
          adData={entertainmentMainFeatureData.adData}
        />
      </section>

      {/* Lifestyle Four Column Grid Section */}
      <section className="container mx-auto px-4 py-6 border-t border-gray-200">
        <LifestyleFourColumnGrid
          sectionTitle={lifestyleFourColumnGridData.sectionTitle}
          articles={lifestyleFourColumnGridData.articles}
          adContent={lifestyleFourColumnGridData.adContent}
        />
      </section>

      {/* Real Estate Four Column Grid Section */}
      <section className="container mx-auto px-4 py-6 border-t border-gray-200">
        <RealEstateFourColumnGrid
          properties={realEstateFourColumnGridData.properties}
          adContent={realEstateFourColumnGridData.adContent}
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
      <Footer />
    </div>
  )
}
