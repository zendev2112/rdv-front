-- ---------------------------------------------------------------------------
-- Phase: in-app notifications inbox (the header bell)
-- ---------------------------------------------------------------------------
-- Per-user notification feed. The benefits-INSERT webhook fans out one row per
-- member here (independent of push opt-in: the bell is in-app, so everyone sees
-- it even if they never granted browser push permission). The bell badge is the
-- count of rows with read_at IS NULL; opening the bell marks them read.
--
-- Access is server-side only (service-role via the API routes), so RLS is enabled
-- with no client policy — mirrors push_subscriptions / notifications_sent.
create table if not exists user_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text,
  url text,
  business_id uuid,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- Bell reads are always "this user's rows, newest first" — index for it.
create index if not exists user_notifications_user_created_idx
  on user_notifications (user_id, created_at desc);

alter table user_notifications enable row level security;
