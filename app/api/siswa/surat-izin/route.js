import { NextResponse } from 'next/server';

let mockSuratIzin = [
  {
    id: '1',
    jenisSurat: 'IZIN_MAGANG',
    tanggalMulai: '2026-07-15',
    tanggalSelesai: '2026-10-15',
    alasan: 'Permohonan surat pengantar tugas PKL resmi dari sekolah ke PT Telkom Riau.',
    lampiranUrl: 'https://drive.google.com/file/d/surat-izin-magang/view',
    status: 'APPROVED',
    catatanAdmin: 'Disetujui. Silakan ambil lembar cap basah di ruang tata usaha jika dibutuhkan.',
    createdAt: '2026-07-10',
  },
];

export async function GET() {
  return NextResponse.json(mockSuratIzin);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { tanggalMulai, tanggalSelesai, alasan, lampiranUrl } = body;

    const newSurat = {
      id: Date.now().toString(),
      jenisSurat: 'IZIN_MAGANG',
      tanggalMulai,
      tanggalSelesai,
      alasan,
      lampiranUrl: lampiranUrl || '',
      status: 'PENDING',
      catatanAdmin: '',
      createdAt: new Date().toISOString(),
    };

    mockSuratIzin.unshift(newSurat);
    return NextResponse.json({ success: true, data: newSurat }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
