'use client';

import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import {
  IconDashboard,
  IconUsers,
  IconPresensi,
  IconSuratIzin,
  IconPeriode,
  IconMonitoring,
  IconSiswa,
  IconGuru,
  IconMitra,
  IconAdmin,
  IconLogbook,
  IconLaporan,
  IconNilai,
  IconQRCode,
  IconLogout,
  IconMenu,
} from '@/components/Icons';

// Navigation items per role using Line Icons
const navConfig = {
  ADMIN: {
    label: 'Administrator',
    roleTag: 'Admin Sekolah',
    Icon: IconAdmin,
    items: [
      { label: 'Dashboard', Icon: IconDashboard, href: '/dashboard/admin' },
      { label: 'Manajemen Akun', Icon: IconUsers, href: '/dashboard/admin/akun' },
      { label: 'Presensi Siswa', Icon: IconPresensi, href: '/dashboard/admin/presensi' },
      { label: 'Surat Izin', Icon: IconSuratIzin, href: '/dashboard/admin/surat-izin' },
      { label: 'Periode PKL', Icon: IconPeriode, href: '/dashboard/admin/periode' },
      { label: 'Monitoring 4 Role', Icon: IconMonitoring, href: '/dashboard/admin/monitoring' },
    ],
  },
  GURU: {
    label: 'Guru Pendamping',
    roleTag: 'Pembimbing Sekolah',
    Icon: IconGuru,
    items: [
      { label: 'Dashboard', Icon: IconDashboard, href: '/dashboard/guru' },
      { label: 'Siswa Bimbingan', Icon: IconUsers, href: '/dashboard/guru/siswa' },
      { label: 'Logbook Siswa', Icon: IconLogbook, href: '/dashboard/guru/logbook' },
      { label: 'Laporan Akhir', Icon: IconLaporan, href: '/dashboard/guru/laporan' },
      { label: 'Penilaian Akademik', Icon: IconNilai, href: '/dashboard/guru/penilaian' },
    ],
  },
  SISWA: {
    label: 'Siswa PKL',
    roleTag: 'Siswa Magang',
    Icon: IconSiswa,
    items: [
      { label: 'Dashboard', Icon: IconDashboard, href: '/dashboard/siswa' },
      { label: 'Presensi Siswa', Icon: IconPresensi, href: '/dashboard/siswa/presensi' },
      { label: 'Logbook Mingguan', Icon: IconLogbook, href: '/dashboard/siswa/logbook' },
      { label: 'Laporan Akhir', Icon: IconLaporan, href: '/dashboard/siswa/laporan' },
      { label: 'Surat Izin', Icon: IconSuratIzin, href: '/dashboard/siswa/surat-izin' },
      { label: 'Transkrip Nilai', Icon: IconNilai, href: '/dashboard/siswa/nilai' },
    ],
  },
  MITRA: {
    label: 'Mitra Industri',
    roleTag: 'DUDI / Industri',
    Icon: IconMitra,
    items: [
      { label: 'Dashboard', Icon: IconDashboard, href: '/dashboard/mitra' },
      { label: 'QR Presensi', Icon: IconQRCode, href: '/dashboard/mitra/qr-presensi' },
      { label: 'Data Presensi', Icon: IconPresensi, href: '/dashboard/mitra/presensi' },
      { label: 'Penilaian Siswa', Icon: IconNilai, href: '/dashboard/mitra/penilaian' },
    ],
  },
};

function Sidebar({ role, userName }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const nav = navConfig[role];

  if (!nav) return null;

  const RoleIcon = nav.Icon;

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Mobile toggle */}
      <button
        className="navbar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          display: 'none',
          position: 'fixed',
          top: '12px',
          left: '12px',
          zIndex: 200,
        }}
        id="sidebar-toggle"
      >
        <IconMenu size={22} />
      </button>

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <RoleIcon size={22} color="#ffffff" />
          </div>
          <div className="sidebar-brand">
            <span className="sidebar-brand-name">SIPKL</span>
            <span className="sidebar-brand-sub">SMKN 1 Perhentian Raja</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-nav-section">
            <div className="sidebar-nav-section-label">
              <RoleIcon size={16} />
              <span>{nav.label}</span>
            </div>
            {nav.items.map((item) => {
              const ItemIcon = item.Icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sidebar-nav-icon">
                    <ItemIcon size={18} />
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User info */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{getInitials(userName)}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name" title={userName}>{userName}</div>
              <div className="sidebar-user-role-badge">
                <RoleIcon size={13} />
                <span>{nav.roleTag}</span>
              </div>
            </div>
          </div>
          <button
            className="btn btn-ghost w-full"
            onClick={handleLogout}
            style={{ marginTop: '10px', justifyContent: 'flex-start', gap: '10px', padding: '8px 12px' }}
          >
            <IconLogout size={16} />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>
    </>
  );
}

function DashboardShell({ children }) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="loading-page">
        <div className="loading-spinner" style={{ width: '40px', height: '40px' }}></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="loading-page">
        <p>Mengalihkan ke halaman masuk...</p>
      </div>
    );
  }

  const role = session.user.role;
  const userName = session.user.name;
  const currentNav = navConfig[role];
  const CurrentRoleIcon = currentNav?.Icon || IconAdmin;

  return (
    <div className="dashboard-layout" data-role={role}>
      <Sidebar role={role} userName={userName} />

      <div className="dashboard-content">
        {/* Top Navbar */}
        <nav className="navbar">
          <div className="navbar-left">
            <button
              className="navbar-toggle"
              onClick={() => {
                const sidebar = document.querySelector('.sidebar');
                const overlay = document.querySelector('.sidebar-overlay');
                sidebar?.classList.toggle('open');
                overlay?.classList.toggle('active');
              }}
            >
              <IconMenu size={20} />
            </button>
            <div className="navbar-role-pill">
              <CurrentRoleIcon size={16} />
              <span>Portal {currentNav?.label}</span>
            </div>
          </div>
          <div className="navbar-right">
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Halo, <strong style={{ color: 'var(--text-primary)' }}>{userName?.split(' ')[0]}</strong>
            </span>
          </div>
        </nav>

        {/* Main Content */}
        <main className="dashboard-main">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <SessionProvider>
      <DashboardShell>{children}</DashboardShell>
    </SessionProvider>
  );
}
