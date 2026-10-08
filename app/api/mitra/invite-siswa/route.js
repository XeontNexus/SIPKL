import { NextResponse } from 'next/server';
import { inviteSiswaByUniqueId } from '@/lib/siswaStore';

export async function POST(request) {
  try {
    const body = await request.json();
    const { idUnik, mitraNama = 'PT Telkom Indonesia Witel Riau', mitraId = 'mitra-1', bidangUsaha = 'Telekomunikasi & Jaringan', pesan } = body;

    if (!idUnik) {
      return NextResponse.json(
        { success: false, error: 'Nomor ID Unik Siswa wajib diisi.' },
        { status: 400 }
      );
    }

    const result = inviteSiswaByUniqueId(idUnik, {
      mitraNama,
      mitraId,
      bidangUsaha,
      pesan,
    });

    return NextResponse.json({
      success: true,
      message: `Undangan berhasil dikirimkan ke siswa ${result.siswa.nama} (${result.siswa.kelas})!`,
      data: result,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
