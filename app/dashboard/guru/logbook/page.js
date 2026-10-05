'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function GuruLogbookPage() {
  const { data: session } = useSession();
  const [logbooks, setLogbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLogbook, setSelectedLogbook] = useState(null);
  const [filterSiswa, setFilterSiswa] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewCatatan, setReviewCatatan] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchLogbooks();
  }, []);

  const fetchLogbooks = async () => {
    try {
      const res = await fetch('/api/guru/logbook');
      if (res.ok) {
        const data = await res.json();
        setLogbooks(data);
      } else {
        // Mock default data
        setLogbooks([
          {
            id: '1',
            namaSiswa: 'Ahmad Fauzi',
            jurusan: 'TKJ',
            mingguKe: 1,
            tanggalMulai: '2026-10-01',
            tanggalSelesai: '2026-10-05',
            kegiatan: 'Melakukan instalasi sistem operasi Linux Server pada mesin pengujian kantor, konfigurasi IP address statis, dan setting router gateway Mikrotik.',
            kendala: 'Kabel UTP sempat bermasalah pada crimping pin 3.',
            fotoUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&auto=format&fit=crop&q=60',
            status: 'SUBMITTED',
            catatanGuru: '',
          },
          {
            id: '2',
            namaSiswa: 'Siti Rahmawati',
            jurusan: 'RPL',
            mingguKe: 1,
            tanggalMulai: '2026-10-01',
            tanggalSelesai: '2026-10-05',
            kegiatan: 'Membuat modul autentikasi NextAuth, mendesain tampilan dashboard responsif menggunakan CSS modern dan integrasi API route.',
            kendala: 'Tidak ada kendala berarti.',
            fotoUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&auto=format&fit=crop&q=60',
            status: 'REVIEWED',
            catatanGuru: 'Bagus sekali Siti, lanjutkan pengerjaan modul penilaian!',
          },
          {
            id: '3',
            namaSiswa: 'Budi Santoso',
            jurusan: 'TKJ',
            mingguKe: 1,
            tanggalMulai: '2026-10-01',
            tanggalSelesai: '2026-10-05',
            kegiatan: 'Membantu maintenance PC workstation di ruang akuntansi dan crimping kabel LAN baru.',
            kendala: 'Persediaan konektor RJ45 sempat habis.',
            fotoUrl: '',
            status: 'SUBMITTED',
            catatanGuru: '',
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReview = (lb) => {
    setSelectedLogbook(lb);
    setReviewCatatan(lb.catatanGuru || '');
    setShowReviewModal(true);
  };

  const handleSaveReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/guru/logbook/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logbookId: selectedLogbook.id,
          catatan: reviewCatatan,
          status: 'REVIEWED',
        }),
      });

      setLogbooks(prev => prev.map(lb => {
        if (lb.id === selectedLogbook.id) {
          return { ...lb, catatanGuru: reviewCatatan, status: 'REVIEWED' };
        }
        return lb;
      }));

      setShowReviewModal(false);
      setMessage({ text: `Logbook ${selectedLogbook.namaSiswa} berhasil diverifikasi & diberi feedback!`, type: 'success' });
    } catch (err) {
      setMessage({ text: 'Gagal menyimpan feedback', type: 'danger' });
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = logbooks.filter(lb => {
    if (filterSiswa !== 'ALL' && lb.namaSiswa !== filterSiswa) return false;
    if (filterStatus !== 'ALL' && lb.status !== filterStatus) return false;
    return true;
  });

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Verifikasi Logbook Siswa</h1>
          <p className="page-subtitle">Pantau dan berikan feedback catatan kegiatan mingguan siswa bimbingan Anda</p>
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`} style={{ marginBottom: 'var(--space-md)' }}>
          {message.text}
        </div>
      )}

      {/* Filter */}
      <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label className="form-label" style={{ margin: 0, fontWeight: 600 }}>Filter Siswa:</label>
            <select className="form-control" style={{ width: '200px' }} value={filterSiswa} onChange={e => setFilterSiswa(e.target.value)}>
              <option value="ALL">Semua Siswa Bimbingan</option>
              <option value="Ahmad Fauzi">Ahmad Fauzi</option>
              <option value="Siti Rahmawati">Siti Rahmawati</option>
              <option value="Budi Santoso">Budi Santoso</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label className="form-label" style={{ margin: 0, fontWeight: 600 }}>Status Review:</label>
            <select className="form-control" style={{ width: '180px' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="ALL">Semua Status</option>
              <option value="SUBMITTED">⏳ Belum Diverifikasi</option>
              <option value="REVIEWED">✓ Sudah Diverifikasi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>No</th>
                <th>Siswa</th>
                <th>Minggu Ke</th>
                <th>Periode Tanggal</th>
                <th>Ringkasan Kegiatan</th>
                <th>Status</th>
                <th>Catatan Guru</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lb, idx) => (
                <tr key={lb.id || idx}>
                  <td>{idx + 1}</td>
                  <td>
                    <strong>{lb.namaSiswa}</strong>
                    <div className="text-xs text-secondary">{lb.jurusan}</div>
                  </td>
                  <td><span className="badge badge-info">Minggu {lb.mingguKe}</span></td>
                  <td style={{ fontSize: '0.85rem' }}>{lb.tanggalMulai} s/d {lb.tanggalSelesai}</td>
                  <td style={{ maxWidth: '300px' }}>
                    <p style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {lb.kegiatan}
                    </p>
                  </td>
                  <td>
                    {lb.status === 'REVIEWED' ? (
                      <span className="badge badge-success">✓ Sudah Diperiksa</span>
                    ) : (
                      <span className="badge badge-warning">⏳ Perlu Review</span>
                    )}
                  </td>
                  <td style={{ maxWidth: '200px', fontSize: '0.85rem' }}>
                    {lb.catatanGuru ? (
                      <span style={{ color: 'var(--color-primary)' }}>&ldquo;{lb.catatanGuru}&rdquo;</span>
                    ) : (
                      <span className="text-secondary">-</span>
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleOpenReview(lb)} className="btn btn-primary btn-sm">
                      {lb.status === 'REVIEWED' ? '✏️ Edit Feedback' : '📝 Periksa'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Review */}
      {showReviewModal && selectedLogbook && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Review Logbook Siswa</h3>
                <p className="text-sm text-secondary" style={{ margin: 0 }}>
                  {selectedLogbook.namaSiswa} (Minggu ke-{selectedLogbook.mingguKe})
                </p>
              </div>
              <button onClick={() => setShowReviewModal(false)} className="modal-close">&times;</button>
            </div>

            <div style={{ marginBottom: '16px', background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Kegiatan & Pekerjaan Siswa:
              </h4>
              <p style={{ margin: '0 0 12px', lineHeight: '1.6' }}>{selectedLogbook.kegiatan}</p>

              {selectedLogbook.kendala && (
                <>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-warning)', marginBottom: '4px' }}>
                    Kendala / Hambatan yang Dialami:
                  </h4>
                  <p style={{ margin: 0, fontStyle: 'italic', fontSize: '0.9rem' }}>{selectedLogbook.kendala}</p>
                </>
              )}

              {selectedLogbook.fotoUrl && (
                <div style={{ marginTop: '12px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Foto Dokumentasi Kegiatan:
                  </h4>
                  <img src={selectedLogbook.fotoUrl} alt="Dokumentasi" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                </div>
              )}
            </div>

            <form onSubmit={handleSaveReview}>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Catatan Bimbingan / Arahan Guru Pendamping *</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Tuliskan apresiasi, masukan teknis, atau instruksi perbaikan..."
                  className="form-control"
                  value={reviewCatatan}
                  onChange={e => setReviewCatatan(e.target.value)}
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowReviewModal(false)} className="btn btn-ghost">
                  Batal
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Menyimpan...' : '✓ ACC & Simpan Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
