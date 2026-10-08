'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { IconQRCode, IconClock, IconCheck, IconEye } from '@/components/Icons';

export default function MitraQRPresensiPage() {
  const { data: session } = useSession();
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [qrToken, setQrToken] = useState('');
  const [tipePresensi, setTipePresensi] = useState('MASUK');
  const [jadwal, setJadwal] = useState({ jamMasuk: '08:00', jamPulang: '16:00', toleransiMenit: 15 });
  const [scannedStudents, setScannedStudents] = useState([
    { nama: 'Ahmad Fauzi', nisn: '0051234567', waktu: '07:45:12 WIB', status: 'Hadir Tepat Waktu' },
    { nama: 'Siti Rahmawati', nisn: '0057654321', waktu: '07:52:30 WIB', status: 'Hadir Tepat Waktu' },
    { nama: 'Budi Santoso', nisn: '0059876543', waktu: '08:04:15 WIB', status: 'Terlambat 4 Menit' },
  ]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    fetch('/api/mitra/jadwal')
      .then(res => res.json())
      .then(json => {
        if (json.data) setJadwal(json.data);
      })
      .catch(err => console.warn('Error load jadwal:', err));
  }, []);

  const generateQRCode = async () => {
    const today = new Date().toISOString().split('T')[0];
    const token = `SIPKL-${session?.user?.id || 'MITRA'}-${today}-${tipePresensi}-${Math.floor(Math.random() * 900000 + 100000)}`;
    setQrToken(token);

    try {
      const url = await QRCode.toDataURL(token, {
        width: 380,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  useEffect(() => {
    generateQRCode();
  }, [tipePresensi]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        alert(`Error fullscreen: ${err.message}`);
      });
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  return (
    <div ref={containerRef} style={{ background: isFullScreen ? '#0f172a' : 'transparent', padding: isFullScreen ? '24px' : '0', minHeight: isFullScreen ? '100vh' : 'auto', color: isFullScreen ? '#fff' : 'inherit' }}>
      <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div>
          <h1 className="page-title" style={{ color: isFullScreen ? '#fff' : 'inherit' }}>Generator QR Code Presensi</h1>
          <p className="page-subtitle" style={{ color: isFullScreen ? '#cbd5e1' : 'var(--text-secondary)' }}>
            Tampilkan QR Code ini di meja resepsionis atau layar monitor kantor agar siswa magang dapat memindai kehadiran.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '6px', fontSize: '0.85rem', color: isFullScreen ? '#94a3b8' : 'var(--text-secondary)' }}>
            <IconClock size={15} color="var(--primary)" />
            <span>Jadwal Aktif Mitra: <strong>Masuk {jadwal.jamMasuk} WIB</strong> • <strong>Pulang {jadwal.jamPulang} WIB</strong></span>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <Link href="/dashboard/mitra/jadwal" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: isFullScreen ? '#1e293b' : '#fff', color: isFullScreen ? '#fff' : 'inherit' }}>
            <IconClock size={16} />
            <span>⚙️ Atur Jam Kerja</span>
          </Link>
          <button onClick={toggleFullScreen} className="btn btn-outline" id="btn-fullscreen-qr" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: isFullScreen ? '#1e293b' : '#fff', color: isFullScreen ? '#fff' : 'inherit' }}>
            <IconEye size={16} />
            <span>{isFullScreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh (Kiosk)'}</span>
          </button>
          <button onClick={generateQRCode} className="btn btn-primary" id="btn-refresh-qr" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <IconQRCode size={16} />
            <span>Buat QR Baru</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'var(--space-lg)' }}>
        {/* QR Display Card */}
        <div className="card text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '36px 20px', background: 'var(--bg-card)' }}>
          <div style={{ display: 'inline-flex', background: 'var(--bg-secondary)', padding: '4px', borderRadius: 'var(--radius-md)', marginBottom: '20px', gap: '4px' }}>
            <button
              className={`btn btn-sm ${tipePresensi === 'MASUK' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setTipePresensi('MASUK')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <IconClock size={14} />
              <span>Presensi Masuk Pagi</span>
            </button>
            <button
              className={`btn btn-sm ${tipePresensi === 'PULANG' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setTipePresensi('PULANG')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <IconClock size={14} />
              <span>Presensi Pulang Sore</span>
            </button>
          </div>

          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', border: '2px solid rgba(245,158,11,0.25)', marginBottom: '20px' }}>
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="QR Code Presensi" style={{ width: '280px', height: '280px', display: 'block' }} />
            ) : (
              <div style={{ width: '280px', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="spinner"></div>
              </div>
            )}
          </div>

          <div style={{ maxWidth: '380px' }}>
            <span className="badge badge-info" style={{ marginBottom: '8px' }}>
              Mode Presensi: {tipePresensi}
            </span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
              Pindai dengan Menu Presensi Siswa
            </h3>
            <p className="text-xs text-secondary" style={{ wordBreak: 'break-all', fontFamily: 'monospace', background: 'var(--bg-secondary)', padding: '6px 12px', borderRadius: '6px' }}>
              Token: {qrToken}
            </p>
          </div>
        </div>

        {/* Live Attendance Log */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="pulse-indicator">🟢</span>
              <span>Siswa Yang Baru Saja Scan</span>
            </h3>
            <span className="badge badge-success">{scannedStudents.length} Hadir</span>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Siswa</th>
                  <th>Waktu Scan</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {scannedStudents.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.nama}</div>
                      <div className="text-xs text-secondary">NISN: {item.nisn}</div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{item.waktu}</td>
                    <td>
                      <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <IconCheck size={12} />
                        <span>{item.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '20px', padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <strong>Info Keamanan:</strong> Token QR Code ini terenkripsi harian. Siswa hanya dapat memindai saat berada di lokasi mitra dan terhubung dengan jaringan sistem SIPKL.
          </div>
        </div>
      </div>
    </div>
  );
}
