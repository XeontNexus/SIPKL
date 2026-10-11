'use client';

import { useState, useEffect } from 'react';
import { useModalAlert } from '@/components/ModalAlert';

export default function GuruSiswaPage() {
  const { showAlert, showConfirm, showPrompt } = useModalAlert();
  const [siswa, setSiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

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

  const handlePutusPKL = async (siswaItem) => {
    const alasan = await showPrompt({
      title: 'Putus / Batalkan Penempatan PKL Siswa',
      message: `Apakah Anda yakin ingin memutus/membatalkan penempatan magang ${siswaItem.user?.nama} di ${siswaItem.mitra?.namaPerusahaan}?\n\nSetelah diputus, status siswa akan kembali menjadi Belum PKL dan siswa dapat mendaftar ke tempat lain.\nMasukkan alasan keputusan:`,
      defaultValue: 'Evaluasi pembimbing / perubahan lokasi penempatan.',
      placeholder: 'Alasan pembatalan...',
      confirmText: 'Putus Penempatan',
      cancelText: 'Batal',
    });

    if (alasan === null) return;

    setActionLoading(siswaItem.id);
    try {
      const res = await fetch('/api/guru/siswa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'PUTUS_PKL',
          siswaId: siswaItem.id,
          alasan,
        }),
      });

      const json = await res.json();
      if (res.ok) {
        await showAlert({
          title: 'Penempatan PKL Diputus',
          message: `Penempatan siswa ${siswaItem.user?.nama} telah diputus oleh Guru Pembimbing. Siswa kini dapat memilih tempat PKL baru.`,
          type: 'info',
        });
        fetchSiswa();
      } else {
        await showAlert({
          title: 'Gagal',
          message: json.error || 'Gagal memutus penempatan siswa.',
          type: 'error',
        });
      }
    } catch (err) {
      await showAlert({
        title: 'Kendala Jaringan',
        message: 'Kendala jaringan saat memutus penempatan.',
        type: 'error',
      });
    } finally {
      setActionLoading(null);
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
        <p className="page-subtitle">Daftar siswa yang Anda bimbing dalam program PKL SMKN 1 Perhentian Raja</p>
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
                  <th>Aksi Guru</th>
                </tr>
              </thead>
              <tbody>
                {siswa.map((s) => (
                  <tr key={s.id}>
                    <td className="font-semibold">{s.user?.nama}</td>
                    <td className="text-sm text-secondary">{s.nisn}</td>
                    <td className="text-sm">{s.kelas}</td>
                    <td className="text-sm text-secondary">{s.mitra?.namaPerusahaan || '-'}</td>
                    <td>{statusBadge(s.statusPKL || s.status)}</td>
                    <td>
                      {(s.statusPKL === 'SEDANG_PKL' || s.status === 'SEDANG_PKL') && s.mitra?.namaPerusahaan !== '-' ? (
                        <button
                          type="button"
                          disabled={actionLoading === s.id}
                          onClick={() => handlePutusPKL(s)}
                          className="btn btn-sm btn-outline"
                          style={{
                            color: '#dc2626',
                            borderColor: '#fca5a5',
                            padding: '4px 10px',
                            fontSize: '0.75rem',
                          }}
                          title="Putus atau batalkan penempatan siswa di mitra ini"
                        >
                          {actionLoading === s.id ? 'Memproses...' : '✕ Putus / Batalkan PKL'}
                        </button>
                      ) : (
                        <span className="text-xs text-secondary">-</span>
                      )}
                    </td>
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
