# Product Requirement Document: GeoAttend Enterprise v1.0

**Enterprise Employee Attendance & Real-Time Location Monitoring Platform**

| Atribut | Detail |
| --- | --- |
| Dokumen | PRD-GEO-001 |
| Versi dokumen | 1.0 (Draft untuk review lintas fungsi) |
| Penyusun | Senior Technical Product Manager |
| Pemangku kepentingan | Product, Engineering, Design, Security, Legal/DPO, HR Operations, Customer Success |
| Status | Draft untuk persetujuan |

---

## 1. Executive Summary & Overview

### 1.1 Nama Produk & Versi

**GeoAttend Enterprise v1.0** adalah platform SaaS multi-tenant untuk absensi karyawan berbasis lokasi (geofencing) dan pemantauan posisi tim lapangan secara near real-time. Rilis v1.0 mencakup PWA untuk karyawan dan aplikasi web enterprise untuk administrator dan manajemen.

### 1.2 Vision Statement

> Menjadi sumber kebenaran tunggal (single source of truth) kehadiran dan keberadaan tenaga kerja, sehingga setiap organisasi dapat mengambil keputusan operasional berdasarkan data yang akurat, bebas manipulasi, dan sesuai regulasi privasi.

### 1.3 Masalah yang Diselesaikan

| Masalah | Dampak Bisnis | Pendekatan GeoAttend |
| --- | --- | --- |
| Rekap absensi manual dan tidak efisien | Waktu HR terbuang, keterlambatan payroll | Rekapitulasi otomatis, laporan satu klik |
| Akurasi kehadiran rendah (titip absen) | Kebocoran biaya tenaga kerja | Verifikasi geofence, akurasi GPS, bukti waktu server |
| Kecurangan GPS (Fake GPS / mock location) | Data tidak dapat dipercaya | Deteksi berlapis di klien dan server, skor risiko |
| Visibilitas tim lapangan minim | Penugasan tidak optimal, respons lambat | Peta live dengan status dan posisi terakhir |
| Risiko kepatuhan privasi | Sanksi regulasi, hilangnya kepercayaan karyawan | Consent eksplisit, minimisasi data, retensi terkontrol |

### 1.4 Core Objectives & Success Metrics

| ID | Objektif | Metrik Keberhasilan (target 6 bulan pasca-peluncuran) |
| --- | --- | --- |
| OBJ-1 | Meningkatkan akurasi kehadiran | Akurasi data kehadiran tervalidasi ≥ 99% pada audit sampel |
| OBJ-2 | Menekan kecurangan lokasi | Insiden kecurangan lolos deteksi < 0,5% dari total check-in |
| OBJ-3 | Efisiensi operasional HR | Waktu penyusunan rekap bulanan turun ≥ 80% |
| OBJ-4 | Visibilitas tim lapangan | ≥ 90% karyawan lapangan aktif tampil di peta live pada jam kerja |
| OBJ-5 | Adopsi | ≥ 85% karyawan terdaftar melakukan check-in minimal 1x/minggu |
| OBJ-6 | Keandalan | Ketersediaan layanan ≥ 99,9% per bulan |

### 1.5 Target Audience & Personas

**Persona A: Employee / Field Staff (Pengguna Mobile)**

- **Profil:** Karyawan kantor, sales, teknisi, atau staf lapangan; 22-50 tahun; menggunakan ponsel pribadi (Android Chrome atau iOS Safari).
- **Kebutuhan:** Absen cepat (< 10 detik), jelas statusnya, tidak boros baterai, transparan soal data lokasi yang dikumpulkan.
- **Pain point:** Sinyal tidak stabil, GPS meleset di dalam gedung, takut dilacak berlebihan, dianggap terlambat karena kendala teknis.
- **Perangkat dan konteks:** Satu tangan, pagi hari, antrean lobi, koneksi bervariasi.

**Persona B: HR / Operational Administrator (Pengguna Desktop)**

- **Profil:** HR Officer, Operations Supervisor, atau Admin Cabang; menggunakan layar 1080p+.
- **Kebutuhan:** Memantau kehadiran real-time, menangani koreksi dan pengecualian, membuat laporan payroll-ready, mengonfigurasi aturan tanpa bantuan engineering.
- **Pain point:** Banyak permintaan koreksi manual, sulit membuktikan sengketa kehadiran, rekap lintas departemen memakan waktu.

**Persona C: C-Level / Managerial (Executive View)**

- **Profil:** Direktur, Kepala Departemen, atau Manager Operasional.
- **Kebutuhan:** Ringkasan KPI, tren kehadiran, dan indikator risiko dalam satu layar tanpa operasional detail.
- **Pain point:** Laporan terlambat dan tidak konsisten antar divisi.

### 1.6 Peran dan Hak Akses (RBAC)

| Peran | Cakupan Akses |
| --- | --- |
| Employee | Data diri sendiri, check-in/out, riwayat pribadi, notifikasi |
| Department Manager | Read-only dashboard dan peta untuk departemen yang dikelola, approval koreksi tim |
| HR Admin | CRUD karyawan, approval, laporan, pengaturan shift dan geofence |
| Super Admin (Tenant) | Seluruh fitur HR Admin, audit log, kebijakan privasi, manajemen peran |
| Executive (Viewer) | Dashboard eksekutif dan laporan agregat, tanpa akses data lokasi individual |

### 1.7 Ruang Lingkup v1.0

**In scope:** Seluruh modul pada dokumen ini (Modul 1 dan Modul 2), matriks status UX, dan NFR.

**Out of scope (kandidat rilis berikutnya):** Integrasi payroll langsung, face recognition/biometrik, aplikasi native penuh, manajemen cuti dan lembur, tracking latar belakang kontinu, multi-bahasa selain Indonesia dan Inggris.

### 1.8 Asumsi dan Batasan Kritis

1. **Keterbatasan PWA:** Browser tidak mengekspos properti `isMock` seperti API native Android. Deteksi Fake GPS pada PWA bersifat **heuristik dan probabilistik**, sehingga diperlukan kontrol berlapis di server (lihat Bagian 4.3). Untuk tenant dengan kebutuhan anti-spoofing tingkat tinggi, direkomendasikan roadmap aplikasi native/wrapper (Capacitor) pada v1.5.
2. **Pelacakan latar belakang:** Pada iOS Safari dan Android Chrome, pembaruan lokasi saat aplikasi tidak aktif tidak dijamin. Karena itu "real-time" pada v1.0 didefinisikan sebagai **pembaruan saat PWA aktif di foreground**, ditambah posisi terakhir yang diketahui (last known location) dengan penanda usia data.
3. **Pelacakan hanya pada jam kerja** dan hanya bagi karyawan yang telah memberikan consent eksplisit (Bagian 8.1).
4. Waktu resmi kehadiran selalu **timestamp server (UTC)**, bukan waktu perangkat.

---

## 2. System Architecture & Tech Stack Recommendations

### 2.1 Platform & Kompatibilitas

| Platform | Spesifikasi |
| --- | --- |
| **Mobile (Employee)** | Responsive PWA / Mobile Web; Android Chrome ≥ 110 dan iOS Safari ≥ 16.4 (dukungan Web Push untuk PWA yang di-install). Viewport 360-430 px, mode portrait, *install prompt* (Add to Home Screen), service worker untuk caching aset dan antrean offline. |
| **Desktop (Admin)** | Enterprise Web Application; target layar 1920x1080 ke atas, minimum fungsional 1366x768. Browser: Chrome, Edge, Firefox, Safari versi stabil terbaru (N dan N-1). |

### 2.2 Arsitektur Logis (Rekomendasi)

| Lapisan | Rekomendasi | Catatan |
| --- | --- | --- |
| Frontend | React/Next.js atau Vue/Nuxt + TypeScript; PWA via Workbox | Satu *design system* bersama untuk mobile dan desktop |
| API Gateway | REST + WebSocket/SSE; rate limiting, WAF | Versi API `/v1`, idempotency key untuk check-in |
| Layanan inti | Auth, Attendance, Geofence, Employee, Reporting, Notification, Audit | Modular monolith pada v1.0, siap dipecah menjadi layanan |
| Real-time | WebSocket/SSE melalui pub/sub (Redis Streams atau managed equivalent) | Untuk peta live dan activity feed |
| Database | PostgreSQL + PostGIS (geospasial), Redis (cache, antrean, rate limit) | Partisi tabel `attendance_logs` per bulan |
| Antrean | Message queue (SQS/RabbitMQ/Kafka) | Buffer lonjakan check-in dan pemrosesan laporan asinkron |
| Penyimpanan objek | S3-compatible | Hasil ekspor laporan, dengan URL bertanda waktu |
| Observability | OpenTelemetry, metrik, log terstruktur, alerting | SLO terhadap NFR Bagian 8 |

### 2.3 Integrasi Utama

