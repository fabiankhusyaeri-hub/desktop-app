# API.md: Kontrak REST API dan Socket.io GeoAttend

Kontrak data antara **Admin Desktop**, **aplikasi mobile pegawai**, dan **backend**. Dokumen ini adalah **sumber tunggal** bentuk payload; `AGENTS.md`, `auth.md`, `security.md`, dan `PRD-admin.md` merujuk ke sini.

| Atribut | Detail |
|---|---|
| Versi kontrak | 1.0-draft |
| Status | **Usulan, belum disetujui backend.** Seluruh bagian bertanda **[SINKRONKAN]** harus dikonfirmasi sebelum implementasi |
| Base URL REST | `https://api.perusahaan.id/v1` `[ISI]` |
| Base URL WebSocket | `wss://api.perusahaan.id` `[ISI]` |
| CORS origin desktop | `app://`, `file://`, atau origin kustom yang diizinkan dari Electron (`app://<bundle-name>`, `file://` pada devtools) |
| Konsumen | Admin Desktop (utama), Mobile (Bagian 6 dan 14.5) |

Perubahan pada dokumen ini mengikuti aturan di Bagian 17.

---

## 1. Konvensi Umum

### 1.1 Format

| Aspek | Aturan |
|---|---|
| Transport | HTTPS (TLS 1.3); `ws://` dan HTTP polos hanya untuk `localhost` saat pengembangan |
| Konten | `application/json; charset=utf-8` (kecuali unggah/unduh berkas) |
| Penamaan | Properti JSON `snake_case`; path `kebab-case`; enum `lower_snake_case` |
| Waktu | **ISO 8601 UTC** dengan `Z`: `2026-10-09T01:02:14Z`. Klien menampilkan dalam zona waktu kantor (WIB) |
| Tanggal kerja | `YYYY-MM-DD` dalam zona waktu kantor (`work_date`) |
| ID | String berawalan tipe: `usr_`, `emp_`, `att_`, `off_`, `shf_`, `alt_`, `cor_`, `exp_`, `brd_`, `aud_` |
| Koordinat | `lat` (-90..90) dan `lng` (-180..180), derajat desimal, maksimum 7 digit di belakang koma |
| Jarak dan akurasi | Meter, bilangan riil: `distance_m`, `accuracy_m` |
| Durasi | Menit bulat: `duration_minutes`, `late_minutes` |
| Null | Properti opsional yang tidak ada diberi `null` (bukan dihilangkan) pada objek respons |
| Tenant | Ditentukan dari token; klien **tidak** mengirim `tenant_id` |

### 1.2 Header

| Header | Arah | Keterangan |
|---|---|---|
| `Authorization: Bearer <access_token>` | Request | Wajib kecuali endpoint publik |
| `Origin` | Request | Wajib pada CORS untuk Electron/webview; server hanya mengizinkan `app://`, `file://`, atau origin tertentu yang dikonfigurasi. |
| `X-Request-Id` | Request/Response | UUID; server membuat bila klien tidak mengirim; dicatat di log dan galat |
| `Idempotency-Key` | Request | Wajib pada `POST` yang membuat catatan kehadiran dan disarankan pada `POST` lain yang membuat sumber daya; UUID v4 |
| `If-Match: <version>` | Request | Wajib pada `PATCH`/`PUT`/aksi ubah atas sumber daya yang memiliki `version` (kunci optimistik) |
| `X-App-Version`, `X-App-Platform` | Request | Mis. `1.0.3`, `win32`/`darwin`/`linux`/`android`/`ios`; dipakai untuk versi minimum. Untuk desktop, renderer harus selalu menyisipkan header ini pada setiap request HTTP (Axios/Fetch). |
| `Retry-After` | Response | Detik, pada `429` dan `503` |
| `X-RateLimit-Limit/Remaining/Reset` | Response | Informasi pembatasan laju |

Catatan khusus Electron/Admin Desktop:
- Setiap instance HTTP client di renderer (Axios, Fetch, atau wrapper custom) WAJIB menyertakan `X-App-Version` dan `X-App-Platform` pada setiap request, termasuk `GET /auth/me`, `GET /live/employees`, `GET /alerts`, dan rekonsiliasi saat reconnect.
- Nilai `X-App-Platform` untuk aplikasi desktop adalah platform runtime OS: `win32`, `darwin`, atau `linux`.
- `Origin` pada request desktop harus cocok dengan konfigurasi CORS backend; jika app memakai custom protocol, server harus memetakan origin tersebut ke daftar yang diizinkan, bukan membolehkan semua origin.

### 1.3 Bentuk respons

**Sukses**

```json
{ "success": true, "data": { }, "meta": { } }
```

`meta` hanya ada pada daftar (paginasi) atau bila diperlukan.

