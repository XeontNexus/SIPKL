'use client';

import { useState, useEffect } from 'react';
import { useModalAlert } from '@/components/ModalAlert';

export default function GuruSiswaPage() {
  const { showAlert, showConfirm, showPrompt } = useModalAlert();
  const [activeTab, setActiveTab] = useState('AKTIF'); // 'AKTIF' | 'PENDING'
  const [siswaAktif, setSiswaAktif] = useState([]);
  const [pendingList, setPendingList] = useState([]);
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
        setSiswaAktif(data.siswaAktif || (Array.isArray(data) ? data : []));
        setPendingList(data.pending || []);
      }
    } catch (error) {
      console.error('Error fetching siswa:', error);
    } finally {
      setLoading(false);
    }
  };

  // 1. Aksi ACC Siswa Bimbingan
  const handleAccBimbingan = async (item) => {
    const nama = item.namaSiswa || item.user?.nama;
    const confirmed = await showConfirm({
      title: 'Persetujuan Siswa Bimbingan',
      message: `Setujui ${nama} (${item.kelas}) sebagai siswa bimbingan Anda?\nSiswa akan langsung masuk ke daftar Siswa Bimbingan Aktif.`,
      confirmText: 'Setujui (ACC)',
      cancelText: 'Batal',
      type: 'warning',
    });

    if (!confirmed) return;

    setActionLoading(item.id);
    try {
      const res = await fetch('/api/guru/siswa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ACC_BIMBINGAN',
          permohonanId: item.id,
          catatan: 'Disetujui oleh Guru Pembimbing.',
        }),
      });

      const json = await res.json();
      if (res.ok) {
        await showAlert({
          title: 'Berhasil di-ACC',
          message: `${nama} telah disetujui dan masuk ke daftar siswa bimbingan aktif.`,
          type: 'success',
        });
        await fetchSiswa();
        setActiveTab('AKTIF');
      } else {
        await showAlert({
          title: 'Gagal',
          message: json.error || 'Gagal menyetujui siswa.',
          type: 'error',
        });
      }
    } catch (err) {
      await showAlert({
        title: 'Kendala Jaringan',
        message: 'Terjadi kendala jaringan.',
        type: 'error',
      });
    } finally {
      setActionLoading(null);
    }
  };

  // 2. Aksi Tolak Permohonan Siswa
  const handleTolakBimbingan = async (item) => {
    const nama = item.namaSiswa || item.user?.nama;
    const alasan = await showPrompt({
      title: 'Tolak Permohonan Bimbingan',
      message: `Masukkan alasan penolakan bimbingan untuk ${nama}:`,
      defaultValue: 'Kuota bimbingan penuh.',
      placeholder: 'Alasan penolakan...',
      confirmText: 'Tolak Permohonan',
      cancelText: 'Batal',
    });

    if (alasan === null) return;

    setActionLoading(item.id);
    try {
      const res = await fetch('/api/guru/siswa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'TOLAK_BIMBINGAN',
          permohonanId: item.id,
          alasan,
        }),
      });

      const json = await res.json();
      if (res.ok) {
        await showAlert({
          title: 'Permohonan Ditolak',
          message: `Permohonan ${nama} telah ditolak.`,
          type: 'info',
        });
        await fetchSiswa();
      } else {
        await showAlert({
          title: 'Gagal',
          message: json.error || 'Gagal menolak permohonan.',
          type: 'error',
        });
      }
    } catch (err) {
      await showAlert({
        title: 'Kendala Jaringan',
        message: 'Terjadi kendala jaringan.',
        type: 'error',
      });
    } finally {
      setActionLoading(null);
    }
  };

  // 3. Aksi Putus Penempatan PKL Siswa di Mitra
  const handlePutusPKL = async (siswaItem) => {
    const nama = siswaItem.user?.nama || siswaItem.namaSiswa;
    const mitraNama = siswaItem.mitra?.namaPerusahaan || siswaItem.mitraNama;
    const alasan = await showPrompt({
      title: 'Putus / Batalkan Penempatan PKL',
      message: `Batalkan penempatan magang ${nama} di ${mitraNama}?\nMasukkan alasan:`,
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
          message: `Penempatan siswa ${nama} telah diputus.`,
          type: 'info',
        });
        await fetchSiswa();
      } else {
        await showAlert({
          title: 'Gagal',
          message: json.error || 'Gagal memutus penempatan.',
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
      BELUM_GABUNG: { class: 'badge-warning', label: 'Belum PKL' },
    };
    const s = map[status] || map.SEDANG_PKL;
    return <span className={`badge ${s.class}`}>{s.label}</span>;
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Siswa Bimbingan</h1>
        <p className="page-subtitle">Daftar siswa yang Anda bimbing dalam program PKL SMKN 1 Perhentian Raja</p>
      </div>

      {/* Tab Filter Rapi */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('AKTIF')}
          className={`btn ${activeTab === 'AKTIF' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
        >
          Siswa Bimbingan ({siswaAktif.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('PENDING')}
          className={`btn ${activeTab === 'PENDING' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
        >
          Menunggu ACC ({pendingList.length})
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div className="flex items-center justify-center" style={{ padding: '48px' }}>
            <div className="loading-spinner"></div>
          </div>
        ) : activeTab === 'AKTIF' ? (
          siswaAktif.length > 0 ? (
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
                  {siswaAktif.map((s) => {
                    const nama = s.user?.nama || s.namaSiswa;
                    const mitra = s.mitra?.namaPerusahaan || s.mitraNama || '-';
                    const isSedangPkl = s.statusPKL === 'SEDANG_PKL' && mitra !== '-';

                    return (
                      <tr key={s.id}>
                        <td className="font-semibold">{nama}</td>
                        <td className="text-sm text-secondary">{s.nisn}</td>
                        <td className="text-sm">{s.kelas}</td>
                        <td className="text-sm text-secondary">{mitra}</td>
                        <td>{statusBadge(s.statusPKL)}</td>
                        <td>
                          {isSedangPkl ? (
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
                              {actionLoading === s.id ? 'Memproses...' : '✕ Putus PKL'}
                            </button>
                          ) : (
                            <span className="text-xs text-secondary">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <h4 className="empty-state-title">Belum ada siswa bimbingan</h4>
              <p className="empty-state-desc">
                {pendingList.length > 0
                  ? 'Ada permohonan bimbingan siswa yang menunggu ACC Anda pada tab di atas.'
                  : 'Siswa yang memilih Anda akan tampil di tab Menunggu ACC.'}
              </p>
            </div>
          )
        ) : (
          pendingList.length > 0 ? (
            <div className="table-container" style={{ border: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Nama Siswa</th>
                    <th>NISN</th>
                    <th>Kelas</th>
                    <th>Mitra PKL</th>
                    <th>Tgl Pengajuan</th>
                    <th style={{ textAlign: 'center' }}>Aksi Guru</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingList.map((p) => (
                    <tr key={p.id}>
                      <td className="font-semibold">{p.namaSiswa}</td>
                      <td className="text-sm text-secondary">{p.nisn}</td>
                      <td className="text-sm">{p.kelas}</td>
                      <td className="text-sm text-secondary">{p.mitraNama || '-'}</td>
                      <td className="text-sm text-secondary">{p.tanggalPengajuan || '-'}</td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            type="button"
                            disabled={actionLoading === p.id}
                            onClick={() => handleAccBimbingan(p)}
                            className="btn btn-sm btn-primary"
                            style={{
                              padding: '4px 12px',
                              fontSize: '0.75rem',
                            }}
                          >
                            {actionLoading === p.id ? 'Memproses...' : '✓ ACC'}
                          </button>
                          <button
                            type="button"
                            disabled={actionLoading === p.id}
                            onClick={() => handleTolakBimbingan(p)}
                            className="btn btn-sm btn-secondary"
                            style={{
                              color: '#dc2626',
                              padding: '4px 10px',
                              fontSize: '0.75rem',
                            }}
                          >
                            Tolak
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">✅</div>
              <h4 className="empty-state-title">Tidak ada permohonan menunggu</h4>
              <p className="empty-state-desc">Semua siswa yang memilih Anda telah diproses.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