| Integrasi | Tujuan | Persyaratan |
| --- | --- | --- |
| **GPS / Geolocation** | Pengambilan koordinat via Geolocation API (`enableHighAccuracy: true`) | Menyimpan `accuracy`, `altitude`, `speed`, `heading`, timestamp perangkat |
| **Map API** (Google Maps Platform atau Mapbox) | Peta live, preview lokasi, editor geofence | API key dibatasi domain, *quota monitoring*, fallback tile bila gagal |
| **Geofencing Engine** | Validasi titik di dalam poligon/radius | Perhitungan server-side (PostGIS `ST_DWithin`), formula Haversine sebagai pembanding |
| **Push Notification** | Pengingat dan broadcast | Web Push (VAPID) + FCM; opt-in eksplisit; fallback notifikasi in-app |
| **Email (SMTP/API)** | Reset password, laporan terjadwal | SPF/DKIM/DMARC dikonfigurasi |
| **SSO (opsional v1.0)** | SAML 2.0 / OIDC untuk tenant enterprise | Dapat diaktifkan per tenant |

---

## 3. Design System & UX Guidelines (Mandatory)

### 3.1 Prinsip Estetika

Modern SaaS Enterprise: minimalis, profesional, bersih, bernuansa modern tech. Ruang putih lapang, hirarki tegas, satu aksi utama per layar, dan konsistensi komponen lintas modul.

### 3.2 Palet Warna (Wajib, Konsisten di Seluruh Modul)

| Token | Hex | Penggunaan |
| --- | --- | --- |
| `color-primary` | **#3A4EFB** | Aksi utama (CTA primer), tautan, state aktif navigasi, marker "In-Radius" |
| `color-secondary` | **#33A4FA** | Aksen sekunder, ilustrasi data, seri kedua pada grafik, hover/ikon informatif |
| `color-highlight` | **#E3FF3B** | CTA sekunder, badge aktif, pemicu perhatian (gunakan hemat; **selalu dengan teks #252943**) |
| `color-text-primary` | **#252943** | Teks utama, sidebar, elemen kontras tinggi |
| `color-neutral-surface` | **#DEE0ED** | Border, divider, background komponen non-aktif |
| `color-bg` | **#F8FAFC / #FFFFFF** | Background halaman / kartu dan modal |
| `color-success` | **#16A34A** | Hadir tepat waktu, check-in berhasil |
| `color-warning` | **#F59E0B** | Terlambat, akurasi rendah, peringatan |
| `color-danger` | **#DC2626** | Gagal, di luar radius, Fake GPS, aksi destruktif |

**Aturan kontras (WCAG 2.1 AA):**

- Teks #252943 pada #FFFFFF/#F8FAFC memenuhi rasio ≥ 4,5:1.
- Teks putih pada #3A4EFB boleh digunakan (rasio ≥ 4,5:1 untuk teks normal; verifikasi di Figma sebelum rilis).
- **#E3FF3B tidak boleh dipakai sebagai warna teks atau ikon pada latar terang**; gunakan sebagai *fill* dengan teks #252943.
- **#33A4FA dan #F59E0B tidak boleh dipakai sebagai warna teks kecil pada latar putih**; gunakan sebagai fill atau pasangkan dengan label #252943.
- Status tidak boleh hanya dibedakan warna: wajib disertai ikon dan label teks.

### 3.3 Tipografi

**Inter** (fallback: system-ui, sans-serif).

| Token | Ukuran / Berat | Penggunaan |
| --- | --- | --- |
| Display | 32/40, 700 | Angka KPI utama (desktop) |
| H1 | 24/32, 700 | Judul halaman |
| H2 | 20/28, 600 | Judul seksi |
| H3 | 16/24, 600 | Judul kartu |
| Body | 14/20 (desktop), 16/24 (mobile), 400 | Teks isi |
| Caption | 12/16, 500 | Label, metadata, timestamp |
| Mono (angka waktu) | Inter dengan *tabular-nums* | Jam, jarak, koordinat |

### 3.4 Spacing, Radius, dan Elevasi

Grid spacing 4 px (4, 8, 12, 16, 24, 32, 48). Radius: 8 px (input, tombol), 12 px (kartu), 16 px (modal/bottom sheet). Elevasi: maksimum tiga level; border #DEE0ED lebih diutamakan daripada bayangan tebal.

### 3.5 Standar Sistem Komponen

