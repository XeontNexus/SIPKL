import { NextResponse } from 'next/server';
import {
  getSiswaProfile,
  getAvailableMitraList,
  daftarMitra,
  batalkanPendaftaran,
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

    // 1. Siswa mendaftar ke Mitra (Menunggu ACC)
    if (action === 'DAFTAR' || action === 'JOIN') {
      if (!mitraId) {
        return NextResponse.json({ success: false, error: 'Mitra ID wajib dipilih.' }, { status: 400 });
      }
      const result = daftarMitra(siswaId, mitraId);
      return NextResponse.json({
        success: true,
        message: `Permohonan pendaftaran magang di ${result.mitra.nama} telah dikirim! Menunggu persetujuan (ACC) dari mitra.`,
        data: result,
      });
    }

    // 2. Siswa membatalkan pendaftaran yang berstatus MENUNGGU_ACC
    if (action === 'BATALKAN_PENDAFTARAN') {
      const result = batalkanPendaftaran(siswaId);
      return NextResponse.json({
        success: true,
        message: 'Permohonan pendaftaran berhasil dibatalkan. Anda dapat memilih mitra lain.',
        data: result,
      });
    }

    // 3. Siswa keluar / reset mitra
    if (action === 'LEAVE') {
      const result = leaveMitra(siswaId);
      return NextResponse.json({
        success: true,
        message: 'Status kemitraan PKL Anda telah direset. Silakan ajukan pendaftaran baru.',
        data: result,
      });
    }

    // 4. Siswa menerima undangan dari mitra (Instant ACC)
    if (action === 'ACCEPT_INVITE') {
      if (!invitationId) {
        return NextResponse.json({ success: false, error: 'ID Undangan wajib disertakan.' }, { status: 400 });
      }
      const result = acceptMitraInvitation(siswaId, invitationId);
      return NextResponse.json({
        success: true,
        message: `Undangan berhasil diterima! Anda resmi bergabung di ${result.mitra.nama}. Akses presensi dan logbook kini aktif.`,
        data: result,
      });
    }

    return NextResponse.json({ success: false, error: 'Aksi tidak valid.' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
