'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function MitraPenilaianPage() {
  const { data: session } = useSession();
  const [siswaList, setSiswaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSiswa, setSelectedSiswa] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [formNilai, setFormNilai] = useState({
    disiplin: 85,
    keterampilan: 85,
    kerjasama: 85,
    inisiatif: 85,
    catatan: '',
  });

  useEffect(() => {
    fetchSiswa();
  }, []);

  const fetchSiswa = async () => {
    try {
      const res = await fetch('/api/mitra/penilaian');
      if (res.ok) {
        const data = await res.json();
        setSiswaList(data);
      } else {
        // Mock default list for demo
        setSiswaList([
          {
            id: '1',
            nama: 'Ahmad Fauzi',
            nisn: '0051234567',
            jurusan: 'Teknik Komputer dan Jaringan',
            nilaiMitra: { disiplin: 88, keterampilan: 90, kerjasama: 85, inisiatif: 87, rataRata: 87.5, catatan: 'Siswa sangat teliti dan cepat beradaptasi dengan server perusahaan.', status: 'SUDAH' },
          },
          {
            id: '2',
            nama: 'Siti Rahmawati',
            nisn: '0057654321',
            jurusan: 'Rekayasa Perangkat Lunak',
            nilaiMitra: { disiplin: 92, keterampilan: 94, kerjasama: 90, inisiatif: 91, rataRata: 91.8, catatan: 'Mampu menyelesaikan task frontend dashboard tepat waktu.', status: 'SUDAH' },
          },
          {
            id: '3',
            nama: 'Budi Santoso',
            nisn: '0059876543',
            jurusan: 'Teknik Komputer dan Jaringan',
            nilaiMitra: null,
          },
          {
            id: '4',
            nama: 'Dewi Lestari',
            nisn: '0053456789',
            jurusan: 'Multimedia / DKV',
            nilaiMitra: null,
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (siswa) => {
    setSelectedSiswa(siswa);
    if (siswa.nilaiMitra) {
      setFormNilai({
        disiplin: siswa.nilaiMitra.disiplin || 85,
        keterampilan: siswa.nilaiMitra.keterampilan || 85,
        kerjasama: siswa.nilaiMitra.kerjasama || 85,
        inisiatif: siswa.nilaiMitra.inisiatif || 85,
        catatan: siswa.nilaiMitra.catatan || '',
      });
    } else {
      setFormNilai({
        disiplin: 85,
        keterampilan: 85,
        kerjasama: 85,
        inisiatif: 85,
        catatan: '',
      });
    }
    setShowModal(true);
  };

  const currentAverage = Math.round(
    (Number(formNilai.disiplin) +
      Number(formNilai.keterampilan) +
      Number(formNilai.kerjasama) +
      Number(formNilai.inisiatif)) / 4
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/mitra/penilaian', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siswaId: selectedSiswa.id,
          ...formNilai,
          rataRata: currentAverage,
        }),
      });

      // Update local state
      setSiswaList(prev => prev.map(s => {
        if (s.id === selectedSiswa.id) {
          return {
            ...s,
            nilaiMitra: {
              ...formNilai,
              rataRata: currentAverage,
              status: 'SUDAH',
            }
          };
        }
        return s;
      }));

      setShowModal(false);
      setMessage({
        text: `Penilaian untuk ${selectedSiswa.nama} berhasil disimpan! Nilai kini dapat dilihat oleh Admin, Guru Pembimbing, dan Siswa.`,
        type: 'success',
      });
    } catch (err) {
      setMessage({ text: 'Gagal menyimpan penilaian', type: 'danger' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Penilaian Kinerja Siswa PKL</h1>
          <p className="page-subtitle">
            Berikan evaluasi kompetensi kerja industri untuk siswa magang di instansi/perusahaan Anda.
          </p>
        </div>
        <button onClick={() => window.print()} className="btn btn-outline">
          🖨️ Cetak Lembar Penilaian
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`} style={{ marginBottom: 'var(--space-md)' }}>
          {message.text}
        </div>
      )}

      {/* Info Notice */}
      <div className="card" style={{ marginBottom: 'var(--space-lg)', background: 'var(--bg-secondary)', borderLeft: '4px solid var(--color-primary)' }}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          📌 <strong>Transparansi Nilai:</strong> Nilai yang Anda submit akan otomatis disinkronisasi ke Dashboard <strong>Admin Sekolah</strong>, diakumulasikan ke transkrip <strong>Guru Pendamping</strong>, serta dapat dilihat langsung oleh <strong>Siswa</strong> bersangkutan.
        </p>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>
          Daftar Siswa Bimbingan Industri
        </h3>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Siswa</th>
                <th>NISN</th>
                <th>Jurusan</th>
                <th style={{ textAlign: 'center' }}>Rata-rata Nilai</th>
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
                  <td style={{ textAlign: 'center' }}>
                    {s.nilaiMitra ? (
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                        {s.nilaiMitra.rataRata}
                      </span>
                    ) : (
                      <span className="text-secondary">-</span>
                    )}
                  </td>
                  <td>
                    {s.nilaiMitra ? (
                      <span className="badge badge-success">✓ Sudah Dinilai</span>
                    ) : (
                      <span className="badge badge-warning">⏳ Belum Dinilai</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => handleOpenModal(s)}
                      className="btn btn-primary btn-sm"
                      id={`btn-nilai-${s.id}`}
                    >
                      {s.nilaiMitra ? '✏️ Edit Nilai' : '⭐ Beri Nilai'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Penilaian */}
      {showModal && selectedSiswa && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Formulir Penilaian Industri</h3>
                <p className="text-sm text-secondary" style={{ margin: 0 }}>
                  Siswa: <strong>{selectedSiswa.nama}</strong> ({selectedSiswa.jurusan})
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="modal-close">&times;</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="form-group">
                  <label className="form-label">1. Disiplin & Tanggung Jawab (0-100) *</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    className="form-control"
                    value={formNilai.disiplin}
                    onChange={(e) => setFormNilai({ ...formNilai, disiplin: e.target.value })}
                  />
                  <span className="text-xs text-secondary">Ketepatan waktu, tata tertib kantor</span>
                </div>

                <div className="form-group">
                  <label className="form-label">2. Keterampilan Teknis (0-100) *</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    className="form-control"
                    value={formNilai.keterampilan}
                    onChange={(e) => setFormNilai({ ...formNilai, keterampilan: e.target.value })}
                  />
                  <span className="text-xs text-secondary">Penguasaan pekerjaan & hasil tugas</span>
                </div>

                <div className="form-group">
                  <label className="form-label">3. Etika & Kerjasama Tim (0-100) *</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    className="form-control"
                    value={formNilai.kerjasama}
                    onChange={(e) => setFormNilai({ ...formNilai, kerjasama: e.target.value })}
                  />
                  <span className="text-xs text-secondary">Sopan santun, komunikasi sesama tim</span>
                </div>

                <div className="form-group">
                  <label className="form-label">4. Inisiatif & Kreativitas (0-100) *</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    className="form-control"
                    value={formNilai.inisiatif}
                    onChange={(e) => setFormNilai({ ...formNilai, inisiatif: e.target.value })}
                  />
                  <span className="text-xs text-secondary">Kemandirian memecahkan masalah</span>
                </div>
              </div>

              {/* Live Average Preview */}
              <div style={{ background: 'var(--bg-secondary)', padding: '12px 16px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span className="font-semibold text-sm">Prediksi Rata-rata Skor Mitra:</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                  {currentAverage} / 100
                </span>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Catatan, Evaluasi & Rekomendasi untuk Siswa *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Berikan umpan balik positif atau hal yang perlu ditingkatkan oleh siswa..."
                  className="form-control"
                  value={formNilai.catatan}
                  onChange={(e) => setFormNilai({ ...formNilai, catatan: e.target.value })}
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">
                  Batal
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Menyimpan...' : 'Simpan & Publikasikan Nilai'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
