-- ===========================================================================
-- Volga Beneficios — Favoritos: own-row RLS for user_favorites
-- The table was created in 0001 with RLS enabled but NO policy, so members
-- couldn't read or write their own favorites. These policies open the
-- client/anon path for a member's own rows only.
-- Run in the beneficios Supabase project SQL editor.
-- ===========================================================================

drop policy if exists favorites_select_own on user_favorites;
create policy favorites_select_own on user_favorites
  for select using (auth.uid() = user_id);

drop policy if exists favorites_insert_own on user_favorites;
create policy favorites_insert_own on user_favorites
  for insert with check (auth.uid() = user_id);

drop policy if exists favorites_delete_own on user_favorites;
create policy favorites_delete_own on user_favorites
  for delete using (auth.uid() = user_id);
