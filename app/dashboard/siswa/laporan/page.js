'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function SiswaLaporanPage() {
  const { data: session } = useSession();
  const [laporan, setLaporan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    judul: '',
    linkFile: '',
    abstrak: '',
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchLaporan();
  }, []);

  const fetchLaporan = async () => {
    try {
      const res = await fetch('/api/siswa/laporan');
      if (res.ok) {
        const data = await res.json();
        setLaporan(data);
        if (data) {
          setFormData({
            judul: data.judul || '',
            linkFile: data.fileUrl || '',
            abstrak: data.ringkasan || '',
          });
        }
      }
    } catch (err) {
      console.error('Error fetching laporan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/siswa/laporan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const result = await res.json();
        setLaporan(result.data || formData);
        setShowModal(false);
        setMessage({ text: 'Laporan akhir berhasil dikirim untuk direview guru pembimbing!', type: 'success' });
      } else {
        const err = await res.json();
        setMessage({ text: err.error || 'Gagal menyimpan laporan', type: 'danger' });
      }
    } catch (error) {
      setMessage({ text: 'Terjadi kesalahan jaringan', type: 'danger' });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return <span className="badge badge-success">✓ Disetujui (ACC)</span>;
      case 'REVIEWED':
        return <span className="badge badge-info">📝 Sedang Direvisi</span>;
      case 'SUBMITTED':
        return <span className="badge badge-warning">⏳ Menunggu Review Guru</span>;
      default:
        return <span className="badge badge-secondary">Belum Dikirim</span>;
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Laporan Akhir PKL</h1>
          <p className="page-subtitle">Submit dokumen laporan akhir PKL untuk dinilai oleh Guru Pendamping</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
          id="btn-submit-laporan"
        >
          {laporan ? '✏️ Edit / Submit Revisi' : '📤 Upload Laporan Akhir'}
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`} style={{ marginBottom: 'var(--space-md)' }}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="card text-center" style={{ padding: '40px' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
          <p className="text-secondary">Memuat data laporan...</p>
        </div>
      ) : !laporan ? (
        <div className="card">
          <div className="empty-state" style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>📄</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Belum Ada Laporan Dikirim</h3>
            <p className="text-secondary" style={{ maxWidth: '500px', margin: '0 auto 24px' }}>
              Kamu belum mengunggah laporan akhir magang. Pastikan laporan telah disusun sesuai format pedoman SMKN 1 Perhentian Raja.
            </p>
            <button onClick={() => setShowModal(true)} className="btn btn-primary">
              Mulai Unggah Laporan
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-lg)' }}>
          {/* Main Info */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <span className="text-xs text-secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Judul Laporan</span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '4px' }}>{laporan.judul || 'Laporan PKL'}</h2>
              </div>
              <div>{getStatusBadge(laporan.status)}</div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Abstrak / Ringkasan Pekerjaan
              </h4>
              <p style={{ lineHeight: '1.6', background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                {laporan.abstrak || laporan.ringkasan || 'Tidak ada ringkasan yang disertakan.'}
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Tautan Berkas Laporan
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-secondary)', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '1.5rem' }}>📎</span>
                <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <a href={laporan.linkFile || laporan.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
                    {laporan.linkFile || laporan.fileUrl || 'Link berkas tidak tersedia'}
                  </a>
                </div>
                <a
                  href={laporan.linkFile || laporan.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                >
                  Buka Berkas ↗
                </a>
              </div>
            </div>

            {laporan.catatanGuru && (
              <div style={{ background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ color: '#ca8a04', fontWeight: 600, marginBottom: '6px' }}>💬 Catatan / Feedback Guru Pendamping:</h4>
                <p style={{ margin: 0, fontSize: '0.95rem' }}>{laporan.catatanGuru}</p>
              </div>
            )}
          </div>

          {/* Guidelines Sidebar */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>📌 Petunjuk Pengumpulan</h3>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <li>Gunakan format PDF terstandar dengan ukuran maksimal 10 MB atau bagikan tautan Google Drive publik.</li>
              <li>Pastikan lembar pengesahan telah ditandatangani Mitra & Pembimbing.</li>
              <li>Periksa kembali sistematika: Bab I Pendahuluan s/d Bab IV Penutup & Lampiran Dokumentasi.</li>
              <li>Jika status laporan <strong style={{ color: 'var(--color-warning)' }}>Revisi</strong>, segera perbaiki dan unggah ulang berkas.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Form Laporan Akhir PKL</h3>
              <button onClick={() => setShowModal(false)} className="modal-close">&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Judul Laporan PKL *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rancang Bangun Jaringan LAN di Kantor Dinas..."
                  className="form-control"
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Link Berkas Laporan (PDF / Google Drive) *</label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/file/d/..."
                  className="form-control"
                  value={formData.linkFile}
                  onChange={(e) => setFormData({ ...formData, linkFile: e.target.value })}
                />
                <span className="text-xs text-secondary">Pastikan izin akses tautan Google Drive disetel ke 'Siapa saja yang memiliki link dapat melihat'.</span>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Ringkasan / Abstrak Laporan *</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Tuliskan gambaran umum kegiatan magang, pencapaian, dan kesimpulan..."
                  className="form-control"
                  value={formData.abstrak}
                  onChange={(e) => setFormData({ ...formData, abstrak: e.target.value })}
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">
                  Batal
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Menyimpan...' : 'Kirim Laporan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
