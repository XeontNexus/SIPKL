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

export default function SiswaDaftarPKLPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
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
    mitraId: 'mitra-1',
    mitraNama: 'PT Telkom Indonesia Witel Riau',
    statusPKL: 'SEDANG_PKL', // 'BELUM_GABUNG' | 'MENUNGGU_ACC' | 'SEDANG_PKL'
  });

  const [mitraList, setMitraList] = useState([]);
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

  const handleDaftarMitra = async (mitraId, mitraNama) => {
    if (!siswa.biodataLengkap) {
      setError('Wajib melengkapi biodata (Nama, Kelas, Jurusan, Tanggal Lahir) di menu Profile terlebih dahulu!');
      return;
    }

    if (siswa.statusPKL === 'MENUNGGU_ACC') {
      setError('Anda masih memiliki permohonan pendaftaran yang sedang menunggu ACC mitra lain. Batalkan terlebih dahulu jika ingin berpindah.');
      return;
    }

    if (siswa.statusPKL === 'SEDANG_PKL') {
      setError('Anda sudah berstatus aktif magang PKL di suatu mitra.');
      return;
    }

    if (!confirm(`Ajukan permohonan pendaftaran PKL ke ${mitraNama}? Permohonan ini akan ditinjau oleh pihak mitra dan menunggu ACC sebelum Anda dapat melakukan presensi.`)) return;

    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/siswa/mitra-pkl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'DAFTAR', mitraId }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Gagal mengajukan pendaftaran ke tempat PKL.');
      } else {
        setMessage(json.message || `Permohonan pendaftaran di ${mitraNama} berhasil dikirim! Menunggu ACC mitra.`);
        fetchData();
      }
    } catch (err) {
      setError('Terjadi kendala jaringan saat mengajukan pendaftaran.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBatalkanPendaftaran = async () => {
    if (!confirm('Batalkan permohonan pendaftaran ke tempat PKL ini? Setelah dibatalkan, Anda dapat memilih mitra lain.')) return;

    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/siswa/mitra-pkl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'BATALKAN_PENDAFTARAN' }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Gagal membatalkan permohonan pendaftaran.');
      } else {
        setMessage('Permohonan pendaftaran berhasil dibatalkan. Silakan pilih tempat PKL baru.');
        fetchData();
      }
    } catch (err) {
      setError('Kendala jaringan saat membatalkan permohonan.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptInvite = async (invitationId, mitraNama) => {
    if (!siswa.biodataLengkap) {
      setError('Wajib melengkapi biodata siswa di menu Profile sebelum menerima undangan.');
      return;
    }

    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/siswa/mitra-pkl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ACCEPT_INVITE', invitationId }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Gagal menerima undangan.');
      } else {
        setMessage(json.message || `Undangan dari ${mitraNama} diterima! Anda telah resmi bergabung dan akses presensi kini aktif.`);
        fetchData();
      }
    } catch (err) {
      setError('Gagal memproses undangan.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLeaveMitra = async () => {
    if (!confirm('Apakah Anda yakin ingin keluar dari tempat PKL ini untuk memilih tempat baru?')) return;

    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/siswa/mitra-pkl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'LEAVE' }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Gagal mereset tempat PKL.');
      } else {
        setMessage('Status tempat PKL berhasil direset. Silakan ajukan pendaftaran baru.');
        fetchData();
      }
    } catch (err) {
      setError('Kendala jaringan.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredMitra = mitraList.filter(m => {
    const matchSearch = m.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.bidang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.alamat.toLowerCase().includes(searchTerm.toLowerCase());

    const matchJurusan = filterJurusan === 'ALL' ||
      m.jurusanCocok?.some(j => j.toLowerCase().includes(filterJurusan.toLowerCase()));

    return matchSearch && matchJurusan;
  });

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div>
          <h1 className="page-title">Pendaftaran & Tempat PKL Mitra</h1>
          <p className="page-subtitle">
            Daftar ke lowongan yang dibuka mitra lalu tunggu persetujuan (ACC), atau terima undangan via Nomor ID Unik.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link href="/dashboard/siswa/profile" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <IconUser size={16} />
            <span>Lihat Profile Saya</span>
          </Link>
        </div>
      </div>

      {message && (
        <div className="alert alert-success" style={{ marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <IconCheck size={20} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <IconAlert size={20} />
          <span>{error}</span>
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
                Gunakan nomor unik ini untuk menerima undangan join otomatis dari Mitra PKL pilihan Anda.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {undanganList.filter(u => u.status === 'PENDING').length > 0 && (
              <button
                onClick={() => setActiveTab('UNDANGAN')}
                className="btn btn-sm"
                style={{ background: '#f59e0b', color: '#000', fontWeight: 700, border: 'none', padding: '8px 14px' }}
              >
                📩 Ada {undanganList.filter(u => u.status === 'PENDING').length} Undangan Masuk!
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
                  Anda belum melengkapi biodata wajib. Lengkapi biodata terlebih dahulu agar permohonan tempat PKL dapat diajukan dan di-ACC mitra.
                </p>
              </div>
            </div>
            <Link href="/dashboard/siswa/profile" className="btn btn-sm btn-primary">
              👉 Lengkapi Biodata Sekarang
            </Link>
          </div>
        </div>
      )}

      {/* KONDISI 1: STATUS SEDANG MENUNGGU ACC MITRA */}
      {siswa.statusPKL === 'MENUNGGU_ACC' && (
        <div
          className="card"
          style={{
            marginBottom: 'var(--space-xl)',
            background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
            border: '1.5px solid #fcd34d',
            boxShadow: '0 4px 16px rgba(245, 158, 11, 0.1)',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: '#fef08a',
                  color: '#b45309',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <IconClock size={26} />
              </div>
              <div>
                <span className="badge badge-warning" style={{ fontSize: '0.72rem', marginBottom: '4px', background: '#d97706', color: '#fff' }}>
                  ⏳ Status: Menunggu Persetujuan (ACC) dari Mitra
                </span>
                <h3 style={{ margin: '2px 0 0', fontSize: '1.25rem', fontWeight: 800, color: '#78350f' }}>
                  {siswa.mitraNama}
                </h3>
                <p style={{ margin: '3px 0 0', fontSize: '0.85rem', color: '#92400e', maxWidth: '640px' }}>
                  Permohonan pendaftaran magang Anda telah dikirim dan sedang dalam proses peninjauan oleh pihak mitra. 
                  <strong> Akses Presensi Harian dan Logbook Mingguan akan otomatis terbuka segera setelah pembimbing mitra meng-ACC permohonan Anda.</strong>
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleBatalkanPendaftaran}
                disabled={submitting}
                className="btn btn-sm btn-outline"
                style={{ background: '#ffffff', color: '#dc2626', borderColor: '#fca5a5' }}
              >
                Batalkan Permohonan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KONDISI 2: STATUS TELAH DI-ACC (AKTIF SEDANG PKL) */}
      {siswa.statusPKL === 'SEDANG_PKL' && (
        <div
          className="card card-glow"
          style={{
            marginBottom: 'var(--space-xl)',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
            border: '1.5px solid #86efac',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: '#dcfce7',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <IconCheck size={26} />
              </div>
              <div>
                <span className="badge badge-success" style={{ fontSize: '0.72rem', marginBottom: '4px' }}>
                  ✓ Status PKL: Telah Di-ACC & Resmi Aktif
                </span>
                <h3 style={{ margin: '2px 0 0', fontSize: '1.25rem', fontWeight: 800, color: '#14532d' }}>
                  {siswa.mitraNama}
                </h3>
                <p style={{ margin: '3px 0 0', fontSize: '0.85rem', color: '#166534' }}>
                  Permohonan Anda telah disetujui (ACC) oleh industri ini. Sekarang Anda sudah memiliki akses penuh ke menu <strong>Presensi</strong> dan <strong>Logbook Mingguan</strong>.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Link href="/dashboard/siswa/presensi" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span>📷 Ke Menu Presensi</span>
              </Link>
              <button
                type="button"
                onClick={handleLeaveMitra}
                disabled={submitting}
                className="btn btn-outline"
                style={{ background: '#ffffff', color: '#dc2626', borderColor: '#fca5a5' }}
              >
                Ganti Tempat PKL
              </button>
            </div>
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
          {undanganList.filter(u => u.status === 'PENDING').length > 0 && (
            <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
              {undanganList.filter(u => u.status === 'PENDING').length}
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
                  placeholder="Ketik pencarian..."
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
              const isCurrentJoined = siswa.mitraId === m.id && siswa.statusPKL === 'SEDANG_PKL';
              const isWaitingACC = siswa.mitraId === m.id && siswa.statusPKL === 'MENUNGGU_ACC';
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
                      ? '2px solid #22c55e'
                      : isWaitingACC
                      ? '2px solid #f59e0b'
                      : '1px solid var(--border-primary)',
                    background: '#ffffff',
                    position: 'relative',
                  }}
                >
                  <div>
                    {/* Header Mitra */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                      <span className="badge badge-info" style={{ fontSize: '0.72rem', fontWeight: 600 }}>
                        {m.bidang}
                      </span>
                      {isCurrentJoined ? (
                        <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                          ✓ Mitra Anda (Di-ACC)
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

                  {/* Tombol Aksi */}
                  <div style={{ marginTop: '10px' }}>
                    {isCurrentJoined ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link href="/dashboard/siswa/presensi" className="btn btn-primary btn-sm w-full" style={{ textAlign: 'center' }}>
                          📷 Buka Presensi
                        </Link>
                      </div>
                    ) : isWaitingACC ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ textAlign: 'center', padding: '8px', background: '#fef3c7', color: '#b45309', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
                          ⏳ Menunggu ACC Mitra
                        </div>
                        <button
                          type="button"
                          disabled={submitting}
                          onClick={handleBatalkanPendaftaran}
                          className="btn btn-sm btn-outline w-full"
                          style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                        >
                          Batalkan Pendaftaran
                        </button>
                      </div>
                    ) : siswa.statusPKL === 'MENUNGGU_ACC' ? (
                      <button
                        type="button"
                        disabled
                        className="btn btn-sm btn-outline w-full"
                        style={{ padding: '9px 16px', opacity: 0.6 }}
                        title="Anda sedang menunggu ACC dari mitra lain."
                      >
                        Sedang Menunggu ACC Mitra Lain
                      </button>
                    ) : (
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
                      {u.status === 'ACCEPTED' ? (
                        <span className="badge badge-success" style={{ padding: '6px 14px' }}>
                          ✓ Undangan Diterima & Di-ACC
                        </span>
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
