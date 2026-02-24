import {
  Body, Container, Head, Heading, Hr, Html,
  Img, Link, Preview, Section, Text,
} from '@react-email/components'
import * as React from 'react'

interface BeneficioEmailProps {
  userName: string
  businessNombre: string
  benefitTitulo: string
  condiciones: string
  codigoUnico: string
  qrCodeUrl?: string
  businessSlug: string
  fechaFin?: string
}

export function BeneficioEmail({
  userName,
  businessNombre,
  benefitTitulo,
  condiciones,
  codigoUnico,
  businessSlug,
  fechaFin,
}: BeneficioEmailProps) {
  return (
    <Html lang="es">
      <Head />
      <Preview>Tu beneficio de {businessNombre} está listo para usar</Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <Section style={s.header}>
            <Img
              src="https://radiodelvolga.com.ar/images/logo.svg"
              alt="Radio del Volga"
              width={160}
              height={40}
            />
            <Text style={s.headerSubtitle}>Volga Beneficios</Text>
          </Section>

          <Section style={s.section}>
            <Heading style={s.h1}>¡Hola, {userName}! 🎉</Heading>
            <Text style={s.text}>
              Tu beneficio de <strong>{businessNombre}</strong> está listo.
              Mostrá este email en el comercio para canjearlo.
            </Text>
          </Section>

          <Hr style={s.hr} />

          <Section style={s.benefitBox}>
            <Text style={s.label}>COMERCIO</Text>
            <Text style={s.value}>{businessNombre}</Text>

            <Text style={s.label}>BENEFICIO</Text>
            <Text style={s.value}>{benefitTitulo}</Text>

            <Text style={s.label}>CONDICIONES</Text>
            <Text style={s.condiciones}>{condiciones}</Text>

            <Text style={s.label}>TU CÓDIGO</Text>
            <Text style={s.codigo}>{codigoUnico}</Text>

            {fechaFin && (
              <>
                <Text style={s.label}>VÁLIDO HASTA</Text>
                <Text style={s.value}>{fechaFin}</Text>
              </>
            )}
          </Section>

          <Hr style={s.hr} />

          <Section style={s.section}>
            <Text style={s.text}>
              ¿Querés ver más beneficios de comercios de Coronel Suárez?
            </Text>
            <Link
              href={`https://radiodelvolga.com.ar/beneficios/${businessSlug}`}
              style={s.button}
            >
              Ver beneficio en el sitio
            </Link>
          </Section>

          <Section style={s.footer}>
            <Text style={s.footerText}>
              Radio del Volga — Coronel Suárez, Buenos Aires, Argentina
            </Text>
            <Text style={s.footerText}>
              <Link href="https://radiodelvolga.com.ar" style={s.footerLink}>
                radiodelvolga.com.ar
              </Link>
              {' · '}
              <Link href="https://radiodelvolga.com.ar/beneficios" style={s.footerLink}>
                Volga Beneficios
              </Link>
            </Text>
            <Text style={s.footerSmall}>
              Recibiste este email porque solicitaste un beneficio en Volga Beneficios.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const s = {
  body: { backgroundColor: '#f5f5f5', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' } as React.CSSProperties,
  container: { maxWidth: '560px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden' as const },
  header: { backgroundColor: '#8B0000', padding: '24px 32px', textAlign: 'center' as const },
  headerSubtitle: { color: '#ffffff', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase' as const, margin: '4px 0 0' },
  section: { padding: '24px 32px' },
  h1: { fontSize: '22px', fontWeight: 'bold', color: '#1a1a1a', margin: '0 0 12px' },
  text: { fontSize: '15px', color: '#444444', lineHeight: '1.6', margin: '0 0 16px' },
  hr: { borderColor: '#eeeeee', margin: '0' },
  benefitBox: { backgroundColor: '#fafafa', padding: '24px 32px', borderLeft: '4px solid #8B0000', margin: '0 24px', borderRadius: '4px' },
  label: { fontSize: '10px', fontWeight: 'bold', color: '#999999', letterSpacing: '1.5px', textTransform: 'uppercase' as const, margin: '16px 0 4px' },
  value: { fontSize: '16px', fontWeight: 'bold', color: '#1a1a1a', margin: '0' },
  condiciones: { fontSize: '14px', color: '#666666', margin: '0', fontStyle: 'italic' },
  codigo: { fontSize: '22px', fontWeight: 'bold', color: '#8B0000', letterSpacing: '3px', fontFamily: 'monospace', margin: '0' },
  button: { display: 'inline-block', backgroundColor: '#8B0000', color: '#ffffff', padding: '12px 24px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', textDecoration: 'none' },
  footer: { backgroundColor: '#f9f9f9', padding: '20px 32px', textAlign: 'center' as const },
  footerText: { fontSize: '13px', color: '#888888', margin: '4px 0' },
  footerLink: { color: '#8B0000', textDecoration: 'none' },
  footerSmall: { fontSize: '11px', color: '#bbbbbb', margin: '8px 0 0' },
}