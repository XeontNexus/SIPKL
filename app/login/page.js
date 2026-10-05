'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { IconAdmin, IconGuru, IconSiswa, IconMitra, IconEye } from '@/components/Icons';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Fetch session to get role for redirect
      const res = await fetch('/api/auth/session');
      const session = await res.json();

      if (session?.user?.role) {
        const roleRoutes = {
          ADMIN: '/dashboard/admin',
          GURU: '/dashboard/guru',
          SISWA: '/dashboard/siswa',
          MITRA: '/dashboard/mitra',
        };
        router.push(roleRoutes[session.user.role] || '/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-bg">
        <div className="login-bg-gradient login-bg-gradient-1"></div>
        <div className="login-bg-gradient login-bg-gradient-2"></div>
        <div className="login-bg-gradient login-bg-gradient-3"></div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <h1 className="login-title">Selamat Datang</h1>
          <p className="login-subtitle">Masuk ke SIPKL SMKN 1 Perhentian Raja</p>
        </div>

        {error && (
          <div className="login-error" style={{ marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Alamat Email
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="nama@smkn1perhentianraja.sch.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Kata Sandi
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="masukkan kata sandi anda"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{ paddingRight: '48px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <IconEye size={18} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary login-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></span>
                Memproses Masuk...
              </>
            ) : (
              'Masuk ke Sistem'
            )}
          </button>
        </form>

        {/* Quick Demo Login Buttons with Line Icons & Role Colors */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-primary)' }}>
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px', fontWeight: 600, letterSpacing: '0.02em' }}>
            AKUN DEMO (KLIK 1-KALI LANGSUNG ISI):
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{
                borderColor: 'rgba(99, 102, 241, 0.4)',
                background: 'rgba(99, 102, 241, 0.08)',
                color: '#a5b4fc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
              onClick={() => {
                setEmail('admin@smkn1perhentianraja.sch.id');
                setPassword('password123');
              }}
            >
              <IconAdmin size={15} />
              <span>Admin</span>
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{
                borderColor: 'rgba(16, 185, 129, 0.4)',
                background: 'rgba(16, 185, 129, 0.08)',
                color: '#6ee7b7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
              onClick={() => {
                setEmail('guru@smkn1perhentianraja.sch.id');
                setPassword('password123');
              }}
            >
              <IconGuru size={15} />
              <span>Guru</span>
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{
                borderColor: 'rgba(2, 132, 199, 0.4)',
                background: 'rgba(2, 132, 199, 0.08)',
                color: '#7dd3fc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
              onClick={() => {
                setEmail('siswa@smkn1perhentianraja.sch.id');
                setPassword('password123');
              }}
            >
              <IconSiswa size={15} />
              <span>Siswa</span>
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{
                borderColor: 'rgba(245, 158, 11, 0.4)',
                background: 'rgba(245, 158, 11, 0.08)',
                color: '#fde68a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
              onClick={() => {
                setEmail('mitra@smkn1perhentianraja.sch.id');
                setPassword('password123');
              }}
            >
              <IconMitra size={15} />
              <span>Mitra PKL</span>
            </button>
          </div>
        </div>

        <p style={{ 
          textAlign: 'center', 
          marginTop: '16px', 
          fontSize: '0.8rem', 
          color: 'var(--text-tertiary)' 
        }}>
          Hubungi admin sekolah jika belum memiliki akses akun
        </p>
      </div>
    </div>
  );
}
