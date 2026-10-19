# PRD-admin.md: Dashboard Admin Desktop GeoAttend

**Spesifikasi kebutuhan produk untuk aplikasi desktop admin (Electron + React).**

| Atribut | Detail |
|---|---|
| Dokumen | PRD-ADMIN-001 |
| Versi | 1.0 (draft untuk review lintas fungsi) |
| Produk | GeoAttend Enterprise, Admin Desktop v1.0 |
| Stack | Electron, React (Vite), JavaScript, REST (axios), Socket.io (socket.io-client) |
| Dokumen terkait | `AGENTS.md` (aturan kode), `auth.md` (autentikasi), `security.md` (keamanan), `DESIGN.md` (UI), `docs/API.md` (kontrak data), `PRD-mobile.md` (aplikasi pegawai) |
| Status | Draft untuk persetujuan |

Kata kunci prioritas: **M** = Must (wajib v1.0), **S** = Should, **C** = Could. Bagian bertanda `[ISI]` atau **[KONFIRMASI]** menunggu keputusan pemangku kepentingan.

---

## 1. Ringkasan Eksekutif

### 1.1 Visi

> Memberi HR dan Operasional satu layar kendali untuk melihat siapa yang hadir, siapa yang terlambat, dan di mana tim lapangan berada saat ini, dengan data yang akurat, real-time, dan dapat diaudit.

### 1.2 Masalah dan tujuan

| Masalah | Tujuan produk | Ukuran keberhasilan (6 bulan) |
|---|---|---|
| Rekap kehadiran manual lambat | Rekap otomatis dan laporan siap pakai | Waktu rekap bulanan turun \u2265 80% |
| Sulit melihat posisi dan status tim lapangan | Peta live dengan status online dan pelanggaran perimeter | \u2265 90% pegawai aktif tampil di peta pada jam kerja |
| Kecurangan lokasi lolos tanpa terdeteksi | Alert fraud real-time dan tinjauan terpusat | Waktu dari alert sampai tinjauan \u2264 15 menit (median) |
| Koreksi kehadiran tidak terlacak | Alur koreksi dan persetujuan dengan jejak audit | 100% koreksi memiliki alasan dan penyetuju |
| Data lokasi rawan disalahgunakan | Akses berbasis peran dan pencatatan akses | 100% akses lokasi individual tercatat |

### 1.3 Pengguna

| Persona | Peran sistem | Kebutuhan utama |
|---|---|---|
| **HR Admin / Operational Admin** | `hr_admin` | Memantau real-time, memproses koreksi, membuat laporan, mengatur shift dan geofence |
| **Super Admin / HR Director** | `super_admin` | Semua kemampuan HR Admin + audit log, peran, kebijakan privasi |
| **Department Manager** | `manager` | Melihat dan menyetujui untuk departemennya saja |
| **Executive** | `executive` | Ringkasan KPI dan laporan agregat, tanpa data lokasi individual |

Matriks hak akses lengkap ada di `auth.md` Bagian 2.1. RBAC ditegakkan di server; UI hanya menyesuaikan tampilan.

### 1.4 Ruang lingkup v1.0

**Dalam lingkup:** autentikasi admin, dashboard KPI, live monitoring (peta), manajemen karyawan, manajemen dan persetujuan kehadiran, pelaporan dan ekspor, pengaturan sistem (geofence, shift, notifikasi), audit log, broadcast pengumuman, notifikasi desktop untuk alert.

**Di luar lingkup v1.0:** aplikasi mobile pegawai (lihat `PRD-mobile.md`), integrasi payroll, manajemen cuti dan lembur penuh, pengenalan wajah atau foto selfie, integrasi RFID/beacon, pelacakan latar belakang kontinu, mode gelap, aplikasi web (browser) terpisah.

### 1.5 Asumsi dan batasan

1. Waktu resmi presensi adalah **timestamp server**; admin tidak pernah menilai keterlambatan memakai jam komputernya.
2. Posisi pegawai bersumber dari aplikasi mobile saat sesi presensi aktif; "real-time" berarti pembaruan saat aplikasi mobile aktif, ditambah posisi terakhir dengan penanda usia data.
3. Sistem tidak memakai foto selfie; verifikasi pegawai memakai GPS + biometrik lokal perangkat + sinyal integritas.
4. Aplikasi desktop adalah klien tipis: seluruh keputusan bisnis dan keamanan diambil server.
5. Platform minimum: Windows 10+ dan macOS 12+; Linux **[KONFIRMASI]**.

---

## 2. Platform dan Arsitektur

### 2.1 Platform desktop

| Aspek | Spesifikasi |
|---|---|
| OS | Windows 10/11 (x64), macOS 12+ (Apple Silicon dan Intel); Linux (AppImage/deb) bila disetujui |
| Layar | Target 1920x1080; minimum fungsional 1366x768; jendela dapat diubah ukuran, tanpa tata letak mobile |
| Instalasi | Installer bertanda tangan; auto-update dari sumber HTTPS terverifikasi |
| Instans | Satu instans aplikasi (instance lock) |
| Bahasa UI | Bahasa Indonesia (default); kerangka i18n siap untuk Inggris |
| Zona waktu | Ditampilkan sesuai zona waktu lokasi kantor (WIB sebagai default) |

### 2.2 Arsitektur logis

| Lapisan | Peran |
|---|---|
| Renderer (React) | UI, state, panggilan REST, koneksi Socket.io |
| Preload (`contextBridge`) | Jembatan sempit renderer ke main (token, ekspor berkas, tautan eksternal, versi aplikasi, status update) |
| Main (Electron) | Jendela, `safeStorage`, dialog simpan berkas, notifikasi desktop, auto-update |
| Backend | REST API + Socket.io; penentu keputusan bisnis, RBAC, audit |

