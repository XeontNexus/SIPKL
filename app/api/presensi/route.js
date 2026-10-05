import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

let mockPresensi = [
  {
    id: '1',
    nama: 'Ahmad Fauzi',
    nisn: '0051234567',
    tanggal: new Date().toISOString().split('T')[0],
    waktu: '07:45 WIB',
    jamMasuk: '07:45 WIB',
    jamPulang: '-',
    status: 'HADIR',
    tipe: 'MASUK',
    metode: 'KAMERA_SCAN',
    keterangan: 'Tepat Waktu via Scan Kamera',
    lokasiMasuk: 'Bengkel Astra Honda Motor (Perhentian Raja)',
    latMasuk: 0.381245,
    lngMasuk: 101.378912,
    mapsUrlMasuk: 'https://www.google.com/maps?q=0.381245,101.378912',
    lokasiPulang: '-',
    latPulang: null,
    lngPulang: null,
    mapsUrlPulang: null,
  },
  {
    id: '2',
    nama: 'Siti Rahmawati',
    nisn: '0057654321',
    tanggal: new Date().toISOString().split('T')[0],
    waktu: '07:52 WIB',
    jamMasuk: '07:52 WIB',
    jamPulang: '-',
    status: 'HADIR',
    tipe: 'MASUK',
    metode: 'INPUT_MANUAL',
    keterangan: 'Tepat Waktu via Input Token',
    lokasiMasuk: 'PT Riau Media Grafika (Pekanbaru)',
    latMasuk: 0.507120,
    lngMasuk: 101.447810,
    mapsUrlMasuk: 'https://www.google.com/maps?q=0.507120,101.447810',
    lokasiPulang: '-',
    latPulang: null,
    lngPulang: null,
    mapsUrlPulang: null,
  },
  {
    id: '3',
    nama: 'Budi Santoso',
    nisn: '0059876543',
    tanggal: new Date().toISOString().split('T')[0],
    waktu: '08:10 WIB',
    jamMasuk: '08:10 WIB',
    jamPulang: '-',
    status: 'HADIR',
    tipe: 'MASUK',
    metode: 'KAMERA_SCAN',
    keterangan: 'Terlambat 10 menit',
    lokasiMasuk: 'Kantor Telkom Kampar (Bangkinang)',
    latMasuk: 0.334120,
    lngMasuk: 101.023410,
    mapsUrlMasuk: 'https://www.google.com/maps?q=0.334120,101.023410',
    lokasiPulang: '-',
    latPulang: null,
    lngPulang: null,
    mapsUrlPulang: null,
  },
  {
    id: '4',
    nama: 'Dewi Lestari',
    nisn: '0053456789',
    tanggal: new Date().toISOString().split('T')[0],
    waktu: '-',
    jamMasuk: '-',
    jamPulang: '-',
    status: 'SAKIT',
    tipe: 'HARIAN',
    metode: 'SURAT_IZIN',
    keterangan: 'Demam & flu, surat dokter terlampir',
    lampiranUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=500',
    lokasiMasuk: 'Rumah (Surat Dokter Terlampir)',
    latMasuk: null,
    lngMasuk: null,
    mapsUrlMasuk: null,
    lokasiPulang: '-',
    latPulang: null,
    lngPulang: null,
    mapsUrlPulang: null,
  },
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tanggal = searchParams.get('tanggal');
  const nisn = searchParams.get('nisn');

  try {
    if (prisma) {
      const records = await prisma.presensi.findMany({
        where: {
          ...(tanggal && { tanggal: new Date(tanggal) }),
        },
        include: {
          siswa: {
            include: { user: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      if (records && records.length > 0) return NextResponse.json(records);
    }
  } catch (err) {
    console.warn('Prisma presensi error:', err.message);
  }

  let filtered = [...mockPresensi];
  if (tanggal) {
    filtered = filtered.filter(p => p.tanggal === tanggal);
  }
  if (nisn) {
    filtered = filtered.filter(p => p.nisn === nisn);
  }

  return NextResponse.json(filtered);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      status = 'HADIR',
      kodeQR = '',
      metode = 'KAMERA_SCAN',
      tipe = 'MASUK',
      siswaNama = 'Ahmad Fauzi',
      nisn = '0051234567',
      alasan = '',
      lampiranUrl = '',
      lokasi = '',
      latitude = null,
      longitude = null,
      accuracy = null,
    } = body;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;
    const todayStr = now.toISOString().split('T')[0];

    // Format Maps URL and readable location text
    const mapsUrl = (latitude && longitude)
      ? `https://www.google.com/maps?q=${latitude},${longitude}`
      : null;

    const formattedLokasi = lokasi || (latitude && longitude
      ? `GPS (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`
      : 'Area Mitra PKL (Perhentian Raja)');

    // Check if handling SAKIT or IZIN
    if (status === 'SAKIT' || status === 'IZIN') {
      const izinRecord = {
        id: Date.now().toString(),
        nama: siswaNama,
        nisn: nisn,
        tanggal: todayStr,
        waktu: timeStr,
        jamMasuk: '-',
        jamPulang: '-',
        status: status,
        tipe: 'HARIAN',
        metode: 'FORM_IZIN',
        keterangan: alasan || (status === 'SAKIT' ? 'Izin Sakit' : 'Izin Keperluan Lain'),
        lampiranUrl: lampiranUrl || '',
        lokasiMasuk: formattedLokasi,
        latMasuk: latitude,
        lngMasuk: longitude,
        mapsUrlMasuk: mapsUrl,
        lokasiPulang: '-',
        latPulang: null,
        lngPulang: null,
        mapsUrlPulang: null,
      };

      mockPresensi.unshift(izinRecord);

      return NextResponse.json({
        success: true,
        message: `Pengajuan ${status === 'SAKIT' ? 'Izin Sakit' : 'Izin Keperluan'} berhasil dikirim ke Mitra dan Admin`,
        data: izinRecord,
      });
    }

    // Presence via QR (Scan or Manual Input)
    if (!kodeQR || !kodeQR.startsWith('SIPKL-')) {
      return NextResponse.json({
        error: 'Kode QR / Barcode tidak valid atau bukan berasal dari Mitra Resmi SIPKL',
      }, { status: 400 });
    }

    // Determine on-time or late
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const isLate = tipe === 'MASUK' && (currentHour > 8 || (currentHour === 8 && currentMin > 0));
    const keteranganStr = isLate ? `Terlambat ${currentMin} menit` : 'Hadir Tepat Waktu';

    // Check if student already has a record today
    const existingIndex = mockPresensi.findIndex(p => p.nisn === nisn && p.tanggal === todayStr && p.status === 'HADIR');

    if (existingIndex !== -1 && tipe === 'PULANG') {
      // Update checkout time and checkout location
      mockPresensi[existingIndex].jamPulang = timeStr;
      mockPresensi[existingIndex].tipe = 'PULANG';
      mockPresensi[existingIndex].lokasiPulang = formattedLokasi;
      mockPresensi[existingIndex].latPulang = latitude;
      mockPresensi[existingIndex].lngPulang = longitude;
      mockPresensi[existingIndex].mapsUrlPulang = mapsUrl;

      return NextResponse.json({
        success: true,
        message: `Presensi PULANG berhasil dicatat pada ${timeStr} beserta koordinat lokasi GPS`,
        data: mockPresensi[existingIndex],
      });
    }

    const newRecord = {
      id: Date.now().toString(),
      nama: siswaNama,
      nisn: nisn,
      tanggal: todayStr,
      waktu: timeStr,
      jamMasuk: timeStr,
      jamPulang: tipe === 'PULANG' ? timeStr : '-',
      status: 'HADIR',
      tipe: tipe,
      metode: metode,
      keterangan: `${keteranganStr} (${metode === 'KAMERA_SCAN' ? 'Scan Kamera' : 'Input Manual'})`,
      lokasiMasuk: tipe === 'MASUK' ? formattedLokasi : '-',
      latMasuk: tipe === 'MASUK' ? latitude : null,
      lngMasuk: tipe === 'MASUK' ? longitude : null,
      mapsUrlMasuk: tipe === 'MASUK' ? mapsUrl : null,
      lokasiPulang: tipe === 'PULANG' ? formattedLokasi : '-',
      latPulang: tipe === 'PULANG' ? latitude : null,
      lngPulang: tipe === 'PULANG' ? longitude : null,
      mapsUrlPulang: tipe === 'PULANG' ? mapsUrl : null,
    };

    mockPresensi.unshift(newRecord);

    return NextResponse.json({
      success: true,
      message: `Presensi ${tipe} berhasil dicatat pada ${timeStr} (${keteranganStr}) beserta titik lokasi GPS`,
      data: newRecord,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

