-- ===========================================================================
-- Volga Beneficios — favorites are per-BENEFIT, not per-comercio
-- Bug: hearting one benefit lit up every benefit of the same business, because
-- user_favorites was keyed by business_id. Re-key on benefit_id. (Table is
-- empty, so a clean recreate is safe.)
-- Run in the beneficios Supabase project SQL editor.
-- ===========================================================================

drop table if exists user_favorites;

create table user_favorites (
  user_id    uuid not null references auth.users(id) on delete cascade,
  benefit_id uuid not null references benefits(id)   on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, benefit_id)
);

alter table user_favorites enable row level security;

drop policy if exists favorites_select_own on user_favorites;
create policy favorites_select_own on user_favorites
  for select using (auth.uid() = user_id);

drop policy if exists favorites_insert_own on user_favorites;
create policy favorites_insert_own on user_favorites
  for insert with check (auth.uid() = user_id);

drop policy if exists favorites_delete_own on user_favorites;
create policy favorites_delete_own on user_favorites
  for delete using (auth.uid() = user_id);
