# security.md: Standar Keamanan Admin Desktop GeoAttend

Standar keamanan wajib untuk **Dashboard Admin Desktop** (Electron + React Vite). Dokumen ini melengkapi `AGENTS.md` (aturan kode), `auth.md` (autentikasi), dan `DESIGN.md` (UI). Bila ada konflik, aturan yang **lebih ketat** berlaku.

Kata **WAJIB** berarti tidak boleh dilanggar; **DISARANKAN** berarti diterapkan kecuali ada alasan tertulis.

---

## 1. Aset dan Model Ancaman

### 1.1 Aset yang dilindungi

| Aset | Sensitivitas | Alasan |
|---|---|---|
| Data lokasi pegawai (koordinat, jejak, usia data) | **Tinggi** | Data pribadi; bisa disalahgunakan untuk menguntit |
| Data kehadiran dan koreksi | Tinggi | Dasar payroll dan sengketa |
| Kredensial dan token admin | **Kritis** | Akses ke seluruh data pegawai |
| Data induk pegawai (nama, ID, email, token RFID) | Tinggi | Data pribadi |
| Konfigurasi geofence, shift, kebijakan | Sedang | Manipulasi memengaruhi keputusan presensi |
| Log audit | Tinggi | Bukti; harus tak dapat diubah |

### 1.2 Ancaman dan mitigasi

| Ancaman | Contoh | Mitigasi utama | Bagian |
|---|---|---|---|
| XSS di renderer | Catatan pegawai berisi `<script>` | React escaping, CSP ketat, tanpa `innerHTML`, sanitasi | 4, 6 |
| Eskalasi dari renderer ke OS | XSS memanggil API Node | `contextIsolation`, `sandbox`, preload sempit, validasi IPC | 3 |
| Pencurian token | Malware membaca penyimpanan | Access token di memori, refresh token `safeStorage` | 5 |
| Penyadapan jaringan | MITM di Wi-Fi publik | TLS 1.3, validasi sertifikat, pemblokiran HTTP | 7 |
| Kerentanan dependensi | Paket npm berbahaya | Lockfile, audit, review dependensi, tanpa skrip instal | 9 |
| Pembaruan palsu | Auto-update dibajak | Tanda tangan kode, HTTPS, verifikasi publisher | 10 |
| Penyalahgunaan akses internal | Admin melihat lokasi tanpa alasan | RBAC, pencatatan akses, ekspor terbatas | 8 |
| Kebocoran lewat log/crash | Token atau koordinat di log | Redaksi log, larangan mencatat data sensitif | 11 |
| Injeksi lewat ekspor | Formula CSV (`=cmd...`) | Netralisasi sel | 6 |
| Tamper konfigurasi build | Mengubah ASAR atau flag | Electron Fuses, integritas ASAR | 10 |

---

## 2. Prinsip

1. **Anggap renderer tidak tepercaya.** Semua yang berasal dari renderer (termasuk argumen IPC) diperlakukan seperti input dari internet.
2. **Hak akses minimum.** Renderer hanya menerima kemampuan yang benar-benar dibutuhkan, lewat fungsi sempit.
3. **Server yang memutuskan.** UI tidak pernah menjadi kontrol akses.
4. **Data sensitif tidak bertahan.** Data lokasi hanya di memori dan dibuang saat logout.
5. **Gagal dengan aman.** Jika enkripsi, validasi, atau verifikasi tidak tersedia, fitur ditolak, bukan dilonggarkan.

---

## 3. Hardening Electron

### 3.1 Pengaturan jendela (WAJIB)

```js
const win = new BrowserWindow({
  width: 1440, height: 900, minWidth: 1366, minHeight: 768,
  show: false,
  webPreferences: {
    contextIsolation: true,
    nodeIntegration: false,
    nodeIntegrationInWorker: false,
    nodeIntegrationInSubFrames: false,
    sandbox: true,
    webSecurity: true,
    allowRunningInsecureContent: false,
    webviewTag: false,
    experimentalFeatures: false,
    devTools: !app.isPackaged,
    preload: path.join(__dirname, 'preload.js'),
  },
});
```

Dilarang mengubah nilai di atas, termasuk "sementara" untuk debugging.

### 3.2 Hardening global (WAJIB)

Terapkan pada **semua** `webContents` yang dibuat, bukan hanya jendela utama:

