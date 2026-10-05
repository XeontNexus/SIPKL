'use client';

import { useState, useEffect } from 'react';

export default function SiswaLogbookPage() {
  const [logbooks, setLogbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
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
  }, []);

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
    setFormLoading(true);
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
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Logbook Mingguan</h1>
          <p className="page-subtitle">Catat kegiatan PKL setiap minggu</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Tutup Form' : '➕ Tambah Logbook'}
        </button>
      </div>

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
