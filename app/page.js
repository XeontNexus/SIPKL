import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="landing-container">
      {/* Header */}
      <header className="landing-header">
        <div className="landing-logo-group">
          <div className="landing-logo-icon">S</div>
          <span className="landing-logo-text">SIPKL</span>
        </div>
        <Link href="/login" className="btn btn-primary">
          🔑 Masuk
        </Link>
      </header>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-bg">
          <div className="landing-hero-orb landing-hero-orb-1"></div>
          <div className="landing-hero-orb landing-hero-orb-2"></div>
          <div className="landing-hero-orb landing-hero-orb-3"></div>
        </div>
        <div className="landing-hero-content">
          <div className="landing-badge">
            🎓 SMKN1 Perhentian Raja
          </div>
          <h1 className="landing-hero-title">
            Sistem Informasi Praktek Kerja Lapangan
          </h1>
          <p className="landing-hero-desc">
            Platform digital terpadu untuk mengelola kegiatan PKL/magang. 
            Presensi QR Code, logbook mingguan, laporan akhir, dan penilaian 
            — semua dalam satu aplikasi.
          </p>
          <div className="landing-hero-actions">
            <Link href="/login" className="btn btn-primary btn-lg">
              🚀 Mulai Sekarang
            </Link>
            <a href="#fitur" className="btn btn-secondary btn-lg">
              📋 Lihat Fitur
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="fitur" className="landing-features">
        <h2 className="landing-features-title">Fitur Unggulan</h2>
        <div className="landing-features-grid">
          <div className="feature-card">
            <div className="feature-icon stat-icon-primary">📱</div>
            <h3 className="feature-title">Presensi QR Code</h3>
            <p className="feature-desc">
              Mitra PKL generate QR code harian, siswa tinggal scan untuk presensi masuk dan pulang secara otomatis.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon stat-icon-success">📓</div>
            <h3 className="feature-title">Logbook Mingguan</h3>
            <p className="feature-desc">
              Siswa mencatat kegiatan PKL setiap minggu lengkap dengan hasil, kendala, dan dokumentasi foto.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon stat-icon-warning">📄</div>
            <h3 className="feature-title">Laporan Akhir</h3>
            <p className="feature-desc">
              Submit laporan akhir PKL secara digital. Guru pendamping dapat review dan memberikan catatan.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon stat-icon-info">⭐</div>
            <h3 className="feature-title">Penilaian Terintegrasi</h3>
            <p className="feature-desc">
              Nilai dari Guru Pendamping dan Mitra PKL terintegrasi. Admin, siswa, dan guru bisa melihat hasilnya.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon stat-icon-danger">📋</div>
            <h3 className="feature-title">Surat Izin Digital</h3>
            <p className="feature-desc">
              Ajukan surat izin magang secara digital. Admin dapat approve atau reject dengan mudah.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#A78BFA' }}>📊</div>
            <h3 className="feature-title">Dashboard Monitoring</h3>
            <p className="feature-desc">
              Admin dapat memantau seluruh aktivitas PKL — presensi, logbook, laporan, dan penilaian dalam satu dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        textAlign: 'center', 
        padding: '32px', 
        borderTop: '1px solid var(--border-primary)',
        color: 'var(--text-tertiary)',
        fontSize: '0.85rem'
      }}>
        <p>© 2026 SIPKL — SMKN1 Perhentian Raja. All rights reserved.</p>
      </footer>
    </div>
  );
}