**Galat**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Data tidak valid.",
    "details": [ { "field": "radius_m", "code": "OUT_OF_RANGE", "message": "Radius harus 20-1000." } ],
    "request_id": "7b1f0c2e-..."
  }
}
```

- `message` hanya untuk log/diagnostik; klien menampilkan teks Bahasa Indonesia dari `src/i18n/` berdasarkan `code`.
- `details` opsional (galat validasi per kolom).
- Server **tidak** mengembalikan stack trace.

### 1.4 Paginasi, pengurutan, penyaringan

**Offset (tabel):** `?page=1&page_size=25` (default 25, maksimum 100)

```json
"meta": { "page": 1, "page_size": 25, "total": 128, "total_pages": 6 }
```

**Cursor (aliran besar: audit log, aliran kehadiran):** `?cursor=<opaque>&limit=50` (maksimum 200)

```json
"meta": { "next_cursor": "eyJ...", "has_more": true }
```

**Urutan:** `?sort=field` atau `?sort=-field` (menurun); beberapa kolom dipisah koma. Daftar kolom yang boleh diurutkan ditentukan per endpoint.

**Filter:** parameter bernama (`department_id`, `status`, `from`, `to`, `q`); nilai jamak dipisah koma (`status=late,absent`). Pencarian teks `q` minimal 2 karakter.

### 1.5 Kode status HTTP

| Status | Arti |
|---|---|
| 200 | Sukses (baca/ubah) |
| 201 | Dibuat (`Location` berisi URL sumber daya) |
| 202 | Diterima untuk diproses asinkron (ekspor, impor) |
| 204 | Sukses tanpa isi |
| 400 | Permintaan salah bentuk (`BAD_REQUEST`, `VALIDATION_ERROR`) |
| 401 | Tidak terautentikasi atau token tidak valid/kedaluwarsa |
| 403 | Tidak punya hak (`FORBIDDEN`) |
| 404 | Tidak ditemukan atau di luar cakupan akses |
| 409 | Konflik (`VERSION_CONFLICT`, duplikat, periode terkunci) |
| 410 | Sumber daya kedaluwarsa (mis. tautan unduh) |
| 422 | Valid secara bentuk tetapi melanggar aturan bisnis |
| 423 | Akun terkunci |
| 426 | Versi aplikasi tidak lagi didukung (`UPGRADE_REQUIRED`) |
| 429 | Batas laju terlampaui |
| 5xx | Galat server |

### 1.6 Hak akses

Singkatan peran: `EXE` = executive, `MGR` = manager, `HR` = hr_admin, `SA` = super_admin, `EMP` = employee (mobile). Kolom **Peran** pada tiap endpoint menunjukkan peran yang **boleh** mengakses. Peran `MGR` selalu dibatasi ke **departemennya**; di luar cakupan, server mengembalikan `404` (bukan `403`) untuk sumber daya tunggal dan menyaring hasil pada daftar.

Instruksi khusus untuk UI Desktop/Admin Desktop:
- Jika peran pengguna adalah `EXE`, komponen Peta Pemantauan Langsung (Live Map) dan seluruh opsi pelacakan posisi individu harus otomatis disembunyikan atau dinonaktifkan di renderer, bahkan bila data atau komponen masih tersedia di state.
- Jika peran pengguna adalah `MGR`, filter departemen pada UI Desktop harus terkunci secara otomatis ke departemennya. UI tidak boleh mengizinkan pemilihan departemen di luar cakupan tersebut.
- UI wajib memeriksa hak akses pada setiap render, bukan hanya pada level API; ini berfungsi sebagai pengaman dan UX yang konsisten.

---

## 2. Galat Global

| Kode | HTTP | Keterangan |
|---|---|---|
| `BAD_REQUEST` | 400 | Bentuk permintaan salah |
| `VALIDATION_ERROR` | 400 | Validasi kolom gagal (`details`) |
| `INVALID_CREDENTIALS` | 401 | Kredensial salah |
| `MFA_REQUIRED` | 401 | Perlu kode MFA |
| `MFA_INVALID` | 401 | Kode MFA salah/kedaluwarsa |
| `TOKEN_EXPIRED` | 401 | Access token kedaluwarsa (klien refresh) |
| `TOKEN_INVALID` | 401 | Token tidak sah |
| `SESSION_REVOKED` | 401 | Sesi dicabut |
| `REFRESH_REUSED` | 401 | Refresh token dipakai ulang; seluruh keluarga dicabut |
| `ACCOUNT_DISABLED` | 403 | Akun nonaktif |
| `FORBIDDEN` | 403 | Peran tidak berhak |
| `NOT_FOUND` | 404 | Tidak ditemukan/di luar cakupan |
| `VERSION_CONFLICT` | 409 | `If-Match` tidak cocok; respons memuat `details.current_version` |
| `DUPLICATE` | 409 | Duplikat (ID karyawan, email) |
| `PERIOD_LOCKED` | 409 | Periode payroll terkunci |
| `BUSINESS_RULE` | 422 | Pelanggaran aturan bisnis (`details[].code` menjelaskan) |
| `ACCOUNT_LOCKED` | 423 | Akun terkunci; `details.retry_after_s` |
| `UPGRADE_REQUIRED` | 426 | Versi aplikasi di bawah minimum |
| `RATE_LIMITED` | 429 | Terlalu banyak permintaan |
| `INTERNAL_ERROR` | 500 | Galat server |
| `SERVICE_UNAVAILABLE` | 503 | Layanan sementara tidak tersedia |

---

## 3. Model Data

### 3.1 Enumerasi

| Enum | Nilai |
|---|---|
| `role` | `employee`, `manager`, `hr_admin`, `super_admin`, `executive` |
| `employee_status` | `invited`, `active`, `inactive` |
| `attendance_status` | `present`, `late`, `in_progress`, `completed`, `completed_early`, `absent`, `approved_leave`, `flagged` |
| `attendance_flag` | `adjusted`, `pending_correction`, `needs_review`, `offline_sync`, `outside_radius`, `manual_override` |
| `verification_method` | `gps_geofence`, `remote_gps`, `device_biometric`, `manual_override` |
| `perimeter` | `inside`, `outside`, `unknown` |
| `presence` | `online`, `offline` |
| `risk_level` | `low`, `medium`, `high` |
| `alert_type` | `check_in`, `check_out`, `late`, `outside_radius`, `mock_location`, `device_integrity`, `teleport`, `correction_requested`, `offline_long` |
| `alert_severity` | `info`, `warning`, `critical` |
| `correction_status` | `pending`, `approved`, `rejected`, `cancelled` |
| `correction_type` | `missed_check_in`, `missed_check_out`, `wrong_time`, `wrong_location`, `other` |
| `export_status` | `queued`, `processing`, `ready`, `failed`, `expired` |

Pemetaan status ke tampilan UI (warna, label) ada di `DESIGN.md` dan `PRD-admin.md` Bagian 5.2.

### 3.2 Objek inti

**Employee**

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | string | `emp_...` |
| `employee_id` | string | ID karyawan unik per tenant (mis. `EMP-8821`) |
| `name`, `email`, `phone` | string | |
| `avatar_url` | string/null | |
| `department` | `{ id, name }` | |
| `position` | string | |
| `manager_id` | string/null | |
| `shift` | `{ id, name }` | |
| `offices` | `[{ id, name }]` | Lokasi kerja yang diizinkan |
| `status` | `employee_status` | |
| `joined_on` | string (tanggal) | |
| `device` | `{ platform, app_version, registered_at }`/null | Perangkat terdaftar (device binding) |
| `version` | integer | Untuk `If-Match` |
| `created_at`, `updated_at` | string | |

**AttendanceRecord**

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | string | `att_...` |
| `employee` | `{ id, employee_id, name, department_id, avatar_url }` | |
| `work_date` | string (tanggal) | Tanggal mulai shift |
| `shift` | `{ id, name, start, end }` | `start`/`end` jam `HH:mm` |
| `check_in` | `AttendancePunch`/null | |
| `check_out` | `AttendancePunch`/null | |
| `duration_minutes` | integer/null | |
| `late_minutes` | integer | 0 bila tepat waktu |
| `status` | `attendance_status` | |
| `flags` | `[attendance_flag]` | |
| `note` | string/null | Catatan check-out |
| `version` | integer | |

**AttendancePunch**

| Kolom | Tipe | Catatan |
|---|---|---|
| `at` | string | Timestamp server (UTC) |
| `lat`, `lng`, `accuracy_m` | number | Hanya untuk peran yang berhak melihat lokasi individual (lihat 1.6 dan Bagian 5) |
| `distance_m` | number | Jarak ke pusat kantor (dihitung server) |
| `office` | `{ id, name }` | |
| `verification` | `[verification_method]` | |
| `risk` | `{ level, score, reason_codes }` | `score` dan `reason_codes` hanya `HR` dan `SA`; `MGR` hanya `level` |

**LocationUpdate** (juga payload event `update_employee_location`)

| Kolom | Tipe | Catatan |
|---|---|---|
| `event_id` | string | UUID; untuk deduplikasi |
| `employee_id` | string | `emp_...` |
| `seq` | integer | Berurutan naik per pegawai (untuk urutan dan abaikan data lama) |
| `recorded_at` | string | Timestamp server saat diterima |
| `lat`, `lng`, `accuracy_m` | number | |
| `office_id` | string/null | Kantor acuan |
| `distance_m` | number/null | |
| `perimeter` | `perimeter` | |
| `on_shift` | boolean | Pegawai dalam sesi kerja |
| `device` | `{ battery_pct, network }`/null | Opsional, hanya bila pegawai mengizinkan |

**Alert**

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | string | `alt_...` |
| `type` | `alert_type` | |
| `severity` | `alert_severity` | |
| `employee` | `{ id, employee_id, name, department_id }` | |
| `at` | string | |
| `attendance_id` | string/null | |
| `details` | object | Bergantung `type` (mis. `distance_m`, `risk_level`) |
| `handled` | `{ by, at, note }`/null | |

**Office**: `id`, `name`, `address`, `lat`, `lng`, `radius_m` (20-1000), `timezone`, `active`, `version`.

**Shift**: `id`, `name`, `start`, `end`, `work_days` (`[1..7]`, Senin=1), `crosses_midnight`, `break_minutes`, `late_tolerance_minutes` (0-120), `version`.

**Correction**: `id`, `attendance_id`, `employee`, `type`, `requested_by`, `reason`, `proposed` (`{ check_in_at, check_out_at }`), `attachments` (`[{ id, name, url }]`), `status`, `decided_by`, `decided_at`, `decision_note`, `due_at` (SLA), `version`.

**AuditEntry**: `id`, `at`, `actor` (`{ id, name, role }`), `action` (mis. `employee.update`, `location.view`, `export.create`), `object` (`{ type, id }`), `before`, `after`, `ip`, `request_id`.

---

## 4. Autentikasi

Rincian alur, token, dan perilaku klien ada di `auth.md`. Ringkasan endpoint:

| Endpoint | Metode | Peran | Keterangan |
|---|---|---|---|
| `/auth/login` | POST | Publik | Email/ID + kata sandi |
| `/auth/mfa/verify` | POST | Publik (`mfa_token`) | Kode TOTP |
| `/auth/refresh` | POST | Publik (refresh token) | Rotasi token |
| `/auth/logout` | POST | Semua | Cabut refresh token |
| `/auth/me` | GET | Semua | Profil, peran, cakupan |
| `/auth/password` | PATCH | Semua | Ganti kata sandi; cabut sesi lain |
| `/auth/forgot-password` | POST | Publik | Respons generik |
| `/auth/reset-password` | POST | Publik (token reset) | Terapkan sandi baru |

**`POST /auth/login`**

```json
// Request
{ "identifier": "admin@perusahaan.id", "password": "********", "remember_me": true }
```
```json
// 200: tanpa MFA
{ "success": true, "data": { "access_token": "<jwt>", "refresh_token": "<opaque>", "expires_in": 900,
  "user": { "id": "usr_123", "name": "Sarah Jenkins", "role": "super_admin", "tenant_id": "tnt_1", "dept_ids": [] } } }
