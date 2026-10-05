'use client';

import { useState, useEffect } from 'react';

export default function AdminPresensiPage() {
  const [presensi, setPresensi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchPresensi();
  }, [filterDate]);

  const fetchPresensi = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/presensi?tanggal=${filterDate}`);
      if (res.ok) {
        const data = await res.json();
        setPresensi(data);
      }
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (status) => {
    const map = {
      HADIR: { class: 'badge-success', label: '✅ Hadir' },
      IZIN: { class: 'badge-warning', label: '📋 Izin' },
      SAKIT: { class: 'badge-info', label: '🏥 Sakit' },
      ALPHA: { class: 'badge-danger', label: '❌ Alpha' },
    };
    const s = map[status] || map.ALPHA;
    return <span className={`badge ${s.class}`}>{s.label}</span>;
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Presensi Siswa</h1>
        <p className="page-subtitle">Monitoring kehadiran seluruh siswa PKL</p>
      </div>

      {/* Filter */}
      <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="flex items-center gap-md" style={{ flexWrap: 'wrap' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">📅 Tanggal</label>
            <input
              type="date"
              className="form-input"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              style={{ width: '200px' }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div className="flex items-center justify-center" style={{ padding: '48px' }}>
            <div className="loading-spinner"></div>
          </div>
        ) : presensi.length > 0 ? (
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Siswa</th>
                  <th>Kelas</th>
                  <th>Mitra PKL</th>
                  <th>Waktu Masuk</th>
                  <th>Waktu Pulang</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {presensi.map((item) => (
                  <tr key={item.id}>
                    <td className="font-semibold">{item.siswa?.user?.nama}</td>
                    <td className="text-sm text-secondary">{item.siswa?.kelas}</td>
                    <td className="text-sm text-secondary">{item.siswa?.mitra?.namaPerusahaan || '-'}</td>
                    <td className="text-sm">
                      {item.waktuMasuk
                        ? new Date(item.waktuMasuk).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                        : '-'}
                    </td>
                    <td className="text-sm">
                      {item.waktuPulang
                        ? new Date(item.waktuPulang).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                        : '-'}
                    </td>
                    <td>{statusBadge(item.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h4 className="empty-state-title">Belum ada data presensi</h4>
            <p className="empty-state-desc">Data presensi untuk tanggal ini belum tersedia</p>
          </div>
        )}
      </div>
    </div>
  );
}