| Komponen | Spesifikasi |
| --- | --- |
| **Buttons** | Primary: fill #3A4EFB, teks putih. Secondary: fill #E3FF3B, teks #252943. Tertiary/Ghost: border #DEE0ED, teks #252943. Destructive: fill #DC2626. Tinggi 48 px (mobile), 40 px (desktop); area sentuh minimal 44x44 px; state: default, hover, focus (ring 2 px #3A4EFB, offset 2 px), pressed, disabled, loading (spinner, tombol tidak dapat ditekan ulang). |
| **Badges** | Pill 24 px. Hadir (#16A34A), Terlambat (#F59E0B), Absen/Ditolak (#DC2626), Aktif/Live (#E3FF3B dengan teks #252943), Menunggu (#DEE0ED dengan teks #252943). Selalu ikon + teks. |
| **Modals** | Desktop: dialog terpusat maksimum 560 px, *focus trap*, tutup dengan Esc. Mobile: bottom sheet dengan handle. Aksi destruktif wajib konfirmasi dua langkah. |
| **Tables** | Header lengket (sticky), baris 48 px, *zebra* opsional (#F8FAFC), sort, kolom dapat disembunyikan, paginasi server-side (25/50/100), seleksi massal, skeleton saat loading. |
| **Toast** | Pojok kanan atas (desktop), atas layar (mobile); auto-dismiss 5 detik (error 8 detik dan dapat ditutup manual); `role="status"`/`aria-live`. |
| **Map Marker** | Aktif/In-Radius: #3A4EFB; Out-of-Radius: #F59E0B (dengan ikon peringatan); Offline: #DEE0ED dengan outline #252943; Lokasi kantor: ikon gedung #252943; Terpilih: ring #E3FF3B. Klaster pada zoom rendah dengan angka jumlah. |
| **Filters** | Chip dan dropdown multi-select, pencarian dengan *debounce* 300 ms, penanda filter aktif, tombol "Reset semua", filter tersimpan di URL (*shareable*). |
| **Empty State** | Ilustrasi sederhana, judul, penjelasan satu kalimat, CTA relevan. |
| **Loading State** | Skeleton untuk daftar/kartu; spinner hanya untuk aksi tombol; indikator progres untuk ekspor. |
| **Error State** | Pesan bahasa manusia (apa yang terjadi, mengapa, apa selanjutnya), tombol "Coba lagi", kode referensi untuk dukungan. |

---

## 4. Feature Specifications & User Stories

**Konvensi:** FR = Functional Requirement; AC = Acceptance Criteria (format Given/When/Then); prioritas MoSCoW (M = Must, S = Should, C = Could).

### MODUL 1: EMPLOYEE MOBILE PWA / WEB

#### 4.1 Authentication & Onboarding

**User Story:** *Sebagai* karyawan, *saya ingin* masuk dengan aman dan cepat serta memahami data apa yang dikumpulkan, *sehingga* saya dapat mulai absen tanpa kebingungan dan dengan rasa percaya.

**Detailed Requirements**

| ID | Requirement | Prioritas |
| --- | --- | --- |
| FR-1.1.1 | Login menggunakan **Employee ID atau email** dan kata sandi; dukung SSO bila diaktifkan tenant. | M |
| FR-1.1.2 | **Remember Me**: sesi persisten 30 hari via refresh token rotasi, disimpan di cookie `HttpOnly; Secure; SameSite=Strict`. Tidak disimpan di localStorage. | M |
| FR-1.1.3 | **Forgot Password**: tautan reset berlaku 30 menit, sekali pakai; respons generik agar tidak membocorkan keberadaan akun. | M |
| FR-1.1.4 | Validasi inline: email/ID wajib, kata sandi minimal 10 karakter (huruf besar, kecil, angka); tampilkan/sembunyikan kata sandi. | M |
| FR-1.1.5 | Pembatasan percobaan: 5 gagal berturut-turut mengunci akun 15 menit; notifikasi ke email pengguna. | M |
| FR-1.1.6 | **Onboarding pertama kali** (3 langkah): (1) penjelasan fungsi, (2) **layar consent privasi lokasi** (eksplisit, dapat dibaca, dicatat versi dan waktu persetujuan), (3) permintaan izin lokasi dan notifikasi dengan penjelasan manfaat sebelum prompt sistem muncul. | M |
| FR-1.1.7 | Ganti kata sandi sementara wajib pada login pertama untuk akun yang dibuat Admin. | M |
| FR-1.1.8 | Prompt "Install aplikasi" (A2HS) setelah login berhasil kedua kali. | S |

**Acceptance Criteria**

- *Given* kredensial valid, *when* pengguna menekan Masuk, *then* dashboard tampil < 2 detik dan sesi dibuat.
- *Given* akun belum menyetujui consent, *when* login berhasil, *then* pengguna diarahkan ke layar consent dan tidak dapat check-in sebelum menyetujui.
- *Given* 5 kegagalan login, *when* percobaan ke-6, *then* tampil pesan penguncian dengan hitung mundur.

**Edge Cases & Error Handling**

| Kasus | Penanganan UX |
| --- | --- |
| Akun dinonaktifkan Admin | "Akun Anda tidak aktif. Hubungi HR." Tanpa detail tambahan; tidak ada tombol coba ulang. |
| Tautan reset kedaluwarsa | Halaman informatif dengan tombol "Kirim ulang tautan". |
| Jaringan terputus saat login | Toast "Tidak ada koneksi", form tetap terisi, tombol *retry*. |
| Pengguna menolak consent | Tampilkan konsekuensi (tidak dapat absen berbasis lokasi) dan opsi hubungi HR; tidak ada pelacakan apa pun. |
| Login di perangkat baru | Notifikasi email "Login dari perangkat baru"; kebijakan maksimum 2 perangkat aktif (konfigurasi tenant). |

#### 4.2 Mobile Dashboard

**User Story:** *Sebagai* karyawan, *saya ingin* melihat status hari ini dan jarak saya ke kantor dalam satu layar, *sehingga* saya tahu apakah dapat absen dan tidak perlu menebak.

**Detailed Requirements**

| ID | Requirement | Prioritas |
| --- | --- | --- |
| FR-1.2.1 | **Greeting** kontekstual ("Selamat pagi, Bian") dengan nama, departemen, dan shift hari ini. | M |
| FR-1.2.2 | **Time Sync Status**: jam ditampilkan berdasarkan waktu server; indikator "Tersinkron" (hijau) atau "Selisih waktu perangkat X detik" (kuning) bila selisih > 60 detik; check-in tetap memakai waktu server. | M |
| FR-1.2.3 | **Office Distance**: jarak real-time ke titik/area kantor terdekat yang ditugaskan, dengan label *Dalam radius* / *Di luar radius* serta akurasi GPS ("±12 m"). | M |
| FR-1.2.4 | **Main Attendance CTA**: satu tombol besar kontekstual: "Check-In" (primer #3A4EFB), "Check-Out", atau status selesai (non-aktif). Tombol non-aktif disertai alasan yang jelas. | M |
| FR-1.2.5 | **Recent History**: 5 catatan terakhir (tanggal, jam masuk/pulang, badge status), tautan "Lihat semua". | M |
| FR-1.2.6 | Indikator pengingat/notifikasi belum dibaca pada header. | S |
| FR-1.2.7 | Tarik-untuk-segarkan (pull-to-refresh) dan pembaruan otomatis jarak setiap 10 detik saat layar aktif. | S |

**Acceptance Criteria**

- *Given* pengguna di dalam radius dengan akurasi ≤ ambang, *when* dashboard dibuka, *then* tombol Check-In aktif dan label "Dalam radius" berwarna hijau (disertai ikon).
- *Given* izin lokasi ditolak, *when* dashboard dibuka, *then* kartu jarak menampilkan state izin dengan panduan mengaktifkan.

**Edge Cases & Error Handling**

- Belum ada shift hari ini (hari libur/off): tampilkan "Tidak ada jadwal hari ini", CTA dinonaktifkan dengan opsi *Check-in lembur* hanya bila diaktifkan tenant.
- GPS belum terkunci: skeleton pada kartu jarak, teks "Mencari lokasi..." maksimum 15 detik, lalu state error dengan *retry*.
- Dua kantor/lokasi ditugaskan: tampilkan lokasi terdekat dengan opsi ganti lokasi.
- Kondisi jam melewati tengah malam (shift malam): penentuan "hari kerja" mengikuti tanggal mulai shift.

#### 4.3 Geofenced Check-In & Check-Out

**User Story:** *Sebagai* karyawan, *saya ingin* mencatat kehadiran hanya ketika saya benar-benar berada di lokasi kerja, *sehingga* catatan saya sah dan tidak diragukan.

##### 4.3.1 Akurasi GPS & Verification Radius

| ID | Requirement | Prioritas |
| --- | --- | --- |
| FR-1.3.1 | Saat tombol ditekan, klien mengambil posisi dengan `enableHighAccuracy: true`, *timeout* 15 detik, `maximumAge: 0`. Sampling 3 pembacaan dalam ≤ 8 detik; gunakan pembacaan dengan akurasi terbaik. | M |
| FR-1.3.2 | **Ambang akurasi** (dapat dikonfigurasi Admin): *Diterima* bila `accuracy` ≤ 50 m (default). Bila 50-100 m: tampilkan peringatan dan izinkan percobaan ulang; > 100 m: tolak dan arahkan perbaikan sinyal. | M |
| FR-1.3.3 | **Radius verifikasi** (default 100 m, rentang 20-1.000 m): titik valid bila **jarak ke pusat ≤ radius**. Evaluasi akhir dilakukan **di server**; keputusan klien hanya sebagai UX. | M |
| FR-1.3.4 | Kebijakan *accuracy-aware*: bila `jarak − akurasi ≤ radius < jarak`, tandai **"Borderline"** (diterima dengan flag untuk tinjauan, atau ditolak, sesuai kebijakan tenant). | S |
| FR-1.3.5 | Payload check-in: `lat`, `lng`, `accuracy`, `altitude`, `speed`, `heading`, `device_timestamp`, `device_id` (hash), `app_version`, `idempotency_key`, sinyal deteksi mock (4.3.2). Server menambahkan `server_timestamp` (UTC) sebagai waktu resmi. | M |
| FR-1.3.6 | Aturan keterlambatan dihitung server: `check_in_time > jam_masuk + toleransi` menghasilkan status **Terlambat**. | M |

##### 4.3.2 Mock Location / Anti-Fake GPS Detection (Persyaratan Kritis)

> **Catatan arsitektur:** PWA tidak dapat membaca flag "mock provider" milik OS. Oleh karena itu, deteksi memakai **pertahanan berlapis (defense in depth)** dengan *risk score* gabungan. Tidak ada satu sinyal pun yang dianggap konklusif.

| Lapisan | Sinyal / Teknik | Tindakan |
| --- | --- | --- |
| **L1: Anomali sensor klien** | Akurasi tidak wajar (konstan 0-1 m atau angka bulat berulang), `altitude`/`speed` null atau konstan padahal bergerak, koordinat persis sama berulang pada beberapa pembacaan, presisi desimal tidak wajar | +skor risiko |
| **L2: Konsistensi temporal** | `device_timestamp` vs waktu server menyimpang jauh; urutan pembacaan tidak monoton | +skor risiko |
| **L3: Kinematika (server)** | **Impossible travel**: perpindahan dari titik terakhir yang diketahui dengan kecepatan > 150 km/jam (atau tidak mungkin untuk waktu yang berlalu); lompatan posisi mendadak | +skor tinggi atau blokir |
| **L4: Korelasi jaringan** | Kesesuaian lokasi GPS dengan geolokasi IP kasar (negara/kota); deteksi VPN/proxy/Tor dari reputasi IP | +skor risiko |
| **L5: Lingkungan perangkat** | Deteksi *user agent* anomali, mode developer/emulator via sinyal browser yang tersedia, perangkat tidak dikenal (device fingerprint baru) | +skor risiko |
| **L6: Pola perilaku** | Pola check-in selalu pada koordinat identik ke desimal ke-7, banyak akun pada satu perangkat/IP, akun yang sama check-in dari dua perangkat berbeda | Flag analitik |
| **L7 (Roadmap v1.5)** | Aplikasi native/wrapper dengan `isMock`/`isFromMockProvider`, Play Integrity API, App Attest (iOS) | Penegakan keras |

**Kebijakan keputusan berbasis skor (dapat dikonfigurasi per tenant):**

| Skor Risiko | Keputusan | Pengalaman Pengguna |
| --- | --- | --- |
| 0-39 (Rendah) | Check-in diterima | Normal |
| 40-69 (Sedang) | Diterima dengan **flag "Perlu Tinjauan"** atau meminta verifikasi tambahan | Pesan netral; entri masuk antrean Admin |
| 70-100 (Tinggi) | **Check-in ditolak** | Pesan Fake GPS (lihat Bagian 5, matriks #6) |

| ID | Requirement | Prioritas |
| --- | --- | --- |
| FR-1.3.7 | Skor risiko dihitung server dan disimpan bersama alasan (*reason codes*) untuk audit; pengguna tidak melihat detail teknis agar tidak membantu penghindaran. | M |
| FR-1.3.8 | Setiap penolakan Fake GPS membuat **alert ke Admin** dan masuk log audit; tiga insiden dalam 7 hari memicu notifikasi eskalasi. | M |
| FR-1.3.9 | Pesan kesalahan pada pengguna bersifat netral dan tidak menuduh ("Kami tidak dapat memverifikasi lokasi Anda"), mencegah *false positive* merusak kepercayaan; sediakan jalur banding (4.4). | M |
| FR-1.3.10 | Tingkat *false positive* ditargetkan < 1%; ambang diuji dengan data pilot sebelum penegakan penuh (mode *shadow* 2 minggu). | S |

##### 4.3.3 Konfirmasi Check-Out & Catatan

| ID | Requirement | Prioritas |
| --- | --- | --- |
| FR-1.3.11 | Check-Out memakai alur verifikasi lokasi yang sama; dialog konfirmasi menampilkan ringkasan (jam masuk, durasi kerja, jam pulang saat ini). | M |
| FR-1.3.12 | **Catatan (opsional, maksimum 250 karakter)**; **wajib** bila check-out sebelum jam pulang (pulang cepat) atau di luar radius yang diizinkan (kerja lapangan). | M |
| FR-1.3.13 | Mode **Kerja Lapangan**: tenant dapat mengizinkan check-in/out di luar radius dengan alasan dan lokasi tercatat, berstatus *Pending Approval*. | S |
| FR-1.3.14 | Setelah sukses: layar konfirmasi (centang, jam server, lokasi), getaran singkat bila didukung, dan pembaruan dashboard seketika. | M |

**Acceptance Criteria**

- *Given* pengguna di dalam radius dengan akurasi ≤ 50 m dan skor risiko < 40, *when* menekan Check-In, *then* API merespons < 1,5 detik, status tercatat dengan timestamp server dan toast sukses tampil.
- *Given* pengguna di luar radius, *when* menekan Check-In, *then* permintaan ditolak, jarak aktual ditampilkan ("Anda 340 m dari kantor") dan tidak ada catatan dibuat.
- *Given* koneksi bermasalah saat submit, *when* permintaan gagal, *then* tidak terjadi duplikasi berkat `idempotency_key` saat percobaan ulang.
- *Given* check-out sebelum jam pulang, *when* pengguna menekan Check-Out, *then* catatan menjadi wajib sebelum dapat dikonfirmasi.

**Edge Cases & Error Handling**

| Kasus | Penanganan |
| --- | --- |
| Dobel tap tombol | Tombol dikunci saat *loading*; server menolak duplikat via idempotency key |
| Lupa check-out | Sistem menandai "Tidak ada check-out" pada akhir hari; pengguna dapat mengajukan koreksi (4.4/Modul 2 butir 4); notifikasi pengingat 30 menit setelah jam pulang |
| Shift melewati tengah malam | Check-out dikaitkan ke catatan shift terbuka, bukan tanggal kalender |
| Di dalam gedung dengan GPS lemah | Panduan "Dekati jendela/area terbuka"; tombol *Coba lagi* tanpa batas, dengan *rate limit* 1 percobaan/3 detik |
| Perangkat berpindah zona waktu | Seluruh penyimpanan UTC; tampilan mengikuti zona waktu lokasi kantor |
| Mode hemat daya OS membatasi GPS | Deteksi akurasi buruk berulang dan sarankan menonaktifkan mode hemat daya |

#### 4.4 Attendance History & Detail View

**User Story:** *Sebagai* karyawan, *saya ingin* meninjau seluruh riwayat dan buktinya, *sehingga* saya dapat memeriksa kesalahan dan mengajukan koreksi bila perlu.

| ID | Requirement | Prioritas |
| --- | --- | --- |
| FR-1.4.1 | **List view** dikelompokkan per bulan dengan *infinite scroll* (20 item/halaman): tanggal, jam masuk, jam pulang, durasi, badge status. | M |
| FR-1.4.2 | **Status badge:** Hadir, Terlambat, Pulang Cepat, Absen, Perlu Tinjauan, Disesuaikan (koreksi Admin), Menunggu Persetujuan. | M |
| FR-1.4.3 | **Detail view:** waktu masuk/pulang (server), jarak ke kantor, akurasi, catatan, status, riwayat koreksi dengan nama penyetuju. | M |
| FR-1.4.4 | **Map preview** statis/interaktif ringan: marker lokasi check-in, lingkaran radius kantor, label jarak. | M |
| FR-1.4.5 | **Filter:** rentang tanggal (preset: 7 hari, bulan ini, bulan lalu, kustom) dan status; tampilkan jumlah hasil. | M |
| FR-1.4.6 | **Ajukan koreksi/banding** dari detail view: pilih jenis, alasan, lampiran opsional; status pengajuan terlihat. | S |
| FR-1.4.7 | Ringkasan bulanan: total hari hadir, terlambat, rata-rata jam masuk. | C |

**Edge Cases:** riwayat kosong (empty state "Belum ada catatan kehadiran"), peta gagal dimuat (tampilkan koordinat teks dan tombol coba lagi), data lintas bulan lama (arsip) dimuat bertahap dengan indikator, catatan dengan status *Disesuaikan* menampilkan nilai asli dan nilai akhir secara transparan.

#### 4.5 Employee Profile & Account Management

**User Story:** *Sebagai* karyawan, *saya ingin* mengelola profil dan keamanan akun serta mengendalikan privasi saya, *sehingga* data saya akurat dan aman.

| ID | Requirement | Prioritas |
| --- | --- | --- |
| FR-1.5.1 | Tampilkan: foto, nama, Employee ID, departemen, jabatan, atasan, shift, lokasi kerja. Data inti **read-only** (diubah via HR). | M |
| FR-1.5.2 | Karyawan dapat mengubah: foto profil (maks. 2 MB; JPG/PNG), nomor telepon, preferensi notifikasi, bahasa. | M |
| FR-1.5.3 | **Ganti kata sandi** (verifikasi sandi lama, indikator kekuatan, sesi lain dicabut setelah ganti). | M |
| FR-1.5.4 | **Manajemen perangkat/sesi aktif** dengan opsi keluar dari perangkat lain. | S |
| FR-1.5.5 | **Pusat privasi:** lihat consent yang disetujui (versi dan tanggal), ringkasan data lokasi yang dikumpulkan, serta **permintaan akses/penghapusan data** (terhubung alur DSAR). | M |
| FR-1.5.6 | **Logout** dengan penghapusan token dan cache sensitif di perangkat. | M |

**Edge Cases:** unggah foto gagal/terlalu besar (pesan spesifik), perubahan nomor telepon memerlukan verifikasi OTP bila diaktifkan, penarikan consent lokasi: pengguna diberi peringatan bahwa absensi berbasis lokasi tidak dapat dipakai dan HR diberi tahu agar menyediakan metode alternatif.

#### 4.6 Mobile Notification Center

**User Story:** *Sebagai* karyawan, *saya ingin* menerima pengingat dan informasi penting tepat waktu, *sehingga* saya tidak lupa absen dan tidak terlambat.

| ID | Requirement | Prioritas |
| --- | --- | --- |
| FR-1.6.1 | **Reminders:** pengingat check-in (default 15 menit sebelum jam masuk) dan check-out (saat jam pulang); dapat diatur/dimatikan per jenis. | M |
| FR-1.6.2 | **Late alerts:** notifikasi bila belum check-in melewati toleransi ("Anda belum check-in. Batas toleransi berakhir 5 menit lagi"). | M |
| FR-1.6.3 | **System broadcast:** pengumuman dari Admin (kebijakan, libur, gangguan sistem) dengan prioritas normal/penting. | M |
| FR-1.6.4 | **Notification Center** dalam aplikasi: daftar kronologis, status baca/belum, filter jenis, "Tandai semua dibaca", penyimpanan 90 hari. | M |
| FR-1.6.5 | Notifikasi status pengajuan koreksi (disetujui/ditolak) dengan tautan langsung ke detail. | S |
| FR-1.6.6 | Opt-in Web Push dengan penjelasan manfaat sebelum prompt sistem; fallback in-app bila ditolak atau tidak didukung (mis. iOS non-install). | M |

**Edge Cases:** izin push ditolak (banner panduan mengaktifkan kembali, tidak mengganggu berulang), notifikasi ganda (deduplikasi berdasarkan ID), jam senyap (*quiet hours*) menunda notifikasi non-kritis, tanpa notifikasi (empty state), pengiriman gagal (percobaan ulang dengan *backoff* di server).

### MODUL 2: ADMIN DESKTOP DASHBOARD

#### 4.7 Dashboard Overview & Real-Time KPIs

**User Story:** *Sebagai* HR/Operational Administrator, *saya ingin* melihat kondisi kehadiran seluruh organisasi secara real-time, *sehingga* saya dapat bertindak atas anomali sebelum menjadi masalah.

| ID | Requirement | Prioritas |
| --- | --- | --- |
| FR-2.1.1 | **Metric Cards** (lima kartu, pembaruan otomatis ≤ 30 detik): **Total Employees**, **Present Today**, **Late Today**, **Absent Today**, **Currently Working**. Setiap kartu menampilkan angka (Display), persentase terhadap total, dan delta dibanding kemarin; klik kartu membuka daftar terfilter. | M |
| FR-2.1.2 | **Definisi metrik** yang konsisten: *Present* = memiliki check-in valid hari ini; *Late* = check-in melewati toleransi; *Absent* = terjadwal bekerja, tidak ada check-in, dan jam masuk + toleransi sudah lewat (bukan cuti/libur); *Currently Working* = sudah check-in dan belum check-out. | M |
| FR-2.1.3 | **Attendance Trend Chart:** grafik garis/area 7, 30, atau 90 hari (Hadir #3A4EFB, Terlambat #F59E0B, Absen #DC2626), *tooltip*, legenda dapat diklik, tabel data alternatif untuk aksesibilitas. | M |
| FR-2.1.4 | **Status Distribution Chart:** donut hari ini (Tepat waktu, Terlambat, Absen, Perlu Tinjauan) dengan angka dan persentase di legenda, dapat difilter per departemen. | M |
| FR-2.1.5 | **Live Activity Feed:** aliran peristiwa real-time (check-in, check-out, terlambat, Fake GPS terdeteksi, pengajuan koreksi), 50 item terbaru, jeda otomatis saat kursor di atas feed, filter jenis. | M |
| FR-2.1.6 | **Quick Actions:** Tambah Karyawan, Buka Peta Live, Tinjau Persetujuan (dengan badge jumlah), Unduh Laporan Hari Ini, Kirim Broadcast. Tombol utama memakai #3A4EFB dan satu aksi sekunder memakai #E3FF3B. | M |
| FR-2.1.7 | Pemilih konteks: lokasi/cabang, departemen, dan tanggal; berlaku untuk seluruh widget. | S |
| FR-2.1.8 | **Executive View:** peran Executive melihat kartu KPI, tren, dan distribusi agregat tanpa akses data lokasi individual. | M |

**Acceptance Criteria**

- *Given* seorang karyawan check-in, *when* event diproses, *then* kartu *Present*, *Currently Working*, dan feed diperbarui < 5 detik tanpa muat ulang halaman.
- *Given* koneksi real-time terputus, *when* lebih dari 10 detik, *then* banner "Data live terjeda, mencoba menyambung kembali" tampil dan sistem otomatis mencoba ulang dengan *exponential backoff*.

**Edge Cases & Error Handling:** tenant baru tanpa data (empty state dengan CTA "Tambah karyawan pertama"), satu widget gagal (error lokal pada kartu tanpa merusak halaman), hari libur nasional (metrik *Absent* tidak dihitung), lonjakan event pada jam puncak (feed memakai *batching* 1 detik), perbedaan zona waktu antar cabang (setiap cabang dihitung pada zona waktunya).

#### 4.8 Real-Time Live Monitoring & Interactive Map

**User Story:** *Sebagai* Operational Admin, *saya ingin* melihat posisi dan status tim lapangan pada peta, *sehingga* saya dapat menugaskan dan merespons dengan cepat.

| ID | Requirement | Prioritas |
| --- | --- | --- |
| FR-2.2.1 | **Map Canvas** layar penuh (Google Maps/Mapbox) dengan lapisan: marker karyawan, lingkaran geofence kantor, dan klaster. Update posisi **< 5 detik** dari penerimaan data melalui WebSocket/SSE. | M |
| FR-2.2.2 | **Status marker:** *Active* (#3A4EFB, check-in dan dalam radius), *In-Radius* (ikon kantor), *Out-of-Radius* (#F59E0B + ikon peringatan), *Offline* (#DEE0ED, outline #252943; tidak ada update > 10 menit). Warna selalu disertai bentuk/ikon berbeda. | M |
| FR-2.2.3 | **Dynamic Filtering:** departemen (multi-select), status (Active, Offline, In/Out-of-Radius), pencarian nama/ID dengan *autocomplete*. Peta dan daftar samping terfilter bersamaan; jumlah hasil ditampilkan. | M |
| FR-2.2.4 | **Interactive Employee Detail Panel:** klik marker membuka *side drawer* (lebar 400 px) berisi foto, nama, ID, departemen, status check-in, jam masuk, jarak ke kantor, akurasi, **timestamp lokasi terakhir** ("2 menit lalu"), dan tautan ke riwayat. Marker terpilih diberi ring #E3FF3B. | M |
| FR-2.2.5 | **Indikator usia data:** posisi lebih dari 5 menit ditandai "Terakhir diketahui" dengan penanda waktu, sehingga Admin tidak menyimpulkan posisi saat ini dari data usang. | M |
| FR-2.2.6 | **Hanya jam kerja dan hanya consent:** peta hanya menampilkan karyawan yang sedang dalam sesi kerja (setelah check-in dan sebelum check-out) dan telah memberi consent; di luar itu tidak ada pelacakan atau tampilan. | M |
| FR-2.2.7 | **Pencatatan akses:** setiap pembukaan detail lokasi individual dicatat di audit log (siapa, kapan, karyawan mana). | M |
| FR-2.2.8 | Layer opsional: jejak perjalanan hari ini (breadcrumb) dengan retensi singkat sesuai kebijakan (Bagian 8.1). | C |
| FR-2.2.9 | Tampilan daftar sebagai alternatif aksesibel dari peta (tabel sinkron dengan filter). | M |

**Acceptance Criteria**

- *Given* 500 marker aktif, *when* peta dimuat, *then* render awal < 3 detik dengan klaster dan interaksi tetap lancar (≥ 30 fps).
- *Given* Admin mengklik marker, *when* panel terbuka, *then* data tampil < 500 ms dan entri audit tercatat.

**Edge Cases & Error Handling:** peta gagal dimuat atau kuota API habis (fallback ke tampilan daftar dengan koordinat dan pesan jelas), banyak marker bertumpuk (klaster dan *spiderfy*), karyawan tanpa consent (ditampilkan "Lokasi tidak dibagikan" dalam daftar, bukan marker), data lokasi akurasi buruk (lingkaran akurasi pada marker), pembaruan massal (throttling render agar UI tidak membeku).

#### 4.9 Employee Management

**User Story:** *Sebagai* HR Admin, *saya ingin* mengelola data dan akun karyawan secara efisien, *sehingga* data induk selalu akurat dan akses sesuai status kerja.

| ID | Requirement | Prioritas |
| --- | --- | --- |
| FR-2.3.1 | **CRUD** karyawan: Employee ID (unik), nama, email, telepon, departemen, jabatan, atasan, shift, lokasi kerja, tanggal bergabung, foto. Validasi inline dan pencegahan duplikat. | M |
| FR-2.3.2 | **Status Toggle** Aktif/Nonaktif dengan konfirmasi; karyawan nonaktif tidak dapat login, riwayat tetap tersimpan (*soft delete*, tidak ada hapus permanen kecuali melalui prosedur penghapusan data). | M |
| FR-2.3.3 | **Department Assignment:** pemindahan departemen (satu atau massal) dengan tanggal efektif; riwayat penempatan tercatat. | M |
| FR-2.3.4 | **Account Activation:** undangan via email dengan tautan aktivasi (berlaku 72 jam), kirim ulang undangan, status *Invited/Active/Inactive*. | M |
| FR-2.3.5 | **Impor massal CSV/Excel** dengan *template*, pratinjau validasi per baris, dan laporan kesalahan yang dapat diunduh. | S |
| FR-2.3.6 | Daftar karyawan: pencarian, filter (departemen, status, shift), sort, paginasi, aksi massal (aktifkan, nonaktifkan, ubah departemen, ubah shift), ekspor. | M |
| FR-2.3.7 | Reset kata sandi oleh Admin (tautan reset, bukan menampilkan sandi) dan pencabutan sesi aktif. | M |
| FR-2.3.8 | Peran dan hak akses (RBAC) ditetapkan per pengguna; perubahan peran tercatat di audit log. | M |

**Acceptance Criteria**

- *Given* Admin menonaktifkan karyawan, *when* disimpan, *then* sesi aktif karyawan berakhir dalam ≤ 60 detik dan karyawan hilang dari peta serta metrik *Currently Working*.
- *Given* impor CSV dengan 3 baris tidak valid dari 200, *when* diproses, *then* 197 baris berhasil dan laporan kesalahan merinci nomor baris dan alasan.

**Edge Cases:** Employee ID/email duplikat (pesan spesifik dan tautan ke rekaman yang ada), menonaktifkan karyawan yang sedang check-in (peringatan dan opsi *force check-out* dengan catatan), departemen dihapus saat masih memiliki anggota (diblokir dengan penjelasan), undangan kedaluwarsa (kirim ulang), perubahan massal sebagian gagal (laporan per baris).

#### 4.10 Attendance Management & Approval

**User Story:** *Sebagai* HR Admin, *saya ingin* merekap kehadiran dan memproses koreksi dengan jejak audit yang jelas, *sehingga* data siap payroll dan sengketa dapat diselesaikan secara adil.

| ID | Requirement | Prioritas |
| --- | --- | --- |
| FR-2.4.1 | **Rekapitulasi** tabel kehadiran harian/periode: karyawan, tanggal, masuk, pulang, durasi, status, jarak, flag risiko. Server-side pagination. | M |
| FR-2.4.2 | **Filter** tanggal (preset dan kustom), departemen, status, lokasi, flag (Perlu Tinjauan, Fake GPS, Di luar radius). Filter tersimpan di URL. | M |
| FR-2.4.3 | **Manual Adjustment / Correction Workflow:** (1) pengajuan oleh karyawan atau inisiasi Admin, (2) alasan wajib dan lampiran opsional, (3) review atasan/HR, (4) setujui atau tolak dengan catatan, (5) catatan asli dipertahankan dan nilai koreksi ditandai *Disesuaikan*, (6) notifikasi ke karyawan. | M |
| FR-2.4.4 | **Antrean persetujuan** dengan SLA (default 2 hari kerja), pengingat otomatis, persetujuan massal untuk jenis yang sama. | M |
| FR-2.4.5 | **Prinsip empat-mata (four-eyes)** (konfigurasi): Admin tidak dapat menyetujui koreksi yang ia ajukan sendiri. | S |
| FR-2.4.6 | Tinjauan flag risiko: Admin dapat melihat alasan penandaan (reason codes), bukti peta, dan memilih *Validasi*, *Tolak*, atau *Minta klarifikasi*. | M |
| FR-2.4.7 | **Kunci periode:** periode yang sudah ditutup untuk payroll tidak dapat diubah tanpa membuka kunci oleh Super Admin (tercatat). | S |
| FR-2.4.8 | Riwayat perubahan lengkap per catatan (siapa, kapan, nilai sebelum dan sesudah, alasan). | M |

**Acceptance Criteria**

- *Given* koreksi disetujui, *when* disimpan, *then* nilai asli tetap tersimpan, status menjadi *Disesuaikan*, rekap dan laporan diperbarui dan karyawan menerima notifikasi.
- *Given* periode terkunci, *when* Admin mencoba mengoreksi, *then* aksi ditolak dengan penjelasan dan instruksi membuka kunci.

**Edge Cases:** dua Admin menyetujui koreksi yang sama bersamaan (*optimistic locking*, pesan konflik), koreksi mencakup waktu di masa depan (ditolak), pengajuan pada karyawan nonaktif (diperbolehkan untuk periode historis dengan peringatan), pengaju koreksi tidak lagi memiliki atasan (rute ke HR).

#### 4.11 Comprehensive Reporting Engine

**User Story:** *Sebagai* HR Admin atau Executive, *saya ingin* laporan yang akurat dan dapat diekspor, *sehingga* saya dapat melapor ke manajemen dan memproses payroll tanpa pengolahan manual.

| ID | Requirement | Prioritas |
| --- | --- | --- |
| FR-2.5.1 | Laporan **Harian, Mingguan, Bulanan** dengan ringkasan: hari kerja, hadir, terlambat, absen, total jam, rata-rata jam masuk, per karyawan, per departemen, dan per lokasi. | M |
| FR-2.5.2 | **Late Statistics:** frekuensi dan total menit keterlambatan, peringkat departemen, tren, serta karyawan dengan pola keterlambatan berulang (ambang dapat dikonfigurasi). | M |
| FR-2.5.3 | **Export PDF** (ringkasan eksekutif berformat, memuat logo tenant, periode, filter) dan **CSV/Excel** (data mentah dengan kolom konsisten, UTF-8 BOM, format tanggal ISO 8601). | M |
| FR-2.5.4 | Pembuatan laporan besar secara **asinkron**: indikator progres, notifikasi ketika selesai, tautan unduh bertanda waktu (berlaku 24 jam). | M |
| FR-2.5.5 | **Laporan terjadwal** via email (harian/mingguan/bulanan) ke daftar penerima. | S |
| FR-2.5.6 | Pembatasan ekspor berdasarkan peran; setiap ekspor tercatat di audit log; ekspor yang memuat koordinat memerlukan izin khusus. | M |
| FR-2.5.7 | Pencegahan *formula injection* pada CSV/Excel (awalan `=`, `+`, `-`, `@` dinetralkan). | M |

**Acceptance Criteria**

- *Given* laporan bulanan 5.000 karyawan, *when* diekspor, *then* proses selesai ≤ 60 detik dan berkas dapat dibuka tanpa kerusakan di Excel dan Google Sheets.
- *Given* hasil filter kosong, *when* ekspor diminta, *then* sistem menampilkan pesan "Tidak ada data untuk periode ini" dan tidak menghasilkan berkas kosong.

**Edge Cases:** ekspor melebihi batas baris (dipecah otomatis atau diarahkan ke laporan terjadwal), kegagalan generasi (notifikasi gagal dan opsi ulang), perubahan data saat laporan dibuat (snapshot pada waktu mulai ekspor), laporan lintas zona waktu (ditandai zona waktu acuan).

#### 4.12 Admin System Settings

**User Story:** *Sebagai* Super Admin, *saya ingin* mengonfigurasi aturan lokasi, jam kerja, dan notifikasi tanpa bantuan engineering, *sehingga* kebijakan perusahaan dapat diterapkan dengan cepat dan terkontrol.

##### 4.12.1 Geofencing & Office Location Config

| ID | Requirement | Prioritas |
| --- | --- | --- |
| FR-2.6.1 | Daftar lokasi kantor: nama, alamat, **Latitude, Longitude**, **Radius (meter)**, zona waktu, status aktif. Mendukung banyak lokasi. | M |
| FR-2.6.2 | Penetapan titik melalui peta interaktif (geser pin), pencarian alamat, atau input koordinat manual; validasi rentang (lat -90..90, lng -180..180). | M |
| FR-2.6.3 | Radius dengan *slider* dan input numerik (20-1.000 m, default 100 m); pratinjau lingkaran secara langsung di peta. | M |
| FR-2.6.4 | Penugasan lokasi ke karyawan/departemen; satu karyawan dapat memiliki lebih dari satu lokasi yang diizinkan. | M |
| FR-2.6.5 | Konfigurasi ambang akurasi GPS dan kebijakan *borderline* (4.3.1) serta ambang skor risiko Fake GPS (4.3.2). | M |
| FR-2.6.6 | Poligon geofence kustom (v1.5; v1.0 hanya radius lingkaran). | C |

##### 4.12.2 Shift & Working Hours Config

| ID | Requirement | Prioritas |
| --- | --- | --- |
| FR-2.6.7 | Definisi shift: nama, **Jam Masuk**, **Jam Pulang**, hari kerja, dukungan shift melewati tengah malam, durasi istirahat. | M |
| FR-2.6.8 | **Late Tolerance Threshold** dalam menit (default 10; rentang 0-120) per shift. | M |
| FR-2.6.9 | Kalender libur (nasional dan perusahaan) untuk menghindari status Absen yang keliru. | M |
| FR-2.6.10 | Perubahan aturan berlaku **sejak tanggal efektif ke depan**; tidak mengubah data historis; pratinjau dampak (jumlah karyawan terpengaruh) sebelum disimpan. | M |

##### 4.12.3 Notification Rules & System Audit Logs

| ID | Requirement | Prioritas |
| --- | --- | --- |
| FR-2.6.11 | Aturan notifikasi: waktu pengingat check-in/out, notifikasi keterlambatan, eskalasi ke atasan, alert Fake GPS ke Admin; kanal (push, in-app, email). | M |
| FR-2.6.12 | Template pesan dengan variabel (nama, jam, lokasi), pratinjau, dan uji kirim. | S |
| FR-2.6.13 | **System Audit Logs:** pencatatan imutabel (*append-only*) untuk login, perubahan konfigurasi, CRUD karyawan, koreksi kehadiran, akses data lokasi, ekspor, dan perubahan peran. Kolom: waktu (UTC), aktor, aksi, objek, nilai sebelum/sesudah, IP, perangkat. | M |
| FR-2.6.14 | Filter, pencarian, dan ekspor audit log; retensi minimal 12 bulan (konfigurasi tenant, selaras kebijakan hukum). | M |
| FR-2.6.15 | Kebijakan privasi tenant: teks consent, versi, periode retensi data lokasi, jam pelacakan yang diizinkan. | M |

**Acceptance Criteria**

- *Given* Admin mengubah radius dari 100 m ke 200 m, *when* disimpan, *then* check-in berikutnya memakai radius baru, entri audit log mencatat nilai lama dan baru, dan data historis tidak berubah.
- *Given* konfigurasi tidak valid (koordinat di luar rentang), *when* disimpan, *then* tombol Simpan ditolak dengan pesan inline pada kolom yang bersangkutan.

**Edge Cases:** dua Admin mengubah konfigurasi bersamaan (deteksi konflik versi), perubahan jam kerja saat shift berlangsung (berlaku mulai shift berikutnya), radius sangat kecil dibanding akurasi GPS umum (peringatan "Radius di bawah 30 m dapat menyebabkan penolakan yang keliru"), penghapusan lokasi yang masih ditugaskan (diblokir dengan daftar ketergantungan).

---

## 5. UX States & Error Handling Matrix

| # | Kondisi | Deteksi | Pesan UI (Contoh) | Visual & Komponen | Aksi Tersedia | Perilaku Sistem & Log |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | **GPS Permission Denied / Disabled** | `PERMISSION_DENIED` atau `Permissions API` = denied; layanan lokasi OS nonaktif | "Izin lokasi diperlukan untuk absen. Aktifkan lokasi pada pengaturan browser/perangkat." | Kartu peringatan (#F59E0B), ikon lokasi dicoret; CTA Check-In dinonaktifkan | Tombol "Panduan mengaktifkan" (instruksi per OS/browser), "Coba lagi", "Hubungi HR" | Tidak ada pelacakan; event `permission_denied` dicatat untuk analitik; tidak ada pengumpulan koordinat |
| 2 | **Device Outside Geofence Radius** | Jarak server > radius | "Anda berada 340 m dari kantor. Mendekatlah ke lokasi (maks. 100 m) untuk absen." | Badge "Di luar radius" (#F59E0B + ikon), peta mini dengan lingkaran radius | "Perbarui lokasi", "Ajukan check-in lapangan" (jika diizinkan), "Lihat peta" | Check-in ditolak, percobaan dicatat dengan koordinat dan jarak; tidak ada catatan kehadiran dibuat |
| 3 | **Offline / Poor Network Connectivity** | `navigator.onLine`, *timeout* API, latensi > 5 detik | "Koneksi terputus. Kami tidak dapat memverifikasi absensi Anda." atau "Koneksi lambat, mencoba lagi..." | Banner atas (#F59E0B), spinner pada tombol, indikator *queued* | "Coba lagi"; bila kebijakan tenant mengizinkan, "Simpan untuk dikirim nanti" | **Default: check-in tidak dibuat offline** (mencegah manipulasi waktu). Opsi antrean offline (konfigurasi): payload ditandatangani dengan token waktu, dikirim saat online, ditandai "Offline Sync" dan masuk tinjauan, dengan batas usia antrean 15 menit |
| 4 | **Already Checked-In / Checked-Out** | Server mengembalikan status sesi kerja terbuka/selesai | "Anda sudah check-in pukul 08:02." / "Anda sudah check-out hari ini pukul 17:05." | CTA berubah ke state selesai (non-aktif), kartu status hijau | "Lihat detail", "Ajukan koreksi" | Permintaan duplikat ditolak secara idempoten (tanpa catatan ganda); tidak ada kesalahan merah, sifatnya informatif |
| 5 | **Session Expired / Token Invalidation** | HTTP 401, refresh token gagal/dicabut | "Sesi Anda berakhir. Silakan masuk kembali." | Modal non-dismissible dengan ikon kunci | "Masuk kembali" (tujuan kembali ke layar sebelumnya) | Data form yang belum terkirim dipertahankan sementara di memori; bila check-in sedang berlangsung, pengguna diminta login lalu mengulang verifikasi lokasi; event keamanan dicatat; bila akun dinonaktifkan atau token dicabut, pesan berbeda dan tidak ada opsi coba lagi |
| 6 | **Mock Location / Fake GPS Detected** | Skor risiko ≥ 70 (Bagian 4.3.2) | "Kami tidak dapat memverifikasi lokasi Anda. Pastikan aplikasi lokasi palsu dinonaktifkan, lalu coba lagi." | Modal peringatan (#DC2626) bernada netral, tanpa istilah teknis | "Coba lagi", "Ajukan banding ke HR" | Check-in ditolak; *reason codes* dan skor disimpan; **alert ke Admin**; entri audit; eskalasi pada pola berulang (≥ 3 insiden/7 hari); pengguna tidak melihat detail sinyal |

**Prinsip lintas-state:** (1) pesan menjelaskan *apa, mengapa, dan langkah berikutnya*; (2) tidak menyalahkan pengguna; (3) tombol *retry* selalu tersedia kecuali akun dinonaktifkan; (4) setiap error menampilkan kode referensi untuk dukungan; (5) seluruh state memiliki padanan aksesibel (`aria-live`, fokus dipindahkan ke pesan).

---

## 6. Non-Functional Requirements (NFR)

### 6.1 Security & Data Privacy

| ID | Requirement |
| --- | --- |
| NFR-S1 | **Enkripsi dalam transit:** TLS 1.3 untuk seluruh lalu lintas (TLS 1.2 hanya sebagai fallback terkontrol), HSTS, sertifikat otomatis. Koordinat tidak pernah dikirim di URL/query string. |
| NFR-S2 | **Enkripsi saat disimpan:** AES-256 untuk basis data dan penyimpanan objek; **koordinat presisi tinggi dienkripsi pada tingkat kolom/aplikasi** dengan kunci terkelola (KMS) dan rotasi berkala. |
| NFR-S3 | **Anti-Spoofing:** deteksi berlapis (Bagian 4.3.2), waktu otoritatif dari server, *idempotency key*, penerapan *rate limit* dan deteksi anomali; perlindungan *replay* melalui token bertanda waktu. |
| NFR-S4 | **Autentikasi & otorisasi:** RBAC, prinsip *least privilege*, MFA untuk Admin (wajib) dan opsional bagi karyawan, kebijakan kata sandi, proteksi *brute force*, SSO (SAML/OIDC). |
| NFR-S5 | **Keamanan aplikasi:** mitigasi OWASP Top 10 (XSS, CSRF, injeksi), CSP ketat, cookie `HttpOnly; Secure; SameSite`, validasi input di server, pemindaian dependensi, uji penetrasi tahunan dan sebelum rilis. |
| NFR-S6 | **Isolasi multi-tenant:** pemisahan data logis pada setiap query (*tenant\_id* dengan *row-level security*), uji otomatis anti kebocoran lintas tenant. |
| NFR-S7 | **Audit:** log imutabel untuk akses data lokasi, perubahan konfigurasi, dan ekspor; retensi sesuai kebijakan. |
| NFR-S8 | **Kepatuhan program keamanan:** target selaras ISO/IEC 27001 dan SOC 2 Type II; rencana respons insiden dan notifikasi pelanggaran data sesuai regulasi. |

### 6.2 Kepatuhan Regulasi Privasi (GDPR / PDPA)

Pelacakan lokasi karyawan adalah pemrosesan data pribadi yang sensitif dari sisi risiko. Produk wajib menerapkan *privacy by design*. Untuk pasar Indonesia, rujukan utama adalah **UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)**; untuk pasar Uni Eropa **GDPR**; dan untuk Singapura/Malaysia/Thailand **PDPA** setempat. Kelengkapan dan interpretasi hukum wajib divalidasi oleh Legal/DPO sebelum peluncuran.

| Prinsip | Implementasi Produk |
| --- | --- |
| **Dasar pemrosesan & consent** | Consent eksplisit, spesifik, dan terdokumentasi (versi, waktu) pada onboarding; pengguna dapat menarik consent setiap saat. Perlu dipertimbangkan bahwa dalam hubungan kerja, consent dapat dipandang tidak sepenuhnya bebas; karena itu tenant harus dapat menetapkan dasar hukum alternatif (kewajiban kontraktual/kepentingan sah) dengan *Legitimate Interest Assessment*. |
| **Pembatasan tujuan** | Lokasi digunakan **hanya** untuk verifikasi kehadiran dan, bagi peran lapangan, pemantauan jam kerja; tidak untuk tujuan lain. |
| **Minimisasi data** | Pelacakan hanya antara check-in dan check-out; tidak ada pelacakan di luar jam kerja atau di luar sesi. Presisi lokasi dikurangi/di-*coarse*-kan setelah masa retensi detail. |
| **Retensi** | Koordinat presisi: default 90 hari (dapat dikonfigurasi); data kehadiran agregat sesuai ketentuan ketenagakerjaan; penghapusan otomatis terjadwal. |
| **Transparansi** | Pusat privasi di aplikasi, pemberitahuan yang jelas tentang data yang dikumpulkan, siapa yang dapat melihat, dan berapa lama disimpan. |
| **Hak subjek data** | Akses, koreksi, penghapusan, pembatasan, dan portabilitas (DSAR) melalui alur terdokumentasi dengan SLA internal 30 hari; tercatat. |
| **DPIA** | *Data Protection Impact Assessment* wajib diselesaikan sebelum rilis dan setiap perubahan fitur lokasi signifikan. |
| **Pembatasan akses** | Akses data lokasi individual hanya bagi peran berwenang; setiap akses dicatat; peran Executive hanya melihat agregat. |
| **Residensi dan transfer data** | Opsi wilayah penyimpanan data per tenant; perjanjian pemrosesan data (DPA) dan klausul transfer lintas negara. |
| **Pelaporan insiden** | Prosedur notifikasi pelanggaran data kepada otoritas dan subjek data dalam tenggat waktu yang diatur regulasi (mis. 72 jam menurut GDPR; UU PDP mengatur pemberitahuan tertulis dalam 3x24 jam). |

### 6.3 Performance & Latency

| ID | Metrik | Target |
| --- | --- | --- |
| NFR-P1 | Waktu respons API check-in/out | **< 1,5 detik** pada persentil ke-95 (end-to-end, termasuk verifikasi geofence dan skor risiko) |
| NFR-P2 | Pembaruan posisi pada peta live | **< 5 detik** dari penerimaan data hingga tampil (p95) |
| NFR-P3 | Pemuatan awal PWA (jaringan 4G) | LCP < 2,5 detik, TTI < 3,5 detik; ukuran *bundle* awal < 250 KB (gzip) |
| NFR-P4 | Pemuatan halaman admin | < 2 detik untuk halaman daftar (25 baris); kueri laporan interaktif < 3 detik |
| NFR-P5 | Pembuatan laporan besar | ≤ 60 detik untuk 5.000 karyawan/bulan (asinkron) |
| NFR-P6 | Konsumsi baterai klien | Pengambilan lokasi hanya saat dibutuhkan; dampak baterai < 5% per jam kerja pada pemantauan aktif |

### 6.4 Scalability & Reliability

| ID | Requirement |
| --- | --- |
| NFR-C1 | Mendukung **10.000+ permintaan check-in simultan pada jam puncak** (mis. 08:00-09:00) dengan target ketahanan hingga 3x beban rata-rata puncak tanpa degradasi di atas target latensi. |
| NFR-C2 | **Arsitektur:** layanan *stateless* dengan *horizontal auto-scaling*, antrean untuk *write buffering*, *connection pooling*, *read replica* untuk laporan, cache Redis untuk konfigurasi geofence/shift. |
| NFR-C3 | **Pencegahan *thundering herd*:** *jitter* pada pengingat push dan percobaan ulang klien agar permintaan tersebar. |
| NFR-C4 | **Ketersediaan** ≥ 99,9% per bulan; RPO ≤ 5 menit, RTO ≤ 1 jam; cadangan otomatis harian dan uji pemulihan kuartalan; penyebaran multi-AZ. |
| NFR-C5 | **Degradasi anggun:** bila layanan peta/real-time terganggu, check-in dan rekap tetap berfungsi. |
| NFR-C6 | **Uji beban** sebelum rilis (simulasi 30.000 permintaan/jam puncak, uji *soak* 24 jam) dan setiap perubahan arsitektur signifikan. |
| NFR-C7 | **Observabilitas:** SLO, alerting pada p95 latensi, tingkat galat, kedalaman antrean, dan kegagalan geolokasi. |

### 6.5 Accessibility (WCAG 2.1 AA)

| ID | Requirement |
| --- | --- |
| NFR-A1 | **Kontras:** teks normal ≥ 4,5:1; teks besar dan komponen UI ≥ 3:1; verifikasi seluruh pasangan warna palet (Bagian 3.2), termasuk larangan #E3FF3B dan #33A4FA sebagai teks pada latar terang. |
| NFR-A2 | **Navigasi keyboard:** seluruh fungsi dapat dioperasikan tanpa mouse (Tab, Shift+Tab, Enter, Space, Esc, panah); urutan fokus logis; tanpa *keyboard trap* kecuali dialog dengan *focus trap* yang benar. |
| NFR-A3 | **Focus state terbaca:** ring 2 px #3A4EFB dengan offset 2 px pada semua elemen interaktif. |
| NFR-A4 | **Pembaca layar:** HTML semantik, label ARIA, `aria-live` untuk toast dan pembaruan real-time, teks alternatif; peta memiliki padanan daftar (FR-2.2.9). |
| NFR-A5 | **Tidak bergantung warna:** status selalu memiliki ikon dan teks. |
| NFR-A6 | **Target sentuh** ≥ 44x44 px; dukung zoom hingga 200% dan *reflow* pada lebar 320 px; hormati `prefers-reduced-motion`. |
| NFR-A7 | **Grafik:** deskripsi teks dan tabel data alternatif; pola/label selain warna. |
| NFR-A8 | **Pengujian:** audit otomatis (axe/Lighthouse) di CI, uji manual dengan NVDA/VoiceOver/TalkBack sebelum rilis. |

### 6.6 Compatibility, Localization & Maintainability

| ID | Requirement |
| --- | --- |
| NFR-M1 | Bahasa: Indonesia (default) dan Inggris; format tanggal/waktu lokal, zona waktu per lokasi. |
| NFR-M2 | Cakupan pengujian otomatis unit ≥ 80% pada layanan inti; uji E2E untuk alur kritis (login, check-in, koreksi, ekspor). |
| NFR-M3 | *Feature flag* untuk kebijakan Fake GPS, offline queue, dan mode kerja lapangan agar dapat diaktifkan bertahap per tenant. |

---

## 7. Analytics & Success Measurement

| Metrik | Definisi | Target |
| --- | --- | --- |
| Check-in success rate | Check-in berhasil / total percobaan | ≥ 97% |
| Median waktu check-in | Dari tap hingga konfirmasi | < 8 detik |
| Fake GPS block rate | Insiden tertolak / total check-in | Dipantau; ambang peringatan > 2% |
| False positive rate | Banding yang disetujui / penolakan Fake GPS | < 1% |
| Late rate | Check-in terlambat / total check-in | Dilaporkan, tanpa target tetap |
| Admin task time | Waktu rekap bulanan | Turun ≥ 80% |
| Adoption | Pengguna aktif mingguan / terdaftar | ≥ 85% |
| NPS karyawan dan admin | Survei kuartalan | ≥ 40 |

---

## 8. Release Plan, Risiko, dan Pertanyaan Terbuka

### 8.1 Fase Rilis

| Fase | Cakupan | Kriteria Keluar |
| --- | --- | --- |
| **Alpha (internal)** | Auth, check-in/out, geofence, dashboard dasar | Uji internal lolos, NFR-P1 terpenuhi |
| **Beta (pilot 1-2 tenant)** | Seluruh Modul 1; Modul 2 kecuali pelaporan lanjutan; Fake GPS mode *shadow* (hanya flag) | False positive < 1%, DPIA selesai, uji beban lulus |
| **GA v1.0** | Seluruh fitur dokumen ini; penegakan Fake GPS aktif | Audit keamanan dan aksesibilitas lulus, SLO terpenuhi 4 minggu |
| **v1.5 (usulan)** | Wrapper native (`isMock`, Play Integrity/App Attest), poligon geofence, integrasi payroll | Ditentukan setelah data pilot |

### 8.2 Risiko Utama & Mitigasi

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Deteksi Fake GPS pada PWA tidak konklusif | Kecurangan lolos / false positive | Skor berlapis, mode shadow, jalur banding, roadmap native v1.5 |
| Pelacakan latar belakang tidak andal pada iOS/Android browser | Peta live kurang akurat | Definisi real-time yang jujur, penanda usia data, edukasi pengguna |
| Penolakan karyawan terhadap pelacakan | Adopsi rendah, risiko hukum | Transparansi, consent, pelacakan hanya pada jam kerja, pusat privasi |
| Lonjakan beban jam puncak | Check-in gagal | Antrean, auto-scaling, uji beban, jitter notifikasi |
| Kuota/biaya API peta | Biaya membengkak, peta gagal | Pembatasan domain, cache tile, fallback daftar, pemantauan kuota |
| Akurasi GPS di dalam gedung | Penolakan keliru | Ambang akurasi accuracy-aware, panduan pengguna, mode borderline |

### 8.3 Pertanyaan Terbuka untuk Keputusan Pemangku Kepentingan

1. Apakah tenant target membutuhkan **antrean check-in offline** pada v1.0, atau cukup menolak saat offline?
2. Pada *borderline*, apakah kebijakan bawaan **menerima dengan flag** atau **menolak**?
3. Apakah **aplikasi native/wrapper** perlu dimajukan ke v1.0 untuk tenant dengan kebutuhan anti-spoofing tinggi?
4. Wilayah regulasi mana yang menjadi prioritas peluncuran, dan siapa DPO yang menyetujui DPIA?
5. Periode retensi default data lokasi presisi: 90 hari atau lebih pendek?

---

## 9. Lampiran: Glosarium

| Istilah | Definisi |
| --- | --- |
| Geofence | Batas virtual berbentuk radius/poligon di sekitar lokasi kerja |
| Mock Location / Fake GPS | Pemalsuan koordinat perangkat menggunakan aplikasi atau pengaturan pengembang |
| PWA | Progressive Web App; aplikasi web yang dapat dipasang dengan dukungan service worker |
| Idempotency Key | Kunci unik yang menjamin permintaan yang diulang tidak membuat data ganda |
| DSAR | Data Subject Access Request; permintaan subjek data atas haknya |
| DPIA | Data Protection Impact Assessment; asesmen dampak pelindungan data |
| RBAC | Role-Based Access Control; kontrol akses berbasis peran |
| RPO / RTO | Recovery Point / Recovery Time Objective |

---

*Akhir dokumen. Versi 1.0, draft untuk review lintas fungsi.*