```
```json
// 200: MFA diperlukan
{ "success": true, "data": { "mfa_required": true, "mfa_token": "<sekali pakai, 5 menit>" } }
```

**`POST /auth/mfa/verify`**: request `{ "mfa_token": "...", "code": "123456" }`; respons sama dengan login tanpa MFA.

**`POST /auth/refresh`**: request `{ "refresh_token": "<opaque>" }`; respons `{ access_token, refresh_token, expires_in }`. Token lama langsung tidak berlaku.

**`GET /auth/me`**

```json
{ "success": true, "data": { "id": "usr_123", "name": "Sarah Jenkins", "email": "sarah@perusahaan.id",
  "role": "super_admin", "dept_ids": [], "permissions": ["employees.write", "location.view", "export.coordinates"],
  "mfa_enabled": true, "timezone": "Asia/Jakarta" } }
```

`permissions` adalah daftar hak turunan untuk membantu UI; **server tetap memeriksa** setiap permintaan.

---

## 5. Dashboard

| Endpoint | Metode | Peran | Keterangan |
|---|---|---|---|
| `/dashboard/summary` | GET | EXE, MGR, HR, SA | KPI hari ini |
| `/dashboard/trend` | GET | EXE, MGR, HR, SA | Tren kehadiran |
| `/dashboard/status-distribution` | GET | EXE, MGR, HR, SA | Donat status |
| `/dashboard/department-coverage` | GET | EXE, MGR, HR, SA | Kepatuhan per departemen |
| `/dashboard/activity` | GET | MGR, HR, SA | Aliran aktivitas terbaru (cursor) |

Parameter umum: `date` (default hari ini), `department_id`, `office_id`, `shift_id`. `MGR` otomatis dibatasi ke departemennya; `EXE` hanya agregat.

**`GET /dashboard/summary`**

```json
{ "success": true, "data": {
  "date": "2026-10-09",
  "as_of": "2026-10-09T03:42:15Z",
  "total_employees": { "value": 128, "delta_month": 4 },
  "present_today":   { "value": 104, "percent": 81.25, "delta_percent_vs_yesterday": 3.2 },
  "late_today":      { "value": 12, "percent": 9.3, "delta_vs_yesterday": -2 },
  "absent_today":    { "value": 12, "approved": 8, "unexcused": 4 },
  "currently_working": { "value": 87 }
} }
```

Definisi KPI: `PRD-admin.md` Bagian 5.1. `as_of` menunjukkan usia data.

**`GET /dashboard/trend?range=7d|30d|90d`** → `data.points`: `[{ "date": "2026-10-03", "present": 101, "late": 9, "absent": 14 }]`.

**`GET /dashboard/status-distribution`** → `data`: `{ "present": 104, "late": 12, "absent": 8, "leave": 4, "total": 128 }`.

**`GET /dashboard/department-coverage`** → `data.items`: `[{ "department_id": "dep_1", "name": "Engineering", "percent": 96 }]`.

**`GET /dashboard/activity?limit=50&cursor=`** → daftar `AttendanceRecord` ringkas (lihat 3.2) dengan `meta` cursor.

---

## 6. Presensi dari Mobile

Dipanggil **aplikasi mobile pegawai**; didokumentasikan di sini karena data admin berasal dari endpoint ini. Peran: `EMP`. Detail alur ada di `PRD-mobile.md`.

### 6.1 `POST /attendance/check-in`

Header wajib: `Authorization`, `Idempotency-Key`, `X-App-Version`, `X-App-Platform`.

```json
// Request
{
  "lat": -6.2088, "lng": 106.8456, "accuracy_m": 8.5,
  "altitude_m": 12.0, "speed_mps": 0.0, "heading_deg": null,
  "location_timestamp": "2026-10-09T01:02:10Z",
  "device_time": "2026-10-09T01:02:11Z",
  "monotonic_ms": 5234111,
  "device_id_hash": "sha256:...",
  "office_id": "off_1",
  "biometric": { "method": "fingerprint", "passed": true },
  "integrity": {
    "mock_flag": false, "mock_confidence": "high",
    "rooted_or_jailbroken": false, "developer_options": false, "adb_enabled": false, "emulator": false,
    "attestation_token": "<play-integrity/app-attest token>"
  },
  "app_version": "1.0.3", "os_version": "Android 14"
}
```

```json
// 201 (diterima)
{ "success": true, "data": {
  "attendance": { "id": "att_1", "work_date": "2026-10-09", "status": "present", "late_minutes": 0, "check_in": { "at": "2026-10-09T01:02:14Z", "distance_m": 38, "verification": ["gps_geofence", "device_biometric"] } },
  "server_time": "2026-10-09T01:02:14Z"
} }
```

Server menghitung jarak (Haversine), jam resmi (server), keterlambatan, dan skor risiko; keputusan akhir ada di server. Kode galat khusus presensi:

| Kode | HTTP | Keterangan |
|---|---|---|
| `OUTSIDE_GEOFENCE` | 422 | Di luar radius; `details`: `{ distance_m, radius_m }` |
| `LOW_ACCURACY` | 422 | Akurasi melebihi ambang; `details.accuracy_m` |
| `MOCK_DETECTED` | 422 | Indikasi lokasi palsu/integritas gagal (pesan netral ke pengguna) |
| `ALREADY_CHECKED_IN` | 409 | Sudah check-in; mengembalikan catatan yang ada (idempoten) |
| `NO_SCHEDULE` | 422 | Tidak ada jadwal hari ini |
| `DEVICE_NOT_REGISTERED` | 403 | Perangkat tidak sesuai device binding |
| `CONSENT_REQUIRED` | 403 | Persetujuan privasi lokasi belum diberikan |
| `PERIOD_LOCKED` | 409 | Periode terkunci |

Permintaan ulang dengan `Idempotency-Key` yang sama mengembalikan hasil semula tanpa membuat catatan ganda.

### 6.2 `POST /attendance/check-out`

Request sama seperti check-in ditambah `note` (maks. 250 karakter; **wajib** bila pulang sebelum jam pulang atau di luar radius yang diizinkan). Respons `200` berisi catatan dengan `check_out`, `duration_minutes`, dan status (`completed` atau `completed_early`). Galat tambahan: `NOT_CHECKED_IN` (409), `NOTE_REQUIRED` (422).

### 6.3 Endpoint pegawai lain

| Endpoint | Metode | Keterangan |
|---|---|---|
| `/me/dashboard` | GET | Status hari ini, shift, kantor terdekat |
| `/me/attendance` | GET | Riwayat (filter `from`, `to`, `status`; paginasi) |
| `/me/attendance/{id}` | GET | Detail |
| `/me/consent` | POST | Catat persetujuan privasi `{ version }` |
| `/devices` | POST/DELETE | Registrasi token FCM dan perangkat |
| `/time` | GET | Waktu server untuk sinkronisasi (publik) |

---

## 7. Live Monitoring

Data posisi dan status. Peran: `MGR` (departemen), `HR`, `SA`. **`EXE` tidak berhak** (`403`).

| Endpoint | Metode | Keterangan |
|---|---|---|
| `/live/employees` | GET | Snapshot posisi terakhir semua pegawai dalam cakupan |
| `/live/employees/{id}` | GET | Detail satu pegawai (**dicatat ke audit**) |
| `/live/employees/{id}/trail` | GET | Activity trail hari ini |
| `/live/summary` | GET | Hitungan: inside, outside, offline, flagged |

Snapshot dipakai saat membuka layar dan **setelah reconnect** Socket.io (lalu digabung dengan event baru berdasarkan `seq`).

**`GET /live/employees`**

Parameter: `status` (`presence`: `online,offline`), `perimeter` (`inside,outside`), `flagged` (`true`), `department_id`, `q`, `page`, `page_size` (maksimum 500 untuk snapshot).

Untuk Admin Desktop, snapshot awal harus mampu mengambil seluruh data pegawai aktif dalam cakupan tenant / departemen sebelum UI mem-render peta atau panel monitoring, agar visualisasi tidak terpotong. Karena itu:
- `GET /live/employees` pada renderer desktop harus diproses sebagai batch snapshot yang otomatis melakukan auto-paging (`page_size=500`) sampai semua hasil aktif dalam cakupan terkumpul, atau memakai mekanisme `all_active=true` jika backend menyediakan.
- Setelah snapshot penuh selesai, renderer baru mulai menggabungkan event Socket.io yang datang setelah koneksi aktif.
- Jika server membatasi halaman, `page_size` maksimum tetap 500, dan renderer wajib melanjutkan ke halaman berikutnya hingga `has_more=false` atau `total_pages <= page`.

```json
{ "success": true, "data": { "items": [
  { "employee": { "id": "emp_8821", "employee_id": "EMP-8821", "name": "Ahmad Rahman", "position": "Senior Engineer", "department_id": "dep_1", "avatar_url": null },
    "presence": "online", "last_seen_at": "2026-10-09T03:41:55Z",
    "location": { "event_id": "0f6c...", "seq": 412, "recorded_at": "2026-10-09T03:41:55Z", "lat": -6.2088, "lng": 106.8456,
                  "accuracy_m": 8.5, "office_id": "off_1", "distance_m": 85, "perimeter": "inside", "on_shift": true, "device": { "battery_pct": 84, "network": "5g" } },
    "attendance": { "id": "att_1", "status": "present", "check_in_at": "2026-10-09T01:02:14Z", "flags": [] } }
  ], "as_of": "2026-10-09T03:42:00Z" },
  "meta": { "page": 1, "page_size": 500, "total": 87, "total_pages": 1 } }
