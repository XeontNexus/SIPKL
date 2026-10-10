import { NextResponse } from 'next/server';
import { reviewLaporanByGuru } from '@/lib/laporanStore';

export async function POST(request) {
  try {
    const body = await request.json();
    const { laporanId, status, catatan } = body;

    const updated = reviewLaporanByGuru(laporanId, status, catatan);

    return NextResponse.json({
      success: true,
      message: 'Status dan catatan review laporan akhir berhasil disimpan',
      data: updated,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