Aturan keamanan Electron: `security.md`. Konvensi kode dan struktur proyek: `AGENTS.md`.

### 2.3 Integrasi

| Integrasi | Kebutuhan |
|---|---|
| REST API | Semua data master, kehadiran, laporan, pengaturan |
| Socket.io | Status online, posisi live, alert kehadiran (Bagian 4.3) |
| Peta | SDK peta yang dibundel (mis. Mapbox GL/MapLibre) atau Google Maps; tile dari domain yang diizinkan CSP `[ISI]` |
| Notifikasi desktop | Notifikasi sistem untuk alert prioritas tinggi (dikirim dari main process) |
| Auto-update | Pembaruan bertanda tangan dengan versi minimum yang dipaksakan server |

---

## 3. Sistem Desain (ringkas)

Acuan penuh: `DESIGN.md`.

- Shell: sidebar navy tetap 256px, topbar 64px, kanvas `background`, kartu putih radius 12px tanpa border.
- Warna brand: primary `#3A4EFB`, secondary `#33A4FA`, lime `#E3FF3B` (**hanya di atas navy atau sebagai titik live**), navy `#252943`/`inverse-surface`, netral `#DEE0ED`.
- Font: Plus Jakarta Sans (judul, angka KPI) + Inter (isi); angka tabular untuk jam dan koordinat.
- Status = warna + ikon/titik + teks. Satu tombol primer per area.
- Navigasi sidebar: **Dashboard, Live Monitoring, Employees, Attendance, Location, Reports, Settings** (label UI dalam Bahasa Indonesia; kunci rute tetap Inggris).

### 3.1 Cakupan desain yang sudah ada dan yang belum

| Layar | Status desain |
|---|---|
| Dashboard | Ada |
| Live Monitoring | Ada |
| Employees (direktori) | Ada |
| Attendance (audit dan timesheet) | Ada |
| Login dan MFA | **Belum** |
| Form tambah/ubah karyawan, detail karyawan | **Belum** |
| Antrean persetujuan dan formulir koreksi | **Belum** |
| Reports | **Belum** |
| Settings (geofence, shift, notifikasi, kebijakan privasi) | **Belum** |
| Audit log | **Belum** |
| Halaman Location (menu sidebar) | **Belum**; cakupan perlu ditetapkan |
| Modal, empty/loading/error state, layar kunci sesi | **Belum** |

---

## 4. Spesifikasi Fitur

Format tiap fitur: **User story**, **Requirements** (ID, prioritas), **Acceptance Criteria** (Given/When/Then), **Edge case dan penanganan galat**.

### 4.1 Autentikasi dan Sesi

**User story:** *Sebagai* admin, *saya ingin* masuk dengan aman dan tetap login selama bekerja, *sehingga* saya dapat memantau tanpa terputus dan data pegawai terlindungi.

Rincian protokol ada di `auth.md`.

| ID | Requirement | P |
|---|---|:---:|
| A1 | Login dengan email/Employee ID dan kata sandi; tampilkan/sembunyikan sandi; validasi inline | M |
| A2 | **MFA (TOTP)** wajib untuk `hr_admin` dan `super_admin` | M |
| A3 | Opsi "Ingat saya": refresh token tersimpan terenkripsi (`safeStorage`); tanpa opsi, sesi berakhir saat aplikasi ditutup | M |
| A4 | Restore sesi saat aplikasi dibuka tanpa memunculkan layar login yang berkedip (layar splash) | M |
| A5 | Refresh token otomatis dan transparan; satu refresh untuk banyak permintaan paralel | M |
| A6 | Kunci sesi setelah **30 menit idle**; buka lewat login ulang | M |
| A7 | Logout membersihkan memori, berkas token, cache, dan memutus Socket.io | M |
| A8 | Lupa/reset kata sandi dengan respons generik | M |
| A9 | Ganti kata sandi (mencabut sesi lain) | S |
| A10 | SSO (SAML/OIDC) | C |

**Acceptance Criteria**

- *Given* kredensial valid, *when* admin masuk, *then* Dashboard tampil \u2264 2 detik setelah respons dan koneksi Socket.io terbentuk.
- *Given* access token kedaluwarsa, *when* ada request, *then* sesi diperbarui otomatis tanpa pengguna menyadarinya dan isian form tidak hilang.
- *Given* refresh gagal atau sesi dicabut, *when* terdeteksi, *then* pengguna diarahkan ke login dengan pesan sesi berakhir.
- *Given* 5 kegagalan login, *then* akun terkunci 15 menit dan hitung mundur tampil.

**Edge case:** akun dinonaktifkan (pesan tetap tanpa coba lagi); tanpa koneksi saat login (isian dipertahankan, tombol coba lagi); `safeStorage` tidak tersedia (login tetap bisa tanpa Ingat saya, dengan peringatan); `403` tidak memicu logout.

### 4.2 Dashboard (Workforce Overview)

**User story:** *Sebagai* HR Admin, *saya ingin* melihat kondisi kehadiran hari ini dalam satu layar, *sehingga* saya dapat bertindak atas anomali segera.

