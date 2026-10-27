-- ============================================================
-- GeoAttend / Vanguard FieldOps — office locations & geofences
-- Run this in the Supabase SQL editor once, alongside the
-- existing supabase-schema.sql. The table starts EMPTY: real
-- office sites must be added by the operator (no dummy seed).
-- ============================================================

create table if not exists public.locations (
  id            uuid primary key default gen_random_uuid(),
  code          text        not null unique,          -- e.g. HQ-01
  name          text        not null,
  category      text,                                 -- e.g. Primary Core, Distribution
  address       text,
  zone          text,                                 -- e.g. US-West-1A
  icon          text        default 'domain',         -- Material symbol name
  staff_count   int         not null default 0,       -- assigned roster size
  radius_meters int         not null default 250,     -- geofence radius
  status        text        not null default 'active' -- active | inactive | dormant
                  check (status in ('active', 'inactive', 'dormant')),
  lat           double precision,
  lng           double precision,
  last_ping_at  timestamptz,
  ping_ms       int,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.locations enable row level security;

-- Read-only access for the dashboard (same policy model as the other tables;
-- authenticated/anonymous reads allowed so the admin UI can list sites).
drop policy if exists "locations_read" on public.locations;
create policy "locations_read"
  on public.locations for select
  to anon, authenticated
  using (true);
