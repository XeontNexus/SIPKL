import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    stats: {
      totalPresensi: 28,
      totalLogbook: 4,
      statusLaporan: 'Menunggu Review',
      statusPKL: 'Sedang Berlangsung',
    },
    siswa: {
      nama: 'Ahmad Fauzi',
      nisn: '0051234567',
      kelas: 'XII TKJ 1',
      jurusan: 'Teknik Komputer dan Jaringan',
      mitra: 'PT Telkom Indonesia Witel Riau',
      guru: 'Drs. H. Hendra Wijaya, M.Pd',
    },
  });
}
