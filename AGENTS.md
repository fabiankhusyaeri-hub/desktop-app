# AGENTS.md: GeoAttend (Absensi Pegawai)

Panduan untuk agen coding (opencode) di repositori ini. Baca seluruhnya sebelum mengubah kode. Bagian bertanda `[ISI]` harus dilengkapi pemilik repo; jangan menebak nilainya.

## 1. Proyek

GeoAttend adalah sistem presensi berbasis lokasi dengan tiga bagian:

| Bagian | Teknologi | Folder |
|---|---|---|

Setiap pembuatan file baru atau refactoring WAJIB mengikuti struktur standar berikut:

absensi-main/
├── docs/                   # Folder khusus semua dokumentasi teknis
│   ├── API.md              # Kontrak REST API & Socket.io events
│   ├── AUTH.md             # Alur autentikasi, JWT, & Device Binding
│   ├── SECURITY.md         # Kebijakan anti-fraud, geofence, & Electron security
│   ├── PRD-admin.md        # Spesifikasi kebutuhan dashboard desktop
├── electron/               # Kode proses utama Electron (Main Process)
│   ├── main.ts             # Logika pembuatan window, tray, & IPC
│   └── preload.ts          # Bridge aman antara Electron & React
├── src/                    # Kode tampilan React (Renderer Process)
│   ├── assets/             # Gambar, ikon, & font lokal
│   ├── components/         # Komponen UI (Sidebar, Navbar, Card, Modal)
│   ├── pages/              # Layar/Halaman utama (Dashboard, History, Live Monitor)
│   ├── services/           # Logika API & listener Socket.io
│   ├── types/              # Definisi tipe TypeScript/JSDoc
│   └── App.tsx             # Entry point komponen React
├── AGENTS.md               # Panduan utama untuk AI & coding agent (di root)
├── DESIGN.md               # Sistem desain UI & token warna (di root)
└── README.md               # Panduan cara install & menjalankan proyek (di root)

- `docs/`: Tempat semua dokumentasi teknis (`API.md`, `AUTH.md`, `SECURITY.md`, `PRD-admin.md`).
- `electron/`: Proses utama Electron (`main.ts`, `preload.ts`).
- `src/components/`: Komponen UI modular (Sidebar, Navbar, Modal).
- `src/pages/`: Layar tampilan utama (Dashboard, Live Monitoring, Logs).
- `src/services/`: Logika integrasi REST API (`axios`) dan listener Socket.io.
- `src/types/`: Definisi tipe data/interfaces.

Dilarang membuat file dokumentasi `.md` baru di dalam folder `electron/` atau `src/`. Semua dokumentasi harus berada di dalam folder `docs/`.
| Dashboard admin desktop | JavaScript, Electron | `[ISI: mis. apps/admin]` |
| Backend API | `[ISI: Java Script/ Electron]`, REST + WebSocket (Socket.io) | `[ISI: mis. apps/api]` |

Database: `[supabase]`. Tabel inti: `users`, `attendances`.

Dokumen acuan (baca bila relevan dengan tugas):
- `docs/PRD-mobile.md`, `docs/PRD-admin.md`: kebutuhan fungsional dan kriteria penerimaan
- `DESIGN.md`: sistem desain UI (wajib untuk setiap perubahan tampilan)
- `docs/API.md`: kontrak endpoint dan event Socket.io

## 2. Perintah

Jalankan perintah dari folder paket yang bersangkutan. Sesuaikan jika skrip berbeda.

```bash
# Admin desktop
npm run dev
npm run lint && npm test

# Backend
[ISI: perintah dev, test, migrate]
```

**Sebelum menyatakan tugas selesai:** jalankan lint, typecheck, dan test pada paket yang diubah. Laporkan hasil sebenarnya; jangan mengklaim lulus tanpa menjalankannya.

## 3. Aturan Keamanan dan Anti-Fraud (tidak boleh dilanggar)

Ini inti produk. Setiap perubahan pada alur presensi harus mempertahankan aturan berikut.

1. **Server adalah penentu.** Klien hanya mengirim sinyal. Keputusan diterima/ditolak, jarak, dan status terlambat dihitung di server.
2. **Waktu presensi berasal dari server (NTP).** Jangan pernah memakai jam HP sebagai waktu resmi. Jam HP hanya untuk deteksi anomali.
3. **Jarak dihitung di server dengan Haversine** terhadap titik dan radius kantor. Hitungan di klien hanya untuk UX.
4. **Deteksi teleportation fraud:** bandingkan dengan posisi terakhir dan waktu; tolak atau tandai perpindahan yang mustahil.
5. **Mock location dan root/jailbreak:** sinyal dikumpulkan di klien lewat lapisan abstraksi `IntegrityProvider` dan dikirim bersama payload check-in. Jangan menghapus atau melewati pemeriksaan ini, dan jangan menambahkan flag debug yang mematikannya di build produksi.
6. **Autentikasi:** JWT (Bearer) dengan access token berumur pendek + refresh token. **Device ID binding:** satu akun pegawai = satu perangkat terdaftar; login dari perangkat lain ditolak.
7. **Presensi memakai koordinat GPS + biometrik lokal (Fingerprint/Face ID).** Tidak ada foto selfie; jangan menambahkan fitur pengambilan foto atau wajah ke server.
8. **Idempotensi:** `POST /attendance/check-in` dan `/check-out` wajib memakai `Idempotency-Key`; permintaan ulang tidak boleh membuat catatan ganda.
9. **Lokasi hanya dikumpulkan saat sesi presensi aktif.** Tidak ada pelacakan latar belakang kontinu tanpa persetujuan eksplisit dan keputusan produk.

