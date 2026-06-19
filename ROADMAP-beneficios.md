# Volga Beneficios — Detailed Implementation Plan

**Companion to** `SPEC-beneficios.md` (v3, 2026-06-17). The spec says *what*; this says *in what order,
with what effort, gated by which decisions*. Reconciled against the MVP prototype + manifesto — the
redemption model is the **low-tech "mostrá la pantalla" + retroactivo con foto**, not a camera scanner
(see SPEC §0). The QR scanner is a conditional hardening track, not MVP.

**v3 (SPEC §0b) — the registration model:** **no anonymous sign-in.** Members **browse freely but register
to redeem** — the first tap on "Usar beneficio" requires an account (**Google OAuth + email/password**,
verified email). The member base + two owned channels (**email + Web Push**) are the platform's core asset
as the intermediary between users and merchants. This adds a small **Phase 1a · Accounts** in front of
Phase 1 and makes usage caps real walls (not resettable speed bumps). Consent + privacy per Ley 25.326.

**MVP 1 = public launch** (Phases 0–4): browse → use benefit (show screen) → retroactivo claim → merchant
config/dashboard → activaciones + onboarding + push. **MVP 2** (Phases 5–6): discovery + catalog.

**Effort baseline (arch doc, "1 dev fullstack senior full-time"):** MVP 1 ≈ 10–14 weeks; MVP 2 ≈ 7–9 weeks.
Solo (you + Claude): MVP 1 ≈ ~5 months. Add +20–30% for tests + unforeseen bugs, and 2–4 weeks of founding-
merchant captación that runs in parallel and gates a meaningful launch.

---

## 🗺️ Stages at a glance (the plain-language version)

**The product in one sentence:** a hyperlocal discounts club for Coronel Suárez — neighbors browse deals and
redeem one by **showing their phone at the counter**, and if anything goes wrong they snap a photo of the
receipt and still get it.

Each stage below is **one shippable milestone**: a thing a real person can do at the end of it. The
engineering detail for every stage lives further down in this doc.

### MVP 1 — the road to launch

**Stage 0 · Plumbing** *(invisible)*
- **Ships:** the database and login system.
- **Someone can now:** nothing visible — a test merchant can log in to an empty screen.
- **Why:** the foundation everything else stands on. · **Size:** small–medium.

**Stage 1a · "Become a member"** ← *register-to-redeem (v3, SPEC §0b)*
- **Ships:** sign up / log in with **Google (one tap)** or **email + password** (verified email). Browsing
  stays open to everyone; the account is required the moment you go to use a benefit. Consent checkbox +
  privacy policy.
- **Someone can now:** a neighbor creates a real account — and becomes a **reachable member** (email + push).
- **Why:** the member list and the ability to reach it are the platform's core asset. Also makes usage caps
  real instead of resettable. · **Size:** small–medium (Google is quick; email/password + consent is the bulk).

**Stage 1 · "Use a benefit"** ← *the heart, fastest value*
- **Ships:** browse deals → tap **"Usar beneficio"** (→ register if logged out) → show the screen at the
  counter → tap **"Listo, lo usé."** Plus a **"Sumar mi comercio"** button that opens WhatsApp to Geraldine.
- **Someone can now:** a neighbor actually redeems a discount; a shop owner asks to join.
- **Why:** the core loop. The moment this works, you have a product to demo. · **Size:** medium.

**Stage 2 · "Never lose a discount"** ← *the promise made real*
- **Ships:** the **retroactive claim** (photo of the receipt → auto-credited in under 5 minutes) and a
  **support bot** that answers questions and handles the tricky cases.
- **Someone can now:** if the cashier forgot or the wifi was down, the user still gets their discount —
  automatically, no human needed.
- **Why:** makes *"if you walked into the shop, you earned it"* true instead of a slogan. · **Size:** large
  (heaviest stage).

**Stage 3 · Merchant self-service**
- **Ships:** shop owners set their **hours, location, photo, and discount rules**, and see a **dashboard** of
  who's redeeming.
