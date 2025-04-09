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

      {/* Featured article with large image */}
      <section className="container mx-auto px-4 py-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Article content */}
          <div className="md:col-span-1">
            <h2 className="text-3xl font-bold mb-4">
              Radiografía de la Legislatura porteña: en qué gasta la nueva meca
              de los candidatos
            </h2>
            <div className="flex items-center mb-4">
              <div className="bg-gray-200 text-xs px-2 py-1 rounded mr-2">
                Política
              </div>
            </div>
            <div className="flex items-center">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="Laura Serra"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full mr-3"
              />
              <p className="text-sm text-gray-500">Por Laura Serra</p>
            </div>
          </div>

          {/* Article image */}
          <div className="md:col-span-1">
            <Image
              src="/placeholder.svg?height=400&width=500"
              alt="Legislatura porteña"
              width={500}
              height={400}
              className="w-full h-auto"
            />
          </div>

          {/* Advertisement */}
          <div className="md:col-span-1">
            <div className="bg-gray-100 p-4 h-full">
              <p className="text-xs text-gray-500 mb-2">AD</p>
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-center">
                  <h3 className="font-bold text-xl mb-2">
                    Adobe Creative Cloud
                  </h3>
                  <p className="mb-4">
                    Crea lo que quieras con el plan de Todas las Aplicaciones
                  </p>
                  <p className="mb-4">
                    Da vida a todas tus ideas con Creative Cloud.
                  </p>
                  <button className="border border-black rounded-full px-4 py-2 text-sm">
                    Probar ahora
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News articles row */}
      <section className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Article 1 */}
          <div>
            <Image
              src="/placeholder.svg?height=150&width=250"
              alt="Acto por Malvinas"
              width={250}
              height={150}
              className="w-full h-auto mb-3"
            />
            <h3 className="text-base font-bold mb-1">
              <span className="font-bold">Solo en Off.</span> Problemas con la
              letra de la marcha y tomas de catch en el acto por Malvinas
            </h3>
          </div>

          {/* Article 2 */}
          <div>
            <Image
              src="/placeholder.svg?height=150&width=250"
              alt="Pilar desaparecida"
              width={250}
              height={150}
              className="w-full h-auto mb-3"
            />
            <h3 className="text-base font-bold mb-1">
              <span className="font-bold">
                A 40 kilómetros de dónde desapareció.
              </span>{' '}
              Encontraron el cuerpo de Pilar, una de las hermanitas buscadas
              tras el temporal en Bahía
            </h3>
          </div>

          {/* Article 3 */}
          <div className="relative">
            <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
              VIDEO
            </div>
            <Image
              src="/placeholder.svg?height=150&width=250"
              alt="Benedetto planchazo"
              width={250}
              height={150}
              className="w-full h-auto mb-3"
            />
            <h3 className="text-base font-bold mb-1">
              <span className="font-bold">De mal en peor.</span> El brutal
              planchazo de Benedetto: roja directa y un presente complicado en
              Paraguay
            </h3>
          </div>

          {/* Article 4 */}
          <div>
            <Image
              src="/placeholder.svg?height=150&width=250"
              alt="Carlos Sainz"
              width={250}
              height={150}
              className="w-full h-auto mb-3"
            />
            <h3 className="text-base font-bold mb-1">
              <span className="font-bold">GP de Japón.</span> Carlos Sainz
              recibió una exorbitante multa por llegar tarde al himno y dio una
              inusual explicación
            </h3>
          </div>

          {/* Article 5 */}
          <div>
            <Image
              src="/placeholder.svg?height=150&width=250"
              alt="Festival colorido"
              width={250}
              height={150}
              className="w-full h-auto mb-3"
            />
            <h3 className="text-base font-bold mb-1">
              {/* Title not fully visible in screenshot */}
            </h3>
          </div>
        </div>
      </section>

      {/* Additional news articles row */}
      <section className="container mx-auto px-4 py-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Article 1 */}
          <div className="border-r border-gray-200 pr-4">
            <Image
              src="/placeholder.svg?height=200&width=300"
              alt="Elecciones comunitarias"
              width={300}
              height={200}
              className="w-full h-auto mb-3"
            />
            <h3 className="text-lg font-bold mb-1">
              <span className="font-bold">Elecciones comunitarias.</span> La
              ortodoxia ganó los comicios y extendió a veinte años su dominio en
              la AMIA
            </h3>
            <p className="text-sm text-gray-500">Por Jaime Rosemberg</p>
          </div>

          {/* Article 2 */}
          <div className="border-r border-gray-200 pr-4">
            <Image
              src="/placeholder.svg?height=200&width=300"
              alt="30 días frenéticos"
              width={300}
              height={200}
              className="w-full h-auto mb-3"
            />
            <h3 className="text-lg font-bold mb-1">
              <span className="font-bold">30 días frenéticos.</span> Aconsejan a
              los empresarios del agro cautela ante el momento de incertidumbre
              generalizada
            </h3>
          </div>

          {/* Article 3 */}
          <div className="border-r border-gray-200 pr-4">
            <Image
              src="/placeholder.svg?height=200&width=300"
              alt="La guerra olvidada"
              width={300}
              height={200}
              className="w-full h-auto mb-3"
            />
            <h3 className="text-lg font-bold mb-1">
              <span className="font-bold">La guerra olvidada.</span> La odisea
              del segundo viaje humanitario de la organización de Enrique
              Piñeyro a Sudán
            </h3>
            <p className="text-sm text-gray-500">Por Lucía Sol Miguel</p>
          </div>

          {/* Article 4 */}
          <div>
            <Image
              src="/placeholder.svg?height=200&width=300"
              alt="Campeón"
              width={300}
              height={200}
              className="w-full h-auto mb-3"
            />
            <h3 className="text-lg font-bold mb-1">
              <span className="font-bold">Campeón.</span> Ángel Cabrera
              consiguió su primer título en el Champions Tour y llega encendido
              al Masters de Augusta
            </h3>
            <p className="text-sm text-gray-500">Por Alejo Miranda</p>
          </div>
        </div>
      </section>

      <FarmaciasDeTurno/>

      {/* Politics and Economy Section */}
      <section className="container mx-auto px-4 py-6 border-t border-light-gray">
        <h2 className="text-2xl font-bold mb-6 uppercase text-primary-red">
          POLÍTICA Y ECONOMÍA
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main article content */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold mb-4">
              <span className="font-bold">Debate previsional.</span> Números
              claves, que difieren según el lugar del país y que impactan con
              fuerza
            </h3>
          </div>

          {/* Article images */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <Image
              src="/placeholder.svg?height=250&width=350"
              alt="Debate previsional imagen 1"
              width={350}
              height={250}
              className="w-full h-auto"
            />
            <Image
              src="/placeholder.svg?height=250&width=350"
              alt="Debate previsional imagen 2"
              width={350}
              height={250}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* More News Section */}
      <section className="container mx-auto px-4 py-6 border-t border-light-gray">
        <h2 className="text-2xl font-bold mb-6 uppercase text-primary-red">
          MÁS NOTICIAS
        </h2>

        {/* First row of articles */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Article 1 */}
          <div>
            <Image
              src="/placeholder.svg?height=200&width=300"
              alt="Montevideo"
              width={300}
              height={200}
              className="w-full h-auto mb-3"
            />
            <h3 className="text-lg font-bold mb-1">
              <span className="font-bold">Cruzar el charco.</span> Lo mejor de
              Montevideo: del chivito al parque Rodó, ideal para una escapada
            </h3>
            <p className="text-sm text-gray-500">Por Pierre Dumas</p>
          </div>

          {/* Article 2 */}
          <div>
            <Image
              src="/placeholder.svg?height=200&width=300"
              alt="Mex Urtizberea"
              width={300}
              height={200}
              className="w-full h-auto mb-3"
            />
            <h3 className="text-lg font-bold mb-1">
              <span className="font-bold">"En mi cabeza tengo 12 años".</span>{' '}
              Mex Urtizberea: del suceso de ¡FA! al invitado que más espera, sus
              ataques de pánico y por qué elige la soledad
            </h3>
            <p className="text-sm text-gray-500">Por Pablo Mascareño</p>
          </div>

          {/* Article 3 */}
          <div>
            <Image
              src="/placeholder.svg?height=200&width=300"
              alt="Lalo Schifrin"
              width={300}
              height={200}
              className="w-full h-auto mb-3"
            />
            <h3 className="text-lg font-bold mb-1">
              <span className="font-bold">
                "Lo que más me costó fue la aceptación".
              </span>{' '}
              El regreso "en música" de Lalo Schifrin a los 92 y todo lo que le
              queda por componer
            </h3>
            <p className="text-sm text-gray-500">Por Mauro Apicella</p>
          </div>

          {/* Article 4 */}
          <div className="relative">
            <div className="absolute top-2 left-2 bg-white text-black text-xs px-2 py-1 rounded">
              Living
            </div>
            <Image
              src="/placeholder.svg?height=200&width=300"
              alt="Decoración económica"
              width={300}
              height={200}
              className="w-full h-auto mb-3"
            />
            <h3 className="text-lg font-bold mb-1">
              <span className="font-bold">Encantadora y económica.</span> Una
              alternativa de decoración de bajo costo y mantenimiento que vuelve
              con fuerza
            </h3>
            <p className="text-sm text-gray-500">
              Por Daniela Rusak y Karina Contini
            </p>
          </div>
        </div>

        {/* Second row of articles */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Article 1 */}
          <div className="relative">
            <div className="absolute top-2 right-2 bg-yellow-300 text-black text-xs px-2 py-1 rounded-full flex items-center">
              <span className="mr-1">⭐</span> Suscriptores
            </div>
            <Image
              src="/placeholder.svg?height=200&width=300"
              alt="Carole Landis"
              width={300}
              height={200}
              className="w-full h-auto mb-3"
            />
            <h3 className="text-lg font-bold mb-1">
              <span className="font-bold">"No te cases con un extraño".</span>{' '}
              Carole Landis, la bella actriz que soñaba con...
            </h3>
          </div>

          {/* Article 2 */}
          <div>
            <Image
              src="/placeholder.svg?height=200&width=300"
              alt="Pedro Aznar y David Lebón"
              width={300}
              height={200}
              className="w-full h-auto mb-3"
            />
            <h3 className="text-lg font-bold mb-1">
              <span className="font-bold">Pedro Aznar y David Lebón.</span> El
              homenaje a Serú Girán en el Quilmes Rock...
            </h3>
          </div>

          {/* Article 3 */}
          <div>
            <Image
              src="/placeholder.svg?height=200&width=300"
              alt="Rosario niño"
              width={300}
              height={200}
              className="w-full h-auto mb-3"
            />
            <h3 className="text-lg font-bold mb-1">
              <span className="font-bold">Rosario.</span> Un niño de 12 años
              está en grave estado luego de dispararse...
            </h3>
          </div>

          {/* Article 4 */}
          <div className="relative">
            <div className="absolute top-2 right-2 bg-yellow-300 text-black text-xs px-2 py-1 rounded-full flex items-center">
              <span className="mr-1">⭐</span> Suscriptores
            </div>
            <Image
              src="/placeholder.svg?height=200&width=300"
              alt="Cerebro"
              width={300}
              height={200}
              className="w-full h-auto mb-3"
            />
            <h3 className="text-lg font-bold mb-1">
              <span className="font-bold">Trivia.</span> ¿Cuánto sabés sobre el
              cerebro?
            </h3>
            <p className="text-sm text-gray-500">Por Cintia Perazo</p>
          </div>
        </div>
      </section>

      {/* Sports News Section */}
      <section className="container mx-auto px-4 py-6 border-t border-light-gray">
        <h2 className="text-2xl font-bold mb-6 uppercase text-primary-red">
          ACTUALIDAD DEPORTIVA
        </h2>

        {/* Main sports article */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Article content */}
          <div>
            <h3 className="text-3xl font-bold mb-3">
              <span className="font-bold">De la mano de "Maravilla".</span> Con
              un triplete de Martínez, Racing activó el 'modo copero' y se
              acercó a los puestos de clasificación
            </h3>
            <p className="text-gray-700 mb-4">
              El delantero fue la indiscutida figura en el triunfo por 4-1,
              convirtiendo un triplete tras un año
            </p>
            <p className="text-sm text-gray-500">Por Franco Tossi</p>
          </div>

          {/* Article image */}
          <div>
            <Image
              src="/placeholder.svg?height=400&width=500"
              alt="Jugador de Racing celebrando"
              width={500}
              height={400}
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Two video articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Video article 1 */}
          <div className="flex gap-4">
            <div className="relative w-1/2">
              <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
                VIDEO
              </div>
              <Image
                src="/placeholder.svg?height=200&width=250"
                alt="Incidente en Liga de España"
                width={250}
                height={200}
                className="w-full h-auto"
              />
            </div>
            <div className="w-1/2">
              <h3 className="text-lg font-bold mb-1">
                <span className="font-bold">Insólito.</span> En la Liga de
                España, dos compañeros casi terminan a las trompadas en el banco
                de suplentes
              </h3>
            </div>
          </div>

          {/* Video article 2 */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <h3 className="text-lg font-bold mb-1">
                <span className="font-bold">Argentinos, de lujo.</span> Media
                hora a toda orquesta, taco, sombrero, golazos... y un
                agradecimiento a "Chiqui" Tapia
              </h3>
            </div>
            <div className="relative w-1/2">
              <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
                VIDEO
              </div>
              <Image
                src="/placeholder.svg?height=200&width=250"
                alt="Jugadores de Argentinos Juniors"
                width={250}
                height={200}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* LN Music Section */}
      <section className="container mx-auto px-4 py-6 border-t border-gray-200">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Image
              src="/placeholder.svg?height=60&width=120"
              alt="LN + música 104.9"
              width={120}
              height={60}
              className="h-12 w-auto mr-4"
            />
            <span className="text-xl">El mundo necesita más música</span>
          </div>
          <button className="bg-black text-yellow-300 rounded-full px-4 py-2 text-sm font-medium flex items-center">
            ESCUCHA + MÚSICA
            <Play className="w-4 h-4 ml-2" />
          </button>
        </div>
      </section>

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
