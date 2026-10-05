import { NextResponse } from 'next/server';

let mockGuruLaporan = [
  {
    id: '1',
    namaSiswa: 'Ahmad Fauzi',
    nisn: '0051234567',
    jurusan: 'TKJ',
    mitra: 'PT Telkom Indonesia Witel Riau',
    judul: 'Rancang Bangun Topologi Jaringan Fiber Optic dan Konfigurasi Routing BGP',
    fileUrl: 'https://drive.google.com/file/d/example1/view',
    ringkasan: 'Laporan merangkum implementasi jaringan fiber optic di kawasan perkantoran, setting OLT dan konfigurasi router gateway.',
    status: 'SUBMITTED',
    catatanGuru: '',
    tanggalSubmit: '2026-10-04',
  },
  {
    id: '2',
    namaSiswa: 'Siti Rahmawati',
    nisn: '0057654321',
    jurusan: 'RPL',
    mitra: 'CV Tech Inovasi Digital',
    judul: 'Pengembangan Sistem Informasi Presensi Berbasis Web di PT Mitra Solusi',
    fileUrl: 'https://drive.google.com/file/d/example2/view',
    ringkasan: 'Membahas perancangan arsitektur database PostgreSQL, REST API Next.js, dan testing performa antarmuka pengguna.',
    status: 'APPROVED',
    catatanGuru: 'Sistematika penulisan bab 1-4 sangat baik dan rapi. Laporan disetujui untuk maju ke sidang.',
    tanggalSubmit: '2026-10-02',
  },
  {
    id: '3',
    namaSiswa: 'Budi Santoso',
    nisn: '0059876543',
    jurusan: 'TKJ',
    mitra: 'PT Riau Cyber Solution',
    judul: 'Instalasi dan Pemeliharaan Jaringan Wireless Kantor Cabang',
    fileUrl: 'https://drive.google.com/file/d/example3/view',
    ringkasan: 'Laporan berisi dokumentasi setting Access Point UniFi, cabling CAT6, dan bandwidth management.',
    status: 'SUBMITTED',
    catatanGuru: '',
    tanggalSubmit: '2026-10-05',
  },
];

export async function GET() {
  return NextResponse.json(mockGuruLaporan);
}
