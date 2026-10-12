// In-Memory Synchronized Store for Siswa PKL, Biodata, & Mitra Enrollment with ACC Flow
import { addNotification } from './notificationStore';

let globalSiswaStore = globalThis.__sipklSiswaStore || {
  // Default demo student profile
  'siswa-1': {
    id: 'siswa-1',
    idUnik: 'PKL-SISWA-00512', // Unique ID created since account creation
    nama: 'Ahmad Fauzi',
    nisn: '0051234567',
    kelas: 'XII TKJ 1',
    jurusan: 'Teknik Komputer dan Jaringan',
    kelasJurusan: 'XII TKJ 1 - Teknik Komputer dan Jaringan',
    guruPembimbing: 'Drs. H. Hendra Wijaya, M.Pd',
    statusBimbinganGuru: 'MENUNGGU_ACC', // Menunggu persetujuan / ACC dari Guru Pembimbing
    catatanGuruBimbingan: '',
    tanggalMulaiMagang: '2026-07-01',
    tanggalSelesaiMagang: '2026-10-31',
    tanggalLahir: '2008-05-14',
    noHp: '081234567890',
    alamat: 'Jl. Raya Perhentian Raja No. 45, Kec. Perhentian Raja, Kampar',
    // Biodata status
    biodataLengkap: true,
    // Mitra enrollment status: 'BELUM_GABUNG' | 'MENUNGGU_ACC' | 'SEDANG_PKL' | 'SELESAI_PKL'
    mitraId: 'mitra-1',
    mitraNama: 'PT Telkom Indonesia Witel Riau',
    mitraBidang: 'Telekomunikasi & Jaringan Fiber Optik',
    pembimbingMitra: 'Bpk. Ridwan Kurniawan, S.T.',
    statusPKL: 'SEDANG_PKL', // Currently accepted/ACC
    tanggalGabung: '2026-07-01',
    tanggalDaftar: '2026-06-25',
    // Received invitations from Mitras
    undanganList: [
      {
        id: 'inv-1',
        mitraId: 'mitra-3',
        mitraNama: 'PT Riau Media Grafika (Tribun Network)',
        bidangUsaha: 'Multimedia, Jurnalisme & Desain Grafis',
        pesan: 'Halo Ahmad Fauzi! Kami tertarik dengan profil IT & jaringan Anda. Bergabunglah dengan divisi multimedia kami.',
        tanggal: '2026-10-05',
        status: 'PENDING',
      },
    ],
  },
  // List of active industry partners opening PKL spots
  mitraDirectory: [
    {
      id: 'mitra-1',
      nama: 'PT Telkom Indonesia Witel Riau',
      bidang: 'Telekomunikasi & Jaringan Fiber Optik',
      alamat: 'Jl. Jenderal Sudirman No. 199, Kota Pekanbaru',
      kota: 'Pekanbaru',
      kuotaTotal: 10,
      kuotaTerisi: 6,
      jamMasuk: '08:00',
      jamPulang: '16:00',
      hariKerja: 'Senin - Jumat',
      jurusanCocok: ['Teknik Komputer dan Jaringan', 'Rekayasa Perangkat Lunak'],
      fasilitas: ['Uang Saku Magang', 'Sertifikat Industri', 'Bimbingan Mentor Khusus'],
      deskripsi: 'Praktek instalasi fiber optik, konfigurasi router OLT/ONT, serta pemeliharaan infrastruktur jaringan telekomunikasi regional Riau.',
      kontakPerson: 'Bpk. Ridwan Kurniawan (0811-7654-321)',
      statusBuka: true,
    },
    {
      id: 'mitra-2',
      nama: 'Astra Honda Motor Training Center Riau',
      bidang: 'Otomotif & Teknik Sepeda Motor',
      alamat: 'Jl. Tuanku Tambusai No. 88, Pekanbaru',
      kota: 'Pekanbaru',
      kuotaTotal: 8,
      kuotaTerisi: 4,
      jamMasuk: '07:30',
      jamPulang: '16:00',
      hariKerja: 'Senin - Sabtu',
      jurusanCocok: ['Teknik Bisnis Sepeda Motor', 'Teknik Kendaraan Ringan'],
      fasilitas: ['Seragam Bengkel', 'Sertifikat Resmi Astra', 'Pelatihan Standar AHASS'],
      deskripsi: 'Praktek pemeliharaan mesin berkala, injeksi PGM-FI, troubleshooting kelistrikan motor, dan manajemen bengkel resmi.',
      kontakPerson: 'Ibu Maya Hartati (0821-9988-7766)',
      statusBuka: true,
    },
    {
      id: 'mitra-3',
      nama: 'PT Riau Media Grafika (Tribun Network)',
      bidang: 'Multimedia, Jurnalisme & Desain Grafis',
      alamat: 'Jl. KH. Ahmad Dahlan No. 12, Sukajadi, Pekanbaru',
      kota: 'Pekanbaru',
      kuotaTotal: 6,
      kuotaTerisi: 3,
      jamMasuk: '08:30',
      jamPulang: '16:30',
      hariKerja: 'Senin - Jumat',
      jurusanCocok: ['Desain Komunikasi Visual', 'Multimedia', 'Broadcasting'],
      fasilitas: ['Akses Kamera Studio', 'Mentoring Desain', 'Sertifikat Penerbitan'],
      deskripsi: 'Praktek tata letak media cetak & online, editing video konten kreatif, fotografi studio, serta live streaming podcast berita.',
      kontakPerson: 'Bpk. Fajar Ramadhan (0813-2233-4455)',
      statusBuka: true,
    },
    {
      id: 'mitra-4',
      nama: 'Bank Riau Kepri Syariah Kantor Cabang Utama',
      bidang: 'Perbankan Syariah & Akuntansi Keuangan',
      alamat: 'Gedung Menara Dang Merdu, Jl. Jend. Sudirman, Pekanbaru',
      kota: 'Pekanbaru',
      kuotaTotal: 5,
      kuotaTerisi: 2,
      jamMasuk: '07:45',
      jamPulang: '16:30',
      hariKerja: 'Senin - Jumat',
      jurusanCocok: ['Akuntansi dan Keuangan Lembaga', 'Manajemen Perkantoran'],
      fasilitas: ['Ruang Kerja AC', 'Sertifikat Perbankan Syariah', 'Uang Transport'],
      deskripsi: 'Praktek administrasi pembukuan perbankan syariah, verifikasi arsip transaksi keuangan nasabah, dan pelayanan prima customer service.',
      kontakPerson: 'Ibu Annisa Pratiwi (0852-1122-3344)',
      statusBuka: true,
    },
    {
      id: 'mitra-5',
      nama: 'Diskominfo & Persandian Kab. Kampar',
      bidang: 'Pemerintahan, E-Government & Cyber Security',
      alamat: 'Komplek Perkantoran Pemkab Kampar, Jl. Prof. M. Yamin, Bangkinang',
      kota: 'Kampar',
      kuotaTotal: 10,
      kuotaTerisi: 5,
      jamMasuk: '08:00',
      jamPulang: '16:00',
      hariKerja: 'Senin - Jumat',
      jurusanCocok: ['Rekayasa Perangkat Lunak', 'Teknik Komputer dan Jaringan'],
      fasilitas: ['Akses Server Data Center', 'Sertifikat Pemkab', 'Bimbingan ASN'],
      deskripsi: 'Praktek pengelolaan data portal SPBE pemerintah daerah, instalasi jaringan fiber antar OPD, dan pemeliharaan website resmi Kampar.',
      kontakPerson: 'Bpk. Surya Dinata, S.Kom (0812-3344-5566)',
      statusBuka: true,
    },
  ],
  // All registration requests waiting for Mitra ACC or decided
  pendaftaranList: [
    {
      id: 'pend-1',
      siswaId: 'siswa-1',
      idUnik: 'PKL-SISWA-00512',
      namaSiswa: 'Ahmad Fauzi',
      nisn: '0051234567',
      kelas: 'XII TKJ 1',
      jurusan: 'Teknik Komputer dan Jaringan',
      mitraId: 'mitra-1',
      mitraNama: 'PT Telkom Indonesia Witel Riau',
      tanggalDaftar: '2026-06-25',
      status: 'DISETUJUI', // 'MENUNGGU_ACC' | 'DISETUJUI' | 'DITOLAK'
      catatanMitra: 'Lulus seleksi berkas jaringan fiber optik.',
    },
    {
      id: 'pend-2',
      siswaId: 'siswa-demo-2',
      idUnik: 'PKL-SISWA-00789',
      namaSiswa: 'Budi Santoso',
      nisn: '0057891234',
      kelas: 'XII RPL 1',
      jurusan: 'Rekayasa Perangkat Lunak',
      mitraId: 'mitra-1',
      mitraNama: 'PT Telkom Indonesia Witel Riau',
      tanggalDaftar: '2026-10-07',
      status: 'MENUNGGU_ACC',
      catatanMitra: '',
    },
    {
      id: 'pend-3',
      siswaId: 'siswa-demo-3',
      idUnik: 'PKL-SISWA-00881',
      namaSiswa: 'Citra Kirana',
      nisn: '0058814567',
      kelas: 'XII TKJ 2',
      jurusan: 'Teknik Komputer dan Jaringan',
      mitraId: 'mitra-1',
      mitraNama: 'PT Telkom Indonesia Witel Riau',
      tanggalDaftar: '2026-10-08',
      status: 'MENUNGGU_ACC',
      catatanMitra: '',
    },
  ],
};

