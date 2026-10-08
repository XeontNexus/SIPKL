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

  store[siswaId] = updated;
  return updated;
}

// 3. Get all available Mitras opening slots
export function getAvailableMitraList() {
  const store = getStore();
  return store.mitraDirectory || [];
}

// 4. Student applies to a Mitra (Status: MENUNGGU_ACC)
export function daftarMitra(siswaId = 'siswa-1', targetMitraId) {
  const store = getStore();
  const siswa = getSiswaProfile(siswaId);

  if (!siswa.biodataLengkap) {
    throw new Error('Wajib melengkapi biodata (Nama, Kelas, Jurusan, Tanggal Lahir) sebelum mendaftar ke tempat PKL.');
  }

  if (siswa.statusPKL === 'SEDANG_PKL') {
    throw new Error('Anda sudah aktif PKL di tempat mitra. Silakan selesaikan atau batalkan status saat ini terlebih dahulu.');
  }

  if (siswa.statusPKL === 'MENUNGGU_ACC') {
    throw new Error('Anda sudah memiliki permohonan pendaftaran yang sedang menunggu ACC mitra. Batalkan terlebih dahulu jika ingin berpindah tempat PKL.');
  }

  const mitra = store.mitraDirectory.find((m) => m.id === targetMitraId);
  if (!mitra) {
    throw new Error('Tempat PKL / Mitra Industri tidak ditemukan.');
  }

  if (mitra.kuotaTerisi >= mitra.kuotaTotal) {
    throw new Error('Kuota magang di mitra ini sudah penuh.');
  }

  const todayStr = new Date().toISOString().split('T')[0];

  // Create new registration request
  const newPendaftaran = {
    id: `pend-${Date.now()}`,
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

  // Update student status to MENUNGGU_ACC
  siswa.mitraId = mitra.id;
  siswa.mitraNama = mitra.nama;
  siswa.mitraBidang = mitra.bidang;
  siswa.statusPKL = 'MENUNGGU_ACC';
  siswa.tanggalDaftar = todayStr;
  store[siswaId] = siswa;

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
export function batalkanPendaftaran(siswaId = 'siswa-1') {
  const store = getStore();
  const siswa = getSiswaProfile(siswaId);

  if (siswa.statusPKL !== 'MENUNGGU_ACC') {
    throw new Error('Hanya pendaftaran yang berstatus MENUNGGU ACC yang dapat dibatalkan.');
  }

  // Remove/update pendaftaran list
  if (Array.isArray(store.pendaftaranList)) {
    store.pendaftaranList = store.pendaftaranList.filter(
      (p) => !(p.siswaId === siswaId && p.status === 'MENUNGGU_ACC')
    );
  }

  const exMitraNama = siswa.mitraNama;
  siswa.mitraId = null;
  siswa.mitraNama = null;
  siswa.mitraBidang = null;
  siswa.statusPKL = 'BELUM_GABUNG';
  store[siswaId] = siswa;

  addNotification({
    role: 'siswa',
    userId: siswa.id,
    title: 'Pendaftaran Dibatalkan',
    message: `Permohonan pendaftaran PKL di ${exMitraNama || 'mitra'} telah dibatalkan. Anda dapat memilih tempat PKL lain.`,
    type: 'WARNING',
    link: '/dashboard/siswa/daftar-pkl',
  });

  return siswa;
}

// 6. Mitra approves (ACC) application
export function accPendaftaranMitra(pendaftaranId, catatanMitra = 'Disetujui oleh pembimbing mitra') {
  const store = getStore();
  const pendaftaran = store.pendaftaranList?.find((p) => p.id === pendaftaranId);

  if (!pendaftaran) {
    throw new Error('Data pendaftaran tidak ditemukan.');
  }

  if (pendaftaran.status === 'DISETUJUI') {
    throw new Error('Pendaftaran ini sudah disetujui sebelumnya.');
  }

  pendaftaran.status = 'DISETUJUI';
  pendaftaran.catatanMitra = catatanMitra;

  // Update student status to active SEDANG_PKL
  const siswa = getSiswaProfile(pendaftaran.siswaId);
  siswa.mitraId = pendaftaran.mitraId;
  siswa.mitraNama = pendaftaran.mitraNama;
  siswa.statusPKL = 'SEDANG_PKL';
  siswa.tanggalGabung = new Date().toISOString().split('T')[0];

  // Increment mitra quota
  const mitra = store.mitraDirectory.find((m) => m.id === pendaftaran.mitraId);
  if (mitra) {
    mitra.kuotaTerisi = Math.min(mitra.kuotaTotal, mitra.kuotaTerisi + 1);
  }

  store[pendaftaran.siswaId] = siswa;

  // Notify student that ACC is granted and Presensi is now unlocked!
  addNotification({
    role: 'siswa',
    userId: siswa.id,
    title: 'Pendaftaran PKL Di-ACC!',
    message: `Selamat! Pendaftaran PKL Anda di ${pendaftaran.mitraNama} telah DISETUJUI (ACC). Akses presensi harian dan logbook Anda kini sudah aktif!`,
    type: 'ACC',
    link: '/dashboard/siswa/presensi',
  });

  return { success: true, pendaftaran, siswa };
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
