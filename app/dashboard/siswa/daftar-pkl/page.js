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

  const handleJoinMitra = async (mitraId, mitraNama) => {
    if (!siswa.biodataLengkap) {
      setError('Wajib melengkapi biodata (Nama, Kelas, Jurusan, Tanggal Lahir) di menu Profile terlebih dahulu!');
      return;
    }

    if (!confirm(`Konfirmasi pendaftaran magang di ${mitraNama}?`)) return;

    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/siswa/mitra-pkl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'JOIN', mitraId }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Gagal mendaftar ke tempat PKL.');
      } else {
        setMessage(json.message || `Berhasil mendaftar di ${mitraNama}!`);
        fetchData();
      }
    } catch (err) {
      setError('Terjadi kendala jaringan saat mendaftar.');
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
        setMessage(json.message || `Undangan dari ${mitraNama} diterima! Anda telah bergabung.`);
        fetchData();
      }
    } catch (err) {
      setError('Gagal memproses undangan.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLeaveMitra = async () => {
    if (!confirm('Apakah Anda yakin ingin membatalkan/keluar dari tempat PKL ini untuk memilih tempat baru?')) return;

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
        setMessage('Status tempat PKL berhasil direset. Silakan pilih tempat PKL baru.');
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
            Temukan info lowongan magang yang dibuka langsung oleh mitra, atau terima undangan menggunakan Nomor ID unik Anda.
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
                  Anda belum mengisi tanggal lahir atau data wajib lainnya. Lengkapi biodata terlebih dahulu agar pendaftaran tempat PKL dapat diproses.
                </p>
              </div>
            </div>
            <Link href="/dashboard/siswa/profile" className="btn btn-sm btn-primary">
              👉 Lengkapi Biodata Sekarang
            </Link>
          </div>
        </div>
      )}

      {/* KARTU TEMPAT PKL YANG SEDANG DIIKUTI SISWA SAAT INI */}
      {siswa.mitraId && (
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
                  ✓ Status PKL: Aktif Terdaftar
                </span>
                <h3 style={{ margin: '2px 0 0', fontSize: '1.25rem', fontWeight: 800, color: '#14532d' }}>
                  {siswa.mitraNama}
                </h3>
                <p style={{ margin: '3px 0 0', fontSize: '0.85rem', color: '#166534' }}>
                  Anda telah terdaftar di industri ini. Sekarang Anda sudah dapat mengakses menu <strong>Presensi</strong> dan <strong>Logbook Mingguan</strong>.
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

      {/* TABS SELECTOR */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: 'var(--space-lg)', borderBottom: '1px solid var(--border-primary)', paddingBottom: '12px', flexWrap: 'wrap' }}>
        <button
          className={`btn ${activeTab === 'DIREKTORI' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('DIREKTORI')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <IconBriefcase size={18} />
          <span>Daftar Kuota Tempat PKL ({filteredMitra.length})</span>
        </button>

        <button
          className={`btn ${activeTab === 'UNDANGAN' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('UNDANGAN')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', position: 'relative' }}
        >
          <span>📩 Undangan dari Mitra PKL</span>
          {undanganList.filter(u => u.status === 'PENDING').length > 0 && (
            <span
              style={{
                background: '#ef4444',
                color: '#fff',
                borderRadius: '999px',
                padding: '2px 7px',
                fontSize: '0.7rem',
                fontWeight: 700,
              }}
            >
              {undanganList.filter(u => u.status === 'PENDING').length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: DIREKTORI TEMPAT PKL YANG MEMBUKA LOWONGAN */}
      {activeTab === 'DIREKTORI' && (
        <div>
          {/* Search & Filter Bar */}
          <div className="card" style={{ marginBottom: 'var(--space-lg)', background: '#ffffff' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
              <div style={{ flex: '1 1 280px' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="🔍 Cari nama mitra, bidang industri, atau lokasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div style={{ minWidth: '220px' }}>
                <select
                  className="form-control"
                  value={filterJurusan}
                  onChange={(e) => setFilterJurusan(e.target.value)}
                >
                  <option value="ALL">Semua Bidang Jurusan</option>
                  <option value="Teknik Komputer">Teknik Komputer & Jaringan</option>
                  <option value="Rekayasa Perangkat">Rekayasa Perangkat Lunak</option>
                  <option value="Multimedia">Multimedia / DKV</option>
                  <option value="Sepeda Motor">Teknik Sepeda Motor</option>
                  <option value="Akuntansi">Akuntansi Keuangan</option>
                  <option value="Manajemen">Manajemen Perkantoran</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid Daftar Tempat PKL */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--space-lg)' }}>
            {filteredMitra.map((m) => {
              const isCurrent = siswa.mitraId === m.id;
              const sisaKuota = m.kuotaTotal - m.kuotaTerisi;
              const percentFilled = Math.round((m.kuotaTerisi / m.kuotaTotal) * 100);

              return (
                <div
                  key={m.id}
                  className="card"
                  style={{
                    background: '#ffffff',
                    border: isCurrent ? '2px solid var(--primary)' : '1px solid var(--border-primary)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                  }}
                >
                  {isCurrent && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: '#dcfce7',
                        color: '#15803d',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '999px',
                        border: '1px solid #86efac',
                      }}
                    >
                      ✓ Tempat PKL Anda Saat Ini
                    </span>
                  )}

                  <div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '10px',
                          background: 'var(--role-badge-bg)',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '1.1rem',
                          flexShrink: 0,
                        }}
                      >
                        {m.nama.slice(0, 2).toUpperCase()}
                      </div>
                      <div style={{ paddingRight: isCurrent ? '120px' : '0' }}>
                        <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {m.nama}
                        </h3>
                        <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                          {m.bidang}
                        </span>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 14px' }}>
                      {m.deskripsi}
                    </p>

                    {/* Meta info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <IconMapPin size={14} color="var(--primary)" />
                        <span>{m.alamat}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <IconClock size={14} color="#ea580c" />
                        <span>Jam Kerja: <strong>{m.jamMasuk} - {m.jamPulang} WIB</strong> ({m.hariKerja})</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <IconUsers size={14} color="#059669" />
                        <span>Kontak Pembimbing: {m.kontakPerson}</span>
                      </div>
                    </div>

                    {/* Kuota Bar */}
                    <div style={{ padding: '10px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>
                        <span>Kapasitas Kuota Magang:</span>
                        <span style={{ color: sisaKuota > 0 ? '#059669' : '#dc2626' }}>
                          {m.kuotaTerisi} / {m.kuotaTotal} ({sisaKuota > 0 ? `Sisa ${sisaKuota} Kuota` : 'Penuh'})
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${percentFilled}%`,
                            height: '100%',
                            background: percentFilled >= 100 ? '#ef4444' : percentFilled >= 70 ? '#f59e0b' : '#10b981',
                          }}
                        />
                      </div>
                    </div>

                    {/* Fasilitas */}
                    {m.fasilitas && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                        {m.fasilitas.map((f, i) => (
                          <span key={i} style={{ fontSize: '0.72rem', background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px' }}>
                            ✓ {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div>
                    {isCurrent ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link href="/dashboard/siswa/presensi" className="btn btn-sm btn-primary w-full" style={{ textAlign: 'center' }}>
                          ✓ Buka Presensi Di Mitra Ini
                        </Link>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={submitting || sisaKuota <= 0}
                        onClick={() => handleJoinMitra(m.id, m.nama)}
                        className={`btn btn-sm w-full ${sisaKuota <= 0 ? 'btn-outline' : 'btn-primary'}`}
                        style={{ padding: '9px 16px', fontWeight: 700 }}
                      >
                        {sisaKuota <= 0 ? '✕ Kuota Penuh' : '🏢 Gabung & Pilih Mitra Ini'}
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
                  Belum ada mitra yang memasukkan nomor ID unik Anda. Anda dapat mendaftar langsung melalui tab <strong>&ldquo;Daftar Kuota Tempat PKL&rdquo;</strong> di atas atau bagikan nomor ID unik Anda ke pembimbing mitra.
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
                          ✓ Undangan Diterima
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