if (process.env.NODE_ENV !== 'production') {
  globalThis.__sipklSiswaStore = globalSiswaStore;
}

function getStore() {
  const store = globalThis.__sipklSiswaStore || globalSiswaStore;
  if (!store.pendaftaranList || !Array.isArray(store.pendaftaranList) || store.pendaftaranList.length === 0) {
    store.pendaftaranList = [
      {
        id: 'pend-1',
        siswaId: 'siswa-1',
        idUnik: 'PKL-SISWA-00512',
        namaSiswa: 'Ahmad Fauzi',
        nisn: '0051234567',
        kelas: 'XII TKJ 1',
        jurusan: 'Teknik Komputer dan Jaringan',
        mitraId: 'mitra-1',
        mitraNama: 'PT Telkom Indonesia Witel Riau',
        tanggalDaftar: '2026-06-25',
        status: 'DISETUJUI',
        catatanMitra: 'Lulus seleksi berkas jaringan fiber optik.',
      },
      {
        id: 'pend-2',
        siswaId: 'siswa-demo-2',
        idUnik: 'PKL-SISWA-00789',
        namaSiswa: 'Budi Santoso',
        nisn: '0057891234',
        kelas: 'XII RPL 1',
        jurusan: 'Rekayasa Perangkat Lunak',
        mitraId: 'mitra-1',
        mitraNama: 'PT Telkom Indonesia Witel Riau',
        tanggalDaftar: '2026-10-07',
        status: 'MENUNGGU_ACC',
        catatanMitra: '',
      },
      {
        id: 'pend-3',
        siswaId: 'siswa-demo-3',
        idUnik: 'PKL-SISWA-00881',
        namaSiswa: 'Citra Kirana',
        nisn: '0058814567',
        kelas: 'XII TKJ 2',
        jurusan: 'Teknik Komputer dan Jaringan',
        mitraId: 'mitra-1',
        mitraNama: 'PT Telkom Indonesia Witel Riau',
        tanggalDaftar: '2026-10-08',
        status: 'MENUNGGU_ACC',
        catatanMitra: '',
      },
    ];
  }

  // Inisialisasi daftar bimbingan guru jika belum ada
  if (!store.bimbinganList || !Array.isArray(store.bimbinganList) || store.bimbinganList.length === 0) {
    store.bimbinganList = [
      {
        id: 'bim-1',
        siswaId: 'siswa-1',
        idUnik: 'PKL-SISWA-00512',
        namaSiswa: 'Ahmad Fauzi',
        nisn: '0051234567',
        kelas: 'XII TKJ 1',
        jurusan: 'Teknik Komputer dan Jaringan',
        guruNama: 'Drs. H. Hendra Wijaya, M.Pd',
        mitraNama: 'PT Telkom Indonesia Witel Riau',
        statusPKL: 'SEDANG_PKL',
        tanggalPengajuan: '2026-10-11',
        status: 'MENUNGGU_ACC', // Menunggu ACC dari guru pembimbing
        catatanGuru: '',
        noHp: '081234567890',
        email: 'fauzi@siswa.smkn1.sch.id',
      },
      {
        id: 'bim-2',
        siswaId: 'siswa-demo-2',
        idUnik: 'PKL-SISWA-00789',
        namaSiswa: 'Budi Santoso',
        nisn: '0057891234',
        kelas: 'XII RPL 1',
        jurusan: 'Rekayasa Perangkat Lunak',
        guruNama: 'Drs. H. Hendra Wijaya, M.Pd',
        mitraNama: 'PT Telkom Indonesia Witel Riau',
        statusPKL: 'SEDANG_PKL',
        tanggalPengajuan: '2026-10-10',
        status: 'MENUNGGU_ACC', // Menunggu ACC
        catatanGuru: '',
        noHp: '081299887711',
        email: 'budi@siswa.smkn1.sch.id',
      },
      {
        id: 'bim-3',
        siswaId: 'siswa-demo-3',
        idUnik: 'PKL-SISWA-00881',
        namaSiswa: 'Citra Kirana',
        nisn: '0058814567',
        kelas: 'XII TKJ 2',
        jurusan: 'Teknik Komputer dan Jaringan',
        guruNama: 'Drs. H. Hendra Wijaya, M.Pd',
        mitraNama: 'CV Tech Inovasi Digital',
        statusPKL: 'SEDANG_PKL',
        tanggalPengajuan: '2026-10-09',
        status: 'MENUNGGU_ACC', // Menunggu ACC
        catatanGuru: '',
        noHp: '081344556677',
        email: 'citra@siswa.smkn1.sch.id',
      },
      {
        id: 'bim-4',
        siswaId: 'siswa-demo-4',
        idUnik: 'PKL-SISWA-00561',
        namaSiswa: 'Siti Rahmawati',
        nisn: '0057654321',
        kelas: 'XII RPL 1',
        jurusan: 'Rekayasa Perangkat Lunak',
        guruNama: 'Drs. H. Hendra Wijaya, M.Pd',
        mitraNama: 'CV Tech Inovasi Digital',
        statusPKL: 'SEDANG_PKL',
        tanggalPengajuan: '2026-07-01',
        status: 'DISETUJUI', // SUDAH DI-ACC GURU! Langsung masuk list siswa bimbingan aktif
        catatanGuru: 'Disetujui. Siswa aktif dalam bimbingan.',
        noHp: '081277665544',
        email: 'siti@siswa.smkn1.sch.id',
        tanggalDiproses: '2026-07-02',
        nilaiGuru: {
          nilaiSikap: 92,
          nilaiKeterampilan: 94,
          nilaiLaporan: 90,
          nilaiAkhir: 92.0,
          catatan: 'Kemampuan coding dan sistematika laporan sangat baik.',
        },
      },
    ];
  }
  return store;
}


