'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  IconUsers,
  IconLogbook,
  IconLaporan,
  IconNilai,
  IconCheck,
} from '@/components/Icons';

export default function GuruDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({ totalSiswa: 14, logbookBaru: 2, laporanBaru: 2, belumDinilai: 3 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/guru/dashboard');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard Guru Pendamping</h1>
        <p className="page-subtitle">Selamat datang, {session?.user?.name}! Pantau dan evaluasi perkembangan siswa bimbingan Anda.</p>
      </div>

      <div className="stats-grid" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="stat-card">
          <div className="stat-icon stat-icon-primary">
            <IconUsers size={24} />
          </div>
          <div className="stat-value">{stats.totalSiswa}</div>
          <div className="stat-label">Siswa Bimbingan</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-info">
            <IconLogbook size={24} />
          </div>
          <div className="stat-value">{stats.logbookBaru}</div>
          <div className="stat-label">Logbook Perlu Review</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-warning">
            <IconLaporan size={24} />
          </div>
          <div className="stat-value">{stats.laporanBaru}</div>
          <div className="stat-label">Laporan Perlu ACC</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-danger">
            <IconNilai size={24} />
          </div>
          <div className="stat-value">{stats.belumDinilai}</div>
          <div className="stat-label">Siswa Belum Dinilai</div>
        </div>
      </div>

      {/* Quick Actions */}
      <h3 style={{ marginBottom: 'var(--space-md)', fontWeight: 700 }}>Tugas & Bimbingan</h3>
      <div className="stats-grid">
        <Link href="/dashboard/guru/siswa" className="card card-hover card-glow" style={{ cursor: 'pointer', textDecoration: 'none' }}>
          <div style={{ color: 'var(--primary)', marginBottom: '12px' }}>
            <IconUsers size={30} />
          </div>
          <h4 style={{ marginBottom: '4px', color: 'var(--text-primary)' }}>Siswa Bimbingan</h4>
          <p className="text-sm text-secondary">Lihat data penempatan mitra dan kontak siswa</p>
        </Link>
        <Link href="/dashboard/guru/logbook" className="card card-hover card-glow" style={{ cursor: 'pointer', textDecoration: 'none' }}>
          <div style={{ color: 'var(--primary)', marginBottom: '12px' }}>
            <IconLogbook size={30} />
          </div>
          <h4 style={{ marginBottom: '4px', color: 'var(--text-primary)' }}>Review Logbook</h4>
          <p className="text-sm text-secondary">Verifikasi catatan jurnal mingguan dan foto kerja</p>
        </Link>
        <Link href="/dashboard/guru/laporan" className="card card-hover card-glow" style={{ cursor: 'pointer', textDecoration: 'none' }}>
          <div style={{ color: 'var(--primary)', marginBottom: '12px' }}>
            <IconLaporan size={30} />
          </div>
          <h4 style={{ marginBottom: '4px', color: 'var(--text-primary)' }}>Pemeriksaan Laporan</h4>
          <p className="text-sm text-secondary">Unduh naskah dan berikan catatan perbaikan</p>
        </Link>
        <Link href="/dashboard/guru/penilaian" className="card card-hover card-glow" style={{ cursor: 'pointer', textDecoration: 'none' }}>
          <div style={{ color: 'var(--primary)', marginBottom: '12px' }}>
            <IconNilai size={30} />
          </div>
          <h4 style={{ marginBottom: '4px', color: 'var(--text-primary)' }}>Penilaian Akademik</h4>
          <p className="text-sm text-secondary">Input nilai sikap, portofolio, dan sidang PKL</p>
        </Link>
      </div>
    </div>
  );
}
