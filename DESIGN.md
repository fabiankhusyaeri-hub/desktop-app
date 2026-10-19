---
name: Vanguard FieldOps (GeoAttend Admin Dashboard)
version: 1.0
source: stitch_pulsetrack_enterprise_admin_dashboard (4 layar + DESIGN.md bawaan)
platform: web desktop (>= 1280px), Tailwind CSS
colors:
  # Brand inti
  primary-container: '#3a4efb'      # Primary Accent Blue (brand)
  secondary-container: '#3ca9ff'    # Secondary / Bright Blue (brand, ~#33A4FA)
  tertiary-fixed: '#d4f029'         # Accent Lime (brand #E3FF3B dipakai via on-tertiary-container)
  on-tertiary-container: '#d7f32d'  # Lime untuk teks/ikon di atas permukaan gelap
  inverse-surface: '#2b2f49'        # Dark Navy: sidebar, chip live, kartu gelap
  surface-container-high: '#e5e6ff'
  surface-variant: '#dee0ff'        # Light neutral (brand #DEE0ED)
  # Aksi dan teks
  primary: '#152de4'                # CTA utama (tombol solid)
  on-primary: '#ffffff'
  secondary: '#00629e'              # Ikon dan teks informatif di atas putih
  on-surface: '#161a33'             # Teks utama
  on-surface-variant: '#444656'
  outline: '#757688'
  outline-variant: '#c5c5d9'
  # Permukaan
  background: '#fbf8ff'
  surface-container-lowest: '#ffffff'   # Kartu
  surface-container-low: '#f4f2ff'
  surface-container: '#edecff'
  surface-dim: '#d5d8fa'
  inverse-on-surface: '#f0efff'
  # Status
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  secondary-fixed: '#cfe5ff'
  on-secondary-fixed: '#001d34'
  on-secondary-container: '#003c63'
typography:
  headline-xl:    { fontFamily: Plus Jakarta Sans, fontSize: 36px, fontWeight: '700', lineHeight: 44px }
  headline-lg:    { fontFamily: Plus Jakarta Sans, fontSize: 28px, fontWeight: '600', lineHeight: 36px }
  headline-md:    { fontFamily: Plus Jakarta Sans, fontSize: 20px, fontWeight: '600', lineHeight: 28px }
  title-md:       { fontFamily: Plus Jakarta Sans, fontSize: 16px, fontWeight: '600', lineHeight: 24px }
  numeric-metric: { fontFamily: Plus Jakarta Sans, fontSize: 32px, fontWeight: '700', lineHeight: 38px }
  body-lg:        { fontFamily: Inter, fontSize: 16px, fontWeight: '400', lineHeight: 24px }
  body-md:        { fontFamily: Inter, fontSize: 14px, fontWeight: '400', lineHeight: 20px }
  body-sm:        { fontFamily: Inter, fontSize: 12px, fontWeight: '400', lineHeight: 16px }
  label-md:       { fontFamily: Inter, fontSize: 13px, fontWeight: '600', lineHeight: 18px }
  label-sm:       { fontFamily: Inter, fontSize: 11px, fontWeight: '600', lineHeight: 14px }
  numeric-mono:   { fontFamily: Inter, fontSize: 13px, fontWeight: '500', lineHeight: 18px }
rounded:
  DEFAULT: 0.25rem   # 4px
  md: 0.375rem       # 6px
  lg: 0.5rem         # 8px: tombol, input, item nav
  xl: 0.75rem        # 12px: kartu dan panel
  full: 9999px       # chip, badge, avatar
spacing:
  space-xs: 0.25rem  # 4px
  space-sm: 0.5rem   # 8px
  space-md: 1rem     # 16px
  space-lg: 1.5rem   # 24px: margin halaman
  space-xl: 2rem     # 32px
  gutter: 1.25rem    # 20px
---

# DESIGN.md: Vanguard FieldOps / GeoAttend Admin Dashboard

Dokumen ini adalah acuan desain untuk mengimplementasikan Admin Dashboard desktop. Isinya diturunkan dari **kode HTML dan tangkapan layar** pada paket desain (Dashboard, Live Monitoring, Employees, Attendance), bukan hanya dari DESIGN.md bawaan Stitch. Jika keduanya berbeda, **nilai yang tampil di layar dan kode** dijadikan acuan, dan selisihnya dicatat di Bagian 12.