// 1. Get student profile by ID
export function getSiswaProfile(siswaId = 'siswa-1') {
  const store = getStore();
  let siswa = store[siswaId];
  if (!siswa) {
    siswa = {
      id: siswaId,
      idUnik: `PKL-SISWA-${Math.floor(10000 + Math.random() * 90000)}`,
      nama: 'Siswa Baru SMKN 1',
      nisn: '0059999999',
      kelas: 'XII TKJ 1',
      jurusan: 'Teknik Komputer dan Jaringan',
      tanggalLahir: '2008-01-01',
      noHp: '',
      alamat: '',
      biodataLengkap: false,
      mitraId: null,
      mitraNama: null,
      statusPKL: 'BELUM_GABUNG',
      statusBimbinganGuru: 'BELUM_MEMILIH',
      catatanGuruBimbingan: '',
      undanganList: [],
    };
    store[siswaId] = siswa;
  }
  
  // Re-verify biodata completeness
  const isComplete = Boolean(
    siswa.nama &&
    siswa.jurusan &&
    siswa.kelas &&
    siswa.tanggalLahir &&
    siswa.tanggalLahir.length >= 8 &&
    siswa.nisn
  );
  siswa.biodataLengkap = isComplete;

  if (!siswa.guruPembimbing) siswa.guruPembimbing = 'Drs. H. Hendra Wijaya, M.Pd';
  if (!siswa.statusBimbinganGuru) siswa.statusBimbinganGuru = 'MENUNGGU_ACC';
  if (!siswa.kelasJurusan) siswa.kelasJurusan = `${siswa.kelas || 'XII TKJ 1'} - ${siswa.jurusan || 'Teknik Komputer dan Jaringan'}`;
  if (!siswa.tanggalMulaiMagang) siswa.tanggalMulaiMagang = '2026-07-01';
  if (!siswa.tanggalSelesaiMagang) siswa.tanggalSelesaiMagang = '2026-10-31';

  return siswa;
}