```

Pegawai **tanpa sesi kerja** atau **tanpa persetujuan** dikembalikan tanpa objek `location` (`location: null`, `sharing: false`), sehingga UI menampilkan "Lokasi tidak dibagikan".

**`GET /live/employees/{id}`** → objek seperti di atas ditambah `geofence` (`{ office_id, radius_m, center_lat, center_lng }`), `compliance` (`inside`/`outside`, `distance_m`), dan `risk` (`level`; `reason_codes` untuk `HR`/`SA`). Setiap panggilan menghasilkan entri audit `location.view`.

**`GET /live/employees/{id}/trail`** → `data.points`: `[{ "at": "...", "type": "check_in|zone_enter|zone_exit|check_out|note", "label": "Gate check-in", "lat": ..., "lng": ... }]`. Retensi dan ketersediaan rute detail mengikuti kebijakan privasi tenant (**[SINKRONKAN]**; rute historis penuh belum masuk v1.0).

**`GET /live/summary`** → `{ "inside": 82, "outside": 5, "offline": 36, "flagged": 2, "online": 87, "as_of": "..." }`.

---

## 8. Karyawan

| Endpoint | Metode | Peran | Keterangan |
|---|---|---|---|
| `/employees` | GET | MGR(dept), HR, SA | Daftar |
| `/employees` | POST | HR, SA | Buat (status `invited`) |
| `/employees/{id}` | GET | MGR(dept), HR, SA | Detail |
| `/employees/{id}` | PATCH | HR, SA | Ubah (`If-Match`) |
| `/employees/{id}/status` | PUT | HR, SA | Aktif/Nonaktif |
| `/employees/{id}/invitation` | POST | HR, SA | Kirim ulang undangan |
| `/employees/{id}/password-reset` | POST | HR, SA | Kirim tautan reset |
| `/employees/{id}/device` | DELETE | HR, SA | Lepas device binding (alasan wajib) |
| `/employees/bulk` | POST | HR, SA | Aksi massal |
| `/employees/import` | POST | HR, SA | Impor CSV (asinkron) |
| `/employees/summary` | GET | MGR(dept), HR, SA | Kartu ringkasan |

**`GET /employees`**: filter `q`, `department_id`, `status`, `office_id`, `presence`, `attendance_today` (`present,late,absent,leave`); sort `name`, `employee_id`, `department`, `last_seen_at`; paginasi offset. Item: `Employee` ditambah `today` (`{ attendance_status, check_in_at }`) dan `presence` (`{ state, last_seen_at, perimeter }`). Peran `MGR` tidak menerima `device`.

**`POST /employees`**

```json
{ "employee_id": "EMP-9100", "name": "Dewi Lestari", "email": "dewi@perusahaan.id", "phone": "+62812...",
  "department_id": "dep_1", "position": "QA Engineer", "manager_id": "emp_8821",
  "shift_id": "shf_1", "office_ids": ["off_1"], "joined_on": "2026-10-01" }
