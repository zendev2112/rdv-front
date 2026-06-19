# Build Spec — Phase 2 (Volga Beneficios): Retroactivo con foto + bot

**Companion to** `ROADMAP-beneficios.md` (Stage/Phase 2) and `SPEC-beneficios.md` v2 (§4 endpoints, §6
constraints). Build-ready elaboration, grounded in the repo audit (2026-06-16) and the Claude API reference.
Assumes **Phase 0 + Phase 1 are done** (schema, auth, anonymous accounts, the canje flow).

**What Phase 2 delivers:** a user who didn't get the discount at the counter snaps a photo of the ticket,
and the system **auto-credits it in under 5 minutes with no human** when it's within the rules — plus a
**support bot** that answers questions and handles the edge cases. This is the mechanism that makes the
manifesto's *"el usuario que pisa ya cumplió"* real (SPEC §0). It is the **highest-risk** path in the whole
product because it credits value automatically, so the §6 constraints are load-bearing here.

**Grounding facts from the audit (so nothing below is invented):**
- **Cloudinary** exists as a *loader/transform* only (`lib/cloudinaryLoader.ts`, `lib/cloudinaryTransforms.ts`).
  There is **no upload path** today — Phase 2 must add a signed direct upload for the ticket photo.
- **No `@anthropic-ai/sdk`** installed. New dep. Used for both OCR (vision) and the bot.
- **No `react-hook-form` / `zod` / `@hookform/resolvers`** — Phase 2 is the first real form (screen 17/18), so
  they land here (SPEC §8 also schedules them here).
- **Resend** (`resend@6.9.2`) is already wired (used by `solicitar`) — reuse it for the "claim approved/escalated"
  email if we want one.
- Phase 0 created `retro_claims` and the retroactivo policy columns on `businesses`; §6.5 adds
  `user_profiles.telefono_verificado` and `retro_claims.ticket_hash`. Confirm those migrations are in place.
- Server writes use the **service-role** `supabaseBeneficiosAdmin` client (RLS-bypassing) with explicit
  ownership checks — the retroactivo auto-credit must run server-side, never from the client.

---

## ⚠️ Three decisions to lock before building Phase 2

| # | Decision | Recommendation | Affects |
|---|----------|----------------|---------|
| **OQ-11** | OCR provider for the ticket photo | **Claude Haiku 4.5 vision** (`claude-haiku-4-5`) — we're adding `@anthropic-ai/sdk` for the bot anyway, it reads ARG tickets well, and structured output gives clean fields. Alternatives: Cloudinary OCR add-on, Tesseract. | `lib/ocrTicket.ts`, cost |
| **OQ-12** | Can the bot/engine **auto-credit** a claim, or only escalate? | **Auto-credit only inside the guardrails** (within lapso + under caps + verified phone + OCR matches + amount sane + not a duplicate). Everything else → `pendiente_humano`. The bot *recommends/escalates*, it does not bypass the engine. | the decision engine |
| **OQ-13** | Require a **verified phone** before a retroactivo claim? | **Yes** (§6 L5). This is the one strong check on the honor system — value is auto-credited, so the claimant must be a real, reachable person. Canje stays anonymous; only retroactivo gates on phone. | phone-OTP flow, `user_profiles` |

---

## The end-to-end flow

```
Benefit detail / Mis canjes ──"Ya compré · cargar con foto"──► /beneficios/reclamar
   │
   ├─ GET /reclamar/elegibilidad?merchant_id&benefit_id&fecha
   │     → { dentro_lapso, horas_restantes, tope_restante, acepta, telefono_verificado }
   │     drives the form UI (orange "fuera de lapso", cap hint, phone-gate prompt)
   │
   ├─ (if phone not verified) inline OTP: send code → verify → telefono_verificado=true
   │
   ├─ TicketUpload → Cloudinary SIGNED upload → ticket_url
   │
   └─ POST /reclamar { benefit_id, merchant_id, fecha_compra, monto?, ticket_url, motivo? }
          │
          ▼  decision engine (server, service-role)
     ┌───────────────────────────────────────────────────────────────┐
     │ 1. load businesses.retro_* policy + this user's claim counts    │
     │ 2. GATE: acepta? within lapso? under user+merchant caps?        │
     │    phone verified? not a duplicate ticket_hash?  → else reject/ │
     │    escalate with the right reason                               │
     │ 3. OCR the ticket (Haiku vision) → {fecha,monto,comercio,conf}  │
     │ 4. MATCH: ocr.fecha≈fecha_compra, ocr.comercio≈merchant name,   │
     │    monto plausible, conf ≥ THRESHOLD                            │
     │ 5a. all pass        → estado='aprobado', credit ahorro (<5 min) │
     │ 5b. gate fail        → 'rechazado' / 410 / 409 / 403            │
     │ 5c. OCR low-conf/mismatch → 'pendiente_humano' (+ bot offer)    │
     └───────────────────────────────────────────────────────────────┘
          │
          └─► success screen (16 variant): "Te acreditamos $X" | "Lo revisa una persona"
```

