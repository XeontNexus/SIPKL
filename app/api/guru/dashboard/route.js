import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    stats: {
      totalSiswa: 14,
      logbookBaru: 2,
      laporanBaru: 2,
      belumDinilai: 3,
    },
  });
}
