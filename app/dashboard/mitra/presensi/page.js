'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { IconMapPin, IconExternalLink } from '@/components/Icons';

export default function MitraDataPresensiPage() {
  const { data: session } = useSession();
  const [presensiList, setPresensiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTanggal, setFilterTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [manualForm, setManualForm] = useState({
    siswaId: '',
    status: 'HADIR',
    keterangan: '',
    tipe: 'MASUK',
  });

  useEffect(() => {
    fetchPresensi();
  }, [filterTanggal]);

  const fetchPresensi = async () => {
    try {
      const res = await fetch(`/api/mitra/presensi?tanggal=${filterTanggal}`);
      if (res.ok) {
        const data = await res.json();
        setPresensiList(data);
      } else {
        // Mock default data for demo
        setPresensiList([
          { id: '1', nama: 'Ahmad Fauzi', nisn: '0051234567', tanggal: filterTanggal, jamMasuk: '07:45', jamPulang: '16:05', status: 'HADIR', tipe: 'QR_SCAN', keterangan: 'Tepat Waktu' },
          { id: '2', nama: 'Siti Rahmawati', nisn: '0057654321', tanggal: filterTanggal, jamMasuk: '07:52', jamPulang: '16:00', status: 'HADIR', tipe: 'QR_SCAN', keterangan: 'Tepat Waktu' },
          { id: '3', nama: 'Budi Santoso', nisn: '0059876543', tanggal: filterTanggal, jamMasuk: '08:04', jamPulang: '-', status: 'HADIR', tipe: 'QR_SCAN', keterangan: 'Terlambat 4 menit' },
          { id: '4', nama: 'Dewi Lestari', nisn: '0053456789', tanggal: filterTanggal, jamMasuk: '-', jamPulang: '-', status: 'IZIN', tipe: 'SURAT', keterangan: 'Izin ke Puskesmas' },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleManualCheckIn = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/mitra/presensi/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(manualForm),
      });
      setShowModal(false);
      fetchPresensi();
    } catch (err) {
      alert('Gagal simpan presensi manual');
    }
  };

  const filteredList = filterStatus === 'ALL'
    ? presensiList
    : presensiList.filter(p => p.status === filterStatus);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'HADIR': return <span className="badge badge-success">✓ Hadir</span>;
      case 'IZIN': return <span className="badge badge-warning">📄 Izin</span>;
      case 'SAKIT': return <span className="badge badge-info">🏥 Sakit</span>;
      default: return <span className="badge badge-danger">✕ Alpha</span>;
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Data Rekapitulasi Presensi</h1>
          <p className="page-subtitle">Pantau kehadiran harian dan riwayat absensi siswa magang di industri Anda</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => window.print()} className="btn btn-outline" id="btn-print-presensi">
            🖨️ Cetak Rekap
          </button>
          <button onClick={() => setShowModal(true)} className="btn btn-primary" id="btn-manual-presensi">
            ➕ Input Manual / Koreksi
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label className="form-label" style={{ margin: 0, fontWeight: 600 }}>Pilih Tanggal:</label>
            <input
              type="date"
              className="form-control"
              style={{ width: '180px' }}
              value={filterTanggal}
              onChange={(e) => setFilterTanggal(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label className="form-label" style={{ margin: 0, fontWeight: 600 }}>Status Kehadiran:</label>
            <select
              className="form-control"
              style={{ width: '150px' }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">Semua Status</option>
              <option value="HADIR">Hadir</option>
              <option value="IZIN">Izin</option>
              <option value="SAKIT">Sakit</option>
              <option value="ALPHA">Alpha</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Presensi */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Siswa</th>
                <th>NISN</th>
                <th>Jam Masuk</th>
                <th>Jam Pulang</th>
                <th>Jejak Lokasi (GPS)</th>
                <th>Status</th>
                <th>Metode</th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((p, idx) => (
                <tr key={p.id || idx}>
                  <td>{idx + 1}</td>
                  <td><strong>{p.nama}</strong></td>
                  <td>{p.nisn}</td>
                  <td>{p.jamMasuk}</td>
                  <td>{p.jamPulang}</td>
                  <td>
                    {p.lokasiMasuk && p.lokasiMasuk !== '-' ? (
                      <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <IconMapPin size={12} color="#059669" />
                          <span style={{ fontWeight: 600, color: '#059669' }}>Masuk:</span>
                          <span className="text-secondary" style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={p.lokasiMasuk}>
                            {p.lokasiMasuk}
                          </span>
                          {p.mapsUrlMasuk && (
                            <a href={p.mapsUrlMasuk} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }} title="Buka di Maps">
                              <IconExternalLink size={11} />
                            </a>
                          )}
                        </div>
                        {p.lokasiPulang && p.lokasiPulang !== '-' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <IconMapPin size={12} color="#ea580c" />
                            <span style={{ fontWeight: 600, color: '#ea580c' }}>Pulang:</span>
                            <span className="text-secondary" style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={p.lokasiPulang}>
                              {p.lokasiPulang}
                            </span>
                            {p.mapsUrlPulang && (
                              <a href={p.mapsUrlPulang} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }} title="Buka di Maps">
                                <IconExternalLink size={11} />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-secondary" style={{ fontSize: '0.8rem' }}>-</span>
                    )}
                  </td>
                  <td>{getStatusBadge(p.status)}</td>
                  <td>
                    <span className="badge badge-secondary" style={{ fontSize: '0.75rem' }}>
                      {p.metode === 'KAMERA_SCAN' ? '📷 Scan QR' : p.metode === 'INPUT_MANUAL' ? '⌨️ Token' : p.tipe === 'QR_SCAN' ? '📱 Scan QR' : '✍️ Manual'}
                    </span>
                  </td>
                  <td>{p.keterangan || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Manual Check-In */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Input Kehadiran Manual</h3>
              <button onClick={() => setShowModal(false)} className="modal-close">&times;</button>
            </div>
            <form onSubmit={handleManualCheckIn}>
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Pilih Siswa *</label>
                <select
                  required
                  className="form-control"
                  value={manualForm.siswaId}
                  onChange={(e) => setManualForm({ ...manualForm, siswaId: e.target.value })}
                >
                  <option value="">-- Pilih Siswa --</option>
                  <option value="1">Ahmad Fauzi (0051234567)</option>
                  <option value="2">Siti Rahmawati (0057654321)</option>
                  <option value="3">Budi Santoso (0059876543)</option>
                  <option value="4">Dewi Lestari (0053456789)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Status Kehadiran *</label>
                <select
                  className="form-control"
                  value={manualForm.status}
                  onChange={(e) => setManualForm({ ...manualForm, status: e.target.value })}
                >
                  <option value="HADIR">Hadir</option>
                  <option value="IZIN">Izin</option>
                  <option value="SAKIT">Sakit</option>
                  <option value="ALPHA">Alpha</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Keterangan / Alasan Tambahan</label>
                <input
                  type="text"
                  placeholder="Misal: Kendala scan ponsel siswa, izin lisan, dll."
                  className="form-control"
                  value={manualForm.keterangan}
                  onChange={(e) => setManualForm({ ...manualForm, keterangan: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Presensi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
