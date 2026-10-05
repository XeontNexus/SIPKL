'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function SiswaSuratIzinPage() {
  const { data: session } = useSession();
  const [suratList, setSuratList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [formData, setFormData] = useState({
    jenisSurat: 'IZIN_TIDAK_MASUK',
    tanggalMulai: '',
    tanggalSelesai: '',
    alasan: '',
    lampiranUrl: '',
  });

  useEffect(() => {
    fetchSurat();
  }, []);

  const fetchSurat = async () => {
    try {
      const res = await fetch('/api/siswa/surat-izin');
      if (res.ok) {
        const data = await res.json();
        setSuratList(data);
      }
    } catch (err) {
      console.error('Error fetching surat izin:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/siswa/surat-izin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowModal(false);
        setMessage({ text: 'Permohonan surat izin berhasil diajukan ke Admin!', type: 'success' });
        setFormData({
          jenisSurat: 'IZIN_TIDAK_MASUK',
          tanggalMulai: '',
          tanggalSelesai: '',
          alasan: '',
          lampiranUrl: '',
        });
        fetchSurat();
      } else {
        const err = await res.json();
        setMessage({ text: err.error || 'Gagal mengajukan izin', type: 'danger' });
      }
    } catch (err) {
      setMessage({ text: 'Terjadi kesalahan sistem', type: 'danger' });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return <span className="badge badge-success">✓ Disetujui (ACC Admin)</span>;
      case 'REJECTED':
        return <span className="badge badge-danger">✕ Ditolak</span>;
      default:
        return <span className="badge badge-warning">⏳ Menunggu Konfirmasi</span>;
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Pengajuan Surat & Izin</h1>
          <p className="page-subtitle">Ajukan surat izin magang atau permohonan dispensasi / tidak masuk PKL</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary" id="btn-ajukan-izin">
          ➕ Buat Pengajuan Baru
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`} style={{ marginBottom: 'var(--space-md)' }}>
          {message.text}
        </div>
      )}

      <div className="card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Riwayat Pengajuan Surat Izin</h3>
        {loading ? (
          <div className="text-center" style={{ padding: '30px' }}>
            <div className="spinner" style={{ margin: '0 auto 12px' }}></div>
            <p className="text-secondary">Memuat data...</p>
          </div>
        ) : suratList.length === 0 ? (
          <div className="empty-state" style={{ padding: '36px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>✉️</div>
            <h4>Belum Ada Pengajuan</h4>
            <p className="text-secondary">Kamu belum pernah mengajukan surat izin PKL maupun permohonan absen.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Jenis Pengajuan</th>
                  <th>Periode / Tanggal</th>
                  <th>Alasan</th>
                  <th>Lampiran Bukti</th>
                  <th>Status</th>
                  <th>Catatan Admin</th>
                </tr>
              </thead>
              <tbody>
                {suratList.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td>{idx + 1}</td>
                    <td>
                      <strong>
                        {item.jenisSurat === 'IZIN_MAGANG' ? '📄 Surat Pengantar Magang' : '🏥 Izin Sakit / Tidak Masuk'}
                      </strong>
                    </td>
                    <td>
                      {item.tanggalMulai} {item.tanggalSelesai ? `s/d ${item.tanggalSelesai}` : ''}
                    </td>
                    <td style={{ maxWidth: '240px' }}>{item.alasan}</td>
                    <td>
                      {item.lampiranUrl ? (
                        <a href={item.lampiranUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                          Lihat Berkas
                        </a>
                      ) : (
                        <span className="text-secondary">-</span>
                      )}
                    </td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td className="text-secondary">{item.catatanAdmin || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Pengajuan */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Formulir Pengajuan Izin / Surat</h3>
              <button onClick={() => setShowModal(false)} className="modal-close">&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Jenis Surat *</label>
                <select
                  className="form-control"
                  value={formData.jenisSurat}
                  onChange={(e) => setFormData({ ...formData, jenisSurat: e.target.value })}
                  required
                >
                  <option value="IZIN_TIDAK_MASUK">Izin Sakit / Keperluan Mendesak (Absen PKL)</option>
                  <option value="IZIN_MAGANG">Permohonan Surat Tugas / Pengantar Magang Mitra</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Mulai Tanggal *</label>
                  <input
                    type="date"
                    required
                    className="form-control"
                    value={formData.tanggalMulai}
                    onChange={(e) => setFormData({ ...formData, tanggalMulai: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Sampai Tanggal *</label>
                  <input
                    type="date"
                    required
                    className="form-control"
                    value={formData.tanggalSelesai}
                    onChange={(e) => setFormData({ ...formData, tanggalSelesai: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Keterangan / Alasan *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Jelaskan secara rinci alasan izin atau permohonan surat..."
                  className="form-control"
                  value={formData.alasan}
                  onChange={(e) => setFormData({ ...formData, alasan: e.target.value })}
                ></textarea>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Link Bukti / Surat Dokter (Opsional)</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/... atau foto bukti"
                  className="form-control"
                  value={formData.lampiranUrl}
                  onChange={(e) => setFormData({ ...formData, lampiranUrl: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">
                  Batal
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Mengirim...' : 'Ajukan Permohonan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