```

Respons `201` berisi `Employee` (status `invited`); server mengirim email aktivasi (tautan berlaku 72 jam). Galat: `DUPLICATE` (409) dengan `details`: `[{ "field": "employee_id" | "email" }]`.

**`PUT /employees/{id}/status`**: `{ "status": "inactive", "reason": "Resign", "force_check_out": true }`. Menonaktifkan pegawai: sesi dicabut ≤ 60 detik, hilang dari peta dan metrik "Currently Working", dan koneksi socket pegawai diputus. Bila pegawai sedang check-in dan `force_check_out` tidak diset, `422 BUSINESS_RULE` dengan `details[].code = "ACTIVE_SESSION"`.

**`POST /employees/bulk`**

```json
{ "action": "assign_office", "ids": ["emp_1", "emp_2"], "params": { "office_ids": ["off_1"] } }
```

`action`: `assign_office`, `assign_department`, `assign_shift`, `activate`, `deactivate`. Respons `200` melaporkan **per baris**: `{ "results": [ { "id": "emp_1", "ok": true }, { "id": "emp_2", "ok": false, "error": { "code": "ACTIVE_SESSION" } } ] }`.

**`POST /employees/import`**: `multipart/form-data` (`file` CSV, maksimum 5 MB) atau `dry_run=true` untuk pratinjau validasi. Respons `202` `{ "job_id": "exp_..." }`; hasil melalui `GET /jobs/{id}`:

```json
{ "success": true, "data": { "id": "job_1", "status": "ready", "summary": { "total": 200, "created": 197, "failed": 3 },
  "errors": [ { "row": 12, "field": "email", "code": "DUPLICATE" } ] } }
```

---

## 9. Kehadiran, Koreksi, dan Persetujuan

Peran untuk daftar dan detail: `MGR`(dept), `HR`, `SA`. `EXE` hanya `/attendance/summary`.

| Endpoint | Metode | Peran | Keterangan |
|---|---|---|---|
| `/attendance` | GET | MGR(dept), HR, SA | Rekap/audit log |
| `/attendance/summary` | GET | EXE, MGR(dept), HR, SA | KPI dan hitungan filter |
| `/attendance/{id}` | GET | MGR(dept), HR, SA | Detail |
| `/attendance/{id}/review` | POST | HR, SA | Tinjau flag risiko |
| `/attendance/{id}/history` | GET | MGR(dept), HR, SA | Riwayat perubahan |
| `/corrections` | GET | MGR(dept), HR, SA | Antrean persetujuan |
| `/corrections` | POST | HR, SA, EMP | Ajukan koreksi |
| `/corrections/{id}` | GET | MGR(dept), HR, SA, EMP(milik) | Detail |
| `/corrections/{id}/decision` | POST | MGR(dept), HR, SA | Setujui/tolak |
| `/corrections/bulk-decision` | POST | MGR(dept), HR, SA | Keputusan massal |
| `/periods/{yyyy-mm}/lock` | POST | SA | Kunci periode |
| `/periods/{yyyy-mm}/unlock` | POST | SA | Buka kunci (alasan wajib) |

**`GET /attendance`**: filter `from`, `to` (tanggal), `department_id`, `status`, `flag`, `verification`, `office_id`, `q`; sort `work_date`, `check_in`, `name`, `status`; paginasi offset. Item `AttendanceRecord` (koordinat pada `AttendancePunch` hanya untuk peran yang berhak lokasi; `EXE` tidak memanggil endpoint ini).

**`GET /attendance/summary`**

```json
{ "success": true, "data": {
  "range": { "from": "2026-10-09", "to": "2026-10-09" },
  "attendance_rate": { "percent": 81.25, "clocked_in": 104, "scheduled": 128, "pending": 24, "delta_percent": 4.2 },
  "punctuality": { "percent": 89.6, "on_time": 92, "late": 12 },
  "avg_check_in": { "time": "08:09", "shift_start": "08:00", "grace_minutes": 15 },
  "work_hours": { "logged": 682.5, "expected": 832.0 },
  "counts": { "present": 92, "late": 12, "absent": 18, "leave": 6, "flagged": 2 }
} }
```

**`POST /attendance/{id}/review`**: `{ "decision": "validate" | "reject" | "request_clarification", "note": "..." }` dengan `If-Match`. Hanya untuk catatan ber-flag `needs_review` atau status `flagged`. `reject` mengubah catatan menjadi tidak valid (status ditentukan server) dan memberi tahu pegawai.

**`POST /corrections`**

```json
{ "attendance_id": "att_1", "type": "missed_check_out",
  "reason": "Lupa check-out, pulang pukul 17:05",
  "proposed": { "check_in_at": null, "check_out_at": "2026-10-09T10:05:00Z" },
  "attachment_ids": [] }
```

Aturan: `reason` wajib (minimal 10 karakter); waktu usulan tidak boleh di masa depan; periode tidak terkunci (`PERIOD_LOCKED`). Respons `201` memuat `Correction` berstatus `pending` dan `due_at` (SLA, default 2 hari kerja).

**`POST /corrections/{id}/decision`**: `{ "decision": "approve" | "reject", "note": "..." }` dengan `If-Match`. Aturan *four-eyes* (konfigurasi): pengaju tidak boleh memutuskan koreksinya sendiri (`422 BUSINESS_RULE`, `details[].code = "SELF_APPROVAL"`). Saat `approve`: nilai asli dipertahankan di riwayat, catatan mendapat flag `adjusted`, rekap diperbarui, pegawai menerima notifikasi.

**`POST /corrections/bulk-decision`**: `{ "ids": ["cor_1","cor_2"], "decision": "approve", "note": "..." }`; hasil per baris seperti `/employees/bulk`. Hanya untuk `type` yang sama.

**`GET /attendance/{id}/history`** → `data.items`: `[{ "at": "...", "actor": { "id": "usr_1", "name": "..." }, "action": "correction.approved", "before": { "check_out_at": null }, "after": { "check_out_at": "..." }, "reason": "..." }]`.

---

## 10. Laporan dan Ekspor

| Endpoint | Metode | Peran | Keterangan |
|---|---|---|---|
| `/reports/attendance` | GET | EXE(agregat), MGR(dept), HR, SA | Ringkasan harian/mingguan/bulanan |
| `/reports/late-statistics` | GET | EXE(agregat), MGR(dept), HR, SA | Statistik keterlambatan |
| `/exports` | POST | MGR(dept), HR, SA | Buat ekspor (asinkron) |
| `/exports/{id}` | GET | Pembuat | Status |
| `/exports/{id}/download` | GET | Pembuat | Unduh berkas (URL bertanda waktu) |
| `/reports/schedules` | GET/POST/PATCH/DELETE | HR, SA | Laporan terjadwal (S) |

**`GET /reports/attendance`**: parameter `period` (`daily|weekly|monthly`), `from`, `to`, `group_by` (`employee|department|office`), paginasi offset. Item: `{ "key": {...}, "work_days": 22, "present": 20, "late": 2, "absent": 0, "leave": 0, "total_hours": 168.5, "avg_check_in": "08:03" }`.

**`GET /reports/late-statistics`** → `data`: `{ "total_late": 41, "total_late_minutes": 702, "by_department": [ ... ], "trend": [ ... ], "repeat_offenders": [ { "employee_id": "emp_9", "count": 5 } ] }`. `repeat_offenders` hanya `HR`/`SA`.

**`POST /exports`**

```json
{ "report": "attendance", "format": "csv", "filters": { "from": "2026-09-01", "to": "2026-09-30", "department_id": null },
  "include_coordinates": false, "reason": null }
