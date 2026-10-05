import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

let mockLaporan = {
  id: '1',
  judul: 'Rancang Bangun Jaringan LAN dan Konfigurasi Routing Mikrotik di PT Telkom',
  fileUrl: 'https://drive.google.com/file/d/1A2B3C4D5E/view',
  ringkasan: 'Laporan merangkum seluruh kegiatan magang selama 3 bulan, berfokus pada instalasi kabel UTP, terminasi patch panel, serta konfigurasi mikrotik router gateway.',
  status: 'SUBMITTED',
  catatanGuru: 'Sudah cukup baik, mohon lampirkan sertifikat pengujian bandwidth pada bab III.',
  createdAt: new Date().toISOString(),
};

export async function GET() {
  return NextResponse.json(mockLaporan);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { judul, linkFile, abstrak } = body;

    mockLaporan = {
      ...mockLaporan,
      judul,
      fileUrl: linkFile,
      ringkasan: abstrak,
      status: 'SUBMITTED',
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: mockLaporan });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
