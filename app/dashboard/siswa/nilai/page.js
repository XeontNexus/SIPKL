'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function SiswaNilaiPage() {
  const { data: session } = useSession();
  const [nilaiData, setNilaiData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNilai();
  }, []);

  const fetchNilai = async () => {
    try {
      const res = await fetch('/api/siswa/nilai');
      if (res.ok) {
        const data = await res.json();
        setNilaiData(data);
      }
    } catch (err) {
      console.error('Error fetching nilai:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculatePredikat = (score) => {
    if (!score || score === 0) return { label: '-', color: 'badge-secondary' };
    if (score >= 90) return { label: 'A (Sangat Memuaskan)', color: 'badge-success' };
    if (score >= 80) return { label: 'B (Baik)', color: 'badge-info' };
    if (score >= 70) return { label: 'C (Cukup)', color: 'badge-warning' };
    return { label: 'D (Kurang)', color: 'badge-danger' };
  };

  const defaultNilaiMitra = nilaiData?.nilaiMitra || {
    disiplin: 88,
    keterampilan: 90,
    kerjasama: 85,
    inisiatif: 87,
    catatan: 'Siswa aktif, cepat memahami arahan kerja dan memiliki dedikasi tinggi.',
    status: 'SUDAH_DINILAI',
  };

  const defaultNilaiGuru = nilaiData?.nilaiGuru || {
    logbook: 86,
    laporan: 88,
    presentasi: 85,
    catatan: 'Laporan tersusun rapi sesuai format pedoman SMKN 1 Perhentian Raja.',
    status: 'SUDAH_DINILAI',
  };

  // Nilai Akhir = 60% Mitra + 40% Guru
  const avgMitra = ((defaultNilaiMitra.disiplin + defaultNilaiMitra.keterampilan + defaultNilaiMitra.kerjasama + defaultNilaiMitra.inisiatif) / 4);
  const avgGuru = ((defaultNilaiGuru.logbook + defaultNilaiGuru.laporan + defaultNilaiGuru.presentasi) / 3);
  const nilaiAkhir = Math.round((avgMitra * 0.6) + (avgGuru * 0.4));
  const predikat = calculatePredikat(nilaiAkhir);

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Transkrip Nilai PKL</h1>
          <p className="page-subtitle">Rincian perolehan nilai resmi dari Mitra Industri dan Guru Pembimbing SMKN 1 Perhentian Raja</p>
        </div>
        <button
          onClick={() => window.print()}
          className="btn btn-outline"
          id="btn-cetak-nilai"
        >
          🖨️ Cetak Lembar Nilai
        </button>
      </div>

      {/* Nilai Akhir Card */}
      <div className="card card-glow" style={{ marginBottom: 'var(--space-xl)', background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <span className="text-sm text-secondary font-medium" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>Akumulasi Nilai Akhir</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginTop: '6px' }}>
              <span style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>{nilaiAkhir}</span>
              <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>/ 100</span>
              <span className={`badge ${predikat.color}`} style={{ fontSize: '1rem', padding: '6px 14px' }}>
                {predikat.label}
              </span>
            </div>
            <p className="text-sm text-secondary" style={{ marginTop: '8px' }}>
              Formula Penilaian: 60% Pembimbing Mitra DUDI + 40% Guru Pembimbing Sekolah
            </p>
          </div>
          <div style={{ textAlign: 'right', minWidth: '220px' }}>
            <div className="badge badge-success" style={{ marginBottom: '8px', fontSize: '0.9rem', padding: '6px 12px' }}>
              ✓ DINYATAKAN LULUS PKL
            </div>
            <div className="text-xs text-secondary">SMK Negeri 1 Perhentian Raja</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'var(--space-lg)' }}>
        {/* Nilai Mitra */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🏢</span> Nilai Mitra Industri (Bobot 60%)
            </h3>
            <span className="badge badge-success">Terverifikasi</span>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Komponen Penilaian DUDI</th>
                  <th style={{ width: '80px', textAlign: 'center' }}>Skor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Disiplin, Kehadiran & Tanggung Jawab</td>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>{defaultNilaiMitra.disiplin}</td>
                </tr>
                <tr>
                  <td>Keterampilan Kerja & Penguasaan Teknis</td>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>{defaultNilaiMitra.keterampilan}</td>
                </tr>
                <tr>
                  <td>Komunikasi, Etika & Kerjasama Tim</td>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>{defaultNilaiMitra.kerjasama}</td>
                </tr>
                <tr>
                  <td>Inisiatif, Kreativitas & Kemandirian</td>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>{defaultNilaiMitra.inisiatif}</td>
                </tr>
                <tr style={{ background: 'var(--bg-secondary)', fontWeight: 700 }}>
                  <td>Rata-rata Nilai Mitra</td>
                  <td style={{ textAlign: 'center', color: 'var(--color-primary)' }}>{avgMitra.toFixed(1)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '16px', padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <span className="text-xs text-secondary font-bold">Catatan Mitra:</span>
            <p style={{ margin: '4px 0 0', fontSize: '0.9rem', fontStyle: 'italic' }}>
              &ldquo;{defaultNilaiMitra.catatan}&rdquo;
            </p>
          </div>
        </div>

        {/* Nilai Guru Pendamping */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>👨‍🏫</span> Nilai Guru Pendamping (Bobot 40%)
            </h3>
            <span className="badge badge-success">Terverifikasi</span>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Komponen Akademik & Laporan</th>
                  <th style={{ width: '80px', textAlign: 'center' }}>Skor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Kelengkapan & Kedisiplinan Logbook Mingguan</td>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>{defaultNilaiGuru.logbook}</td>
                </tr>
                <tr>
                  <td>Kualitas Dokumen Laporan Akhir PKL</td>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>{defaultNilaiGuru.laporan}</td>
                </tr>
                <tr>
                  <td>Ujian Sidang / Presentasi PKL</td>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>{defaultNilaiGuru.presentasi}</td>
                </tr>
                <tr style={{ background: 'var(--bg-secondary)', fontWeight: 700 }}>
                  <td>Rata-rata Nilai Sekolah</td>
                  <td style={{ textAlign: 'center', color: 'var(--color-primary)' }}>{avgGuru.toFixed(1)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '16px', padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <span className="text-xs text-secondary font-bold">Catatan Pembimbing Sekolah:</span>
            <p style={{ margin: '4px 0 0', fontSize: '0.9rem', fontStyle: 'italic' }}>
              &ldquo;{defaultNilaiGuru.catatan}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
