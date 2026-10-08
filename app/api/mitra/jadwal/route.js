import { NextResponse } from 'next/server';
import { getJadwalMitra, updateJadwalMitra } from '@/lib/jadwalMitra';

export async function GET() {
  try {
    const jadwal = getJadwalMitra();
    return NextResponse.json({
      success: true,
      data: jadwal,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      jamMasuk,
      jamPulang,
      toleransiMenit,
      hariKerja,
      catatan,
      mitraNama,
    } = body;

    if (!jamMasuk || !jamPulang) {
      return NextResponse.json(
        { success: false, error: 'Jam masuk dan jam pulang wajib diisi.' },
        { status: 400 }
      );
    }

    const updated = updateJadwalMitra({
      ...(jamMasuk && { jamMasuk }),
      ...(jamPulang && { jamPulang }),
      ...(toleransiMenit !== undefined && { toleransiMenit: Number(toleransiMenit) }),
      ...(hariKerja && { hariKerja }),
      ...(catatan !== undefined && { catatan }),
      ...(mitraNama && { mitraNama }),
    });

    return NextResponse.json({
      success: true,
      message: 'Jadwal kerja presensi mitra berhasil diperbarui',
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  return POST(request);
}
