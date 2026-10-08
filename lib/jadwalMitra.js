// Singleton in-memory store for Mitra PKL Schedule (synchronized across APIs)
let globalJadwal = globalThis.__sipklJadwalMitra || {
  mitraId: 'mitra-1',
  mitraNama: 'PT Telkom Indonesia Witel Riau',
  bidangUsaha: 'Telekomunikasi & Jaringan',
  jamMasuk: '08:00',
  jamPulang: '16:00',
  toleransiMenit: 15,
  hariKerja: 'Senin - Jumat',
  lokasiKantor: 'Jl. Jenderal Sudirman No. 199, Pekanbaru',
  catatan: 'Wajib melakukan scan barcode QR masuk dan pulang sesuai jam kerja mitra.',
  updatedAt: new Date().toISOString(),
};

if (process.env.NODE_ENV !== 'production') {
  globalThis.__sipklJadwalMitra = globalJadwal;
}

export function getJadwalMitra() {
  return globalThis.__sipklJadwalMitra || globalJadwal;
}

export function updateJadwalMitra(newData) {
  const current = getJadwalMitra();
  const updated = {
    ...current,
    ...newData,
    updatedAt: new Date().toISOString(),
  };
  globalThis.__sipklJadwalMitra = updated;
  return updated;
}
