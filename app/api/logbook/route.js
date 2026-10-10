import { NextResponse } from 'next/server';
import { getLogbooks, addLogbook } from '@/lib/logbookStore';

export async function GET() {
  try {
    // For demo/session student 'siswa-1' (Ahmad Fauzi)
    const data = getLogbooks({ siswaId: 'siswa-1' });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { mingguKe, bulan, kegiatan, hasil, kendala, status } = body;

    if (!mingguKe || !bulan || !kegiatan) {
      return NextResponse.json(
        { error: 'Minggu ke-, bulan, dan kegiatan wajib diisi' },
        { status: 400 }
      );
    }

    const newLogbook = addLogbook({
      siswaId: 'siswa-1',
      namaSiswa: 'Ahmad Fauzi',
      jurusan: 'TKJ',
      mingguKe,
      bulan,
      kegiatan,
      hasil,
      kendala,
      status: status || 'SUBMITTED',
    });

    return NextResponse.json({ success: true, data: newLogbook }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
