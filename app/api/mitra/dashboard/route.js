import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    stats: {
      totalSiswa: 4,
      hadirHariIni: 3,
      izinSakit: 1,
      sudahDinilai: 2,
    },
    siswaList: [
      { id: '1', nama: 'Ahmad Fauzi', nisn: '0051234567', jurusan: 'Teknik Komputer dan Jaringan', statusPresensi: 'HADIR', nilaiStatus: 'SUDAH' },
      { id: '2', nama: 'Siti Rahmawati', nisn: '0057654321', jurusan: 'Rekayasa Perangkat Lunak', statusPresensi: 'HADIR', nilaiStatus: 'SUDAH' },
      { id: '3', nama: 'Budi Santoso', nisn: '0059876543', jurusan: 'Teknik Komputer dan Jaringan', statusPresensi: 'HADIR', nilaiStatus: 'BELUM' },
      { id: '4', nama: 'Dewi Lestari', nisn: '0053456789', jurusan: 'Multimedia / DKV', statusPresensi: 'IZIN', nilaiStatus: 'BELUM' },
    ],
  });
}
