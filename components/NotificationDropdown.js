'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IconBell, IconCheckCheck, IconAlertCircle, IconBriefcase, IconInbox } from './Icons';

export default function NotificationDropdown({ role = 'siswa', userName = '' }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`/api/notifikasi?role=${encodeURIComponent(role)}`);
      const json = await res.json();
      if (json.success) {
        setNotifications(json.data || []);
        setUnreadCount(json.unreadCount || 0);
      }
    } catch (e) {
      console.error('Failed to fetch notifications', e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [role]);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAsRead = async (id, link) => {
    try {
      await fetch('/api/notifikasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'MARK_READ', notificationId: id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      if (link && link !== '#') {
        setIsOpen(false);
        router.push(link);
      }
    } catch (e) {
      console.error('Failed to mark notification as read', e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setLoading(true);
      await fetch('/api/notifikasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'MARK_ALL_READ' }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error('Failed to mark all as read', e);
    } finally {
      setLoading(false);
    }
  };

  const formatRelativeTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);

    if (diffSec < 60) return 'Baru saja';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} mnt lalu`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} jam lalu`;
    return `${Math.floor(diffSec / 86400)} hari lalu`;
  };

  const renderIcon = (type) => {
    switch (type) {
      case 'INVITE':
      case 'ACC':
        return (
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <IconBriefcase size={16} />
          </div>
        );
      case 'WARNING':
        return (
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <IconAlertCircle size={16} />
          </div>
        );
      default:
        return (
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(59, 130, 246, 0.15)',
            color: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <IconInbox size={16} />
          </div>
        );
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        aria-label="Notifikasi"
        id="btn-header-notifikasi"
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          border: '1px solid var(--border)',
          background: isOpen ? 'var(--accent-glow)' : 'var(--bg-card)',
          color: isOpen ? 'var(--accent)' : 'var(--text-primary)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        <IconBell size={19} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              minWidth: '18px',
              height: '18px',
              padding: '0 4px',
              borderRadius: '9px',
              background: '#ef4444',
              color: '#ffffff',
              fontSize: '0.65rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)',
              animation: 'pulse 2s infinite',
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            right: 0,
            width: '360px',
            maxWidth: 'calc(100vw - 24px)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.25)',
            zIndex: 1000,
            overflow: 'hidden',
            animation: 'fadeInUp 0.2s ease',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              borderBottom: '1px solid var(--border)',
              background: 'var(--bg-card-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                Notifikasi
              </span>
              {unreadCount > 0 && (
                <span
                  style={{
                    background: 'var(--accent-glow)',
                    color: 'var(--accent)',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}
                >
                  {unreadCount} baru
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={loading}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--accent)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 6px',
                  borderRadius: '6px',
                }}
              >
                <IconCheckCheck size={14} />
                <span>Tandai Semua</span>
              </button>
            )}
          </div>

          {/* List Content */}
          <div
            style={{
              maxHeight: '360px',
              overflowY: 'auto',
              divideY: '1px solid var(--border)',
            }}
          >
            {notifications.length === 0 ? (
              <div
                style={{
                  padding: '36px 16px',
                  textAlign: 'center',
                  color: 'var(--text-secondary)',
                }}
              >
                <div style={{ marginBottom: '8px', opacity: 0.5 }}>
                  <IconInbox size={32} />
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Belum ada notifikasi</div>
                <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                  Aktivitas penting terkait PKL akan muncul di sini.
                </div>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleMarkAsRead(notif.id, notif.link)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--border)',
                    background: notif.isRead ? 'transparent' : 'rgba(59, 130, 246, 0.05)',
                    cursor: notif.link ? 'pointer' : 'default',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = notif.isRead ? 'transparent' : 'rgba(59, 130, 246, 0.05)';
                  }}
                >
                  {renderIcon(notif.type)}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                      <span
                        style={{
                          fontSize: '0.84rem',
                          fontWeight: notif.isRead ? 600 : 700,
                          color: 'var(--text-primary)',
                        }}
                      >
                        {notif.title}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {formatRelativeTime(notif.createdAt)}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--text-secondary)',
                        margin: '3px 0 0 0',
                        lineHeight: 1.4,
                      }}
                    >
                      {notif.message}
                    </p>
                  </div>

                  {!notif.isRead && (
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'var(--accent)',
                        marginTop: '6px',
                        flexShrink: 0,
                      }}
                      title="Belum dibaca"
                    />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '10px 16px',
              borderTop: '1px solid var(--border)',
              background: 'var(--bg-card-subtle)',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              SIPKL SMKN 1 Perhentian Raja &bull; Notifikasi Realtime
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
