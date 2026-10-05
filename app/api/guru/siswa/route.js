import { NextResponse } from 'next/server';

let mockSiswaBimbingan = [
  {
    id: '1',
    nisn: '0051234567',
    kelas: 'XII TKJ 1',
    jurusan: 'Teknik Komputer dan Jaringan',
    statusPKL: 'SEDANG_PKL',
    user: { nama: 'Ahmad Fauzi', email: 'fauzi@siswa.smkn1.sch.id' },
    mitra: { namaPerusahaan: 'PT Telkom Indonesia Witel Riau' },
    nilaiGuru: {
      nilaiSikap: 88,
      nilaiKeterampilan: 89,
      nilaiLaporan: 87,
      nilaiAkhir: 88.0,
      catatan: 'Aktif dan disiplin tinggi selama magang.',
    },
  },
  {
    id: '2',
    nisn: '0057654321',
    kelas: 'XII RPL 1',
    jurusan: 'Rekayasa Perangkat Lunak',
    statusPKL: 'SEDANG_PKL',
    user: { nama: 'Siti Rahmawati', email: 'siti@siswa.smkn1.sch.id' },
    mitra: { namaPerusahaan: 'CV Tech Inovasi Digital' },
    nilaiGuru: {
      nilaiSikap: 92,
      nilaiKeterampilan: 94,
      nilaiLaporan: 90,
      nilaiAkhir: 92.0,
      catatan: 'Kemampuan coding dan sistematika laporan sangat baik.',
    },
  },
  {
    id: '3',
    nisn: '0059876543',
    kelas: 'XII TKJ 2',
    jurusan: 'Teknik Komputer dan Jaringan',
    statusPKL: 'SEDANG_PKL',
    user: { nama: 'Budi Santoso', email: 'budi@siswa.smkn1.sch.id' },
    mitra: { namaPerusahaan: 'PT Riau Cyber Solution' },
    nilaiGuru: null,
  },
];

export async function GET() {
  return NextResponse.json(mockSiswaBimbingan);
}
