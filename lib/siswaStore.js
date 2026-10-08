// In-Memory Synchronized Store for Siswa PKL, Biodata, & Mitra Enrollment

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
    // Mitra enrollment status
    mitraId: 'mitra-1',
    mitraNama: 'PT Telkom Indonesia Witel Riau',
    mitraBidang: 'Telekomunikasi & Jaringan Komputer',
    pembimbingMitra: 'Bpk. Ridwan Kurniawan, S.T.',
    statusPKL: 'SEDANG_PKL', // 'BELUM_GABUNG' | 'MENUNGGU_KONFIRMASI' | 'SEDANG_PKL' | 'SELESAI_PKL'
    tanggalGabung: '2026-07-01',
    // Received invitations from Mitras
    undanganList: [
      {
        id: 'inv-1',
        mitraId: 'mitra-3',
        mitraNama: 'PT Riau Media Grafika',
        bidangUsaha: 'Multimedia & Percetakan Digital',
        pesan: 'Halo Ahmad Fauzi! Kami tertarik dengan portofolio jaringan & IT Anda. Bergabunglah dengan tim multimedia kami.',
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
};

if (process.env.NODE_ENV !== 'production') {
  globalThis.__sipklSiswaStore = globalSiswaStore;
}

function getStore() {
  return globalThis.__sipklSiswaStore || globalSiswaStore;
}

// 1. Get student profile by ID
export function getSiswaProfile(siswaId = 'siswa-1') {
  const store = getStore();
  let siswa = store[siswaId];
  if (!siswa) {
    // Generate default profile if not found
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
    // Preserve unique ID
    idUnik: current.idUnik || `PKL-SISWA-${Math.floor(10000 + Math.random() * 90000)}`,
  };

  // Check if required fields exist
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

// 4. Student joins a chosen Mitra directly
export function joinMitra(siswaId = 'siswa-1', targetMitraId) {
  const store = getStore();
  const siswa = getSiswaProfile(siswaId);

  if (!siswa.biodataLengkap) {
    throw new Error('Wajib melengkapi biodata (Nama, Kelas, Jurusan, Tanggal Lahir) sebelum mendaftar ke tempat PKL.');
  }

  const mitra = store.mitraDirectory.find(m => m.id === targetMitraId);
  if (!mitra) {
    throw new Error('Tempat PKL / Mitra Industri tidak ditemukan.');
  }

  if (mitra.kuotaTerisi >= mitra.kuotaTotal) {
    throw new Error('Kuota magang di mitra ini sudah penuh.');
  }

  // Update student
  siswa.mitraId = mitra.id;
  siswa.mitraNama = mitra.nama;
  siswa.mitraBidang = mitra.bidang;
  siswa.statusPKL = 'SEDANG_PKL';
  siswa.tanggalGabung = new Date().toISOString().split('T')[0];

  // Increment filled quota
  mitra.kuotaTerisi = Math.min(mitra.kuotaTotal, mitra.kuotaTerisi + 1);

  store[siswaId] = siswa;
  return { siswa, mitra };
}

// 5. Student leaves/changes current Mitra
export function leaveMitra(siswaId = 'siswa-1') {
  const store = getStore();
  const siswa = getSiswaProfile(siswaId);

  if (siswa.mitraId) {
    const mitra = store.mitraDirectory.find(m => m.id === siswa.mitraId);
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

// 6. Mitra invites student using Unique ID
export function inviteSiswaByUniqueId(idUnik, mitraPayload) {
  const store = getStore();
  
  // Find student by idUnik
  const foundSiswaKey = Object.keys(store).find(key => {
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
  return { success: true, siswa, invitation: newInvite };
}

// 7. Student accepts invitation
export function acceptMitraInvitation(siswaId = 'siswa-1', invitationId) {
  const store = getStore();
  const siswa = getSiswaProfile(siswaId);

  if (!siswa.biodataLengkap) {
    throw new Error('Wajib melengkapi biodata siswa sebelum menerima undangan tempat PKL.');
  }

  const invite = siswa.undanganList?.find(inv => inv.id === invitationId);
  if (!invite) {
    throw new Error('Undangan tidak ditemukan.');
  }

  const mitra = store.mitraDirectory.find(m => m.id === invite.mitraId) || {
    id: invite.mitraId,
    nama: invite.mitraNama,
    bidang: invite.bidangUsaha,
  };

  siswa.mitraId = mitra.id;
  siswa.mitraNama = mitra.nama;
  siswa.mitraBidang = mitra.bidang;
  siswa.statusPKL = 'SEDANG_PKL';
  siswa.tanggalGabung = new Date().toISOString().split('T')[0];
  invite.status = 'ACCEPTED';

  store[siswaId] = siswa;
  return { siswa, mitra };
}

// 8. Gatekeeper check: is student ready for presensi & logbook?
export function checkSiswaPrerequisite(siswaId = 'siswa-1') {
  const siswa = getSiswaProfile(siswaId);
  const isBiodataComplete = Boolean(siswa.biodataLengkap);
  const hasJoinedMitra = Boolean(siswa.mitraId);

  return {
    isReady: isBiodataComplete && hasJoinedMitra,
    isBiodataComplete,
    hasJoinedMitra,
    siswa,
    reason: !isBiodataComplete
      ? 'BIODATA_INCOMPLETE'
      : !hasJoinedMitra
      ? 'NO_MITRA'
      : 'READY',
  };
}