// 2. Update student biodata
export function updateSiswaBiodata(siswaId = 'siswa-1', data = {}) {
  const store = getStore();
  const current = getSiswaProfile(siswaId);

  const updated = {
    ...current,
    ...data,
    idUnik: current.idUnik || `PKL-SISWA-${Math.floor(10000 + Math.random() * 90000)}`,
  };

  updated.biodataLengkap = Boolean(
    updated.nama &&
    updated.jurusan &&
    updated.kelas &&
    updated.tanggalLahir &&
    updated.nisn
  );

  // Jika siswa memilih / mengubah nama guru pembimbing
  if (data.guruPembimbing && data.guruPembimbing !== current.guruPembimbing) {
    ajukanBimbinganGuru(siswaId, data.guruPembimbing);
  }

  store[siswaId] = updated;
  return updated;
}

// 3. Get all available Mitras opening slots
export function getAvailableMitraList() {
  const store = getStore();
  return store.mitraDirectory || [];
}

// 4. Student applies to a Mitra (Can apply to multiple Mitras unless already SEDANG_PKL)
export function daftarMitra(siswaId = 'siswa-1', targetMitraId) {
  const store = getStore();
  const siswa = getSiswaProfile(siswaId);

  if (!siswa.biodataLengkap) {
    throw new Error('Wajib melengkapi biodata (Nama, Kelas, Jurusan, Tanggal Lahir) sebelum mendaftar ke tempat PKL.');
  }

  if (siswa.statusPKL === 'SEDANG_PKL') {
    throw new Error('Kamu sudah PKL, hubungi guru pembimbing jika ingin merubah keputusan tmpt pkl.');
  }

  const mitra = store.mitraDirectory.find((m) => m.id === targetMitraId);
  if (!mitra) {
    throw new Error('Tempat PKL / Mitra Industri tidak ditemukan.');
  }

  if (mitra.kuotaTerisi >= mitra.kuotaTotal) {
    throw new Error('Kuota magang di mitra ini sudah penuh.');
  }

  // Check if student already applied to this specific mitra and still active/pending
  const existingApp = store.pendaftaranList?.find(
    (p) => p.siswaId === siswaId && p.mitraId === targetMitraId && ['MENUNGGU_ACC', 'DISETUJUI_MITRA', 'DITERIMA_AKTIF'].includes(p.status)
  );

  if (existingApp) {
    if (existingApp.status === 'DISETUJUI_MITRA') {
      throw new Error(`Mitra ${mitra.nama} sudah meng-ACC permohonan Anda. Silakan konfirmasi kesediaan Anda.`);
    }
    throw new Error(`Anda sudah mendaftar ke ${mitra.nama}. Status saat ini: ${existingApp.status === 'MENUNGGU_ACC' ? 'Menunggu ACC Mitra' : 'Diterima'}.`);
  }

  const todayStr = new Date().toISOString().split('T')[0];

  // Create new registration request
  const newPendaftaran = {
    id: `pend-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    siswaId: siswa.id,
    idUnik: siswa.idUnik,
    namaSiswa: siswa.nama,
    nisn: siswa.nisn,
    kelas: siswa.kelas,
    jurusan: siswa.jurusan,
    mitraId: mitra.id,
    mitraNama: mitra.nama,
    tanggalDaftar: todayStr,
    status: 'MENUNGGU_ACC',
    catatanMitra: '',
  };

  if (!Array.isArray(store.pendaftaranList)) {
    store.pendaftaranList = [];
  }
  store.pendaftaranList.unshift(newPendaftaran);

  // Send notification to student
  addNotification({
    role: 'siswa',
    userId: siswa.id,
    title: 'Pendaftaran Dikirim',
    message: `Permohonan PKL di ${mitra.nama} telah diajukan. Menunggu persetujuan (ACC) dari pihak mitra.`,
    type: 'INFO',
    link: '/dashboard/siswa/daftar-pkl',
  });

  // Send notification to mitra
  addNotification({
    role: 'mitra',
    userId: mitra.id,
    title: 'Pendaftar PKL Baru',
    message: `${siswa.nama} (${siswa.kelas} - ${siswa.jurusan}) mengajukan pendaftaran PKL dan menunggu ACC Anda.`,
    type: 'INVITE',
    link: '/dashboard/mitra',
  });

  return { siswa, mitra, pendaftaran: newPendaftaran };
}

// 5. Student cancels pending application
export function batalkanPendaftaran(siswaId = 'siswa-1', pendaftaranId) {
  const store = getStore();
  const siswa = getSiswaProfile(siswaId);

  if (!Array.isArray(store.pendaftaranList)) {
    store.pendaftaranList = [];
  }

  const targetApp = pendaftaranId
    ? store.pendaftaranList.find((p) => p.id === pendaftaranId && p.siswaId === siswaId)
    : store.pendaftaranList.find((p) => p.siswaId === siswaId && ['MENUNGGU_ACC', 'DISETUJUI_MITRA'].includes(p.status));

  if (!targetApp) {
    throw new Error('Permohonan pendaftaran tidak ditemukan.');
  }

  if (targetApp.status === 'DITERIMA_AKTIF' || siswa.statusPKL === 'SEDANG_PKL') {
    throw new Error('Kamu sudah PKL, hubungi guru pembimbing jika ingin merubah keputusan tmpt pkl.');
  }

  targetApp.status = 'DIBATALKAN_SISWA';

  addNotification({
    role: 'siswa',
    userId: siswa.id,
    title: 'Pendaftaran Dibatalkan',
    message: `Permohonan pendaftaran PKL di ${targetApp.mitraNama} telah dibatalkan.`,
    type: 'WARNING',
    link: '/dashboard/siswa/daftar-pkl',
  });

  return { success: true, targetApp };
}

// 6. Mitra approves (ACC) application -> Now waits for student confirmation!
export function accPendaftaranMitra(pendaftaranId, catatanMitra = 'Disetujui oleh pembimbing mitra') {
  const store = getStore();
  const pendaftaran = store.pendaftaranList?.find((p) => p.id === pendaftaranId);

  if (!pendaftaran) {
    throw new Error('Data pendaftaran tidak ditemukan.');
  }

  if (pendaftaran.status === 'DISETUJUI_MITRA' || pendaftaran.status === 'DITERIMA_AKTIF' || pendaftaran.status === 'DISETUJUI') {
    throw new Error('Pendaftaran ini sudah disetujui sebelumnya.');
  }

  // Update status: Mitra approved, waiting for student confirmation
  pendaftaran.status = 'DISETUJUI_MITRA';
  pendaftaran.catatanMitra = catatanMitra;

  const siswa = getSiswaProfile(pendaftaran.siswaId);

  // Notify student to confirm agreement
  addNotification({
    role: 'siswa',
    userId: siswa.id,
    title: 'Pendaftaran Di-ACC Mitra!',
    message: `Kabar baik! Mitra ${pendaftaran.mitraNama} telah meng-ACC permohonan PKL Anda. Silakan buka menu Daftar Tempat PKL untuk KONFIRMASI BERSEDIA agar resmi aktif.`,
    type: 'ACC',
    link: '/dashboard/siswa/daftar-pkl',
  });

  return { success: true, pendaftaran, siswa };
}

// 6b. Student confirms agreement (Kedua pihak bersedia -> resmi ketrima di salah satu saja!)
export function konfirmasiBersediaSiswa(siswaId = 'siswa-1', pendaftaranId) {
  const store = getStore();
  const siswa = getSiswaProfile(siswaId);

  if (siswa.statusPKL === 'SEDANG_PKL') {
    throw new Error('Kamu sudah PKL, hubungi guru pembimbing jika ingin merubah keputusan tmpt pkl.');
  }

  const pendaftaran = store.pendaftaranList?.find((p) => p.id === pendaftaranId && p.siswaId === siswaId);
  if (!pendaftaran) {
    throw new Error('Data permohonan pendaftaran tidak ditemukan.');
  }

  if (pendaftaran.status !== 'DISETUJUI_MITRA') {
    throw new Error('Pendaftaran belum di-ACC oleh mitra atau status tidak valid untuk konfirmasi.');
  }

  // Both parties agreed!
  pendaftaran.status = 'DITERIMA_AKTIF';

  // Lock student into this Mitra
  siswa.mitraId = pendaftaran.mitraId;
  siswa.mitraNama = pendaftaran.mitraNama;
  siswa.statusPKL = 'SEDANG_PKL';
  siswa.tanggalGabung = new Date().toISOString().split('T')[0];

  // Increment mitra quota
  const mitra = store.mitraDirectory.find((m) => m.id === pendaftaran.mitraId);
  if (mitra) {
    mitra.kuotaTerisi = Math.min(mitra.kuotaTotal, mitra.kuotaTerisi + 1);
  }

  // Cancel any other applications from this student automatically
  if (Array.isArray(store.pendaftaranList)) {
    store.pendaftaranList.forEach((p) => {
      if (p.siswaId === siswaId && p.id !== pendaftaranId && ['MENUNGGU_ACC', 'DISETUJUI_MITRA'].includes(p.status)) {
        p.status = 'BATAL_OTOMATIS';
        p.catatanMitra = `Dibatalkan otomatis karena siswa telah menerima penempatan di ${pendaftaran.mitraNama}`;
      }
    });
  }

  store[siswaId] = siswa;

  // Send notifications
  addNotification({
    role: 'siswa',
    userId: siswa.id,
    title: 'Resmi Aktif Sedang PKL!',
    message: `Selamat! Anda dan ${pendaftaran.mitraNama} telah saling menyetujui (keduanya bersedia). Status Anda kini resmi SEDANG PKL. Presensi dan logbook telah aktif!`,
    type: 'ACC',
    link: '/dashboard/siswa/daftar-pkl',
  });

  addNotification({
    role: 'mitra',
    userId: pendaftaran.mitraId,
    title: 'Siswa Konfirmasi Bersedia',
    message: `${siswa.nama} telah mengonfirmasi bersedia magang di perusahaan Anda. Siswa resmi berstatus aktif PKL.`,
    type: 'INFO',
    link: '/dashboard/mitra',
  });

  return { success: true, pendaftaran, siswa };
}

// 6c. Terminate/cancel placement by Teacher or Mitra
export function putusPenempatanPKL(siswaId = 'siswa-1', initiator = 'GURU', alasan = 'Keputusan pembimbing') {
  const store = getStore();
  const siswa = getSiswaProfile(siswaId);

  const prevMitraId = siswa.mitraId;
  const prevMitraNama = siswa.mitraNama || 'Mitra PKL';

  // Reduce quota
  if (prevMitraId) {
    const mitra = store.mitraDirectory.find((m) => m.id === prevMitraId);
    if (mitra && mitra.kuotaTerisi > 0) {
      mitra.kuotaTerisi -= 1;
    }
  }

  // Update applications
  if (Array.isArray(store.pendaftaranList)) {
    store.pendaftaranList.forEach((p) => {
      if (p.siswaId === siswaId && p.status === 'DITERIMA_AKTIF') {
        p.status = 'DIPUTUS_GURU_MITRA';
        p.catatanMitra = `Penempatan diputus oleh ${initiator}: ${alasan}`;
      }
    });
  }

  siswa.mitraId = null;
  siswa.mitraNama = null;
  siswa.mitraBidang = null;
  siswa.statusPKL = 'BELUM_GABUNG';
  store[siswaId] = siswa;

  addNotification({
    role: 'siswa',
    userId: siswa.id,
    title: 'Penempatan PKL Diputus',
    message: `Penempatan PKL Anda di ${prevMitraNama} telah diputus oleh ${initiator} (${alasan}). Anda kini dapat memilih dan mendaftar ke tempat PKL baru.`,
    type: 'WARNING',
    link: '/dashboard/siswa/daftar-pkl',
  });

  return { success: true, siswa };
}


// 7. Mitra rejects application
export function tolakPendaftaranMitra(pendaftaranId, catatanMitra = 'Kuota penuh atau kualifikasi belum sesuai') {
  const store = getStore();
  const pendaftaran = store.pendaftaranList?.find((p) => p.id === pendaftaranId);

  if (!pendaftaran) {
    throw new Error('Data pendaftaran tidak ditemukan.');
  }

  pendaftaran.status = 'DITOLAK';
  pendaftaran.catatanMitra = catatanMitra;

  // Reset student status to BELUM_GABUNG so they can register elsewhere
  const siswa = getSiswaProfile(pendaftaran.siswaId);
  if (siswa.statusPKL === 'MENUNGGU_ACC' && siswa.mitraId === pendaftaran.mitraId) {
    siswa.mitraId = null;
    siswa.mitraNama = null;
    siswa.statusPKL = 'BELUM_GABUNG';
    store[pendaftaran.siswaId] = siswa;
  }

  // Notify student
  addNotification({
    role: 'siswa',
    userId: siswa.id,
    title: 'Pendaftaran Belum Disetujui',
    message: `Permohonan PKL Anda di ${pendaftaran.mitraNama} belum disetujui: ${catatanMitra}. Silakan mendaftar ke mitra lain.`,
    type: 'WARNING',
    link: '/dashboard/siswa/daftar-pkl',
  });

  return { success: true, pendaftaran, siswa };
}

// 8. Get registration list for specific Mitra
export function getPendaftarByMitra(mitraId = 'mitra-1') {
  const store = getStore();
  const list = store.pendaftaranList || [];
  return list.filter((p) => p.mitraId === mitraId);
}

// 9. Mitra invites student using Unique ID
export function inviteSiswaByUniqueId(idUnik, mitraPayload) {
  const store = getStore();
  
  const foundSiswaKey = Object.keys(store).find((key) => {
    const s = store[key];
    return s && typeof s === 'object' && s.idUnik?.toUpperCase() === idUnik?.trim()?.toUpperCase();
  });

  if (!foundSiswaKey) {
    throw new Error(`Siswa dengan Nomor ID Unik "${idUnik}" tidak ditemukan. Pastikan nomor ID sesuai.`);
  }

  const siswa = store[foundSiswaKey];
  const newInvite = {
    id: `inv-${Date.now()}`,
    mitraId: mitraPayload.mitraId || 'mitra-mitra',
    mitraNama: mitraPayload.mitraNama || 'Mitra Industri SIPKL',
    bidangUsaha: mitraPayload.bidangUsaha || 'Industri Mitra',
    pesan: mitraPayload.pesan || 'Anda diundang untuk bergabung magang PKL di perusahaan kami.',
    tanggal: new Date().toISOString().split('T')[0],
    status: 'PENDING',
  };

  if (!Array.isArray(siswa.undanganList)) {
    siswa.undanganList = [];
  }

  siswa.undanganList.unshift(newInvite);

  // Notify student
  addNotification({
    role: 'siswa',
    userId: siswa.id,
    title: 'Undangan PKL Baru',
    message: `${newInvite.mitraNama} mengundang Anda bergabung PKL via ID Unik Anda. Buka menu Daftar Tempat PKL untuk meninjau.`,
    type: 'INVITE',
    link: '/dashboard/siswa/daftar-pkl',
  });

  return { success: true, siswa, invitation: newInvite };
}

// 10. Student accepts invitation (Instant ACC because Mitra issued the invite)
export function acceptMitraInvitation(siswaId = 'siswa-1', invitationId) {
  const store = getStore();
  const siswa = getSiswaProfile(siswaId);

  if (!siswa.biodataLengkap) {
    throw new Error('Wajib melengkapi biodata siswa sebelum menerima undangan tempat PKL.');
  }

  const invite = siswa.undanganList?.find((inv) => inv.id === invitationId);
  if (!invite) {
    throw new Error('Undangan tidak ditemukan.');
  }

  const mitra = store.mitraDirectory.find((m) => m.id === invite.mitraId) || {
    id: invite.mitraId,
    nama: invite.mitraNama,
    bidang: invite.bidangUsaha,
  };

  siswa.mitraId = mitra.id;
  siswa.mitraNama = mitra.nama;
  siswa.mitraBidang = mitra.bidang;
  siswa.statusPKL = 'SEDANG_PKL'; // Instant ACC
  siswa.tanggalGabung = new Date().toISOString().split('T')[0];
  invite.status = 'ACCEPTED';

  // Increment mitra quota
  if (mitra.kuotaTerisi !== undefined) {
    mitra.kuotaTerisi = Math.min(mitra.kuotaTotal || 10, (mitra.kuotaTerisi || 0) + 1);
  }

  // Also record in pendaftaran list
  if (!Array.isArray(store.pendaftaranList)) {
    store.pendaftaranList = [];
  }
  store.pendaftaranList.unshift({
    id: `pend-inv-${Date.now()}`,
    siswaId: siswa.id,
    idUnik: siswa.idUnik,
    namaSiswa: siswa.nama,
    nisn: siswa.nisn,
    kelas: siswa.kelas,
    jurusan: siswa.jurusan,
    mitraId: mitra.id,
    mitraNama: mitra.nama,
    tanggalDaftar: new Date().toISOString().split('T')[0],
    status: 'DISETUJUI',
    catatanMitra: 'Diterima melalui undangan resmi mitra.',
  });

  store[siswaId] = siswa;

  addNotification({
    role: 'siswa',
    userId: siswa.id,
    title: 'Undangan Diterima - PKL Aktif',
    message: `Anda resmi bergabung di ${mitra.nama}. Akses presensi dan logbook mingguan kini telah aktif!`,
    type: 'ACC',
    link: '/dashboard/siswa/presensi',
  });

  return { siswa, mitra };
}

// 11. Student leaves/changes current Mitra
export function leaveMitra(siswaId = 'siswa-1') {
  const store = getStore();
  const siswa = getSiswaProfile(siswaId);

  if (siswa.mitraId) {
    const mitra = store.mitraDirectory.find((m) => m.id === siswa.mitraId);
    if (mitra && mitra.kuotaTerisi > 0) {
      mitra.kuotaTerisi -= 1;
    }
  }

  siswa.mitraId = null;
  siswa.mitraNama = null;
  siswa.statusPKL = 'BELUM_GABUNG';
  store[siswaId] = siswa;
  return siswa;
}

// 12. Gatekeeper check: is student ready for presensi & logbook?
export function checkSiswaPrerequisite(siswaId = 'siswa-1') {
  const siswa = getSiswaProfile(siswaId);
  const isBiodataComplete = Boolean(siswa.biodataLengkap);
  const isACCApproved = siswa.statusPKL === 'SEDANG_PKL' && Boolean(siswa.mitraId);
  const isPendingACC = siswa.statusPKL === 'MENUNGGU_ACC';

  let reason = 'READY';
  if (!isBiodataComplete) {
    reason = 'BIODATA_INCOMPLETE';
  } else if (isPendingACC) {
    reason = 'MENUNGGU_ACC_MITRA';
  } else if (!isACCApproved) {
    reason = 'NO_MITRA';
  }

  return {
    isReady: isBiodataComplete && isACCApproved,
    isBiodataComplete,
    hasJoinedMitra: isACCApproved,
    isPendingACC,
    statusPKL: siswa.statusPKL,
    siswa,
    reason,
  };
}

// 13. Get all applications made by a student
export function getPendaftaranBySiswa(siswaId = 'siswa-1') {
  const store = getStore();
  return (store.pendaftaranList || []).filter((p) => p.siswaId === siswaId);
}

// 14. Student selects/applies to a Guru Pembimbing
export function ajukanBimbinganGuru(siswaId = 'siswa-1', guruNama, pesan = '') {
  const store = getStore();
  const siswa = getSiswaProfile(siswaId);

  if (!guruNama) {
    throw new Error('Pilih nama guru pembimbing terlebih dahulu.');
  }

  if (!Array.isArray(store.bimbinganList)) {
    store.bimbinganList = [];
  }

  // Cek apakah sudah ada permohonan untuk guru yang sama yang masih pending atau approved
  let existing = store.bimbinganList.find(
    (b) => b.siswaId === siswaId && b.guruNama === guruNama && ['MENUNGGU_ACC', 'DISETUJUI'].includes(b.status)
  );

  if (existing) {
    return { success: true, permohonan: existing, alreadyExists: true };
  }

  // Batalkan pengajuan pending sebelumnya jika memilih guru lain
  store.bimbinganList.forEach((b) => {
    if (b.siswaId === siswaId && b.status === 'MENUNGGU_ACC') {
      b.status = 'DIBATALKAN_SISWA';
      b.catatanGuru = 'Siswa memilih guru pembimbing lain.';
    }
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const newBimbingan = {
    id: `bim-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    siswaId: siswa.id,
    idUnik: siswa.idUnik || 'PKL-SISWA-00512',
    namaSiswa: siswa.nama,
    nisn: siswa.nisn,
    kelas: siswa.kelas,
    jurusan: siswa.jurusan,
    guruNama: guruNama,
    mitraNama: siswa.mitraNama || '-',
    statusPKL: siswa.statusPKL || 'SEDANG_PKL',
    tanggalPengajuan: todayStr,
    status: 'MENUNGGU_ACC',
    catatanGuru: '',
    noHp: siswa.noHp || '-',
    email: siswa.email || `${siswa.id}@siswa.smkn1.sch.id`,
    pesan: pesan || '',
  };

  store.bimbinganList.unshift(newBimbingan);

  siswa.guruPembimbing = guruNama;
  siswa.statusBimbinganGuru = 'MENUNGGU_ACC';
  siswa.catatanGuruBimbingan = '';
  store[siswaId] = siswa;

  // Notifikasi untuk Guru Pembimbing
  addNotification({
    role: 'guru',
    userId: 'guru-1',
    title: 'Permohonan Bimbingan Siswa Baru',
    message: `${siswa.nama} (${siswa.kelas} - ${siswa.jurusan}) telah memilih Anda sebagai Guru Pembimbing dan menunggu ACC Anda.`,
    type: 'INVITE',
    link: '/dashboard/guru/siswa',
  });

  // Notifikasi untuk Siswa
  addNotification({
    role: 'siswa',
    userId: siswa.id,
    title: 'Permohonan Bimbingan Dikirim',
    message: `Permohonan pembimbingan kepada ${guruNama} berhasil dikirim. Menunggu persetujuan (ACC) dari guru pembimbing sebelum Anda masuk ke daftar resmi bimbingan beliau.`,
    type: 'INFO',
    link: '/dashboard/siswa/profile',
  });

  return { success: true, permohonan: newBimbingan, siswa };
}

