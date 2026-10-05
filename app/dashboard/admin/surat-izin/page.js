'use client';

import { useState, useEffect } from 'react';

export default function AdminSuratIzinPage() {
  const [suratList, setSuratList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('PENDING');

  useEffect(() => {
    fetchSurat();
  }, []);

  const fetchSurat = async () => {
    try {
      const res = await fetch('/api/surat-izin');
      if (res.ok) {
        const data = await res.json();
        setSuratList(data);
      }
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status, catatan = '') => {
    try {
      const res = await fetch(`/api/surat-izin/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, catatanAdmin: catatan }),
      });
      if (res.ok) {
        fetchSurat();
      }
    } catch (error) {
      console.error('Failed to update:', error);
    }
  };

  const filteredSurat = suratList.filter((s) => s.status === activeTab);

  const statusBadge = (status) => {
    const map = {
      PENDING: { class: 'badge-warning', label: '⏳ Pending' },
      APPROVED: { class: 'badge-success', label: '✅ Disetujui' },
      REJECTED: { class: 'badge-danger', label: '❌ Ditolak' },
    };
    const s = map[status] || map.PENDING;
    return <span className={`badge ${s.class}`}>{s.label}</span>;
  };

  const jenisSuratLabel = (jenis) => {
    const map = {
      IZIN_MAGANG: '📋 Izin Magang',
      IZIN_TIDAK_MASUK: '🏠 Izin Tidak Masuk',
    };
    return map[jenis] || jenis;
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Surat Izin</h1>
        <p className="page-subtitle">Kelola permohonan surat izin dari siswa PKL</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-sm" style={{ marginBottom: 'var(--space-lg)' }}>
        {['PENDING', 'APPROVED', 'REJECTED'].map((tab) => (
          <button
            key={tab}
            className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'PENDING' && '⏳ Pending'}
            {tab === 'APPROVED' && '✅ Disetujui'}
            {tab === 'REJECTED' && '❌ Ditolak'}
            <span className="badge badge-primary" style={{ marginLeft: '4px', padding: '2px 8px' }}>
              {suratList.filter((s) => s.status === tab).length}
            </span>
          </button>
        ))}
      </div>

      {/* Cards */}
      {loading ? (
        <div className="flex items-center justify-center" style={{ padding: '48px' }}>
          <div className="loading-spinner"></div>
        </div>
      ) : filteredSurat.length > 0 ? (
        <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
          {filteredSurat.map((surat) => (
            <div key={surat.id} className="card card-hover">
              <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div className="flex items-center gap-md" style={{ marginBottom: '8px' }}>
                    <span className="font-bold">{surat.siswa?.user?.nama}</span>
                    {statusBadge(surat.status)}
                    <span className="text-sm text-secondary">{jenisSuratLabel(surat.jenisSurat)}</span>
                  </div>
                  <p className="text-sm text-secondary" style={{ marginBottom: '4px' }}>
                    📅 {new Date(surat.tanggalMulai).toLocaleDateString('id-ID')}
                    {surat.tanggalSelesai && ` — ${new Date(surat.tanggalSelesai).toLocaleDateString('id-ID')}`}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    💬 {surat.alasan}
                  </p>
                  {surat.catatanAdmin && (
                    <p className="text-sm text-secondary" style={{ marginTop: '8px' }}>
                      📝 Admin: {surat.catatanAdmin}
                    </p>
                  )}
                </div>
                {surat.status === 'PENDING' && (
                  <div className="flex gap-sm">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleUpdateStatus(surat.id, 'APPROVED')}
                    >
                      ✅ Setujui
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        const catatan = prompt('Alasan penolakan (opsional):');
                        handleUpdateStatus(surat.id, 'REJECTED', catatan || '');
                      }}
                    >
                      ❌ Tolak
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📄</div>
            <h4 className="empty-state-title">Tidak ada surat izin</h4>
            <p className="empty-state-desc">Belum ada surat izin dengan status ini</p>
          </div>
        </div>
      )}
    </div>
  );
}