| ID | Requirement | P |
|---|---|:---:|
| D1 | Header: sapaan, tanggal, shift aktif, chip filter (departemen/lokasi/shift), tombol **Ekspor Log Harian** dan **Broadcast Alert** | M |
| D2 | **5 kartu KPI**: **Total Employees, Present Today, Late Today, Absent Today, Currently Working** dengan angka, persentase, dan delta dibanding kemarin; klik kartu membuka daftar terfilter | M |
| D3 | Definisi KPI konsisten dengan Bagian 5.1 | M |
| D4 | **Live Employee Monitoring** versi ringkas: peta dengan geofence, legenda (Inside / Outside / Breach), dan daftar **Active Employees** (pencarian, tab All/Inside/Outside, kartu sorotan pegawai terpilih dengan aksi Detail dan Fokus) | M |
| D5 | **Weekly Attendance Dynamics:** batang tepat waktu vs terlambat, pilihan Day/Week/Month | M |
| D6 | **Status Breakdown:** donat distribusi status hari ini dengan persentase di tengah | M |
| D7 | **Department Coverage:** progres kepatuhan kehadiran per departemen | S |
| D8 | **Recent Attendance Stream:** tabel aktivitas terbaru (live), kolom: karyawan, departemen, tanggal dan shift, check-in, check-out, durasi, status, verifikasi GPS; tautan "Lihat semua" | M |
| D9 | Pembaruan live tanpa muat ulang: KPI dan feed berubah \u2264 5 detik setelah event | M |
| D10 | Penanda status sistem di topbar: **System Online** dan **Realtime Connected (usia data)** | M |

**Acceptance Criteria**

- *Given* seorang pegawai check-in, *when* event diterima, *then* kartu Present, Currently Working, dan feed diperbarui \u2264 5 detik.
- *Given* koneksi real-time terputus > 10 detik, *then* banner "Data live terjeda, mencoba menyambung kembali" tampil dan data ditandai usang.
- *Given* peran `executive`, *then* tidak ada peta atau data lokasi individual yang ditampilkan.

**Edge case:** tenant baru tanpa data (empty state dengan CTA tambah karyawan); satu widget gagal (galat lokal, halaman tetap berfungsi); hari libur (Absent tidak dihitung); lonjakan event jam puncak (batching 250 ms); beda zona waktu antar cabang.

### 4.3 Live Monitoring dan Peta

**User story:** *Sebagai* Operational Admin, *saya ingin* melihat posisi dan status pegawai di peta, *sehingga* saya dapat merespons pelanggaran perimeter dan mengatur tim lapangan.

#### 4.3.1 Peristiwa real-time (Socket.io)

| Event | Arah | Dipakai untuk |
|---|---|---|
| `employee_login` | server \u2192 admin | Pegawai online |
| `employee_logout` | server \u2192 admin | Pegawai offline |
| `update_employee_location` | server \u2192 admin | Posisi di peta, jarak, status perimeter |
| `new_attendance_alert` | server \u2192 admin | Alert (check-in/out, di luar radius, indikasi fraud) |
| `send_location` | mobile \u2192 server | **Bukan** untuk admin; admin tidak memancarkannya |

Payload mengikuti `docs/API.md`; kebutuhan data minimum yang harus tersedia di payload: ID pegawai, koordinat dan akurasi, timestamp server, status perimeter (in/out), jarak ke kantor, dan penanda sesi kerja.

#### 4.3.2 Requirements

| ID | Requirement | P |
|---|---|:---:|
| L1 | **Sub-header kontrol:** breadcrumb, indikator koneksi, status geofence aktif (mis. "Strict 250m"), tombol audio alert, tombol Refresh Feed | M |
| L2 | **Daftar Active Trackers** (kiri): pencarian nama/ID/peran, chip **All / Inside / Outside / Flagged** dengan jumlah, filter departemen, kartu pegawai (avatar, nama, ID, jarak, jam check-in, chip status) | M |
| L3 | **Peta** (tengah): marker pegawai, lingkaran geofence, marker kantor, klaster pada zoom rendah, kontrol zoom/pusatkan, legenda hitungan, strip metrik (kapasitas HQ, GPS drift, last sync) | M |
| L4 | **Status marker:** *Aktif/Inside* (primary), *Outside* (peringatan), *Flagged/Breach* (merah + ikon), *Offline* (abu, outline); warna selalu dengan ikon/bentuk | M |
| L5 | **Panel Telemetry Detail** (kanan): klik marker atau kartu membuka detail: foto/inisial, nama, peran, status kehadiran, jam check-in, kepatuhan geofence dan jarak, koordinat dan akurasi, **timestamp lokasi terakhir**, jaringan dan baterai bila tersedia, **Activity Trail** hari ini | M |
| L6 | **Status online:** online bila ada `employee_login` atau pembaruan lokasi terkini; offline bila `employee_logout` **atau** tanpa pembaruan > 10 menit; tampilkan "terakhir X menit lalu" | M |
| L7 | Posisi lebih dari 5 menit ditandai **"Terakhir diketahui"** agar tidak dianggap real-time | M |
| L8 | Hanya pegawai **dalam sesi kerja** dan telah **memberi persetujuan** yang tampil sebagai marker; lainnya "Lokasi tidak dibagikan" di daftar | M |
| L9 | Update posisi di peta **< 5 detik** dari penerimaan data; pembaruan di-batch dan marker diperbarui diferensial | M |
| L10 | **Alert pelanggaran:** `new_attendance_alert` memunculkan baris di daftar dan panel alert, penanda di topbar, toast, dan (opsional) audio dan notifikasi desktop | M |
| L11 | **Pencatatan akses:** setiap pembukaan detail lokasi individual dicatat di audit log server | M |
| L12 | Tampilan **daftar** sebagai padanan aksesibel peta (sinkron dengan filter) | M |
| L13 | Layer peta: Standard / Satellite / Dark Grid; Heatmap | C |
| L14 | Tombol **Fokus** memusatkan peta ke pegawai; **Lihat Rute Historis** (retensi dan izin: **[KONFIRMASI]**) | C |
| L15 | **Ping Device Location** (meminta lokasi dari perangkat) | **Tidak v1.0**; bertentangan dengan prinsip lokasi hanya saat sesi presensi; butuh persetujuan privasi/DPO |

**Acceptance Criteria**