The **support bot** (`/bot`) sits alongside: it answers FAQs, explains why a claim escalated, and can open a
claim on the user's behalf. It never credits — it routes to the same engine.

---

## 1 · Ticket upload — Cloudinary **signed** direct upload (new)

There's no upload today, so add it. Signed upload keeps the API secret server-side; the browser uploads
straight to Cloudinary and we store only the returned URL.

- **`app/api/beneficios/cloudinary-sign/route.ts`** (`POST`, auth: user): returns a signature for a constrained
  upload — pin `folder: 'beneficios/tickets'`, a `public_id` prefix, and `eager`/format limits. Sign with
  `CLOUDINARY_API_SECRET` (new env var) + timestamp.
- **`components/TicketUpload.tsx`** (client): "Cámara" / "Galería" buttons → request signature → `POST` the file
  to `https://api.cloudinary.com/v1_1/<cloud>/image/upload` with the signed fields → return `secure_url`.
- Constrain server-side after the fact too: when the claim is filed, re-derive the expected folder/owner so a
  user can't submit an arbitrary URL as their "ticket".

**New env vars:** `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
(the loader only needed the cloud name in the URL; uploads need the key+secret).

---

## 2 · OCR — Claude Haiku 4.5 vision with structured output (`lib/ocrTicket.ts`)

We hand Haiku the **Cloudinary URL** (no need to re-read bytes) and force a typed JSON result via
`messages.parse()` + `output_config.format`. Haiku 4.5 (`claude-haiku-4-5`) supports structured outputs and
vision; pricing is **$1/MTok in, $5/MTok out** — a single small image + a few hundred output tokens is a
fraction of a cent per claim. (Haiku does **not** accept the `effort` param — don't set it.)

```ts
// lib/ocrTicket.ts
import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'

const TicketSchema = z.object({
  fecha: z.string().nullable(),     // ISO date printed on the ticket, or null if illegible
  monto: z.number().nullable(),     // total in ARS (number, no currency symbol)
  comercio: z.string().nullable(),  // merchant name as printed
  confianza: z.number(),            // 0..1 — how legible/complete the ticket is
})
export type TicketOCR = z.infer<typeof TicketSchema>

const client = new Anthropic() // ANTHROPIC_API_KEY from env

export async function ocrTicket(ticketUrl: string): Promise<TicketOCR | null> {
  const res = await client.messages.parse({
    model: 'claude-haiku-4-5',
    max_tokens: 512,
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'url', url: ticketUrl } },
        { type: 'text', text:
          'Es un ticket de compra argentino. Extraé la fecha de la compra (ISO), el monto TOTAL en ' +
          'pesos (solo número) y el nombre del comercio tal como figura impreso. Si algo no se lee, ' +
          'devolvé null en ese campo y bajá "confianza". Respondé solo con los campos pedidos.' },
      ],
    }],
    output_config: { format: zodOutputFormat(TicketSchema) },
  })
  return res.parsed_output ?? null   // null if the model couldn't satisfy the schema
}
```

The OCR result only **pre-validates** — a low-confidence or null read never hard-approves; it routes to the bot
or a human (engine step 5c). It also never hard-*blocks* a legitimate claim — the philosophy resolves for the
user, so a borderline read escalates rather than rejecting.

---

## 3 · The decision engine (`lib/retroDecision.ts`) — the heart of Phase 2

Pure, testable function. Takes the claim + policy + counts + OCR, returns a verdict. The route wires I/O around
it; the smoke tests target it directly.

```ts
// returns one of: approve | reject | escalate, with a machine reason
export type Verdict =
  | { kind: 'approve'; ahorro: number }
  | { kind: 'reject'; reason: 'fuera_de_lapso' | 'tope_alcanzado' | 'comercio_no_acepta' | 'sin_telefono' | 'duplicado' }
  | { kind: 'escalate'; reason: 'ocr_ilegible' | 'ocr_no_coincide' | 'monto_inverosimil' }

