import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { siswaId, nilaiSikap, nilaiKeterampilan, nilaiLaporan, nilaiAkhir, catatan } = body;

    return NextResponse.json({
      success: true,
      message: 'Nilai dari Guru Pembimbing berhasil disimpan',
      data: { siswaId, nilaiSikap, nilaiKeterampilan, nilaiLaporan, nilaiAkhir, catatan },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
