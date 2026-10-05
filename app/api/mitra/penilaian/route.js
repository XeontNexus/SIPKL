import { NextResponse } from 'next/server';

let mockPenilaianMitra = [
  {
    id: '1',
    nama: 'Ahmad Fauzi',
    nisn: '0051234567',
    jurusan: 'Teknik Komputer dan Jaringan',
    nilaiMitra: {
      disiplin: 88,
      keterampilan: 90,
      kerjasama: 85,
      inisiatif: 87,
      rataRata: 87.5,
      catatan: 'Siswa sangat teliti dan cepat beradaptasi dengan server perusahaan.',
      status: 'SUDAH',
    },
  },
  {
    id: '2',
    nama: 'Siti Rahmawati',
    nisn: '0057654321',
    jurusan: 'Rekayasa Perangkat Lunak',
    nilaiMitra: {
      disiplin: 92,
      keterampilan: 94,
      kerjasama: 90,
      inisiatif: 91,
      rataRata: 91.8,
      catatan: 'Mampu menyelesaikan task frontend dashboard tepat waktu.',
      status: 'SUDAH',
    },
  },
  {
    id: '3',
    nama: 'Budi Santoso',
    nisn: '0059876543',
    jurusan: 'Teknik Komputer dan Jaringan',
    nilaiMitra: null,
  },
  {
    id: '4',
    nama: 'Dewi Lestari',
    nisn: '0053456789',
    jurusan: 'Multimedia / DKV',
    nilaiMitra: null,
  },
];

export async function GET() {
  return NextResponse.json(mockPenilaianMitra);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { siswaId, disiplin, keterampilan, kerjasama, inisiatif, rataRata, catatan } = body;

    const idx = mockPenilaianMitra.findIndex(s => s.id === siswaId);
    if (idx !== -1) {
      mockPenilaianMitra[idx].nilaiMitra = {
        disiplin,
        keterampilan,
        kerjasama,
        inisiatif,
        rataRata,
        catatan,
        status: 'SUDAH',
        updatedAt: new Date().toISOString(),
      };
    }

    return NextResponse.json({ success: true, data: mockPenilaianMitra[idx] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