export function decideRetro(input: {
  policy: MerchantRetroConfig
  horasDesdeCompra: number
  topeUsuarioRestante: number          // computed from retro_claims count this month
  topeComercioRestante: number
  telefonoVerificado: boolean          // L5
  duplicado: boolean                   // ticket_hash already seen for this user
  ocr: TicketOCR | null
  fechaCompra: string
  montoDeclarado: number | null
  merchantNombre: string
  descuento: { tipo: 'porcentaje' | 'precio_fijo'; valor: number }
}): Verdict {
  const p = input.policy
  // --- hard gates (reject) ---
  if (!p.activo) return { kind: 'reject', reason: 'comercio_no_acepta' }
  if (input.horasDesdeCompra > p.lapso_horas) return { kind: 'reject', reason: 'fuera_de_lapso' }
  if (input.topeUsuarioRestante <= 0 || input.topeComercioRestante <= 0)
    return { kind: 'reject', reason: 'tope_alcanzado' }
  if (!input.telefonoVerificado) return { kind: 'reject', reason: 'sin_telefono' }   // L5 (OQ-13)
  if (input.duplicado) return { kind: 'reject', reason: 'duplicado' }                 // one-claim-per-receipt

  // --- soft checks (escalate, never silently approve) ---
  if (p.pedir_foto && (!input.ocr || input.ocr.confianza < OCR_CONF_THRESHOLD))
    return { kind: 'escalate', reason: 'ocr_ilegible' }
  if (input.ocr && !comercioCoincide(input.ocr.comercio, input.merchantNombre))
    return { kind: 'escalate', reason: 'ocr_no_coincide' }
  const monto = input.ocr?.monto ?? input.montoDeclarado
  if (monto != null && !montoVerosimil(monto))                                        // amount sanity (L)
    return { kind: 'escalate', reason: 'monto_inverosimil' }
  if (input.ocr?.fecha && !fechaCoincide(input.ocr.fecha, input.fechaCompra))
    return { kind: 'escalate', reason: 'ocr_no_coincide' }

  // --- auto-approve only if aprobacion_automatica AND everything above passed ---
  const ahorro = calcularAhorro(input.descuento, monto)
  if (!p.aprobacion_automatica) return { kind: 'escalate', reason: 'ocr_ilegible' }   // merchant wants manual → queue
  return { kind: 'approve', ahorro }
}
```

`OCR_CONF_THRESHOLD` is the tunable from OQ-11 (start ~0.6, adjust with real tickets). `comercioCoincide`
should be fuzzy (normalize accents/case, allow substring) because printed names rarely match the registered
name exactly. `montoVerosimil` rejects absurd values (≤0 or above a sane ceiling). `calcularAhorro` mirrors the
benefit's `descuento_tipo`/`descuento_valor`.

---

## 4 · API routes

- **`GET /api/beneficios/reclamar/elegibilidad`** (auth: user) — drives screen 17. Reads the merchant policy +
  this user's claim counts this month + `telefono_verificado`. Returns
  `{ acepta, dentro_lapso, horas_restantes, tope_restante, telefono_verificado }`. Pure reads; cheap.
- **`POST /api/beneficios/reclamar`** (auth: user) — the claim. Steps: validate body (Zod) → confirm the
  `ticket_url` is in this user's `beneficios/tickets` folder → compute `ticket_hash` (e.g. sha256 of
  `monto|fecha_compra|ticket_url` or an image hash) → `ocrTicket()` → load policy + counts → `decideRetro()` →
  write `retro_claims` row with the verdict; on `approve`, set `estado='aprobado'`, `ahorro_acreditado`,
  `resuelto_at=now()`. Response: `201 { claim }` (approve), or `409/410/403` with the reject reason, or
  `202 { claim, escalado:true }` (escalate). Map reject reasons → the SPEC §4 error codes
  (`fuera_de_lapso`→410, `tope_alcanzado`→409, `comercio_no_acepta`→403).
- **`GET/PUT /api/beneficios/comercio/retroactivo`** (auth: merchant_staff) — screen 18. Read/update the
  `businesses.retro_*` policy fields. PUT validates ranges (lapso ∈ {24,48,120,168}, topes ≥ 0).

All writes use `supabaseBeneficiosAdmin` with an explicit `auth.uid()` ownership check in code (RLS still
guards the client read paths).

---

## 5 · The support bot (`app/api/beneficios/bot/route.ts`)

`POST` (any session). Claude Haiku 4.5, server-side only — `ANTHROPIC_API_KEY` never reaches the client. System
prompt comes from the knowledge-base doc (`docs/11-knowledge-base-bot.md`). The bot **answers + routes**; it does
not credit (that stays in the engine, per OQ-12).

```ts
import Anthropic from '@anthropic-ai/sdk'
const client = new Anthropic()