- **Someone can now:** you onboard merchants at scale without setting each one up by hand.
- **Why:** removes you as the bottleneck for growth. · **Size:** medium. *(Can run alongside Stages 1–2.)*

**Stage 4 · The weekly hook + push** ← *launch moment*
- **Ships:** the **"Semana de X"** themed activation tied to your video content, the **first-time onboarding**,
  and **push notifications**.
- **Someone can now:** get a notification when a new weekly promo drops and tap straight into it.
- **Why:** the retention engine — the reason people come back. **This is the public launch.** · **Size:** medium.

### ===== 🚀 PUBLIC LAUNCH (15–20 founding merchants) =====

### MVP 2 — the enriched product

**Stage 5 · Discovery**
- **Ships:** "**What's open now**" (weekends/holidays) and a "**Near me**" map.
- **Why:** the hyperlocal edge the national clubs (Club LN, Clarín 365) can't match. · **Size:** medium.

**Stage 6 · Catalog**
- **Ships:** merchants list their **products with prices and discounts** — a free digital storefront.
- **Why:** extra value for small shops with no website; some subscribe just for the visibility. · **Size:** medium.

### Later — only if needed

**QR scanner** — a real scan-gate at the counter. **Deliberately skipped for now** (the honor system +
retroactive claims is friendlier and ships faster). Add it *only if* people start gaming the "I used it" button.

### The shape of it
- **Fastest thing to show working:** Stage 0 → 1.
- **Smallest thing worth launching:** Stages 0 → 4 (MVP 1).
- **Rough effort, you + me:** ~5 months to launch (MVP 1), then ~3 more for MVP 2. With a senior dev
  full-time, ~10–14 weeks to launch.
- **Non-negotiable parallel task:** lining up 15–20 founding merchants — the build is pointless without them.

> **Stage ↔ Phase map:** Stage N = Phase N in the detailed plan below. "Stage" is the plain-language
> milestone; "Phase" is the same thing with files, endpoints, and acceptance criteria.

---

## 🚦 Decide before / during the phase that needs it

Most v1 blockers are resolved by the prototype. The ones that remain are smaller and phase-local — none
block the start of Phase 0. Decide each before its phase.

| # | Question | Needed by | Recommended default |
|---|----------|-----------|---------------------|
| OQ-1 | Keep `businesses` tables (alias `Merchant`) or rename to `merchants`? | Phase 0 | Keep + alias — zero migration risk |
| OQ-7 | Merchant login: single user or roles (dueño/cajero)? | Phase 0 | Single staff user; keep `merchant_users` N:N for later |
| OQ-10 | Confirm program name "Volga Beneficios" is final | Phase 1 (copy) | Yes — prototype already uses it |
| OQ-3 | Nav: internal 3-tab vs portal-wide bottom nav | Phase 1 | Internal 3-tab for MVP; portal-wide later |
| OQ-8 | `SorteosSection`/`NoticiasSection` mock data: wire or remove | Phase 1 | Remove during home rework |
| OQ-11 | OCR provider for tickets | Phase 2 | Claude vision call (SDK already added); tune threshold |
| OQ-12 | Can the bot auto-credit a claim, or only escalate? | Phase 2 | Auto-credit only within caps/window + readable ticket; else escalate |
| OQ-6 | Holiday calendar scope | Phase 5 | National + BA provincial; local festivals manual |
| OQ-13 | Verified **phone** on top of email, for retroactivo? | Phase 2 | Skip in MVP — email account + OCR + caps suffice; add later only if abuse data shows it |

**RESOLVED by the prototype/manifesto** (no longer open): OQ-2 (lead flow → "Sumar comercio"), OQ-9
(retroactivo *is* the offline path).
**RESOLVED in v3 (SPEC §0b):** OQ-4 — **reversed**: no lazy/anonymous account; **register-to-redeem**
(Google OAuth + email/password, verified email) gates the canje. OQ-5 — push is **account-tied**
(`push_subscriptions.user_id` NOT NULL), no anonymous opt-in. Auth method decided: **Google + email/password**.

