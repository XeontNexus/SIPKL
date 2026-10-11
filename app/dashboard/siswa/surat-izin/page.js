'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useModalAlert } from '@/components/ModalAlert';

export default function SiswaSuratIzinPage() {
  const { data: session } = useSession();
  const { showAlert } = useModalAlert();

  const [suratList, setSuratList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    jenisSurat: 'IZIN_MAGANG',
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

    try {
      const res = await fetch('/api/siswa/surat-izin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          jenisSurat: 'IZIN_MAGANG',
        }),
      });

      if (res.ok) {
        setShowModal(false);
        await showAlert({
          title: 'Pengajuan Terkirim',
          message: 'Permohonan surat pengantar tugas PKL berhasil diajukan ke Bagian Administrasi / Tata Usaha!',
          type: 'success',
        });
        setFormData({
          jenisSurat: 'IZIN_MAGANG',
          tanggalMulai: '',
          tanggalSelesai: '',
          alasan: '',
          lampiranUrl: '',
        });
        fetchSurat();
      } else {
        const err = await res.json();
        await showAlert({
          title: 'Gagal Mengajukan',
          message: err.error || 'Gagal mengajukan permohonan surat pengantar.',
          type: 'error',
        });
      }
    } catch (err) {
      await showAlert({
        title: 'Kesalahan Sistem',
        message: 'Terjadi kesalahan sistem saat mengirim permohonan.',
        type: 'error',
      });
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
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="page-title">Surat Pengantar & Izin Magang PKL</h1>
          <p className="page-subtitle">Ajukan permohonan surat tugas / pengantar resmi sekolah ke industri mitra PKL</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary" id="btn-ajukan-izin">
          ➕ Ajukan Surat Pengantar Magang
        </button>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Riwayat Surat Pengantar Magang PKL</h3>
        {loading ? (
          <div className="text-center" style={{ padding: '30px' }}>
            <div className="spinner" style={{ margin: '0 auto 12px' }}></div>
            <p className="text-secondary">Memuat data...</p>
          </div>
        ) : suratList.length === 0 ? (
          <div className="empty-state" style={{ padding: '36px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>✉️</div>
            <h4>Belum Ada Pengajuan Surat</h4>
            <p className="text-secondary">Kamu belum pernah mengajukan surat pengantar resmi magang PKL ke industri.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Jenis Pengajuan</th>
                  <th>Periode / Tanggal</th>
                  <th>Tujuan Mitra & Alasan</th>
                  <th>Lampiran Berkas</th>
                  <th>Status</th>
                  <th>Catatan Admin</th>
                </tr>
              </thead>
              <tbody>
                {suratList.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td>{idx + 1}</td>
                    <td>
                      <strong style={{ color: 'var(--primary)' }}>
                        📄 Surat Pengantar Magang PKL
                      </strong>
                    </td>
                    <td>
                      {item.tanggalMulai} {item.tanggalSelesai ? `s/d ${item.tanggalSelesai}` : ''}
                    </td>
                    <td style={{ maxWidth: '260px' }}>{item.alasan}</td>
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
              <h3 className="modal-title">Formulir Surat Pengantar Magang PKL</h3>
              <button onClick={() => setShowModal(false)} className="modal-close">&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Jenis Dokumen</label>
                <div style={{ padding: '10px 14px', background: '#f1f5f9', borderRadius: '8px', fontWeight: 600, color: '#334155' }}>
                  📄 Permohonan Surat Tugas / Pengantar Magang Mitra
                </div>
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
                <label className="form-label">Nama Mitra Industri & Keperluan Surat *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Contoh: Permohonan surat pengantar tugas resmi dari SMKN 1 ke PT Telkom Riau untuk keperluan administrasi pendaftaran PKL."
                  className="form-control"
                  value={formData.alasan}
                  onChange={(e) => setFormData({ ...formData, alasan: e.target.value })}
                ></textarea>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Link Berkas / Proposal Magang (Opsional)</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/... atau link proposal"
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
                  {submitting ? 'Mengirim...' : 'Ajukan Surat Pengantar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
