import { NextResponse } from 'next/server';

let globalSuratIzin = [
  {
    id: '1',
    siswa: { user: { nama: 'Ahmad Fauzi' }, nisn: '0051234567', kelas: 'XII TKJ 1' },
    jenisSurat: 'IZIN_MAGANG',
    tanggalMulai: '2026-07-15',
    tanggalSelesai: '2026-10-15',
    alasan: 'Permohonan surat pengantar tugas PKL resmi dari sekolah ke PT Telkom Riau.',
    lampiranUrl: 'https://drive.google.com/file/d/surat-izin-magang/view',
    status: 'PENDING',
    catatanAdmin: '',
    createdAt: '2026-10-04',
  },
  {
    id: '2',
    siswa: { user: { nama: 'Budi Santoso' }, nisn: '0059876543', kelas: 'XII TKJ 2' },
    jenisSurat: 'IZIN_TIDAK_MASUK',
    tanggalMulai: '2026-10-05',
    tanggalSelesai: '2026-10-06',
    alasan: 'Izin sakit demam tinggi, ada surat keterangan dokter.',
    lampiranUrl: 'https://drive.google.com/file/d/surat-dokter/view',
    status: 'PENDING',
    catatanAdmin: '',
    createdAt: '2026-10-05',
  },
  {
    id: '3',
    siswa: { user: { nama: 'Siti Rahmawati' }, nisn: '0057654321', kelas: 'XII RPL 1' },
    jenisSurat: 'IZIN_MAGANG',
    tanggalMulai: '2026-07-15',
    tanggalSelesai: '2026-10-15',
    alasan: 'Permohonan pengantar magang di CV Tech Inovasi Digital.',
    lampiranUrl: '',
    status: 'APPROVED',
    catatanAdmin: 'Disetujui Admin. Surat resmi sudah diterbitkan.',
    createdAt: '2026-07-10',
  },
];

export async function GET() {
  return NextResponse.json(globalSuratIzin);
}
