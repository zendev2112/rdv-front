-- ============================================================================
-- Volga Beneficios — MVP schema (Phase 0)
-- Run against the BENEFICIOS Supabase project (NEXT_PUBLIC_BENEFICIOS_SUPABASE_URL),
-- NOT the main portal project. Apply via the Supabase SQL editor or `supabase db push`.
--
-- Decisions baked in (see SPEC §10 / ROADMAP):
--   OQ-1: keep the existing `businesses` table; add merchant columns to it (aliased
--         `Merchant` in app types). No rename.
--   OQ-7: single staff user per comercio for MVP, but the N:N `merchant_users` table
--         is created now so roles can come later without a migration.
--   §6.5: + user_profiles.telefono_verificado (L5) and retro_claims.ticket_hash (dedupe).
--
-- Idempotent: safe to re-run. Confirm column/table names against
-- docs/09-arquitectura-tecnica.md before treating this as canonical.
-- ============================================================================

-- gen_random_uuid()
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- 1. user_profiles — extends auth.users
-- ---------------------------------------------------------------------------
create table if not exists user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text,
  telefono text,
  telefono_verificado boolean not null default false,   -- §6 L5 (gates retroactivo)
  rol text not null default 'user' check (rol in ('user','merchant_staff','admin')),
  push_opt_in boolean not null default false,
  geo_opt_in boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2. merchant_users — N:N staff <-> comercio (single-role in MVP, OQ-7)
-- ---------------------------------------------------------------------------
create table if not exists merchant_users (
  user_id uuid references auth.users(id) on delete cascade,
  business_id uuid references businesses(id) on delete cascade,
  rol text not null default 'staff' check (rol in ('owner','staff')),
  created_at timestamptz not null default now(),
  primary key (user_id, business_id)
);

-- ---------------------------------------------------------------------------
-- 3. retroactivo policy + geo columns ON businesses (screen 18)
-- ---------------------------------------------------------------------------
alter table businesses add column if not exists retro_activo boolean not null default true;
alter table businesses add column if not exists retro_lapso_horas int not null default 48
  check (retro_lapso_horas in (24,48,120,168));
alter table businesses add column if not exists retro_tope_usuario_mes int not null default 1;
alter table businesses add column if not exists retro_tope_comercio_mes int not null default 10;
alter table businesses add column if not exists retro_pedir_foto boolean not null default true;
alter table businesses add column if not exists retro_aprobacion_automatica boolean not null default true;
alter table businesses add column if not exists geo_lat double precision;
alter table businesses add column if not exists geo_lon double precision;

-- ---------------------------------------------------------------------------
-- 4. merchant hours (used by discovery, Phase 5 — created now for a complete schema)
-- ---------------------------------------------------------------------------
create table if not exists merchant_hours (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  dia int not null check (dia between 0 and 6),         -- 0 = domingo
  abierto boolean not null default true,
  franjas jsonb not null default '[]'                   -- [{desde:"08:30",hasta:"13:00"}, ...]
);

create table if not exists merchant_special_hours (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  fecha date not null,
  motivo text,
  abierto boolean not null default false,
  franjas jsonb not null default '[]'
);

-- ---------------------------------------------------------------------------
-- 5. activations — "Semana de X" (Phase 4). Created before redemptions (FK).
-- ---------------------------------------------------------------------------
create table if not exists activations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  titulo text not null,
  descripcion text,
  business_id uuid references businesses(id),
  benefit_id uuid references benefits(id),
  video_url text,
  fecha_inicio date,
  fecha_fin date,
  estado text not null default 'programada'
    check (estado in ('programada','activa','finalizada')),
  canjes_count int not null default 0
);

