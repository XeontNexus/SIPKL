'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  IconSiswa,
  IconGuru,
  IconMitra,
  IconPresensi,
  IconCheck,
  IconSuratIzin,
  IconClock,
  IconUsers,
  IconMonitoring,
} from '@/components/Icons';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalSiswa: 142,
    totalGuru: 18,
    totalMitra: 42,
    siswaAktif: 138,
    presensiHariIni: 132,
    suratPending: 2,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats || stats);
        setRecentActivity(data.recentActivity || []);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Dashboard Administrator</h1>
          <p className="page-subtitle">
            Selamat datang, {session?.user?.name}! Pantau seluruh ekosistem PKL SMKN 1 Perhentian Raja.
          </p>
        </div>
        <Link href="/dashboard/admin/monitoring" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <IconMonitoring size={18} />
          <span>Buka Command Center</span>
        </Link>
      </div>

      {/* Stats Grid with Line Icons */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="stat-card">
          <div className="stat-icon stat-icon-primary">
            <IconSiswa size={24} />
          </div>
          <div className="stat-value">{stats.totalSiswa}</div>
          <div className="stat-label">Total Siswa Terdaftar</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-success">
            <IconGuru size={24} />
          </div>
          <div className="stat-value">{stats.totalGuru}</div>
          <div className="stat-label">Guru Pendamping</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-warning">
            <IconMitra size={24} />
          </div>
          <div className="stat-value">{stats.totalMitra}</div>
          <div className="stat-label">Mitra Industri (DUDI)</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-info">
            <IconPresensi size={24} />
          </div>
          <div className="stat-value">{stats.presensiHariIni}</div>
          <div className="stat-label">Presensi Hadir Hari Ini</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-success">
            <IconCheck size={24} />
          </div>
          <div className="stat-value">{stats.siswaAktif}</div>
          <div className="stat-label">Siswa Aktif Magang</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-danger">
            <IconSuratIzin size={24} />
          </div>
          <div className="stat-value">{stats.suratPending}</div>
          <div className="stat-label">Surat Izin Perlu ACC</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconClock size={18} />
            <span>Aktivitas & Log Sistem Terbaru</span>
          </h3>
          <Link href="/dashboard/admin/akun" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <IconUsers size={14} />
            <span>Kelola Akun</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center" style={{ padding: '36px' }}>
            <div className="loading-spinner"></div>
          </div>
        ) : recentActivity.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Aktivitas</th>
                  <th>Nama Pengguna</th>
                  <th>Waktu</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((a, idx) => (
                  <tr key={a.id || idx}>
                    <td>{idx + 1}</td>
                    <td>
                      <span className="badge badge-info" style={{ textTransform: 'none' }}>
                        {a.action}
                      </span>
                    </td>
                    <td><strong>{a.user}</strong></td>
                    <td className="text-secondary" style={{ fontSize: '0.85rem' }}>{a.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p className="text-secondary">Tidak ada aktivitas baru</p>
          </div>
        )}
      </div>
    </div>
  );
}