// 15. Guru Pembimbing ACC/Menyetujui Siswa
export function accBimbinganGuru(permohonanId, catatan = 'Disetujui oleh Guru Pembimbing.') {
  const store = getStore();
  const permohonan = (store.bimbinganList || []).find((b) => b.id === permohonanId);
  if (!permohonan) {
    throw new Error('Data permohonan bimbingan tidak ditemukan.');
  }

  permohonan.status = 'DISETUJUI';
  permohonan.catatanGuru = catatan;
  permohonan.tanggalDiproses = new Date().toISOString().split('T')[0];

  // Update profil siswa secara live
  const siswa = getSiswaProfile(permohonan.siswaId);
  siswa.guruPembimbing = permohonan.guruNama;
  siswa.statusBimbinganGuru = 'DISETUJUI';
  siswa.catatanGuruBimbingan = catatan;
  store[permohonan.siswaId] = siswa;

  // Kirim notifikasi ACC ke Siswa
  addNotification({
    role: 'siswa',
    userId: permohonan.siswaId,
    title: 'Permohonan Bimbingan Disetujui (ACC)!',
    message: `Selamat! Guru Pembimbing ${permohonan.guruNama} telah MENYETUJUI (ACC) permohonan Anda. Anda kini resmi terdaftar dalam daftar siswa bimbingan beliau.`,
    type: 'ACC',
    link: '/dashboard/siswa/profile',
  });

  return { success: true, permohonan, siswa };
}