---

## 1. Ringkasan

| Aspek | Keputusan |
|---|---|
| Produk | Dashboard operasional kehadiran dan pemantauan lokasi karyawan real-time untuk HR dan Operasional |
| Karakter | Modern Corporate SaaS dengan presisi ala mission-control: tegas, padat data, tenang |
| Struktur | Sidebar navy tetap + topbar kaca + kanvas terang berisi kartu putih |
| Penanda khas | Aksen **lime hanya untuk status live**, bar lime di sisi kiri item nav aktif, chip navy bertitik berdenyut |
| Pustaka | Tailwind CSS (CDN), ikon **Material Symbols Outlined**, font **Plus Jakarta Sans** + **Inter** |
| Mode gelap | Tidak ada di v1.0 (`darkMode: class` dikonfigurasi tetapi tidak ada layar gelap) |

---

## 2. Prinsip Desain

1. **Satu hal yang berdenyut = satu hal yang hidup.** Animasi `ping` dan warna lime hanya dipakai untuk data real-time (sistem online, pegawai aktif, sinkronisasi). Jangan dipakai sebagai dekorasi.
2. **Kartu putih di atas kanvas lavender-putih.** Pemisahan lewat warna permukaan dan bayangan halus, bukan garis tebal.
3. **Gelap berarti penting.** Elemen navy (sidebar, chip "Present", kartu ringkasan utama, bar aksi massal) adalah titik fokus pandangan; gunakan hemat.
4. **Angka tidak boleh bergoyang.** Semua angka, jam, dan koordinat memakai angka tabular.
5. **Status selalu berlapis:** warna + titik/ikon + teks. Warna saja tidak cukup.

---

## 3. Warna

### 3.1 Pemetaan palet brand ke token

| Peran brand | Hex brand | Token implementasi | Hex token | Catatan |
|---|---|---|---|---|
| Primary Accent Blue | `#3A4EFB` | `primary-container` | `#3a4efb` | Nav aktif, tab, tombol refresh, titik data utama |
| (CTA solid) | n/a | `primary` | `#152de4` | Tombol aksi utama ("Broadcast Alert", "Add New Employee"); sedikit lebih gelap dari brand |
| Secondary / Bright Blue | `#33A4FA` | `secondary-container` | `#3ca9ff` | Titik info, seri kedua grafik, geofence, batang progres |
| Teks biru informatif | n/a | `secondary` | `#00629e` | Ikon dan teks kecil di atas putih (kontras cukup) |
| Accent Lime | `#E3FF3B` | `on-tertiary-container` / `tertiary-fixed` | `#d7f32d` / `#d4f029` | **Hanya di atas navy** atau sebagai titik kecil |
| Dark Neutral | `#252943` | `inverse-surface` | `#2b2f49` | Sidebar, chip live, kartu gelap. Teks utama memakai `on-surface` `#161a33` |
| Light Gray / Neutral | `#DEE0ED` | `surface-variant` / `surface-container-high` | `#dee0ff` / `#e5e6ff` | Chip netral, track progres, divider |
| Background | `#F8FAFC` | `background` | `#fbf8ff` | Kanvas halaman |
| Surface | `#FFFFFF` | `surface-container-lowest` | `#ffffff` | Kartu, panel, input |

### 3.2 Peran permukaan

| Token | Hex | Dipakai untuk |
|---|---|---|
| `background` | `#fbf8ff` | Kanvas halaman |
| `surface-container-lowest` | `#ffffff` | Kartu, panel kiri/kanan, input topbar |
| `surface-container-low` | `#f4f2ff` | Sub-header, input dalam panel, hover baris tabel (50%) |
| `surface-container` | `#edecff` | Chip netral, track progres, baris selang-seling (20%) |
| `surface-container-high` | `#e5e6ff` | Header tabel (60%), chip hitungan, hover tombol sekunder |
| `inverse-surface` | `#2b2f49` | Sidebar, chip live, kartu ringkasan gelap, bar aksi massal |

