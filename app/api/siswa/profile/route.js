import { NextResponse } from 'next/server';
import { getSiswaProfile, updateSiswaBiodata, checkSiswaPrerequisite } from '@/lib/siswaStore';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const siswaId = searchParams.get('siswaId') || 'siswa-1';

    const profile = getSiswaProfile(siswaId);
    const prerequisite = checkSiswaPrerequisite(siswaId);

    return NextResponse.json({
      success: true,
      data: profile,
      prerequisite,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      siswaId = 'siswa-1',
      nama,
      jurusan,
      kelas,
      tanggalLahir,
      nisn,
      noHp,
      alamat,
    } = body;

    const updated = updateSiswaBiodata(siswaId, {
      ...(nama && { nama }),
      ...(jurusan && { jurusan }),
      ...(kelas && { kelas }),
      ...(tanggalLahir && { tanggalLahir }),
      ...(nisn && { nisn }),
      ...(noHp !== undefined && { noHp }),
      ...(alamat !== undefined && { alamat }),
    });

    const prerequisite = checkSiswaPrerequisite(siswaId);

    return NextResponse.json({
      success: true,
      message: 'Biodata profil siswa berhasil disimpan!',
      data: updated,
      prerequisite,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  return POST(request);
}
