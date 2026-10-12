import { NextResponse } from 'next/server';
import {
  getBimbinganByGuru,
  accBimbinganGuru,
  tolakBimbinganGuru,
  putusBimbinganGuru,
  putusPenempatanPKL,
} from '@/lib/siswaStore';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const guruNama = searchParams.get('guruNama') || 'Drs. H. Hendra Wijaya, M.Pd';

    const bimbinganData = getBimbinganByGuru(guruNama);

    return NextResponse.json({
      success: true,
      ...bimbinganData,
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
      action,
      permohonanId,
      siswaId,
      alasan = 'Keputusan guru pembimbing',
      catatan = 'Disetujui oleh Guru Pembimbing',
    } = body;

    // 1. Guru ACC / Menyetujui permohonan bimbingan siswa
    if (action === 'ACC_BIMBINGAN') {
      if (!permohonanId) {
        return NextResponse.json(
          { success: false, error: 'ID Permohonan bimbingan wajib disertakan.' },
          { status: 400 }
        );
      }
      const result = accBimbinganGuru(permohonanId, catatan);
      return NextResponse.json({
        success: true,
        message: 'Permohonan bimbingan siswa berhasil di-ACC! Siswa resmi masuk ke Daftar Siswa Bimbingan Aktif Anda.',
        data: result,
      });
    }

    // 2. Guru Menolak permohonan bimbingan siswa
    if (action === 'TOLAK_BIMBINGAN') {
      if (!permohonanId) {
        return NextResponse.json(
          { success: false, error: 'ID Permohonan bimbingan wajib disertakan.' },
          { status: 400 }
        );
      }
      const result = tolakBimbinganGuru(permohonanId, alasan);
      return NextResponse.json({
        success: true,
        message: 'Permohonan bimbingan siswa telah ditolak.',
        data: result,
      });
    }

    // 3. Guru Melepas / Memutus status bimbingan siswa
    if (action === 'PUTUS_BIMBINGAN') {
      const targetSiswaId = siswaId || 'siswa-1';
      const result = putusBimbinganGuru(targetSiswaId, alasan);
      return NextResponse.json({
        success: true,
        message: 'Siswa berhasil dilepas dari daftar bimbingan aktif.',
        data: result,
      });
    }

    // 4. Guru Memutus Penempatan PKL Siswa di Mitra
    if (action === 'PUTUS_PKL') {
      const targetSiswaId = siswaId || 'siswa-1';
      const result = putusPenempatanPKL(targetSiswaId, 'GURU_PEMBIMBING', alasan);
      return NextResponse.json({
        success: true,
        message: 'Penempatan PKL siswa berhasil diputus/dibatalkan. Siswa dapat mendaftar kembali ke mitra lain.',
        data: result,
      });
    }

    return NextResponse.json({ success: false, error: 'Aksi tidak valid.' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