### 3.3 Aturan penggunaan lime (wajib)

- Boleh: teks/ikon/titik di atas `inverse-surface`; titik 6-10 px dengan animasi ping; bar 4 px di sisi kiri item nav aktif; batang progres di dalam kartu gelap.
- **Dilarang:** teks lime atau ikon lime di atas putih/lavender; latar lime lebar; lime pada status non-live.

### 3.4 Warna status (sebagaimana tampil di layar)

| Status | Chip | Teks | Titik/ikon |
|---|---|---|---|
| Present / Active / Online | `inverse-surface` | `on-tertiary-container` (lime) | titik lime berdenyut |
| In Progress | `surface-container` | `secondary` | tanpa titik |
| Late | `error-container` | `on-error-container` | titik merah (lihat Bagian 12, butir 3) |
| Absent | `error` solid | `on-error` | n/a |
| Breach Flagged / Outside Zone | `error` solid atau `error-container` | putih / `on-error-container` | ikon peringatan |
| Approved Leave | `surface-variant` | `on-surface-variant` | titik abu |
| Completed Early / Remote / Field Verified | `secondary-fixed` atau `secondary` | `on-secondary-fixed` / `on-secondary` | n/a |
| Offline | tanpa chip | `outline` | titik abu statis |

---

## 4. Tipografi

**Plus Jakarta Sans** untuk judul dan angka KPI; **Inter** untuk isi, tabel, dan label.

| Token | Font | Ukuran/Tinggi | Berat | Penggunaan |
|---|---|---|---|---|
| `headline-xl` | Plus Jakarta Sans | 36/44 | 700 | Hero (jarang) |
| `headline-lg` | Plus Jakarta Sans | 28/36 | 600 | Judul halaman ("Good morning, Admin") |
| `headline-md` | Plus Jakarta Sans | 20/28 | 600 | Judul panel ("Active Trackers") |
| `title-md` | Plus Jakarta Sans | 16/24 | 600 | Nama brand, judul kartu kecil |
| `numeric-metric` | Plus Jakarta Sans | 32/38 | 700 | Angka KPI |
| `body-md` | Inter | 14/20 | 400 | Teks isi |
| `body-sm` | Inter | 12/16 | 400 | Teks sekunder, input panel |
| `label-md` | Inter | 13/18 | 600 | Tombol, item nav |
| `label-sm` | Inter | 11/14 | 600 | Label KPI (huruf kapital, `tracking-wider`), header tabel, chip |
| `numeric-mono` | Inter | 13/18 | 500 | Jam, ID, koordinat, jarak |

**Aturan:** label KPI dan header tabel memakai huruf kapital dengan `letter-spacing` +0.05em. Teks yang ter-truncate memakai `truncate` dengan `min-w-0` pada induk flex.

> Angka tabular (`font-feature-settings: "tnum" 1, "cv05" 1`) diwajibkan pada semua angka, jam, dan koordinat, **tetapi belum diterapkan di kode**; tambahkan sebagai kelas utilitas global (`.tnum`) saat implementasi.

---

## 5. Layout & Grid

### 5.1 Shell aplikasi

| Elemen | Spesifikasi |
|---|---|
| Sidebar | `fixed`, lebar **256px** (`w-64`), tinggi penuh, `inverse-surface`, `z-50` |
| Topbar | `fixed`, tinggi **64px** (`h-16`), mulai dari `left-64`, `surface-bright` 90% + `backdrop-blur-xl`, `z-40` |
| Konten | `pl-64` + `pt-16`; padding halaman `px-space-lg` (24px) `py-space-md` (16px); jarak antar blok `space-lg` (24px) |
| Target layar | >= 1280px (utama); 1080p+ adalah target desain |

### 5.2 Pola grid per layar

| Layar | Pola |
|---|---|
| Dashboard | Header halaman penuh, **5 kartu KPI** (`grid-cols-5`, gap 16px), peta **8 kolom** + daftar karyawan aktif **4 kolom**, lalu 3 kartu grafik, lalu tabel penuh |
| Live Monitoring | Sub-header penuh, lalu **12 kolom**: daftar tracker 3, peta tengah (lebar sisa), panel Telemetry Detail 3 |
| Employees | Header + aksi, 4 kartu ringkasan (satu gelap), bar filter, bar aksi massal gelap, tabel, 3 kartu bawah (satu gelap) |
| Attendance | Header + segmented control periode, 4 kartu KPI (satu gelap), kartu filter, tabel audit |