```

- `report`: `attendance`, `late_statistics`, `employees`, `audit_log`.
- `format`: `csv`, `xlsx`, `pdf`.
- `include_coordinates: true` hanya `SA` (atau izin `export.coordinates`) dan `reason` **wajib**; selain itu `403 FORBIDDEN`. Aksi tercatat di audit.
- Respons `202`: `{ "id": "exp_1", "status": "queued" }`.

**`GET /exports/{id}`** → `{ "id": "exp_1", "status": "processing|ready|failed|expired", "progress_percent": 60, "file": { "name": "attendance-2026-09.csv", "size_bytes": 482113, "expires_at": "..." } }`.

**`GET /exports/{id}/download`** → berkas dengan `Content-Disposition`; `410 GONE` bila kedaluwarsa (24 jam). Penyimpanan lokal pada desktop dilakukan lewat dialog simpan di main process. Untuk Electron, backend dan client harus konsisten mendukung ekspor dalam format `csv`, `xlsx`, dan `pdf` melalui handler generik `report.saveFile` (atau `saveFile`/`exportReport`) di main process, bukan hanya `report.exportCsv` yang terbatas satu format. Handler utama harus menerima `{ id, format, fileName, mimeType, payload/buffer, targetPath? }` dan menyimpan ke lokasi yang dipilih pengguna. `report.exportCsv` diperbolehkan sebagai wrapper kompatibilitas, tetapi tidak boleh menjadi satu-satunya jalur penyimpanan.

CSV/Excel: UTF-8 dengan BOM, tanggal ISO 8601, dan **sel diawali `=`, `+`, `-`, `@` dinetralkan** oleh server (klien tetap menerapkan `safeCell` pada ekspor sisi klien).

---

## 11. Pengaturan

Peran: `HR`, `SA` (kecuali dinyatakan lain). Semua `PATCH` memakai `If-Match`; semua perubahan tercatat di audit dengan nilai sebelum dan sesudah. Perubahan konfigurasi berlaku **sejak `effective_from`** dan tidak mengubah data historis.

### 11.1 Kantor dan geofence

| Endpoint | Metode | Keterangan |
|---|---|---|
| `/offices` | GET, POST | Daftar, tambah |
| `/offices/{id}` | GET, PATCH | Detail, ubah |
| `/offices/{id}` | DELETE | Hapus (`409` bila masih ditugaskan; `details` memuat ketergantungan) |
| `/offices/{id}/assignments` | PUT | Tetapkan pegawai/departemen `{ "employee_ids": [], "department_ids": [] }` |

```json
// POST /offices
{ "name": "HQ Central Hub", "address": "Jl. ...", "lat": -6.2088, "lng": 106.8456,
  "radius_m": 100, "timezone": "Asia/Jakarta", "active": true, "effective_from": "2026-10-10" }
```

Validasi: `lat`, `lng` dalam rentang; `radius_m` 20-1000 (`< 30` menghasilkan `warnings`, bukan galat); `name` unik per tenant.

### 11.2 Shift, libur, kebijakan presensi

| Endpoint | Metode | Keterangan |
|---|---|---|
| `/shifts` | GET, POST | Daftar, tambah |
| `/shifts/{id}` | GET, PATCH, DELETE | Detail, ubah, hapus (`409` bila dipakai) |
| `/shifts/{id}/impact` | GET | Pratinjau jumlah pegawai terdampak (`?effective_from=`) |
| `/holidays` | GET, POST, PATCH, DELETE | Kalender libur |
| `/settings/attendance-policy` | GET, PATCH | Ambang dan kebijakan keamanan presensi |

**`/settings/attendance-policy`**

```json
{ "accuracy_threshold_m": 50, "accuracy_reject_m": 100, "borderline_policy": "accept_with_flag",
  "risk_thresholds": { "medium": 40, "high": 70 },
  "mock_policy": "block", "root_policy": "standard",
  "offline_queue_enabled": false, "offline_queue_max_age_minutes": 15,
  "idle_lock_minutes": 30, "version": 3 }
```

- `borderline_policy`: `accept_with_flag` atau `reject`.
- `mock_policy`: `block`, `flag`, atau `shadow` (hanya mencatat).
- `root_policy`: `strict`, `standard`, atau `audit`.
- Perubahan kebijakan ini hanya `SA`.

Catatan khusus untuk desktop:
- Saat aplikasi desktop wake up dari mode sleep/standby, application lifecycle harus memvalidasi `access_token` terlebih dahulu. Jika token tidak valid atau kedaluwarsa, jalankan `POST /auth/refresh` dengan `refresh_token` yang tersimpan, lalu lanjutkan.
- Setelah token valid kembali, rekonsiliasi harus dijalankan terlebih dahulu sebelum Socket.io dihubungkan ulang: `GET /live/employees` dan `GET /alerts?handled=false`.
- Proses ini harus terjadi sebelum `io.connect()` untuk mencegah state map/alert tertutup dari event yang lama atau tidak konsisten.
- Bila refresh gagal, aplikasi harus menutup sesi saat ini dan mengarahkan ke login ulang.

### 11.3 Notifikasi, broadcast, privasi

| Endpoint | Metode | Peran | Keterangan |
|---|---|---|---|
| `/settings/notification-rules` | GET, PATCH | HR, SA | Aturan pengingat, eskalasi, kanal |
| `/broadcasts` | GET, POST | HR, SA | Pengumuman |
| `/broadcasts/roll-call` | POST | HR, SA | Roll call darurat ke pegawai aktif |
| `/settings/privacy` | GET, PATCH | SA | Kebijakan privasi tenant |

**`POST /broadcasts`**: `{ "title": "...", "body": "...", "priority": "normal|important", "audience": { "all": false, "department_ids": ["dep_1"], "office_ids": [] }, "channels": ["push","in_app"], "scheduled_at": null }` → `201` dengan `{ id, status: "sent|scheduled", recipients: 87 }`.

**`/settings/privacy`**

```json
{ "consent_version": "2026-09", "consent_text_id": "…", "coordinate_retention_days": 90,
  "tracking_hours": { "from": "06:00", "to": "22:00" }, "tracking_only_during_shift": true, "version": 2 }
