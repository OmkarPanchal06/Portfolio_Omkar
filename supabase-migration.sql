-- ============================================================
-- Portfolio Analytics — Supabase SQL Migration
-- ============================================================
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor).
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE.
-- ============================================================

-- 1. Create the analytics table
create table if not exists public.analytics_visits (
  id          uuid primary key default gen_random_uuid(),
  visitor_id  text not null,
  path        text not null,
  created_at  timestamptz not null default now(),
  day         date not null
);

-- 2. Indexes for efficient querying
create index if not exists idx_analytics_visits_visitor_id
  on public.analytics_visits (visitor_id);

create index if not exists idx_analytics_visits_day
  on public.analytics_visits (day);

create index if not exists idx_analytics_visits_created_at
  on public.analytics_visits (created_at);

create index if not exists idx_analytics_visits_path
  on public.analytics_visits (path);

-- 3. Enable Row Level Security
alter table public.analytics_visits enable row level security;

-- 4. Revoke all public access (no anon policies = no public access)
-- RLS with no policies means only the service role can read/write.
-- This is intentional: analytics are private.

-- 5. Optional: retention cleanup function (run via cron or manually)
-- Deletes events older than 90 days.
create or replace function public.cleanup_old_analytics()
returns void
language plpgsql
security definer
as $$
begin
  delete from public.analytics_visits
  where created_at < now() - interval '90 days';
end;
$$;

-- To schedule automatic cleanup (requires pg_cron extension):
-- select cron.schedule('cleanup-analytics', '0 3 * * *', 'select public.cleanup_old_analytics()');

-- ============================================================
-- Environment variables required (server-side only):
--   SUPABASE_URL              = https://<project-ref>.supabase.co
--   SUPABASE_SERVICE_ROLE_KEY = <service-role-secret-key>
--
-- These must NEVER be exposed to the browser. Only use them in
-- server-side API routes (track, stats).
-- ============================================================