### 5.3 Breakpoint (turunan dari DESIGN.md bawaan; layar tablet/mobile belum ada di paket desain)

| Rentang | Perilaku |
|---|---|
| >= 1280 | 12 kolom, gutter 20px, sidebar tetap |
| 768-1279 | 8 kolom, sidebar menjadi rail, peta di atas daftar |
| < 768 | 4 kolom, margin 16px, navigasi bawah |

---

## 6. Elevasi

Kedalaman dibuat dari **warna permukaan + bayangan sangat halus**; kartu **tidak memakai border** pada layar yang ada.

| Level | Penggunaan | Spesifikasi |
|---|---|---|
| 0 | Kanvas | `background`, datar |
| 1 | Kartu, panel | `surface-container-lowest` + `shadow-sm`; hover kartu KPI: `shadow-md` |
| 1b | Input topbar | `0 1px 3px rgba(37,41,67,0.04)` |
| 2 | Topbar | `0 1px 8px rgba(0,0,0,0.03)` + blur |
| 2b | Sidebar | `0 1px 8px rgba(0,0,0,0.06)` |
| Aksen | Item nav aktif | `0 2px 8px rgba(58,78,251,0.35)` |
| Aksen | Tombol primer | `shadow-md` berwarna `primary/25` |
| 3 | Modal (belum ada di layar) | `0 12px 32px rgba(37,41,67,0.14)` + backdrop navy 40% blur 4px |

---

## 7. Bentuk

| Elemen | Radius |
|---|---|
| Kartu, panel besar, peta | `rounded-xl` = **12px** |
| Tombol, input, item nav, sel ringkasan | `rounded-lg` = **8px** |
| Chip, badge, avatar, titik, pagination aktif pill | `rounded-full` |
| Kbd (`⌘K`), tag kecil | `rounded` = 4px |
| Bar aksen nav aktif | `rounded-r-full` |

---

## 8. Komponen

### 8.1 Sidebar

- Header 64px: logo 32px + nama brand (`title-md`, `inverse-on-surface`) + subjudul (`label-sm`, `surface-dim` 75%).
- Divider `h-px` `surface-container/10`.
- Item nav (`px-space-md py-2.5 rounded-lg`, ikon 20px + `label-md`): **Dashboard, Live Monitoring, Employees, Attendance, Location, Reports, Settings** dengan ikon `dashboard, radar, badge, how_to_reg, near_me, analytics, tune`.
  - Normal: teks `surface-dim`; hover: `bg-surface-variant/10` + teks `inverse-on-surface`; ikon `scale-105`.
  - **Aktif:** `bg-primary-container`, teks putih tebal, bayangan biru, **bar lime 4px** di tepi kiri (`top-2 bottom-2`).
- Footer: kartu profil `surface-variant/5`, avatar 32px (`ring-2 surface-dim/20`), nama + peran (truncate), tombol Settings dan Logout (hover logout: teks `error`).

### 8.2 Topbar

Kiri: chip **System Online** (navy, titik lime ping, `label-sm` huruf kapital lime) dan chip **Realtime Connected (10s ago)** (`surface-container-high`, titik `secondary-container`), disembunyikan di bawah `xl`. Kanan: pencarian 256-288px (ikon `search`, hint `⌘K`), tanggal (`label-md`) di atas jam (`numeric-mono`, `outline`), lonceng dengan titik merah ping, avatar 32px dengan dropdown.

### 8.3 Header halaman

Judul `headline-lg`, chip konteks (tanggal, shift) berbentuk pill `surface-container` dengan ikon, deskripsi `body-md` `on-surface-variant`. Chip filter di bawahnya. Aksi di kanan: satu tombol sekunder + satu tombol primer. Pada layar Live Monitoring, header diganti **sub-header** `surface-container-low` berisi breadcrumb, chip koneksi live, dan kontrol cepat.

### 8.4 Tombol

