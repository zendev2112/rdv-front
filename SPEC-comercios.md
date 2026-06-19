# SPEC — Volga Beneficios Comercios (merchant app)

The merchant-facing side of Volga Beneficios. Lives in the **same Next.js app**,
under `/beneficios/comercio/*`, sharing the beneficios Supabase project, auth, and
components. It is **not** a separate project.

Its job is to make the redemption (canje) **accountable**: instead of the customer
self-reporting "I used it," the **merchant** confirms the canje from their own
authenticated device. That single change turns the `redemptions` table from "what
customers clicked" into "what merchants honored."

---

## Roles & the two apps

| | Customer app `/beneficios` | Merchant app `/beneficios/comercio` |
|---|---|---|
| Browse / save / claim benefits | ✅ | — |
| Issues the cupón, renders the QR, emails it | ✅ | — |
| Logs in (magic link), validates canjes | — | ✅ |
| Sees their redemption count | — | ✅ |
| Creates/edits offers | ❌ (admin does it) | ❌ Wave 2 |

The merchant app **consumes** QRs; it never generates them.

---

## Auth & identity (already built)

- Magic-link login at `/beneficios/comercio/ingresar` → callback
  `/beneficios/comercio/auth/confirm` → `(guard)` route group.
- Protected by `middleware.ts` (`/beneficios/comercio/:path*`, exempting
  `ingresar` + `auth`) **and** the `(guard)/layout.tsx` server check (defense in
  depth).
- **Identity → business:** the `merchant_users(user_id, business_id, rol)` junction
  links an auth user to one or more businesses. A merchant can only ever see and
  validate canjes for **their own** `business_id`(s). Enforced **server-side**, not
  in the UI.
- One login per **shop device** (the counter tablet/phone stays logged in). Magic
  link round-trips can't happen mid-sale, so the device must already be logged in.

---

## The redemption lifecycle

`redemptions.estado` (CHECK already allows all of these — no migration needed):

```
pendiente ──(merchant validates)──▶ validado     ← Wave 1 happy path
pendiente ──(benefit fecha_fin passed)──▶ vencido (derived, shown as ✗)
usado        ← legacy self-report state; treated as "already used"
cancelado    ← reserved
```

- A canje is created `pendiente` at **claim time** (POST `/api/beneficios/canje`).
- The merchant's validation flips it to `validado` and stamps `validado_at`.
- `usado` (the old customer self-report) and `validado` are both "already used"
  everywhere downstream (Mis canjes, CanjeCard).

The QR/manual code is the canje's **unguessable UUID** (`redemptions.id`). The short
human `codigo` (`VB-XXXX`) is for reading aloud / manual entry only — too guessable
for a URL.

---

## Wave 1 — Validate + view (this build)

### Customer side
- **In-app QR** on the cupón page (`/beneficios/cupon/[id]`). The QR encodes
  `…/beneficios/comercio/validar/{redemption.id}`. The short `codigo` stays visible
  as the manual-entry fallback.
- The customer's **"Listo, lo usé" self-report button is removed** — the merchant is
  now the source of truth. The cupón just shows the QR + code (pendiente) or a "ya
  usado" confirmation (validado/usado).
- **Emailed QR** (best-effort): on claim, send the cupón by email via Resend — QR as
  an attachment (works offline once downloaded) + the `codigo` as text + a link to
  the cupón. Non-blocking: a mail failure never fails the canje. *Deliverability
  needs a verified Resend domain — see "Operator actions."*

### Merchant side (`/beneficios/comercio`)
- **`/validar/[id]`** — the scan landing. The customer's QR opens this URL in the
  merchant's phone camera (no scanner app). Server resolves the merchant's
  business(es), loads the canje, and shows one of:
  - **Listo para validar** → preview (comercio · beneficio) + big **CONFIRMAR CANJE**
    button.
  - ✗ **No es de tu comercio** / **Ya usado** (with when) / **Vencido** / **No existe**.
- **`/validar`** — the hub: a manual `codigo` entry (for when the camera won't
  cooperate) + instructions. Resolving a code lands on the same `/validar/[id]`
  confirm screen.
- **`/panel`** — the merchant home: redemption count (hoy / 7 días) + a recent-canjes
  list, read-only. This is the *value* handed to merchants: proof of foot traffic.

### Validation rules (server, `POST /api/beneficios/comercio/validar`)
In order; first failure wins:
1. Merchant authenticated? else 401.
2. Canje exists? else 404.
3. `canje.business_id` ∈ merchant's businesses? else 403 `ajeno`.
4. `estado === 'pendiente'`? else 409 `ya_validado`.
5. Benefit not past `fecha_fin`? else 410 `vencido`.
6. Flip `estado → 'validado'`, `validado_at = now()` — guarded with
   `WHERE estado = 'pendiente'` so a double-scan can't double-count.

The flip uses the **service-role admin client** (the canje belongs to another user, so
RLS won't let the merchant update it) — ownership is enforced in code **before** the
write.

### One-time vs recurring
Wave 1 assumes **one-time**: validation *burns* the token. Recurring benefits ("siempre
10%", where a scan logs a visit instead of burning) are a later flag.

---

## Wave 2 — Self-serve content (later, NOT this build)

Merchants edit their own profile + create/edit benefits, with a **moderation gate**:
`borrador → en_revisión → (admin approves) → publicado`. The customer app only reads
`publicado`. Images go to a Supabase Storage bucket scoped to the merchant. The
existing admin becomes the review queue. Onboarding (how merchants get added) is
designed then; for now the operator adds merchants manually.

---

## Operator actions (outside the code)
- **Seed merchants:** create an auth user per shop and insert
  `merchant_users(user_id, business_id, rol='owner')`. Until a merchant is linked,
  the panel/validar show "no tenés un comercio asociado."
- **Resend:** to make emailed cupones deliver, verify a sending domain in Resend and
  set `BENEFICIOS_EMAIL_FROM` (e.g. `Volga Beneficios <cupones@tu-dominio>`). Without
  it, claims still work; only the email is skipped.
- No new SQL migration is required for Wave 1.
