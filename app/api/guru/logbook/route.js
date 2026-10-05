import { NextResponse } from 'next/server';

let mockGuruLogbooks = [
  {
    id: '1',
    namaSiswa: 'Ahmad Fauzi',
    jurusan: 'TKJ',
    mingguKe: 1,
    tanggalMulai: '2026-10-01',
    tanggalSelesai: '2026-10-05',
    kegiatan: 'Melakukan instalasi sistem operasi Linux Server pada mesin pengujian kantor, konfigurasi IP address statis, dan setting router gateway Mikrotik.',
    kendala: 'Kabel UTP sempat bermasalah pada crimping pin 3.',
    fotoUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&auto=format&fit=crop&q=60',
    status: 'SUBMITTED',
    catatanGuru: '',
  },
  {
    id: '2',
    namaSiswa: 'Siti Rahmawati',
    jurusan: 'RPL',
    mingguKe: 1,
    tanggalMulai: '2026-10-01',
    tanggalSelesai: '2026-10-05',
    kegiatan: 'Membuat modul autentikasi NextAuth, mendesain tampilan dashboard responsif menggunakan CSS modern dan integrasi API route.',
    kendala: 'Tidak ada kendala berarti.',
    fotoUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&auto=format&fit=crop&q=60',
    status: 'REVIEWED',
    catatanGuru: 'Bagus sekali Siti, lanjutkan pengerjaan modul penilaian!',
  },
  {
    id: '3',
    namaSiswa: 'Budi Santoso',
    jurusan: 'TKJ',
    mingguKe: 1,
    tanggalMulai: '2026-10-01',
    tanggalSelesai: '2026-10-05',
    kegiatan: 'Membantu maintenance PC workstation di ruang akuntansi dan crimping kabel LAN baru.',
    kendala: 'Persediaan konektor RJ45 sempat habis.',
    fotoUrl: '',
    status: 'SUBMITTED',
    catatanGuru: '',
  },
];

export async function GET() {
  return NextResponse.json(mockGuruLogbooks);
}