```js
app.on('web-contents-created', (_event, contents) => {
  contents.setWindowOpenHandler(() => ({ action: 'deny' }));
  contents.on('will-navigate', (e, url) => { if (!isAllowedAppUrl(url)) e.preventDefault(); });
  contents.on('will-redirect', (e, url) => { if (!isAllowedAppUrl(url)) e.preventDefault(); });
  contents.on('will-attach-webview', (e) => e.preventDefault());
});

session.defaultSession.setPermissionRequestHandler((_wc, _permission, cb) => cb(false));
session.defaultSession.setPermissionCheckHandler(() => false);
```

- Aplikasi **tidak** memerlukan kamera, mikrofon, geolokasi, atau notifikasi perangkat dari halaman web; tolak semua. Notifikasi desktop dikirim dari main process bila perlu.
- `isAllowedAppUrl` hanya mengizinkan asal aplikasi: berkas lokal terbungkus (produksi) atau `http://localhost:<port-vite>` (hanya `!app.isPackaged`).

### 3.3 Instans tunggal dan tautan dalam

```js
if (!app.requestSingleInstanceLock()) app.quit();
```

Jika aplikasi mendaftarkan protokol kustom/deep link, parameter dari URL **WAJIB** divalidasi (skema, host, panjang) dan tidak boleh langsung memicu aksi sensitif tanpa sesi valid.

### 3.4 Tautan eksternal

`shell.openExternal` hanya setelah validasi:

```js
const ALLOWED_HOSTS = new Set(['docs.perusahaan.id', 'support.perusahaan.id']); // [ISI]
function safeOpenExternal(raw) {
  let u; try { u = new URL(raw); } catch { return false; }
  if (u.protocol !== 'https:' || !ALLOWED_HOSTS.has(u.hostname)) return false;
  shell.openExternal(u.toString());
  return true;
}
```

Dilarang `shell.openExternal(urlDariRenderer)` tanpa validasi, dan dilarang membuka skema `file:`, `smb:`, atau skema aplikasi lain.

---

## 4. Content Security Policy

CSP **WAJIB** dipasang pada `index.html` (meta) dan, bila memungkinkan, header lewat `session.webRequest.onHeadersReceived`.

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://*.tile.provider.example;
  font-src 'self';
  connect-src 'self' https://api.perusahaan.id wss://api.perusahaan.id https://*.tile.provider.example;
  object-src 'none';
  base-uri 'none';
  form-action 'none';
  frame-ancestors 'none';
  frame-src 'none';