- *Given* 500 marker aktif, *when* peta dimuat, *then* render awal < 3 detik, interaksi \u2265 30 fps.
- *Given* `update_employee_location` datang berurutan tidak teratur, *then* hanya data yang lebih baru (timestamp server) yang diterapkan.
- *Given* tidak ada pembaruan dari seorang pegawai > 10 menit, *then* statusnya menjadi Offline dengan usia data tampil.
- *Given* peran `manager`, *then* hanya pegawai departemennya yang tampil.
- *Given* admin membuka detail lokasi, *then* entri audit tercatat dan panel terbuka < 500 ms.

**Edge case:** peta gagal dimuat atau kuota habis (fallback tampilan daftar dengan koordinat); marker bertumpuk (klaster dan spiderfy); akurasi buruk (lingkaran akurasi di marker); reconnect (snapshot via REST, lalu gabung dengan event baru); pesan tidak valid (koordinat di luar rentang dibuang dan dicatat tanpa isi); banjir pesan (throttling render).

### 4.4 Manajemen Karyawan

**User story:** *Sebagai* HR Admin, *saya ingin* mengelola data dan akun karyawan, *sehingga* data induk akurat dan akses sesuai status kerja.

| ID | Requirement | P |
|---|---|:---:|
| E1 | **Direktori:** tabel dengan kolom nama + email, ID karyawan, departemen + jabatan, geofence ditugaskan, kehadiran hari ini, status lokasi live, last ping, aksi | M |
| E2 | **Kartu ringkasan:** Total Headcount, Geofenced Personnel, Remote/Field Fleet, Device Fleet Health | S |
| E3 | **Pencarian dan filter:** nama/ID/email, departemen, status, zona geofence, reset filter | M |
| E4 | **CRUD** karyawan: ID unik, nama, email, telepon, departemen, jabatan, atasan, shift, lokasi kerja, tanggal bergabung, foto profil | M |
| E5 | **Status toggle** Aktif/Nonaktif dengan konfirmasi; nonaktif memutus sesi (\u2264 60 detik) dan menghapus pegawai dari peta dan metrik "Currently Working"; riwayat tetap tersimpan (*soft delete*) | M |
| E6 | **Penempatan departemen** (satuan dan massal) dengan tanggal efektif | M |
| E7 | **Aktivasi akun:** undangan email (berlaku 72 jam), kirim ulang, status Invited/Active/Inactive | M |
| E8 | **Aksi massal:** pilih beberapa baris, bar aksi (Assign Geofence, Export Selected, Deactivate) dengan jumlah terpilih | M |
| E9 | **Impor CSV/Excel** dengan templat, pratinjau validasi per baris, laporan galat yang dapat diunduh; **Ekspor roster** | S |
| E10 | **Reset kata sandi/perangkat terdaftar** oleh admin (tautan reset; pelepasan *device binding* pegawai dengan alasan tercatat) | M |
| E11 | Paginasi sisi server (10/25/50/100 per halaman) | M |
| E12 | Detail karyawan: profil, riwayat kehadiran ringkas, perangkat terdaftar, riwayat penempatan | S |
| E13 | Kolom "RFID/telemetry token" pada desain | **Tidak v1.0** (RFID di luar lingkup) **[KONFIRMASI]** |

**Acceptance Criteria**

- *Given* admin menonaktifkan pegawai, *then* sesinya berakhir \u2264 60 detik dan ia hilang dari peta dan KPI.
- *Given* impor 200 baris dengan 3 baris tidak valid, *then* 197 berhasil dan laporan galat memuat nomor baris dan alasan.
- *Given* peran `manager`, *then* aksi tulis tidak tersedia dan daftar dibatasi ke departemennya.

**Edge case:** ID/email duplikat (pesan spesifik dan tautan ke rekaman); menonaktifkan pegawai yang sedang check-in (peringatan dan opsi *force check-out* dengan catatan); departemen dengan anggota tidak dapat dihapus; undangan kedaluwarsa; aksi massal sebagian gagal (laporan per baris).

### 4.5 Manajemen Kehadiran dan Persetujuan

**User story:** *Sebagai* HR Admin, *saya ingin* merekap kehadiran dan memproses koreksi dengan jejak audit, *sehingga* data siap payroll dan sengketa dapat diselesaikan adil.

| ID | Requirement | P |
|---|---|:---:|
| T1 | **Kartu KPI:** Today's Attendance (persentase, hadir/terjadwal, pending), Punctuality Score, Avg Check-in Time, Work Hours Logged | M |
| T2 | **Filter:** rentang tanggal (Today/Yesterday/This Week/This Month/kustom), departemen, status, metode verifikasi; ringkasan hitungan Present/Late/Absent/Leave; Reset Filters; Advanced Query | M |
| T3 | **Verified Punch Audit Log:** tabel dengan kolom karyawan + ID, departemen, shift dan jadwal, check-in, check-out, durasi, status, lokasi dan jarak dari inti geofence, verifikasi | M |
| T4 | **Status kehadiran:** Present, Late (+menit), In Progress, Completed Early, Absent, Approved Leave, **Breach Flagged / Perlu Tinjauan**, Adjusted, Pending Approval | M |
| T5 | **Verifikasi (sesuai produk):** GPS Geofence Match, Remote GPS Verified, Manual Override, Biometrik Perangkat Lolos; tampilkan alasan flag (reason codes) tanpa membuka detail teknis ke pengguna akhir | M |
| T6 | **Tinjau flag risiko:** lihat bukti peta, skor dan alasan, pilih *Validasi*, *Tolak*, atau *Minta klarifikasi* | M |
| T7 | **Koreksi manual:** pengajuan oleh pegawai atau inisiasi admin; alasan wajib; lampiran opsional; nilai asli dipertahankan dan status *Adjusted* | M |
| T8 | **Antrean persetujuan** dengan SLA (default 2 hari kerja), pengingat, persetujuan massal untuk jenis yang sama | M |
| T9 | **Four-eyes:** admin tidak dapat menyetujui koreksi yang ia ajukan sendiri (konfigurasi) | S |
| T10 | **Kunci periode:** periode yang ditutup untuk payroll tidak dapat diubah tanpa dibuka oleh `super_admin` (tercatat) | S |
| T11 | **Riwayat perubahan** per catatan: siapa, kapan, nilai sebelum dan sesudah, alasan | M |
| T12 | Baris bermasalah diberi penanda visual; baris cuti dan tidak aktif redup; paginasi sisi server dan ringkasan "Showing x-y of N" | M |
| T13 | **Ekspor Logs** (CSV/Excel/PDF) lewat dialog simpan | M |
| T14 | Tampilan "Facial Match %", "Photo Skipped", dan "RFID Turnstile" pada desain | **Tidak v1.0**; produk tanpa foto selfie dan tanpa RFID; ganti dengan metode verifikasi pada T5 **[KONFIRMASI]** |