---

## Critical path & dependency graph

```
Phase 0 (Foundations: schema + auth plumbing)
   │
   ├─► Phase 1a (Accounts: register-to-redeem — Google + email/password)   ◄── v3, gates the canje
   │       │
   │       └─► Phase 1 (Canje "mostrá la pantalla" + Sumar comercio)   ◄── MVP heart, fastest value
   │               │
   │               └─► Phase 2 (Retroactivo + bot)   ◄── makes "pisa = cumplió" real
   │
   ├─► Phase 3 (Merchant config + dashboard)   ── can overlap Phase 1/2 once Phase 0 done
   │
   └─► Phase 4 (Activaciones + onboarding + push)
            │
            ▼  ===== MVP 1 LAUNCH =====
            │
        Phase 5 (Discovery: abierto-ahora + cerca)   ── needs Phase 3 config (hours/geo)
            │
        Phase 6 (Catalog: productos)                 ── needs Phase 3 (merchant auth)
            │
        [conditional] QR-scanner hardening track     ── only if abuse data justifies it
```

The shortest line to a *demonstrable* product is **Phase 0 → 1a → Phase 1**: a member signs up, uses a
benefit, and a merchant can ask to join. Phase 2 (retroactivo) is what makes the philosophy real and should
follow immediately. Phases 3–4 complete the launch.

---

## MVP 1

> **Phases 0 & 1 have a full build-ready spec** in `BUILD-phase-0-1-beneficios.md` — DDL, RLS, auth
> plumbing, the two-Supabase-project decision, end-to-end canje flow, file/route list, and acceptance
> checklists. The summaries below are the overview; that doc is the detail.

### Phase 0 — Foundations  ·  Effort M  ·  no visible change

**Build**
- Supabase migrations: `user_profiles`, `merchant_users`, `merchant_hours`, `merchant_special_hours`,
  `redemptions`, `retro_claims`, retroactivo fields on `merchants`, `activations`, `push_subscriptions`,
  `notifications_sent`, `user_favorites`, `feriados`. Keep `businesses`/`benefits`/`leads`/`beneficios_activos`.
- RLS: anonymous reads published; user owns own `redemptions` + `retro_claims`; merchant_staff scoped to
  merchant; admin all. GIST index on `geo_lat/lon`; btree on `(merchant_id, created_at)`.
- Auth plumbing: `lib/supabase-beneficios-server.ts` (`@supabase/ssr` cookie client); `middleware.ts`
  session refresh on `/beneficios/comercio/*`; `app/beneficios/comercio/layout.tsx` guard;
  `.../comercio/ingresar/page.tsx` login. Extend `app/beneficios/types.ts` per SPEC §3.
- VAPID keys generated, stored as env vars (never committed).

**Deps** none new (`@supabase/ssr` already installed).
**Decide** OQ-1, OQ-7.
**Accept** `npm run build` green; anonymous portal byte-identical; a seeded merchant logs in and reaches an
empty `/beneficios/comercio/panel`; RLS tests prove a user cannot read another user's `redemptions`/`retro_claims`.

### Phase 1a — Accounts: register-to-redeem  ·  Effort S–M  ·  (v3, SPEC §0b) · gates the canje

**Build**
- Supabase config (beneficios project): enable **Google** provider (Google Cloud OAuth client id/secret +
  redirect URL) + **Email** provider; turn on **Resend SMTP**; **require email confirmation**.
- DB: `user_profiles` += `email`, `marketing_opt_in`, `marketing_opt_in_at`, `barrio`; set
  `redemptions.user_id` and `push_subscriptions.user_id` **NOT NULL**; **remove anonymous sign-in**.
- `app/beneficios/auth/callback/route.ts` — OAuth **code exchange** (`exchangeCodeForSession`; distinct from
  the OTP `comercio/auth/confirm` route).
