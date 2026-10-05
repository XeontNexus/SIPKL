'use client';

import { useState, useEffect } from 'react';

export default function AdminPeriodePage() {
  const [periodeList, setPeriodeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    nama: '',
    tahunAjaran: '2026/2027',
    tanggalMulai: '',
    tanggalSelesai: '',
    status: 'AKTIF',
    keterangan: '',
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchPeriode();
  }, []);

  const fetchPeriode = async () => {
    try {
      const res = await fetch('/api/admin/periode');
      if (res.ok) {
        const data = await res.json();
        setPeriodeList(data);
      } else {
        // Mock default periods
        setPeriodeList([
          {
            id: '1',
            nama: 'PKL Gelombang 1 (Semester Ganjil)',
            tahunAjaran: '2026/2027',
            tanggalMulai: '2026-07-15',
            tanggalSelesai: '2026-10-15',
            status: 'AKTIF',
            totalSiswa: 142,
            totalMitra: 38,
            keterangan: 'Periode utama magang industri siswa kelas XII',
          },
          {
            id: '2',
            nama: 'PKL Gelombang 2 (Semester Genap)',
            tahunAjaran: '2026/2027',
            tanggalMulai: '2027-01-10',
            tanggalSelesai: '2027-04-10',
            status: 'DRAFT',
            totalSiswa: 110,
            totalMitra: 25,
            keterangan: 'Pendaftaran gelombang 2 dibuka bulan Desember',
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditItem(item);
      setFormData({
        nama: item.nama,
        tahunAjaran: item.tahunAjaran,
        tanggalMulai: item.tanggalMulai,
        tanggalSelesai: item.tanggalSelesai,
        status: item.status,
        keterangan: item.keterangan || '',
      });
    } else {
      setEditItem(null);
      setFormData({
        nama: '',
        tahunAjaran: '2026/2027',
        tanggalMulai: '',
        tanggalSelesai: '',
        status: 'AKTIF',
        keterangan: '',
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editItem) {
      setPeriodeList(prev => prev.map(p => (p.id === editItem.id ? { ...p, ...formData } : p)));
      setMessage({ text: 'Data periode berhasil diperbarui!', type: 'success' });
    } else {
      const newItem = {
        id: Date.now().toString(),
        ...formData,
        totalSiswa: 0,
        totalMitra: 0,
      };
      setPeriodeList(prev => [...prev, newItem]);
      setMessage({ text: 'Periode PKL baru berhasil ditambahkan!', type: 'success' });
    }
    setShowModal(false);
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Manajemen Periode PKL</h1>
          <p className="page-subtitle">Atur gelombang, tahun ajaran, dan jangka waktu kalender pelaksanaan magang</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn btn-primary" id="btn-tambah-periode">
          ➕ Tambah Periode Baru
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`} style={{ marginBottom: 'var(--space-md)' }}>
          {message.text}
        </div>
      )}

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Gelombang / Periode</th>
                <th>Tahun Ajaran</th>
                <th>Rentang Tanggal</th>
                <th>Siswa Terdaftar</th>
                <th>Mitra Terlibat</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {periodeList.map((p, idx) => (
                <tr key={p.id || idx}>
                  <td>{idx + 1}</td>
                  <td>
                    <strong>{p.nama}</strong>
                    <div className="text-xs text-secondary">{p.keterangan}</div>
                  </td>
                  <td><span className="badge badge-info">{p.tahunAjaran}</span></td>
                  <td style={{ fontSize: '0.85rem' }}>{p.tanggalMulai} s/d {p.tanggalSelesai}</td>
                  <td><strong>{p.totalSiswa} Siswa</strong></td>
                  <td><strong>{p.totalMitra} Industri</strong></td>
                  <td>
                    {p.status === 'AKTIF' ? (
                      <span className="badge badge-success">● Sedang Berlangsung</span>
                    ) : (
                      <span className="badge badge-secondary">○ Draf / Rencana</span>
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleOpenModal(p)} className="btn btn-outline btn-sm">
                      ✏️ Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Periode */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{editItem ? 'Edit Periode PKL' : 'Buat Periode PKL Baru'}</h3>
              <button onClick={() => setShowModal(false)} className="modal-close">&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Nama Gelombang / Periode *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PKL Gelombang 1 Tahun 2026/2027"
                  className="form-control"
                  value={formData.nama}
                  onChange={e => setFormData({ ...formData, nama: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Tahun Ajaran *</label>
                <input
                  type="text"
                  required
                  placeholder="2026/2027"
                  className="form-control"
                  value={formData.tahunAjaran}
                  onChange={e => setFormData({ ...formData, tahunAjaran: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Tanggal Mulai *</label>
                  <input
                    type="date"
                    required
                    className="form-control"
                    value={formData.tanggalMulai}
                    onChange={e => setFormData({ ...formData, tanggalMulai: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tanggal Selesai *</label>
                  <input
                    type="date"
                    required
                    className="form-control"
                    value={formData.tanggalSelesai}
                    onChange={e => setFormData({ ...formData, tanggalSelesai: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Status Pelaksanaan *</label>
                <select
                  className="form-control"
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="AKTIF">AKTIF (Sedang Berjalan)</option>
                  <option value="DRAFT">DRAFT (Pendaftaran Belum Dibuka)</option>
                  <option value="SELESAI">SELESAI (Arsip)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Keterangan / Catatan Tambahan</label>
                <textarea
                  rows="2"
                  className="form-control"
                  value={formData.keterangan}
                  onChange={e => setFormData({ ...formData, keterangan: e.target.value })}
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editItem ? 'Simpan Perubahan' : 'Buat Periode'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