**Acceptance Criteria**

- *Given* koreksi disetujui, *then* nilai asli tetap tersimpan, status menjadi Adjusted, rekap dan laporan diperbarui, pegawai menerima notifikasi.
- *Given* periode terkunci, *when* admin mencoba mengoreksi, *then* aksi ditolak dengan penjelasan.
- *Given* dua admin menyetujui koreksi yang sama bersamaan, *then* salah satu menerima pesan konflik (*optimistic locking*) tanpa duplikasi.

**Edge case:** koreksi untuk waktu di masa depan ditolak; pegawai nonaktif tetap dapat dikoreksi untuk periode historis dengan peringatan; atasan tidak ada (rute ke HR); hasil filter kosong (empty state dan tombol reset).

### 4.6 Pelaporan

**User story:** *Sebagai* HR Admin atau Executive, *saya ingin* laporan akurat yang bisa diekspor, *sehingga* saya dapat melapor ke manajemen dan memproses payroll tanpa pengolahan manual.

| ID | Requirement | P |
|---|---|:---:|
| R1 | Laporan **Harian, Mingguan, Bulanan** per karyawan, departemen, dan lokasi: hari kerja, hadir, terlambat, absen, total jam, rata-rata jam masuk | M |
| R2 | **Statistik keterlambatan:** frekuensi dan total menit, peringkat departemen, tren, pegawai dengan pola berulang (ambang dapat diatur) | M |
| R3 | **Ekspor PDF** (ringkasan eksekutif dengan logo, periode, filter) dan **CSV/Excel** (data mentah, UTF-8 BOM, tanggal ISO 8601) | M |
| R4 | Laporan besar dibuat **asinkron**: indikator progres, notifikasi selesai, berkas disimpan lewat dialog simpan | M |
| R5 | Laporan terjadwal via email ke daftar penerima | S |
| R6 | Pembatasan ekspor berdasarkan peran; ekspor yang memuat koordinat hanya `super_admin` (atau izin khusus) dengan alasan tercatat; semua ekspor masuk audit | M |
| R7 | **Netralisasi formula** pada CSV/Excel (sel diawali `=`, `+`, `-`, `@`) | M |

**Acceptance Criteria**

- *Given* laporan bulanan 5.000 pegawai, *then* ekspor selesai \u2264 60 detik dan berkas dapat dibuka di Excel dan Google Sheets.
- *Given* hasil filter kosong, *then* sistem menampilkan "Tidak ada data untuk periode ini" dan tidak membuat berkas kosong.

**Edge case:** ekspor melebihi batas baris (dipecah atau diarahkan ke laporan terjadwal); gagal membuat laporan (notifikasi dan opsi ulang); data berubah saat ekspor (snapshot pada waktu mulai); batal menyimpan di dialog (operasi dibatalkan tanpa galat).

### 4.7 Pengaturan Sistem

**User story:** *Sebagai* Super Admin, *saya ingin* mengonfigurasi aturan lokasi, jam kerja, dan notifikasi tanpa bantuan engineering, *sehingga* kebijakan perusahaan dapat diterapkan cepat dan terkontrol.

#### 4.7.1 Geofence dan lokasi kantor

| ID | Requirement | P |
|---|---|:---:|
| S1 | Daftar lokasi kantor: nama, alamat, **latitude, longitude, radius (m)**, zona waktu, status; mendukung banyak lokasi | M |
| S2 | Penetapan titik lewat peta (geser pin), pencarian alamat, atau input koordinat; validasi rentang | M |
| S3 | Radius lewat slider dan angka (20-1.000 m, default 100 m); pratinjau lingkaran langsung di peta | M |
| S4 | Penugasan lokasi ke karyawan/departemen; satu pegawai dapat memiliki lebih dari satu lokasi | M |
| S5 | Ambang akurasi GPS dan kebijakan *borderline*; ambang skor risiko Fake GPS | M |
| S6 | Peringatan bila radius < 30 m ("dapat menyebabkan penolakan yang keliru") | S |
| S7 | Poligon geofence kustom | C (v1.5) |

#### 4.7.2 Shift dan jam kerja

| ID | Requirement | P |
|---|---|:---:|
| S8 | Definisi shift: nama, jam masuk, jam pulang, hari kerja, shift lewat tengah malam, istirahat | M |
| S9 | **Toleransi keterlambatan** (menit; default 10; rentang 0-120) per shift | M |
| S10 | Kalender libur (nasional dan perusahaan) | M |
| S11 | Perubahan berlaku **sejak tanggal efektif**, tidak mengubah data historis; pratinjau dampak (jumlah pegawai terpengaruh) sebelum disimpan | M |

#### 4.7.3 Notifikasi, broadcast, privasi, dan audit

