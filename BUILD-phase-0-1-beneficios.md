# Build Spec — Phase 0, Phase 1a & Phase 1 (Volga Beneficios)

**Companion to** `ROADMAP-beneficios.md` (Stages/Phases 0–1) and `SPEC-beneficios.md` **v3**.
This is the build-ready elaboration of the first phases, grounded in the **actual** repo code
(audited 2026-06-16). Where this contradicts the higher-level docs, this doc is the more precise one.

> **v3 update (2026-06-17, SPEC §0b) — the registration model.** The original v1 of this doc assumed
> **anonymous sign-in** ("browse with zero friction, an invisible account materializes at canje time").
> **That is reversed.** There is **no anonymous sign-in.** Members **browse freely but must register to
> redeem** — the first tap on "Usar beneficio" requires an account via **Google OAuth + email/password**
> (verified email). This adds **Phase 1a · Accounts** (below) between Phase 0 and Phase 1, makes
> `redemptions.user_id` / `push_subscriptions.user_id` **NOT NULL**, and turns usage caps into real walls.
> All anonymous-account language in the sections below has been updated; §0.5 (formerly "Lazy / anonymous
> accounts") is now the profile-trigger setup only.

**Grounding facts from the audit** (so nothing below is invented):
- Beneficios runs on its **own Supabase project**, separate from the portal's main project:
  - Beneficios env: `NEXT_PUBLIC_BENEFICIOS_SUPABASE_URL`, `NEXT_PUBLIC_BENEFICIOS_SUPABASE_ANON_KEY`,
    `BENEFICIOS_SUPABASE_SERVICE_ROLE_KEY`. Clients in `lib/supabase-beneficios.ts`
    (`supabaseBeneficios` anon, `supabaseBeneficiosAdmin` service-role). **No auth today** — anon read,
    service-role write.
  - Main portal env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. `middleware.ts` already
    uses `@supabase/ssr` `createServerClient` against the **main** project to protect `/admin`.
- `@supabase/ssr` **0.6.1 is installed and in use** (main project) — the cookie-client pattern to copy
  already exists in `middleware.ts`.
- Existing data model: view `beneficios_activos`; tables `businesses`, `benefits` (has
  `limite_tipo` + `limite_cantidad` — **caps already modeled**), `leads`.
- Existing user→business "solicitar" lead flow: `app/api/beneficios/solicitar/route.ts` →
  `leads` table + Resend email + `wa.me` link + client-side PDF (`html2canvas`+`jsPDF`). Wired via
  `BenefitCard` ("Quiero este beneficio") → `SolicitarModal`.
- `tsconfig.json`: `strict: false` globally. New beneficios files should be written strict-clean.
- Detail page `app/beneficios/[categoria]/[comercio]/page.tsx` is an RSC using `generateStaticParams`
  (ISR/static). It reads `beneficios_activos` via the anon client.

---

## ⚠️ The one decision that gates Phase 0: where does auth live?

User + merchant accounts must live in the **same Supabase project as the beneficios data** (`redemptions`,
`retro_claims`, `merchants`) so that **Row Level Security can reference `auth.uid()`** against those rows.
That is the **beneficios project**, not the main portal project.

Consequence: we add a **second** `@supabase/ssr` cookie-client — one pointed at the beneficios project —
living alongside the existing main-project client in `middleware.ts`. The two are independent sessions
(different cookies, different JWTs). This is normal and supported; it just has to be deliberate.

| Option | What it means | Verdict |
|---|---|---|
| **A — Auth on beneficios project** | RLS on `redemptions`/`retro_claims`/`merchants` uses `auth.uid()` natively. Second SSR client + cookie namespace. | ✅ **Recommended.** It's the only option where RLS protects the new tables without cross-project plumbing. |
| B — Auth on main project | One session for the whole portal, but beneficios RLS can't see `auth.uid()` (different DB). Would need to pass user id as a trusted claim + service-role writes everywhere. | ❌ Loses RLS as the enforcement layer — the whole security model in SPEC §3. |

**→ Decision DEC-A (confirm before Phase 0): auth on the beneficios project, second SSR cookie-client.**
Everything below assumes DEC-A.

---

# PHASE 0 — Foundations

**Goal:** the schema, RLS, and auth plumbing exist on the beneficios project; a seeded merchant can log in;
**nothing user-facing changes** and the anonymous portal is byte-identical.

**Non-goals:** no canje, no merchant forms, no UI beyond a bare login + empty panel.

### 0.1 — Decisions to lock first
- **DEC-A** (above): auth on beneficios project. *Required.*
- **OQ-1** — keep `businesses` tables and alias them as `Merchant` in app types (recommended), vs. rename to
  `merchants`. Recommended: **keep + alias** (the live view + 3 routes depend on `businesses`). The new
  retroactivo policy columns get added **to `businesses`** in that case.
- **OQ-7** — merchant login model. Recommended: **single staff user per comercio for MVP**, but create the
  `merchant_users` (N:N) table now so roles can come later without migration.

### 0.2 — Database migrations (beneficios project)

Proposed DDL derived from SPEC §3. **Confirm against `docs/09-arquitectura-tecnica.md` (the 800-line doc) if
it has canonical SQL** — treat this as the working draft, not gospel. All new tables get RLS enabled.

> Naming note (OQ-1): below uses the existing `businesses` table (aliased `Merchant` in TS). If OQ-1 chooses
> a rename, swap `businesses` → `merchants` throughout and migrate the view + 3 routes.

```sql
-- 1. user_profiles — extends auth.users (beneficios project)
--    v3 (§0b): registered members only; email + marketing consent captured.
create table user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text,
  email text,                           -- mirror of auth.users.email (verified)
  telefono text,                        -- optional; only verified for retroactivo (L5)
  rol text not null default 'user' check (rol in ('user','merchant_staff','admin')),
  marketing_opt_in boolean not null default false,   -- Ley 25.326 consent (email/push novedades)
  marketing_opt_in_at timestamptz,
  barrio text,
  push_opt_in boolean not null default false,
  geo_opt_in boolean not null default false,
  created_at timestamptz not null default now()
);

-- 2. merchant_users — N:N staff↔comercio (OQ-7: present now, single-role in MVP)
create table merchant_users (
  user_id uuid references auth.users(id) on delete cascade,
  business_id uuid references businesses(id) on delete cascade,
  rol text not null default 'staff' check (rol in ('owner','staff')),
  primary key (user_id, business_id)
);

-- 3. retroactivo policy columns ON businesses (screen 18)
alter table businesses
  add column retro_activo boolean not null default true,
  add column retro_lapso_horas int not null default 48 check (retro_lapso_horas in (24,48,120,168)),
  add column retro_tope_usuario_mes int not null default 1,
  add column retro_tope_comercio_mes int not null default 10,
  add column retro_pedir_foto boolean not null default true,
  add column retro_aprobacion_automatica boolean not null default true,
  add column geo_lat double precision,
  add column geo_lon double precision;

-- 4. merchant_hours / merchant_special_hours (screen 14 — used by discovery later,
--    created now so the schema is complete; can stay empty until Phase 3)
create table merchant_hours (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  dia int not null check (dia between 0 and 6),   -- 0 = domingo
  abierto boolean not null default true,
  franjas jsonb not null default '[]'             -- [{desde:"08:30",hasta:"13:00"}, ...]
);
create table merchant_special_hours (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  fecha date not null,
  motivo text,
  abierto boolean not null default false,
  franjas jsonb not null default '[]'
);

-- 5. redemptions — the canje record (metodo carries us into the QR phase w/o migration)
create table redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,  -- v3: NOT NULL, no anon canjes
  benefit_id uuid not null references benefits(id),
  business_id uuid not null references businesses(id),
  activacion_id uuid references activations(id),
  metodo text not null default 'mostrar' check (metodo in ('mostrar','qr','retroactivo')),
  codigo text not null,                 -- 'VB-7421' human reference
  token text,                           -- only for metodo='qr'
  estado text not null default 'pendiente'
        check (estado in ('pendiente','usado','validado','vencido','cancelado')),
  expira_at timestamptz,                -- only for metodo='qr'
  validado_at timestamptz,              -- set by merchant scan (qr)
  ahorro_estimado numeric,
  created_at timestamptz not null default now()
);
create index on redemptions (business_id, created_at desc);
create index on redemptions (user_id, created_at desc);

-- 6. retro_claims — retroactive claims (screens 17/18), Phase 2 uses it, created now
create table retro_claims (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  business_id uuid not null references businesses(id),
  benefit_id uuid not null references benefits(id),
  fecha_compra date not null,
  monto numeric,
  ticket_url text not null,
  ocr jsonb,                            -- {fecha,monto,comercio,confianza}
  motivo_usuario text,
  estado text not null default 'pendiente_humano'
        check (estado in ('aprobado','pendiente_humano','rechazado')),
  ahorro_acreditado numeric,
  resuelto_at timestamptz,
  created_at timestamptz not null default now()
);

-- 7. activations / push_subscriptions / notifications_sent / user_favorites / feriados
--    (Phases 4–5 use these; create now for a complete schema. Abbreviated.)
create table activations ( id uuid primary key default gen_random_uuid(),
  slug text unique not null, titulo text not null, descripcion text,
  business_id uuid references businesses(id), benefit_id uuid references benefits(id),
  video_url text, fecha_inicio date, fecha_fin date,
  estado text not null default 'programada', canjes_count int not null default 0 );
create table push_subscriptions ( id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,   -- v3: account-tied, NOT NULL
  endpoint text not null unique, keys jsonb not null, created_at timestamptz default now() );
create table notifications_sent ( id uuid primary key default gen_random_uuid(),
  activation_id uuid references activations(id), enviadas int, fecha timestamptz default now() );
create table user_favorites ( user_id uuid references auth.users(id) on delete cascade,
  business_id uuid references businesses(id) on delete cascade,
  created_at timestamptz default now(), primary key (user_id, business_id) );
create table feriados ( fecha date primary key, nombre text not null,
  tipo text not null check (tipo in ('nacional','provincial','local')) );
```

### 0.3 — Row Level Security (the real enforcement layer)

Enable RLS on every new table; the existing public read path (`beneficios_activos` via anon) stays as-is.

```sql
alter table redemptions enable row level security;
alter table retro_claims enable row level security;
alter table user_profiles enable row level security;
-- ... (all new tables)

-- A user sees & creates only their own canjes
create policy redemptions_select_own on redemptions
  for select using (auth.uid() = user_id);
create policy redemptions_insert_own on redemptions
  for insert with check (auth.uid() = user_id);

-- A user sees & files only their own retro claims
create policy retro_select_own on retro_claims
  for select using (auth.uid() = user_id);
create policy retro_insert_own on retro_claims
  for insert with check (auth.uid() = user_id);

-- Merchant staff see canjes/claims for THEIR comercio (via merchant_users)
create policy redemptions_select_merchant on redemptions
  for select using (exists (
    select 1 from merchant_users mu
    where mu.user_id = auth.uid() and mu.business_id = redemptions.business_id));

-- Merchant staff edit only their own comercio row
create policy businesses_update_own on businesses
  for update using (exists (
    select 1 from merchant_users mu
    where mu.user_id = auth.uid() and mu.business_id = businesses.id));

-- Own profile
create policy profiles_self on user_profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);
```
> Server routes that must bypass RLS (e.g. retroactivo auto-credit) keep using the **service-role** client
> with explicit ownership checks in code. RLS protects the *client/anon* paths.

### 0.4 — Auth plumbing (code)

New/changed files:

- **`lib/supabase-beneficios-server.ts`** *(new)* — cookie-aware server client for the **beneficios**
  project, mirroring the `createServerClient` usage already in `middleware.ts` but with the beneficios URL +
  anon key and a distinct cookie namespace (e.g. prefix `vb-`). Exposes a helper to read the current
  session/user in RSC + route handlers.
- **`lib/supabase-beneficios.ts`** *(keep)* — anon + admin clients stay for public reads / service writes.
- **`middleware.ts`** *(extend, carefully)* — add a second `createServerClient` for the beneficios project
  that refreshes the beneficios session, and **extend the matcher** to include `/beneficios/comercio/:path*`
  (and the merchant API routes). Do **not** touch the existing main-project block or the `/admin` matcher.
  Keep the two sessions in separate cookies.
- **`app/beneficios/comercio/layout.tsx`** *(new)* — server component auth guard for the merchant segment:
  read the beneficios session; if none → `redirect('/beneficios/comercio/ingresar')`; if logged-in but not
  `merchant_staff` → render a "no autorizado" state.
- **`app/beneficios/comercio/ingresar/page.tsx`** *(new)* — minimal **merchant-staff** login (email
  magic-link or email+password via beneficios Supabase Auth). This is the **merchant** area only — distinct
  from the **member** auth (Google + email/password) added in **Phase 1a**. Mail provider config lives in the
  beneficios project's Auth settings (Resend SMTP).
- **`app/beneficios/types.ts`** *(extend)* — add `Rol`, `UserProfile`, `Merchant` (alias of the
  `businesses` row + retro fields), `MerchantHours`, `MerchantSpecialHours`, `MerchantRetroConfig`,
  `Redemption`, `RetroClaim` per SPEC §3. Write these strict-clean.

### 0.5 — Profile-on-signup trigger (foundation for Phase 1a)
> **v3 reversal:** **Anonymous sign-in is NOT enabled** (the v1 "account materializes at canje time" plan is
> dropped — SPEC §0b). Members register explicitly in Phase 1a. Make sure anonymous sign-ins are **off** in
> the beneficios project's Auth settings.

What Phase 0 *does* set up is the **profile-on-signup trigger** so that every account created in Phase 1a
(Google or email/password) automatically gets a `user_profiles` row — copying the verified email across so it
lands in the member stack. `SECURITY DEFINER` functions must pin `search_path` (a SECURITY DEFINER function
runs without the caller's search_path, so unqualified table names fail).

```sql
-- create a profile row automatically for every new auth user, copying the verified email
create or replace function public.handle_new_user()
  returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.user_profiles (id, email)
    values (new.id, new.email)
    on conflict (id) do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();
```

### 0.6 — Seed script
A `scripts/seed-beneficios.ts` (run with service-role key) that inserts: 1 test merchant user +
`merchant_users` link to an existing `businesses` row; a couple of `merchant_hours`; 2–3 `feriados`; one
`activations` row. Lets Phases 1–4 be exercised without hand-data.

### 0.7 — Dependencies & config
- **Pin** `@supabase/supabase-js` explicitly in `package.json` (currently transitive). No other new deps in
  Phase 0 (`@supabase/ssr` already present).
- Note the deprecated `@supabase/auth-helpers-nextjs@0.10.0` is installed but unused by this work — leave it.
- **Generate VAPID keys** now (used in Phase 4); store as env vars, never commit.
- New env vars: none required beyond the existing beneficios trio (the second SSR client reuses
  `NEXT_PUBLIC_BENEFICIOS_SUPABASE_URL` + `..._ANON_KEY`).

### 0.8 — Acceptance criteria
- [ ] `npm run build` green; `npm run start` serves the anonymous portal **byte-identical** to before.
- [ ] All MVP tables exist with RLS **enabled**; `beneficios_activos`/`businesses`/`benefits`/`leads` untouched.
- [ ] RLS proof: signed-in user A **cannot** select user B's `redemptions` or `retro_claims` (tested via the
      anon client with two sessions).
- [ ] Seeded merchant logs in at `/beneficios/comercio/ingresar` and reaches an empty
      `/beneficios/comercio/panel` (guarded; logged-out visitor is redirected).
- [ ] Anonymous sign-ins are **disabled**; the profile trigger creates a `user_profiles` row (with `email`
      copied) for any new auth user (verified by a test signup).
- [ ] The main-project `/admin` auth still works (middleware regression check).

### 0.9 — Risks
- **Two SSR sessions in one middleware** — cookie collisions if namespaces aren't distinct. Mitigate: prefix
  beneficios cookies; unit-check both `/admin` and `/beneficios/comercio` guards after the change.
- **RLS lockout** — a wrong policy can make the service-role seed look fine but break anon reads. Mitigate:
  keep public reads on the **view** (unchanged) and test anon read paths in CI/manually after enabling RLS.
- **Schema drift vs docs/09** — confirm column names against the canonical SQL doc before migrating.

---

# PHASE 1a — Accounts: register-to-redeem  (v3, SPEC §0b)

**Goal:** members can **sign up / log in with Google (one tap) or email + password (verified email)**.
Browsing stays open to everyone; the account becomes mandatory the moment they go to use a benefit. Consent
is captured at signup; the member lands in the data stack (email + push reach). Effort **S–M (~2–4 days)** —
Google is quick; the email/password confirmation + reset + consent surface is the bulk.

**Non-goals:** no phone/WhatsApp OTP (deferred, OQ-13); no merchant changes (the merchant login is separate,
Phase 0). No marketing-send tooling yet (that admin surface ships with Phase 4 push).

### 1a.1 — External setup (do this first; it gates the build)
- **Google OAuth:** in Google Cloud Console create an OAuth 2.0 client (Web), set the authorized redirect URI
  to the beneficios project's `…/auth/v1/callback`, copy client id + secret into **Supabase → Auth →
  Providers → Google** (beneficios project). Add the prod + localhost origins.
- **Email provider:** enable **Email** in the same Auth providers screen; **require email confirmation**
  (Confirm email = on).
- **SMTP:** configure **Resend** as the custom SMTP sender in Auth → Settings (uses the existing
  `BENEFICIOS_RESEND_API_KEY`; set a verified `from` on the sending domain) so confirmation + password-reset
  mails actually deliver. Without this, Supabase's default mailer is rate-limited to near-zero in prod.
- Confirm **anonymous sign-ins are OFF** (Phase 0 §0.5).

### 1a.2 — Auth flows
```
Browse (anonymous, public catalog) ── tap "Usar beneficio" ─► logged in? ─yes─► POST /canje (Phase 1)
                                                                  │
                                                                  └─no─► /beneficios/cuenta?next=<cupón intent>
   /cuenta:
     • "Entrar con Google"  → supabase.auth.signInWithOAuth({ provider:'google',
                                redirectTo: /beneficios/auth/callback?next=… })
                              → Google → /auth/callback (code exchange) → back to `next`
     • Email/password (toggle Login | Registrarse)
         - Registrarse: nombre + email + password + CONSENT checkbox → signUp({email,password,
                          options:{ data:{ nombre }, emailRedirectTo:/auth/callback?next=… }})
                          → "revisá tu mail para confirmar" → user clicks link → /auth/callback → `next`
         - Login: signInWithPassword({email,password})
         - "Olvidé mi contraseña" → resetPasswordForEmail(email, { redirectTo:/auth/callback?next=/cuenta })
```
The OAuth + email-confirmation + reset links all return through **one** callback that exchanges the code for a
session cookie and forwards to `next`.

### 1a.3 — Routes & pages (new)
- **`app/beneficios/auth/callback/route.ts`** — `GET`: read `code` (+ `next`), call
  `supabase.auth.exchangeCodeForSession(code)` on the **beneficios** server client (sets the session cookie),
  then `redirect(next ?? '/beneficios')`. This is the **PKCE code-exchange** callback — distinct from the
  merchant OTP `comercio/auth/confirm` route (which uses `verifyOtp`). Exempt it in `middleware.ts` (runs
  while still unauthenticated), like the merchant `auth` route already is.
- **`app/beneficios/cuenta/page.tsx`** (server shell) + **`CuentaForm` (client)** — "Entrar con Google"
  button + email/password form with a Login | Registrarse toggle; registro adds `nombre` + a **consent
  checkbox** ("Acepto recibir novedades de Volga Beneficios") + link to the privacy policy; "olvidé mi
  contraseña" link. Reads `?next=` and threads it through every auth call. On signup, persist `nombre` +
  `marketing_opt_in` (+ `marketing_opt_in_at`) to `user_profiles` (the trigger creates the row with `email`;
  the client/route updates the consent fields).
- **`app/beneficios/privacidad/page.tsx`** — privacy policy (Ley 25.326): what's collected, why, the two
  channels (email/push), and how to opt out / request deletion.
- **`app/api/beneficios/baja/route.ts`** (or a `/beneficios/baja` page) — **unsubscribe** endpoint linked
  from every marketing email; flips `marketing_opt_in=false`. Honor it without requiring login (signed token
  in the link).

### 1a.4 — Session UI & the register gate
- **`BeneficiosHeader`** — show "Hola, {nombre}" + **Salir** when a session exists; a discreet "Ingresar"
  link otherwise. Session read via a thin client provider hydrated from the server session.
- **`UsarBeneficioButton`** (the Phase-1 component) — when **logged out**, instead of acting it routes to
  `/beneficios/cuenta?next=<intent to use this benefit>`; when logged in it proceeds to POST the canje
  (Phase 1 §1.5). This is the register-to-redeem gate.

### 1a.5 — Dependencies
None new (`@supabase/ssr` already installed). External config only (Google creds, Resend SMTP).

### 1a.6 — Acceptance criteria
- [ ] A logged-out visitor can browse the catalog; tapping **"Usar beneficio"** routes to `/beneficios/cuenta`
      carrying the intent (`next`).
- [ ] **Google** sign-in (one tap) returns through `/auth/callback`, sets the session, and lands back on the
      benefit; a `user_profiles` row exists with the verified `email`.
- [ ] **Email/password** registro sends a confirmation mail (Resend), the link confirms and signs in; an
      **unconfirmed** account cannot use a benefit.
- [ ] **Password reset** mail arrives and lets the user set a new password.
- [ ] The **consent checkbox** value is stored in `user_profiles.marketing_opt_in` (+ timestamp); the privacy
      policy is linked; an unsubscribe link flips it back off without login.
- [ ] `POST /api/beneficios/canje` returns **401 `no_autenticado`** when called without a session.
- [ ] "Hola, {nombre}" + Salir render when logged in; the main-project `/admin` auth is unaffected.
- [ ] `npm run build` green.

### 1a.7 — Risks & notes
- **SMTP is the silent blocker** — email/password is useless in prod until Resend SMTP is wired; verify a real
  send before relying on it. Google sign-in works without SMTP (covers most users), so ship Google first.
- **Two cookie sessions** — member auth and the dormant merchant auth are the **same** beneficios project but
  conceptually different roles; both ride the beneficios cookie. The `/auth/callback` (member) and
  `comercio/auth/confirm` (merchant) routes must both be middleware-exempt.
- **Consent is load-bearing legally** (Ley 25.326) — don't pre-check the box; store the timestamp; make
  unsubscribe one-click. Marketing sends (Phase 4) must filter on `marketing_opt_in = true`.
- **`next` open-redirect** — validate that `next` is a relative `/beneficios/...` path before redirecting.

---

# PHASE 1 — Canje "mostrá la pantalla" + Sumar comercio

**Goal:** a neighbor can browse, open a benefit, tap **"Usar beneficio ahora"**, see a code, show the screen,
and tap **"Listo, lo usé"** (recorded in *Mis canjes*); a prospective merchant taps **"Quiero sumar mi
comercio"** → WhatsApp to Geraldine. This is the MVP heart — first demonstrable value.

**Non-goals:** no scanner, no QR, no TTL, no server validation of the canje (it's self-reported — SPEC §0).
No retroactivo yet (Phase 2). No merchant config/dashboard (Phase 3).

### 1.1 — Decisions to lock first
- **OQ-4 (RESOLVED, v3 §0b):** **register-to-redeem** — tapping "Usar beneficio" while logged out routes to
  `/beneficios/cuenta` (Phase 1a). No anonymous sign-in; the canje requires a real session. The signup wall
  sits exactly at the value moment, not at browse.
- **OQ-3:** nav — use the prototype's **3-tab internal nav** (Beneficios · Mis canjes · Sumar comercio) for
  MVP; defer portal-wide nav.
- **OQ-8:** remove `SorteosSection` + `NoticiasSection` (mock data) during this home pass.
- **OQ-10:** confirm the brand string is **"Volga Beneficios"** before this copy ships.
- **Fate of the existing `solicitar` flow (refines SPEC §0):** the current `solicitar`/`leads` flow is a
  *user→business* lead ("Quiero este beneficio" → wa.me to the shop). It is **not** the same as the new
  *merchant→Geraldine* "Sumar comercio". Recommendation: **replace** the user-side "Quiero este beneficio"
  CTA on the benefit detail with "Usar beneficio ahora" (the new canje), and **keep `solicitar`/`leads` +
  `SolicitarModal` dormant but intact** as a transitional fallback (don't delete — it still works). "Sumar
  comercio" is a brand-new, separate page/flow.

### 1.2 — End-to-end flow ("mostrá la pantalla")

```
Benefit detail ──tap "Usar beneficio ahora"──► logged out? ─► /beneficios/cuenta?next=… (Phase 1a)
   │                                                              └─ after login, returns here ─┐
   │  (logged in) ◄──────────────────────────────────────────────────────────────────────────┘
   └─► POST /api/beneficios/canje { benefit_id, activacion_id? }
          • check cap from benefits.limite_tipo + limite_cantidad (count this user's
            redemptions for this benefit in the window) → 409 'ya_canjeado' if exceeded
          • generate unique codigo 'VB-XXXX'
          • insert redemption { user_id, benefit_id, business_id, metodo:'mostrar',
                                codigo, estado:'pendiente', ahorro_estimado? }
          • return { redemption }
   │
   └─► router.push(`/beneficios/cupon/[id]`)
          • CuponView shows logo + name + descuento + big codigo + "Mostrá esta pantalla
            en el local" + philosophy line
          • persist redemption to localStorage (offline render)
   │
   └─► tap "Listo, lo usé" ──► PATCH /api/beneficios/canje/[id] { estado:'usado' }
          • → CanjeExitosoUsuario: "Ahorraste $X" + 3 next-actions
```

### 1.3 — API routes (new)

- **`app/api/beneficios/canje/route.ts`** — `POST` (auth: **registered user required**, v3 §0b).
  - Read session via the Phase-0 server client; if none → `401 { error: 'no_autenticado' }` (the UI gates
    logged-out users to `/beneficios/cuenta` before reaching here, so this is defense-in-depth).
  - **Cap logic** (reuse existing fields): map `benefits.limite_tipo` →
    `ilimitado` (no check) · `por_dia`/`por_semana`/`por_mes` (count this user's `redemptions` for this
    `benefit_id` since start-of-window) · `total` (count all-time). Compare to `limite_cantidad`. Over →
    `409 { error: 'ya_canjeado' }`. (Soft anti-fraud — philosophy resolves for the user; cap is the only gate.)
  - **Codigo**: `VB-` + a short unique suffix (e.g. base32 of a counter or a random 4-char, retried on
    unique-violation). Stored, not validated — it's a reference for the cashier.
  - Insert with service-role admin client (or the user-scoped client; either works since RLS insert-policy
    allows own rows). Return the row.
  - `410 { error: 'beneficio_vencido' }` if `fecha_fin < today`.
- **`app/api/beneficios/canje/[id]/route.ts`** — `PATCH` `{ estado:'usado' }` (auth: owner). Marks the canje
  used (the self-report). Also the place to bump `activations.canjes_count` when `activacion_id` present.
- **`app/api/beneficios/canje/route.ts`** — `GET` (auth: user) for the *Mis canjes* tab: the user's
  redemptions joined to business name/logo + benefit title, newest first.

### 1.4 — Pages & components (new)

- **`app/beneficios/cupon/[id]/page.tsx`** (server shell) + **`CuponView` (client)**:
  `MerchantHeader` (logo, nombre, descuentoLabel) · `CodigoCanje` (big, centered `VB-XXXX`) ·
  `MostrarPantallaHint` ("Mostrá esta pantalla en el local" + "Con que estés acá, el beneficio es tuyo") ·
  `ConfirmarUsoButton` ("Listo, lo usé" → PATCH → swaps to `CanjeExitosoUsuario`). **No `TTLCountdown` in
  MVP.** `CanjeExitosoUsuario`: `AhorroPill` ("Ahorraste $1.275") + 3 `AccionSiguiente` (calificar /
  compartir wa.me / cerca — the "cerca" action can be a stub link until Phase 5).
- **`app/beneficios/mis-canjes/page.tsx`** (the prototype's 2nd tab): server-render the user's canje list
  from the `GET /canje` route; empty state = *"Todavía no usaste ningún beneficio."*
- **`app/beneficios/sumar/page.tsx`** (3rd tab): `SumarHero` + 4 `BeneficioFeature` blocks (te ven los
  vecinos / clientes nuevos / medís lo que pasa / precio fundador) + `SumarCTA` → WhatsApp deep-link to
  Geraldine (reuse `BENEFICIOS_WHATSAPP_NUMBER`).

### 1.5 — Modify the benefit detail page
`app/beneficios/[categoria]/[comercio]/page.tsx` + `BenefitCard.tsx`:
- Replace the **"Quiero este beneficio"** button (currently opens `SolicitarModal`) with:
  - primary **`UsarBeneficioButton`** (client) — if logged out, routes to `/beneficios/cuenta?next=…`
    (Phase 1a register gate); if logged in, POSTs the canje and pushes to the cupón page;
  - ghost **`ReclamarConFotoButton`** — links to `/beneficios/reclamar` (the page lands in Phase 2; in Phase 1
    it can route to a "próximamente" stub or be feature-flagged off).
- Add the "Cómo se usa" copy block ("Tocá 'Usar beneficio' y mostrá la pantalla en la caja…").
- Keep `SolicitarModal`/`solicitar`/`leads` in the tree, dormant (transitional fallback — see 1.1).

### 1.6 — Home (light pass)
`app/beneficios/page.tsx` + components:
- Add **rubro chips** (category filter, URL `?cat=`) above the benefit feed (reuse `CategoryFilter`/
  `CategoryScroller`).
- Switch the bottom nav to the **3-tab internal** nav (Beneficios · Mis canjes · Sumar comercio).
- **Remove** `SorteosSection` + `NoticiasSection` (OQ-8). Leave the Semana de X block as a placeholder slot —
  it gets wired in Phase 4 (don't build the activación page yet).

### 1.7 — Service Worker v4 (offline cupón)
`public/sw.js` → v4: precache the cupón shell route + assets so a generated cupón **renders with no signal**
(the counter moment). The codigo itself is already in `localStorage` from 1.2. Cache-bust the SW version
string so existing installs update.

### 1.8 — Dependencies
None new for Phase 1. (RHF/Zod arrive in Phase 2/3 with real forms; the canje "form" is two buttons.)

### 1.9 — Acceptance criteria
- [ ] Logged-out visitor taps "Usar beneficio ahora" → routed to `/beneficios/cuenta`; after registering
      (Phase 1a) they return and land on the cupón with a unique `VB-XXXX`; a `redemptions` row exists tied to
      their `user_id`.
- [ ] "Listo, lo usé" flips the canje to `estado='usado'`; it appears in **Mis canjes**.
- [ ] Re-using past a benefit's `limite_tipo`/`limite_cantidad` returns `409 'ya_canjeado'` with a friendly message.
- [ ] An expired benefit (`fecha_fin` past) returns `410 'beneficio_vencido'`.
- [ ] The cupón page **renders offline** (DevTools → offline → reload).
- [ ] "Quiero sumar mi comercio" opens WhatsApp to Geraldine with a prefilled message.
- [ ] Home shows rubro chips + feed + 3-tab nav; `Sorteos`/`Noticias` mock sections gone; existing public
      category/detail pages still build (ISR intact).
- [ ] `npm run build` green.

### 1.10 — Risks & notes
- **Self-reported canje is trust-based** (intentional — SPEC C-7). With register-to-redeem the canje is now
  tied to a real `user_id`, so the per-benefit cap is a **real wall** (not resettable by clearing cookies);
  still monitor for abuse, don't add friction pre-emptively.
- **ISR + auth interaction** — the detail page stays static (ISR); the canje button is a client island that
  checks the session and either routes to `/cuenta` or POSTs at click time, so static generation is unaffected.
- **`ReclamarConFotoButton` lands before Phase 2** — feature-flag it (env or a const) so it's hidden until the
  `/reclamar` page exists, or point it at a "próximamente" stub.

---

## Suggested build order (all three phases)

1. DEC-A + OQ-1 + OQ-7 confirmed → write migrations (0.2) + RLS (0.3) on a beneficios **branch/staging** DB.
2. Profile-on-signup trigger (0.5; anonymous sign-ins **off**); seed script (0.6).
3. Server client + middleware extension + merchant layout/login (0.4) → **Phase 0 acceptance**.
4. **Phase 1a:** external setup (Google creds + Resend SMTP, 1a.1) → `/auth/callback` + `/cuenta` +
   privacy/unsubscribe (1a.3) → session UI + register gate (1a.4) → **Phase 1a acceptance**.
5. `POST/PATCH/GET /canje` routes (1.3) with cap logic + the `401 no_autenticado` guard.
6. Cupón page + `CuponView` + offline `localStorage` (1.4); SW v4 (1.7).
7. Detail-page swap to `UsarBeneficioButton` register gate (1.5); Mis canjes (1.4); Sumar comercio (1.4).
8. Home light pass (1.6) → **Phase 1 acceptance**.

*Build spec v2 · 2026-06-17 · adds Phase 1a (register-to-redeem accounts, SPEC §0b): no anonymous sign-in,
Google OAuth + email/password, `user_id` NOT NULL, consent/privacy. v1 · 2026-06-16 · grounded in repo audit
of `app/beneficios`, `lib/supabase-beneficios.ts`, `middleware.ts`, `package.json`. Confirm SQL against
`docs/09-arquitectura-tecnica.md` before migrating.*
