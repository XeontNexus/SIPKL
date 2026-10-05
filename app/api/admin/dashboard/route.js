import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    stats: {
      totalSiswa: 142,
      totalGuru: 18,
      totalMitra: 42,
      siswaAktif: 138,
      presensiHariIni: 132,
      suratPending: 2,
    },
    recentActivity: [
      { id: '1', action: 'Presensi Masuk', user: 'Ahmad Fauzi (TKJ)', time: '10 menit yang lalu' },
      { id: '2', action: 'Logbook Dikirim', user: 'Siti Rahmawati (RPL)', time: '25 menit yang lalu' },
      { id: '3', action: 'Pengajuan Izin', user: 'Budi Santoso (TKJ)', time: '1 jam yang lalu' },
      { id: '4', action: 'Penilaian Diinput', user: 'PT Telkom Witel Riau', time: '2 jam yang lalu' },
    ],
  });
}