| ID | Requirement | P |
|---|---|:---:|
| S12 | Aturan notifikasi: waktu pengingat check-in/out, notifikasi keterlambatan, eskalasi ke atasan, alert fraud ke admin; kanal (push, in-app, email) | M |
| S13 | **Broadcast Alert/Pengumuman** ke pegawai (prioritas normal/penting), dengan pratinjau dan riwayat; **Zone Roll Call** (broadcast darurat ke pegawai aktif) | S |
| S14 | Templat pesan dengan variabel dan uji kirim | S |
| S15 | **Kebijakan privasi tenant:** teks consent dan versi, periode retensi koordinat, jam pelacakan yang diizinkan | M |
| S16 | **Audit Log** imutabel: login, perubahan konfigurasi, CRUD karyawan, koreksi, akses lokasi, ekspor, perubahan peran; filter, pencarian, ekspor; retensi \u2265 12 bulan | M |
| S17 | Manajemen peran dan hak akses pengguna admin | M |

**Acceptance Criteria**

- *Given* radius diubah dari 100 m ke 200 m, *then* check-in berikutnya memakai radius baru, audit mencatat nilai lama dan baru, data historis tidak berubah.
- *Given* koordinat di luar rentang, *then* Simpan ditolak dengan pesan inline pada kolom terkait.

**Edge case:** dua admin mengubah konfigurasi bersamaan (deteksi konflik versi); perubahan jam kerja saat shift berjalan (berlaku shift berikutnya); lokasi yang masih ditugaskan tidak dapat dihapus (daftar ketergantungan).

### 4.8 Notifikasi Desktop dan Pusat Alert

| ID | Requirement | P |
|---|---|:---:|
| N1 | Pusat alert dalam aplikasi: daftar kronologis `new_attendance_alert` dengan jenis, pegawai, waktu, dan aksi cepat (Buka detail, Tandai ditangani) | M |
| N2 | Penanda belum dibaca di topbar dan sidebar | M |
| N3 | Notifikasi sistem (desktop) untuk alert prioritas tinggi (mis. indikasi fraud, pelanggaran perimeter) dengan opsi dimatikan | S |
| N4 | Audio alert dengan toggle (tersimpan per pengguna) | S |
| N5 | Deduplikasi alert berdasarkan ID; alert tidak hilang saat berpindah halaman | M |

### 4.9 Pencarian Global dan Pintasan

| ID | Requirement | P |
|---|---|:---:|
| G1 | Pencarian topbar (pegawai/departemen) dengan pintasan `Ctrl/Cmd + K` | S |
| G2 | Pintasan keyboard untuk navigasi utama dan fokus pencarian | C |
| G3 | Status koneksi dan usia data selalu terlihat di topbar | M |

---

## 5. Aturan Bisnis dan Data

### 5.1 Definisi KPI

| KPI | Definisi |
|---|---|
| Total Employees | Jumlah karyawan berstatus aktif (dalam cakupan filter dan peran) |
| Present Today | Karyawan dengan check-in valid hari ini |
| Late Today | Check-in melewati jam masuk + toleransi |
| Absent Today | Terjadwal bekerja, tanpa check-in, melewati jam masuk + toleransi, bukan cuti/libur |
| Currently Working | Sudah check-in dan belum check-out |
| Punctuality Score | Persentase check-in tepat waktu dari total check-in periode |
| Avg Check-in Time | Rata-rata jam check-in; dibandingkan jam shift |

### 5.2 Status kehadiran dan warna

| Status | Tampilan |
|---|---|
| Present / Active | Chip navy, teks lime, titik berdenyut |
| In Progress | Chip netral, teks `secondary` |
| Late | Satu aturan warna di seluruh aplikasi: amber `#F59E0B` (usulan; desain saat ini tidak konsisten antara biru dan merah) **[KONFIRMASI]** |
| Absent / Breach Flagged | Merah (solid atau container) + ikon |
| Approved Leave / Offline | Netral abu |
| Completed Early / Remote / Field Verified | Biru informatif |

### 5.3 Aturan umum

1. Waktu resmi dan keputusan (jarak, terlambat, skor risiko) selalu dari server.
2. Peta hanya menampilkan pegawai dalam sesi kerja dengan persetujuan; flag diikuti dari server.
3. Data lokasi tidak ditulis ke disk di klien; dibuang saat logout.
4. Setiap akses lokasi individual, ekspor koordinat, dan perubahan konfigurasi dicatat di audit.

### 5.4 Kebutuhan data (entitas utama)

| Entitas | Atribut kunci |
|---|---|
| Employee | id, employee_id, nama, email, telepon, departemen, jabatan, atasan, shift, lokasi kerja, status, tanggal bergabung |
| AttendanceRecord | id, employee_id, tanggal, check_in, check_out, durasi, status, jarak, akurasi, metode verifikasi, skor risiko, reason codes, adjusted, catatan |
| LocationUpdate | employee_id, lat, lng, akurasi, timestamp server, status perimeter, jarak ke kantor |
| Alert | id, jenis, employee_id, severity, waktu, status ditangani |
| Office/Geofence | id, nama, lat, lng, radius, zona waktu, status |
| Shift | id, nama, jam masuk/pulang, hari kerja, toleransi |
| AuditEntry | id, waktu (UTC), aktor, aksi, objek, nilai sebelum/sesudah, IP |

Bentuk payload final ditetapkan di `docs/API.md`.

---

## 6. Matriks Keadaan UX dan Penanganan Galat