```

Mengubah `consent_version` memaksa pegawai menyetujui ulang pada login berikutnya.

---

## 12. Alert

| Endpoint | Metode | Peran | Keterangan |
|---|---|---|---|
| `/alerts` | GET | MGR(dept), HR, SA | Daftar (cursor) |
| `/alerts/{id}` | PATCH | MGR(dept), HR, SA | Tandai ditangani |
| `/alerts/unread-count` | GET | MGR(dept), HR, SA | Jumlah belum ditangani |

**`GET /alerts`**: filter `type`, `severity`, `handled` (`true|false`), `employee_id`, `from`, `to`, `cursor`, `limit`.

**`PATCH /alerts/{id}`**: `{ "handled": true, "note": "Sudah dikonfirmasi lewat telepon" }`.

Alert juga dikirim real-time lewat event `new_attendance_alert` (Bagian 14.4); REST dipakai untuk riwayat dan rekonsiliasi setelah reconnect.

---

## 13. Audit Log, Pengguna Admin, dan Sistem

### 13.1 Audit log

| Endpoint | Metode | Peran | Keterangan |
|---|---|---|---|
| `/audit-logs` | GET | SA | Daftar (cursor) |

Filter: `from`, `to`, `actor_id`, `action`, `object_type`, `object_id`, `q`. Entri imutabel (*append-only*); retensi ≥ 12 bulan. **Klien tidak menulis audit auth atau audit akses lokasi sendiri**; server mencatat otomatis saat endpoint terkait dipanggil. Ekspor audit lewat `POST /exports` (`report: "audit_log"`).

Aksi yang dicatat (minimum): `auth.login`, `auth.login_failed`, `auth.mfa`, `auth.refresh_rejected`, `auth.logout`, `employee.create|update|status|device_unbind`, `attendance.review`, `correction.create|approve|reject`, `period.lock|unlock`, `settings.update`, `office.update`, `role.update`, `location.view`, `export.create`, `broadcast.send`.

### 13.2 Pengguna admin dan peran

| Endpoint | Metode | Peran | Keterangan |
|---|---|---|---|
| `/admin-users` | GET, POST | SA | Daftar, tambah |
| `/admin-users/{id}` | GET, PATCH | SA | Detail, ubah peran/status (`If-Match`) |
| `/admin-users/{id}/sessions` | DELETE | SA | Cabut semua sesi |
| `/roles` | GET | SA | Daftar peran dan hak |

### 13.3 Sistem

| Endpoint | Metode | Peran | Keterangan |
|---|---|---|---|
| `/app/version-check` | GET | Publik | `?platform=win32&version=1.0.3` |
| `/health` | GET | Publik | Kesehatan layanan |
| `/time` | GET | Publik | Waktu server |
| `/jobs/{id}` | GET | Pembuat | Status pekerjaan asinkron (impor, dsb.) |

**`GET /app/version-check`** → `{ "update_required": false, "min_supported": "1.0.0", "latest": "1.0.3", "download_url": null }`. Bila versi klien < `min_supported`, endpoint lain dapat mengembalikan `426 UPGRADE_REQUIRED`.

---

## 14. Socket.io

### 14.1 Koneksi

| Aspek | Spesifikasi |
|---|---|
| URL | `wss://api.perusahaan.id` `[ISI]`; namespace default `/` |
| Transport | `websocket` |
| Autentikasi | Handshake: `io(url, { auth: { token: <access_token> } })`. **Dilarang** memakai query string |
| Validasi server | Token diverifikasi saat handshake; peran menentukan *room* |
| Room (server) | `tenant:{tenant_id}` (HR, SA), `dept:{dept_id}` (MGR), `emp:{employee_id}` (EMP) |
| Reconnect | Klien: backoff eksponensial dengan jitter; token **diperbarui** pada setiap percobaan |
| Penolakan | `connect_error` dengan `message` = kode galat (`TOKEN_EXPIRED`, `TOKEN_INVALID`, `ACCOUNT_DISABLED`, `FORBIDDEN`, `UPGRADE_REQUIRED`) |
| Pemutusan server | Saat sesi dicabut atau akun dinonaktifkan, server memutus (`disconnect` reason `io server disconnect`); klien mencoba refresh sekali, bila gagal logout |
| `EXE` | **Tidak diberi** room lokasi; tidak menerima `update_employee_location` |

### 14.2 Ikhtisar event

| Event | Arah | Penerima | Keterangan |
|---|---|---|---|
| `employee_login` | server → admin | `tenant`, `dept` | Pegawai online |
| `employee_logout` | server → admin | `tenant`, `dept` | Pegawai offline |
| `update_employee_location` | server → admin | `tenant`, `dept` | Posisi baru |
| `new_attendance_alert` | server → admin | `tenant`, `dept` | Alert kehadiran |
| `send_location` | mobile → server | n/a | Dikirim aplikasi mobile; **admin tidak memancarkannya** |

Semua payload server → admin memiliki `event_id` (UUID) untuk deduplikasi. Klien WAJIB memvalidasi bentuk dan rentang sebelum memasukkannya ke state; payload tidak valid dibuang (dicatat tanpa isi).

### 14.3 `employee_login` dan `employee_logout`

```json
// employee_login
{ "event_id": "9a3d...", "employee_id": "emp_8821", "at": "2026-10-09T01:00:02Z",
  "device": { "platform": "android", "app_version": "1.0.3" } }
```
```json
// employee_logout
{ "event_id": "b81c...", "employee_id": "emp_8821", "at": "2026-10-09T10:05:30Z",
  "reason": "manual" }
```

`reason` (logout): `manual`, `session_expired`, `revoked`, `timeout`, `deactivated`.

### 14.4 `update_employee_location` dan `new_attendance_alert`

**`update_employee_location`**: payload `LocationUpdate` (Bagian 3.2).

```json
{ "event_id": "0f6c...", "employee_id": "emp_8821", "seq": 413,
  "recorded_at": "2026-10-09T03:42:05Z", "lat": -6.20881, "lng": 106.84562, "accuracy_m": 8.0,
  "office_id": "off_1", "distance_m": 82, "perimeter": "inside", "on_shift": true,
  "device": { "battery_pct": 84, "network": "5g" } }
```

Aturan klien: simpan dalam `Map` per `employee_id`; **abaikan** bila `seq` ≤ `seq` yang sudah ada; batch penerapan paling banyak sekali per 250 ms; status **offline** bila tidak ada pembaruan > 10 menit (atau `employee_logout`).

**`new_attendance_alert`**

```json
{ "event_id": "c7e1...", "id": "alt_55", "type": "outside_radius", "severity": "warning",
  "employee": { "id": "emp_7742", "employee_id": "EMP-7742", "name": "Dimas Pratama", "department_id": "dep_2" },
  "at": "2026-10-09T01:24:10Z", "attendance_id": "att_77",
  "details": { "distance_m": 410, "radius_m": 250 } }
```

Pemetaan `type` ke `details`:

| `type` | `details` |
|---|---|
| `check_in`, `check_out` | `{ "late_minutes": 24 }` (check_in), `{ "duration_minutes": 530 }` (check_out) |
| `late` | `{ "late_minutes": 24 }` |
| `outside_radius` | `{ "distance_m": 410, "radius_m": 250 }` |
| `mock_location`, `device_integrity`, `teleport` | `{ "risk_level": "high" }` (tanpa `reason_codes` pada event; lihat via REST untuk `HR`/`SA`) |
| `correction_requested` | `{ "correction_id": "cor_3" }` |
| `offline_long` | `{ "minutes": 15 }` |