| Varian | Spesifikasi |
|---|---|
| Primer | `bg-primary`, teks putih, `px-4 py-2.5 rounded-lg`, `label-md`, ikon 18px, `shadow-md shadow-primary/25`, hover `primary/90` |
| Primer ringan (kontrol peta) | `bg-primary-container`, hover `primary`, `active:scale-95` |
| Sekunder | `bg-surface-container-lowest`, teks `on-surface`, `shadow-sm`, ikon `secondary`, hover `surface-container` |
| Tertiary / link | Teks `primary`, tanpa latar, hover latar `primary/6%` |
| Destruktif (bar aksi massal) | Teks merah di atas navy dengan ikon `block` |
| Ikon | `p-1.5`/`p-2 rounded-lg`, hover `surface-container-high` |

Target sentuh minimum 40px tinggi pada desktop.

### 8.5 Chip, filter, dan segmented control

- **Chip filter aktif:** navy + teks lime + titik lime kecil. **Tidak aktif:** `surface-container` + `on-surface-variant`, hover `surface-container-high`. Pill, `px-3 py-1`, `label-sm`.
- **Chip peringatan** ("Outside (5)"): `error-container` + `on-error-container`.
- **Segmented control** (Today / Yesterday / This Week / This Month; Day / Week / Month): wadah `surface-container-high`, segmen terpilih putih dengan teks `primary`.
- **Dropdown filter:** `rounded-lg`, latar `surface-container-lowest` atau `surface-container-low`, ikon `expand_more`.

### 8.6 Kartu KPI

`surface-container-lowest`, `p-space-md`, `rounded-xl`, `shadow-sm` (hover `shadow-md`). Baris atas: label `label-sm` huruf kapital + **ubin ikon 36px** `rounded-lg` (warna latar berbeda per kartu: `secondary-fixed`, `surface-container-high`, `surface-container`). Isi: `numeric-metric` + baris tren `label-sm` (ikon `trending_up/down`, teks `secondary`) atau pill persentase navy-lime.

**Kartu KPI gelap:** `inverse-surface`, label `surface-dim`, angka `inverse-on-surface`, badge status (OPTIMAL / Active Run / Active Now) lime, progres lime. Maksimum **satu** per baris.

### 8.7 Tabel data

| Elemen | Spesifikasi |
|---|---|
| Wadah | Kartu `rounded-xl`, header kartu berisi judul + chip hitungan + aksi |
| Header | `bg-surface-container-high/60`, `label-sm` huruf kapital `tracking-wider`, `py-3 px-4` |
| Baris | Tinggi lega (sel 2-3 baris), hover `surface-container-low/50`; baris bermasalah `error-container/10`; baris tidak aktif `opacity-80` |
| Sel karyawan | Avatar 36-40px + titik status di pojok bawah-kanan, nama `label-md`, ID `numeric-mono` `outline` |
| Waktu | `numeric-mono`; terlambat berwarna `error` |
| Kolom verifikasi | Ikon `verified_user`/`shield` + teks "GPS Geofence Match" / "Pending Review" / "Manual Override" |
| Footer | "Showing 1-8 of 128", info sinkron, pagination: halaman aktif pill `primary` putih, lainnya hantu, ikon chevron |
| Aksi massal | Bar `inverse-surface` di atas tabel: badge jumlah (`primary`), tombol Assign Geofence / Export Selected / Deactivate |

Checkbox 18px, radius 4px; terpilih `primary-container` dengan centang putih; fokus `ring 3px primary/20`.

### 8.8 Input

Tinggi 40px, `rounded-lg`, latar putih, ikon `search` 18px di kiri (`outline`), tanpa border, bayangan `0 1px 3px`. Fokus: `ring-2 primary-container/20`. Input di dalam panel memakai `surface-container-low` dan `shadow-inner`; saat fokus berubah putih. `placeholder` memakai `outline`.

### 8.9 Peta dan geofence