| # | Kondisi | Deteksi | Pesan (contoh) | Perilaku |
|---|---|---|---|---|
| 1 | Koneksi real-time terputus | `disconnect`/`connect_error` | "Data live terjeda. Menyambung kembali..." | Banner kuning; data live ditandai usang; reconnect backoff; setelah tersambung ambil snapshot REST |
| 2 | Tanpa koneksi internet | `navigator.onLine`, timeout API | "Tidak ada koneksi. Perubahan belum disimpan." | Banner; form dipertahankan; aksi tulis dinonaktifkan; data terakhir tampil dengan penanda usang |
| 3 | Sesi berakhir/dicabut | HTTP 401 | "Sesi Anda berakhir. Silakan masuk kembali." | Refresh senyap sekali; jika gagal, logout dan kembali ke halaman terakhir setelah login |
| 4 | Tidak punya akses | HTTP 403 | "Anda tidak memiliki akses ke fitur ini." | Halaman akses ditolak; tidak logout |
| 5 | Peta gagal dimuat/kuota habis | Galat SDK | "Peta tidak dapat dimuat. Menampilkan daftar." | Fallback daftar dengan koordinat; tombol coba lagi |
| 6 | Data kosong | Respons kosong | "Belum ada data untuk periode ini." | Empty state dengan CTA relevan |
| 7 | Konflik versi (edit bersamaan) | HTTP 409 | "Data diubah pengguna lain. Muat ulang untuk melihat versi terbaru." | Tawarkan muat ulang; jangan menimpa diam-diam |
| 8 | Rate limit | HTTP 429 | "Terlalu banyak permintaan. Coba lagi sebentar." | Hormati `Retry-After` |
| 9 | Galat server | HTTP 5xx | "Terjadi kesalahan. Kode: ERR-xxxx" | Tombol coba lagi dan kode referensi; log tanpa data sensitif |
| 10 | Pembaruan aplikasi wajib | Versi di bawah minimum | "Versi aplikasi perlu diperbarui." | Layar pembaruan; fitur diblokir sampai selesai |
| 11 | Ekspor gagal | Galat unduh/generasi | "Laporan gagal dibuat. Coba lagi." | Notifikasi dan opsi ulang; tidak ada berkas rusak |
| 12 | Payload real-time tidak valid | Validasi bentuk | (tidak ditampilkan) | Buang pesan, catat tanpa isi, lanjutkan |

Prinsip: pesan menjelaskan apa yang terjadi dan langkah berikutnya; tidak menampilkan stack trace; setiap galat menyertakan kode referensi; semua teks dalam Bahasa Indonesia melalui `src/i18n/`.

---

## 7. Persyaratan Non-Fungsional

### 7.1 Keamanan dan privasi

Detail: `security.md` dan `auth.md`. Ringkasan wajib:

- Electron: `contextIsolation`, `sandbox`, `nodeIntegration: false`; preload sempit; validasi setiap handler IPC; CSP ketat; Fuses dan penandatanganan kode.
- Access token hanya di memori; refresh token dengan `safeStorage`; tanpa data lokasi di disk.
- TLS 1.3; tanpa mematikan validasi sertifikat.
- MFA untuk admin; RBAC di server; audit untuk akses lokasi dan ekspor.
- Kepatuhan **UU PDP No. 27/2022** (serta GDPR/PDPA bila relevan); DPIA sebelum rilis; validasi Legal/DPO.

### 7.2 Kinerja

| ID | Metrik | Target |
|---|---|---|
| P1 | Cold start aplikasi sampai layar interaktif | < 3 detik (perangkat acuan) |
| P2 | Pembaruan posisi di peta dari penerimaan data | < 5 detik (p95) |
| P3 | Pembaruan KPI dan feed setelah event | \u2264 5 detik |
| P4 | Pemuatan halaman daftar (25 baris) | < 2 detik |
| P5 | Render awal peta 500 marker | < 3 detik; \u2265 30 fps |
| P6 | Pembuatan laporan 5.000 pegawai/bulan | \u2264 60 detik (asinkron) |
| P7 | Memori renderer dengan 500 marker aktif | < 600 MB |
| P8 | Proses idle (tanpa interaksi) | CPU rata-rata < 5% |

### 7.3 Skalabilitas dan keandalan

- Mendukung 500+ pegawai aktif pada peta dan lonjakan event jam puncak (08:00-09:00) tanpa UI membeku (batching, virtualisasi daftar, pembaruan marker diferensial).
- Ketahanan koneksi: reconnect otomatis dengan backoff dan jitter; rekonsiliasi snapshot setelah tersambung.
- Crash-free sessions \u2265 99,5%; versi minimum dipaksakan server.

### 7.4 Aksesibilitas (WCAG 2.1 AA)

- Kontras teks \u2265 4,5:1; larangan lime dan `secondary-container` sebagai teks kecil di atas putih.
- Seluruh fungsi dapat dioperasikan dengan keyboard; fokus terlihat; urutan fokus logis.
- Ikon-saja memiliki `aria-label`; peta memiliki padanan daftar; pembaruan live memakai `aria-live="polite"`.
- Status tidak bergantung warna; hormati `prefers-reduced-motion`.

### 7.5 Kompatibilitas dan pemeliharaan

- Windows 10/11 dan macOS 12+ (Linux bila disetujui); layar 1366x768 sampai 4K.
- Teks UI Bahasa Indonesia melalui i18n; komentar kode dan commit Bahasa Inggris.
- Unit test logika murni dan reducer live; E2E untuk alur kritis; lint dan test wajib lulus sebelum rilis.

---

## 8. Analitik dan Keberhasilan

| Metrik | Definisi | Target |
|---|---|---|
| Adopsi admin | Admin aktif mingguan / terdaftar | \u2265 90% |
| Waktu ke tinjauan alert | Alert diterima sampai ditandai ditangani (median) | \u2264 15 menit |
| Waktu rekap bulanan | Dari awal periode sampai laporan siap | Turun \u2265 80% |
| Keberhasilan real-time | Persentase waktu koneksi Socket.io terhubung pada jam kerja | \u2265 99% |
| Kelengkapan audit | Akses lokasi dan ekspor yang tercatat | 100% |
| Crash-free sessions | Sesi tanpa crash | \u2265 99,5% |
| Kepuasan | NPS admin (survei kuartalan) | \u2265 40 |

