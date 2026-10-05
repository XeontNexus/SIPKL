import { NextResponse } from 'next/server';

let mockNilai = {
  nilaiMitra: {
    disiplin: 88,
    keterampilan: 90,
    kerjasama: 85,
    inisiatif: 87,
    rataRata: 87.5,
    catatan: 'Siswa aktif, cepat memahami arahan kerja dan memiliki dedikasi tinggi.',
    status: 'SUDAH_DINILAI',
  },
  nilaiGuru: {
    logbook: 86,
    laporan: 88,
    presentasi: 85,
    rataRata: 86.3,
    catatan: 'Laporan tersusun rapi sesuai format pedoman SMKN 1 Perhentian Raja.',
    status: 'SUDAH_DINILAI',
  },
};

export async function GET() {
  return NextResponse.json(mockNilai);
}