| Elemen | Spesifikasi |
|---|---|
| Tab peta | Geofence / Heatmap / Traffic (dashboard); Standard / Satellite / Dark Grid (live monitoring) |
| Lingkaran geofence | Garis putus-putus 2px `primary-container`, isi `primary/10%`; poligon zona 15% `secondary-container` dengan tepi 2px |
| Marker karyawan | Lingkaran 28-32px, inisial putih di atas `primary`, ring putih 2px; **aktif/terpilih:** cincin lime di sekitar titik navy; **di luar perimeter:** diberi label jarak berwarna `error` |
| Marker HQ | Ubin biru 56px dengan ikon rumah putih + label "HQ Hub" |
| Tooltip peta | `inverse-surface`, nama lime, peran `inverse-on-surface`, titik lime "Active Now" |
| Kontrol mengambang | Kolom pil putih (zoom +, zoom -, locate), `rounded-lg`, bayangan level 2 |
| Legenda | Kartu putih kecil: "82 Inside Geofence", "5 Outside Perimeter", "0 Breach Alerts" |
| Strip metrik (Live Monitoring) | Kapasitas HQ, efisiensi armada, GPS drift, last sync, berlatar gelap di atas peta |

### 8.10 Kartu karyawan aktif dan panel detail

- **Mini-card tracker:** avatar/inisial, nama, ID (`numeric-mono`), jarak ke HQ di kanan, jam check-in, chip status. Kartu terpilih memakai bar biru di sisi kiri dan latar `primary-fixed`; kartu pelanggaran bernuansa `error-container`.
- **Kartu sorotan (gelap):** karyawan terpilih di dashboard, navy dengan teks lime, tombol Details/Focus.
- **Telemetry Detail (panel kanan):** header dengan tombol refresh/tutup, blok informasi `surface-container-low`, status kehadiran, kepatuhan geofence, koordinat, deviasi akurasi, baterai, jaringan; **Activity Trail** berupa timeline titik berwarna; CTA bawah **Ping Device Location** (primer) dan **View Historical Route** (sekunder).

### 8.11 Grafik dan progres

- **Batang mingguan:** "On-Time Present" `primary`, "Late Arrivals" `secondary-container`, hari mendatang `surface-variant`.
- **Donat status:** hadir `primary`, terlambat `secondary-container`, absen `surface-variant`, cuti lime; angka persen di tengah (`headline-md`).
- **Progres horizontal:** track `surface-container`, tinggi 6-8px, pill; isi `primary` / `secondary-container`; di kartu gelap isi lime.
- Legenda selalu memakai titik berwarna + label + angka.

### 8.12 Loading, kosong, dan galat (belum digambar di paket; spesifikasi usulan)

Skeleton `surface-container` berdenyut halus untuk kartu dan baris tabel; empty state dengan ikon Material 48px `outline`, judul `title-md`, satu CTA; galat lokal pada widget dengan teks `on-error-container` di `error-container` dan tombol "Coba lagi".

---

## 9. Spesifikasi Layar

### 9.1 Dashboard (Workforce Overview)

Tujuan: gambaran kehadiran hari ini. Urutan: greeting + shift + chip departemen + Export Daily Log / Broadcast Alert, 5 KPI (**Total Employees, Present Today, Late Today, Absent Today, Currently Working**; KPI terakhir gelap), peta monitoring live (badge LIVE, "HQ Geofence Active (Radius 250m)") dengan daftar Active Employees di sisi kanan, **Weekly Attendance Dynamics**, **Status Breakdown**, **Department Coverage**, dan **Recent Attendance Stream** (tabel dengan kolom Employee, Department, Date & Shift, Check-in, Check-out, Duration, Status, GPS Telemetry Verification).

### 9.2 Live Monitoring

Tujuan: memantau posisi dan pelanggaran perimeter. Sub-header (breadcrumb, chip "Connected to GPS Fleet Telematics", polling 5s, chip Geofence Strict 250m, Audio, Refresh Feed). Kiri: **Active Trackers** (pencarian, chip All/Inside/Outside/Flagged, scope departemen, kartu tracker). Tengah: peta gelap dengan strip metrik dan legenda "Dynamic Boundary". Kanan: **Telemetry Detail** dengan activity trail.

### 9.3 Employees (Directory)

