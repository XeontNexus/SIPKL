'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  IconPresensi,
  IconLogbook,
  IconLaporan,
  IconNilai,
  IconQRCode,
  IconSuratIzin,
} from '@/components/Icons';

export default function SiswaDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalPresensi: 28,
    totalLogbook: 4,
    statusLaporan: 'Menunggu Review',
    statusPKL: 'Sedang PKL',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/siswa/dashboard');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard Siswa PKL</h1>
        <p className="page-subtitle">Halo {session?.user?.name}! Berikut ringkasan kegiatan magang industri kamu.</p>
      </div>

      <div className="stats-grid" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="stat-card">
          <div className="stat-icon stat-icon-primary">
            <IconPresensi size={24} />
          </div>
          <div className="stat-value">{stats.totalPresensi}</div>
          <div className="stat-label">Total Presensi Hadir</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-info">
            <IconLogbook size={24} />
          </div>
          <div className="stat-value">{stats.totalLogbook}</div>
          <div className="stat-label">Logbook Terverifikasi</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-warning">
            <IconLaporan size={24} />
          </div>
          <div className="stat-value" style={{ fontSize: '1.2rem' }}>{stats.statusLaporan}</div>
          <div className="stat-label">Status Laporan Akhir</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-success">
            <IconNilai size={24} />
          </div>
          <div className="stat-value" style={{ fontSize: '1.2rem' }}>{stats.statusPKL}</div>
          <div className="stat-label">Status Pelaksanaan PKL</div>
        </div>
      </div>

      {/* Quick Actions with Line Icons */}
      <h3 style={{ marginBottom: 'var(--space-md)', fontWeight: 700 }}>Menu Utama Siswa</h3>
      <div className="stats-grid">
        <Link href="/dashboard/siswa/presensi" className="card card-hover card-glow" style={{ cursor: 'pointer', textDecoration: 'none' }}>
          <div style={{ color: 'var(--primary)', marginBottom: '12px' }}>
            <IconQRCode size={32} />
          </div>
          <h4 style={{ marginBottom: '4px', color: 'var(--text-primary)' }}>Scan Presensi QR</h4>
          <p className="text-sm text-secondary">Catat kehadiran harian masuk dan pulang kerja</p>
        </Link>
        <Link href="/dashboard/siswa/logbook" className="card card-hover card-glow" style={{ cursor: 'pointer', textDecoration: 'none' }}>
          <div style={{ color: 'var(--primary)', marginBottom: '12px' }}>
            <IconLogbook size={32} />
          </div>
          <h4 style={{ marginBottom: '4px', color: 'var(--text-primary)' }}>Logbook Mingguan</h4>
          <p className="text-sm text-secondary">Isi jurnal pekerjaan dan unggah dokumentasi</p>
        </Link>
        <Link href="/dashboard/siswa/laporan" className="card card-hover card-glow" style={{ cursor: 'pointer', textDecoration: 'none' }}>
          <div style={{ color: 'var(--primary)', marginBottom: '12px' }}>
            <IconLaporan size={32} />
          </div>
          <h4 style={{ marginBottom: '4px', color: 'var(--text-primary)' }}>Laporan Akhir</h4>
          <p className="text-sm text-secondary">Kirim naskah laporan untuk direview guru</p>
        </Link>
        <Link href="/dashboard/siswa/nilai" className="card card-hover card-glow" style={{ cursor: 'pointer', textDecoration: 'none' }}>
          <div style={{ color: 'var(--primary)', marginBottom: '12px' }}>
            <IconNilai size={32} />
          </div>
          <h4 style={{ marginBottom: '4px', color: 'var(--text-primary)' }}>Transkrip Nilai</h4>
          <p className="text-sm text-secondary">Lihat perolehan nilai dari Mitra & Guru</p>
        </Link>
      </div>
    </div>
  );
}
