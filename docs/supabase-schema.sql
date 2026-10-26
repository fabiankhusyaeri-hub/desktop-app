-- ============================================================
-- Vanguard FieldOps — Supabase schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).
-- Tables: employees, attendance, telemetry
-- ============================================================

-- ---------- employees ----------
create table if not exists public.employees (
  id            text primary key,
  emp_id        text not null unique,
  name          text not null,
  email         text,
  rfid_token    text,
  department    text,
  role          text,
  geofence      text,
  attendance_status text default 'present',
  attendance_time   text,
  location_state    text default 'online',
  location_detail   text,
  last_ping     text,
  avatar        text,
  gps_lat       double precision,
  gps_lng       double precision,
  gps_accuracy  double precision,
  distance_meters integer,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ---------- attendance ----------
create table if not exists public.attendance (
  id                  uuid primary key default gen_random_uuid(),
  employee_id         text not null references public.employees(id) on delete cascade,
  clock_in            timestamptz,
  clock_out           timestamptz,
  latitude            double precision,
  longitude           double precision,
  is_inside_geofence  boolean default true,
  status              text default 'Present',
  duration_minutes    integer,
  created_at          timestamptz default now()
);

-- ---------- telemetry ----------
create table if not exists public.telemetry (
  id          uuid primary key default gen_random_uuid(),
  employee_id text not null references public.employees(id) on delete cascade,
  latitude    double precision not null,
  longitude   double precision not null,
  status      text default 'online',
  updated_at  timestamptz default now(),
  unique (employee_id)
);

-- ---------- row level security (anon read for the dashboard) ----------
alter table public.employees  enable row level security;
alter table public.attendance enable row level security;
alter table public.telemetry  enable row level security;

drop policy if exists "anon read employees"  on public.employees;
drop policy if exists "anon read attendance" on public.attendance;
drop policy if exists "anon read telemetry"  on public.telemetry;

create policy "anon read employees"  on public.employees  for select using (true);
create policy "anon read attendance" on public.attendance for select using (true);
create policy "anon read telemetry"  on public.telemetry  for select using (true);

-- ---------- seed data ----------
insert into public.employees (id, emp_id, name, email, department, role, geofence, attendance_status, attendance_time, location_state, location_detail, last_ping, distance_meters)
values
  ('EMP-8821','EMP-8821','Ahmad Rahman','ahmad.rahman@vanguardops.com','IT Engineering','Lead Development Engineer','HQ Central Hub','present','Present • 08:02','online','Online (Working)','10s ago',85),
  ('EMP-9014','EMP-9014','Budi Setiawan','budi.setiawan@vanguardops.com','Design & Product','Product Designer','HQ Central Hub','present','Present • 08:07','online','Online (Working)','2m ago',120),
  ('EMP-7742','EMP-7742','Dimas Pratama','dimas.pratama@vanguardops.com','Growth Marketing','Growth Marketer','HQ Central Hub','late','Late • 08:24','breach','Outside Perimeter','5m ago',410),
  ('EMP-6320','EMP-6320','Rizky Ananda','rizky.ananda@vanguardops.com','IT Engineering','DevOps Specialist','HQ Central Hub','present','Present • 08:00','online','Online (Working)','1m ago',40),
  ('EMP-4412','EMP-4412','Siti Nurhaliza','siti.nurhaliza@vanguardops.com','Finance & Control','Finance Analyst','HQ Central Hub','present','Present • 08:14','online','Online (Working)','3m ago',95),
  ('EMP-5519','EMP-5519','Maya Indah','maya.indah@vanguardops.com','HR & People Ops','HR Business Partner','HQ Central Hub','present','Present • 08:12','online','Online (Working)','4m ago',70),
  ('EMP-4389','EMP-4389','Fajar Nugraha','fajar.nugraha@vanguardops.com','Client Ops / Field','Field Operator','Field Mobile Unit','present','Present • 08:45','field','Field (Client Site)','6m ago',2400),
  ('EMP-3108','EMP-3108','Dian Lestari','dian.lestari@vanguardops.com','Supply Chain','Supply Chain Analyst','South Hub','leave','Approved Leave','offline','Offline','12m ago',null)
on conflict (id) do nothing;
-- ---------- telemetry seed ----------
insert into public.telemetry (employee_id, latitude, longitude, status, updated_at)
values
  ('EMP-8821', -6.208612, 106.845694, 'online', now()),
  ('EMP-9014', -6.209258, 106.844984, 'online', now()),
  ('EMP-7742', -6.207579, 106.842660, 'breach', now()),
  ('EMP-6320', -6.209388, 106.846016, 'online', now()),
  ('EMP-4412', -6.208483, 106.844596, 'online', now()),
  ('EMP-5519', -6.208548, 106.846404, 'online', now()),
  ('EMP-4389', -6.212015, 106.850520, 'field', now())
on conflict (employee_id) do nothing;
