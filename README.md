# SIPKL — Sistem Informasi Praktik Kerja Lapangan
### SMK Negeri 1 Perhentian Raja

Aplikasi manajemen Praktik Kerja Lapangan (PKL) berbasis web modern yang dibangun dengan Next.js, NextAuth, Prisma, dan PostgreSQL. Mendukung 4 role terintegrasi dengan tema warna profesional dipadukan putih bersih (*clean white*), line icons, pemindai barcode QR via kamera & token manual, serta perekam jejak lokasi GPS otomatis.

---

## 🌟 Fitur Utama Berdasarkan Role

### 1. 🎓 Siswa (Theme: Biru & Putih)
- **Presensi Harian Multi-Metode**:
  - Pindai Barcode / QR Code Mitra secara langsung melalui kamera smartphone/laptop (*auto front/rear camera switch*).
  - Input Kode Token Manual (alternatif tanpa kamera).
  - Unggah foto/gambar QR Code.
  - Simulasi scan barcode untuk pengujian.
- **Perekam Lokasi Presensi GPS (Real-Time)**:
  - Merekam titik koordinat Latitude, Longitude, tingkat akurasi (meter), serta tautan langsung ke Google Maps saat presensi Masuk dan Pulang.
- **Pengajuan Izin & Sakit**:
  - Mencegah status Alpha dengan mengirim keterangan sakit / izin beserta unggah lampiran surat dokter.
- **Logbook Mingguan**:
  - Catatan kegiatan harian dan progres mingguan selama masa PKL.
- **Laporan Akhir PKL**:
  - Pengunggahan berkas laporan akhir untuk ditinjau guru pembimbing.
- **Transkrip & Rekap Nilai**:
  - Tinjauan nilai akademik guru dan nilai teknis dari mitra.

### 2. 🏢 Mitra PKL (Theme: Oranye & Putih)
- **Generator Barcode QR Presensi**:
  - Pembuatan QR code presensi harian dengan masa berlaku (*expiration*) otomatis.
- **Rekapitulasi Kehadiran Siswa**:
  - Pemantauan kehadiran seluruh siswa bimbingan beserta jejak lokasi GPS dan metode scan.
- **Penilaian Kinerja Siswa PKL**:
  - Penilaian berbasis 4 kriteria industri yang langsung tersinkronisasi ke siswa, guru, dan admin.

### 3. 👨‍🏫 Guru Pendamping (Theme: Hijau & Putih)
- **Monitoring Siswa Bimbingan**:
  - Memantau lokasi magang, status aktif, dan keaktifan siswa.
- **Review Logbook Mingguan**:
  - Memberikan catatan evaluasi, masukan, dan persetujuan (ACC) logbook mingguan siswa.
- **Review Laporan Akhir**:
  - Peninjauan berkas laporan akhir PKL siswa.
- **Penilaian Akademik Siswa**:
  - Input nilai pembimbingan yang terintegrasi ke rapor PKL.

### 4. ⚙️ Administrator (Theme: Ungu & Putih)
- **Command Center & Monitoring Global**:
  - Dashboard statistik kehadiran, periode aktif, dan sebaran siswa di mitra.
- **Manajemen Akun 4 Role**:
  - Pengelolaan kredensial Siswa, Guru Pendamping, Mitra PKL, dan Administrator.
- **Persetujuan Surat Izin Magang**:
  - Konfirmasi pengajuan izin dan administrasi PKL sekolah.
- **Manajemen Periode PKL**:
  - Pengaturan jadwal gelombang PKL tahun ajaran aktif.

---

## 🛠️ Tech Stack
- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Autentikasi**: [NextAuth.js](https://next-auth.js.org/) (JWT Session, Role-Based Access Control)
- **Database ORM**: [Prisma ORM](https://www.prisma.io/) (PostgreSQL ready for Supabase / Neon / Vercel Postgres)
- **Styling**: Vanilla CSS Design System with Role Theme Variables & High Contrast Typography
- **Icons**: Custom SVG Line Icons
- **Barcode & Scanner**: `html5-qrcode`, `qrcode`
- **Geolocation**: HTML5 Geolocation API with Google Maps Integration
- **Deployment**: Vercel Ready

---

## 🚀 Memulai (Local Development)

### 1. Klon Repositori
```bash
git clone https://github.com/XeontNexus/SIPKL.git
cd SIPKL
```

### 2. Pasang Dependencies
```bash
npm install
```

### 3. Konfigurasi Environment Variable
Salin berkas `.env.example` ke `.env`:
```bash
cp .env.example .env
```
Sesuaikan `DATABASE_URL` dengan database PostgreSQL Anda.

### 4. Setup Database Prisma
```bash
npx prisma generate
npx prisma db push
```

### 5. Jalankan Server Development
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

---

## 👤 Akun Demo untuk Pengujian

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@smkn1perhentianraja.sch.id` | `password123` |
| **Guru Pendamping** | `guru@smkn1perhentianraja.sch.id` | `password123` |
| **Siswa PKL** | `siswa@smkn1perhentianraja.sch.id` | `password123` |
| **Mitra Industri** | `mitra@smkn1perhentianraja.sch.id` | `password123` |

---

## 📄 Lisensi
Hak Cipta © 2026 SMK Negeri 1 Perhentian Raja.
