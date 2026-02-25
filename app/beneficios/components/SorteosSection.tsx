import Link from 'next/link'

interface Sorteo {
  id: string
  titulo: string
  descripcion: string
  imagen_url?: string
  estado: 'ACTIVO' | 'PRÓXIMAMENTE' | 'GRUPO'
}

interface Props {
  sorteos?: Sorteo[]
}

const MOCK_SORTEOS: Sorteo[] = [
  {
    id: '1',
    titulo: 'CANASTA NAVIDEÑA',
    descripcion: 'Ganate una canasta con productos de la región.',
    estado: 'ACTIVO',
  },
  {
    id: '2',
    titulo: 'CENA PARA DOS',
    descripcion: 'Cena romántica en restaurante de Coronel Suárez.',
    estado: 'ACTIVO',
  },
  {
    id: '3',
    titulo: 'KIT DEPORTIVO',
    descripcion: 'Ropa y accesorios deportivos por valor de $50.000.',
    estado: 'PRÓXIMAMENTE',
  },
  {
    id: '4',
    titulo: 'ESTADÍA EN SIERRAS',
    descripcion: 'Fin de semana en las sierras bonaerenses.',
    estado: 'GRUPO',
  },
]

const BADGE_COLORS: Record<string, string> = {
  ACTIVO: '#27AE60',
  GRUPO: '#555555',
  PRÓXIMAMENTE: '#8B0000',
}

export default function SorteosSection({ sorteos = MOCK_SORTEOS }: Props) {
  return (
    <section
      style={{
        background: 'var(--rdv-dark-bg)',
        padding: '64px 0',
        position: 'relative',
      }}
    >
      {/* Orange wave divider */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 32,
          background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 32'%3E%3Cpath d='M0,16 C150,32 350,0 600,16 C850,32 1050,0 1200,16 L1200,0 L0,0 Z' fill='%231A0000'/%3E%3C/svg%3E") repeat-x`,
          backgroundSize: '600px 32px',
          marginTop: -32,
        }}
        aria-hidden="true"
      />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 32,
          }}
        >
          <h2
            style={{
              fontSize: 'var(--font-2xl)',
              fontWeight: 700,
              color: '#FFFFFF',
              margin: 0,
            }}
          >
            ¡Sorteos únicos, pensados solo para vos!
          </h2>
          <Link
            href="/beneficios/sorteos"
            style={{
              fontSize: 'var(--font-sm)',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#FFFFFF',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              marginLeft: 16,
            }}
          >
            MÁS SORTEOS &gt;
          </Link>
        </div>

        {/* Desktop 4-col grid */}
        <div
          className="hidden lg:grid"
          style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}
        >
          {sorteos.map((s) => (
            <TicketCard key={s.id} sorteo={s} />
          ))}
        </div>

        {/* Tablet/Mobile carousel */}
        <div
          className="rdv-carousel-track lg:hidden"
          style={{ paddingLeft: 0 }}
        >
          {sorteos.map((s) => (
            <div
              key={s.id}
              className="rdv-carousel-card"
              style={{ minWidth: 'clamp(220px, 70vw, 280px)' }}
            >
              <TicketCard sorteo={s} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TicketCard({ sorteo }: { sorteo: Sorteo }) {
  return (
    <div
      style={{ borderRadius: 12, overflow: 'hidden', background: '#2A2A2A' }}
    >
      {/* Image */}
      <div
        style={{
          height: 140,
          background: sorteo.imagen_url
            ? `url(${sorteo.imagen_url}) center/cover`
            : 'linear-gradient(135deg, #3A1010, #8B0000)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 40,
        }}
      >
        🎁
      </div>

      {/* Perforation */}
      <div className="rdv-ticket-perforation" />

      {/* Content */}
      <div style={{ padding: '12px 14px 16px' }}>
        <div
          style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}
        >
          <span
            style={{
              background: BADGE_COLORS[sorteo.estado] ?? '#555',
              color: '#FFFFFF',
              borderRadius: 4,
              padding: '2px 8px',
              fontSize: 'var(--font-xs)',
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            {sorteo.estado}
          </span>
        </div>
        <p
          style={{
            fontSize: 'var(--font-sm)',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#FFFFFF',
            margin: '0 0 6px',
          }}
        >
          {sorteo.titulo}
        </p>
        <p
          style={{
            fontSize: 13,
            color: 'var(--rdv-text-secondary)',
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          {sorteo.descripcion}
        </p>
      </div>
    </div>
  )
}
