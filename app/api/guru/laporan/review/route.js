import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { laporanId, status, catatan } = body;

    return NextResponse.json({
      success: true,
      message: 'Status laporan akhir berhasil diperbarui',
      data: { laporanId, status, catatan },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
