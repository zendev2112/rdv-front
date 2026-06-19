-- ===========================================================================
-- Volga Beneficios — remove legacy lead-gen (leads + benefit_stats view)
-- Superseded by the register-to-redeem model (SPEC C-2 / §0b).
-- Run in the beneficios Supabase project SQL editor.
-- ===========================================================================

-- benefit_stats aggregates leads, so drop the view first.
drop view  if exists benefit_stats;
drop table if exists leads;
