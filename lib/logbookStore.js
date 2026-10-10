// In-Memory Shared Store for PKL Logbooks

let globalLogbooks = globalThis.__sipklLogbooks || [
  {
    id: '1',
    siswaId: 'siswa-1',
    namaSiswa: 'Ahmad Fauzi',
    jurusan: 'TKJ',
    mingguKe: 1,
    bulan: 'Oktober',
    kegiatan: 'Melakukan instalasi sistem operasi Linux Server pada mesin pengujian kantor, konfigurasi IP address statis, dan setting router gateway Mikrotik.',
    hasil: 'Server Ubuntu 24.04 LTS berjalan optimal dan dapat diakses dari jaringan lokal kantor.',
    kendala: 'Kabel UTP sempat bermasalah pada crimping pin 3.',
    fotoUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&auto=format&fit=crop&q=60',
    status: 'REVIEWED',
    catatanGuru: 'Bagus sekali Ahmad, dokumentasi instalasinya sangat rapi dan sistematis.',
    createdAt: '2026-10-05T10:00:00Z',
  },
  {
    id: '2',
    siswaId: 'siswa-2',
    namaSiswa: 'Siti Rahmawati',
    jurusan: 'RPL',
    mingguKe: 1,
    bulan: 'Oktober',
    kegiatan: 'Membuat modul autentikasi NextAuth, mendesain tampilan dashboard responsif menggunakan CSS modern dan integrasi API route.',
    hasil: 'Fitur login multi-role berhasil diuji coba.',
    kendala: 'Tidak ada kendala berarti.',
    fotoUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&auto=format&fit=crop&q=60',
    status: 'REVIEWED',
    catatanGuru: 'Bagus sekali Siti, lanjutkan pengerjaan modul penilaian!',
    createdAt: '2026-10-06T11:00:00Z',
  },
  {
    id: '3',
    siswaId: 'siswa-3',
    namaSiswa: 'Budi Santoso',
    jurusan: 'TKJ',
    mingguKe: 1,
    bulan: 'Oktober',
    kegiatan: 'Membantu maintenance PC workstation di ruang akuntansi dan crimping kabel LAN baru.',
    hasil: '3 PC kantor normal kembali.',
    kendala: 'Persediaan konektor RJ45 sempat habis.',
    fotoUrl: '',
    status: 'SUBMITTED',
    catatanGuru: '',
    createdAt: '2026-10-07T09:30:00Z',
  },
];

globalThis.__sipklLogbooks = globalLogbooks;

export function getLogbooks(filter = {}) {
  let list = [...globalLogbooks];
  if (filter.siswaId) {
    list = list.filter((lb) => lb.siswaId === filter.siswaId);
  }
  return list;
}

export function addLogbook(entry) {
  const newLogbook = {
    id: Date.now().toString(),
    siswaId: entry.siswaId || 'siswa-1',
    namaSiswa: entry.namaSiswa || 'Ahmad Fauzi',
    jurusan: entry.jurusan || 'TKJ',
    mingguKe: Number(entry.mingguKe) || 1,
    bulan: entry.bulan || 'Oktober',
    kegiatan: entry.kegiatan || '',
    hasil: entry.hasil || '',
    kendala: entry.kendala || '',
    fotoUrl: entry.fotoUrl || '',
    status: entry.status || 'SUBMITTED',
    catatanGuru: '',
    createdAt: new Date().toISOString(),
  };
  globalLogbooks.unshift(newLogbook);
  return newLogbook;
}

export function updateLogbookReview(id, catatan, status = 'REVIEWED') {
  const item = globalLogbooks.find((lb) => lb.id === id);
  if (item) {
    item.catatanGuru = catatan;
    item.status = status;
    return item;
  }
  return null;
}
