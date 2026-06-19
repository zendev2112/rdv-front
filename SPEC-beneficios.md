# SPEC — Volga Beneficios

> Implementation spec produced from (all under `beneficiosapp/` in this repo):
> - `arquitectura-beneficiosapp.html` — technical architecture deck (May 2026; now includes the **operational manifesto** slide 1b)
> - `beneficiosapp-mvp.html` — **navigable MVP prototype** (Jun 2026) — the authoritative near-term scope
> - `benchmark-apps-beneficios.html` — competitive benchmark (Jun 2026): Club LN, Clarín 365, Rappi, PedidosYa, Shell Box
> - `wireframes-beneficiosapp.html` — wireframes v0.1 (2026-05-27, **18 screens** incl. retroactivo)
> - Existing code: `app/beneficios/` in this repo (rdv-frontend, Next.js 14 App Router)
>
> Status: planning document — no application code modified. **Spec v3** (2026-06-17) adds the
> **registration model** (§0b): no anonymous sign-in, register-to-redeem, Google OAuth + email/password,
> email + push as owned member channels. **Spec v2** (2026-06-16) reconciled v1 against the MVP prototype +
> manifesto, which changed the redemption model (see §0).

---

## 0. The model shift v1 → v2 (read this first)

The v1 spec (2026-06-12) read only the architecture doc + wireframes and concluded the MVP heart was an
**authenticated QR redemption loop**: user generates a 15-min-TTL token, merchant scans it with a camera,
the server validates atomically, both sides get a realtime confirmation. The newer prototype and the
manifesto **supersede that for the MVP**. Three things changed the direction:

1. **Operational philosophy (manifesto, architecture slide 1b):** *"El usuario que pisa el comercio ya
   cumplió."* The QR-validated canje is **a metric to improve the product, not a condition of success**.
   Three operating rules: (#1) default is **canje retroactivo** with a ticket photo, with per-merchant
   caps/windows; (#2) if anything fails in the shop — scanner, internet, staff — **the merchant still
   sells** and we reconcile afterward; (#3) the cost of comping a wrong canje < the cost of losing a user
   or a merchant; **a bot resolves ~90%** without humans.

2. **The MVP prototype is low-tech "mostrá la pantalla".** In `beneficiosapp-mvp.html` the canje is: tap
   **"Usar beneficio ahora"** → screen shows a short code (`VB-7421`) + *"Mostrá esta pantalla en el
   local"*. **No camera scanner, no atomic server validation, no merchant-side app in the loop.** This is
   the Club LN / Clarín 365 "present your credential" pattern from the benchmark — deliberately more
   generous and lower-friction than a scanner gate.

3. **Retroactivo is now a first-class flow, not an edge case.** Two whole screens (17 user claim, 18
   merchant config) exist for it, with ticket-photo OCR, sub-5-minute auto-approval, and per-merchant
   windows/caps. In v1 this was OQ-9 ("probably out of MVP"). In v2 **it is core MVP** — it's the
   mechanism that makes "pisa = cumplió" real.

**Net effect on the plan:** the MVP is the **low-tech credential canje + retroactivo + a thin merchant
presence**, shippable in weeks (prototype scope). The **camera-scanner + atomic-validation + realtime**
system from the architecture doc is **not deleted** — it becomes a *later* hardening phase (MVP 2+),
adopted only when merchant density and fraud signal justify the friction. Everything below is rewritten
around this. Where the architecture doc and the prototype disagree, **the prototype wins for MVP scope**;
the architecture doc remains the long-term technical north star.

**Positioning (benchmark):** Club La Nación and Clarín 365 are the exact mirror — a media outlet building
a discount club for its audience to drive retention/subscriptions. Their edge is national scale; **ours is
hyperlocal** (the Suárez neighbor knows every merchant on the list) plus **owned distribution** (Andy &
Claudio promote it live; the portal already has the audience) and **zero friction** (pisa = cumplió +
retroactivo). Copy from them: catalog-by-rubro + search, nearby map, favorites, new-benefit
notifications, tiers. Explicitly do **not** chase delivery (Rappi/PedidosYa) — stay in the local discount.

---

## 0b. Model shift v2 → v3 — the registration model (read this second)

v2 assumed a **zero-friction, anonymous-first** identity: the app silently created an anonymous
per-device account (`signInAnonymously()`), and a real account was an optional later upgrade
(OQ-4: "lazy account at 'Listo, lo usé'"). **v3 reverses this.** Volga Beneficios is the
**intermediary between users and merchants**; in a two-sided marketplace the platform's core asset
is its **member base and its owned reach** to it. Anonymous accounts produce neither — no email, no
consent, no list to grow, nothing to show a merchant when pitching ("tenemos N socios a los que les
llegamos"). So:

1. **No anonymous sign-in. Every member is a real, registered account.** The v2 `signInAnonymously()`
   flow is removed.

2. **Browse freely, register to redeem.** The public catalog stays anonymous-readable (RSC from
   `beneficios_activos`). The **registration wall sits at the canje**: the first time a visitor taps
   **"Usar beneficio"**, they must create an account. This is the natural conversion point — the
   visitor is already motivated — so friction costs the least there, and *everyone who actually uses
   the club becomes a reachable member.*

3. **Auth methods: Google OAuth (primary) + email/password (secondary).** Google gives a verified,
   marketing-reachable email in one tap (ideal for the Android-dominant local audience);
   email/password is the fallback. **Verified email is required** — Google emails are pre-verified;
   email/password signups must confirm via a link. This turns on Supabase SMTP (Resend;
   `BENEFICIOS_RESEND_API_KEY` already present) for transactional mail (confirmation + password
   reset). Phone/WhatsApp OTP is **not** in this scope (deferred; revisited only if the retroactivo
   anti-fraud gate needs it — see §6/L5).

4. **The member-data stack (the reason for the change).** `user_profiles` holds the member's identity
   + consent; the platform owns **two direct channels** to them: **email** (Resend campaigns —
   novedades, nuevos comercios, weekly digest) and **Web Push** (`push_subscriptions`). The Phase 4
   notification engine now has a real audience. An internal admin surface composes a "novedad" and
   sends it by email + push to opted-in members.

5. **Consent & legal (Argentina — Ley 25.326 de Protección de Datos Personales).** Collecting PII and
   marketing to it requires: a **marketing-consent checkbox** at signup ("Acepto recibir novedades de
   Volga Beneficios"), a **privacy policy**, an **unsubscribe link** in every email, and honoring
   **opt-out + deletion** requests. Designed in from day one, not bolted on.

**Net effect on the plan:**
- Caps stop being resettable "speed bumps" (§6.1) and become **real walls** — a registered identity
  can't be reset by clearing cookies / incognito / a new device. The verified-phone lever (L5) is
  **downgraded from "the strong lever" to optional**: an email-verified account already binds identity
  well enough for the canje; phone stays the strongest gate for *retroactivo* (auto-credited value)
  but is no longer required to make caps meaningful.
- `Redemption.user_id` and `PushSubscriptionRecord.user_id` become **NOT NULL** (no anonymous rows).
- The dormant merchant magic-link code is unaffected — that's a separate concern (merchant staff, not
  members).
- Resolves OQ-4 **against** the v2 "lazy anonymous" answer; reframes OQ-5 (push now requires an
  account) and OQ-13 (phone gate now optional, not required to make caps real).

**Build delta — new sub-phase `1a · Accounts`, slots in front of Phase 1:**
- **Supabase config:** enable Google provider (Google Cloud OAuth client id/secret + redirect URL) +
  Email provider; turn on Resend SMTP; **require email confirmation**.
- **DB:** `user_profiles` gains `email text`, `marketing_opt_in boolean default false`,
  `marketing_opt_in_at timestamptz`, `barrio text null`; remove the anonymous path; set
  `redemptions.user_id` and `push_subscriptions.user_id` **NOT NULL**.
- **Routes:** `app/beneficios/auth/callback/route.ts` (OAuth PKCE **code exchange** —
  `exchangeCodeForSession`, distinct from the OTP `comercio/auth/confirm` route) · account page
  `app/beneficios/cuenta/page.tsx` (Google button + email/password login/registro toggle + nombre +
  consent checkbox) · password-reset flow · legal: privacy-policy page + unsubscribe route.
- **`UsarBeneficioButton`:** replace the anonymous-sign-in path with a "registrate para usar" gate that
  routes unauthenticated users to `/beneficios/cuenta?next=…`.
- **Session UI** in `BeneficiosHeader` ("Hola, {nombre}" + Salir).
- **Effort ~2–4 days:** Google is the quick part; the email/password confirmation + reset + consent
  surface is the bulk.

---

## 1. Overview

BeneficiosApp is a local benefits club for Coronel Suárez, embedded as a module inside the
Radio del Volga news portal (`/beneficios`). It connects portal readers with local merchants
through discounts, weekly themed activations ("Semana de X" tied to La Última Cena editorial
video content), a QR-based redemption flow, a merchant dashboard with live redemption
tracking, and Web Push as a direct, algorithm-free notification channel.

Why it matters: it is the portal's first transactional product (merchant subscriptions are
the revenue model, ~$1.5M ARS MRR target at 50 merchants), and the strategic reason the
portal performance work was done first — the PWA must launch instantly because the cupón
screen is used standing at a shop counter.

**What already exists in this repo** (and is live): a read-only catalog MVP — homepage with
carousels, category pages, comercio detail pages, and a lead-generation flow
(`SolicitarModal` → POST `/api/beneficios/solicitar` → Supabase `leads` + Resend email +
wa.me link + client-side PDF). There is **no auth, no QR redemption, no merchant side, no
push, no geo** yet. The spec below builds the wireframed product on top of this base.

---

## 2. Screen inventory

18 screens from wireframes v0.1, with route, status vs. existing code, and the MVP/later phase each
belongs to. **MVP** = the prototype scope (low-tech canje + retroactivo + thin merchant presence).
(Component trees with props are in §7.)

### User side

| # | Screen | Route | Phase | Status today |
|---|--------|-------|-------|--------------|
| 1 | Home / vidriera | `/beneficios` | MVP | ⚠️ Exists, different layout — needs rubro chips, Semana de X block, conditional "Abierto ahora" banner |
| 2 | Detalle del beneficio | `/beneficios/[categoria]/[comercio]` | MVP | ⚠️ Exists — needs hero, validity state, "Cómo se usa" (mostrá la pantalla), horarios, **"Usar beneficio ahora"** + **"Ya compré · cargar con foto"** CTAs |
| 3 | Mi cupón ("mostrá la pantalla") | `/beneficios/cupon/[id]` | MVP | ❌ New — low-tech code, *not* a scanned QR (see §0) |
| 17 | Reclamar canje retroactivo | `/beneficios/reclamar` | **MVP** | ❌ New — ticket photo + monto + OCR auto-approval |
| 4 | Semana de X (activación) | `/beneficios/semana/[slug]` | MVP | ❌ New |
| 13 | Onboarding (3 slides) | overlay on first visit / `/beneficios/bienvenida` | MVP | ❌ New |
| 16 | Canje / reclamo exitoso — usuario | confirmation state | MVP | ❌ New — emotional confirm + "Ahorraste $X" + 3 next-actions |
| 5 | Push notification | (OS surface, not a route) | Push phase | ❌ New — SW `push` handler + deep link |
| 10 | Catálogo del comercio | `/beneficios/[categoria]/[comercio]/productos` | Catalog phase | ❌ New |
| 11 | Abierto ahora | `/beneficios/abierto-ahora` | Discovery phase | ❌ New |
| 12 | Cerca de mí (mapa) | `/beneficios/cerca` | Discovery phase | ❌ New |

### Merchant side

| # | Screen | Route | Phase | Status today |
|---|--------|-------|-------|--------------|
| — | Sumar comercio (lead) | `/beneficios/sumar` (or WhatsApp deep-link) | **MVP** | ❌ New — prototype's 3rd tab; "Quiero sumar mi comercio" → WhatsApp a Geraldine |
| 14 | Config del local | `/beneficios/comercio/local` (tabs: datos/horarios/ubicacion/foto/**retroactivo**) | MVP-light → full | ❌ New — arch doc + prototype name this the first real merchant screen |
| 18 | Config de canje retroactivo | 5th tab of screen 14 | **MVP** | ❌ New — lapso/topes/foto/auto-aprobación |
| 6 | Dashboard del comercio | `/beneficios/comercio/panel` | MVP-light → full | ❌ New — stats + canjes recientes + retroactivo queue |
| 8 | Mis productos | `/beneficios/comercio/productos` | Catalog phase | ❌ New |
| 9 | Agregar/editar producto | `/beneficios/comercio/productos/nuevo`, `.../[id]` | Catalog phase | ❌ New |
| 7 | Validar canje (scanner) | `/beneficios/comercio/escanear` | **QR-hardening phase (post-MVP)** | ❌ New — only if/when scanner gating is adopted |
| 15 | Canje exitoso — comercio | state of scanner screen (+ failure variant) | QR-hardening phase | ❌ New |

Screen-level notes that are requirements, not decoration:

- **Screen 1**: 3-tab **internal** nav in the prototype is *Beneficios · Mis canjes · Sumar comercio*;
  the wireframe also shows a **portal-wide** bottom nav (Beneficios/Noticias/Radio/Más). These conflict —
  see OQ-3. The green "Abierto ahora" banner renders **only on Saturdays, Sundays and Argentine
  holidays**, *above* the Semana de X block; weekdays it is not rendered at all.
- **Screen 2**: two CTAs, both in the prototype — primary **"Usar beneficio ahora"** (→ screen 3) and
  ghost **"Ya compré · cargar después con foto"** (→ screen 17). "Cómo se usa" copy is literally *"Tocá
  'Usar beneficio' y mostrá la pantalla en la caja. Con que estés ahí, te lo cumplimos. No hace falta
  cupón ni código impreso."*
- **Screen 3 (MVP)**: shows merchant logo + name + discount + a short human code (`VB-7421`) + *"Mostrá
  esta pantalla en el local"* + the philosophy line *"Con que estés acá, el beneficio es tuyo."* Closes
  with **"Listo, lo usé"** which records the canje client-side (self-reported). **No scanner, no TTL
  countdown in MVP.** Must still render **offline** once opened. (The QR + 15-min TTL + backup code
  `4F-7K2-89` belongs to the later scanner-gating phase, screen 7.)
- **Screen 17 (MVP)**: fields — comercio (prefilled when entered from a benefit), fecha (with "dentro del
  lapso · quedan Xhs" indicator), beneficio (auto-validated as vigente on that date), **ticket photo**
  (must show fecha + nombre del comercio + monto; "si pagaste con tarjeta, sirve la captura del banco"),
  optional "¿qué pasó?", and a transparent cap line ("Llevás 0 reclamos este mes · tope 1/mes"). Promise:
  *"te acreditamos en menos de 5 minutos sin que nadie tenga que aprobarlo manualmente."* States to
  handle: happy (auto-approve), fuera-de-lapso (escalate to human), tope-alcanzado, comercio-no-acepta.
- **Screen 18 (MVP)**: per-merchant retroactivo config — master toggle (default ON, "recomendado"),
  lapso (24h / **48h default** / 5d / 7d), topes (por usuario default 1/mes, del comercio default
  10/mes), "pedir foto del ticket" (ON), "aprobación automática" (ON). Defaults vary by rubro (see
  playbook). When monthly tope exceeded → operational alarm.
- **Screen 14**: completing horarios/ubicación is a **prerequisite** for appearing in screens 11 and 12 —
  the UI must say so (amber alert in wireframe). Onboarding presents retroactivo config as **opt-out**
  (defaults pre-activated), not opt-in.
- **Screen 6**: stats grid (canjes del mes/semana, conversión push, tier) + active benefit + canjes
  recientes. In the full QR phase this list updates in **realtime**; in MVP it's a periodic load (SWR).
- **Screen 7 (post-MVP)**: only built if scanner gating is adopted. Then: scan-to-confirmation **< 3 s**,
  manual code entry always available, failure variant required ("ya usado" / "vencido" / "comercio
  incorrecto").

---

## 3. Data model

TypeScript interfaces for all entities. New types go in `app/beneficios/types.ts`
(extending, not replacing, the existing `BeneficioActivo`, `Categoria`, `Benefit`,
`Comercio` interfaces, which keep working for the current public catalog).

Naming follows the existing convention: Spanish domain nouns, snake_case DB columns mirrored
in the interfaces (the existing types already do this).

```typescript
// --- Auth & profiles -------------------------------------------------------

export type Rol = 'user' | 'merchant_staff' | 'admin'

export interface UserProfile {
  id: string                    // = auth.users.id (registered; no anonymous rows — §0b)
  nombre: string
  email: string                 // verified — Google (pre-verified) or confirmed email/password
  telefono: string | null       // optional; only verified for retroactivo (L5)
  rol: Rol
  marketing_opt_in: boolean         // consent to email/push novedades (Ley 25.326) — §0b
  marketing_opt_in_at: string | null
  barrio: string | null
  push_opt_in: boolean
  geo_opt_in: boolean
  created_at: string
}

// --- Merchants -------------------------------------------------------------
// NOTE: existing DB calls these "businesses" (business_id, business_slug...).
// The architecture doc calls them "merchants". See Open Question OQ-1.

export interface Merchant {
  id: string
  slug: string
  nombre: string
  descripcion: string | null
  direccion: string | null
  telefono: string | null
  whatsapp: string | null
  website: string | null
  logo_url: string | null
  foto_url: string | null       // hero photo of the storefront (screen 2/14)
  categoria_id: number
  geo_lat: number | null
  geo_lon: number | null
  tier: 'basico' | 'activo' | 'premium'
  estado: 'activo' | 'pausado' | 'baneado'
}

export interface MerchantHours {
  id: string
  merchant_id: string
  dia: 0 | 1 | 2 | 3 | 4 | 5 | 6        // 0 = domingo
  abierto: boolean
  franjas: Array<{ desde: string; hasta: string }>  // "08:30"–"13:00", "16:00"–"21:00"
}

export interface MerchantSpecialHours {
  id: string
  merchant_id: string
  fecha: string                  // ISO date
  motivo: string                 // "25 de Mayo · Feriado nac."
  abierto: boolean
  franjas: Array<{ desde: string; hasta: string }>
}

// Per-merchant retroactivo policy (screen 18). Lives on the merchant row or a 1:1 table.
export interface MerchantRetroConfig {
  merchant_id: string
  activo: boolean                       // master toggle, default true
  lapso_horas: 24 | 48 | 120 | 168      // default 48
  tope_por_usuario_mes: number          // default 1
  tope_comercio_mes: number             // default 10
  pedir_foto: boolean                   // default true
  aprobacion_automatica: boolean        // default true
}

// --- Catalog (Phase: catalog) ----------------------------------------------

export interface Producto {
  id: string
  merchant_id: string
  nombre: string
  presentacion: string | null    // "100ml", "1kg"
  categoria: string
  descripcion: string | null
  foto_url: string | null
  precio: number                 // ARS
  descuento_tipo: 'porcentaje' | 'precio_fijo' | null
  descuento_valor: number | null // 15 (%) or 7225 (fixed ARS)
  estado: 'publicado' | 'pausado' | 'borrador'
}

// --- Activations ------------------------------------------------------------

export interface Activacion {
  id: string
  slug: string                   // "semana-milanesa" — used in deep links
  titulo: string                 // "La Semana de la Milanesa"
  descripcion: string
  merchant_id: string
  benefit_id: string
  video_url: string | null       // La Última Cena episode (YouTube embed)
  fecha_inicio: string
  fecha_fin: string
  estado: 'programada' | 'activa' | 'finalizada'
  canjes_count: number           // social proof ("187 canjes")
}

// --- Redemptions -------------------------------------------------------------
// MVP: a canje is mostly self-reported ("mostrá la pantalla" → "Listo, lo usé").
// `metodo` records how it happened so the same table serves the later QR-scanner
// phase without migration. token/expira_at are null in the MVP "mostrar" method.

export interface Redemption {
  id: string
  user_id: string                // NOT NULL — register-to-redeem, no anonymous canjes (§0b)
  benefit_id: string
  merchant_id: string
  activacion_id: string | null
  metodo: 'mostrar' | 'qr' | 'retroactivo'  // MVP uses 'mostrar' + 'retroactivo'
  codigo: string                 // "VB-7421" (mostrar) or "4F-7K2-89" (qr backup)
  token: string | null           // opaque single-use token — only for metodo='qr'
  estado: 'usado' | 'pendiente' | 'validado' | 'vencido' | 'cancelado'
  expira_at: string | null       // created_at + 15 min — only for metodo='qr'
  validado_at: string | null     // set by merchant scan (qr) — null for mostrar
  ahorro_estimado: number | null // "Ahorraste $1.275" on screen 16
  created_at: string
}

// --- Retroactive claims (screens 17 → 18) ------------------------------------

export interface RetroClaim {
  id: string
  user_id: string
  merchant_id: string
  benefit_id: string
  fecha_compra: string           // when the purchase happened (within lapso)
  monto: number | null           // ARS, from the ticket
  ticket_url: string             // Cloudinary upload of the ticket photo
  ocr: {                         // extracted server-side for pre-validation
    fecha: string | null
    monto: number | null
    comercio: string | null
    confianza: number            // 0–1
  } | null
  motivo_usuario: string | null  // optional "¿qué pasó?"
  estado: 'aprobado' | 'pendiente_humano' | 'rechazado'  // auto-approve happy path
  ahorro_acreditado: number | null
  resuelto_at: string | null
  created_at: string
}

// --- Push ---------------------------------------------------------------------

export interface PushSubscriptionRecord {
  id: string
  user_id: string                // NOT NULL — push is tied to a registered account (§0b, OQ-5 resolved)
  endpoint: string
  keys: { p256dh: string; auth: string }
  created_at: string
}

// --- Misc -----------------------------------------------------------------------

export interface UserFavorite {
  user_id: string
  merchant_id: string
  created_at: string
}

export interface Feriado {
  fecha: string                  // ISO date
  nombre: string
  tipo: 'nacional' | 'provincial' | 'local'
}
```

The architecture doc's 11-table schema (`user_profiles`, `merchants`, `merchant_users`,
`merchant_hours`, `merchant_special_hours`, `benefits`, `products`, `activations`,
`redemptions`, `push_subscriptions`, `notifications_sent`, `user_favorites`) maps 1:1 onto
these interfaces plus the existing `benefits` table. **v2 adds two MVP tables not in the
arch doc's count:** `retro_claims` (screen 17) and the retroactivo policy fields on
`merchants` (screen 18). RLS policies per the doc's role table (anonymous read published /
user owns redemptions + claims / merchant_staff scoped to merchant / admin all). The
denormalized `beneficios_activos` view that powers today's public pages **stays** — it's the
right read model for anonymous feed queries.

---

## 4. API contract

Existing endpoints (keep, unchanged):

| Endpoint | Method | Request | Response | Notes |
|---|---|---|---|---|
| `/api/beneficios` | GET | — | `{ beneficios: BeneficioActivo[] }` | public feed |
| `/api/beneficios/[slug]` | GET | path: business_slug | `{ comercio: Comercio }` | detail |
| `/api/beneficios/solicitar` | POST | `{ nombre, telefono, email?, benefit_id, business_id }` | `{ success, whatsapp_url, email_sent, beneficio, pdf_html }` | lead-gen flow — see Conflict C-2 |

New endpoints — **MVP**:

```
POST /api/beneficios/canje                          [auth: registered user — §0b, no anon]
  Records a "mostrar la pantalla" canje (screen 2 → 3). Register-to-redeem: an unauthenticated
  caller is gated to /beneficios/cuenta?next=… before this is reached.
  Req:  { benefit_id: string, activacion_id?: string }
  Res:  201 { redemption: Redemption }   // metodo='mostrar', codigo='VB-XXXX', token=null
  Err:  401 { error: 'no_autenticado' }  // not logged in (UI gates before this)
        409 { error: 'ya_canjeado' }     // per-user/benefit cap reached today
        410 { error: 'beneficio_vencido' }
  No scanner, no TTL: the canje is self-reported. "Listo, lo usé" PATCHes estado='usado'.
  Rate-limited per user (soft anti-fraud — philosophy resolves in favor of the user).

POST /api/beneficios/reclamar                              [auth: user]
  Files a retroactive claim (screen 17). Multipart: ticket photo + fields.
  Req:  { benefit_id, merchant_id, fecha_compra, monto?, ticket(file), motivo? }
  Flow: upload ticket → Cloudinary; run OCR (fecha/monto/comercio); if within lapso +
        under caps + OCR matches → estado='aprobado', credit ahorro (< 5 min, no human);
        else estado='pendiente_humano' (escalate) or 'rechazado'.
  Res:  201 { claim: RetroClaim }
  Err:  409 { error: 'tope_alcanzado' }       // user or merchant monthly cap
        410 { error: 'fuera_de_lapso' }        // → offer "pedir excepción" (human)
        403 { error: 'comercio_no_acepta' }    // merchant disabled retroactivo
  GET /api/beneficios/reclamar/elegibilidad?merchant_id&benefit_id&fecha
        → { dentro_lapso, horas_restantes, tope_restante, acepta } (drives screen 17 UI).

GET/PUT /api/beneficios/comercio/retroactivo               [auth: merchant_staff]
  Read/update MerchantRetroConfig (screen 18). PUT Req: Partial<MerchantRetroConfig>.
```

New endpoints — **QR-hardening phase (post-MVP, only if scanner gating is adopted)**:

```
POST /api/beneficios/canje  (metodo='qr' variant)                [auth: user]
  Same route, returns token + expira_at (created_at + 15 min) for a scannable QR.

POST /api/beneficios/canje/validar                          [auth: merchant_staff]
  Atomic validation (screen 7 → 15). Called with the scanned QR token OR manual codigo.
  Req:  { token?: string, codigo?: string }
  Res:  200 { redemption: Redemption, user: { nombre_corto: string } }
  Err:  404 'no_existe' · 409 'ya_usado' (+validado_at) · 410 'vencido' · 403 'comercio_incorrecto'
  Must be a single atomic UPDATE ... WHERE estado='pendiente' AND expira_at > now().

GET  /api/beneficios/comercio/dashboard                            [auth: merchant_staff]
  Res:  { stats: { canjes_mes, canjes_semana, conversion_push, tier },
          beneficio_activo: Benefit | null,
          canjes_recientes: Array<{ user_inicial, detalle, hace, descuento }>,
          retro_pendientes: Array<RetroClaim> }   // queue when aprobacion_automatica=off
  MVP: SWR refetch-on-focus serves this. QR phase adds a Supabase Realtime channel on
  `redemptions` filtered by merchant_id for the live canjes feed.

GET/PUT /api/beneficios/comercio/local                             [auth: merchant_staff]
  Merchant config (screen 14): datos + horarios + horarios especiales + geo + foto.
  PUT Req: Partial<Merchant> & { horarios?: MerchantHours[], especiales?: MerchantSpecialHours[] }

GET/POST/PUT/DELETE /api/beneficios/comercio/productos[/[id]]      [auth: merchant_staff]
  Catalog CRUD (screens 8–9). Photo upload goes to Cloudinary (existing account)
  via a signed upload, storing only the URL.

GET  /api/beneficios/abierto-ahora
  Res:  { contexto: { dia, es_finde_o_feriado, total_abiertos, con_promo },
          abiertos_con_promo: MerchantOpenCard[], abiertos: MerchantOpenCard[] }
  Server computes "open now" from merchant_hours + merchant_special_hours + feriados table.
  The Home banner (screen 1) reuses `contexto` only.

POST /api/beneficios/cerca                                         (geo)
  Req:  { lat: number, lon: number, radio_m?: number }            // default 1000
  Res:  { comercios: Array<Merchant & { distancia_m: number, abierto: boolean,
          beneficio?: { titulo, descuento_label } }> }            // top 20 by distance
  Postgres GIST index per arch doc. Fallback: centro de Coronel Suárez.

POST /api/beneficios/push/subscribe        Req: PushSubscription JSON → 201
POST /api/beneficios/push/unsubscribe      Req: { endpoint } → 204
  Push *sending* is NOT a portal API — it's a Supabase Edge Function on a cron
  (arch doc Flujo 2), keeping VAPID private keys out of Vercel.

GET  /api/beneficios/activaciones/[slug]
  Res:  { activacion: Activacion, merchant: Merchant, benefit: Benefit }

POST /api/beneficios/bot                                           (support bot)
  Claude Haiku 4.5 assistant (arch doc docs/11-knowledge-base-bot.md). Answers user +
  merchant FAQs, routes retroactivo edge cases, and escalates to a human on triggers.
  Req:  { mensajes: Array<{ rol, texto }>, contexto?: { user_id?, merchant_id? } }
  Res:  { respuesta: string, accion?: 'escalar_humano' | 'abrir_reclamo' | null }
  Phase: ships with retroactivo (it's what resolves the ~90% the manifesto promises).
```

Auth across all `[auth: ...]` endpoints: Supabase Auth JWT in cookies via `@supabase/ssr`
(already installed), validated server-side; RLS is the real enforcement layer, the route
checks are UX.

---

## 5. State design

| State | Lives in | Mechanism |
|---|---|---|
| Public catalog (feed, categorías, comercio detail, activación) | **Server** | RSC server fetch from `beneficios_activos` (existing pattern — keep) |
| "Abierto ahora" context + banner condition | **Server** | computed server-side per request; the Home banner is RSC (no client JS needed) |
| Session / role | **Server + cookie** | Supabase Auth via `@supabase/ssr` (Google OAuth + email/password, **no anonymous** — §0b); RSC reads session, client gets it from a thin provider; register-to-redeem gate on the canje |
| Active cupón (codigo, offline copy) | **Client, persisted** | `localStorage` + rendered offline-capable. MVP: no countdown (self-reported). QR phase: + token/expiry countdown in local `useState` |
| Canje confirmation (screen 3 → 16) | **Client** | MVP: immediate on "Listo, lo usé" (self-reported). QR phase: Supabase Realtime on the user's `redemptions` row |
| Retroactivo claim form + result (screen 17 → 16) | **Client form → server** | RHF+Zod; ticket upload to Cloudinary; result from the `/reclamar` response (auto-approve or escalated) |
| Merchant dashboard stats | **Server initial + client realtime** | RSC/route initial load, Realtime channel for live canjes; SWR for refetch-on-focus |
| Scanner state (camera, decode, result) | **Client, local** | `useState` in the scanner screen; no global store |
| Forms (producto, config local) | **Client, local** | React Hook Form + Zod (see §9) |
| Category filter on Home / catálogo tabs | **URL** | `?cat=gastro` / route segment — shareable, back-button friendly (existing `[categoria]` route already does this) |
| Map filters (con beneficio / abierto / radio) | **URL** | query params, so a filtered map view is linkable from a push notification |
| Onboarding seen / permisos pedidos | **Client, persisted** | `localStorage` flag; permission state itself queried from browser APIs |
| Favoritos | **Server** (table) with optimistic client toggle | SWR mutate |

**No global state library.** Nothing here needs Zustand/Redux: server state is RSC +
SWR/Realtime, ephemeral state is component-local, shareable state is the URL. This matches
both the existing codebase (zero stores today) and the portal's perf posture.

---

## 6. Constraints & limits

The MVP redeems on the **honor system** (no scanner — SPEC §0). That makes guardrails a product concern, not
an afterthought. This section defines them and is **load-bearing for Phases 1–2**: the canje route (§4)
enforces the per-user limits, and the retroactivo route enforces the claim limits.

### 6.1 — Limits are "walls" now (updated for v3)
> **Superseded by §0b.** v2 keyed identity on an **anonymous per-device account**, so caps were only
> "speed bumps" a determined user could reset (clear cookies / incognito / new phone). **v3 requires a
> registered account with a verified email** (Google or confirmed email/password) before any canje, so a
> cap keyed on `user_id` is a **real wall** — it can't be reset by clearing browser state. The verified
> **phone** (L5) is therefore no longer the *only* lever that makes caps meaningful; it's downgraded to an
> **optional, stronger** gate reserved for **retroactivo**, where value is auto-credited:

> **An email-verified account is enough for the low-value action (showing a canje). For the high-value
> action (a retroactivo claim that auto-credits money), optionally require a verified phone on top.**

This keeps friction off the common path while reserving the one extra-strong check for where value moves.

### 6.2 — The constraint set

| # | Constraint | What it does | Recommended MVP default | Status |
|---|------------|--------------|--------------------------|--------|
| L1 | **Per-benefit cap** | "N uses per day/week/month/total" on each deal | 1 per day per user | ✅ Exists — `benefits.limite_tipo` + `limite_cantidad`; just enforce |
| L2 | **Global per-user daily ceiling** | Stops one user redeeming *every* deal at once | ~5 canjes/day across all merchants | 🆕 small |
| L3 | **Benefit validity window** | Deal only works between start/end dates | `fecha_inicio`/`fecha_fin` | ✅ Exists |
| L4 | **Merchant budget cap** | Merchant limits total canjes (cost control) | Optional, **off** by default (e.g. "first 100/month") | 🆕 (decision OQ-14) |
| L5 | **Verified-phone gate** | One SMS code before the risky action | **Required for retroactivo**; optional for canje (OQ-13) | 🆕 — the strong lever |
| L6 | **Endpoint rate limit** | Blocks scripted spam from one device/IP | ~10 canje requests/min/IP | 🆕 cheap |

### 6.3 — Retroactivo gets the tightest stack (it auto-credits value)
The retroactive claim (screens 17/18, Phase 2) is the **high-risk path** because it credits value with no
human in the loop. Layer all of these — most already live on the merchant config (§3 `MerchantRetroConfig`):

| Guard | Default | Status |
|---|---|---|
| Time window (`lapso_horas`) | 48h | ✅ Screen 18 |
| Cap per user / per merchant per month | 1 / 10 | ✅ Screen 18 |
| Ticket photo required | on | ✅ Screen 18 |
| Verified phone (optional, v3) | off by default | 🆕 (L5) — email account already gates; add for retroactivo only if abuse data justifies (§0b/§6.1) |
| **One claim per receipt** | dedupe by `(monto, fecha_compra, ticket hash)` | 🆕 |
| **Amount sanity check** | reject implausible `monto` | 🆕 |
| **OCR-confidence threshold** | below threshold → bot/human, never auto-approve | ✅ designed in §4 `/reclamar` |

### 6.4 — Recommended MVP posture (in priority order)
1. **L1 + L2** — per-benefit cap (default 1/day) plus a global daily ceiling. Honor-system speed bumps that
   cover all normal behavior; cheap; ship in Phase 1.
2. **L5 on retroactivo** — verified phone before a claim can auto-credit. The one check worth insisting on;
   ship in Phase 2 with the claim flow.
3. **L6 + one-claim-per-receipt** — quietly defeat the obvious scripted/duplicate abuse without touching
   honest users.

Anything heavier (scanner gating, ID verification) stays out until **abuse data** justifies it — same
philosophy as the rest of the MVP (the QR-hardening track in §9 is the escalation path if it's ever needed).

### 6.5 — Schema & enforcement touches
- `user_profiles`: add `telefono_verificado boolean default false` (drives L5). Phone OTP via Supabase Auth
  phone sign-in or a lightweight SMS provider — decide with OQ-13.
- `retro_claims`: add a `ticket_hash text` (or `(monto, fecha_compra)` unique-ish check per user) for L4/dedupe.
- L1/L2 are **read-time counts** on `redemptions` (indexed by `(user_id, created_at)` — already in Phase 0
  DDL); no new columns.
- L4 (merchant budget): a `redemptions` count per `business_id` per month vs. an optional
  `businesses.canje_tope_mes`; add the column only if OQ-14 says MVP.
- L6: rate limit at the route/edge (Vercel middleware or per-IP token bucket) — no schema.

---

## 7. Component tree (per screen)

Shared layout: `app/beneficios/layout.tsx` keeps `BeneficiosHeader` / `BeneficiosFooter`.
New shared pieces: `AuthProvider` (thin session context), `DescuentoBadge`, `EstadoPill`.
Merchant routes get their own segment layout with auth guard:
`app/beneficios/comercio/layout.tsx` (server: redirect to login if no merchant session).

Only new/changed trees shown; `(s)` = server component, `(c)` = client.

**1 · Home** — `app/beneficios/page.tsx` (s)
```
BeneficiosPage (s)
├─ BeneficiosHeader (c, existing)
├─ CategoryTabs (c)                          { categorias: Categoria[], activa?: string } — sets ?cat=
├─ AbiertoAhoraBanner (s)                    { contexto: AbiertoContexto } — returns null on weekdays
├─ SemanaXDestacada (s)                      { activacion: Activacion } — links to /beneficios/semana/[slug]
├─ BeneficioFeed (s)                         { beneficios: BeneficioActivo[] }
│  └─ BeneficioCard (c, existing)
└─ BeneficiosFooter (c, existing)
```

**2 · Detalle** — extend `app/beneficios/[categoria]/[comercio]/page.tsx` (s)
```
ComercioPage (s)
├─ ComercioHero (s)                          { foto_url, estadoLabel: string }
├─ ComercioHeader (s, existing)
├─ DescuentoBox (s)                          { titulo, descripcion }
├─ InfoSeccion (s) ×3                        { titulo: 'Condiciones'|'Cómo se usa'|'Horarios', children }
├─ HorariosHoy (s)                           { horarios: MerchantHours[] }
├─ UsarBeneficioButton (c)                   { benefitId, activacionId? } — POST canje → router.push(cupón)
│  └─ (logged out → register gate → /beneficios/cuenta?next=… , §0b)
└─ ReclamarConFotoButton (c, ghost)          { benefitId, merchantId } — → /beneficios/reclamar
```

**3 · Cupón ("mostrá la pantalla") + 16 · exitoso usuario** — `app/beneficios/cupon/[id]/page.tsx`
```
CuponPage (s — shell only)
└─ CuponView (c)                             { redemption: Redemption, merchant: {nombre, logo_url} }
   ├─ MerchantHeader (c)                      { logo_url, nombre, descuentoLabel }
   ├─ CodigoCanje (c)                         { codigo: 'VB-7421' } — big, centered
   ├─ MostrarPantallaHint (c)                 "Mostrá esta pantalla en el local" + philosophy line
   ├─ TTLCountdown (c)                        — QR phase only; absent in MVP
   └─ ConfirmarUsoButton (c)                  "Listo, lo usé" → PATCH estado='usado' → <CanjeExitosoUsuario>
        CanjeExitosoUsuario (c)               { descuentoLabel, merchantNombre, ahorro, accionesCerca }
        ├─ AhorroPill ("Ahorraste $1.275"), AccionSiguiente ×3 (calificar / compartir wa.me / cerca)
```

**17 · Reclamar retroactivo** — `app/beneficios/reclamar/page.tsx` (s shell)
```
ReclamarPage (s shell)
└─ ReclamoForm (c)                           — RHF + Zod; reads /reclamar/elegibilidad
   ├─ FilosofiaBanner (c)                     "Si pisaste el comercio, cumpliste"
   ├─ ComercioSelector (c)                    { prefill?: merchant } — prefilled when entered from a benefit
   ├─ FechaSelector (c)                        — shows "dentro del lapso · quedan Xhs"; orange when fuera
   ├─ BeneficioCard (c)                        { vigenteEsaFecha: boolean }
   ├─ TicketUpload (c)                         { onUploaded(url) } — Cámara / Galería; Cloudinary signed
   ├─ MotivoTextarea (c, opcional)
   ├─ TopeHint (c)                             "Llevás N/​tope reclamos este mes"
   └─ EnviarReclamo (c)                        → POST /reclamar → success (screen 16 variant) | escalar
```

**Sumar comercio (lead)** — `app/beneficios/sumar/page.tsx` (s)
```
SumarComercioPage (s)
├─ SumarHero (s)                             "¿Tenés un comercio?"
├─ BeneficioFeature (s) ×4                    { emoji, titulo, desc } — te ven / clientes / medís / precio fundador
└─ SumarCTA (c)                              "Quiero sumar mi comercio" → WhatsApp deep-link a Geraldine
```

**4 · Semana de X** — `app/beneficios/semana/[slug]/page.tsx` (s)
```
ActivacionPage (s)  — dark theme header
├─ ActivacionHero (s)                        { titulo, descripcion }
├─ VideoEmbed (c)                            { videoUrl }  (lazy YouTube embed — keep portal perf discipline)
├─ ActivacionMeta (s)                        { fechas, diasRestantes, canjesCount }
├─ MerchantMiniCard (s)                      { merchant, descuentoLabel }
└─ GenerarCuponButton (c)                    (same as screen 2)
```

**6 · Dashboard comercio** — `app/beneficios/comercio/panel/page.tsx`
```
PanelPage (s, auth-guarded by segment layout)
├─ SaludoComercio (s)                        { merchantNombre, staffNombre, rol }
├─ StatsGrid (s)                             { stats } → StatCard ×4 { label, valor, delta }
├─ BeneficioActivoCard (c)                   { benefit } — editar / pausar actions
├─ RetroQueue (c)                            { pendientes: RetroClaim[] } — only when auto-approval off
├─ CanjesRecientes (c)                       { initial: CanjeItem[] } — SWR (MVP) / Realtime (QR phase)
└─ EscanearFAB (c)                           → /beneficios/comercio/escanear  (QR phase only)
```

**7 · Scanner + 15 · resultado (post-MVP)** — `app/beneficios/comercio/escanear/page.tsx`
```
EscanearPage (s shell)
└─ ScannerView (c)                           — states: 'scanning' | 'validating' | 'ok' | 'error'
   ├─ CameraScanner (c)                      { onDecode(token) }  (lib: `@zxing/browser` or BarcodeDetector w/ fallback)
   ├─ CodigoManualSheet (c)                  { onSubmit(codigo) }
   ├─ CanjeOkComercio (c)                    { redemption, user, statDia } — "Escanear otro" resets state
   └─ CanjeErrorComercio (c)                 { motivo: 'ya_usado'|'vencido'|'comercio_incorrecto' }
```

**8/9 · Productos comercio** — `app/beneficios/comercio/productos/`
```
ProductosPage (s)   → ProductosStats (s), ProductoFiltros (c, URL state), ProductoRow (s) ×N, AgregarProductoCTA
ProductoFormPage (c form, s shell)
└─ ProductoForm (c)                          { producto?: Producto }  — RHF + Zod
   ├─ FotoUpload (c)                         { onUploaded(url) }      — Cloudinary signed upload
   ├─ campos: nombre, categoria, precio, presentacion, descripcion
   ├─ DescuentoToggle (c)                    { tipo, valor } — live preview "→ Quedará en $7.225"
   └─ acciones: Publicar / Guardar borrador
```

**10 · Catálogo usuario** — `app/beneficios/[categoria]/[comercio]/productos/page.tsx` (s)
```
CatalogoPage (s)
├─ CatalogoTabs (c, URL state)               { counts }
├─ ParaguasBanner (s)                        { beneficioTitulo }
└─ ProductoGrid (s) → ProductoCard (s)       { producto } — badge -X%, precio tachado
```

**11 · Abierto ahora** — `app/beneficios/abierto-ahora/page.tsx` (s)
```
AbiertoAhoraPage (s)
├─ ContextoBanner (s)                        { contexto }
├─ FiltroTabs (c, URL state)
├─ SeccionConPromo (s) → ComercioAbiertoCard (s)  { merchant, cierraA, distancia?, descuentoLabel? }
└─ SeccionSinPromo (s) → ComercioAbiertoCard (s)
```

**12 · Cerca de mí** — `app/beneficios/cerca/page.tsx`
```
CercaPage (s shell)
└─ CercaView (c)                             — needs geolocation, fully client
   ├─ GeoPermissionGate (c)                  — re-asks in context; fallback "Usar Coronel Suárez"
   ├─ MapaComercio (c)                       { comercios, userPos, radio } — Google Maps JS, numbered pins
   ├─ MapFilters (c, URL state)              con-beneficio / abierto / radio
   └─ ComercioDistanciaList (c)              numbered to match pins
```

**13 · Onboarding** — `app/beneficios/bienvenida/page.tsx` (c)
```
OnboardingFlow (c)  — 3 slides, progress dots, "Saltar"
├─ SlideBienvenida → SlidePush (Notification.requestPermission + subscribe API) → SlideGeo
└─ sets localStorage flag; Home redirects here on first visit only
```

**14 + 18 · Config local** — `app/beneficios/comercio/local/page.tsx`
```
LocalConfigPage (s shell, tab from URL)
├─ ConfigTabs (c, URL state)                 datos | horarios | ubicacion | foto | retroactivo
├─ CompletitudAlert (s)                      { faltantes: string[] }
├─ DatosForm (c) | HorariosEditor (c) | UbicacionPicker (c, draggable pin) | FotoForm (c)
├─ RetroactivoForm (c, RHF+Zod)              { config: MerchantRetroConfig }  — screen 18
│  ├─ MasterToggle, LapsoRadios (24/48/120/168h), TopeSteppers ×2
│  └─ FotoToggle, AutoAprobacionToggle, PorQueRecomendamos (dark card)
└─ GuardarBar (c)                            sticky save
```

---

## 8. Stack recommendations

Comparing the architecture doc's stated stack against what's actually in the repo:

| Layer | Arch doc says | Repo has | Verdict |
|---|---|---|---|
| Framework / routing | Next.js 14+ App Router | Next 14.2.31 App Router, `/beneficios` segment | ✅ **Keep** — exactly as planned |
| Language | React 18 + TypeScript | React 18.3.1, TS 5.2 (`strict: false`) | ✅ Keep. ⚠️ Don't flip global strict (portal-wide blast radius); new beneficios files should be written strict-clean so a future per-path tightening is cheap |
| Styling | TailwindCSS + shadcn/ui | Tailwind 3.4 + Radix primitives + `--rdv-*` CSS vars + custom carousel CSS | ⚠️ **Adjust**: keep Tailwind + existing RDV design system. Do **not** install shadcn wholesale — the design language is already built. Pull individual shadcn patterns (dialog, toast) only if a Radix primitive is needed; flag this divergence from the doc as deliberate |
| Server state | TanStack Query | SWR 2.3.3 (installed, used by portal hooks) | ⚠️ **Adjust — conflict C-1**: use **SWR + RSC + Supabase Realtime**, not TanStack Query. Two server-cache libraries in one bundle is pure cost; everything TanStack would add (mutations, invalidation) is covered by SWR `mutate` + Realtime here. The doc's intent (cached server state) is honored, the brand differs |
| Forms | React Hook Form + Zod | hand-rolled `useState` forms | ❌ **Add** `react-hook-form` + `zod` + `@hookform/resolvers` — but only for the merchant side (producto, config local) where forms are real. `SolicitarModal`'s 3 fields don't justify a retrofit. Zod schemas double as API-route validation |
| Auth | Supabase Auth (mail + Google) | none (anon reads, service-role writes) | ❌ **Add** — `@supabase/ssr` 0.6.1 is *already installed*. **v3 (§0b): Google OAuth + email/password, verified email required, NO anonymous sign-in; register-to-redeem.** Needs Google provider creds + Resend SMTP (confirmation/reset) turned on in the beneficios project. New OAuth code-exchange callback (`auth/callback`), account page, consent + privacy policy. This is the single biggest gap between code and wireframes |
| Data access | Supabase (PostgreSQL, RLS, Realtime, Edge Functions) | `lib/supabase-beneficios.ts` (anon + admin clients), `beneficios_activos` view, 3 API routes | ✅ Keep the pattern (RSC reads view; API routes for mutations). Extend with: Realtime channels (dashboard, cupón), Edge Functions for push cron + canje token issuing if rate-limiting outgrows Vercel routes |
| API integration | REST API routes + Edge Functions | 3 REST routes under `/api/beneficios/` | ✅ Keep & extend per §4. Push *sending* goes in a Supabase Edge Function (cron + VAPID secrets), not Vercel |
| Images | Cloudinary | `lib/cloudinaryLoader.ts` + next/image | ✅ Keep — add signed direct uploads for merchant photos |
| PWA / Push | PWA + SW, Web Push VAPID | `public/sw.js` v3 (cache-first nav, just shipped) + manifest | ⚠️ Adjust: add `push` + `notificationclick` handlers to sw.js (bump to v4); precache `/beneficios` and the cupón shell so the counter moment works offline |
| Maps | Google Maps (Mapbox plan B) | none | ❌ Add `@googlemaps/js-api-loader` in discovery phase only — keep it out of the main bundle |
| QR | — (implied) | none | ⏸️ **Deferred to QR-hardening phase** (not MVP — see §0). When adopted: `qrcode` (render) + `@zxing/browser` (scan; prefer native `BarcodeDetector`). MVP canje is a plain text code, no lib needed |
| OCR (ticket reading) | Cloudinary + simple processing | Cloudinary present | ❌ **Add for retroactivo (MVP).** Extract fecha/monto/comercio from the ticket photo. Start with a server-side call (Cloudinary add-on or a hosted OCR/vision endpoint); the OCR only *pre-validates* — a low-confidence read escalates to the bot/human, it never hard-blocks |
| Support bot | Claude Haiku 4.5 (docs/11 knowledge base) | none | ❌ **Add for MVP.** `@anthropic-ai/sdk`, model `claude-haiku-4-5`, system prompt from the knowledge-base doc. Resolves ~90% of user/merchant questions + retroactivo edge cases; escalation triggers hand off to a human. Server-side route only (key never on client) |
| Testing | smoke tests on critical paths only (auth, canje, retroactivo, push) | none | ❌ Add minimal Vitest + route-level tests for `/api/beneficios/canje`, `/reclamar` (caps, lapso, OCR-mismatch escalation), and push — the doc scopes testing to exactly the critical paths |

### Conflicts flagged (doc/wireframes vs. existing architecture) — not silently resolved

- **C-1 · TanStack Query vs SWR.** Doc names TanStack; repo standardized on SWR during the
  perf work. Recommendation above: SWR. Needs a one-line sign-off since it contradicts the doc.
- **C-2 · Redemption model — RESOLVED in v2 (see §0).** Three models exist across the docs:
  (a) the existing **lead-gen** canje (form → wa.me + Resend + PDF, `leads` table); (b) the arch
  doc's **authenticated QR scanner** (TTL 15 min, atomic validation); (c) the prototype's low-tech
  **"mostrá la pantalla" + retroactivo con foto**. v2 picks **(c) for the MVP** per the manifesto,
  defers **(b)** to a hardening phase, and keeps **(a)** as the "Sumar comercio" merchant-acquisition
  path (not user redemption). Still worth a one-line sign-off since it overrides the arch doc's Fase 1.
- **C-7 · Self-reported canje can be gamed.** With no scanner, "Listo, lo usé" is trust-based. This is
  **intentional** (philosophy: cost of a wrong canje < cost of losing a user). Mitigations that fit the
  philosophy: per-user/benefit daily caps, the retroactivo caps, and bot-flagged anomalies — not a hard
  gate. Revisit (adopt the QR phase) only if abuse data justifies the friction.
- **C-3 · Entity naming.** Live DB: `businesses` / `business_id` / `beneficios_activos`.
  Doc schema: `merchants`. Renaming breaks the live view and three API routes. Recommendation:
  keep `businesses` in the DB, alias as `Merchant` in app types (as §3 does). Decision OQ-1.
- **C-4 · Bottom nav.** Wireframes show portal-wide nav (Beneficios / Noticias / Radio / Más);
  existing `BeneficiosFooter` is beneficios-internal (Home/Search/Tag/Heart/More). Product
  decision, not technical (OQ-3).
- **C-5 · Doc-internal inconsistency.** Wireframes include screen 13 (onboarding) *and* list
  "Onboarding del primer uso" under "decisiones pendientes" as unresolved. Spec assumes
  screen 13 is the answer; confirm (OQ-4).
- **C-6 · Mock content on the live home.** `SorteosSection` and `NoticiasSection` ship
  hardcoded mock data today. Not in wireframes scope; needs a wire-up-or-remove decision (OQ-8).

---

## 9. Implementation plan

Phased so the app **builds and runs after every phase** (`npm run build` green, existing public pages
untouched until their replacement is ready). The phases are grouped into **MVP 1** (public launch — the
prototype scope) and **MVP 2** (enriched product — discovery + catalog), matching the arch doc's MVP1/MVP2
split. The camera-scanner system is a **separate hardening track** taken on only if abuse data justifies it.
The detailed, sequenced build-out lives in `ROADMAP-beneficios.md`; this is the summary.

> The arch doc's own roadmap put QR+Scanner inside Fase 1. v2 **moves it out of the MVP** (§0, C-2). Phase
> numbers below are v2's, not the arch doc's.

### MVP 1 — public launch (the prototype)

**Phase 0 · Foundations** (no visible change)
- DB (Supabase beneficios project): migrate `user_profiles`, `merchant_users`, `merchant_hours`,
  `merchant_special_hours`, `redemptions`, **`retro_claims`**, retroactivo fields on `merchants`,
  `activations`, `push_subscriptions`, `user_favorites`, `feriados` + RLS + GIST index. Keep
  `businesses`/`benefits`/`leads`/`beneficios_activos` as-is.
- Files: `app/beneficios/types.ts` (per §3) · `lib/supabase-beneficios-server.ts` (`@supabase/ssr` cookie
  client) · `middleware.ts` (session refresh on `/beneficios/comercio/*`) · `app/beneficios/comercio/layout.tsx`
  (auth guard) · `.../comercio/ingresar/page.tsx` (login).
- Deps: none new (`@supabase/ssr` installed). Generate VAPID keys (env only).
- Accept: build green; anonymous portal identical; seeded merchant logs in and reaches an empty panel.

**Phase 1a · Accounts — register-to-redeem** (§0b) — **gates the canje**
- Supabase: enable Google provider + Email provider; Resend SMTP on; require email confirmation.
- DB: `user_profiles` += `email`, `marketing_opt_in`, `marketing_opt_in_at`, `barrio`; `redemptions.user_id`
  + `push_subscriptions.user_id` → NOT NULL; remove anonymous sign-in.
- Files: `app/beneficios/auth/callback/route.ts` (OAuth code exchange) · `app/beneficios/cuenta/page.tsx`
  (Google + email/password + nombre + consent) · password-reset flow · privacy-policy page + unsubscribe
  route · session UI in `BeneficiosHeader` · `UsarBeneficioButton` register-gate (→ `/beneficios/cuenta?next=`).
- Deps: none new (`@supabase/ssr` installed). Accept: visitor browses anonymously; tapping "Usar beneficio"
  while logged out routes to /cuenta; Google one-tap + email/password (confirmed) both create a profile with
  consent captured; canje requires a session; "Mis canjes" scoped by `user_id`. **Effort ~2–4 days.**

**Phase 1 · Canje "mostrá la pantalla" + Sumar comercio** (screens 1-light, 2, 3, 16, Sumar) — **MVP heart**
- The fast path to value: a **registered** user can browse, open a benefit, tap **"Usar beneficio ahora"**,
  see the code, and tap **"Listo, lo usé"**; a prospective merchant can tap **"Quiero sumar mi comercio"** → WhatsApp.
- Files: `app/api/beneficios/canje/route.ts` (metodo='mostrar') · `app/beneficios/cupon/[id]/page.tsx` +
  `components/{CuponView,CodigoCanje,ConfirmarUsoButton,CanjeExitosoUsuario}.tsx` · modify
  `[categoria]/[comercio]/page.tsx` (hero, "Cómo se usa", `UsarBeneficioButton`, `ReclamarConFotoButton`) ·
  `app/beneficios/sumar/page.tsx` · `public/sw.js` → v4 (precache cupón shell, offline render).
- Deps: none new. Accept: canje recorded + appears in "Mis canjes"; offline render works; WhatsApp deep-link opens.

**Phase 2 · Retroactivo con foto + bot** (screens 17, 18, bot) — **the philosophy made real**
- Files: `app/api/beneficios/reclamar/route.ts` + `reclamar/elegibilidad/route.ts` ·
  `app/api/beneficios/comercio/retroactivo/route.ts` · `app/beneficios/reclamar/page.tsx` + `ReclamoForm` ·
  retroactivo tab in config local (`RetroactivoForm`) · OCR helper (`lib/ocrTicket.ts`) ·
  `app/api/beneficios/bot/route.ts` (Claude Haiku, knowledge-base system prompt).
- Deps: `react-hook-form`, `zod`, `@hookform/resolvers`, `@anthropic-ai/sdk`. Accept: in-window claim with a
  readable ticket auto-approves < 5 min; out-of-window/over-cap escalate; OCR mismatch routes to bot; merchant
  config round-trips; **smoke tests** on `/reclamar` (caps, lapso, mismatch) pass.

**Phase 3 · Merchant config + dashboard** (screens 14, 6)
- Files: `app/beneficios/comercio/local/page.tsx` + `{ConfigTabs,DatosForm,HorariosEditor,UbicacionPicker,FotoForm,CompletitudAlert}` ·
  `app/api/beneficios/comercio/local/route.ts` · Cloudinary signed-upload route · `.../comercio/panel/page.tsx`
  + dashboard components (stats, beneficio activo, canjes recientes via SWR, retro queue).
- Accept: merchant completes datos/horarios/ubicación/foto/retroactivo; completitud alert reflects state;
  dashboard shows real canjes + pending retro claims.

**Phase 4 · Program surface + onboarding + push** (screens 4, 13, 5)
- Files: `app/beneficios/semana/[slug]/page.tsx` + activación components ·
  `app/api/beneficios/activaciones/[slug]/route.ts` · onboarding (3 slides; slide 2 = push) ·
  `public/sw.js` → v5 (`push`, `notificationclick`) · `push/{subscribe,unsubscribe}` routes · Supabase Edge
  Function `send-activation-push` (cron + VAPID, logs `notifications_sent`).
- Accept: Home shows active Semana de X above feed; activación plays video + records canje; onboarding shows
  once; opt-in on Android PWA; scheduled activación fires push; tap deep-links to the activación.

→ **End of MVP 1 = public launch.** Captable for 15-20 founding merchants.

### MVP 2 — enriched product

**Phase 5 · Discovery** (screens 11, 12 + Home banner)
- Files: `lib/feriados.ts` + `feriados` seed · `abierto-ahora` route + page + Home banner (weekend/holiday
  logic) · `cerca` route (GIST) + page + map components.
- Deps: `@googlemaps/js-api-loader` (lazy on `/cerca` only — protect LCP). Accept: banner absent weekday /
  present Saturday (faked clock); open-now honors special hours; numbered pins match the list; geo fallback works.

**Phase 6 · Catalog** (screens 8, 9, 10)
- Files: `comercio/productos/{page,nuevo,[id]}` + form components · products API · user-side
  `[categoria]/[comercio]/productos` grid.
- Accept: merchant publishes a product with photo + live discount preview; user sees it under the paraguas
  banner; draft/paused states behave.

### Hardening track (post-MVP, conditional) — QR scanner gating (screens 7, 15)
Taken on **only if** self-reported canje abuse data justifies the friction. Adds metodo='qr' to `/canje`
(token + 15-min TTL), the atomic `/canje/validar` route, the scanner screen (`@zxing/browser` /
`BarcodeDetector`), and Realtime confirmation on screens 3/6/16. No schema migration needed — `redemptions`
already carries `metodo`/`token`/`expira_at`/`validado_at`.

---

## 10. Open questions

Updated for v2. Many of the v1 questions are now resolved by the prototype/manifesto (marked **RESOLVED**).

- **OQ-1 (Phase 0):** DB naming — keep live `businesses` tables and alias to `Merchant` in app code
  (recommended, zero migration risk), or rename to the doc's `merchants` schema?
- **OQ-2 — RESOLVED (see §0/C-2):** The existing lead flow is **repurposed** as "Sumar comercio" (merchant
  acquisition via WhatsApp), not retired. User redemption is the low-tech canje + retroactivo, not the QR scanner.
- **OQ-3:** Nav — the **prototype** shows a 3-tab *internal* nav (Beneficios / Mis canjes / Sumar comercio);
  the **wireframe** shows a portal-wide nav (Beneficios / Noticias / Radio / Más). Which wins for launch?
  (Portal-wide implies changes outside `app/beneficios/`.) Recommend: internal 3-tab for MVP, portal-wide later.
- **OQ-4 — RESOLVED, REVERSED in v3 (§0b):** Onboarding (screen 13, 3 slides) is still in scope (MVP
  Phase 4). The anonymous→account question is now answered the **opposite** way: **no anonymous accounts**
  — register-to-redeem (Google OAuth + email/password) gates the canje. The v2 "lazy account at 'Listo, lo
  usé'" is dropped.
- **OQ-5 — RESOLVED (§0b):** Push is **tied to a registered account** (`push_subscriptions.user_id` NOT
  NULL). No anonymous push opt-in.
- **OQ-6 (Phase 5):** Holiday calendar scope — national only / + BA provincial / + local (Strudel Fest)?
  Someone owns the yearly update.
- **OQ-7 (Phase 0):** Merchant login — single login per comercio vs. roles (dueño/cajero/encargado). Wireframe
  shows "Pablo Méndez · Administrador". Recommend single-role staff in MVP with the `merchant_users` N:N table
  in place for later.
- **OQ-8:** `SorteosSection` / `NoticiasSection` on the live beneficios home render mock data and aren't in
  the wireframes — wire to real data or remove during the Phase 1/3 home rework?
- **OQ-9 — RESOLVED (reframed):** "Offline reconciliation" is no longer about queued scanner validations
  (no scanner in MVP). The MVP equivalent is the **retroactivo** flow — a user who couldn't show the screen
  (or whom the merchant missed) claims afterward with a ticket photo. That's in MVP Phase 2.
- **OQ-10:** Program name — the prototype already brands it **"Volga Beneficios"** (not "BeneficiosApp").
  Confirm this is final before merchant-facing materials ship; copy/manifest/push-sender name hardcode it.
- **OQ-11 (NEW, Phase 2):** OCR provider — Cloudinary OCR add-on vs. a hosted vision endpoint (e.g. a Claude
  vision call) vs. Tesseract server-side. Affects cost and the auto-approval confidence threshold. Recommend
  starting with a Claude vision call (we already add `@anthropic-ai/sdk` for the bot) and tuning the threshold.
- **OQ-12 (NEW, Phase 2):** Bot autonomy — can the bot *credit* a retroactivo claim on its own, or only
  recommend + escalate? The manifesto says "resuelve ~90%"; recommend bot auto-credits only within configured
  caps/window with a readable ticket, and escalates everything else.
- **OQ-13 (§6 / Phase 2) — reframed by v3 (§0b):** With register-to-redeem, the canje is already behind a
  **verified-email** account, so caps are real without phone. Remaining question is narrower: do we add a
  verified **phone** on top of email **for retroactivo only** (auto-credited value), or skip it for the MVP?
  Recommend: skip phone in the MVP (email account + ticket OCR + caps suffice); add the phone gate later only
  if retroactivo abuse data justifies it. Affects `user_profiles.telefono` verification, not Phase 1.
- **OQ-14 (NEW, §6 / Phase 1):** Merchant budget cap (L4) — in the MVP, or MVP 2? Recommend a simple optional
  cap, **off** by default. If MVP, adds `businesses.canje_tope_mes` + an over-cap alarm.

---

*Spec v3 · 2026-06-17 · adds the registration model (§0b): no anonymous sign-in, register-to-redeem,
Google OAuth + email/password, email + Web Push as owned member channels, Ley 25.326 consent.
Spec v2 · 2026-06-16 · reconciled against `arquitectura-beneficiosapp.html`, `beneficiosapp-mvp.html`,
`benchmark-apps-beneficios.html`, `wireframes-beneficiosapp.html` (v0.1) + repo audit of `app/beneficios`.
v1 · 2026-06-12.*