Deduplikasi berdasarkan `id` alert; alert tersimpan di server dan dapat diambil lewat `GET /alerts`.

### 14.5 `send_location` (mobile → server)

Dipancarkan hanya oleh aplikasi mobile selama sesi presensi aktif dan dengan persetujuan.

```json
// Emit
{ "seq": 413, "lat": -6.20881, "lng": 106.84562, "accuracy_m": 8.0, "altitude_m": 12.0,
  "speed_mps": 0.4, "heading_deg": 90, "location_timestamp": "2026-10-09T03:42:04Z", "monotonic_ms": 5234111,
  "integrity": { "mock_flag": false, "rooted_or_jailbroken": false, "developer_options": false },
  "device": { "battery_pct": 84, "network": "5g" } }
```
```json
// Ack (callback)
{ "ok": true, "server_time": "2026-10-09T03:42:05Z" }
// atau
{ "ok": false, "code": "RATE_LIMITED" | "NO_ACTIVE_SESSION" | "CONSENT_REQUIRED" | "INVALID_PAYLOAD" }
```

Server memvalidasi (rentang, akurasi, impossible travel, mock), menghitung `distance_m` dan `perimeter` (Haversine terhadap kantor), lalu menyiarkan `update_employee_location` ke room yang sesuai. Batas laju: minimal `5` detik antar pesan per pegawai; kelebihan di-ack dengan `RATE_LIMITED`.

### 14.6 Rekonsiliasi dan ketahanan

1. Saat `connect` atau `reconnect`, klien admin memanggil `GET /live/employees` dan `GET /alerts?handled=false`, lalu menggabungkan event baru berdasarkan `seq`/`id`.
2. Event bisa tiba tidak berurutan atau ganda; klien idempoten.
3. Server **tidak** menyimpan antrean event untuk klien yang terputus; sumber kebenaran adalah REST.
4. Status koneksi ditampilkan di UI; saat terputus, data live ditandai usang.
5. Saat aplikasi desktop wake up dari mode sleep/standby, alur yang disarankan adalah: validasi access token → refresh bila diperlukan → rekonsiliasi REST (`/live/employees`, `/alerts?handled=false`) → koneksi ulang Socket.io.
6. Jika token tidak valid setelah refresh, aplikasi harus memutus sesi dan mendorong login ulang tanpa menampilkan data live yang sudah usang.

---

## 15. Batas Laju

| Kelompok | Batas (per pengguna) |
|---|---|
| `/auth/login`, `/auth/mfa/verify` | 10/menit per IP dan 5 kegagalan per akun sebelum `ACCOUNT_LOCKED` (15 menit) |
| `/auth/refresh` | 30/menit |
| `POST /attendance/check-in|check-out` | 6/menit |
| Baca umum | 300/menit |
| Tulis umum | 60/menit |
| `POST /exports` | 10/jam |
| Socket `send_location` | 1 per 5 detik |

Pelampauan: `429 RATE_LIMITED` dengan `Retry-After`.

---

## 16. Keamanan Kontrak

1. Semua endpoint (kecuali Publik) memerlukan Bearer token valid; server memeriksa **peran dan cakupan data** pada setiap permintaan.
2. Koordinat individual hanya untuk `MGR`(dept), `HR`, `SA`. `EXE` tidak pernah menerima koordinat individual (REST maupun socket).
3. Akses lokasi individual (`/live/employees/{id}`, ekspor berkoordinat) dicatat di audit oleh server.
4. Token dan koordinat tidak boleh muncul di URL, log, atau pesan galat.
5. Unggahan berkas dibatasi ukuran dan jenis (CSV: 5 MB; lampiran koreksi: 5 MB, `jpg|png|pdf`), dipindai server; nama berkas dinormalisasi.
6. Respons tidak membocorkan keberadaan sumber daya di luar cakupan (gunakan `404`).
7. Header keamanan (HSTS, `X-Content-Type-Options: nosniff`) diterapkan di server; CORS dibatasi untuk asal yang diizinkan. Untuk aplikasi desktop Electron, origin yang diizinkan harus dibatasi secara eksplisit ke `app://`, `file://`, atau origin custom yang didefinisikan, bukan `*`.

---

## 17. Versioning dan Perubahan Kontrak

- Versi mayor pada path (`/v1`). Perubahan **tidak kompatibel** (menghapus/mengganti nama kolom, mengubah arti, mengetatkan validasi) membutuhkan versi mayor baru atau masa transisi minimal 2 rilis.
- Perubahan **kompatibel** (kolom opsional baru, endpoint baru, nilai enum baru): klien wajib mengabaikan kolom tak dikenal dan menangani nilai enum tak dikenal secara aman (tampilkan netral).
- Setiap perubahan: perbarui dokumen ini, `CHANGELOG` di bawah, dan beri tahu konsumen (desktop dan mobile).
- Kontrak diuji dengan **contract test** (mis. skema JSON/OpenAPI pada CI) di backend dan klien; payload contoh dokumen ini menjadi fixture.
- Versi aplikasi minimum dikendalikan lewat `/app/version-check` dan header `X-App-Version`.

### Changelog

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0-draft | `2026-10-19` | Draf awal: auth, dashboard, live, karyawan, kehadiran, laporan, pengaturan, alert, audit, Socket.io; ditambah penyesuaian khusus Admin Desktop: CORS, headers, live snapshot, RBAC/UI, ekspor via main process, dan wake/refresh/reconnect flow. |

---

## 18. Pertanyaan Terbuka

1. Apakah **refresh token** dikirim di body (sesuai draf) atau di cookie `HttpOnly` untuk klien non-desktop?
2. Namespace Socket.io: satu namespace `/` dengan room (draf ini) atau `/admin` dan `/mobile` terpisah?
3. Apakah event **check_in/check_out** perlu event tersendiri (bukan hanya `new_attendance_alert` bertipe `check_in`/`check_out`) untuk memperbarui KPI dan aliran lebih efisien?
4. Batas laju `send_location` dan interval pengiriman posisi dari mobile.
5. **Rute historis** (`/live/employees/{id}/trail`): hanya activity trail ringkas pada v1.0, atau rute titik-titik penuh dengan retensi tertentu?
6. Apakah `device.battery_pct` dan `device.network` boleh ditampilkan ke admin (keputusan privasi/DPO)?
7. Paginasi `/live/employees`: snapshot penuh (maksimum 500) atau cursor? Untuk Admin Desktop, snapshot awal harus bisa mengambil seluruh data pegawai aktif dalam cakupan sebelum render map; mekanisme auto-paging di renderer adalah solusi yang disarankan bila data besar.
8. Skema autentikasi **SSO** (OIDC/SAML) dan dampaknya ke `/auth/*`.
9. Format kunci `permissions` pada `/auth/me` dan apakah `MGR` dapat menyetujui koreksi lintas departemen.
10. Kebijakan **hapus data pegawai** (permintaan penghapusan UU PDP) dan endpoint DSAR yang dibutuhkan.
