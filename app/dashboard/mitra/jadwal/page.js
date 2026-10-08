'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  IconClock,
  IconCheck,
  IconAlert,
  IconMitra,
  IconQRCode,
} from '@/components/Icons';

export default function MitraAturJadwalPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    mitraNama: 'PT Telkom Indonesia Witel Riau',
    jamMasuk: '08:00',
    jamPulang: '16:00',
    toleransiMenit: 15,
    hariKerja: 'Senin - Jumat',
    lokasiKantor: 'Jl. Jenderal Sudirman No. 199, Pekanbaru',
    catatan: 'Wajib melakukan scan barcode QR masuk dan pulang sesuai jam kerja operasional kantor mitra.',
  });

  useEffect(() => {
    fetchJadwal();
  }, []);

  const fetchJadwal = async () => {
    try {
      const res = await fetch('/api/mitra/jadwal');
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setFormData(prev => ({
            ...prev,
            ...json.data,
            mitraNama: json.data.mitraNama || session?.user?.name || prev.mitraNama,
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching jadwal:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/mitra/jadwal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Gagal menyimpan pengaturan jadwal.');
      } else {
        setMessage('Jadwal jam kerja presensi berhasil disimpan! Seluruh siswa magang akan mengikuti jadwal baru ini.');
        if (json.data) setFormData(json.data);
      }
    } catch (err) {
      setError('Terjadi kendala jaringan saat menyimpan jadwal.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div>
          <h1 className="page-title">Pengaturan Jadwal Kerja Siswa PKL</h1>
          <p className="page-subtitle">
            Tentukan jam masuk, jam pulang, serta batas toleransi kehadiran sesuai kebijakan operasional industri Anda.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link href="/dashboard/mitra/qr-presensi" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <IconQRCode size={16} />
            <span>Tampilkan QR Presensi</span>
          </Link>
        </div>
      </div>

      {message && (
        <div className="alert alert-success" style={{ marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <IconCheck size={20} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <IconAlert size={20} />
          <span>{error}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'var(--space-xl)' }}>
        {/* Form Pengaturan */}
        <div className="card" style={{ background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--border-primary)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconClock size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Form Jam Operasional PKL</h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Perubahan jadwal akan langsung diterapkan pada evaluasi presensi siswa
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Nama Instansi / Perusahaan Mitra *</label>
              <input
                type="text"
                required
                className="form-control"
                value={formData.mitraNama}
                onChange={(e) => setFormData({ ...formData, mitraNama: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🌅 Jam Masuk PKL *</span>
                </label>
                <input
                  type="time"
                  required
                  className="form-control"
                  style={{ fontSize: '1.1rem', fontWeight: 700 }}
                  value={formData.jamMasuk}
                  onChange={(e) => setFormData({ ...formData, jamMasuk: e.target.value })}
                />
                <span className="text-xs text-secondary">Format 24 jam (misal 08:00)</span>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🌇 Jam Pulang PKL *</span>
                </label>
                <input
                  type="time"
                  required
                  className="form-control"
                  style={{ fontSize: '1.1rem', fontWeight: 700 }}
                  value={formData.jamPulang}
                  onChange={(e) => setFormData({ ...formData, jamPulang: e.target.value })}
                />
                <span className="text-xs text-secondary">Format 24 jam (misal 16:00)</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">Toleransi Keterlambatan (Menit)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    required
                    className="form-control"
                    value={formData.toleransiMenit}
                    onChange={(e) => setFormData({ ...formData, toleransiMenit: e.target.value })}
                  />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Menit</span>
                </div>
                <span className="text-xs text-secondary">Presensi lewat dari batas ini dihitung terlambat</span>
              </div>

              <div className="form-group">
                <label className="form-label">Hari Kerja Operasional</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="Contoh: Senin - Jumat"
                  value={formData.hariKerja}
                  onChange={(e) => setFormData({ ...formData, hariKerja: e.target.value })}
                />
                <span className="text-xs text-secondary">Jadwal hari aktif masuk kantor</span>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Alamat / Lokasi Kantor Mitra</label>
              <input
                type="text"
                className="form-control"
                placeholder="Alamat kantor atau lokasi penempatan siswa..."
                value={formData.lokasiKantor}
                onChange={(e) => setFormData({ ...formData, lokasiKantor: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '22px' }}>
              <label className="form-label">Instruksi & Catatan Khusus untuk Siswa Magang</label>
              <textarea
                rows="3"
                className="form-control"
                placeholder="Tuliskan tata tertib berpakaian, instruksi kehadiran, atau catatan khusus..."
                value={formData.catatan}
                onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
              ></textarea>
              <span className="text-xs text-secondary">
                Catatan ini akan tampil di kartu jadwal pada halaman presensi siswa.
              </span>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary w-full"
              style={{ padding: '12px', fontSize: '1rem', fontWeight: 700 }}
            >
              {saving ? 'Menyimpan Pengaturan...' : '💾 Simpan Perubahan Jadwal Kerja'}
            </button>
          </form>
        </div>

        {/* Live Preview Card (How Students Will See It) */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              👁️ Pratinjau Tampilan Jadwal di Dashboard Siswa:
            </span>
          </div>

          <div
            className="card card-glow"
            style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
              border: '1.5px solid #bfdbfe',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: 'var(--space-md)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: '#dbeafe',
                  color: '#1d4ed8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <IconMitra size={22} />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  🏢 Jadwal Kerja Ditentukan Oleh Mitra PKL
                </span>
                <h4 style={{ margin: '2px 0 0', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {formData.mitraNama || 'Nama Mitra Industri'}
                </h4>
                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  📍 {formData.lokasiKantor || 'Lokasi Industri'} • Hari: <strong>{formData.hariKerja || 'Senin - Jumat'}</strong>
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
              <div style={{ background: '#ffffff', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#047857', textTransform: 'uppercase' }}>Jam Masuk</span>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {formData.jamMasuk} <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>WIB</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>
                  Toleransi: +{formData.toleransiMenit}m
                </span>
              </div>

              <div style={{ background: '#ffffff', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ea580c', textTransform: 'uppercase' }}>Jam Pulang</span>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {formData.jamPulang} <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>WIB</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#c2410c', fontWeight: 600 }}>
                  Presensi Pulang Sore
                </span>
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Instruksi Mitra:</span>
              <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {formData.catatan || 'Presensi wajib dilakukan via scan kamera barcode QR.'}
              </p>
            </div>
          </div>

          {/* Ketentuan Penjelasan */}
          <div className="card" style={{ background: '#ffffff' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px' }}>
              ℹ️ Cara Kerja Penilaian Otomatis
            </h4>
            <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              <li>
                <strong>Tepat Waktu:</strong> Siswa yang memindai QR sebelum pukul <strong>{formData.jamMasuk} WIB</strong> (atau hingga batas toleransi) dicatat dengan status <em>&ldquo;Hadir Tepat Waktu&rdquo;</em>.
              </li>
              <li>
                <strong>Terlambat:</strong> Siswa yang memindai QR setelah toleransi <strong>{formData.toleransiMenit} menit</strong> akan otomatis dicatat menit keterlambatannya dan masuk dalam rekap presensi.
              </li>
              <li>
                <strong>Pulang Lebih Awal:</strong> Jika siswa scan pulang sebelum pukul <strong>{formData.jamPulang} WIB</strong>, sistem akan mencatat catatan pulang lebih awal.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
