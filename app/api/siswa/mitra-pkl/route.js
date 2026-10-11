import { NextResponse } from 'next/server';
import {
  getSiswaProfile,
  getAvailableMitraList,
  daftarMitra,
  batalkanPendaftaran,
  konfirmasiBersediaSiswa,
  putusPenempatanPKL,
  acceptMitraInvitation,
  checkSiswaPrerequisite,
  getPendaftaranBySiswa,
} from '@/lib/siswaStore';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const siswaId = searchParams.get('siswaId') || 'siswa-1';

    const siswa = getSiswaProfile(siswaId);
    const mitraList = getAvailableMitraList();
    const prerequisite = checkSiswaPrerequisite(siswaId);
    const pendaftaranList = getPendaftaranBySiswa(siswaId);

    return NextResponse.json({
      success: true,
      mitraList,
      siswa,
      pendaftaranList,
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
    const { action, siswaId = 'siswa-1', mitraId, pendaftaranId, invitationId, initiator = 'GURU', alasan = '' } = body;

    // 1. Siswa mendaftar ke Mitra (bisa beberapa mitra)
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

    // 2. Siswa konfirmasi bersedia setelah di-ACC mitra (Keduanya bersedia -> resmi ketrima di salah satu saja)
    if (action === 'KONFIRMASI_BERSEDIA') {
      if (!pendaftaranId) {
        return NextResponse.json({ success: false, error: 'ID Pendaftaran wajib disertakan.' }, { status: 400 });
      }
      const result = konfirmasiBersediaSiswa(siswaId, pendaftaranId);
      return NextResponse.json({
        success: true,
        message: `Selamat! Anda dan ${result.pendaftaran.mitraNama} telah saling menyetujui. Status Anda kini resmi SEDANG PKL.`,
        data: result,
      });
    }

    // 3. Siswa membatalkan pendaftaran
    if (action === 'BATALKAN_PENDAFTARAN' || action === 'BATALKAN') {
      const result = batalkanPendaftaran(siswaId, pendaftaranId);
      return NextResponse.json({
        success: true,
        message: 'Permohonan pendaftaran berhasil dibatalkan.',
        data: result,
      });
    }

    // 4. Pembimbing/Mitra memutus atau membatalkan penempatan PKL
    if (action === 'PUTUS_PENEMPATAN') {
      const result = putusPenempatanPKL(siswaId, initiator, alasan || 'Keputusan pembimbing');
      return NextResponse.json({
        success: true,
        message: `Penempatan PKL berhasil diputus oleh ${initiator}. Siswa dapat mendaftar kembali ke mitra lain.`,
        data: result,
      });
    }

    // 5. Siswa menerima undangan dari mitra (Instant ACC)
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
