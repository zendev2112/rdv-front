import { jsPDF } from 'jspdf'
import QRCode from 'qrcode'

// Builds the FULL cupón as a downloadable A6 PDF — branded header, discount,
// merchant, the QR (drawn as vector squares so there is no image-decode risk in
// serverless), and the human código. Mirrors the email/screen design so a member
// can save or print a clean, self-contained coupon. Synchronous; returns a Buffer.
export function cuponPdfBuffer(opts: {
  codigo: string
  merchantNombre: string
  descuento: string
  qrText: string // the validar URL the merchant scans
}): Buffer {
  const doc = new jsPDF({ unit: 'mm', format: 'a6' }) // 105 × 148 mm portrait
  const W = 105
  const cx = W / 2
  const BRAND: [number, number, number] = [139, 0, 0] // #8B0000

  // Brand header bar.
  doc.setFillColor(...BRAND)
  doc.rect(0, 0, W, 22, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('Volga Beneficios', cx, 14, { align: 'center' })

  // "TU CUPÓN"
  let y = 31
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text('TU CUPÓN', cx, y, { align: 'center' })

  // Discount (wraps if long).
  y += 8
  doc.setFontSize(15)
  doc.setTextColor(26, 26, 26)
  const descLines = doc.splitTextToSize(opts.descuento || 'Beneficio', 88)
  doc.text(descLines, cx, y, { align: 'center' })
  y += descLines.length * 6

  // Merchant.
  y += 1
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(110, 110, 110)
  doc.text(`en ${opts.merchantNombre}`, cx, y, { align: 'center' })

  // QR as vector squares.
  y += 6
  const qrMM = 50
  const x0 = (W - qrMM) / 2
  const qr = QRCode.create(opts.qrText, { errorCorrectionLevel: 'M' })
  const n = qr.modules.size
  const d = qr.modules.data
  const cell = qrMM / n
  doc.setFillColor(0, 0, 0)
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (d[r * n + c]) doc.rect(x0 + c * cell, y + r * cell, cell, cell, 'F')
    }
  }
  y += qrMM + 7

  // Código box (dashed, brand colour).
  const boxW = 70
  const boxX = (W - boxW) / 2
  const boxH = 16
  doc.setDrawColor(...BRAND)
  doc.setLineDashPattern([1, 1], 0)
  doc.roundedRect(boxX, y, boxW, boxH, 2, 2, 'S')
  doc.setLineDashPattern([], 0)
  doc.setFontSize(7)
  doc.setTextColor(176, 106, 106)
  doc.text('CÓDIGO', cx, y + 5, { align: 'center' })
  doc.setFont('courier', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(...BRAND)
  doc.text(opts.codigo, cx, y + 12, { align: 'center' })
  y += boxH + 7

  // Instructions.
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(90, 90, 90)
  const instr = doc.splitTextToSize(
    `Mostrá este QR en ${opts.merchantNombre}: el comercio lo escanea y te aplica el beneficio.`,
    88,
  )
  doc.text(instr, cx, y, { align: 'center' })

  // Footer.
  doc.setFontSize(7)
  doc.setTextColor(170, 170, 170)
  doc.text('Volga Beneficios · Coronel Suárez', cx, 144, { align: 'center' })

  return Buffer.from(doc.output('arraybuffer'))
}
