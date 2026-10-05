import { NextResponse } from 'next/server';

let mockMitraPresensi = [
  { id: '1', nama: 'Ahmad Fauzi', nisn: '0051234567', tanggal: new Date().toISOString().split('T')[0], jamMasuk: '07:45', jamPulang: '16:05', status: 'HADIR', tipe: 'QR_SCAN', keterangan: 'Tepat Waktu' },
  { id: '2', nama: 'Siti Rahmawati', nisn: '0057654321', tanggal: new Date().toISOString().split('T')[0], jamMasuk: '07:52', jamPulang: '16:00', status: 'HADIR', tipe: 'QR_SCAN', keterangan: 'Tepat Waktu' },
  { id: '3', nama: 'Budi Santoso', nisn: '0059876543', tanggal: new Date().toISOString().split('T')[0], jamMasuk: '08:04', jamPulang: '-', status: 'HADIR', tipe: 'QR_SCAN', keterangan: 'Terlambat 4 menit' },
  { id: '4', nama: 'Dewi Lestari', nisn: '0053456789', tanggal: new Date().toISOString().split('T')[0], jamMasuk: '-', jamPulang: '-', status: 'IZIN', tipe: 'SURAT', keterangan: 'Izin ke Puskesmas' },
];

export async function GET(request) {
  return NextResponse.json(mockMitraPresensi);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newRecord = {
      id: Date.now().toString(),
      tanggal: new Date().toISOString().split('T')[0],
      jamMasuk: `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`,
      jamPulang: '-',
      tipe: 'MANUAL',
      ...body,
    };
    mockMitraPresensi.unshift(newRecord);
    return NextResponse.json({ success: true, data: newRecord }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
