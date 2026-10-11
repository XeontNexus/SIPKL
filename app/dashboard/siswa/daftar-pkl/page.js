'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  IconBriefcase,
  IconCheck,
  IconAlert,
  IconMapPin,
  IconClock,
  IconUser,
  IconIdCard,
  IconUsers,
  IconAlertCircle,
} from '@/components/Icons';
import { useModalAlert } from '@/components/ModalAlert';

export default function SiswaDaftarPKLPage() {
  const { showAlert, showConfirm } = useModalAlert();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const [activeTab, setActiveTab] = useState('DIREKTORI'); // 'DIREKTORI' | 'UNDANGAN'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJurusan, setFilterJurusan] = useState('ALL');

  const [siswa, setSiswa] = useState({
    id: 'siswa-1',
    idUnik: 'PKL-SISWA-00512',
    nama: 'Ahmad Fauzi',
    jurusan: 'Teknik Komputer dan Jaringan',
    kelas: 'XII TKJ 1',
    tanggalLahir: '2008-05-14',
    biodataLengkap: true,
    mitraId: null,
    mitraNama: null,
    statusPKL: 'BELUM_GABUNG', // 'BELUM_GABUNG' | 'SEDANG_PKL'
  });

  const [mitraList, setMitraList] = useState([]);
  const [pendaftaranList, setPendaftaranList] = useState([]);
  const [undanganList, setUndanganList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/siswa/mitra-pkl');
      if (res.ok) {
        const json = await res.json();
        if (json.siswa) setSiswa(json.siswa);
        if (json.mitraList) setMitraList(json.mitraList);
        if (json.pendaftaranList) setPendaftaranList(json.pendaftaranList);
        if (json.undanganList) setUndanganList(json.undanganList);
      }
    } catch (err) {
      console.error('Error fetching data mitra:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyId = () => {
    if (siswa.idUnik) {
      navigator.clipboard.writeText(siswa.idUnik);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Click on "Daftar & Ajukan ke Mitra"
  const handleDaftarMitra = async (mitraId, mitraNama) => {
    // 1. If student is already SEDANG_PKL, show the required popup warning
    if (siswa.statusPKL === 'SEDANG_PKL') {
      await showAlert({
        title: 'Peringatan Status PKL',
        message: 'kamu sudah pkl, hubungi guru pembimbing jika ingin merubah keputusan tmpt pkl.',
        type: 'warning',
        confirmText: 'Mengerti',
      });
      return;
    }

    // 2. Check biodata completeness
    if (!siswa.biodataLengkap) {
      await showAlert({
        title: 'Biodata Belum Lengkap',
        message: 'Wajib melengkapi biodata (Nama, Kelas, Jurusan, Tanggal Lahir) di menu Profile terlebih dahulu sebelum mendaftar!',
        type: 'warning',
      });
      return;
    }

    // 3. Confirm application
    const confirmed = await showConfirm({
      title: 'Pendaftaran Magang PKL',
      message: `Ajukan permohonan pendaftaran PKL ke ${mitraNama}?\nPermohonan akan ditinjau oleh pihak industri. Jika disetujui (ACC), Anda dapat mengonfirmasi kesediaan Anda.`,
      type: 'info',
      confirmText: 'Ya, Ajukan Pendaftaran',
      cancelText: 'Batal',
    });

    if (!confirmed) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/siswa/mitra-pkl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'DAFTAR', mitraId }),
      });

      const json = await res.json();
      if (!res.ok) {
        await showAlert({
          title: 'Gagal Mendaftar',
          message: json.error || 'Gagal mengajukan pendaftaran ke tempat PKL.',
          type: 'error',
        });
      } else {
        await showAlert({
          title: 'Permohonan Berhasil Dikirim',
          message: `Permohonan pendaftaran di ${mitraNama} berhasil diajukan! Silakan pantau status persetujuan (ACC) dari pihak mitra.`,
          type: 'success',
        });
        fetchData();
      }
    } catch (err) {
      await showAlert({
        title: 'Kendala Jaringan',
        message: 'Terjadi kendala jaringan saat mengajukan pendaftaran.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Student confirms acceptance (keduanya acc -> resmi aktif!)
  const handleKonfirmasiBersedia = async (pendaftaranId, mitraNama) => {
    const confirmed = await showConfirm({
      title: 'Konfirmasi Kesediaan Magang',
      message: `Apakah Anda bersedia dan setuju untuk melaksanakan PKL di ${mitraNama}?\n\nSetelah Anda mengonfirmasi bersedia, Anda resmi diterima (keduanya telah ACC) dan tidak dapat mendaftar di tempat lain lagi.`,
      type: 'warning',
      confirmText: 'Ya, Saya Bersedia Magang',
      cancelText: 'Pertimbangkan Lagi',
    });

    if (!confirmed) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/siswa/mitra-pkl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'KONFIRMASI_BERSEDIA', pendaftaranId }),
      });

      const json = await res.json();
      if (!res.ok) {
        await showAlert({
          title: 'Gagal Konfirmasi',
          message: json.error || 'Gagal mengonfirmasi kesediaan magang.',
          type: 'error',
        });
      } else {
        await showAlert({
          title: 'Resmi Diterima PKL!',
          message: `Selamat! Anda dan ${mitraNama} telah saling menyetujui (keduanya bersedia).\nStatus Anda sekarang resmi SEDANG PKL. Akses presensi harian dan logbook kini aktif!`,
          type: 'success',
        });
        fetchData();
      }
    } catch (err) {
      await showAlert({
        title: 'Kendala Jaringan',
        message: 'Kendala jaringan saat memproses konfirmasi.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Cancel pending application
  const handleBatalkanPendaftaran = async (pendaftaranId, mitraNama) => {
    const confirmed = await showConfirm({
      title: 'Batalkan Permohonan',
      message: `Batalkan permohonan pendaftaran magang di ${mitraNama}?`,
      type: 'warning',
      confirmText: 'Ya, Batalkan',
      cancelText: 'Kembali',
    });

    if (!confirmed) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/siswa/mitra-pkl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'BATALKAN_PENDAFTARAN', pendaftaranId }),
      });

      const json = await res.json();
      if (!res.ok) {
        await showAlert({
          title: 'Gagal Membatalkan',
          message: json.error || 'Gagal membatalkan permohonan pendaftaran.',
          type: 'error',
        });
      } else {
        await showAlert({
          title: 'Pendaftaran Dibatalkan',
          message: `Permohonan di ${mitraNama} telah dibatalkan.`,
          type: 'info',
        });
        fetchData();
      }
    } catch (err) {
      await showAlert({
        title: 'Kendala Jaringan',
        message: 'Kendala jaringan saat membatalkan permohonan.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Click on active "Sedang PKL" button
  const handleInfoSedangPKL = async (mitraNama) => {
    await showAlert({
      title: 'Status: Sedang PKL',
      message: `Anda sedang aktif melaksanakan PKL di ${mitraNama}.\n\nJika ingin merubah keputusan tempat PKL, silakan hubungi guru pembimbing sekolah.`,
      type: 'info',
      confirmText: 'Tutup',
    });
  };

  // Accept direct invitation from Mitra
  const handleAcceptInvite = async (invitationId, mitraNama) => {
    if (!siswa.biodataLengkap) {
      await showAlert({
        title: 'Biodata Belum Lengkap',
        message: 'Wajib melengkapi biodata siswa di menu Profile sebelum menerima undangan.',
        type: 'warning',
      });
      return;
    }

    const confirmed = await showConfirm({
      title: 'Terima Undangan Mitra',
      message: `Terima undangan resmi dan langsung bergabung PKL di ${mitraNama}?`,
      type: 'info',
      confirmText: 'Ya, Terima Undangan',
      cancelText: 'Batal',
    });

    if (!confirmed) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/siswa/mitra-pkl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ACCEPT_INVITE', invitationId }),
      });

      const json = await res.json();
      if (!res.ok) {
        await showAlert({
          title: 'Gagal Menerima Undangan',
          message: json.error || 'Gagal menerima undangan.',
          type: 'error',
        });
      } else {
        await showAlert({
          title: 'Berhasil Bergabung',
          message: `Undangan dari ${mitraNama} diterima! Anda telah resmi berstatus Sedang PKL.`,
          type: 'success',
        });
        fetchData();
      }
    } catch (err) {
      await showAlert({
        title: 'Kendala Jaringan',
        message: 'Gagal memproses undangan.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredMitra = mitraList.filter((m) => {
    const matchSearch =
      m.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.bidang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.alamat.toLowerCase().includes(searchTerm.toLowerCase());

    const matchJurusan =
      filterJurusan === 'ALL' ||
      m.jurusanCocok?.some((j) => j.toLowerCase().includes(filterJurusan.toLowerCase()));

    return matchSearch && matchJurusan;
  });

  // Pending offers waiting for student confirmation
  const offersWaitingConfirmation = pendaftaranList.filter((p) => p.status === 'DISETUJUI_MITRA');
  const activeEnrolledMitra = siswa.statusPKL === 'SEDANG_PKL' ? siswa.mitraNama : null;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div>
          <h1 className="page-title">Pendaftaran & Tempat PKL Mitra</h1>
          <p className="page-subtitle">
            Cari tempat magang, daftar ke satu atau beberapa mitra industri, dan konfirmasi kesediaan setelah di-ACC mitra.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link href="/dashboard/siswa/profile" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <IconUser size={16} />
            <span>Profile Saya</span>
          </Link>
        </div>
      </div>

      {/* BANNER 1: TAWARAN DARI MITRA YANG MENUNGGU KONFIRMASI SISWA */}
      {siswa.statusPKL !== 'SEDANG_PKL' && offersWaitingConfirmation.length > 0 && (
        <div
          className="card"
          style={{
            marginBottom: 'var(--space-xl)',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            border: '2px solid #22c55e',
            boxShadow: '0 8px 20px rgba(34, 197, 94, 0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: '#16a34a',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.6rem',
                  flexShrink: 0,
                }}
              >
                🎉
              </div>
              <div>
                <span className="badge badge-success" style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>
                  ACC DARI MITRA TERSEDIA
                </span>
                <h3 style={{ margin: '2px 0 0', fontSize: '1.2rem', fontWeight: 800, color: '#14532d' }}>
                  {offersWaitingConfirmation.length} Tempat Magang Telah Menyetujui (ACC) Pendaftaran Anda!
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#166534', maxWidth: '650px' }}>
                  Pihak mitra telah menyetujui permohonan Anda. Silakan klik tombol <strong>&ldquo;Konfirmasi Bersedia Magang&rdquo;</strong> pada mitra pilihan Anda di bawah. Setelah keduanya bersedia, Anda resmi diterima di tempat tersebut.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BANNER 2: STATUS AKTIF SEDANG PKL (KEDUANYA SUDAH ACC) */}
      {siswa.statusPKL === 'SEDANG_PKL' && (
        <div
          className="card"
          style={{
            marginBottom: 'var(--space-xl)',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
            border: '2px solid #16a34a',
            boxShadow: '0 8px 24px rgba(22, 163, 74, 0.12)',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: '#16a34a',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <IconCheck size={28} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span
                    style={{
                      background: '#16a34a',
                      color: '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: '6px',
                      letterSpacing: '0.04em',
                    }}
                  >
                    ✓ STATUS: SEDANG PKL (KEDUANYA ACC)
                  </span>
                </div>
                <h3 style={{ margin: '2px 0 0', fontSize: '1.3rem', fontWeight: 800, color: '#14532d' }}>
                  {siswa.mitraNama}
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: '#166534', maxWidth: '680px' }}>
                  Anda dan pihak mitra telah saling menyetujui. Status Anda kini resmi <strong>Sedang PKL</strong>. 
                  Jika ingin merubah keputusan tempat PKL, silakan <strong>hubungi guru pembimbing</strong>.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Link href="/dashboard/siswa/presensi" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span>📷 Ke Menu Presensi</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* KARTU NOMOR ID UNIK SISWA UNTUK UNDANGAN MITRA */}
      <div
        className="card"
        style={{
          marginBottom: 'var(--space-xl)',
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#ffffff',
          border: '1.5px solid rgba(59, 130, 246, 0.4)',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#60a5fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <IconIdCard size={26} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                🆔 NOMOR ID UNIK SISWA ANDA
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '3px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '1.45rem', fontWeight: 800, color: '#ffffff' }}>
                  {siswa.idUnik || 'PKL-SISWA-00512'}
                </span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="btn btn-sm"
                  style={{
                    background: copied ? '#10b981' : '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 600,
                    padding: '6px 12px',
                    borderRadius: '6px',
                  }}
                >
                  {copied ? '✓ Tersalin!' : '📋 Salin ID'}
                </button>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#cbd5e1' }}>
                Gunakan nomor unik ini untuk menerima undangan penempatan langsung dari Mitra PKL.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {undanganList.filter((u) => u.status === 'PENDING').length > 0 && (
              <button
                onClick={() => setActiveTab('UNDANGAN')}
                className="btn btn-sm"
                style={{ background: '#f59e0b', color: '#000', fontWeight: 700, border: 'none', padding: '8px 14px' }}
              >
                📩 Ada {undanganList.filter((u) => u.status === 'PENDING').length} Undangan Masuk!
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SYARAT ALUR: JIKA BIODATA BELUM LENGKAP */}
      {!siswa.biodataLengkap && (
        <div className="card" style={{ marginBottom: 'var(--space-xl)', background: '#fffbeb', border: '1.5px solid #fde68a' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <IconAlert size={28} style={{ color: '#d97706', flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#b45309' }}>Biodata Diri Belum Lengkap!</strong>
                <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#92400e' }}>
                  Lengkapi biodata di menu profile terlebih dahulu agar pendaftaran tempat PKL dapat diajukan ke mitra.
                </p>
              </div>
            </div>
            <Link href="/dashboard/siswa/profile" className="btn btn-sm btn-primary">
              👉 Lengkapi Biodata Sekarang
            </Link>
          </div>
        </div>
      )}

      {/* NAVIGASI TABS */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-primary)', marginBottom: 'var(--space-xl)' }}>
        <button
          onClick={() => setActiveTab('DIREKTORI')}
          style={{
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'DIREKTORI' ? '3px solid var(--color-primary)' : '3px solid transparent',
            color: activeTab === 'DIREKTORI' ? 'var(--color-primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'DIREKTORI' ? 700 : 500,
            cursor: 'pointer',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <IconBriefcase size={18} />
          <span>Daftar Lowongan Tempat PKL Mitra</span>
          <span className="badge badge-outline" style={{ fontSize: '0.7rem' }}>{mitraList.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('UNDANGAN')}
          style={{
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'UNDANGAN' ? '3px solid var(--color-primary)' : '3px solid transparent',
            color: activeTab === 'UNDANGAN' ? 'var(--color-primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'UNDANGAN' ? 700 : 500,
            cursor: 'pointer',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <IconIdCard size={18} />
          <span>Undangan Masuk Dari Mitra</span>
          {undanganList.filter((u) => u.status === 'PENDING').length > 0 && (
            <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
              {undanganList.filter((u) => u.status === 'PENDING').length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: DIREKTORI TEMPAT PKL MITRA */}
      {activeTab === 'DIREKTORI' && (
        <div>
          {/* FILTER & PENCARIAN */}
          <div className="card" style={{ marginBottom: 'var(--space-xl)', background: '#ffffff' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Cari Nama Mitra / Bidang / Alamat</label>
                <input
                  type="text"
                  placeholder="Ketik nama mitra atau keahlian..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Filter Sesuai Jurusan</label>
                <select
                  value={filterJurusan}
                  onChange={(e) => setFilterJurusan(e.target.value)}
                  className="form-input"
                >
                  <option value="ALL">Semua Jurusan</option>
                  <option value="Teknik Komputer dan Jaringan">Teknik Komputer dan Jaringan (TKJ)</option>
                  <option value="Rekayasa Perangkat Lunak">Rekayasa Perangkat Lunak (RPL)</option>
                  <option value="Multimedia">Multimedia / DKV</option>
                  <option value="Teknik Bisnis Sepeda Motor">Teknik Bisnis Sepeda Motor (TBSM)</option>
                  <option value="Akuntansi">Akuntansi & Keuangan Lembaga (AKL)</option>
                </select>
              </div>
            </div>
          </div>

          {/* GRID MITRA LIST */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
            {filteredMitra.map((m) => {
              // Status of student with this specific mitra
              const isCurrentJoined = siswa.mitraId === m.id && siswa.statusPKL === 'SEDANG_PKL';
              const appForThisMitra = pendaftaranList.find((p) => p.mitraId === m.id);
              const isWaitingACC = appForThisMitra?.status === 'MENUNGGU_ACC';
              const isApprovedByMitra = appForThisMitra?.status === 'DISETUJUI_MITRA';

              const sisaKuota = Math.max(0, m.kuotaTotal - m.kuotaTerisi);
              const kuotaPersen = Math.round((m.kuotaTerisi / m.kuotaTotal) * 100);

              return (
                <div
                  key={m.id}
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: isCurrentJoined
                      ? '2.5px solid #16a34a'
                      : isApprovedByMitra
                      ? '2px solid #22c55e'
                      : isWaitingACC
                      ? '2px solid #f59e0b'
                      : '1px solid var(--border-primary)',
                    background: isCurrentJoined ? '#fcfdfd' : '#ffffff',
                    position: 'relative',
                    boxShadow: isCurrentJoined ? '0 4px 16px rgba(22, 163, 74, 0.12)' : 'none',
                  }}
                >
                  <div>
                    {/* Header Mitra */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                      <span className="badge badge-info" style={{ fontSize: '0.72rem', fontWeight: 600 }}>
                        {m.bidang}
                      </span>
                      {isCurrentJoined ? (
                        <span
                          style={{
                            background: '#16a34a',
                            color: '#ffffff',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                          }}
                        >
                          ✓ Sedang PKL
                        </span>
                      ) : isApprovedByMitra ? (
                        <span className="badge badge-success" style={{ fontSize: '0.7rem', fontWeight: 700 }}>
                          🎉 Di-ACC Mitra
                        </span>
                      ) : isWaitingACC ? (
                        <span className="badge badge-warning" style={{ fontSize: '0.7rem', background: '#d97706', color: '#fff' }}>
                          ⏳ Menunggu ACC
                        </span>
                      ) : (
                        <span className={`badge ${sisaKuota > 0 ? 'badge-primary' : 'badge-danger'}`} style={{ fontSize: '0.7rem' }}>
                          {sisaKuota > 0 ? `${sisaKuota} Slot Tersisa` : 'Penuh'}
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '6px 0 4px', color: 'var(--text-primary)' }}>
                      {m.nama}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '12px' }}>
                      <IconMapPin size={15} style={{ flexShrink: 0 }} />
                      <span>{m.alamat}</span>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                      {m.deskripsi}
                    </p>

                    {/* Kuota Bar */}
                    <div style={{ marginBottom: '14px', background: 'var(--bg-primary)', padding: '10px 12px', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 600 }}>Kuota Pendaftar Magang:</span>
                        <span style={{ fontWeight: 700 }}>{m.kuotaTerisi} dari {m.kuotaTotal} siswa</span>
                      </div>
                      <div style={{ height: '7px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${kuotaPersen}%`,
                            background: kuotaPersen >= 100 ? '#ef4444' : kuotaPersen >= 80 ? '#f59e0b' : '#3b82f6',
                            borderRadius: '4px',
                            transition: 'width 0.4s ease',
                          }}
                        />
                      </div>
                    </div>

                    {/* Jadwal Jam Masuk & Pulang */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      <IconClock size={16} style={{ color: 'var(--color-primary)' }} />
                      <span><strong>Jadwal:</strong> {m.jamMasuk} - {m.jamPulang} WIB ({m.hariKerja})</span>
                    </div>

                    {/* Fasilitas */}
                    {m.fasilitas && m.fasilitas.length > 0 && (
                      <div style={{ marginBottom: '14px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                          Fasilitas PKL:
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                          {m.fasilitas.map((f, idx) => (
                            <span
                              key={idx}
                              style={{
                                fontSize: '0.75rem',
                                background: '#f1f5f9',
                                color: '#334155',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontWeight: 500,
                              }}
                            >
                              ✓ {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Narahubung */}
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', borderTop: '1px dashed var(--border-primary)', paddingTop: '10px', marginBottom: '14px' }}>
                      <span>Narahubung: <strong>{m.kontakPerson}</strong></span>
                    </div>
                  </div>

                  {/* TOMBOL AKSI BERDASARKAN ALUR MEKANISME PKL */}
                  <div style={{ marginTop: '10px' }}>
                    {/* KONDISI A: SISWA SEDANG PKL DI MITRA INI -> TOMBOL HIJAU 'SEDANG PKL' */}
                    {isCurrentJoined ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => handleInfoSedangPKL(m.nama)}
                          className="btn btn-sm w-full"
                          style={{
                            background: '#16a34a',
                            color: '#ffffff',
                            fontWeight: 700,
                            border: 'none',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 10px rgba(22, 163, 74, 0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                          }}
                        >
                          <IconCheck size={18} />
                          <span>Sedang PKL</span>
                        </button>
                      </div>
                    ) : siswa.statusPKL === 'SEDANG_PKL' ? (
                      /* KONDISI B: SISWA SUDAH SEDANG PKL DI TEMPAT LAIN -> KLIK DAFTAR AKAN MUNCUL POPUP PERINGATAN */
                      <div>
                        <button
                          type="button"
                          onClick={() => handleDaftarMitra(m.id, m.nama)}
                          className="btn btn-outline btn-sm w-full"
                          style={{
                            padding: '9px 16px',
                            fontWeight: 600,
                            borderColor: '#cbd5e1',
                            color: '#64748b',
                            background: '#f8fafc',
                          }}
                          title="Klik untuk info status PKL"
                        >
                          🏢 Daftar & Ajukan ke Mitra
                        </button>
                      </div>
                    ) : isApprovedByMitra ? (
                      /* KONDISI C: MITRA MENG-ACC -> SISWA HARUS KONFIRMASI BERSEDIA */
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div
                          style={{
                            textAlign: 'center',
                            padding: '6px',
                            background: '#dcfce7',
                            color: '#15803d',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                          }}
                        >
                          🎉 Mitra Meng-ACC! Konfirmasi kesediaan Anda:
                        </div>
                        <button
                          type="button"
                          disabled={submitting}
                          onClick={() => handleKonfirmasiBersedia(appForThisMitra.id, m.nama)}
                          className="btn btn-sm w-full"
                          style={{
                            background: '#16a34a',
                            color: '#ffffff',
                            fontWeight: 700,
                            padding: '9px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 4px 10px rgba(22, 163, 74, 0.2)',
                          }}
                        >
                          ✓ Konfirmasi Bersedia Magang
                        </button>
                        <button
                          type="button"
                          disabled={submitting}
                          onClick={() => handleBatalkanPendaftaran(appForThisMitra.id, m.nama)}
                          className="btn btn-sm btn-ghost w-full"
                          style={{ color: '#dc2626', fontSize: '0.78rem' }}
                        >
                          Tolak / Batalkan Tawaran Ini
                        </button>
                      </div>
                    ) : isWaitingACC ? (
                      /* KONDISI D: SEDANG MENUNGGU ACC MITRA */
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div
                          style={{
                            textAlign: 'center',
                            padding: '8px',
                            background: '#fef3c7',
                            color: '#b45309',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                          }}
                        >
                          ⏳ Menunggu ACC Mitra
                        </div>
                        <button
                          type="button"
                          disabled={submitting}
                          onClick={() => handleBatalkanPendaftaran(appForThisMitra.id, m.nama)}
                          className="btn btn-sm btn-outline w-full"
                          style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                        >
                          Batalkan Permohonan
                        </button>
                      </div>
                    ) : (
                      /* KONDISI E: BELUM DAFTAR -> SISWA BISA DAFTAR */
                      <button
                        type="button"
                        disabled={submitting || sisaKuota <= 0}
                        onClick={() => handleDaftarMitra(m.id, m.nama)}
                        className={`btn btn-sm w-full ${sisaKuota <= 0 ? 'btn-outline' : 'btn-primary'}`}
                        style={{ padding: '9px 16px', fontWeight: 700 }}
                      >
                        {sisaKuota <= 0 ? '✕ Kuota Penuh' : '🏢 Daftar & Ajukan ke Mitra'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: UNDANGAN MASUK DARI MITRA */}
      {activeTab === 'UNDANGAN' && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="card" style={{ marginBottom: 'var(--space-lg)', background: '#ffffff' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>
              Undangan Bergabung Dari Mitra Industri
            </h3>
            <p className="text-secondary text-sm" style={{ marginBottom: '20px' }}>
              Daftar industri mitra yang telah mengundang Anda secara langsung menggunakan Nomor ID Unik: <strong>{siswa.idUnik}</strong>.
            </p>

            {undanganList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 20px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)' }}>
                <span style={{ fontSize: '2.5rem' }}>📭</span>
                <h4 style={{ margin: '8px 0 4px', fontWeight: 700 }}>Belum Ada Undangan Masuk</h4>
                <p className="text-secondary text-sm" style={{ maxWidth: '480px', margin: '0 auto 16px' }}>
                  Belum ada mitra yang memasukkan nomor ID unik Anda. Anda dapat mendaftar langsung melalui tab <strong>&ldquo;Daftar Lowongan Tempat PKL Mitra&rdquo;</strong> di atas atau bagikan nomor ID unik Anda ke pihak perusahaan.
                </p>
                <button onClick={() => setActiveTab('DIREKTORI')} className="btn btn-primary btn-sm">
                  Lihat Tempat PKL Yang Buka Kuota
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {undanganList.map((u) => (
                  <div
                    key={u.id}
                    style={{
                      border: '1px solid var(--border-primary)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '18px',
                      background: u.status === 'ACCEPTED' ? '#f0fdf4' : '#ffffff',
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '14px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>{u.mitraNama}</h4>
                        <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>{u.bidangUsaha}</span>
                      </div>
                      <p style={{ margin: '0 0 6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        &ldquo;{u.pesan}&rdquo;
                      </p>
                      <span className="text-xs text-secondary">
                        📅 Dikirim pada: {u.tanggal}
                      </span>
                    </div>

                    <div>
                      {u.status === 'ACCEPTED' || (siswa.statusPKL === 'SEDANG_PKL' && siswa.mitraId === u.mitraId) ? (
                        <span className="badge badge-success" style={{ padding: '6px 14px' }}>
                          ✓ Undangan Diterima & Sedang PKL
                        </span>
                      ) : siswa.statusPKL === 'SEDANG_PKL' ? (
                        <button
                          type="button"
                          onClick={() =>
                            showAlert({
                              title: 'Peringatan Status PKL',
                              message: 'kamu sudah pkl, hubungi guru pembimbing jika ingin merubah keputusan tmpt pkl.',
                              type: 'warning',
                            })
                          }
                          className="btn btn-outline btn-sm"
                          style={{ padding: '8px 18px', color: '#64748b' }}
                        >
                          Terkunci (Sudah PKL)
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={submitting}
                          onClick={() => handleAcceptInvite(u.id, u.mitraNama)}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '8px 18px', fontWeight: 700 }}
                        >
                          ✓ Terima Undangan & Gabung
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
