// Store Notifikasi Terpusat untuk Seluruh Role di SIPKL

let globalNotificationStore = globalThis.__sipklNotificationStore || [
  {
    id: 'notif-1',
    role: 'siswa',
    userId: 'siswa-1',
    title: 'Undangan Bergabung Mitra',
    message: 'PT Riau Media Grafika mengirimkan undangan PKL kepada Anda via ID Unik Anda.',
    type: 'INVITE',
    link: '/dashboard/siswa/daftar-pkl',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
  },
  {
    id: 'notif-2',
    role: 'siswa',
    userId: 'siswa-1',
    title: 'Informasi Jadwal Presensi',
    message: 'Jadwal presensi ditentukan oleh mitra: Masuk pukul 08:00 WIB, Pulang pukul 16:00 WIB.',
    type: 'INFO',
    link: '/dashboard/siswa/presensi',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
  },
  {
    id: 'notif-3',
    role: 'siswa',
    userId: 'siswa-1',
    title: 'Kelengkapan Biodata',
    message: 'Pastikan biodata Anda sudah terisi lengkap agar permohonan PKL dapat segera di-ACC mitra.',
    type: 'WARNING',
    link: '/dashboard/siswa/profile',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: 'notif-4',
    role: 'mitra',
    userId: 'mitra-1',
    title: 'Pendaftar PKL Masuk',
    message: 'Ada siswa baru yang mengajukan permohonan PKL di perusahaan Anda dan menunggu ACC.',
    type: 'INVITE',
    link: '/dashboard/mitra',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'notif-5',
    role: 'guru',
    userId: 'guru-1',
    title: 'Monitoring Siswa PKL',
    message: 'Periode monitoring mingguan telah dibuka. Silakan tinjau logbook dan presensi siswa bimbingan Anda.',
    type: 'INFO',
    link: '/dashboard/guru/monitoring',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: 'notif-6',
    role: 'admin',
    userId: 'admin-1',
    title: 'Pembaruan Periode PKL',
    message: 'Data pembagian gelombang PKL tahun ajaran 2026/2027 telah disinkronkan.',
    type: 'INFO',
    link: '/dashboard/admin/periode',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
];

if (process.env.NODE_ENV !== 'production') {
  globalThis.__sipklNotificationStore = globalNotificationStore;
}

function getStore() {
  return globalThis.__sipklNotificationStore || globalNotificationStore;
}

export function getNotificationsByRole(role, userId) {
  const store = getStore();
  return store
    .filter((n) => {
      if (n.role && n.role !== role) return false;
      if (userId && n.userId && n.userId !== userId) return false;
      return true;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getUnreadCount(role, userId) {
  const notifs = getNotificationsByRole(role, userId);
  return notifs.filter((n) => !n.isRead).length;
}

export function addNotification({ role, userId, title, message, type = 'INFO', link = '#' }) {
  const store = getStore();
  const newNotif = {
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    role,
    userId,
    title,
    message,
    type,
    link,
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  store.unshift(newNotif);
  return newNotif;
}

export function markAsRead(notificationId) {
  const store = getStore();
  const notif = store.find((n) => n.id === notificationId);
  if (notif) {
    notif.isRead = true;
  }
  return notif;
}

export function markAllAsRead(role, userId) {
  const store = getStore();
  store.forEach((n) => {
    if ((!role || n.role === role) && (!userId || n.userId === userId)) {
      n.isRead = true;
    }
  });
  return true;
}
