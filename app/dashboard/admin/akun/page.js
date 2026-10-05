'use client';

import { useState, useEffect } from 'react';

export default function ManajemenAkunPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL');
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    role: 'SISWA',
    // Siswa fields
    nisn: '',
    kelas: '',
    jurusan: '',
    // Guru fields
    nip: '',
    bidangKeahlian: '',
    // Mitra fields
    namaPerusahaan: '',
    alamat: '',
    bidangUsaha: '',
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = activeTab === 'ALL' 
    ? users 
    : users.filter(u => u.role === activeTab);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      const url = editUser ? `/api/users/${editUser.id}` : '/api/users';
      const method = editUser ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || 'Gagal menyimpan data');
        setFormLoading(false);
        return;
      }

      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      setFormError('Terjadi kesalahan');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Yakin ingin menghapus akun ini?')) return;

    try {
      const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setFormData({
      nama: user.nama,
      email: user.email,
      password: '',
      role: user.role,
      nisn: user.siswa?.nisn || '',
      kelas: user.siswa?.kelas || '',
      jurusan: user.siswa?.jurusan || '',
      nip: user.guruPendamping?.nip || '',
      bidangKeahlian: user.guruPendamping?.bidangKeahlian || '',
      namaPerusahaan: user.mitra?.namaPerusahaan || '',
      alamat: user.mitra?.alamat || '',
      bidangUsaha: user.mitra?.bidangUsaha || '',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditUser(null);
    setFormData({
      nama: '', email: '', password: '', role: 'SISWA',
      nisn: '', kelas: '', jurusan: '',
      nip: '', bidangKeahlian: '',
      namaPerusahaan: '', alamat: '', bidangUsaha: '',
    });
    setFormError('');
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const roleBadge = (role) => {
    const colors = {
      ADMIN: 'danger',
      GURU: 'success',
      SISWA: 'primary',
      MITRA: 'warning',
    };
    const labels = {
      ADMIN: 'Admin',
      GURU: 'Guru',
      SISWA: 'Siswa',
      MITRA: 'Mitra',
    };
    return <span className={`badge badge-${colors[role]}`}>{labels[role]}</span>;
  };

  const tabs = [
    { key: 'ALL', label: 'Semua', icon: '👥' },
    { key: 'SISWA', label: 'Siswa', icon: '👨‍🎓' },
    { key: 'GURU', label: 'Guru', icon: '👨‍🏫' },
    { key: 'MITRA', label: 'Mitra', icon: '🏢' },
    { key: 'ADMIN', label: 'Admin', icon: '🔑' },
  ];

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Manajemen Akun</h1>
          <p className="page-subtitle">Kelola akun siswa, guru pendamping, dan mitra PKL</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          ➕ Buat Akun Baru
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-sm" style={{ marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`btn ${activeTab === tab.key ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Users Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div className="flex items-center justify-center" style={{ padding: '48px' }}>
            <div className="loading-spinner"></div>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Detail</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-md">
                        <div className="sidebar-avatar" style={{ width: '32px', height: '32px', fontSize: '0.7rem' }}>
                          {user.nama?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="font-semibold">{user.nama}</span>
                      </div>
                    </td>
                    <td className="text-secondary text-sm">{user.email}</td>
                    <td>{roleBadge(user.role)}</td>
                    <td className="text-sm text-secondary">
                      {user.role === 'SISWA' && user.siswa && `NISN: ${user.siswa.nisn} | ${user.siswa.kelas}`}
                      {user.role === 'GURU' && user.guruPendamping && `NIP: ${user.guruPendamping.nip}`}
                      {user.role === 'MITRA' && user.mitra && user.mitra.namaPerusahaan}
                      {user.role === 'ADMIN' && 'Administrator'}
                    </td>
                    <td>
                      <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {user.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-xs">
                        <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(user)}>
                          ✏️
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(user.id)}>
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <h4 className="empty-state-title">Belum ada data</h4>
            <p className="empty-state-desc">Klik &quot;Buat Akun Baru&quot; untuk menambahkan akun</p>
          </div>
        )}
      </div>

      {/* Modal Create/Edit */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editUser ? '✏️ Edit Akun' : '➕ Buat Akun Baru'}
              </h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {formError && (
                  <div className="login-error" style={{ marginBottom: '16px' }}>⚠️ {formError}</div>
                )}

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Nama Lengkap</label>
                    <input
                      className="form-input"
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      required
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      className="form-input"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Password {editUser && '(kosongkan jika tidak diubah)'}</label>
                    <input
                      className="form-input"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required={!editUser}
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <select
                      className="form-input form-select"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      disabled={editUser}
                    >
                      <option value="SISWA">👨‍🎓 Siswa</option>
                      <option value="GURU">👨‍🏫 Guru Pendamping</option>
                      <option value="MITRA">🏢 Mitra PKL</option>
                      <option value="ADMIN">🔑 Admin</option>
                    </select>
                  </div>
                </div>

                {/* Role-specific fields */}
                {formData.role === 'SISWA' && (
                  <>
                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label">NISN</label>
                        <input
                          className="form-input"
                          value={formData.nisn}
                          onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                          required
                          placeholder="Nomor NISN"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Kelas</label>
                        <input
                          className="form-input"
                          value={formData.kelas}
                          onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                          required
                          placeholder="Contoh: XII RPL 1"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Jurusan</label>
                      <input
                        className="form-input"
                        value={formData.jurusan}
                        onChange={(e) => setFormData({ ...formData, jurusan: e.target.value })}
                        required
                        placeholder="Contoh: Rekayasa Perangkat Lunak"
                      />
                    </div>
                  </>
                )}

                {formData.role === 'GURU' && (
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">NIP</label>
                      <input
                        className="form-input"
                        value={formData.nip}
                        onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                        required
                        placeholder="Nomor NIP"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Bidang Keahlian</label>
                      <input
                        className="form-input"
                        value={formData.bidangKeahlian}
                        onChange={(e) => setFormData({ ...formData, bidangKeahlian: e.target.value })}
                        placeholder="Contoh: Teknik Informatika"
                      />
                    </div>
                  </div>
                )}

                {formData.role === 'MITRA' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Nama Perusahaan</label>
                      <input
                        className="form-input"
                        value={formData.namaPerusahaan}
                        onChange={(e) => setFormData({ ...formData, namaPerusahaan: e.target.value })}
                        required
                        placeholder="PT. Contoh Perusahaan"
                      />
                    </div>
                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label">Alamat</label>
                        <input
                          className="form-input"
                          value={formData.alamat}
                          onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                          required
                          placeholder="Alamat perusahaan"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Bidang Usaha</label>
                        <input
                          className="form-input"
                          value={formData.bidangUsaha}
                          onChange={(e) => setFormData({ ...formData, bidangUsaha: e.target.value })}
                          required
                          placeholder="Contoh: IT & Software"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" disabled={formLoading}>
                  {formLoading ? (
                    <>
                      <span className="loading-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></span>
                      Menyimpan...
                    </>
                  ) : (
                    editUser ? '💾 Simpan Perubahan' : '➕ Buat Akun'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
