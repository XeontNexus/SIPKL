import './globals.css';

export const metadata = {
  title: 'SIPKL — Sistem Informasi PKL SMKN1 Perhentian Raja',
  description: 'Aplikasi manajemen Praktek Kerja Lapangan (PKL) untuk SMKN1 Perhentian Raja. Kelola presensi, logbook, laporan, dan penilaian magang.',
  keywords: ['PKL', 'magang', 'SMKN1', 'Perhentian Raja', 'presensi', 'logbook'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