Analitik tidak boleh memuat koordinat presisi atau data pribadi.

---

## 9. Rencana Rilis

| Fase | Cakupan | Kriteria keluar |
|---|---|---|
| **Alpha (internal)** | Login (dengan MFA), Dashboard, Live Monitoring dasar, Employees (baca) | Alur real-time stabil; keamanan Electron lolos tinjauan |
| **Beta (1-2 tenant pilot)** | Seluruh fitur Bagian 4 kecuali laporan terjadwal dan impor massal; Fake GPS mode shadow | Waktu tinjauan alert \u2264 15 menit; crash-free \u2265 99%; DPIA selesai |
| **GA v1.0** | Seluruh fitur M dan S pada dokumen ini | Uji penetrasi lulus; audit aksesibilitas lulus; SLO terpenuhi 4 minggu |
| **v1.1 (usulan)** | Laporan terjadwal, heatmap, rute historis (jika disetujui), pintasan keyboard | Berdasarkan data pilot |
| **v1.5 (usulan)** | Poligon geofence, SSO, integrasi payroll | Ditentukan setelah GA |

---

## 10. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Realtime tidak andal (jaringan, server) | Data usang menyesatkan keputusan | Indikator koneksi dan usia data, rekonsiliasi snapshot, banner terputus |
| Penyalahgunaan data lokasi oleh pengguna internal | Pelanggaran privasi, risiko hukum | RBAC, cakupan departemen, audit akses, ekspor terbatas, peran `executive` tanpa lokasi individual |
| Kerentanan Electron/XSS | Pengambilalihan komputer admin | Hardening `security.md`, CSP, Fuses, review dependensi |
| Lonjakan event membuat UI membeku | Pengalaman buruk | Batching, virtualisasi, update marker diferensial |
| Desain tidak sejalan dengan produk (selfie, RFID, ping lokasi) | Fitur tidak dapat dibangun atau melanggar privasi | Tandai di Bagian 4 dan 12; revisi desain |
| Cakupan desain belum lengkap | Keterlambatan implementasi | Prioritaskan desain Login, Reports, Settings, Persetujuan sebelum Beta |
| Biaya/kuota API peta | Biaya membengkak atau peta gagal | Pembatasan domain, SDK dibundel, fallback daftar |
| Ketergantungan pada kontrak API yang belum final | Rework | `docs/API.md` sebagai sumber tunggal; versi API |

---

## 11. Pertanyaan Terbuka

1. Apakah **Linux** didukung pada v1.0?
2. Perlu **SSO** pada v1.0, atau cukup email/kata sandi + MFA?
3. Cakupan halaman **Location** di sidebar (peta penuh, daftar geofence, atau digabung dengan Live Monitoring)?
4. **Rute historis** dan **Ping Device Location**: diizinkan atau tidak (privasi/DPO)? Jika rute historis diizinkan, berapa retensinya?
5. Warna status **Late**: amber (usulan) atau mengikuti desain saat ini?
6. Metode verifikasi yang ditampilkan di tabel kehadiran: apakah hanya GPS + biometrik perangkat + flag integritas?
7. Apakah **RFID/beacon** akan masuk roadmap (kolom token RFID dan "RFID Turnstile" di desain)?
8. Batas idle sesi dan kebijakan login serentak di beberapa komputer?
9. Aplikasi desktop pegawai manajer: apakah `manager` juga memakai aplikasi ini, atau cukup `hr_admin`/`super_admin`/`executive`?
10. SDK peta final (Mapbox GL/MapLibre atau Google Maps) dan penyedia tile.

---

## 12. Selisih Desain dengan Produk

Temuan dari tinjauan desain (`DESIGN.md` dan tangkapan layar) terhadap keputusan produk:

| # | Elemen pada desain | Konflik | Rekomendasi |
|---|---|---|---|
| 1 | "Facial Match 99.4%", "Photo Skipped" pada tabel kehadiran | Produk **tanpa foto selfie**; verifikasi memakai biometrik lokal perangkat | Ganti dengan "Biometrik Perangkat Lolos" dan metode verifikasi pada T5 |
| 2 | Kolom "RFID Token", "RFID Turnstile Verified", "Beacon Handshake" | RFID/beacon di luar lingkup | Hapus dari v1.0 atau tandai fase berikutnya |
| 3 | Tombol **Ping Device Location** | Bertentangan dengan lokasi hanya saat sesi presensi | Hapus; butuh keputusan privasi |
| 4 | **Lihat Rute Historis** | Retensi dan privasi belum ditetapkan | Tunda hingga disetujui DPO |
| 5 | Warna status **Late** tidak konsisten (merah dan biru) | Aturan status tidak jelas | Satu aturan (usulan amber) |
| 6 | Topbar menampilkan "EST" dan tanggal tidak sinkron | Produk di Jakarta (WIB) | Tampilkan WIB dan tanggal server |
| 7 | "Polling: 5s" pada Live Monitoring | Pembaruan seharusnya push (Socket.io) | Tampilkan usia data dan status koneksi; polling hanya fallback |
| 8 | Geofence "Strict (250m)" | Default produk 100 m (20-1.000 m, dapat diatur) | Nilai pada desain dianggap contoh data |
| 9 | Peta Live Monitoring berupa ilustrasi | Perlu peta nyata | Implementasikan dengan SDK peta |
| 10 | Logo dari URL eksternal; brand "Vanguard FieldOps" | CSP melarang sumber eksternal; nama produk GeoAttend | Aset lokal; ganti brand |
| 11 | Font/ikon dari Google Fonts | CSP produksi melarang CDN | Bundel lokal |
