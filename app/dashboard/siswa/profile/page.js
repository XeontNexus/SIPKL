'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  IconUser,
  IconCheck,
  IconAlert,
  IconBriefcase,
  IconIdCard,
} from '@/components/Icons';

export default function SiswaProfilePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const [profile, setProfile] = useState({
    idUnik: 'PKL-SISWA-00512',
    nama: 'Ahmad Fauzi',
    nisn: '0051234567',
    kelas: 'XII TKJ 1',
    jurusan: 'Teknik Komputer dan Jaringan',
    tanggalLahir: '2008-05-14',
    noHp: '081234567890',
    alamat: 'Jl. Raya Perhentian Raja No. 45, Kampar',
    biodataLengkap: true,
    mitraId: 'mitra-1',
    mitraNama: 'PT Telkom Indonesia Witel Riau',
    mitraBidang: 'Telekomunikasi & Jaringan Komputer',
    statusPKL: 'SEDANG_PKL',
  });

  const daftarJurusan = [
    'Teknik Komputer dan Jaringan',
    'Rekayasa Perangkat Lunak',
    'Desain Komunikasi Visual',
    'Teknik Bisnis Sepeda Motor',
    'Akuntansi dan Keuangan Lembaga',
    'Manajemen Perkantoran',
  ];

  const daftarKelas = [
    'XII TKJ 1',
    'XII TKJ 2',
    'XII RPL 1',
    'XII DKV 1',
    'XII TBSM 1',
    'XII AKL 1',
    'XII MP 1',
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/siswa/profile');
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setProfile(json.data);
        }
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyId = () => {
    if (profile.idUnik) {
      navigator.clipboard.writeText(profile.idUnik);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/siswa/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Gagal menyimpan biodata');
      } else {
        setMessage('Biodata profil siswa berhasil diperbarui! Data tersimpan di sistem.');
        if (json.data) setProfile(json.data);
      }
    } catch (err) {
      setError('Terjadi kendala jaringan saat menyimpan biodata.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div>
          <h1 className="page-title">Profil & Biodata Siswa PKL</h1>
          <p className="page-subtitle">
            Lengkapi data diri Anda. Biodata lengkap dan pendaftaran ke mitra wajib diisi sebelum mengisi Presensi & Logbook Mingguan.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link href="/dashboard/siswa/daftar-pkl" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <IconBriefcase size={16} />
            <span>Pilih Tempat PKL</span>
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

      {/* KARTU NOMOR ID UNIK SISWA (Dibuat sejak akun aktif untuk undangan mitra) */}
      <div
        className="card card-glow"
        style={{
          marginBottom: 'var(--space-xl)',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          border: '1.5px solid rgba(59, 130, 246, 0.4)',
          position: 'relative',
          overflow: 'hidden',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#60a5fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}
            >
              <IconIdCard size={30} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                🆔 NOMOR ID UNIK SISWA (PERMANEN)
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '1.6rem',
                    fontWeight: 900,
                    letterSpacing: '0.06em',
                    color: '#ffffff',
                    background: 'rgba(255, 255, 255, 0.08)',
                    padding: '4px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  {profile.idUnik || 'PKL-SISWA-00512'}
                </span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="btn btn-sm"
                  style={{
                    background: copied ? '#10b981' : '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 600,
                    padding: '8px 14px',
                    borderRadius: '8px',
                  }}
                >
                  {copied ? '✓ Berhasil Disalin!' : '📋 Salin Nomor ID'}
                </button>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: '0.82rem', color: '#cbd5e1', maxWidth: '640px', lineHeight: '1.5' }}>
                Nomor ID ini otomatis aktif sejak pembuatan akun. Bagikan nomor ID unik ini kepada pembimbing <strong>Mitra Industri</strong> agar mitra dapat langsung mengundang Anda bergabung ke perusahaan mereka tanpa perlu mencari manual.
              </p>
            </div>
          </div>

          {/* Status Badges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Status Biodata:</span>
              {profile.biodataLengkap ? (
                <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>✓ Biodata Lengkap</span>
              ) : (
                <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}>⚠️ Perlu Dilengkapi</span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Mitra Industri:</span>
              {profile.mitraId ? (
                <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>🏢 {profile.mitraNama}</span>
              ) : (
                <span className="badge badge-danger" style={{ fontSize: '0.75rem' }}>✕ Belum Gabung Mitra</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Syarat Alur Peringatan Jika Belum Lengkap */}
      {(!profile.biodataLengkap || !profile.mitraId) && (
        <div className="card" style={{ marginBottom: 'var(--space-xl)', background: '#fffbeb', border: '1.5px solid #fde68a' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <IconAlert size={24} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: '#b45309', fontSize: '1rem' }}>Perhatian Alur Pendaftaran PKL:</strong>
              <p style={{ margin: '4px 0 8px', fontSize: '0.88rem', color: '#92400e', lineHeight: '1.5' }}>
                Sebelum Anda dapat melakukan presensi harian atau mengisi logbook mingguan, sistem mewajibkan:
              </p>
              <ol style={{ paddingLeft: '18px', margin: 0, fontSize: '0.85rem', color: '#92400e', lineHeight: '1.6' }}>
                <li><strong>Mengisi Biodata Lengkap:</strong> Nama, Kelas, Jurusan, dan Tanggal Lahir pada formulir di bawah.</li>
                <li><strong>Bergabung ke Mitra Industri:</strong> Pilih mitra di menu <Link href="/dashboard/siswa/daftar-pkl" style={{ color: '#b45309', fontWeight: 700, textDecoration: 'underline' }}>Daftar Tempat PKL</Link> atau minta mitra mengundang Anda menggunakan Nomor ID Unik di atas.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Form Profil & Biodata Siswa */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'var(--space-xl)' }}>
        <div className="card" style={{ background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--border-primary)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconUser size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Formulir Biodata Diri</h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Periksa dan lengkapi data akademik sesuai data pokok pendidikan (Dapodik)
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Nama Lengkap Siswa *</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="Nama lengkap sesuai ijazah..."
                value={profile.nama}
                onChange={(e) => setProfile({ ...profile, nama: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">NISN (Nomor Induk Siswa Nasional) *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="005xxxxxxx"
                  value={profile.nisn}
                  onChange={(e) => setProfile({ ...profile, nisn: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tanggal Lahir *</label>
                <input
                  type="date"
                  required
                  className="form-control"
                  value={profile.tanggalLahir || ''}
                  onChange={(e) => setProfile({ ...profile, tanggalLahir: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">Kompetensi Keahlian (Jurusan) *</label>
                <select
                  required
                  className="form-control"
                  value={profile.jurusan}
                  onChange={(e) => setProfile({ ...profile, jurusan: e.target.value })}
                >
                  <option value="">Pilih Jurusan...</option>
                  {daftarJurusan.map((j) => (
                    <option key={j} value={j}>{j}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Rombel / Kelas Aktif *</label>
                <select
                  required
                  className="form-control"
                  value={profile.kelas}
                  onChange={(e) => setProfile({ ...profile, kelas: e.target.value })}
                >
                  <option value="">Pilih Kelas...</option>
                  {daftarKelas.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Nomor Handphone / WhatsApp</label>
              <input
                type="tel"
                className="form-control"
                placeholder="Contoh: 081234567890"
                value={profile.noHp || ''}
                onChange={(e) => setProfile({ ...profile, noHp: e.target.value })}
              />
              <span className="text-xs text-secondary">Digunakan oleh pihak sekolah dan mitra untuk konfirmasi penting.</span>
            </div>

            <div className="form-group" style={{ marginBottom: '22px' }}>
              <label className="form-label">Alamat Tempat Tinggal Saat Ini</label>
              <textarea
                rows="3"
                className="form-control"
                placeholder="Alamat domisili lengkap beserta RT/RW atau nama desa..."
                value={profile.alamat || ''}
                onChange={(e) => setProfile({ ...profile, alamat: e.target.value })}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary w-full"
              style={{ padding: '12px', fontSize: '1rem', fontWeight: 700 }}
            >
              {saving ? 'Menyimpan Perubahan...' : '💾 Simpan Biodata Profil'}
            </button>
          </form>
        </div>

        {/* Informasi Status Kemitraan PKL Siswa */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div className="card" style={{ background: '#ffffff' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconBriefcase size={20} color="var(--primary)" />
              <span>Status Tempat PKL / Mitra Industri</span>
            </h3>

            {profile.mitraId ? (
              <div style={{ padding: '16px', background: '#f0fdf4', borderRadius: 'var(--radius-md)', border: '1px solid #bbf7d0' }}>
                <span className="badge badge-success" style={{ marginBottom: '8px' }}>
                  ✓ Terdaftar di Mitra Industri
                </span>
                <h4 style={{ margin: '2px 0 0', fontSize: '1.2rem', fontWeight: 800, color: '#166534' }}>
                  {profile.mitraNama}
                </h4>
                <p style={{ margin: '4px 0 12px', fontSize: '0.85rem', color: '#15803d' }}>
                  Bidang: {profile.mitraBidang || 'Industri Mitra'}
                </p>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <Link href="/dashboard/siswa/daftar-pkl" className="btn btn-sm btn-outline" style={{ background: '#ffffff', color: '#15803d', borderColor: '#86efac' }}>
                    🏢 Lihat Info Mitra Lengkap
                  </Link>
                  <Link href="/dashboard/siswa/presensi" className="btn btn-sm btn-primary">
                    📷 Buka Presensi Harian
                  </Link>
                </div>
              </div>
            ) : (
              <div style={{ padding: '18px', background: '#fef2f2', borderRadius: 'var(--radius-md)', border: '1px solid #fecaca', textAlign: 'center' }}>
                <div style={{ color: '#dc2626', marginBottom: '8px' }}>
                  <IconAlert size={36} />
                </div>
                <h4 style={{ margin: '0 0 6px', fontSize: '1.05rem', fontWeight: 700, color: '#991b1b' }}>
                  Belum Bergabung dengan Mitra PKL
                </h4>
                <p style={{ margin: '0 0 16px', fontSize: '0.85rem', color: '#b91c1c' }}>
                  Anda belum terdaftar di tempat magang mana pun. Pilih tempat magang yang membuka lowongan atau gunakan Nomor ID unik Anda untuk diundang oleh mitra.
                </p>
                <Link href="/dashboard/siswa/daftar-pkl" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <IconBriefcase size={16} />
                  <span>Daftar / Pilih Tempat PKL Sekarang</span>
                </Link>
              </div>
            )}
          </div>

          <div className="card" style={{ background: '#ffffff' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px' }}>
              💡 Panduan Nomor ID Unik Siswa:
            </h4>
            <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              <li>
                Setiap siswa SMKN 1 Perhentian Raja memiliki <strong>1 Nomor ID Unik</strong> yang tidak akan berubah sejak akun dibuat.
              </li>
              <li>
                Jika mitra industri Anda membuka kuota dan meminta ID siswa, berikan nomor ID unik ini: <strong style={{ color: 'var(--text-primary)' }}>{profile.idUnik}</strong>.
              </li>
              <li>
                Mitra dapat langsung memasukkan ID unik Anda ke sistem SIPKL untuk mengirimkan undangan otomatis tanpa Anda perlu mendaftar manual.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
