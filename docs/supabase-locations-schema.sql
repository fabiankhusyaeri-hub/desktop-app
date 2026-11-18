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

-- ------------------------------------------------------------
-- Write policies (create / update from the Location page).
--
-- SECURITY IMPLICATION — read this before running:
-- The desktop app authenticates with the publishable anon key
-- only (no end-user sign-in yet). If these policies were limited
-- to `authenticated`, every Save from the admin UI would fail
-- with 42501 (row-level security violation). So `anon` has to be
-- included while the app is key-only.
--
-- Consequence: ANYONE who obtains the publishable anon key can
-- create or modify office geofences (name, address, radius,
-- status, coordinates). The anon key is not a secret.
--
-- Remediation when auth is enforced in the app: drop `anon` from
-- both policies below and keep them `to authenticated` only, and
-- consider a service-role key for any trusted backend writer.
--
-- Note: no DELETE policy is granted — the app has no delete flow.
-- `updated_at` is set by the app (supabaseService.updateLocation),
-- not by a trigger, so the schema stays trigger-free.
-- ------------------------------------------------------------
drop policy if exists "locations_insert" on public.locations;
create policy "locations_insert"
  on public.locations for insert
  to anon, authenticated
  with check (true);

drop policy if exists "locations_update" on public.locations;
create policy "locations_update"
  on public.locations for update
  to anon, authenticated
  using (true)
  with check (true);

-- Primary geofence location for GeoAttend.
insert into public.locations (
  code, name, category, address, zone, icon, staff_count,
  radius_meters, status, lat, lng
)
values (
  'HQ-01', 'Kolam Renang Tirta Mulya', 'Primary Core',
  'Kolam Renang Tirta Mulya', 'ID-West', 'pool', 0,
  250, 'active', -6.8603952, 107.525447
)
on conflict (code) do update set
  name = excluded.name,
  category = excluded.category,
  address = excluded.address,
  zone = excluded.zone,
  icon = excluded.icon,
  radius_meters = excluded.radius_meters,
  status = excluded.status,
  lat = excluded.lat,
  lng = excluded.lng,
  updated_at = now();
