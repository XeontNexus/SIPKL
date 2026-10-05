'use client';

import { useState, useEffect } from 'react';

export default function GuruSiswaPage() {
  const [siswa, setSiswa] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const statusBadge = (status) => {
    const map = {
      BELUM_PKL: { class: 'badge-warning', label: 'Belum PKL' },
      SEDANG_PKL: { class: 'badge-success', label: 'Sedang PKL' },
      SELESAI_PKL: { class: 'badge-info', label: 'Selesai PKL' },
    };
    const s = map[status] || map.BELUM_PKL;
    return <span className={`badge ${s.class}`}>{s.label}</span>;
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Siswa Bimbingan</h1>
        <p className="page-subtitle">Daftar siswa yang Anda bimbing dalam PKL</p>
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
                  <th>Nama</th>
                  <th>NISN</th>
                  <th>Kelas</th>
                  <th>Mitra PKL</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {siswa.map((s) => (
                  <tr key={s.id}>
                    <td className="font-semibold">{s.user?.nama}</td>
                    <td className="text-sm text-secondary">{s.nisn}</td>
                    <td className="text-sm">{s.kelas}</td>
                    <td className="text-sm text-secondary">{s.mitra?.namaPerusahaan || '-'}</td>
                    <td>{statusBadge(s.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <h4 className="empty-state-title">Belum ada siswa bimbingan</h4>
            <p className="empty-state-desc">Admin akan menugaskan siswa kepada Anda</p>
          </div>
        )}
      </div>
    </div>
  );
}
