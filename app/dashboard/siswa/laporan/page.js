'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { IconAlert, IconCheck, IconDocument, IconUpload } from '@/components/Icons';
import { useModalAlert } from '@/components/ModalAlert';

export default function SiswaLaporanPage() {
  const { data: session } = useSession();
  const { showAlert } = useModalAlert();
  const [laporan, setLaporan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    judul: '',
    abstrak: '',
    fileName: '',
    fileSize: '',
    fileData: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchLaporan();
  }, []);

  const fetchLaporan = async () => {
    try {
      const res = await fetch('/api/siswa/laporan');
      if (res.ok) {
        const data = await res.json();
        setLaporan(data);
        if (data) {
          setFormData({
            judul: data.judul || '',
            abstrak: data.ringkasan || '',
            fileName: data.fileName || '',
            fileSize: data.fileSize || '',
            fileData: data.fileData || '',
          });
        }
      }
    } catch (err) {
      console.error('Error fetching laporan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      showAlert({
        title: 'Ukuran Berkas Terlalu Besar',
        message: 'Ukuran file maksimal yang diperbolehkan adalah 15 MB.',
        type: 'warning',
      });
      return;
    }

    setSelectedFile(file);
    const sizeFormatted = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        fileName: file.name,
        fileSize: sizeFormatted,
        fileData: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fileName && !selectedFile) {
      showAlert({
        title: 'Berkas Belum Dipilih',
        message: 'Silakan pilih berkas dokumen laporan (PDF/Word) terlebih dahulu.',
        type: 'warning',
      });
      return;
    }

    setSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/siswa/laporan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const result = await res.json();
        setLaporan(result.data || formData);
        setShowModal(false);
        setMessage({
          text: laporan?.status === 'REVIEWED'
            ? 'Revisi laporan akhir berhasil dikirim ulang ke guru pendamping!'
            : 'Dokumen laporan akhir berhasil diunggah dan dikirim ke guru pendamping!',
          type: 'success',
        });
      } else {
        const err = await res.json();
        setMessage({ text: err.error || 'Gagal menyimpan laporan', type: 'danger' });
      }
    } catch (error) {
      setMessage({ text: 'Terjadi kesalahan jaringan', type: 'danger' });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return <span className="badge badge-success">✓ Disetujui (ACC Lulus)</span>;
      case 'REVIEWED':
        return <span className="badge badge-warning">📝 Perlu Perbaikan (Revisi)</span>;
      case 'SUBMITTED':
        return <span className="badge badge-info">⏳ Menunggu Review Guru</span>;
      default:
        return <span className="badge badge-secondary">Belum Dikirim</span>;
    }
  };

  const openModal = () => {
    if (laporan) {
      setFormData({
        judul: laporan.judul || '',
        abstrak: laporan.ringkasan || '',
        fileName: laporan.fileName || '',
        fileSize: laporan.fileSize || '',
        fileData: laporan.fileData || '',
      });
    }
    setSelectedFile(null);
    setShowModal(true);
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title">Laporan Akhir PKL</h1>
          <p className="page-subtitle">Unggah berkas dokumen laporan akhir PKL untuk dinilai dan direview oleh Guru Pembimbing</p>
        </div>
        <button
          onClick={openModal}
          className="btn btn-primary"
          id="btn-submit-laporan"
        >
          {laporan?.status === 'REVIEWED'
            ? '✏️ Perbaiki & Kirim Ulang'
            : laporan
            ? '📤 Unggah Ulang Dokumen'
            : '📤 Upload File Laporan Akhir'}
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`} style={{ marginBottom: 'var(--space-md)' }}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="card text-center" style={{ padding: '40px' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 16px' }}></div>
          <p className="text-secondary">Memuat data laporan...</p>
        </div>
      ) : !laporan ? (
        <div className="card">
          <div className="empty-state" style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>📄</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Belum Ada Berkas Laporan Diunggah</h3>
            <p className="text-secondary" style={{ maxWidth: '540px', margin: '0 auto 24px' }}>
              Anda belum mengunggah file laporan akhir magang. Unggah naskah laporan lengkap (format PDF atau Word) untuk diperiksa dan diberikan masukan oleh guru pendamping.
            </p>
            <button onClick={openModal} className="btn btn-primary">
              📤 Upload File Laporan Sekarang
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-lg)' }}>
          {/* Main Info */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span className="text-xs text-secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                  Judul Laporan Akhir
                </span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '4px', color: 'var(--text-primary)' }}>
                  {laporan.judul || 'Laporan PKL'}
                </h2>
              </div>
              <div>{getStatusBadge(laporan.status)}</div>
            </div>

            {/* UPLOADED FILE CONTAINER */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Berkas Dokumen Laporan:
              </h4>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  background: 'var(--bg-secondary, #f8fafc)',
                  border: '1.5px solid var(--border-primary, #e2e8f0)',
                  padding: '16px',
                  borderRadius: 'var(--radius-md, 10px)',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    background: '#eff6ff',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.6rem',
                    flexShrink: 0,
                  }}
                >
                  📄
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', wordBreak: 'break-all', fontSize: '0.98rem' }}>
                    {laporan.fileName || 'Naskah_Laporan_Akhir_PKL.pdf'}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Ukuran: <strong>{laporan.fileSize || '3.8 MB'}</strong> • Diserahkan:{' '}
                    <strong>{laporan.tanggalSubmit ? new Date(laporan.tanggalSubmit).toLocaleDateString('id-ID') : 'Hari ini'}</strong>
                    {laporan.revisiKe > 1 ? ` • (Revisi ke-${laporan.revisiKe})` : ''}
                  </div>
                </div>

                {laporan.fileData ? (
                  <a
                    href={laporan.fileData}
                    download={laporan.fileName || 'Laporan_PKL.pdf'}
                    className="btn btn-primary btn-sm"
                    style={{ flexShrink: 0 }}
                  >
                    ⬇️ Unduh Berkas
                  </a>
                ) : (
                  <button
                    onClick={() => showAlert({ title: 'Unduh Berkas', message: `Sedang mengunduh berkas laporan: ${laporan.fileName || 'Laporan_PKL.pdf'}`, type: 'info' })}
                    className="btn btn-primary btn-sm"
                    style={{ flexShrink: 0 }}
                  >
                    ⬇️ Unduh Berkas
                  </button>
                )}
              </div>
            </div>

            {/* RINGKASAN */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Ringkasan / Abstrak Pekerjaan
              </h4>
              <p
                style={{
                  lineHeight: '1.6',
                  background: 'var(--bg-secondary, #f8fafc)',
                  padding: '16px',
                  borderRadius: 'var(--radius-md, 8px)',
                  margin: 0,
                  fontSize: '0.92rem',
                }}
              >
                {laporan.abstrak || laporan.ringkasan || 'Tidak ada ringkasan yang disertakan.'}
              </p>
            </div>

            {/* CATATAN / FEEDBACK GURU PENDAMPING */}
            {laporan.catatanGuru && (
              <div
                style={{
                  background: laporan.status === 'REVIEWED' ? '#fffbeb' : '#f0fdf4',
                  border: laporan.status === 'REVIEWED' ? '1.5px solid #f59e0b' : '1.5px solid #86efac',
                  padding: '18px',
                  borderRadius: 'var(--radius-md, 10px)',
                  marginBottom: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>{laporan.status === 'REVIEWED' ? '⚠️' : '✅'}</span>
                  <h4
                    style={{
                      margin: 0,
                      fontWeight: 800,
                      fontSize: '1rem',
                      color: laporan.status === 'REVIEWED' ? '#92400e' : '#166534',
                    }}
                  >
                    Catatan Feedback Guru Pendamping ({laporan.guruPendamping || 'Drs. H. Hendra Wijaya, M.Pd'}):
                  </h4>
                </div>
                <p style={{ margin: '0 0 12px', fontSize: '0.95rem', color: laporan.status === 'REVIEWED' ? '#78350f' : '#14532d', lineHeight: '1.6' }}>
                  &ldquo;{laporan.catatanGuru}&rdquo;
                </p>

                {laporan.status === 'REVIEWED' && (
                  <div
                    style={{
                      background: '#ffffff',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #fde68a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px',
                    }}
                  >
                    <span style={{ fontSize: '0.85rem', color: '#92400e', fontWeight: 600 }}>
                      👉 Perbaiki naskah sesuai catatan di atas lalu upload ulang dokumen revisi.
                    </span>
                    <button onClick={openModal} className="btn btn-sm btn-primary">
                      ✏️ Upload Revisi Sekarang
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Info & Petunjuk */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px' }}>
                👨‍🏫 Guru Pendamping Anda
              </h3>
              <div style={{ padding: '12px', background: 'var(--bg-secondary, #f8fafc)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary, #e2e8f0)' }}>
                <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem' }}>
                  {laporan.guruPendamping || 'Drs. H. Hendra Wijaya, M.Pd'}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  NIP: 19780512 200501 1 003 • Pembimbing PKL
                </div>
                <div style={{ marginTop: '10px', fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600 }}>
                  ✓ Dokumen yang diunggah akan otomatis terkirim ke akun guru untuk diperiksa.
                </div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px' }}>📌 Alur Bimbingan Laporan</h3>
              <ul style={{ paddingLeft: '18px', lineHeight: '1.8', fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
                <li>
                  <strong>1. Upload Berkas:</strong> Pilih file laporan (.PDF / .DOCX) naskah lengkap.
                </li>
                <li>
                  <strong>2. Review Guru:</strong> Guru pembimbing memeriksa dokumen dan menulis catatan evaluasi.
                </li>
                <li>
                  <strong>3. Perbaikan (Revisi):</strong> Jika ada masukan, perbaiki laporan dan klik tombol <em>&quot;Perbaiki & Kirim Ulang&quot;</em>.
                </li>
                <li>
                  <strong>4. Persetujuan (ACC):</strong> Setelah memenuhi standar, guru akan memberikan status <strong>Disetujui (ACC Lulus)</strong>.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form Upload & Revisi */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '620px' }}>
            <div className="modal-header">
              <h3 className="modal-title">
                {laporan?.status === 'REVIEWED' ? '✏️ Form Revisi Laporan Akhir' : '📤 Upload Dokumen Laporan Akhir'}
              </h3>
              <button onClick={() => setShowModal(false)} className="modal-close">&times;</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Judul Laporan PKL *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rancang Bangun Jaringan LAN di Kantor PT Telkom..."
                  className="form-control"
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                />
              </div>

              {/* UPLOAD FILE INPUT */}
              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label className="form-label">Upload File Laporan (PDF / DOCX) *</label>
                
                <div
                  style={{
                    border: '2px dashed var(--border-primary, #cbd5e1)',
                    borderRadius: 'var(--radius-md, 10px)',
                    padding: '24px 16px',
                    textAlign: 'center',
                    background: selectedFile || formData.fileName ? '#f0fdf4' : 'var(--bg-secondary, #f8fafc)',
                    borderColor: selectedFile || formData.fileName ? '#86efac' : '#cbd5e1',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  onClick={() => document.getElementById('file-upload-input').click()}
                >
                  <input
                    id="file-upload-input"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />

                  <div style={{ fontSize: '2.4rem', marginBottom: '8px' }}>
                    {selectedFile || formData.fileName ? '📄' : '📁'}
                  </div>

                  {selectedFile ? (
                    <div>
                      <div style={{ fontWeight: 700, color: '#166534', fontSize: '1rem' }}>
                        {selectedFile.name}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#15803d', marginTop: '2px' }}>
                        Ukuran: {formData.fileSize} • Klik untuk ganti file
                      </div>
                    </div>
                  ) : formData.fileName ? (
                    <div>
                      <div style={{ fontWeight: 700, color: '#166534', fontSize: '1rem' }}>
                        {formData.fileName} (Berkas Tersedia)
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#15803d', marginTop: '2px' }}>
                        Klik untuk memilih file baru pengganti
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        Klik untuk memilih file laporan dari perangkat
                      </div>
                      <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Mendukung format .PDF, .DOC, atau .DOCX (Maksimal 15 MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Ringkasan / Abstrak Laporan *</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Tuliskan gambaran umum kegiatan magang, pencapaian, dan kesimpulan..."
                  className="form-control"
                  value={formData.abstrak}
                  onChange={(e) => setFormData({ ...formData, abstrak: e.target.value })}
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">
                  Batal
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting
                    ? 'Mengunggah & Mengirim...'
                    : laporan?.status === 'REVIEWED'
                    ? '📤 Kirim Revisi ke Guru'
                    : '📤 Kirim Laporan ke Guru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
