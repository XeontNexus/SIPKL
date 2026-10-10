import { NextResponse } from 'next/server';
import { getLaporanBySiswa, saveLaporanBySiswa } from '@/lib/laporanStore';

export async function GET() {
  try {
    const data = getLaporanBySiswa('siswa-1');
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const updated = saveLaporanBySiswa('siswa-1', body);

    return NextResponse.json({
      success: true,
      message: 'Laporan akhir berhasil diunggah dan dikirim ke guru pendamping!',
      data: updated,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
