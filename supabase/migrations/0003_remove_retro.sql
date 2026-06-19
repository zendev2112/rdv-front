-- ===========================================================================
-- Volga Beneficios — remove retroactivo feature
-- Run in the beneficios Supabase project SQL editor.
-- ===========================================================================

-- 1. Drop retro_claims policies then the table
drop policy if exists retro_select_own      on retro_claims;
drop policy if exists retro_insert_own      on retro_claims;
drop policy if exists retro_select_merchant on retro_claims;
drop table  if exists retro_claims;

-- 2. Drop retro policy columns from businesses
alter table businesses
  drop column if exists retro_activo,
  drop column if exists retro_lapso_horas,
  drop column if exists retro_tope_usuario_mes,
  drop column if exists retro_tope_comercio_mes,
  drop column if exists retro_pedir_foto,
  drop column if exists retro_aprobacion_automatica;

-- 3. Remove 'retroactivo' from redemptions.metodo check constraint
alter table redemptions drop constraint if exists redemptions_metodo_check;
alter table redemptions
  add constraint redemptions_metodo_check
  check (metodo in ('mostrar', 'qr'));
