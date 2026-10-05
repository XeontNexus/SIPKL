'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function GuruLaporanPage() {
  const { data: session } = useSession();
  const [laporanList, setLaporanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLaporan, setSelectedLaporan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reviewStatus, setReviewStatus] = useState('APPROVED');
  const [reviewCatatan, setReviewCatatan] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchLaporan();
  }, []);

  const fetchLaporan = async () => {
    try {
      const res = await fetch('/api/guru/laporan');
      if (res.ok) {
        const data = await res.json();
        setLaporanList(data);
      } else {
        // Mock default data for demo
        setLaporanList([
          {
            id: '1',
            namaSiswa: 'Ahmad Fauzi',
            nisn: '0051234567',
            jurusan: 'TKJ',
            mitra: 'PT Telkom Indonesia Witel Riau',
            judul: 'Rancang Bangun Topologi Jaringan Fiber Optic dan Konfigurasi Routing BGP',
            fileUrl: 'https://drive.google.com/file/d/example1/view',
            ringkasan: 'Laporan merangkum implementasi jaringan fiber optic di kawasan perkantoran, setting OLT dan konfigurasi router gateway.',
            status: 'SUBMITTED',
            catatanGuru: '',
            tanggalSubmit: '2026-10-04',
          },
          {
            id: '2',
            namaSiswa: 'Siti Rahmawati',
            nisn: '0057654321',
            jurusan: 'RPL',
            mitra: 'CV Tech Inovasi Digital',
            judul: 'Pengembangan Sistem Informasi Presensi Berbasis Web di PT Mitra Solusi',
            fileUrl: 'https://drive.google.com/file/d/example2/view',
            ringkasan: 'Membahas perancangan arsitektur database PostgreSQL, REST API Next.js, dan testing performa antarmuka pengguna.',
            status: 'APPROVED',
            catatanGuru: 'Sistematika penulisan bab 1-4 sangat baik dan rapi. Laporan disetujui untuk maju ke sidang.',
            tanggalSubmit: '2026-10-02',
          },
          {
            id: '3',
            namaSiswa: 'Budi Santoso',
            nisn: '0059876543',
            jurusan: 'TKJ',
            mitra: 'PT Riau Cyber Solution',
            judul: 'Instalasi dan Pemeliharaan Jaringan Wireless Kantor Cabang',
            fileUrl: 'https://drive.google.com/file/d/example3/view',
            ringkasan: 'Laporan berisi dokumentasi setting Access Point UniFi, cabling CAT6, dan bandwidth management.',
            status: 'SUBMITTED',
            catatanGuru: '',
            tanggalSubmit: '2026-10-05',
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReview = (item) => {
    setSelectedLaporan(item);
    setReviewStatus(item.status === 'SUBMITTED' ? 'APPROVED' : item.status);
    setReviewCatatan(item.catatanGuru || '');
    setShowModal(true);
  };

  const handleSaveReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/guru/laporan/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          laporanId: selectedLaporan.id,
          status: reviewStatus,
          catatan: reviewCatatan,
        }),
      });

      setLaporanList(prev => prev.map(lap => {
        if (lap.id === selectedLaporan.id) {
          return {
            ...lap,
            status: reviewStatus,
            catatanGuru: reviewCatatan,
          };
        }
        return lap;
      }));

      setShowModal(false);
      setMessage({
        text: `Status laporan ${selectedLaporan.namaSiswa} berhasil diperbarui menjadi ${reviewStatus}!`,
        type: 'success',
      });
    } catch (err) {
      setMessage({ text: 'Gagal memperbarui review', type: 'danger' });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED': return <span className="badge badge-success">✓ Disetujui (ACC)</span>;
      case 'REVIEWED': return <span className="badge badge-warning">📝 Revisi</span>;
      default: return <span className="badge badge-info">⏳ Menunggu Review</span>;
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Pemeriksaan Laporan Akhir PKL</h1>
          <p className="page-subtitle">Evaluasi naskah dan dokumen laporan akhir magang siswa bimbingan</p>
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`} style={{ marginBottom: 'var(--space-md)' }}>
          {message.text}
        </div>
      )}

      <div className="card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>
          Daftar Pengumpulan Laporan
        </h3>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>No</th>
                <th>Siswa & Jurusan</th>
                <th>Mitra PKL</th>
                <th>Judul Laporan</th>
                <th>Tgl Submit</th>
                <th>Dokumen</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {laporanList.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td>{idx + 1}</td>
                  <td>
                    <strong>{item.namaSiswa}</strong>
                    <div className="text-xs text-secondary">{item.jurusan} - {item.nisn}</div>
                  </td>
                  <td>{item.mitra}</td>
                  <td style={{ maxWidth: '240px' }}>
                    <div style={{ fontWeight: 600 }}>{item.judul}</div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{item.tanggalSubmit}</td>
                  <td>
                    <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                      Buka File ↗
                    </a>
                  </td>
                  <td>{getStatusBadge(item.status)}</td>
                  <td>
                    <button onClick={() => handleOpenReview(item)} className="btn btn-primary btn-sm">
                      Review & ACC
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {showModal && selectedLaporan && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '620px' }}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Review Laporan Siswa</h3>
                <p className="text-sm text-secondary" style={{ margin: 0 }}>
                  {selectedLaporan.namaSiswa} - {selectedLaporan.judul}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="modal-close">&times;</button>
            </div>

            <div style={{ marginBottom: '16px', background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Ringkasan Abstrak:
              </h4>
              <p style={{ margin: '0 0 10px', fontSize: '0.9rem', lineHeight: '1.5' }}>{selectedLaporan.ringkasan}</p>
              <a href={selectedLaporan.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                📄 Unduh / Buka Dokumen Lengkap di Tab Baru ↗
              </a>
            </div>

            <form onSubmit={handleSaveReview}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Keputusan Review *</label>
                <select
                  className="form-control"
                  value={reviewStatus}
                  onChange={e => setReviewStatus(e.target.value)}
                  required
                >
                  <option value="APPROVED">✓ Disetujui (ACC Laporan Lulus)</option>
                  <option value="REVIEWED">📝 Perlu Perbaikan (Revisi)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Catatan Bimbingan / Bagian yang Harus Diperbaiki *</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Tuliskan catatan perbaikan halaman, format daftar pustaka, atau kata pengantar..."
                  className="form-control"
                  value={reviewCatatan}
                  onChange={e => setReviewCatatan(e.target.value)}
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">
                  Batal
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Menyimpan...' : 'Simpan Keputusan Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
