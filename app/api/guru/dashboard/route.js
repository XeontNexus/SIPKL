import { NextResponse } from 'next/server';
import { getBimbinganByGuru } from '@/lib/siswaStore';

export async function GET() {
  const bimbingan = getBimbinganByGuru('Drs. H. Hendra Wijaya, M.Pd');

  return NextResponse.json({
    stats: {
      totalSiswa: bimbingan.totalAktif,
      permohonanBaru: bimbingan.totalPending,
      logbookBaru: 2,
      laporanBaru: 2,
      belumDinilai: bimbingan.totalAktif,
    },
  });
}