export async function POST(req: Request) {
  const { mensajes } = await req.json()  // [{rol:'user'|'assistant', texto}]
  const res = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 1024,
    system: KB_SYSTEM_PROMPT,            // from docs/11 — FAQs + escalation triggers, Spanish
    messages: mensajes.map((m) => ({ role: m.rol, content: m.texto })),
  })
  const texto = res.content.filter((b) => b.type === 'text').map((b) => b.text).join('')
  // optional: a structured "accion" pass (escalar_humano | abrir_reclamo | null) via a second
  // parse() call or a tool — keep v1 simple: detect a sentinel the KB prompt is told to emit.
  return Response.json({ respuesta: texto })
}
```

Escalation: when the KB prompt decides it's beyond self-serve (angry user, repeated failure, policy exception),
it surfaces an "escalar a una persona" action; the client shows a WhatsApp/contact handoff. Keep v1 text-only;
add the structured `accion` field once the conversational shape is settled.

**Cost note:** Haiku at $1/$5 per MTok with short FAQ turns is ~fractions of a cent per message — fine for the
manifesto's "bot resuelve ~90%".

---

## 6 · Verified-phone gate (OTP) — the L5 lever (OQ-13)

The claimant is otherwise an **anonymous** account (Phase 0). Before a claim can auto-credit, link and verify a
real phone:
- Use **Supabase phone OTP**: `supabase.auth.updateUser({ phone })` to attach the phone to the current
  (anonymous) user, then `verifyOtp({ phone, token, type: 'phone_change' })`. On success, set
  `user_profiles.telefono_verificado = true` (a trigger or an explicit server update).
- This requires an **SMS provider configured in the Supabase project's Auth settings** (Twilio / MessageBird /
  Vonage) — an ops setup step + per-SMS cost. Flag it: phone verification isn't free.
- UX (screen 17): if `telefono_verificado` is false, the form shows an inline "verificá tu teléfono para
  reclamar" step (enter number → code → verified) before the submit enables. Canje (Phase 1) never asks for this.

---

## 7 · Screens & components

- **`app/beneficios/reclamar/page.tsx`** (s shell) + **`ReclamoForm`** (c, RHF+Zod): `FilosofiaBanner`
  ("Si pisaste el comercio, cumpliste"), `ComercioSelector` (prefilled when entered from a benefit),
  `FechaSelector` (reads elegibilidad → orange "fuera de lapso · quedan Xhs"), `BeneficioCard`
  (vigente-esa-fecha), `PhoneVerifyGate` (§6, only if unverified), `TicketUpload` (§1), `MotivoTextarea`
  (opcional), `TopeHint` ("Llevás N/​tope este mes"), `EnviarReclamo` → POST → success screen-16 variant
  (`"Te acreditamos $X"` or `"Lo revisa una persona"`).
- **Retroactivo tab in `comercio/local`** — `RetroactivoForm` (screen 18): master toggle, lapso radios
  (24/48/120/168h), tope steppers ×2 (usuario/comercio), "pedir foto" toggle, "aprobación automática" toggle,
  "por qué lo recomendamos" dark card. PUT to `/comercio/retroactivo`.
- **Dashboard `RetroQueue`** (screen 6) — when `aprobacion_automatica=false`, the merchant sees pending
  `retro_claims` and approves/rejects; approving runs the credit. (Built in Phase 3's dashboard; the data + route
  exist here.)
- **`MundialBot`-style chat widget** for `/bot` — a small support sheet reachable from screen 17 and the help
  affordance. Mounted-guard for hydration; posts the message array to `/bot`.

---

## 8 · Dependencies & env

**Deps to add:** `@anthropic-ai/sdk` (OCR + bot; ships `helpers/zod` → `zodOutputFormat`), `zod`,
`react-hook-form`, `@hookform/resolvers`.
**Env vars to add:** `ANTHROPIC_API_KEY` (server) · `CLOUDINARY_API_KEY` + `CLOUDINARY_API_SECRET` +
`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (signed upload) · SMS provider creds **in Supabase Auth settings** (phone OTP).
**Model IDs:** `claude-haiku-4-5` for both OCR and bot (cheapest tier; $1/$5 per MTok; structured outputs +
vision supported; no `effort` param).

