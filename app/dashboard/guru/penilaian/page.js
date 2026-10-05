'use client';

import { useState, useEffect } from 'react';

export default function GuruPenilaianPage() {
  const [siswa, setSiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSiswa, setSelectedSiswa] = useState(null);
  const [formData, setFormData] = useState({
    nilaiSikap: '',
    nilaiKeterampilan: '',
    nilaiLaporan: '',
    catatan: '',
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchSiswa();
  }, []);

  const fetchSiswa = async () => {
    try {
      const res = await fetch('/api/guru/siswa');
      if (res.ok) {
        const data = await res.json();
        setSiswa(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const openNilaiModal = (s) => {
    setSelectedSiswa(s);
    setFormData({ nilaiSikap: '', nilaiKeterampilan: '', nilaiLaporan: '', catatan: '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const nilaiSikap = parseFloat(formData.nilaiSikap);
      const nilaiKeterampilan = parseFloat(formData.nilaiKeterampilan);
      const nilaiLaporan = parseFloat(formData.nilaiLaporan);
      const nilaiAkhir = ((nilaiSikap + nilaiKeterampilan + nilaiLaporan) / 3).toFixed(1);

      const res = await fetch('/api/nilai/guru', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siswaId: selectedSiswa.id,
          nilaiSikap,
          nilaiKeterampilan,
          nilaiLaporan,
          nilaiAkhir: parseFloat(nilaiAkhir),
          catatan: formData.catatan,
        }),
      });

      if (res.ok) {
        setShowModal(false);
        fetchSiswa();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Penilaian Siswa</h1>
        <p className="page-subtitle">Berikan penilaian kepada siswa bimbingan Anda</p>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div className="flex items-center justify-center" style={{ padding: '48px' }}>
            <div className="loading-spinner"></div>
          </div>
        ) : siswa.length > 0 ? (
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Nama Siswa</th>
                  <th>Kelas</th>
                  <th>Mitra PKL</th>
                  <th>Status Nilai</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {siswa.map((s) => (
                  <tr key={s.id}>
                    <td className="font-semibold">{s.user?.nama}</td>
                    <td className="text-sm">{s.kelas}</td>
                    <td className="text-sm text-secondary">{s.mitra?.namaPerusahaan || '-'}</td>
                    <td>
                      {s.nilaiGuru?.length > 0 ? (
                        <span className="badge badge-success">✅ Sudah Dinilai ({s.nilaiGuru[0].nilaiAkhir})</span>
                      ) : (
                        <span className="badge badge-warning">⏳ Belum Dinilai</span>
                      )}
                    </td>
                    <td>
                      <button className="btn btn-primary btn-sm" onClick={() => openNilaiModal(s)}>
                        ⭐ Beri Nilai
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">⭐</div>
            <h4 className="empty-state-title">Belum ada siswa</h4>
            <p className="empty-state-desc">Anda belum memiliki siswa bimbingan</p>
          </div>
        )}
      </div>

      {/* Modal Penilaian */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">⭐ Penilaian — {selectedSiswa?.user?.nama}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nilai Sikap (0-100)</label>
                  <input
                    type="number"
                    className="form-input"
                    min="0"
                    max="100"
                    value={formData.nilaiSikap}
                    onChange={(e) => setFormData({ ...formData, nilaiSikap: e.target.value })}
                    required
                    placeholder="Masukkan nilai sikap"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Nilai Keterampilan (0-100)</label>
                  <input
                    type="number"
                    className="form-input"
                    min="0"
                    max="100"
                    value={formData.nilaiKeterampilan}
                    onChange={(e) => setFormData({ ...formData, nilaiKeterampilan: e.target.value })}
                    required
                    placeholder="Masukkan nilai keterampilan"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Nilai Laporan (0-100)</label>
                  <input
                    type="number"
                    className="form-input"
                    min="0"
                    max="100"
                    value={formData.nilaiLaporan}
                    onChange={(e) => setFormData({ ...formData, nilaiLaporan: e.target.value })}
                    required
                    placeholder="Masukkan nilai laporan"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Catatan (opsional)</label>
                  <textarea
                    className="form-input form-textarea"
                    value={formData.catatan}
                    onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                    placeholder="Catatan tambahan..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" disabled={formLoading}>
                  {formLoading ? 'Menyimpan...' : '💾 Simpan Nilai'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
