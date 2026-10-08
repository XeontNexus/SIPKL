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

  // Invite student via Unique ID
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteIdUnik, setInviteIdUnik] = useState('');
  const [invitePesan, setInvitePesan] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteFeedback, setInviteFeedback] = useState('');
  const [inviteError, setInviteError] = useState('');

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
      }
    } catch (err) {
      setInviteError('Terjadi kesalahan jaringan.');
    } finally {
      setInviteLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard Mitra Industri</h1>
        <p className="page-subtitle">
          Selamat datang, {session?.user?.name || 'Mitra PKL'}! Kelola kehadiran dan penilaian siswa SMKN 1 Perhentian Raja.
        </p>
      </div>

      {/* Stats Cards with Line Icons */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="stat-card">
          <div className="stat-icon stat-icon-primary">
            <IconUsers size={24} />
          </div>
          <div className="stat-value">{stats.totalSiswa}</div>
          <div className="stat-label">Total Siswa Magang</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-success">
            <IconCheck size={24} />
          </div>
          <div className="stat-value">{stats.hadirHariIni}</div>
          <div className="stat-label">Hadir Hari Ini</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-warning">
            <IconClock size={24} />
          </div>
          <div className="stat-value">{stats.izinSakit}</div>
          <div className="stat-label">Izin / Sakit</div>
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

      {/* Student List in this Mitra */}
      <div className="card">
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Daftar Siswa Magang Aktif</h3>
            <span className="text-xs text-secondary">Kelola peserta magang industri di perusahaan Anda</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button
              onClick={() => setShowInviteForm(!showInviteForm)}
              className="btn btn-sm btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <IconIdCard size={15} />
              <span>{showInviteForm ? '✕ Tutup Form Undangan' : '➕ Undang Siswa via ID Unik'}</span>
            </button>
            <Link href="/dashboard/mitra/penilaian" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <IconNilai size={15} />
              <span>Input Nilai Siswa</span>
            </Link>
          </div>
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
