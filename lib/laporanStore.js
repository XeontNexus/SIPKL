// Synchronized Laporan Store between Siswa and Guru Pendamping
import { addNotification } from './notificationStore';

let globalLaporanStore = globalThis.__sipklLaporanStore || {
  'siswa-1': {
    id: 'lap-1',
    siswaId: 'siswa-1',
    namaSiswa: 'Ahmad Fauzi',
    nisn: '0051234567',
    jurusan: 'TKJ',
    kelasJurusan: 'XII TKJ 1 - Teknik Komputer dan Jaringan',
    guruPendamping: 'Drs. H. Hendra Wijaya, M.Pd',
    mitra: 'PT Telkom Indonesia Witel Riau',
    judul: 'Rancang Bangun Jaringan LAN dan Konfigurasi Routing Mikrotik di PT Telkom',
    fileName: 'Laporan_PKL_Ahmad_Fauzi_TKJ.pdf',
    fileSize: '3.8 MB',
    fileUrl: '',
    fileData: '',
    ringkasan: 'Laporan merangkum seluruh kegiatan magang selama 3 bulan, berfokus pada instalasi kabel UTP, terminasi patch panel, serta konfigurasi mikrotik router gateway.',
    status: 'REVIEWED',
    catatanGuru: 'Bab III pada sub-bab konfigurasi routing mikrotik tolong tambahkan skema topologi jaringan dan foto pengujian bandwidth speedtest.',
    tanggalSubmit: '2026-10-04',
    revisiKe: 1,
    riwayatRevisi: [
      {
        tanggal: '2026-10-04',
        fileName: 'Laporan_PKL_Ahmad_Fauzi_TKJ.pdf',
        catatanGuru: 'Bab III pada sub-bab konfigurasi routing mikrotik tolong tambahkan skema topologi jaringan dan foto pengujian bandwidth speedtest.',
        status: 'REVIEWED',
      },
    ],
  },
  'siswa-2': {
    id: 'lap-2',
    siswaId: 'siswa-2',
    namaSiswa: 'Siti Rahmawati',
    nisn: '0057654321',
    jurusan: 'RPL',
    kelasJurusan: 'XII RPL 1 - Rekayasa Perangkat Lunak',
    guruPendamping: 'Dra. Hj. Nurhidayah, M.Kom',
    mitra: 'CV Tech Inovasi Digital',
    judul: 'Pengembangan Sistem Informasi Presensi Berbasis Web di PT Mitra Solusi',
    fileName: 'Laporan_PKL_Siti_Rahmawati_RPL.pdf',
    fileSize: '4.2 MB',
    fileUrl: '',
    fileData: '',
    ringkasan: 'Membahas perancangan arsitektur database PostgreSQL, REST API Next.js, dan testing performa antarmuka pengguna.',
    status: 'APPROVED',
    catatanGuru: 'Sistematika penulisan bab 1-4 sangat baik dan rapi. Laporan disetujui untuk maju ke sidang evaluasi.',
    tanggalSubmit: '2026-10-02',
    revisiKe: 2,
  },
  'siswa-3': {
    id: 'lap-3',
    siswaId: 'siswa-3',
    namaSiswa: 'Budi Santoso',
    nisn: '0059876543',
    jurusan: 'TKJ',
    kelasJurusan: 'XII TKJ 2 - Teknik Komputer dan Jaringan',
    guruPendamping: 'Drs. H. Hendra Wijaya, M.Pd',
    mitra: 'PT Riau Cyber Solution',
    judul: 'Instalasi dan Pemeliharaan Jaringan Wireless Kantor Cabang',
    fileName: 'Laporan_PKL_Budi_Santoso_TKJ.pdf',
    fileSize: '2.9 MB',
    fileUrl: '',
    fileData: '',
    ringkasan: 'Laporan berisi dokumentasi setting Access Point UniFi, cabling CAT6, dan bandwidth management.',
    status: 'SUBMITTED',
    catatanGuru: '',
    tanggalSubmit: '2026-10-05',
    revisiKe: 1,
  },
};

globalThis.__sipklLaporanStore = globalLaporanStore;

export function getLaporanBySiswa(siswaId = 'siswa-1') {
  return globalLaporanStore[siswaId] || null;
}

export function saveLaporanBySiswa(siswaId = 'siswa-1', data = {}) {
  const current = globalLaporanStore[siswaId] || {
    id: `lap-${Date.now()}`,
    siswaId,
    namaSiswa: 'Ahmad Fauzi',
    nisn: '0051234567',
    jurusan: 'TKJ',
    kelasJurusan: 'XII TKJ 1 - Teknik Komputer dan Jaringan',
    guruPendamping: 'Drs. H. Hendra Wijaya, M.Pd',
    mitra: 'PT Telkom Indonesia Witel Riau',
    revisiKe: 0,
  };

  const isRevisi = current.status === 'REVIEWED';
  const revisiKe = isRevisi ? (current.revisiKe || 1) + 1 : current.revisiKe || 1;

  const updated = {
    ...current,
    judul: data.judul || current.judul,
    ringkasan: data.abstrak || data.ringkasan || current.ringkasan,
    fileName: data.fileName || current.fileName,
    fileSize: data.fileSize || current.fileSize,
    fileUrl: data.fileUrl || current.fileUrl,
    fileData: data.fileData || current.fileData,
    status: 'SUBMITTED', // Return to SUBMITTED so guru can review the newly uploaded version
    tanggalSubmit: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString(),
    revisiKe,
  };

  // If there was an existing review note, archive it in riwayatRevisi
  if (!updated.riwayatRevisi) updated.riwayatRevisi = [];
  if (current.catatanGuru) {
    updated.riwayatRevisi.push({
      tanggal: new Date().toISOString().split('T')[0],
      fileName: current.fileName,
      catatanGuru: current.catatanGuru,
      status: current.status,
    });
  }

  globalLaporanStore[siswaId] = updated;

  // Add notification to Guru Pendamping
  addNotification({
    role: 'guru',
    title: isRevisi ? 'Revisi Laporan Akhir Masuk' : 'Laporan Akhir Siswa Masuk',
    message: `${updated.namaSiswa} telah ${isRevisi ? 'mengirim revisi' : 'mengunggah berkas'} laporan akhir (${updated.fileName}) untuk diperiksa.`,
    type: 'LAPORAN',
    link: '/dashboard/guru/laporan',
  });

  return updated;
}

export function getAllLaporanGuru() {
  return Object.values(globalLaporanStore);
}

export function reviewLaporanByGuru(laporanId, status = 'APPROVED', catatan = '') {
  let target = null;
  for (const key of Object.keys(globalLaporanStore)) {
    if (globalLaporanStore[key].id === laporanId || key === laporanId) {
      target = globalLaporanStore[key];
      break;
    }
  }

  if (target) {
    target.status = status;
    target.catatanGuru = catatan;
    target.reviewedAt = new Date().toISOString();

    // Add notification to Student
    addNotification({
      role: 'siswa',
      userId: target.siswaId,
      title: status === 'APPROVED' ? 'Laporan Akhir Disetujui (ACC)!' : 'Catatan Revisi Laporan Akhir',
      message:
        status === 'APPROVED'
          ? `Selamat! Laporan akhir Anda telah disetujui (ACC) oleh guru pendamping.`
          : `Guru pendamping telah memberikan catatan feedback pada laporan akhir Anda: "${catatan.slice(0, 80)}..."`,
      type: status === 'APPROVED' ? 'ACC' : 'WARNING',
      link: '/dashboard/siswa/laporan',
    });

    return target;
  }

  return null;
}
