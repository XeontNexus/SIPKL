import { NextResponse } from 'next/server';
import {
  getPendaftarByMitra,
  accPendaftaranMitra,
  tolakPendaftaranMitra,
} from '@/lib/siswaStore';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const mitraId = searchParams.get('mitraId') || 'mitra-1';

    const pendaftarList = getPendaftarByMitra(mitraId);

    return NextResponse.json({
      success: true,
      data: pendaftarList,
      total: pendaftarList.length,
      menungguACC: pendaftarList.filter((p) => p.status === 'MENUNGGU_ACC').length,
      disetujui: pendaftarList.filter((p) => p.status === 'DISETUJUI').length,
      ditolak: pendaftarList.filter((p) => p.status === 'DITOLAK').length,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, pendaftaranId, catatanMitra } = body;

    if (!pendaftaranId) {
      return NextResponse.json({ success: false, error: 'ID Pendaftaran wajib disertakan.' }, { status: 400 });
    }

    if (action === 'ACC' || action === 'APPROVE') {
      const result = accPendaftaranMitra(pendaftaranId, catatanMitra || 'Disetujui oleh pembimbing mitra.');
      return NextResponse.json({
        success: true,
        message: `Siswa ${result.siswa.nama} berhasil DI-ACC! Akses presensi siswa tersebut kini telah aktif.`,
        data: result,
      });
    }

    if (action === 'TOLAK' || action === 'REJECT') {
      const result = tolakPendaftaranMitra(pendaftaranId, catatanMitra || 'Kuota magang telah penuh.');
      return NextResponse.json({
        success: true,
        message: `Permohonan pendaftaran ${result.siswa.nama} telah ditolak.`,
        data: result,
      });
    }

    return NextResponse.json({ success: false, error: 'Aksi tidak valid.' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
