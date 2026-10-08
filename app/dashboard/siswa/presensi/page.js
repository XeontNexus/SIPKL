'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import {
  IconCamera,
  IconQRCode,
  IconScan,
  IconCheck,
  IconClock,
  IconAlert,
  IconFileText,
  IconUpload,
  IconMapPin,
  IconNavigation,
  IconExternalLink,
  IconMitra,
} from '@/components/Icons';

export default function SiswaPresensiPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('SCAN'); // 'SCAN' | 'IZIN' | 'RIWAYAT'
  const [tipePresensi, setTipePresensi] = useState('MASUK'); // 'MASUK' | 'PULANG'
  
  // Method: Camera & Upload Barcode Scanner
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const [cameraLoading, setCameraLoading] = useState(false);
  const html5QrCodeRef = useRef(null);
  const fileInputRef = useRef(null);

  // Jadwal Operasional Ditentukan oleh Mitra PKL
  const [jadwalMitra, setJadwalMitra] = useState({
    mitraNama: 'PT Telkom Indonesia Witel Riau',
    jamMasuk: '08:00',
    jamPulang: '16:00',
    toleransiMenit: 15,
    hariKerja: 'Senin - Jumat',
    lokasiKantor: 'Jl. Jenderal Sudirman No. 199, Pekanbaru',
    catatan: 'Wajib melakukan presensi barcode QR masuk dan pulang sesuai jam kerja industri mitra.',
  });

  // Permission / Sick Form
  const [formIzin, setFormIzin] = useState({
    jenis: 'SAKIT', // 'SAKIT' | 'IZIN'
    alasan: '',
    lampiranUrl: '',
  });

  // Geolocation tracking state
  const [geoData, setGeoData] = useState({
    latitude: 0.381245,
    longitude: 101.378912,
    accuracy: 12,
    status: 'IDLE', // 'IDLE' | 'FETCHING' | 'SUCCESS' | 'DENIED' | 'UNAVAILABLE'
    address: 'Perhentian Raja, Kampar (GPS: 0.38124, 101.37891)',
    errorMsg: '',
  });

  // State feedback & history
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [todayRecord, setTodayRecord] = useState(null);
  const [historyList, setHistoryList] = useState([]);

  const todayStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const todayIso = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchPresensiData();
    fetchJadwalMitra();
    detectLocation();
    return () => {
      stopCameraScanner();
    };
  }, []);

  const fetchJadwalMitra = async () => {
    try {
      const res = await fetch('/api/mitra/jadwal');
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setJadwalMitra(json.data);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch jadwal mitra:', err);
    }
  };

  // ----------------------------------------------------
  // GPS GEOLOCATION TRACKER
  // ----------------------------------------------------
  const detectLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGeoData((prev) => ({
        ...prev,
        status: 'UNAVAILABLE',
        errorMsg: 'Sensor GPS tidak didukung browser ini.',
      }));
      return;
    }

    setGeoData((prev) => ({ ...prev, status: 'FETCHING', errorMsg: '' }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const acc = Math.round(pos.coords.accuracy);
        setGeoData({
          latitude: lat,
          longitude: lng,
          accuracy: acc,
          status: 'SUCCESS',
          address: `GPS (${lat.toFixed(5)}, ${lng.toFixed(5)}) • Akurasi ±${acc}m`,
          errorMsg: '',
        });
      },
      (err) => {
        console.warn('Geolocation warning:', err.message);
        // Fallback default coordinate near SMKN 1 Perhentian Raja / Mitra
        setGeoData({
          latitude: 0.381245,
          longitude: 101.378912,
          accuracy: 15,
          status: 'DENIED',
          address: 'Area SMKN 1 Perhentian Raja (Estimasi Jaringan)',
          errorMsg: err.code === 1 ? 'Izin lokasi GPS belum diaktifkan browser.' : 'Gagal membaca sensor GPS.',
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 30000,
      }
    );
  };

  const fetchPresensiData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/presensi?nisn=0051234567`);
      if (res.ok) {
        const data = await res.json();
        setHistoryList(data);
        const todayData = data.find(p => p.tanggal === todayIso);
        if (todayData) {
          setTodayRecord(todayData);
        }
      }
    } catch (err) {
      console.error('Error fetching presensi:', err);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // ----------------------------------------------------
  // ROBUST CAMERA SCANNER LOGIC (html5-qrcode)
  // ----------------------------------------------------
  const startCameraScanner = async () => {
    setError('');
    setResult(null);
    setCameraLoading(true);

    // 1. Check Secure Context (HTTPS or localhost)
    if (typeof window !== 'undefined' && !window.isSecureContext && window.location.hostname !== 'localhost') {
      setCameraLoading(false);
      setError(
        'SECURE_CONTEXT_ERROR: Akses kamera diblokir browser karena halaman dibuka melalui alamat IP/HTTP tanpa HTTPS (misal via smartphone http://192.168...). Browser smartphone mewajibkan HTTPS untuk kamera. Silakan gunakan tombol "Unggah Foto QR" di bawah atau buka melalui http://localhost:3000 pada laptop.'
      );
      return;
    }

    // 2. Check MediaDevices API Support
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraLoading(false);
      setError(
        'BROWSER_UNSUPPORTED: Browser pada perangkat ini tidak mendukung akses kamera langsung. Silakan gunakan fitur unggah foto barcode QR mitra.'
      );
      return;
    }

    try {
      // 3. Make container visible first so DOM layout dimensions are non-zero
      setIsCameraActive(true);
      await new Promise((r) => setTimeout(r, 120));

      // 4. Request camera permission upfront cleanly (triggers browser prompt)
      let testStream = null;
      try {
        testStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
        });
      } catch (errFirst) {
        try {
          testStream = await navigator.mediaDevices.getUserMedia({ video: true });
        } catch (errPerm) {
          throw errPerm; // Will be caught by outer catch block
        }
      }
      if (testStream) {
        // Release dummy tracks so html5-qrcode can capture the camera
        testStream.getTracks().forEach((track) => track.stop());
      }

      // 5. Dynamically load html5-qrcode
      const { Html5Qrcode } = await import('html5-qrcode');

      // Stop previous instance if any
      if (html5QrCodeRef.current) {
        try {
          if (html5QrCodeRef.current.isScanning) {
            await html5QrCodeRef.current.stop();
          }
        } catch (stopErr) {
          console.warn('Error clearing old scanner:', stopErr);
        }
      }

      // Enumerate all connected cameras
      let devices = [];
      try {
        devices = await Html5Qrcode.getCameras();
        if (devices && devices.length > 0) {
          setAvailableCameras(devices);
        }
      } catch (camListErr) {
        console.warn('Camera enumeration error:', camListErr);
      }

      const html5QrCode = new Html5Qrcode('qr-reader-container');
      html5QrCodeRef.current = html5QrCode;

      const qrConfig = {
        fps: 10,
        qrbox: (viewfinderWidth, viewfinderHeight) => {
          const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
          return {
            width: Math.max(180, Math.floor(minEdge * 0.72)),
            height: Math.max(180, Math.floor(minEdge * 0.72)),
          };
        },
        aspectRatio: 1.0,
      };

      const onScanSuccess = async (decodedText) => {
        await stopCameraScanner();
        await submitPresensi({
          kodeQR: decodedText,
          metode: 'KAMERA_SCAN',
          status: 'HADIR',
          tipe: tipePresensi,
        });
      };

      const onScanFailure = () => {
        // Ignore per-frame non-detection
      };

      // Launch strategy:
      // A. If user picked a camera specifically from selector
      if (selectedCameraId) {
        await html5QrCode.start(selectedCameraId, qrConfig, onScanSuccess, onScanFailure);
      } else {
        // B. Try environment (back camera for mobile), fallback to user / devices[0] for PC
        try {
          await html5QrCode.start({ facingMode: 'environment' }, qrConfig, onScanSuccess, onScanFailure);
        } catch (envErr) {
          console.warn('Environment camera failed, retrying with default camera:', envErr);
          if (devices && devices.length > 0) {
            setSelectedCameraId(devices[0].id);
            await html5QrCode.start(devices[0].id, qrConfig, onScanSuccess, onScanFailure);
          } else {
            await html5QrCode.start({ facingMode: 'user' }, qrConfig, onScanSuccess, onScanFailure);
          }
        }
      }
    } catch (err) {
      console.error('Camera Scanner Error:', err);
      setIsCameraActive(false);

      const errName = err?.name || '';
      const errMsg = err?.message || String(err);

      if (errName === 'NotAllowedError' || errMsg.includes('Permission denied') || errMsg.includes('permission')) {
        setError(
          'PERMISSION_DENIED: Izin akses kamera ditolak oleh browser. Klik ikon gembok / setelan di sebelah kiri URL pada browser Anda, ubah "Camera" menjadi "Allow (Izinkan)", lalu klik "Coba Lagi".'
        );
      } else if (errName === 'NotReadableError' || errMsg.includes('Device in use') || errMsg.includes('Could not start video source')) {
        setError(
          'DEVICE_IN_USE: Kamera sedang digunakan oleh aplikasi lain (seperti Zoom, Google Meet, Skype, atau aplikasi kamera bawaan). Harap tutup aplikasi tersebut lalu klik "Coba Lagi".'
        );
      } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError' || errMsg.includes('no camera')) {
        setError(
          'CAMERA_NOT_FOUND: Perangkat kamera tidak ditemukan pada komputer/laptop ini. Silakan gunakan fitur "Unggah Foto QR" atau tombol "Tes Simulasi Barcode".'
        );
      } else if (errName === 'OverconstrainedError') {
        setError(
          'OVERCONSTRAINED: Resolusi atau mode kamera tidak didukung oleh perangkat. Silakan coba pilih kamera lain dari dropdown di atas atau gunakan Unggah Foto QR.'
        );
      } else {
        setError(
          `Gagal mengaktifkan kamera (${errName || 'Error'}): ${errMsg}. Anda dapat menggunakan fitur "Unggah Foto QR" atau "Tes Simulasi Barcode".`
        );
      }
    } finally {
      setCameraLoading(false);
    }
  };

  const stopCameraScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
      } catch (err) {
        console.warn('Error stopping scanner:', err);
      }
    }
    setIsCameraActive(false);
  };

  const handleCameraChange = async (e) => {
    const newId = e.target.value;
    setSelectedCameraId(newId);
    if (isCameraActive) {
      await stopCameraScanner();
      setTimeout(() => {
        startCameraScanner();
      }, 300);
    }
  };

  // Upload image fallback
  const handleFileUploadScan = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    setResult(null);

    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const html5QrCode = new Html5Qrcode('qr-reader-file-temp');
      const decodedText = await html5QrCode.scanFile(file, true);
      
      await submitPresensi({
        kodeQR: decodedText,
        metode: 'UPLOAD_GAMBAR',
        status: 'HADIR',
        tipe: tipePresensi,
      });
    } catch (err) {
      setError('Tidak dapat mendeteksi kode QR dari gambar yang diunggah. Pastikan barcode terlihat jelas dan tidak terpotong.');
    }
  };

  // Demo simulation scan
  const handleDemoSimulationScan = async () => {
    const demoToken = `SIPKL-MITRA-${todayIso}-${tipePresensi}-738192`;
    await submitPresensi({
      kodeQR: demoToken,
      metode: 'SIMULASI_DEMO',
      status: 'HADIR',
      tipe: tipePresensi,
    });
  };

  // ----------------------------------------------------
  // SUBMIT PRESENSI HADIR (Scan / Manual)
  // ----------------------------------------------------
  const submitPresensi = async (payload) => {
    setSubmitting(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/presensi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          siswaNama: session?.user?.name || 'Ahmad Fauzi',
          nisn: '0051234567',
          latitude: geoData.latitude,
          longitude: geoData.longitude,
          accuracy: geoData.accuracy,
          lokasi: geoData.address || `GPS (${geoData.latitude?.toFixed(5)}, ${geoData.longitude?.toFixed(5)})`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Presensi gagal diproses.');
      } else {
        setResult(data);
        setTodayRecord(data.data);
        fetchPresensiData();
      }
    } catch (err) {
      setError('Terjadi kendala jaringan saat menghubungi server.');
    } finally {
      setSubmitting(false);
    }
  };

  // ----------------------------------------------------
  // SUBMIT FORM IZIN / SAKIT
  // ----------------------------------------------------
  const handleIzinSubmit = async (e) => {
    e.preventDefault();
    if (!formIzin.alasan) {
      setError('Mohon tuliskan alasan izin atau keterangan sakit Anda.');
      return;
    }

    setSubmitting(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/presensi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: formIzin.jenis,
          alasan: formIzin.alasan,
          lampiranUrl: formIzin.lampiranUrl,
          siswaNama: session?.user?.name || 'Ahmad Fauzi',
          nisn: '0051234567',
          latitude: geoData.latitude,
          longitude: geoData.longitude,
          lokasi: geoData.address || 'Kediaman Siswa',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Gagal mengirim permohonan izin');
      } else {
        setResult(data);
        setTodayRecord(data.data);
        setFormIzin({ jenis: 'SAKIT', alasan: '', lampiranUrl: '' });
        fetchPresensiData();
      }
    } catch (err) {
      setError('Gagal mengirim data izin. Coba kembali.');
    } finally {
      setSubmitting(false);
    }
  };

  // Statistics calculation
  const totalHadir = historyList.filter(p => p.status === 'HADIR').length;
  const totalSakit = historyList.filter(p => p.status === 'SAKIT').length;
  const totalIzin = historyList.filter(p => p.status === 'IZIN').length;
  const totalAlpha = 1;

  return (
    <div>
      {/* Hidden container for file scanner */}
      <div id="qr-reader-file-temp" style={{ display: 'none' }}></div>

      {/* Header */}
      <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div>
          <h1 className="page-title">Presensi Harian Siswa PKL</h1>
          <p className="page-subtitle">
            Pindai barcode QR presensi Mitra via kamera atau unggah gambar barcode, serta pantau jadwal kerja yang ditentukan langsung oleh pihak Mitra PKL Anda.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', padding: '8px 16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-sm)' }}>
          <IconClock size={18} color="var(--primary)" />
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{todayStr}</span>
        </div>
      </div>

      {/* KARTU JADWAL KERJA DITENTUKAN OLEH MITRA INDUSTRI */}
      <div
        className="card card-glow"
        style={{
          marginBottom: 'var(--space-md)',
          background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
          border: '1.5px solid #bfdbfe',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: '#dbeafe',
                color: '#1d4ed8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <IconMitra size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  🏢 Jadwal Kerja Ditentukan Oleh Mitra PKL
                </span>
                <span className="badge badge-primary" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                  Kebijakan Industri
                </span>
              </div>
              <h3 style={{ margin: '3px 0 0', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {jadwalMitra.mitraNama}
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                📍 {jadwalMitra.lokasiKantor} • Hari Kerja: <strong style={{ color: 'var(--text-primary)' }}>{jadwalMitra.hariKerja}</strong>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '0.78rem',
                background: '#ffffff',
                border: '1px solid #bfdbfe',
                padding: '4px 10px',
                borderRadius: '999px',
                color: '#1d4ed8',
                fontWeight: 600,
              }}
            >
              ⚙️ Ditetapkan Pembimbing Industri
            </span>
          </div>
        </div>

        {/* Schedule Metric Blocks */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div style={{ background: '#ffffff', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#047857' }}>
              <IconClock size={16} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Jam Masuk Mitra</span>
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              {jadwalMitra.jamMasuk} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>WIB</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '2px', fontWeight: 600 }}>
              ✓ Toleransi keterlambatan: +{jadwalMitra.toleransiMenit} menit
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ea580c' }}>
              <IconClock size={16} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Jam Pulang Mitra</span>
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              {jadwalMitra.jamPulang} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>WIB</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#c2410c', marginTop: '2px', fontWeight: 600 }}>
              ✓ Presensi pulang dilakukan saat jam kerja usai
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
              <IconAlert size={16} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Instruksi Mitra</span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
              {jadwalMitra.catatan || 'Wajib memindai barcode QR di kantor mitra untuk mencatat presensi masuk dan pulang.'}
            </p>
          </div>
        </div>
      </div>

      {/* LIVE GPS LOCATION STATUS BAR */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          background: '#ffffff',
          padding: '12px 18px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-primary)',
          marginBottom: 'var(--space-md)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: geoData.status === 'SUCCESS' ? '#ecfdf5' : '#eff6ff',
              color: geoData.status === 'SUCCESS' ? '#059669' : '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <IconMapPin size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Perekam Lokasi Presensi (GPS)
              </span>
              {geoData.status === 'SUCCESS' && (
                <span className="badge badge-success" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                  ✓ GPS Terkunci Aktif
                </span>
              )}
              {geoData.status === 'FETCHING' && (
                <span className="badge badge-info" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                  📡 Melacak Satelit GPS...
                </span>
              )}
              {geoData.status === 'DENIED' && (
                <span className="badge badge-warning" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                  📍 Estimasi Jaringan
                </span>
              )}
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {geoData.status === 'SUCCESS' ? (
                <>
                  Titik Koordinat: <strong style={{ color: 'var(--text-primary)' }}>{geoData.latitude?.toFixed(5)}, {geoData.longitude?.toFixed(5)}</strong>
                  {geoData.accuracy && ` (Akurasi: ±${geoData.accuracy}m)`}
                </>
              ) : geoData.status === 'FETCHING' ? (
                'Mengidentifikasi titik koordinat GPS perangkat Anda...'
              ) : (
                geoData.address || 'Area Mitra PKL SMKN 1 Perhentian Raja'
              )}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {geoData.latitude && geoData.longitude && (
            <a
              href={`https://www.google.com/maps?q=${geoData.latitude},${geoData.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-ghost"
              style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--primary)' }}
            >
              <IconExternalLink size={14} />
              <span>Lihat Google Maps</span>
            </a>
          )}
          <button
            type="button"
            onClick={detectLocation}
            disabled={geoData.status === 'FETCHING'}
            className="btn btn-sm btn-outline"
            style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            title="Deteksi ulang titik koordinat GPS"
          >
            <IconNavigation size={14} />
            <span>{geoData.status === 'FETCHING' ? 'Mencari...' : 'Perbarui Titik GPS'}</span>
          </button>
        </div>
      </div>

      {/* STATUS HARI INI CARD */}
      <div className="card" style={{ marginBottom: 'var(--space-xl)', background: '#ffffff', border: '1px solid var(--border-primary)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--role-gradient)' }}></div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div>
            <span className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Status Kehadiran Siswa Hari Ini
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
              {todayRecord?.status === 'HADIR' ? (
                <span className="badge badge-success" style={{ fontSize: '0.95rem', padding: '6px 14px' }}>
                  ✓ HADIR ({todayRecord.keterangan || 'Tepat Waktu'})
                </span>
              ) : todayRecord?.status === 'SAKIT' ? (
                <span className="badge badge-info" style={{ fontSize: '0.95rem', padding: '6px 14px' }}>
                  🏥 SAKIT (Surat Izin Terkirim)
                </span>
              ) : todayRecord?.status === 'IZIN' ? (
                <span className="badge badge-warning" style={{ fontSize: '0.95rem', padding: '6px 14px' }}>
                  📋 IZIN ({todayRecord.keterangan || 'Keperluan Mendesak'})
                </span>
              ) : (
                <span className="badge badge-danger" style={{ fontSize: '0.95rem', padding: '6px 14px' }}>
                  ✕ BELUM PRESENSI (Batas Masuk Sesuai Mitra: {jadwalMitra.jamMasuk} WIB • Toleransi {jadwalMitra.toleransiMenit}m)
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {/* Jam & Lokasi Masuk */}
            <div style={{ padding: '8px 16px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', minWidth: '160px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <IconClock size={14} color="var(--primary)" />
                <span className="text-xs text-secondary font-medium">Jam Masuk Siswa</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                {todayRecord?.jamMasuk || '-'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600, marginTop: '2px' }}>
                Target Mitra: {jadwalMitra.jamMasuk} WIB
              </div>
              {todayRecord?.lokasiMasuk && todayRecord.lokasiMasuk !== '-' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <IconMapPin size={12} color="#059669" />
                  <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={todayRecord.lokasiMasuk}>
                    {todayRecord.lokasiMasuk}
                  </span>
                  {todayRecord.mapsUrlMasuk && (
                    <a href={todayRecord.mapsUrlMasuk} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }} title="Buka di Maps">
                      <IconExternalLink size={11} />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Jam & Lokasi Pulang */}
            <div style={{ padding: '8px 16px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', minWidth: '160px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <IconClock size={14} color="#ea580c" />
                <span className="text-xs text-secondary font-medium">Jam Pulang Siswa</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                {todayRecord?.jamPulang || '-'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#ea580c', fontWeight: 600, marginTop: '2px' }}>
                Target Mitra: {jadwalMitra.jamPulang} WIB
              </div>
              {todayRecord?.lokasiPulang && todayRecord.lokasiPulang !== '-' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <IconMapPin size={12} color="#ea580c" />
                  <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={todayRecord.lokasiPulang}>
                    {todayRecord.lokasiPulang}
                  </span>
                  {todayRecord.mapsUrlPulang && (
                    <a href={todayRecord.mapsUrlPulang} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }} title="Buka di Maps">
                      <IconExternalLink size={11} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FEEDBACK NOTIFICATIONS */}
      {error && (
        <div className="alert alert-danger" style={{ marginBottom: 'var(--space-lg)', padding: '16px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <IconAlert size={24} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--danger)' }} />
            <div style={{ flex: 1 }}>
              <strong style={{ fontSize: '1rem' }}>Kendala Akses Kamera Terdeteksi:</strong>
              <p style={{ margin: '4px 0 12px', fontSize: '0.9rem', lineHeight: '1.5' }}>{error}</p>
              
              {/* Quick Action Fallbacks (No Manual Token) */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ffffff' }}
                >
                  <IconUpload size={16} />
                  <span>Unggah Foto QR Code</span>
                </button>

                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={handleDemoSimulationScan}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'underline' }}
                >
                  ⚡ Tes Presensi Barcode Demo
                </button>

                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={startCameraScanner}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ffffff' }}
                >
                  🔄 Coba Buka Kamera Lagi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="alert alert-success" style={{ marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <IconCheck size={20} />
          <span>{result.message}</span>
        </div>
      )}

      {/* TABS SELECTOR (Token Tab Removed) */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: 'var(--space-lg)', borderBottom: '1px solid var(--border-primary)', paddingBottom: '12px', flexWrap: 'wrap' }}>
        <button
          className={`btn ${activeTab === 'SCAN' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => {
            setActiveTab('SCAN');
            setError('');
          }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <IconCamera size={18} />
          <span>Metode 1: Scan Barcode / QR Kamera</span>
        </button>

        <button
          className={`btn ${activeTab === 'IZIN' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => {
            setActiveTab('IZIN');
            stopCameraScanner();
            setError('');
          }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <IconFileText size={18} />
          <span>Pengajuan Izin / Sakit</span>
        </button>

        <button
          className={`btn ${activeTab === 'RIWAYAT' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => {
            setActiveTab('RIWAYAT');
            stopCameraScanner();
            setError('');
          }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <IconClock size={18} />
          <span>Riwayat Kehadiran</span>
        </button>
      </div>

      {/* TAB 1: LIVE CAMERA QR SCANNER */}
      {activeTab === 'SCAN' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-lg)' }}>
          <div className="card text-center" style={{ padding: '28px 20px', background: '#ffffff' }}>
            {/* Tipe Selector */}
            <div style={{ display: 'inline-flex', background: 'var(--bg-primary)', padding: '4px', borderRadius: 'var(--radius-md)', marginBottom: '16px', gap: '4px' }}>
              <button
                className={`btn btn-sm ${tipePresensi === 'MASUK' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setTipePresensi('MASUK')}
              >
                🌅 Presensi Masuk
              </button>
              <button
                className={`btn btn-sm ${tipePresensi === 'PULANG' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setTipePresensi('PULANG')}
              >
                🌇 Presensi Pulang
              </button>
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>
              Pindai Barcode / QR Code Mitra
            </h3>
            <p className="text-secondary text-sm" style={{ maxWidth: '420px', margin: '0 auto 16px' }}>
              Arahkan kamera ke layar QR Code yang disediakan oleh Mitra PKL Anda.
            </p>

            {/* CAMERA SELECTION IF MULTIPLE */}
            {availableCameras.length > 1 && (
              <div style={{ marginBottom: '14px', maxWidth: '340px', margin: '0 auto 14px' }}>
                <select
                  className="form-control"
                  value={selectedCameraId}
                  onChange={handleCameraChange}
                  style={{ fontSize: '0.85rem' }}
                >
                  {availableCameras.map((cam, idx) => (
                    <option key={cam.id} value={cam.id}>
                      📷 {cam.label || `Kamera ${idx + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* DEDICATED CAMERA CONTAINER */}
            <div style={{ maxWidth: '340px', margin: '0 auto 18px', position: 'relative' }}>
              {/* Standby placeholder when camera is not running */}
              {!isCameraActive && (
                <div
                  style={{
                    width: '100%',
                    height: '260px',
                    background: '#0f172a',
                    borderRadius: 'var(--radius-xl)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94a3b8',
                    padding: '20px',
                  }}
                >
                  <div style={{ color: 'var(--primary-light)', marginBottom: '12px' }}>
                    <IconCamera size={52} />
                  </div>
                  <p style={{ fontSize: '0.95rem', fontWeight: 600, margin: '0 0 4px', color: '#f1f5f9' }}>
                    Kamera Belum Aktif
                  </p>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Klik tombol &ldquo;Buka Kamera Sekarang&rdquo;
                  </span>
                </div>
              )}

              {/* ISOLATED HTML5 QR READER (NO REACT CHILDREN INSIDE) */}
              <div
                id="qr-reader-container"
                style={{
                  display: isCameraActive ? 'block' : 'none',
                  width: '100%',
                  minHeight: '260px',
                  background: '#000000',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  border: '2px solid var(--primary)',
                  boxShadow: '0 0 20px var(--primary-glow)',
                }}
              />
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {!isCameraActive ? (
                <button
                  onClick={startCameraScanner}
                  disabled={cameraLoading}
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 22px' }}
                >
                  <IconCamera size={18} />
                  <span>{cameraLoading ? 'Mengakses Kamera...' : 'Buka Kamera Sekarang'}</span>
                </button>
              ) : (
                <button
                  onClick={stopCameraScanner}
                  className="btn btn-outline"
                  style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
                >
                  ✕ Matikan Kamera
                </button>
              )}

              {/* Upload screenshot file */}
              <label className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <IconUpload size={16} />
                <span>Unggah Foto QR</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileUploadScan}
                />
              </label>

              {/* Demo test button */}
              <button
                type="button"
                onClick={handleDemoSimulationScan}
                className="btn btn-ghost"
                title="Simulasi scan otomatis untuk pengetesan tanpa kamera fisik"
                style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textDecoration: 'underline' }}
              >
                ⚡ Tes Simulasi Barcode
              </button>
            </div>
          </div>

          {/* Troubleshooting & Guide Card */}
          <div className="card" style={{ background: '#ffffff' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconScan size={20} color="var(--primary)" />
              <span>Solusi Jika Kamera Tidak Terbuka</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
              <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>1. Izin Akses Browser:</strong>
                <p style={{ margin: '2px 0 0' }}>Pastikan browser Chrome/Firefox/Edge tidak memblokir kamera. Klik ikon gembok pada address bar dan ubah izin kamera menjadi <strong>Allow (Izinkan)</strong>.</p>
              </div>

              <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>2. Kamera Sedang Dipakai:</strong>
                <p style={{ margin: '2px 0 0' }}>Tutup aplikasi Zoom, Google Meet, Skype, atau aplikasi kamera bawaan yang mungkin sedang mengunci webcam.</p>
              </div>

              <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>3. Gunakan Metode Alternatif:</strong>
                <p style={{ margin: '2px 0 0' }}>Jika laptop/PC tidak memiliki webcam fisik atau kamera bermasalah, Anda dapat:</p>
                <ul style={{ paddingLeft: '16px', margin: '4px 0 0' }}>
                  <li>Klik tombol <strong>&ldquo;Unggah Foto QR&rdquo;</strong> untuk memilih foto barcode QR mitra yang tersimpan di perangkat.</li>
                  <li>Buka SIPKL melalui browser smartphone Anda yang memiliki kamera aktif.</li>
                  <li>Atau gunakan tombol <strong>&ldquo;Tes Simulasi Barcode&rdquo;</strong> untuk pengujian kehadiran instan.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FORM IZIN / SAKIT (NON-ALPHA) */}
      {activeTab === 'IZIN' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-lg)' }}>
          <div className="card" style={{ background: '#ffffff' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>
              Formulir Tidak Masuk Hari Ini
            </h3>
            <p className="text-secondary text-sm" style={{ marginBottom: '20px' }}>
              Jika Anda tidak dapat hadir di tempat magang hari ini karena sakit atau keperluan lain, wajib mengisi permohonan ini agar tidak dihitung <strong>ALPHA</strong>.
            </p>

            <form onSubmit={handleIzinSubmit}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Pilih Keterangan *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <label
                    style={{
                      border: formIzin.jenis === 'SAKIT' ? '2px solid var(--primary)' : '1px solid var(--border-primary)',
                      background: formIzin.jenis === 'SAKIT' ? 'var(--role-badge-bg)' : '#ffffff',
                      borderRadius: 'var(--radius-md)',
                      padding: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontWeight: 600,
                      color: formIzin.jenis === 'SAKIT' ? 'var(--primary)' : 'inherit',
                    }}
                  >
                    <input
                      type="radio"
                      name="jenisIzin"
                      value="SAKIT"
                      checked={formIzin.jenis === 'SAKIT'}
                      onChange={() => setFormIzin({ ...formIzin, jenis: 'SAKIT' })}
                    />
                    <span>🏥 Sakit (Surat Dokter)</span>
                  </label>

                  <label
                    style={{
                      border: formIzin.jenis === 'IZIN' ? '2px solid var(--primary)' : '1px solid var(--border-primary)',
                      background: formIzin.jenis === 'IZIN' ? 'var(--role-badge-bg)' : '#ffffff',
                      borderRadius: 'var(--radius-md)',
                      padding: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontWeight: 600,
                      color: formIzin.jenis === 'IZIN' ? 'var(--primary)' : 'inherit',
                    }}
                  >
                    <input
                      type="radio"
                      name="jenisIzin"
                      value="IZIN"
                      checked={formIzin.jenis === 'IZIN'}
                      onChange={() => setFormIzin({ ...formIzin, jenis: 'IZIN' })}
                    />
                    <span>📋 Izin Keperluan Lain</span>
                  </label>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Alasan / Penjelasan Rinci *</label>
                <textarea
                  rows="3"
                  required
                  className="form-control"
                  placeholder="Jelaskan alasan berhalangan hadir hari ini..."
                  value={formIzin.alasan}
                  onChange={(e) => setFormIzin({ ...formIzin, alasan: e.target.value })}
                ></textarea>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Tautan Bukti / Surat Dokter (Google Drive / Foto)</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://drive.google.com/... atau tautan gambar bukti"
                  value={formIzin.lampiranUrl}
                  onChange={(e) => setFormIzin({ ...formIzin, lampiranUrl: e.target.value })}
                />
                <span className="text-xs text-secondary">
                  Wajib melampirkan foto surat dokter jika izin sakit lebih dari 1 hari.
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary w-full"
                style={{ padding: '12px' }}
              >
                {submitting ? 'Mengirim Data Izin...' : 'Kirim Pengajuan Izin'}
              </button>
            </form>
          </div>

          <div className="card" style={{ background: '#ffffff' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>
              Aturan Presensi & Konsekuensi Alpha
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
              <div style={{ padding: '12px', background: '#eff6ff', borderRadius: 'var(--radius-md)', border: '1px solid #bfdbfe' }}>
                <strong style={{ color: '#1d4ed8' }}>✓ HADIR:</strong> Dicatat saat siswa melakukan scan barcode QR mitra di tempat PKL sesuai jam masuk dan pulang yang ditentukan oleh pihak mitra industri.
              </div>
              <div style={{ padding: '12px', background: '#ecfdf5', borderRadius: 'var(--radius-md)', border: '1px solid #a7f3d0' }}>
                <strong style={{ color: '#047857' }}>🏥 SAKIT / 📋 IZIN:</strong> Tidak dihitung alpha apabila mengisi form ini sebelum pukul 09.00 WIB dan diverifikasi oleh pihak mitra/guru.
              </div>
              <div style={{ padding: '12px', background: '#fef2f2', borderRadius: 'var(--radius-md)', border: '1px solid #fecaca' }}>
                <strong style={{ color: '#991b1b' }}>✕ ALPHA:</strong> Siswa yang tidak hadir dan tidak mengirimkan pengajuan izin secara otomatis berstatus ALPHA. Alpha lebih dari 3 kali akan diberikan surat peringatan dari sekolah.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REKAPITULASI & RIWAYAT */}
      {activeTab === 'RIWAYAT' && (
        <div className="card" style={{ background: '#ffffff' }}>
          {/* Summary Badges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            <div style={{ padding: '14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#16a34a' }}>{totalHadir}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#15803d' }}>Total Hadir</div>
            </div>
            <div style={{ padding: '14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2563eb' }}>{totalSakit}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1d4ed8' }}>Izin Sakit</div>
            </div>
            <div style={{ padding: '14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#d97706' }}>{totalIzin}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#b45309' }}>Izin Keperluan</div>
            </div>
            <div style={{ padding: '14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#dc2626' }}>{totalAlpha}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#b91c1c' }}>Alpha</div>
            </div>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>
            Log Riwayat Presensi Anda
          </h3>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Tanggal</th>
                  <th>Jam Masuk</th>
                  <th>Jam Pulang</th>
                  <th>Jejak Lokasi (GPS)</th>
                  <th>Status</th>
                  <th>Metode</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {historyList.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td>{idx + 1}</td>
                    <td style={{ fontWeight: 600 }}>{item.tanggal}</td>
                    <td>{item.jamMasuk}</td>
                    <td>{item.jamPulang}</td>
                    <td>
                      {item.lokasiMasuk && item.lokasiMasuk !== '-' ? (
                        <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <IconMapPin size={12} color="#059669" />
                            <span style={{ fontWeight: 600, color: '#059669' }}>Masuk:</span>
                            <span className="text-secondary" style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.lokasiMasuk}>
                              {item.lokasiMasuk}
                            </span>
                            {item.mapsUrlMasuk && (
                              <a href={item.mapsUrlMasuk} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }} title="Buka Google Maps">
                                <IconExternalLink size={11} />
                              </a>
                            )}
                          </div>

                          {item.lokasiPulang && item.lokasiPulang !== '-' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <IconMapPin size={12} color="#ea580c" />
                              <span style={{ fontWeight: 600, color: '#ea580c' }}>Pulang:</span>
                              <span className="text-secondary" style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.lokasiPulang}>
                                {item.lokasiPulang}
                              </span>
                              {item.mapsUrlPulang && (
                                <a href={item.mapsUrlPulang} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }} title="Buka Google Maps">
                                  <IconExternalLink size={11} />
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-secondary" style={{ fontSize: '0.8rem' }}>-</span>
                      )}
                    </td>
                    <td>
                      {item.status === 'HADIR' ? (
                        <span className="badge badge-success">✓ Hadir</span>
                      ) : item.status === 'SAKIT' ? (
                        <span className="badge badge-info">🏥 Sakit</span>
                      ) : item.status === 'IZIN' ? (
                        <span className="badge badge-warning">📋 Izin</span>
                      ) : (
                        <span className="badge badge-danger">✕ Alpha</span>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-secondary" style={{ fontSize: '0.75rem' }}>
                        {item.metode === 'KAMERA_SCAN' ? '📷 Kamera' : item.metode === 'UPLOAD_GAMBAR' ? '🖼️ Unggah QR' : item.metode === 'SIMULASI_DEMO' ? '⚡ Simulasi' : '📄 Form Izin'}
                      </span>
                    </td>
                    <td style={{ maxWidth: '240px' }}>
                      <span>{item.keterangan}</span>
                      {item.lampiranUrl && (
                        <a href={item.lampiranUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', color: 'var(--primary)', fontSize: '0.8rem', textDecoration: 'underline', marginTop: '2px' }}>
                          Lihat Bukti ↗
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