### Data dan rahasia

- Jangan menulis token, kata sandi, atau koordinat presisi ke log, analitik, atau laporan crash.
- Token di mobile disimpan di Keychain/Keystore, bukan AsyncStorage. Data lokal sensitif (MMKV) dienkripsi.
- Jangan commit `.env`, kunci API peta, kredensial Firebase, atau sertifikat. Pakai `.env.example` untuk nama variabel.
- Semua lalu lintas lewat TLS; mobile memakai SSL pinning. Jangan menonaktifkan validasi sertifikat, bahkan untuk debug.
- Validasi dan sanitasi semua input di server. Gunakan query berparameter; jangan menyusun SQL dari string.

## 4. Konvensi Kode

- **TypeScript strict** di mobile dan backend (jika TS). Dilarang `any` tanpa komentar alasan. JavaScript di Electron admin: gunakan JSDoc untuk tipe pada fungsi publik.
- Struktur **feature-first**: `auth`, `attendance`, `history`, `profile`, `notifications`. Logika bisnis di lapisan service/store, bukan di komponen UI.
- Layanan lintas fitur dibungkus antarmuka: `LocationService`, `IntegrityProvider`, `TimeSyncService`, `SecureStore`, `OfflineQueue`. Ganti implementasi tanpa mengubah pemanggil.
- Penamaan: berkas komponen `PascalCase.tsx`, hook `useXxx`, konstanta `UPPER_SNAKE_CASE`, berkas lain `kebab-case`.
- Respons API selalu berbentuk JSON baku: `{ "success": boolean, "data": ..., "error": { "code", "message" } }`. Gunakan kode galat yang konsisten; jangan mengembalikan stack trace ke klien.
- Event Socket.io yang sudah ada: `send_location`, `update_employee_location`, `new_attendance_alert`. Jangan mengganti nama tanpa memperbarui klien dan dokumen API.
- Komentar dan nama identifier dalam **bahasa Inggris**; teks yang tampil ke pengguna dalam **bahasa Indonesia** lewat berkas i18n (jangan hardcode string di komponen).
- Perubahan kecil dan terfokus. Jangan merefaktor kode yang tidak berkaitan dengan tugas.

## 5. Desain UI

Ikuti `DESIGN.md`. Ringkasan yang sering dilanggar:

- Gunakan **token** (`primary`, `primary-container`, `inverse-surface`, dst.), bukan hex di komponen.
- **Lime (`#E3FF3B`) hanya di atas permukaan navy** atau sebagai titik status live. Dilarang sebagai teks di atas putih atau latar besar.
- Kartu: putih, radius 12px, tanpa border, bayangan halus. Tombol dan input: radius 8px.
- Font: Plus Jakarta Sans (judul, angka KPI) dan Inter (isi). Angka, jam, dan koordinat memakai angka tabular.
- Status selalu **warna + ikon/titik + teks**, bukan warna saja.
- Mobile: target sentuh minimal 48x48 dp; hormati font scaling OS.

## 6. Pengujian

- Logika domain dan keamanan (jarak, waktu, skor risiko, idempotensi) wajib punya **unit test**. Tambah test untuk setiap bug yang diperbaiki.
- Alur kritis (login, check-in, check-out, offline, sesi kedaluwarsa) diuji E2E (Detox untuk mobile).
- Perubahan pada validasi lokasi harus menyertakan kasus: di dalam radius, di luar radius, akurasi buruk, mock aktif, teleportation, jam HP salah.
- Jangan menghapus atau menonaktifkan test agar build lulus.

## 7. Cara Bekerja

1. **Rencanakan dulu** untuk perubahan yang menyentuh lebih dari satu paket atau alur presensi: jelaskan pendekatan singkat sebelum menulis kode.
2. Baca kode dan dokumen yang ada sebelum membuat berkas baru; pakai pola yang sudah ada.
3. Jika kebutuhan ambigu atau bertentangan dengan PRD, **tanyakan**; jangan mengarang perilaku.
4. Jangan menambah dependensi baru tanpa alasan jelas. Sebutkan nama, alasan, dan alternatifnya.
5. Jangan menjalankan perintah destruktif (`rm -rf`, `git reset --hard`, `git push --force`, drop tabel) tanpa persetujuan eksplisit.
6. Migrasi database: buat berkas migrasi baru; jangan mengubah migrasi yang sudah dijalankan.
7. Commit: pesan dalam bahasa Inggris dengan format Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`). Jangan commit kecuali diminta.
8. Balas pengguna dalam **bahasa Indonesia**, ringkas, dan sebutkan berkas yang diubah serta hasil lint/test.

## 8. Hal yang Perlu Diwaspadai

- Deteksi mock location di iOS berbeda dari Android (tidak ada mock provider; `CLLocationSourceInformation` hanya iOS 15+). Jangan menyamakan perilakunya.
- Deteksi root/jailbreak di klien dapat dilewati; atestasi server (Play Integrity/App Attest) adalah kontrol utama.
- Pembatasan baterai OEM Android dapat menunda notifikasi; pengingat mengandalkan notifikasi lokal dengan fallback.
- GPS di dalam gedung tidak akurat; ambang akurasi dan kebijakan *borderline* dikonfigurasi di server, jangan di-hardcode di klien.
