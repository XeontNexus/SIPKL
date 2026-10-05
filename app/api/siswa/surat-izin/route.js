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
  {
    id: '2',
    jenisSurat: 'IZIN_TIDAK_MASUK',
    tanggalMulai: '2026-09-12',
    tanggalSelesai: '2026-09-13',
    alasan: 'Izin sakit demam dan kontrol ke dokter.',
    lampiranUrl: 'https://drive.google.com/file/d/surat-dokter/view',
    status: 'APPROVED',
    catatanAdmin: 'Surat dokter valid. Lekas sembuh.',
    createdAt: '2026-09-12',
  },
];

export async function GET() {
  return NextResponse.json(mockSuratIzin);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { jenisSurat, tanggalMulai, tanggalSelesai, alasan, lampiranUrl } = body;

    const newSurat = {
      id: Date.now().toString(),
      jenisSurat,
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
