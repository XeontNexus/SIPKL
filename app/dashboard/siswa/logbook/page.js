'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IconAlert, IconCheck, IconBriefcase, IconUser } from '@/components/Icons';

export default function SiswaLogbookPage() {
  const [logbooks, setLogbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [prerequisite, setPrerequisite] = useState({
    isReady: true,
    isBiodataComplete: true,
    hasJoinedMitra: true,
  });
  const [studentProfile, setStudentProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    mingguKe: '',
    tanggalMulai: '',
    tanggalSelesai: '',
    kegiatan: '',
    hasil: '',
    kendala: '',
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchLogbooks();
    fetchStudentPrerequisite();
  }, []);

  const fetchStudentPrerequisite = async () => {
    try {
      const res = await fetch('/api/siswa/profile');
      if (res.ok) {
        const json = await res.json();
        if (json.data) setStudentProfile(json.data);
        if (json.prerequisite) setPrerequisite(json.prerequisite);
      }
    } catch (err) {
      console.warn('Error load prerequisite:', err);
    }
  };

  const fetchLogbooks = async () => {
    try {
      const res = await fetch('/api/logbook');
      if (res.ok) {
        const data = await res.json();
        setLogbooks(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prerequisite.isBiodataComplete) {
      setErrorMessage('Anda wajib melengkapi biodata (Nama, Kelas, Jurusan, Tanggal Lahir) di menu Profile sebelum mengisi logbook.');
      return;
    }
    if (!prerequisite.hasJoinedMitra) {
      setErrorMessage('Anda belum bergabung dengan Mitra PKL mana pun. Pilih tempat PKL di menu Daftar Tempat PKL terlebih dahulu.');
      return;
    }

    setFormLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/logbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, status: 'SUBMITTED' }),
      });
      if (res.ok) {
        setShowForm(false);
        setFormData({ mingguKe: '', tanggalMulai: '', tanggalSelesai: '', kegiatan: '', hasil: '', kendala: '' });
        fetchLogbooks();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const statusBadge = (status) => {
    const map = {
      DRAFT: { class: 'badge-warning', label: '📝 Draft' },
      SUBMITTED: { class: 'badge-info', label: '📤 Submitted' },
      REVIEWED: { class: 'badge-success', label: '✅ Reviewed' },
    };
    const s = map[status] || map.DRAFT;
    return <span className={`badge ${s.class}`}>{s.label}</span>;
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
        <div>
          <h1 className="page-title">Logbook Mingguan Siswa</h1>
          <p className="page-subtitle">
            Catat jurnal kegiatan pekerjaan mingguan selama masa PKL di industri mitra.
          </p>
        </div>
        {prerequisite.isReady ? (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Tutup Form' : '➕ Tambah Logbook'}
          </button>
        ) : (
          <span className="badge badge-warning" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>
            🔒 Form Logbook Terkunci
          </span>
        )}
      </div>

      {/* PREREQUISITE GATEKEEPER BANNER */}
      {!prerequisite.isReady && (
        <div
          className="card"
          style={{
            marginBottom: 'var(--space-lg)',
            background: '#fffbeb',
            border: '2px solid #f59e0b',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <IconAlert size={30} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.15rem', fontWeight: 800, color: '#92400e' }}>
                Perhatian: Pengisian Logbook Masih Terkunci
              </h3>
              <p style={{ margin: '0 0 14px', fontSize: '0.88rem', color: '#78350f', lineHeight: '1.5' }}>
                Sebelum dapat membuat catatan jurnal dan logbook mingguan, Anda wajib menyelesaikan 2 syarat administrasi berikut:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                <div style={{ padding: '12px', background: '#ffffff', borderRadius: 'var(--radius-md)', border: prerequisite.isBiodataComplete ? '1.5px solid #86efac' : '1.5px solid #fde68a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>Tahap 1: Biodata Diri</span>
                    {prerequisite.isBiodataComplete ? (
                      <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>✓ Selesai</span>
                    ) : (
                      <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>Wajib Diisi</span>
                    )}
                  </div>
                  <p style={{ margin: '0 0 8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Nama Lengkap, Kelas, Jurusan, Tanggal Lahir, & NISN.
                  </p>
                  {!prerequisite.isBiodataComplete && (
                    <Link href="/dashboard/siswa/profile" className="btn btn-sm btn-primary w-full" style={{ fontSize: '0.78rem' }}>
                      👉 Lengkapi di Menu Profile
                    </Link>
                  )}
                </div>

                <div style={{ padding: '12px', background: '#ffffff', borderRadius: 'var(--radius-md)', border: prerequisite.hasJoinedMitra ? '1.5px solid #86efac' : '1.5px solid #fde68a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>Tahap 2: Gabung Mitra PKL</span>
                    {prerequisite.hasJoinedMitra ? (
                      <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>✓ Selesai ({studentProfile?.mitraNama})</span>
                    ) : (
                      <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>Belum Gabung</span>
                    )}
                  </div>
                  <p style={{ margin: '0 0 8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Pilih tempat magang industri atau terima undangan mitra.
                  </p>
                  {!prerequisite.hasJoinedMitra && (
                    <Link href="/dashboard/siswa/daftar-pkl" className="btn btn-sm btn-primary w-full" style={{ fontSize: '0.78rem' }}>
                      👉 Buka Menu Daftar Tempat PKL
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-danger" style={{ marginBottom: 'var(--space-md)' }}>
          {errorMessage}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
          <h4 style={{ marginBottom: 'var(--space-md)' }}>📓 Form Logbook Mingguan</h4>
          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Minggu Ke-</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  value={formData.mingguKe}
                  onChange={(e) => setFormData({ ...formData, mingguKe: e.target.value })}
                  required
                  placeholder="1"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tanggal Mulai</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.tanggalMulai}
                  onChange={(e) => setFormData({ ...formData, tanggalMulai: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Tanggal Selesai</label>
              <input
                type="date"
                className="form-input"
                value={formData.tanggalSelesai}
                onChange={(e) => setFormData({ ...formData, tanggalSelesai: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Kegiatan yang Dilakukan</label>
              <textarea
                className="form-input form-textarea"
                value={formData.kegiatan}
                onChange={(e) => setFormData({ ...formData, kegiatan: e.target.value })}
                required
                placeholder="Jelaskan kegiatan yang kamu lakukan minggu ini..."
                style={{ minHeight: '120px' }}
              />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Hasil (opsional)</label>
                <textarea
                  className="form-input form-textarea"
                  value={formData.hasil}
                  onChange={(e) => setFormData({ ...formData, hasil: e.target.value })}
                  placeholder="Hasil yang dicapai..."
                />
              </div>
              <div className="form-group">
                <label className="form-label">Kendala (opsional)</label>
                <textarea
                  className="form-input form-textarea"
                  value={formData.kendala}
                  onChange={(e) => setFormData({ ...formData, kendala: e.target.value })}
                  placeholder="Kendala yang dihadapi..."
                />
              </div>
            </div>
            <div className="flex gap-sm" style={{ justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Batal</button>
              <button type="submit" className="btn btn-primary" disabled={formLoading}>
                {formLoading ? 'Menyimpan...' : '📤 Submit Logbook'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Logbook List */}
      {loading ? (
        <div className="flex items-center justify-center" style={{ padding: '48px' }}>
          <div className="loading-spinner"></div>
        </div>
      ) : logbooks.length > 0 ? (
        <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
          {logbooks.map((lb) => (
            <div key={lb.id} className="card card-hover">
              <div className="flex justify-between items-center" style={{ marginBottom: '12px' }}>
                <h4>📓 Minggu ke-{lb.mingguKe}</h4>
                {statusBadge(lb.status)}
              </div>
              <p className="text-sm text-secondary" style={{ marginBottom: '8px' }}>
                📅 {new Date(lb.tanggalMulai).toLocaleDateString('id-ID')} — {new Date(lb.tanggalSelesai).toLocaleDateString('id-ID')}
              </p>
              <p style={{ marginBottom: '8px' }}>{lb.kegiatan}</p>
              {lb.hasil && <p className="text-sm"><strong>Hasil:</strong> {lb.hasil}</p>}
              {lb.kendala && <p className="text-sm text-warning"><strong>Kendala:</strong> {lb.kendala}</p>}
              {lb.catatanGuru && (
                <div style={{
                  marginTop: '12px',
                  padding: '12px',
                  background: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: '3px solid var(--primary)',
                }}>
                  <p className="text-sm"><strong>📝 Catatan Guru:</strong> {lb.catatanGuru}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📓</div>
            <h4 className="empty-state-title">Belum ada logbook</h4>
            <p className="empty-state-desc">Klik tombol &quot;Tambah Logbook&quot; untuk mulai mencatat</p>
          </div>
        </div>
      )}
    </div>
  );
}
