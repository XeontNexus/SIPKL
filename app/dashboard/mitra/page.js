'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  IconUsers,
  IconCheck,
  IconClock,
  IconNilai,
  IconQRCode,
  IconPresensi,
  IconIdCard,
  IconAlert,
  IconBriefcase,
  IconCheckCheck,
} from '@/components/Icons';

export default function MitraDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalSiswa: 4,
    hadirHariIni: 3,
    izinSakit: 1,
    sudahDinilai: 2,
  });
  const [siswaList, setSiswaList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Registration applications waiting for ACC
  const [pendaftarList, setPendaftarList] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);
  const [actionFeedback, setActionFeedback] = useState('');
  const [actionError, setActionError] = useState('');

  // Invite student via Unique ID
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteIdUnik, setInviteIdUnik] = useState('');
  const [invitePesan, setInvitePesan] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteFeedback, setInviteFeedback] = useState('');
  const [inviteError, setInviteError] = useState('');

  const fetchPendaftar = async () => {
    try {
      const res = await fetch('/api/mitra/pendaftar?mitraId=mitra-1');
      if (res.ok) {
        const json = await res.json();
        setPendaftarList(json.data || []);
      }
    } catch (err) {
      console.error('Error fetching pendaftar list:', err);
    }
  };

  const handleAccPendaftar = async (pendaftaranId, namaSiswa) => {
    if (!confirm(`Setujui (ACC) permohonan PKL ${namaSiswa}? Siswa akan resmi terdaftar dan langsung mendapatkan akses presensi serta logbook.`)) return;

    setActionLoading(pendaftaranId);
    setActionFeedback('');
    setActionError('');

    try {
      const res = await fetch('/api/mitra/pendaftar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ACC', pendaftaranId, catatanMitra: 'Disetujui oleh pembimbing industri.' }),
      });

      const json = await res.json();
      if (!res.ok) {
        setActionError(json.error || 'Gagal meng-ACC siswa.');
      } else {
        setActionFeedback(json.message || `Siswa ${namaSiswa} berhasil di-ACC!`);
        fetchPendaftar();
        fetchData();
      }
    } catch (err) {
      setActionError('Kendala jaringan saat memproses ACC.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleTolakPendaftar = async (pendaftaranId, namaSiswa) => {
    const alasan = prompt(`Tolak permohonan PKL ${namaSiswa}? Masukkan alasan penolakan:`, 'Kuota magang telah penuh.');
    if (alasan === null) return;

    setActionLoading(pendaftaranId);
    setActionFeedback('');
    setActionError('');

    try {
      const res = await fetch('/api/mitra/pendaftar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'TOLAK', pendaftaranId, catatanMitra: alasan || 'Kuota magang telah penuh.' }),
      });

      const json = await res.json();
      if (!res.ok) {
        setActionError(json.error || 'Gagal menolak permohonan.');
      } else {
        setActionFeedback(`Permohonan ${namaSiswa} telah ditolak.`);
        fetchPendaftar();
        fetchData();
      }
    } catch (err) {
      setActionError('Kendala jaringan saat menolak permohonan.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!inviteIdUnik.trim()) return;

    setInviteLoading(true);
    setInviteFeedback('');
    setInviteError('');

    try {
      const res = await fetch('/api/mitra/invite-siswa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idUnik: inviteIdUnik.trim(),
          mitraNama: session?.user?.name || 'PT Telkom Indonesia Witel Riau',
          mitraId: session?.user?.id || 'mitra-1',
          pesan: invitePesan || 'Selamat! Anda diundang magang di instansi kami. Silakan terima undangan ini untuk bergabung.',
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setInviteError(json.error || 'Gagal mengirimkan undangan.');
      } else {
        setInviteFeedback(json.message || 'Undangan berhasil dikirim!');
        setInviteIdUnik('');
        setInvitePesan('');
        fetchPendaftar();
      }
    } catch (err) {
      setInviteError('Terjadi kesalahan jaringan.');
    } finally {
      setInviteLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchPendaftar();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/mitra/dashboard');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats || stats);
        setSiswaList(data.siswaList || []);
      } else {
        setSiswaList([
          { id: '1', nama: 'Ahmad Fauzi', nisn: '0051234567', jurusan: 'Teknik Komputer dan Jaringan', statusPresensi: 'HADIR', nilaiStatus: 'SUDAH' },
          { id: '2', nama: 'Siti Rahmawati', nisn: '0057654321', jurusan: 'Rekayasa Perangkat Lunak', statusPresensi: 'HADIR', nilaiStatus: 'SUDAH' },
          { id: '3', nama: 'Budi Santoso', nisn: '0059876543', jurusan: 'Teknik Komputer dan Jaringan', statusPresensi: 'HADIR', nilaiStatus: 'BELUM' },
          { id: '4', nama: 'Dewi Lestari', nisn: '0053456789', jurusan: 'Multimedia / DKV', statusPresensi: 'IZIN', nilaiStatus: 'BELUM' },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const menungguAccCount = pendaftarList.filter((p) => p.status === 'MENUNGGU_ACC').length;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard Mitra Industri</h1>
        <p className="page-subtitle">
          Selamat datang, {session?.user?.name || 'PT Telkom Indonesia Witel Riau'}! Kelola pendaftaran tempat PKL, persetujuan (ACC), kehadiran, dan penilaian siswa.
        </p>
      </div>

      {actionFeedback && (
        <div className="alert alert-success" style={{ marginBottom: 'var(--space-lg)' }}>
          ✓ {actionFeedback}
        </div>
      )}

      {actionError && (
        <div className="alert alert-danger" style={{ marginBottom: 'var(--space-lg)' }}>
          ✕ {actionError}
        </div>
      )}

      {/* Stats Cards with Line Icons */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="stat-card">
          <div className="stat-icon stat-icon-primary">
            <IconUsers size={24} />
          </div>
          <div className="stat-value">{stats.totalSiswa}</div>
          <div className="stat-label">Total Siswa Magang Aktif</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-warning" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#d97706' }}>
            <IconClock size={24} />
          </div>
          <div className="stat-value" style={{ color: '#d97706' }}>{menungguAccCount}</div>
          <div className="stat-label">Permohonan Menunggu ACC</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-success">
            <IconCheck size={24} />
          </div>
          <div className="stat-value">{stats.hadirHariIni}</div>
          <div className="stat-label">Hadir Hari Ini</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-info">
            <IconNilai size={24} />
          </div>
          <div className="stat-value">{stats.sudahDinilai} / {stats.totalSiswa}</div>
          <div className="stat-label">Siswa Sudah Dinilai</div>
        </div>
      </div>

      {/* Quick Action Banners */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
        <div className="card card-glow" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(234,88,12,0.08) 100%)', border: '1px solid rgba(245,158,11,0.25)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <IconQRCode size={22} color="var(--primary)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                QR Code Presensi Harian
              </h3>
            </div>
            <p className="text-secondary text-sm" style={{ margin: '0 0 16px' }}>
              Tampilkan barcode QR di layar monitor kantor agar siswa magang dapat memindai kehadiran masuk dan pulang.
            </p>
          </div>
          <Link href="/dashboard/mitra/qr-presensi" className="btn btn-primary" style={{ padding: '9px 18px', fontSize: '0.9rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <IconQRCode size={16} />
            <span>Buka QR Presensi</span>
          </Link>
        </div>

        <div className="card card-glow" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(37,99,235,0.08) 100%)', border: '1px solid rgba(59,130,246,0.25)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <IconClock size={22} color="#2563eb" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                Pengaturan Jam Kerja Siswa PKL
              </h3>
            </div>
            <p className="text-secondary text-sm" style={{ margin: '0 0 16px' }}>
              Tentukan ketentuan Jam Masuk, Jam Pulang, dan toleransi kehadiran yang diinginkan pihak industri Anda.
            </p>
          </div>
          <Link href="/dashboard/mitra/jadwal" className="btn btn-outline" style={{ padding: '9px 18px', fontSize: '0.9rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#fff' }}>
            <IconClock size={16} />
            <span>⚙️ Atur Jam Masuk & Pulang</span>
          </Link>
        </div>
      </div>

      {/* BAGIAN 1: PERMOHONAN PENDAFTARAN PKL SISWA (ACC ALUR) */}
      <div className="card" style={{ marginBottom: 'var(--space-xl)', border: '1.5px solid #cbd5e1' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                📥 Permohonan Pendaftaran Tempat PKL Masuk
              </h3>
              {menungguAccCount > 0 && (
                <span className="badge badge-warning" style={{ fontWeight: 700, fontSize: '0.75rem', background: '#f59e0b', color: '#000' }}>
                  {menungguAccCount} Menunggu ACC
                </span>
              )}
            </div>
            <p className="text-xs text-secondary" style={{ margin: '4px 0 0' }}>
              Siswa yang mendaftar ke mitra Anda wajib di-ACC terlebih dahulu sebelum mereka dapat mengakses presensi & logbook.
            </p>
          </div>

          <button
            onClick={() => setShowInviteForm(!showInviteForm)}
            className="btn btn-sm btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <IconIdCard size={15} />
            <span>{showInviteForm ? '✕ Tutup Form Undangan' : '➕ Undang Siswa via ID Unik'}</span>
          </button>
        </div>

        {/* Form Undang Siswa via ID Unik */}
        {showInviteForm && (
          <div
            style={{
              padding: '18px',
              background: '#f8fafc',
              border: '1.5px solid #cbd5e1',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{ fontSize: '1.2rem' }}>📩</span>
              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>Kirim Undangan Bergabung ke Siswa</h4>
            </div>
            <p style={{ margin: '0 0 14px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Masukkan Nomor ID Unik siswa (contoh: <code>PKL-SISWA-00512</code>). Siswa akan langsung menerima notifikasi undangan di akun SIPKL mereka untuk bergabung ke perusahaan Anda.
            </p>

            {inviteFeedback && (
              <div className="alert alert-success" style={{ marginBottom: '14px', padding: '10px 14px', fontSize: '0.88rem' }}>
                ✓ {inviteFeedback}
              </div>
            )}

            {inviteError && (
              <div className="alert alert-danger" style={{ marginBottom: '14px', padding: '10px 14px', fontSize: '0.88rem' }}>
                ✕ {inviteError}
              </div>
            )}

            <form onSubmit={handleSendInvite}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>Nomor ID Unik Siswa *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: PKL-SISWA-00512"
                    className="form-control"
                    value={inviteIdUnik}
                    onChange={(e) => setInviteIdUnik(e.target.value)}
                    style={{ fontFamily: 'monospace', fontWeight: 700 }}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>Pesan Undangan (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Catatan sambutan atau penempatan divisi magang..."
                    className="form-control"
                    value={invitePesan}
                    onChange={(e) => setInvitePesan(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowInviteForm(false)}
                  className="btn btn-sm btn-ghost"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={inviteLoading || !inviteIdUnik.trim()}
                  className="btn btn-sm btn-primary"
                  style={{ padding: '8px 18px', fontWeight: 700 }}
                >
                  {inviteLoading ? 'Mengirim...' : '🚀 Kirim Undangan Join'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabel Permohonan Pendaftaran */}
        {pendaftarList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '2rem' }}>📭</span>
            <p style={{ margin: '8px 0 0', fontWeight: 600 }}>Belum ada permohonan pendaftaran siswa.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>ID Unik & Nama Siswa</th>
                  <th>Kelas & Jurusan</th>
                  <th>Tanggal Daftar</th>
                  <th>Status Persetujuan</th>
                  <th>Aksi Mitra</th>
                </tr>
              </thead>
              <tbody>
                {pendaftarList.map((p, idx) => (
                  <tr key={p.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <div>
                        <strong>{p.namaSiswa}</strong>
                        <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#2563eb' }}>
                          🆔 {p.idUnik}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>{p.kelas}</div>
                      <span className="text-xs text-secondary">{p.jurusan}</span>
                    </td>
                    <td>{p.tanggalDaftar}</td>
                    <td>
                      {p.status === 'DISETUJUI' ? (
                        <span className="badge badge-success">✓ Telah Di-ACC</span>
                      ) : p.status === 'DITOLAK' ? (
                        <span className="badge badge-danger">✕ Ditolak</span>
                      ) : (
                        <span className="badge badge-warning" style={{ background: '#f59e0b', color: '#000' }}>
                          ⏳ Menunggu ACC
                        </span>
                      )}
                    </td>
                    <td>
                      {p.status === 'MENUNGGU_ACC' ? (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            disabled={actionLoading === p.id}
                            onClick={() => handleAccPendaftar(p.id, p.namaSiswa)}
                            className="btn btn-sm btn-primary"
                            style={{ padding: '6px 12px', fontSize: '0.8rem', fontWeight: 700, background: '#16a34a', borderColor: '#16a34a' }}
                          >
                            ✓ ACC / Terima
                          </button>
                          <button
                            type="button"
                            disabled={actionLoading === p.id}
                            onClick={() => handleTolakPendaftar(p.id, p.namaSiswa)}
                            className="btn btn-sm btn-outline"
                            style={{ padding: '6px 10px', fontSize: '0.8rem', color: '#dc2626', borderColor: '#fca5a5' }}
                          >
                            Tolak
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-secondary">
                          {p.status === 'DISETUJUI' ? 'Akses Presensi Aktif' : p.catatanMitra || 'Selesai'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* BAGIAN 2: DAFTAR SISWA MAGANG AKTIF & PRESENSI */}
      <div className="card">
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Daftar Siswa Magang Aktif</h3>
            <span className="text-xs text-secondary">Kelola peserta magang yang telah resmi di-ACC di perusahaan Anda</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <Link href="/dashboard/mitra/penilaian" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <IconNilai size={15} />
              <span>Input Nilai Siswa</span>
            </Link>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Siswa</th>
                <th>NISN</th>
                <th>Kompetensi Keahlian</th>
                <th>Presensi Hari Ini</th>
                <th>Status Penilaian</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {siswaList.map((s, idx) => (
                <tr key={s.id || idx}>
                  <td>{idx + 1}</td>
                  <td><strong>{s.nama}</strong></td>
                  <td>{s.nisn}</td>
                  <td>{s.jurusan}</td>
                  <td>
                    {s.statusPresensi === 'HADIR' ? (
                      <span className="badge badge-success">✓ Hadir</span>
                    ) : s.statusPresensi === 'IZIN' ? (
                      <span className="badge badge-warning">Izin</span>
                    ) : (
                      <span className="badge badge-danger">Belum Hadir</span>
                    )}
                  </td>
                  <td>
                    {s.nilaiStatus === 'SUDAH' ? (
                      <span className="badge badge-success">✓ Sudah Dinilai</span>
                    ) : (
                      <span className="badge badge-warning">Menunggu Nilai</span>
                    )}
                  </td>
                  <td>
                    <Link href="/dashboard/mitra/penilaian" className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <IconNilai size={14} />
                      <span>Beri Nilai</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
