-- ===========================================================================
-- Volga Beneficios — Phase 1a: register-to-redeem accounts (SPEC §0b, v3)
-- ===========================================================================
-- Reverses the v2 anonymous-first model. Members register explicitly
-- (Google OAuth + email/password); there are no anonymous accounts.
--
-- DASHBOARD STEPS (not SQL — do these in the beneficios Supabase project):
--   • Authentication → Providers → Google: enable, paste OAuth client id/secret.
--   • Authentication → Providers → Email: enable, "Confirm email" = ON.
--   • Authentication → SMTP: configure Resend (BENEFICIOS_RESEND_API_KEY) with a
--     verified `from` so confirmation/reset mails deliver.
--   • Authentication → Sign In / Providers: ANONYMOUS SIGN-INS = OFF.
-- ---------------------------------------------------------------------------

-- 1. user_profiles: member identity + marketing consent (Ley 25.326) -----------
alter table user_profiles
  add column if not exists email text,
  add column if not exists marketing_opt_in boolean not null default false,
  add column if not exists marketing_opt_in_at timestamptz,
  add column if not exists barrio text;

-- Backfill email for any existing rows from auth.users.
update user_profiles up
  set email = au.email
  from auth.users au
  where au.id = up.id and up.email is null;

-- 2. redemptions.user_id → NOT NULL (no anonymous canjes) ----------------------
-- Drop any leftover rows without an owner, then tighten the FK to ON DELETE
-- CASCADE (a NOT NULL column can't be ON DELETE SET NULL) and the column to NOT NULL.
delete from redemptions where user_id is null;
alter table redemptions drop constraint if exists redemptions_user_id_fkey;
alter table redemptions
  add constraint redemptions_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;
alter table redemptions alter column user_id set not null;

-- 3. push_subscriptions.user_id → NOT NULL (push is account-tied) --------------
delete from push_subscriptions where user_id is null;
alter table push_subscriptions alter column user_id set not null;

-- 4. handle_new_user: seed the profile from signup data -----------------------
-- Copies the verified email, plus nombre + marketing consent passed in the signup
-- metadata (email/password flow). Google's metadata uses name/full_name; consent
-- for Google sign-ins is applied by the auth callback (it isn't in the OAuth data).
-- SECURITY DEFINER runs without the caller's search_path, so it must be pinned
-- and table names schema-qualified.
create or replace function public.handle_new_user()
  returns trigger language plpgsql security definer set search_path = public as $$
declare
  m jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  consent boolean := coalesce((m->>'marketing_opt_in')::boolean, false);
begin
  insert into public.user_profiles (id, email, nombre, marketing_opt_in, marketing_opt_in_at)
    values (
      new.id,
      new.email,
      coalesce(nullif(m->>'nombre',''), m->>'full_name', m->>'name'),
      consent,
      case when consent then now() else null end
    )
    on conflict (id) do update set email = excluded.email;
  return new;
end $$;
-- trigger already created in 0001; create-or-replace function is enough.