// 16. Guru Pembimbing Menolak Permohonan Siswa
export function tolakBimbinganGuru(permohonanId, alasan = 'Kuota bimbingan penuh atau belum sesuai kompetensi keahlian.') {
  const store = getStore();
  const permohonan = (store.bimbinganList || []).find((b) => b.id === permohonanId);
  if (!permohonan) {
    throw new Error('Data permohonan bimbingan tidak ditemukan.');
  }

  permohonan.status = 'DITOLAK';
  permohonan.catatanGuru = alasan;
  permohonan.tanggalDiproses = new Date().toISOString().split('T')[0];

  // Update profil siswa
  const siswa = getSiswaProfile(permohonan.siswaId);
  siswa.statusBimbinganGuru = 'DITOLAK';
  siswa.catatanGuruBimbingan = alasan;
  store[permohonan.siswaId] = siswa;

  // Notifikasi penolakan ke Siswa
  addNotification({
    role: 'siswa',
    userId: permohonan.siswaId,
    title: 'Permohonan Bimbingan Belum Disetujui',
    message: `Permohonan bimbingan Anda kepada ${permohonan.guruNama} belum disetujui: "${alasan}". Silakan pilih guru pembimbing lain di formulir profil Anda.`,
    type: 'WARNING',
    link: '/dashboard/siswa/profile',
  });

  return { success: true, permohonan, siswa };
}