---

## 9 · Acceptance criteria
- [ ] In-window claim, under caps, **verified phone**, readable ticket whose OCR matches the merchant+date →
      `estado='aprobado'` and `ahorro_acreditado` set, **in < 5 min, no human**; user sees "Te acreditamos $X".
- [ ] Out-of-window → `410 fuera_de_lapso`; over user/merchant cap → `409 tope_alcanzado`; merchant with
      retroactivo off → `403 comercio_no_acepta` — each with the right copy on screen 17.
- [ ] **Unverified phone blocks auto-credit** — the form makes the user verify first (OQ-13/L5).
- [ ] **Duplicate ticket** (same `ticket_hash` for the user) → rejected `duplicado`; the same photo can't be
      claimed twice.
- [ ] Low-confidence / mismatched OCR → `pendiente_humano` (escalated), **not** auto-approved; bot offers help.
- [ ] `aprobacion_automatica=false` merchant → claims land in the dashboard queue instead of auto-crediting.
- [ ] Bot answers a basic FAQ in Spanish and escalates on a trigger; `ANTHROPIC_API_KEY` never reaches the client.
- [ ] Merchant config (screen 18) round-trips; lapso/topes validate.
- [ ] **Smoke tests** on `decideRetro()` cover: in-window approve, each reject reason, each escalate reason,
      auto-approval-off → queue. Route-level test on `/reclamar` covers caps + lapso + duplicate.
- [ ] `npm run build` green; `npx tsc --noEmit` clean.

## 10 · Risks & notes
- **Auto-credit is the riskiest surface in the app.** Keep the engine pure + fully unit-tested; never let the
  bot or client bypass it. Default-deny on anything ambiguous (escalate, don't approve).
- **OCR is advisory, not authoritative.** A wrong read should cost an escalation, not a wrongful reject — the
  philosophy resolves for the user. Tune `OCR_CONF_THRESHOLD` on real tickets before trusting auto-approve.
- **SMS has real cost + ops setup.** Phone OTP needs a provider in Supabase Auth and bills per message — confirm
  this is acceptable, or fall back to gating retroactivo behind a lighter check (and accept weaker L5).
- **Cloudinary signed upload is new surface.** Constrain folder/owner both at signing time and at claim time so a
  user can't pass an arbitrary image URL as their ticket.
- **Anthropic key + rate limits.** Both OCR and bot share `ANTHROPIC_API_KEY`; handle `RateLimitError`/`APIError`
  with the SDK's typed exceptions, and degrade gracefully (OCR failure → escalate; bot failure → "probá de nuevo
  / hablá con una persona").

## 11 · Suggested build order
1. Confirm OQ-11/12/13 + the Phase-0 migrations (`retro_claims`, `businesses.retro_*`, `telefono_verificado`,
   `ticket_hash`). Add deps + env vars.
2. `lib/retroDecision.ts` + its unit tests (pure, no I/O — fastest to get right).
3. Cloudinary signed upload route + `TicketUpload`.
4. `lib/ocrTicket.ts` (Haiku vision) behind the swappable interface.
5. `/reclamar` + `/reclamar/elegibilidad` + `/comercio/retroactivo` routes wiring engine + OCR + counts.
6. Phone-OTP gate (`PhoneVerifyGate`) + `telefono_verificado` write.
7. `ReclamoForm` (screen 17) + `RetroactivoForm` (screen 18) + success screen-16 variant.
8. `/bot` route + chat widget. → **Phase 2 acceptance.**

*Build spec v1 · 2026-06-16 · grounded in repo audit + claude-api reference (Haiku 4.5 `claude-haiku-4-5`,
$1/$5 per MTok, structured outputs + URL-image vision). Confirm SQL/policy fields against
`docs/09-arquitectura-tecnica.md` and the bot prompt against `docs/11-knowledge-base-bot.md`.*