Tujuan: mengelola data karyawan. Header + Import CSV / Export Roster / **Add New Employee**; 4 kartu (**Total Headcount, Geofenced Personnel, Remote/Field Fleet, Device Fleet Health** gelap); filter (cari, departemen, status, zona geofence, reset); bar aksi massal; tabel (nama + email, ID + token RFID, departemen + jabatan, geofence terpasang, kehadiran hari ini, status lokasi live, last ping, aksi); 3 kartu bawah (**Zone Verification Status, Auto-Geofence Sync, Priority Protocol** gelap).

### 9.4 Attendance (Audit & Timesheet Logs)

Tujuan: audit kehadiran dan verifikasi GPS. Header + segmented periode + **Export Logs**; 4 KPI (**Today's Attendance, Punctuality Score, Avg Check-in Time, Work Hours Logged** gelap); kartu filter (tanggal, departemen, status, metode verifikasi, ringkasan hitungan Present/Late/Absent/Leave, Reset Filters, Advanced Query); **Verified Punch Audit Log** (karyawan, departemen, shift, check-in + metode verifikasi, check-out, durasi, status, lokasi + jarak ke inti, verifikasi).

---

## 10. Gerak & Status Live

| Efek | Spesifikasi |
|---|---|
| Titik live | Titik 8-10px lime + lingkaran `animate-ping` (1.8s, `cubic-bezier(0,0,0.2,1)`, tak terbatas, opasitas 75%) |
| Titik notifikasi | Sama, warna `error` |
| Transisi | `transition-all`/`colors` 150-200ms pada hover tombol, item nav, baris tabel, kartu |
| Tekan | `active:scale-95` pada tombol kontrol peta |
| Aturan | Hormati `prefers-reduced-motion`: nonaktifkan ping dan skala, pertahankan titik statis |

---

## 11. Aksesibilitas

1. Kontras: teks `on-surface` (#161a33) di atas putih lulus AA. Teks kecil `outline` (#757688) hanya untuk informasi sekunder di atas putih (sekitar 4.5:1); jangan dipakai untuk informasi penting.
2. **Lime dan `secondary-container` (#3ca9ff) tidak boleh menjadi warna teks kecil di atas putih.** Untuk teks biru di atas putih gunakan `secondary` (#00629e).
3. Status: selalu titik/ikon + teks, bukan warna saja (hitam putih tetap terbaca).
4. Fokus keyboard terlihat: `ring-2 primary-container/20` pada input dan `ring 3px primary/20` pada checkbox; tambahkan **ring `primary-container` 2px penuh** pada tombol dan item nav (saat ini belum ada).
5. Label 11px (`label-sm`) hanya untuk label huruf kapital pendek; teks isi minimal 12px.
6. Ikon-saja (lonceng, refresh, tutup, logout) wajib punya `aria-label`; peta wajib punya padanan daftar/tabel.
7. `aria-live="polite"` untuk pembaruan KPI dan feed; `aria-current="page"` pada nav aktif (sudah ada di kode).

---

## 12. Ketidaksesuaian dan Catatan Implementasi

Hal-hal berikut ditemukan saat membandingkan DESIGN.md bawaan, kode, dan tangkapan layar. Keputusan di sini perlu dikonfirmasi tim desain.

| # | Temuan | Rekomendasi |
|---|---|---|
| 1 | **Radius:** DESIGN.md bawaan menyebut kartu 24px dan tombol 8px; konfigurasi Tailwind dan layar memakai kartu **12px** (`rounded-xl` = 0.75rem), tombol 8px | Dokumen ini memakai 12px sesuai layar |
| 2 | **Border kartu:** DESIGN.md bawaan menyebut border 1px `#DEE0ED`; layar tidak memakai border, hanya `shadow-sm` | Ikuti layar; border hanya untuk pemisah di dalam kartu |
| 3 | **Warna "Late" tidak konsisten:** merah (`error-container`) di Employees, biru (`secondary-fixed`) di tabel Dashboard, merah/biru di Attendance. Desain **tidak punya token warning/success** | Tetapkan satu aturan. Untuk GeoAttend (PRD): Hadir = navy+lime, **Terlambat = amber `#F59E0B`**, Absen/Pelanggaran = merah. Tambahkan token `warning` dan `success` |
| 4 | **Dua "primary":** CTA solid memakai `primary` (#152de4), nav aktif memakai `primary-container` (#3a4efb, warna brand) | Pertahankan: `primary` untuk tombol, `primary-container` untuk penanda aktif |
| 5 | **Hex brand vs token:** `#252943` dan `#F8FAFC` tidak ada sebagai token; padanannya `inverse-surface` `#2b2f49` dan `background` `#fbf8ff` | Gunakan token. Jika hex brand harus persis, ubah nilai token, bukan hardcode |
| 6 | **Angka tabular** diwajibkan tetapi belum ada di CSS | Tambahkan utilitas global |
| 7 | **Logo** memakai URL gambar eksternal (googleusercontent) dan teks alt terlihat menimpa pada tangkapan layar | Ganti dengan aset lokal SVG; beri lebar tetap |
| 8 | **Peta** pada Live Monitoring adalah ilustrasi gambar, bukan SDK peta; label peta terlalu besar di resolusi lebar | Implementasikan dengan Google Maps/Mapbox; ukuran teks marker tetap |
| 9 | **Zona waktu dan data contoh:** topbar menampilkan "EST" dan tanggal tidak sinkron (Oct 28 vs Oct 24); data mencantumkan WIB/Jakarta | Tampilkan zona waktu kantor (WIB), satu sumber tanggal dari server |
| 10 | **Nama:** paket bernama *pulsetrack*, brand pada UI *Vanguard FieldOps*, produk dalam PRD *GeoAttend* | Ganti brand UI menjadi GeoAttend di logo, judul tab, dan teks |
| 11 | Folder `enterprise_attendance_and_live_gps_operations` **identik byte demi byte** dengan `dashboard_workforce_overview` dan tidak punya tangkapan layar | Abaikan sebagai duplikat |
| 12 | Layar tablet, mobile, modal, empty/loading/error, dan mode gelap **belum didesain** | Perlu desain tambahan sebelum implementasi |

---

## 13. Pemetaan ke Produk GeoAttend

### 13.1 Admin Dashboard (web)

Desain ini dipakai langsung. Pemetaan ke PRD: Dashboard = FR-2.1.x; Live Monitoring = FR-2.2.x; Employees = FR-2.3.x; Attendance = FR-2.4.x. **Belum ada layar** untuk Reporting Engine (FR-2.5.x), Admin System Settings (FR-2.6.x: geofence, shift, notifikasi, audit log), dan antrean persetujuan koreksi; menu "Reports" dan "Settings" ada di sidebar tetapi layarnya belum didesain.

### 13.2 Aplikasi Mobile (React Native)

Paket ini **tidak memuat layar mobile**. Gunakan token yang sama sebagai dasar `theme.ts`, dengan penyesuaian berikut.

| Token desktop | Padanan mobile |
|---|---|
| `primary` / `primary-container` | Tombol CTA / tab aktif dan header |
| `inverse-surface` | Kartu status "Sedang Bekerja", chip live, header gelap opsional |
| `surface-container-lowest` di atas `background` | Kartu di atas layar |
| `rounded-xl` 12px / `rounded-lg` 8px | Kartu / tombol dan input |
| Plus Jakarta Sans + Inter | Sama; angka dengan `fontVariant: ['tabular-nums']` |
| `label-sm` 11px | Naikkan minimal 12px untuk keterbacaan di layar kecil |
| Target sentuh | Minimal 48x48 dp (lebih besar daripada kontrol desktop 40px) |

---

## 14. Do dan Don't

| Do | Don't |
|---|---|
| Gunakan lime hanya di atas navy untuk status live | Jangan pakai lime sebagai teks di atas putih atau latar besar |
| Satu kartu gelap per baris sebagai titik fokus | Jangan menaruh beberapa kartu gelap berdampingan |
| Status = warna + titik/ikon + teks | Jangan bergantung pada warna saja |
| Kartu putih di atas `background` tanpa border | Jangan menambahkan border tebal atau bayangan berat |
| Angka tabular untuk jam dan koordinat | Jangan biarkan angka bergeser saat polling |
| Tampilkan usia data lokasi ("Pinged 10s ago") | Jangan menampilkan posisi usang seolah real-time |
| Satu tombol primer per area | Jangan lebih dari satu CTA solid biru dalam satu header |
