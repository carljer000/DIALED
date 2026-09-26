create extension if not exists pgcrypto with schema extensions;

create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  date date not null unique default current_date,
  weight numeric(5, 2),
  target_calories integer not null check (target_calories >= 0),
  actual_calories integer not null check (actual_calories >= 0),
  target_protein integer not null check (target_protein >= 0),
  actual_protein integer not null check (actual_protein >= 0),
  steps integer not null check (steps >= 0),
  motivation text not null check (motivation in ('Low', 'Neutral', 'Dialed')),
  reflection_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.checkins is
  'Private DIALED check-ins accessed only by the Express backend.';

alter table public.checkins enable row level security;

-- The React client talks to the Express API, not the Supabase Data API.
-- Keep health and journal data unavailable to browser-facing database roles.
revoke all on table public.checkins from anon, authenticated;