- `app/beneficios/cuenta/page.tsx` — "Entrar con Google" + email/password login/registro toggle + nombre +
  **consent checkbox**; password-reset flow.
- Legal: privacy-policy page + email **unsubscribe** route (Ley 25.326).
- Session UI in `BeneficiosHeader` ("Hola, {nombre}" + Salir); `UsarBeneficioButton` **register-gate**
  (logged out → `/beneficios/cuenta?next=…`).

**Deps** none new (`@supabase/ssr` installed). **Needs** Google OAuth creds + Resend SMTP configured.
**Decide** (already decided): Google + email/password; verified email required; phone deferred (OQ-13).
**Accept** anyone browses logged-out; tapping "Usar beneficio" while logged out routes to `/cuenta`; Google
one-tap **and** confirmed email/password both create a `user_profiles` row with consent captured; the canje
endpoint rejects unauthenticated calls (`401`); "Mis canjes" is scoped by `user_id`. **~2–4 days.**

### Phase 1 — Canje "mostrá la pantalla" + Sumar comercio  ·  Effort M  ·  **MVP heart**

**Build**
- `POST /api/beneficios/canje` (metodo='mostrar'): create `redemption` with `codigo` `VB-XXXX`, `token=null`;
  per-user/benefit daily cap; **requires a registered session** (Phase 1a; no anonymous canjes).
  `PATCH` to `estado='usado'` on "Listo, lo usé".
- `app/beneficios/cupon/[id]/page.tsx` + `CuponView` / `CodigoCanje` / `MostrarPantallaHint` /
  `ConfirmarUsoButton` / `CanjeExitosoUsuario` (AhorroPill + 3 next-actions). **No TTL countdown, no QR.**
- Modify `[categoria]/[comercio]/page.tsx`: hero, "Cómo se usa", `UsarBeneficioButton`, `ReclamarConFotoButton`.
- `app/beneficios/sumar/page.tsx` (4 feature blocks + WhatsApp deep-link to Geraldine).
- Home (light pass): rubro chips + benefit feed + 3-tab internal nav; remove mock sections (OQ-8).
- `public/sw.js` → v4: precache the cupón shell so it renders offline once opened.

**Deps** none new.
**Decide** OQ-3, OQ-8, OQ-10.
**Accept** open a benefit → see code → "Listo, lo usé" records the canje and it shows in "Mis canjes";
cupón renders with wifi off; "Quiero sumar mi comercio" opens WhatsApp; build green; existing public pages intact.

### Phase 2 — Retroactivo con foto + bot  ·  Effort L  ·  the philosophy made real

> **Full build-ready spec** in `BUILD-phase-2-beneficios.md` — the decision engine, Cloudinary signed
> upload, Haiku-vision OCR, the verified-phone gate, the bot, file/route list, and acceptance checklists.
> The summary below is the overview; that doc is the detail.

**Build**
- `POST /api/beneficios/reclamar` (multipart): upload ticket → Cloudinary; run OCR → extract
  fecha/monto/comercio + confidence; if within `lapso` + under caps + OCR matches → `estado='aprobado'`,
  credit `ahorro` (< 5 min, no human); else `pendiente_humano` (escalate) / `rechazado`.
- `GET /api/beneficios/reclamar/elegibilidad` → drives screen-17 UI (dentro_lapso, horas_restantes,
  tope_restante, acepta).
- `GET/PUT /api/beneficios/comercio/retroactivo` (MerchantRetroConfig).
- `app/beneficios/reclamar/page.tsx` + `ReclamoForm` (RHF+Zod): FilosofiaBanner, ComercioSelector (prefill),
  FechaSelector (orange when fuera-de-lapso), BeneficioCard, TicketUpload (Cámara/Galería), MotivoTextarea, TopeHint.
- Retroactivo tab in config local (`RetroactivoForm`): master toggle, lapso radios (24/48/120/168h),
  tope steppers ×2, foto toggle, auto-aprobación toggle, "por qué lo recomendamos" card.
