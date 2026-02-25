import Image from 'next/image'
import Link from 'next/link'

interface Noticia {
  id: string
  titulo: string
  categoria: string
  imagen_url?: string
  href: string
}

const MOCK_NOTICIAS: Noticia[] = [
  {
    id: '1',
    titulo: 'Nuevos comercios se suman a Volga Beneficios este mes',
    categoria: 'COMERCIOS',
    href: 'https://radiodelvolga.com.ar/noticias/nuevos-comercios',
  },
  {
    id: '2',
    titulo: 'Descuentos especiales para el Día del Trabajador en Coronel Suárez',
    categoria: 'COMUNIDAD',
    href: 'https://radiodelvolga.com.ar/noticias/dia-trabajador',
  },
  {
    id: '3',
    titulo: 'La temporada de verano trae nuevas ofertas gastronómicas',
    categoria: 'GASTRONOMÍA',
    href: 'https://radiodelvolga.com.ar/noticias/ofertas-verano',
  },
  {
    id: '4',
    titulo: 'Cómo aprovechar al máximo tu membresía Volga Beneficios',
    categoria: 'CONSEJOS',
    href: 'https://radiodelvolga.com.ar/noticias/como-usar-beneficios',
  },
]

export default function NoticiasSection({
  noticias = MOCK_NOTICIAS,
}: {
  noticias?: Noticia[]
}) {
  return (
    <section>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 24,
        }}
      >
        <h2
          style={{
            fontSize: 'var(--font-2xl)',
            fontWeight: 700,
            color: 'var(--rdv-text-primary)',
            margin: 0,
          }}
        >
          Noticias de Suárez
        </h2>
        <a
          href="https://radiodelvolga.com.ar/noticias"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 'var(--font-sm)',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'var(--rdv-primary)',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          MÁS NOTICIAS &gt;
        </a>
      </div>

      {/* Desktop 4-col grid */}
      <div
        className="hidden lg:grid"
        style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}
      >
        {noticias.map((n) => (
          <NoticiaCard key={n.id} noticia={n} />
        ))}
      </div>

      {/* Tablet / Mobile carousel */}
      <div className="rdv-carousel-track lg:hidden">
        {noticias.map((n) => (
          <div
            key={n.id}
            className="rdv-carousel-card"
            style={{ minWidth: 'clamp(220px, 70vw, 300px)' }}
          >
            <NoticiaCard noticia={n} />
          </div>
        ))}
      </div>
    </section>
  )
}

function NoticiaCard({ noticia }: { noticia: Noticia }) {
  return (
    <a
      href={noticia.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={noticia.titulo}
      style={{
        display: 'block',
        textDecoration: 'none',
        background: 'var(--rdv-bg-white)',
        border: '1px solid var(--rdv-border)',
        borderRadius: 12,
        boxShadow: '0 2px 8px var(--rdv-shadow)',
        overflow: 'hidden',
      }}
    >
      {/* Image */}
      <div
        style={{
          aspectRatio: '16/9',
          background: 'linear-gradient(135deg, #8B0000, #C0392B)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {noticia.imagen_url ? (
          <Image
            src={noticia.imagen_url}
            alt={noticia.titulo}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 70vw, 25vw"
          />
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              fontSize: 36,
            }}
          >
            📰
          </div>
        )}
      </div>

      {/* Text */}
      <div style={{ padding: '12px 14px 16px' }}>
        <p
          style={{
            fontSize: 'var(--font-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'var(--rdv-primary)',
            margin: '0 0 8px',
          }}
        >
          {noticia.categoria}
        </p>
        <p
          style={{
            fontSize: 'var(--font-md)',
            fontWeight: 700,
            color: 'var(--rdv-text-primary)',
            margin: 0,
            lineHeight: 1.4,
          }}
          className="line-clamp-3"
        >
          {noticia.titulo}
        </p>
      </div>
    </a>
  )
}