-- ---------------------------------------------------------------------------
-- 6. redemptions — the canje. `metodo` carries us into the QR phase w/o migration.
-- ---------------------------------------------------------------------------
create table if not exists redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  benefit_id uuid not null references benefits(id),
  business_id uuid not null references businesses(id),
  activacion_id uuid references activations(id),
  metodo text not null default 'mostrar' check (metodo in ('mostrar','qr','retroactivo')),
  codigo text not null,                                 -- 'VB-7421' human reference
  token text,                                           -- only for metodo='qr'
  estado text not null default 'pendiente'
    check (estado in ('pendiente','usado','validado','vencido','cancelado')),
  expira_at timestamptz,                                -- only for metodo='qr'
  validado_at timestamptz,
  ahorro_estimado numeric,
  created_at timestamptz not null default now()
);
create index if not exists redemptions_business_created_idx on redemptions (business_id, created_at desc);
create index if not exists redemptions_user_created_idx on redemptions (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- 7. retro_claims — retroactive claims (Phase 2). ticket_hash for dedupe (§6).
-- ---------------------------------------------------------------------------
create table if not exists retro_claims (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  business_id uuid not null references businesses(id),
  benefit_id uuid not null references benefits(id),
  fecha_compra date not null,
  monto numeric,
  ticket_url text not null,
  ticket_hash text,                                     -- one-claim-per-receipt (§6)
  ocr jsonb,                                            -- {fecha,monto,comercio,confianza}
  motivo_usuario text,
  estado text not null default 'pendiente_humano'
    check (estado in ('aprobado','pendiente_humano','rechazado')),
  ahorro_acreditado numeric,
  resuelto_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists retro_user_created_idx on retro_claims (user_id, created_at desc);
create unique index if not exists retro_user_ticket_uidx
  on retro_claims (user_id, ticket_hash) where ticket_hash is not null;

-- ---------------------------------------------------------------------------
-- 8. push / favorites / feriados (Phases 4–5)
-- ---------------------------------------------------------------------------
create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  endpoint text not null unique,
  keys jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists notifications_sent (
  id uuid primary key default gen_random_uuid(),
  activation_id uuid references activations(id),
  enviadas int,
  fecha timestamptz not null default now()
);

create table if not exists user_favorites (
  user_id uuid references auth.users(id) on delete cascade,
  business_id uuid references businesses(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, business_id)
);

create table if not exists feriados (
  fecha date primary key,
  nombre text not null,
  tipo text not null check (tipo in ('nacional','provincial','local'))
);

-- ---------------------------------------------------------------------------
-- 9. Row Level Security
--    Public reads keep flowing through the `beneficios_activos` view (anon),
--    untouched. Service-role writes bypass RLS. These policies guard the
--    client/anon paths for the new tables.
-- ---------------------------------------------------------------------------
alter table user_profiles enable row level security;
alter table merchant_users enable row level security;
alter table redemptions enable row level security;
alter table retro_claims enable row level security;

-- The remaining tables have no client-facing read/write path in the MVP — all
-- access is server-side via the service-role key (which bypasses RLS). Enable RLS
-- now for a secure default; narrow read/own-row policies are added in the phases
-- that use them (feriados/activations public reads in Phases 4–5, user_favorites
-- own-row in Phase 3).
alter table merchant_hours enable row level security;
alter table merchant_special_hours enable row level security;
alter table activations enable row level security;
alter table push_subscriptions enable row level security;
alter table notifications_sent enable row level security;
alter table user_favorites enable row level security;
alter table feriados enable row level security;

-- user_profiles: own row only
drop policy if exists profiles_self on user_profiles;
create policy profiles_self on user_profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- merchant_users: staff see their own links
drop policy if exists merchant_users_self on merchant_users;
create policy merchant_users_self on merchant_users
  for select using (auth.uid() = user_id);

-- redemptions: a user sees & creates only their own canjes
drop policy if exists redemptions_select_own on redemptions;
create policy redemptions_select_own on redemptions
  for select using (auth.uid() = user_id);
drop policy if exists redemptions_insert_own on redemptions;
create policy redemptions_insert_own on redemptions
  for insert with check (auth.uid() = user_id);
drop policy if exists redemptions_update_own on redemptions;
create policy redemptions_update_own on redemptions
  for update using (auth.uid() = user_id);

-- redemptions: merchant staff see canjes for THEIR comercio
drop policy if exists redemptions_select_merchant on redemptions;
create policy redemptions_select_merchant on redemptions
  for select using (exists (
    select 1 from merchant_users mu
    where mu.user_id = auth.uid() and mu.business_id = redemptions.business_id));

-- retro_claims: a user sees & files only their own
drop policy if exists retro_select_own on retro_claims;
create policy retro_select_own on retro_claims
  for select using (auth.uid() = user_id);
drop policy if exists retro_insert_own on retro_claims;
create policy retro_insert_own on retro_claims
  for insert with check (auth.uid() = user_id);

-- retro_claims: merchant staff see claims for THEIR comercio
drop policy if exists retro_select_merchant on retro_claims;
create policy retro_select_merchant on retro_claims
  for select using (exists (
    select 1 from merchant_users mu
    where mu.user_id = auth.uid() and mu.business_id = retro_claims.business_id));

-- ---------------------------------------------------------------------------
-- 10. Auto-create a profile row for every new auth user (incl. anonymous sign-ins)
-- ---------------------------------------------------------------------------
-- `set search_path = public` + schema-qualified table are REQUIRED: a SECURITY
-- DEFINER trigger on auth.users runs without public in its search_path, so an
-- unqualified `user_profiles` would not be found and the auth-user insert would
-- fail with "Database error creating new user".
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.user_profiles (id) values (new.id) on conflict do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