">
```

Catatan:

- Tidak ada `unsafe-eval`. `unsafe-inline` hanya pada `style-src` (dibutuhkan atribut `style` React); **tidak** pada `script-src`.
- `connect-src` diisi domain API dan WebSocket sebenarnya `[ISI]`, serta domain tile peta.
- **Font dan ikon harus dibundel lokal** (mis. `@fontsource/inter`, `@fontsource/plus-jakarta-sans`, Material Symbols lokal). `DESIGN.md` memakai Google Fonts di prototipe; untuk produksi, jangan memuat dari CDN saat runtime.
- **SDK peta:** pilih pustaka yang dibundel lewat npm (mis. Mapbox GL / MapLibre) sehingga `script-src` tetap `'self'`. Jika harus memakai skrip Google Maps JS, tambahkan domain tersebut secara spesifik ke `script-src`, catat sebagai pengecualian di dokumen ini, dan batasi kunci API berdasarkan referrer/aplikasi.
- Uji CSP di build produksi; pelanggaran CSP di konsol dianggap bug.

---

## 5. IPC, Preload, dan Penyimpanan Rahasia

Detail pola ada di `AGENTS.md` Bagian 5.3-5.5. Ringkasan wajib:

1. `preload.js` hanya mengekspos fungsi sempit lewat `contextBridge`; **tanpa** `ipcRenderer`, `require`, `process`, atau `fs`.
2. Channel berupa **allowlist tetap** (`domain:aksi`); nama channel tidak boleh datang dari renderer.
3. Setiap `ipcMain.handle` WAJIB: (a) memvalidasi pengirim (`event.senderFrame.url`), (b) memvalidasi bentuk, tipe, dan panjang argumen, (c) mengembalikan galat terstruktur tanpa stack trace.
4. Tidak ada handler generik (`fs:read(path)`, `exec(cmd)`, `fetch(url)`). Akses berkas hanya lewat dialog sistem atau jalur tetap; cegah path traversal.
5. Access token hanya di memori renderer; refresh token di main dengan `safeStorage`.

### 5.1 Pemeriksaan `safeStorage`

```js
function canEncrypt() {
  if (!safeStorage.isEncryptionAvailable()) return false;
  // Di Linux, backend "basic_text" tidak benar-benar aman; perlakukan sebagai tidak tersedia.
  if (process.platform === 'linux' && safeStorage.getSelectedStorageBackend?.() === 'basic_text') return false;
  return true;
}
```

Jika `canEncrypt()` bernilai `false`: **jangan menyimpan** token; sesi hanya bertahan selama aplikasi terbuka dan pengguna diberi tahu.

### 5.2 Data yang tidak boleh ditulis ke disk

- Koordinat, jejak perjalanan, dan daftar posisi pegawai.
- Access token, kode MFA, kata sandi.
- Respons API berisi data pribadi (kecuali cache terenkripsi yang disetujui secara tertulis).

Saat logout: panggil `session.defaultSession.clearCache()` dan `clearStorageData()` untuk asal aplikasi, dan kosongkan state live di memori.

---

## 6. Keamanan Renderer (React)

| Aturan | Keterangan |
|---|---|
| Tanpa `eval`, `new Function`, `setTimeout(string)` | Dilarang; juga diblokir CSP |
| Tanpa `dangerouslySetInnerHTML` | Kecuali konten disanitasi dengan pustaka yang disetujui (DOMPurify) dan disetujui reviewer |
| Tanpa `innerHTML`/`outerHTML` dengan data dinamis | Pakai teks React biasa |
| Data pegawai selalu dianggap tidak tepercaya | Nama, catatan check-out, alasan koreksi bisa berisi markup |
| Tautan dinamis | Validasi skema (`https:` saja) sebelum dirender sebagai `href` |
| Tanpa memuat skrip/gaya CDN saat runtime | Semua dibundel Vite |
| Tanpa `target="_blank"` tanpa `rel="noopener noreferrer"` | Dan buka lewat `safeOpenExternal` |
| Query dan parameter rute | Validasi dan *encode* sebelum dipakai ke API |

### 6.1 Ekspor CSV/Excel (formula injection)

```js
const DANGEROUS = /^[=+\-@\t\r]/;
export const safeCell = (v) => {
  const s = String(v ?? '');
  return DANGEROUS.test(s) ? `'${s}` : s;
};
```

Semua sel dari data pengguna WAJIB melewati `safeCell`. Tambahkan test dengan nilai `=HYPERLINK(...)`, `+cmd`, `-2+3`, dan `@SUM`.

---

## 7. Jaringan

1. **TLS 1.3** untuk REST dan WebSocket (`https://` dan `wss://` saja). HTTP polos dan `ws://` hanya untuk `localhost` saat pengembangan.
2. Dilarang menonaktifkan validasi sertifikat (`ignore-certificate-errors`, `rejectUnauthorized: false`, `NODE_TLS_REJECT_UNAUTHORIZED=0`), termasuk di staging.
3. Tangani `certificate-error` dengan menolak:
   ```js
   app.on('certificate-error', (event, _wc, _url, _error, _cert, callback) => { event.preventDefault(); callback(false); });
   ```
4. **DISARANKAN:** certificate/public-key pinning untuk domain API pada main process, dengan pin cadangan dan prosedur rotasi tertulis.
5. Semua panggilan API lewat satu instance `axios` (lihat `auth.md`); `baseURL` dari variabel lingkungan; timeout 15 detik.
6. Token pada Socket.io lewat `auth` handshake, bukan query string, agar tidak terekam di log proxy.
7. Jangan mengirim data pribadi ke layanan analitik atau pelacakan pihak ketiga.

---

## 8. Privasi dan Akses Data Lokasi

Data lokasi pegawai adalah data pribadi. Rujukan regulasi: **UU No. 27 Tahun 2022 (UU PDP)**, serta GDPR/PDPA bila relevan. Validasi akhir oleh Legal/DPO.

