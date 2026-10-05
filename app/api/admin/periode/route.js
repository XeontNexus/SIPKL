import { NextResponse } from 'next/server';

let mockPeriode = [
  {
    id: '1',
    nama: 'PKL Gelombang 1 (Semester Ganjil)',
    tahunAjaran: '2026/2027',
    tanggalMulai: '2026-07-15',
    tanggalSelesai: '2026-10-15',
    status: 'AKTIF',
    totalSiswa: 142,
    totalMitra: 38,
    keterangan: 'Periode utama magang industri siswa kelas XII',
  },
  {
    id: '2',
    nama: 'PKL Gelombang 2 (Semester Genap)',
    tahunAjaran: '2026/2027',
    tanggalMulai: '2027-01-10',
    tanggalSelesai: '2027-04-10',
    status: 'DRAFT',
    totalSiswa: 110,
    totalMitra: 25,
    keterangan: 'Pendaftaran gelombang 2 dibuka bulan Desember',
  },
];

export async function GET() {
  return NextResponse.json(mockPeriode);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newItem = {
      id: Date.now().toString(),
      ...body,
      totalSiswa: 0,
      totalMitra: 0,
    };
    mockPeriode.push(newItem);
    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
