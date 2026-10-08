import { NextResponse } from 'next/server';
import {
  getSiswaProfile,
  getAvailableMitraList,
  joinMitra,
  leaveMitra,
  acceptMitraInvitation,
  checkSiswaPrerequisite,
} from '@/lib/siswaStore';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const siswaId = searchParams.get('siswaId') || 'siswa-1';

    const siswa = getSiswaProfile(siswaId);
    const mitraList = getAvailableMitraList();
    const prerequisite = checkSiswaPrerequisite(siswaId);

    return NextResponse.json({
      success: true,
      mitraList,
      siswa,
      prerequisite,
      undanganList: siswa.undanganList || [],
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, siswaId = 'siswa-1', mitraId, invitationId } = body;

    if (action === 'JOIN') {
      if (!mitraId) {
        return NextResponse.json({ success: false, error: 'Mitra ID wajib dipilih.' }, { status: 400 });
      }
      const result = joinMitra(siswaId, mitraId);
      return NextResponse.json({
        success: true,
        message: `Selamat! Anda berhasil bergabung ke ${result.mitra.nama}.`,
        data: result,
      });
    }

    if (action === 'LEAVE') {
      const result = leaveMitra(siswaId);
      return NextResponse.json({
        success: true,
        message: 'Status kemitraan PKL Anda telah direset. Silakan pilih tempat PKL baru.',
        data: result,
      });
    }

    if (action === 'ACCEPT_INVITE') {
      if (!invitationId) {
        return NextResponse.json({ success: false, error: 'ID Undangan wajib disertakan.' }, { status: 400 });
      }
      const result = acceptMitraInvitation(siswaId, invitationId);
      return NextResponse.json({
        success: true,
        message: `Undangan diterima! Anda resmi bergabung di ${result.mitra.nama}.`,
        data: result,
      });
    }

    return NextResponse.json({ success: false, error: 'Aksi tidak valid.' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