1. **Minimisasi tampilan:** peta hanya menampilkan pegawai yang sedang dalam sesi kerja dan telah memberi persetujuan; ikuti flag dari server. Peran `executive` tidak menerima data lokasi individual.
2. **Cakupan data:** `manager` hanya melihat departemennya; penegakan di server, UI hanya mengikuti.
3. **Pencatatan akses:** setiap pembukaan detail lokasi individual, ekspor yang memuat koordinat, dan perubahan geofence dicatat server di audit log (siapa, kapan, objek). Klien memanggil endpoint audit yang disediakan dan **tidak boleh** melewatkannya.
4. **Usia data selalu terlihat:** tampilkan "terakhir X menit lalu"; jangan menyajikan posisi usang sebagai real-time.
5. **Ekspor koordinat:** hanya `super_admin` (atau izin khusus `hr_admin`), dengan konfirmasi dan alasan tercatat.
6. **Retensi:** koordinat presisi mengikuti kebijakan tenant (default 90 hari, diatur server). Klien tidak menyimpan salinan.
7. **Pelacakan tidak bersifat rahasia:** pegawai telah diberi informasi dan persetujuan di aplikasi mobile; admin tidak boleh meminta fitur pelacakan di luar jam kerja.
8. Layar yang menampilkan data lokasi **disarankan** diberi indikator "Data sensitif" dan tidak ikut tertangkap dalam *crash report* atau tangkapan layar otomatis oleh alat pihak ketiga.

---

## 9. Dependensi dan Rantai Pasok

1. **Lockfile (`package-lock.json`) WAJIB di-commit.** CI memakai `npm ci`, bukan `npm install`.
2. Versi dependensi runtime dipin (tanpa `^`/`~` untuk paket kritis: `electron`, `axios`, `socket.io-client`, pustaka peta, pustaka autentikasi).
3. `npm audit --omit=dev` dijalankan di CI; temuan **high/critical** menahan rilis, kecuali ada pengecualian tertulis dengan batas waktu.
4. **DISARANKAN:** Dependabot/Renovate untuk pembaruan berkala; Electron diperbarui mengikuti versi mayor yang masih didukung (paling lama tertinggal satu rilis mayor).
5. Sebelum menambah dependensi: periksa pemelihara, jumlah unduhan, tanggal rilis terakhir, ukuran, dan skrip `postinstall`. Hindari paket kecil yang menggantikan beberapa baris kode.
6. Waspadai typosquatting; pastikan nama paket tepat. Hanya registry resmi `npmjs.org`.
7. Jalankan instalasi dengan `--ignore-scripts` untuk paket baru yang belum ditinjau; aktifkan skrip hanya untuk yang dipercaya (mis. `electron`).
8. Hasilkan **SBOM** (CycloneDX) pada setiap rilis.
9. Dilarang menyalin kode dari sumber tak jelas, menyuntikkan skrip dari CDN, atau menjalankan `curl | sh` di langkah build.

---

## 10. Build, Penandatanganan, dan Pembaruan

### 10.1 Electron Fuses (WAJIB)

```js
// scripts/flip-fuses.js (dijalankan setelah packaging)
const { flipFuses, FuseVersion, FuseV1Options } = require('@electron/fuses');
await flipFuses(electronBinaryPath, {
  version: FuseVersion.V1,
  [FuseV1Options.RunAsNode]: false,
  [FuseV1Options.EnableCookieEncryption]: true,
  [FuseV1Options.EnableNodeOptionEnvironmentVariable]: false,
  [FuseV1Options.EnableNodeCliInspectArguments]: false,
  [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
  [FuseV1Options.OnlyLoadAppFromAsar]: true,
});
```

### 10.2 Penandatanganan dan notarisasi

- **WAJIB:** build rilis ditandatangani (Windows Authenticode; macOS Developer ID + notarisasi). Kunci dan sertifikat disimpan di rahasia CI atau HSM, **tidak** di repositori.
- Tanpa tanda tangan, rilis dianggap tidak sah dan tidak boleh didistribusikan.

### 10.3 Auto-update

- Sumber pembaruan hanya **HTTPS** dari domain milik perusahaan; verifikasi tanda tangan dan nama publisher (mis. `electron-updater` dengan `publisherName` di Windows).
- Dilarang membuat pembaruan yang dapat diunduh dari URL yang diberikan renderer.
- Sediakan **versi minimum**: server dapat menolak klien yang terlalu lama (`UPGRADE_REQUIRED`) dan UI memaksa pembaruan.
- Pembaruan dapat ditarik (rollback) dengan merilis versi bernomor lebih tinggi; simpan artefak versi sebelumnya.