- `lib/ocrTicket.ts` (OCR provider behind one interface — swappable per OQ-11).
- `POST /api/beneficios/bot` (Claude Haiku 4.5, knowledge-base system prompt): answers FAQs, routes
  retroactivo edge cases, escalation triggers → human.

**Deps** `react-hook-form`, `zod`, `@hookform/resolvers`, `@anthropic-ai/sdk`.
**Decide** OQ-11, OQ-12.
**Accept** in-window claim + readable ticket auto-approves < 5 min; out-of-window or over-cap escalates with
the right copy; OCR mismatch routes to bot; merchant config round-trips and a disabled merchant blocks the
claim with "no acepta"; **smoke tests** on `/reclamar` (caps, lapso, OCR-mismatch, disabled) pass.

### Phase 3 — Merchant config + dashboard  ·  Effort M  ·  (can overlap Phases 1–2)

**Build**
- `app/beneficios/comercio/local/page.tsx` + `ConfigTabs` / `DatosForm` / `HorariosEditor` /
  `UbicacionPicker` (draggable pin) / `FotoForm` / `CompletitudAlert`; `GET/PUT .../comercio/local`.
- Cloudinary signed-upload route (merchant photos + product photos reuse it).
- `app/beneficios/comercio/panel/page.tsx`: SaludoComercio, StatsGrid (×4), BeneficioActivoCard,
  RetroQueue (when auto-approval off), CanjesRecientes (SWR refetch-on-focus). `GET .../comercio/dashboard`.

**Deps** Google Maps loader only if UbicacionPicker uses a map now (else defer to Phase 5).
**Accept** merchant completes datos/horarios/ubicación/foto/retroactivo; completitud alert reflects missing
pieces; hours (incl. special dates) round-trip; dashboard shows real canjes + pending retro claims.

### Phase 4 — Activaciones + onboarding + push  ·  Effort M  →  **MVP 1 LAUNCH**

**Build**
- `app/beneficios/semana/[slug]/page.tsx` (dark header, lazy video embed, meta, merchant mini-card,
  `UsarBeneficioButton`); `GET .../activaciones/[slug]`. Home: SemanaXDestacada above the feed.
- Onboarding (3 slides, shown once via localStorage): bienvenida → push permission → geo permission.
- `public/sw.js` → v5: `push` + `notificationclick` (deep link `/beneficios/semana/[slug]`).
  `POST .../push/subscribe` + `/unsubscribe`. Supabase Edge Function `send-activation-push` (cron + VAPID
  loop, logs `notifications_sent`) — keeps VAPID private key off Vercel.

**Deps** none new (web-push via Edge Function).
**Note** push is account-tied (OQ-5 resolved, §0b) — subscriptions carry `user_id`; onboarding's push slide
runs after the member has an account.
**Accept** Home shows the active Semana de X above the feed; activación plays the video + records a canje;
onboarding appears once; push opt-in works on an Android PWA; a scheduled activación fires a push that
deep-links to the activación; opt-out honored. **This is the public launch.**

---

## MVP 2

### Phase 5 — Discovery (abierto ahora + cerca de mí)  ·  Effort M

**Build**
- `lib/feriados.ts` + `feriados` seed. `GET .../abierto-ahora` (open-now from hours + special hours +
  feriados); page (con-promo / sin-promo sections); Home green banner (weekend/holiday-only, above Semana de X).
- `POST .../cerca` (GIST distance query, top 20, fallback to Coronel Suárez centro); `app/beneficios/cerca/page.tsx`
  with `MapaComercio` (numbered pins matching the list), `GeoPermissionGate`, `MapFilters` (URL state).

**Deps** `@googlemaps/js-api-loader` (lazy-loaded on `/cerca` only — protect the LCP work done earlier).
**Decide** OQ-6.
**Accept** banner absent on a weekday, present on Saturday (dev clock override); open-now honors special
hours; pins are numbered to match the list; deny-geo falls back to city centre.

