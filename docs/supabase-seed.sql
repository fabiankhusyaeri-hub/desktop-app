-- ============================================================
-- Seed: real data for Vanguard FieldOps
-- Run after supabase-schema.sql
-- ============================================================

-- ---------- employees ----------
insert into public.employees (id, emp_id, name, email, department, role, geofence, attendance_status, attendance_time, location_state, location_detail, last_ping, gps_lat, gps_lng, gps_accuracy, distance_meters)
values
  ('EMP-8821','EMP-8821','Ahmad Rahman','ahmad.rahman@vanguardops.com','IT Engineering','Lead Development Engineer','HQ Central Hub','present','Present (08:02)','online','Online (Working)','10s ago',-6.208612,106.845694,3.2,85),
  ('EMP-9014','EMP-9014','Budi Setiawan','budi.setiawan@vanguardops.com','Design & Product','Product Designer','HQ Central Hub','present','Present (08:07)','online','Online (Working)','2m ago',-6.209258,106.844984,2.8,120),
  ('EMP-7742','EMP-7742','Dimas Pratama','dimas.pratama@vanguardops.com','Growth Marketing','Growth Marketer','HQ Central Hub','late','Late (08:24)','breach','Outside Perimeter','5m ago',-6.207579,106.842660,4.1,410),
  ('EMP-6320','EMP-6320','Rizky Ananda','rizky.ananda@vanguardops.com','IT Engineering','DevOps Specialist','HQ Central Hub','present','Present (08:00)','online','Online (Working)','1m ago',-6.209388,106.846016,2.1,40),
  ('EMP-4412','EMP-4412','Siti Nurhaliza','siti.nurhaliza@vanguardops.com','Finance & Control','Finance Analyst','HQ Central Hub','present','Present (08:14)','online','Online (Working)','3m ago',-6.208483,106.844596,3.5,95),
  ('EMP-5519','EMP-5519','Maya Indah','maya.indah@vanguardops.com','HR & People Ops','HR Business Partner','HQ Central Hub','present','Present (08:12)','online','Online (Working)','4m ago',-6.208548,106.846404,5.0,70),
  ('EMP-4389','EMP-4389','Fajar Nugraha','fajar.nugraha@vanguardops.com','Client Ops / Field','Field Operator','Field Mobile Unit','present','Present (08:45)','field','Field (Client Site)','6m ago',-6.212015,106.850520,5.0,2400),
  ('EMP-3108','EMP-3108','Dian Lestari','dian.lestari@vanguardops.com','Supply Chain','Supply Chain Analyst','South Hub','leave','Approved Leave','offline','Offline','12m ago',null,null,null,null)
on conflict (id) do update set
  name = excluded.name,
  email = excluded.email,
  department = excluded.department,
  role = excluded.role,
  attendance_status = excluded.attendance_status,
  attendance_time = excluded.attendance_time,
  location_state = excluded.location_state,
  location_detail = excluded.location_detail,
  last_ping = excluded.last_ping,
  gps_lat = excluded.gps_lat,
  gps_lng = excluded.gps_lng,
  gps_accuracy = excluded.gps_accuracy,
  distance_meters = excluded.distance_meters,
  updated_at = now();

-- ---------- telemetry ----------
insert into public.telemetry (employee_id, latitude, longitude, status, updated_at)
values
  ('EMP-8821', -6.208612, 106.845694, 'online', now()),
  ('EMP-9014', -6.209258, 106.844984, 'online', now()),
  ('EMP-7742', -6.207579, 106.842660, 'breach', now()),
  ('EMP-6320', -6.209388, 106.846016, 'online', now()),
  ('EMP-4412', -6.208483, 106.844596, 'online', now()),
  ('EMP-5519', -6.208548, 106.846404, 'online', now()),
  ('EMP-4389', -6.212015, 106.850520, 'field', now())
on conflict (employee_id) do update set
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  status = excluded.status,
  updated_at = now();

-- ---------- attendance ----------
insert into public.attendance (employee_id, clock_in, clock_out, latitude, longitude, is_inside_geofence, status, duration_minutes)
values
  ('EMP-8821', now() - interval '2 hours', now() - interval '30 minutes', -6.208612, 106.845694, true, 'Present', 90),
  ('EMP-9014', now() - interval '2 hours 5 minutes', now() - interval '25 minutes', -6.209258, 106.844984, true, 'Present', 100),
  ('EMP-7742', now() - interval '1 hour 36 minutes', null, -6.207579, 106.842660, false, 'Late', 96),
  ('EMP-6320', now() - interval '2 hours', now() - interval '20 minutes', -6.209388, 106.846016, true, 'Present', 100),
  ('EMP-4412', now() - interval '1 hour 46 minutes', now() - interval '10 minutes', -6.208483, 106.844596, true, 'Present', 96),
  ('EMP-5519', now() - interval '1 hour 48 minutes', now() - interval '15 minutes', -6.208548, 106.846404, true, 'Present', 93)
on conflict do nothing;