// 17. Guru Pembimbing Melepas / Memutus Bimbingan Siswa
export function putusBimbinganGuru(siswaId = 'siswa-1', alasan = 'Keputusan guru pembimbing') {
  const store = getStore();
  const siswa = getSiswaProfile(siswaId);
  const prevGuru = siswa.guruPembimbing;

  (store.bimbinganList || []).forEach((b) => {
    if (b.siswaId === siswaId && b.status === 'DISETUJUI') {
      b.status = 'DIPUTUS_GURU';
      b.catatanGuru = alasan;
      b.tanggalDiproses = new Date().toISOString().split('T')[0];
    }
  });

  siswa.statusBimbinganGuru = 'BELUM_MEMILIH';
  siswa.catatanGuruBimbingan = alasan;
  store[siswaId] = siswa;

  addNotification({
    role: 'siswa',
    userId: siswa.id,
    title: 'Bimbingan Guru Diputus',
    message: `Status bimbingan Anda dengan ${prevGuru || 'Guru Pembimbing'} telah diputus (${alasan}). Silakan pilih guru pembimbing baru di menu profil.`,
    type: 'WARNING',
    link: '/dashboard/siswa/profile',
  });

  return { success: true, siswa };
}

// 18. Ambil data bimbingan untuk Guru (Siswa Aktif vs Permohonan Menunggu ACC)
export function getBimbinganByGuru(guruNama = 'Drs. H. Hendra Wijaya, M.Pd') {
  const store = getStore();
  const all = store.bimbinganList || [];

  const list = all.filter((b) => !guruNama || b.guruNama?.toLowerCase() === guruNama?.toLowerCase());

  // Siswa Aktif: HANYA yang sudah berstatus DISETUJUI (ACC)!
  const siswaAktif = list
    .filter((b) => b.status === 'DISETUJUI')
    .map((b) => {
      const live = store[b.siswaId] || {};
      return {
        id: b.siswaId,
        permohonanId: b.id,
        nisn: b.nisn || live.nisn,
        kelas: b.kelas || live.kelas,
        jurusan: b.jurusan || live.jurusan,
        statusPKL: live.statusPKL || b.statusPKL || 'SEDANG_PKL',
        statusBimbingan: 'DISETUJUI',
        tanggalDiproses: b.tanggalDiproses,
        tanggalPengajuan: b.tanggalPengajuan,
        catatanGuru: b.catatanGuru,
        noHp: b.noHp || live.noHp,
        user: {
          nama: b.namaSiswa || live.nama,
          email: b.email || `${b.siswaId}@siswa.smkn1.sch.id`,
        },
        mitra: {
          namaPerusahaan: live.mitraNama || b.mitraNama || '-',
        },
        nilaiGuru: b.nilaiGuru || null,
      };
    });

  // Permohonan Masuk: Yang sedang MENUNGGU ACC Guru!
  const pending = list
    .filter((b) => b.status === 'MENUNGGU_ACC')
    .map((b) => {
      const live = store[b.siswaId] || {};
      return {
        id: b.id,
        siswaId: b.siswaId,
        idUnik: b.idUnik || live.idUnik,
        namaSiswa: b.namaSiswa || live.nama,
        nisn: b.nisn || live.nisn,
        kelas: b.kelas || live.kelas,
        jurusan: b.jurusan || live.jurusan,
        mitraNama: live.mitraNama || b.mitraNama || '-',
        statusPKL: live.statusPKL || b.statusPKL || 'SEDANG_PKL',
        tanggalPengajuan: b.tanggalPengajuan,
        status: 'MENUNGGU_ACC',
        noHp: b.noHp || live.noHp || '-',
        email: b.email || `${b.siswaId}@siswa.smkn1.sch.id`,
        pesan: b.pesan || '',
      };
    });

  // Riwayat Penolakan / Arsip
  const riwayat = list
    .filter((b) => ['DITOLAK', 'DIPUTUS_GURU', 'DIBATALKAN_SISWA'].includes(b.status))
    .map((b) => ({
      ...b,
    }));

  return {
    siswaAktif,
    pending,
    riwayat,
    totalAktif: siswaAktif.length,
    totalPending: pending.length,
  };
}