### 10.4 Konfigurasi build produksi

- Matikan DevTools, `--inspect`, dan variabel debug di build rilis.
- Hapus *source map* dari paket yang didistribusikan, atau unggah ke layanan crash secara privat.
- Tidak ada kunci privat, token, atau kredensial di bundel. Ingat: variabel `VITE_*` **tertanam di klien dan bukan rahasia**.
- Build berasal dari CI pada commit yang ditandai (tag), bukan dari laptop pengembang.

---

## 11. Logging dan Pelaporan Galat

1. Gunakan satu logger terpusat (mis. `electron-log`) dengan **redaksi** otomatis: `authorization`, `token`, `refresh_token`, `password`, `code`, `lat`, `lng`, `latitude`, `longitude`.
2. **Dilarang** mencatat: token, kata sandi, kode MFA, koordinat presisi, isi respons auth, atau data pribadi pegawai.
3. Log berisi: kode galat, endpoint (tanpa query sensitif), status HTTP, ID korelasi, versi aplikasi.
4. Laporan crash (mis. Sentry) diatur agar tidak menyertakan *breadcrumb* jaringan berisi header otorisasi atau body; gunakan `beforeSend` untuk menghapus data sensitif.
5. Berkas log lokal dirotasi (maksimum 5 berkas x 5 MB) dan tidak berisi data sensitif sehingga aman dibagikan ke dukungan.
6. Pesan galat ke pengguna: Bahasa Indonesia, jelas, tanpa detail teknis internal; sertakan kode referensi.

---

## 12. Autentikasi dan Otorisasi (ringkasan)

Rincian di `auth.md`. Poin keamanan yang tidak boleh dilanggar:

- Access token 15 menit, refresh token berotasi dengan deteksi pemakaian ulang; MFA wajib untuk `hr_admin` dan `super_admin`.
- RBAC ditegakkan server; UI hanya menyesuaikan tampilan. `403` ditangani tanpa logout.
- Sesi idle dikunci (default 30 menit); logout membersihkan memori, berkas token, cache, dan memutus Socket.io.
- Pesan login/lupa kata sandi bersifat generik; tidak ada penyimpanan kata sandi untuk login otomatis.

---

## 13. Socket.io

1. Satu koneksi singleton; token lewat `auth`, diperbarui pada setiap reconnect.
2. Admin hanya **mendengarkan** `update_employee_location`, `new_attendance_alert`, `employee_login`, `employee_logout`; admin **tidak** memancarkan `send_location`.
3. Payload dari server diperlakukan tidak tepercaya: validasi bentuk (tipe dan rentang koordinat: lat -90..90, lng -180..180) sebelum masuk state; buang pesan yang tidak valid dan catat tanpa isi.
4. Batasi laju pemrosesan (batching) untuk mencegah UI membeku akibat banjir pesan; abaikan pesan lebih tua dari data yang ada.
5. Putuskan koneksi dan kosongkan state live saat logout, sesi dicabut, atau akun dinonaktifkan.

---

## 14. Pengujian Keamanan

| Jenis | Alat/Metode | Frekuensi |
|---|---|---|
| Lint keamanan | ESLint (`eslint-plugin-security`, `react/no-danger`), Semgrep | Setiap PR |
| Konfigurasi Electron | Electronegativity atau tinjauan manual terhadap Bagian 3 | Setiap rilis |
| Dependensi | `npm audit --omit=dev`, SBOM | Setiap build CI |
| Unit | Validator IPC (input berbahaya), `safeCell`, `isAllowedAppUrl`, `safeOpenExternal` | Setiap PR |
| E2E | Login, logout membersihkan token, akses ditolak untuk peran tanpa hak | Setiap rilis |
| CSP | Jalankan build produksi dan pastikan tidak ada pelanggaran | Setiap rilis |
| Uji penetrasi | Pihak independen; acuan OWASP ASVS dan panduan keamanan Electron | Sebelum GA dan tahunan |

Kasus uji wajib:

- Renderer mencoba memanggil channel IPC di luar allowlist: ditolak.
- Argumen IPC bertipe salah, terlalu panjang, atau berisi `../`: ditolak.
- `shell.openExternal` dengan `file:///`, `javascript:`, atau domain di luar allowlist: ditolak.
- Navigasi ke URL eksternal dan `window.open`: diblokir.
- Catatan pegawai berisi `<img src=x onerror=...>`: tampil sebagai teks, tidak dieksekusi.
- Ekspor CSV dengan sel `=HYPERLINK(...)`: dinetralkan.
- Setelah logout: tidak ada token di memori/berkas, Socket.io terputus, state live kosong.

---

## 15. Respons Insiden

1. **Deteksi:** laporan dari pengguna, alert audit server (login anomali, refresh dipakai ulang, ekspor koordinat tak lazim), temuan audit dependensi.
2. **Penahanan:** cabut sesi dan token terdampak di server; nonaktifkan akun; tarik rilis/pembaruan bermasalah; rotasi kunci API peta dan rahasia CI bila ada indikasi bocor.
3. **Penilaian:** tentukan data terdampak (terutama data lokasi dan data pribadi pegawai), rentang waktu, dan jumlah subjek data.
4. **Pemberitahuan:** libatkan Legal/DPO. Kewajiban pemberitahuan kegagalan pelindungan data pribadi menurut UU PDP berlaku (pemberitahuan tertulis dalam 3x24 jam kepada subjek data dan lembaga); GDPR 72 jam bila relevan. Validasi akhir oleh Legal.
5. **Pemulihan:** rilis perbaikan bertanda tangan, paksa pembaruan lewat versi minimum.
6. **Pasca-insiden:** tulis analisis akar masalah, tambahkan test yang mencegah pengulangan, perbarui dokumen ini.

Kontak keamanan: `[ISI: email/saluran tim keamanan]`. Laporan kerentanan dari luar diterima di `[ISI: security@domain]` dan ditanggapi dalam `[ISI: mis. 2 hari kerja]`.

---

## 16. Daftar Periksa Rilis

**Konfigurasi Electron**
- [ ] `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`, `webSecurity: true`, `webviewTag: false`
- [ ] Hardening `web-contents-created` aktif (window open, navigasi, redirect, webview)
- [ ] Handler izin menolak semua permintaan; `certificate-error` menolak
- [ ] DevTools dimatikan di build rilis
- [ ] CSP aktif di produksi tanpa pelanggaran; font dan ikon dibundel lokal

**IPC dan data**
- [ ] Preload hanya mengekspos fungsi sempit; tidak ada `ipcRenderer` mentah
- [ ] Semua handler IPC memvalidasi pengirim dan argumen
- [ ] Tidak ada token/koordinat di `localStorage`, disk, atau log
- [ ] `safeStorage` dicek (termasuk backend `basic_text` di Linux)
- [ ] Logout membersihkan memori, berkas token, cache, dan Socket.io

**Dependensi dan build**
- [ ] `package-lock.json` di-commit; build memakai `npm ci`
- [ ] `npm audit --omit=dev` tanpa temuan high/critical
- [ ] Electron Fuses diterapkan; integritas ASAR aktif
- [ ] Build ditandatangani (dan dinotarisasi di macOS); SBOM dibuat
- [ ] Auto-update hanya dari HTTPS tepercaya dengan verifikasi tanda tangan
- [ ] Tidak ada rahasia di bundel; `VITE_*` hanya berisi nilai publik

**Aplikasi**
- [ ] Tidak ada `eval`, `innerHTML` dinamis, atau `dangerouslySetInnerHTML` tanpa sanitasi
- [ ] Ekspor CSV/Excel menetralkan formula
- [ ] Akses data lokasi tercatat di audit log; `executive` tidak menerima lokasi individual
- [ ] Teks UI di `src/i18n/` (Bahasa Indonesia); komentar dan commit berbahasa Inggris
- [ ] Lint, test, dan uji E2E keamanan lulus dan hasilnya dilaporkan

---

## 17. Pengecualian

Setiap pengecualian terhadap dokumen ini harus: (1) tertulis di bagian ini dengan alasan, (2) disetujui pemilik keamanan, (3) memiliki batas waktu, dan (4) dilacak sebagai tugas.

| Tanggal | Aturan | Alasan | Disetujui oleh | Berlaku sampai |
|---|---|---|---|---|
| `[ISI]` | `[ISI]` | `[ISI]` | `[ISI]` | `[ISI]` |