### Phase 6 — Catalog (productos)  ·  Effort M

**Build**
- `comercio/productos/{page, nuevo/page, [id]/page}` + `ProductoForm` (RHF+Zod, FotoUpload, DescuentoToggle
  with live "→ Quedará en $7.225" preview, Publicar/Borrador). `GET/POST/PUT/DELETE .../comercio/productos`.
- User-side `[categoria]/[comercio]/productos` grid (2-col, -X% badges, struck prices, paraguas banner).

**Accept** merchant publishes a product with photo + discount preview; user sees it under the paraguas
banner; draft/paused states behave (paused hidden from users).

---

## Hardening track — QR scanner gating (conditional, post-MVP)

Take this on **only if** self-reported-canje abuse data justifies the friction (SPEC C-7). No schema
migration needed — `redemptions` already carries `metodo`/`token`/`expira_at`/`validado_at`.

**Build** metodo='qr' on `/canje` (token + 15-min TTL + QR via `qrcode`); atomic `POST .../canje/validar`
(single `UPDATE ... WHERE estado='pendiente' AND expira_at > now()`); scanner screen (`@zxing/browser`,
prefer native `BarcodeDetector`) with manual-code fallback + failure variants; Realtime confirmation on
screens 3/6/16. **Accept** loop works on two phones; double-scan → "ya usado"; expired → "vencido";
wrong merchant → "comercio incorrecto".

---

## Priority summary

| Priority | Phase | Why | Risk if skipped |
|----------|-------|-----|-----------------|
| 🔴 CRITICAL | 0 Foundations | Schema + auth underpin everything | Nothing else can ship |
| 🔴 CRITICAL | 1a Accounts (register-to-redeem) | The member base + reach = the platform's core asset; makes caps real | No reachable members; anonymous can't be marketed to or shown to merchants |
| 🔴 CRITICAL | 1 Canje "mostrá la pantalla" | The core user value, fastest path | No product to demo or launch |
| 🔴 HIGH | 2 Retroactivo + bot | Makes "pisa = cumplió" real; bot absorbs support | Operational promise unmet; support load on humans |
| 🟠 HIGH | 3 Merchant config + dashboard | Merchants self-serve; gates discovery | Merchants can't be onboarded at scale |
| 🟠 HIGH | 4 Activaciones + push | The retention engine + launch surface | Launch with no reason to return |
| 🟡 MEDIUM | 5 Discovery | "qué hay abierto / cerca" — the differentiator vs national clubs | Loses hyperlocal edge; still launchable |
| 🟢 LOW | 6 Catalog | Merchant vidriera digital | Works without it |
| ⚪ CONDITIONAL | QR hardening | Anti-abuse, only if needed | Adds friction against the philosophy |

---

## Next steps (this week)

1. **Direction confirmed** — MVP is the low-tech canje + retroactivo, scanner deferred (SPEC §0); **v3
   registration model** locked in (SPEC §0b): no anonymous, register-to-redeem, Google + email/password.
2. **Resolve OQ-1 + OQ-7** (schema-shaping) so Phase 0 can start clean.
3. **For Phase 1a:** create Google Cloud OAuth credentials (client id/secret + redirect URL) and configure
   Resend SMTP in the beneficios Supabase project — these are external setup steps to line up early.
4. Phase 0 migrations + auth plumbing done; Phase 1 canje flow built. **Next: Phase 1a (accounts).**
5. In parallel (non-technical): founding-merchant captación — the launch needs 15–20 merchants regardless
   of build speed.

---

*Plan v3 · 2026-06-17 · companion to SPEC-beneficios.md v3 — adds the registration model (§0b): no anonymous
sign-in, register-to-redeem (Google + email/password), Phase 1a · Accounts, email + Web Push as owned member
channels. Plan v2 · 2026-06-16. Supersedes the v1 roadmap (QR-first phasing).*
