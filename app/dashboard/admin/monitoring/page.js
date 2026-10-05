'use client';

import { useState, useEffect } from 'react';

export default function AdminMonitoringPage() {
  const [loading, setLoading] = useState(false);
  const [filterJurusan, setFilterJurusan] = useState('ALL');

  const alerts = [
    { type: 'warning', title: 'Perhatian Absensi', desc: 'Budi Santoso (TKJ) memiliki 3 hari izin berturut-turut di PT Riau Cyber Solution.' },
    { type: 'info', title: 'Pengingat Penilaian Mitra', desc: 'Mitra PT Indah Kiat Pulp & Paper belum melakukan penilaian untuk 2 siswa magang.' },
    { type: 'danger', title: 'Logbook Terlambat', desc: '5 Siswa di jurusan DKV belum mengumpulkan logbook minggu ke-4.' },
  ];

  const jurusanStats = [
    { jurusan: 'Teknik Komputer & Jaringan (TKJ)', total: 64, hadir: 60, logbook: '92%', laporanAcc: '45%', nilaiSelesai: '38%' },
    { jurusan: 'Rekayasa Perangkat Lunak (RPL)', total: 48, hadir: 47, logbook: '96%', laporanAcc: '58%', nilaiSelesai: '50%' },
    { jurusan: 'Desain Komunikasi Visual (DKV)', total: 30, hadir: 28, logbook: '84%', laporanAcc: '32%', nilaiSelesai: '25%' },
  ];

  const activeSupervisions = [
    { guru: 'Drs. H. Hendra Wijaya, M.Pd', nip: '197508122002121003', siswaCount: 14, mitraCount: 5, logbookReviewed: '100%', laporanApproved: 8 },
    { guru: 'Nurul Hidayati, S.Kom', nip: '198304152009032008', siswaCount: 12, mitraCount: 4, logbookReviewed: '91%', laporanApproved: 6 },
    { guru: 'Bambang Irawan, M.Kom', nip: '198001022006041005', siswaCount: 15, mitraCount: 6, logbookReviewed: '86%', laporanApproved: 5 },
  ];

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Pusat Monitoring & Pengawasan 4 Role</h1>
          <p className="page-subtitle">Pantau seluruh aktivitas Siswa, Guru Pendamping, Mitra PKL, dan Sistem secara real-time</p>
        </div>
        <button onClick={() => window.print()} className="btn btn-outline">
          🖨️ Cetak Laporan Monitoring
        </button>
      </div>

      {/* Global Live Summary */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="stat-card">
          <div className="stat-icon stat-icon-primary">👨‍🎓</div>
          <div className="stat-value">142</div>
          <div className="stat-label">Siswa Aktif PKL</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-success">✓</div>
          <div className="stat-value">95.2%</div>
          <div className="stat-label">Tingkat Kehadiran Hari Ini</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-info">📓</div>
          <div className="stat-value">89%</div>
          <div className="stat-label">Kepatuhan Logbook</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-warning">📄</div>
          <div className="stat-value">62 / 142</div>
          <div className="stat-label">Laporan Akhir Terverifikasi</div>
        </div>
      </div>

      {/* Live System Alerts */}
      <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🔔</span> Notifikasi & Peringatan Pengawasan Otomatis
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {alerts.map((a, idx) => (
            <div
              key={idx}
              className={`alert alert-${a.type}`}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px' }}
            >
              <div>
                <strong>{a.title}: </strong> {a.desc}
              </div>
              <button className="btn btn-ghost btn-sm" style={{ textDecoration: 'underline' }}>
                Tindak Lanjuti
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 'var(--space-lg)' }}>
        {/* Progress per Jurusan */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>
            📊 Statistik Progress per Jurusan
          </h3>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Jurusan</th>
                  <th>Total Siswa</th>
                  <th>Kehadiran</th>
                  <th>Logbook</th>
                  <th>Laporan ACC</th>
                </tr>
              </thead>
              <tbody>
                {jurusanStats.map((j, idx) => (
                  <tr key={idx}>
                    <td><strong>{j.jurusan}</strong></td>
                    <td>{j.total}</td>
                    <td>
                      <span className="badge badge-success">{j.hadir} / {j.total}</span>
                    </td>
                    <td>
                      <span className="badge badge-info">{j.logbook}</span>
                    </td>
                    <td>
                      <span className="badge badge-warning">{j.laporanAcc}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kinerja Guru Pembimbing */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>
            👨‍🏫 Pengawasan Kinerja Guru Pendamping
          </h3>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Nama Guru</th>
                  <th>Bimbingan</th>
                  <th>Mitra</th>
                  <th>Logbook Diperiksa</th>
                  <th>Laporan ACC</th>
                </tr>
              </thead>
              <tbody>
                {activeSupervisions.map((g, idx) => (
                  <tr key={idx}>
                    <td>
                      <strong>{g.guru}</strong>
                      <div className="text-xs text-secondary">NIP: {g.nip}</div>
                    </td>
                    <td>{g.siswaCount} Siswa</td>
                    <td>{g.mitraCount} Mitra</td>
                    <td>
                      <span className="badge badge-success">{g.logbookReviewed}</span>
                    </td>
                    <td>
                      <strong>{g.laporanApproved}</strong> laporan
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
