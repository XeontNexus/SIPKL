'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  IconCheck,
  IconAlert,
  IconAlertCircle,
  IconClock,
} from './Icons';

const ModalAlertContext = createContext(null);

export function ModalAlertProvider({ children }) {
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'info', // 'info' | 'warning' | 'error' | 'success' | 'confirm' | 'prompt'
    title: '',
    message: '',
    confirmText: 'Mengerti',
    cancelText: 'Batal',
    promptValue: '',
    placeholder: '',
    onConfirm: null,
    onCancel: null,
  });

  const closeModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const showAlert = useCallback(({ title = 'Pemberitahuan', message, type = 'info', confirmText = 'Mengerti', onConfirm }) => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        type,
        title,
        message,
        confirmText,
        cancelText: '',
        promptValue: '',
        placeholder: '',
        onConfirm: () => {
          closeModal();
          if (onConfirm) onConfirm();
          resolve(true);
        },
        onCancel: () => {
          closeModal();
          resolve(true);
        },
      });
    });
  }, [closeModal]);

  const showConfirm = useCallback(({
    title = 'Konfirmasi',
    message,
    type = 'warning',
    confirmText = 'Ya, Lanjutkan',
    cancelText = 'Batal',
    onConfirm,
    onCancel,
  }) => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        type,
        title,
        message,
        confirmText,
        cancelText,
        promptValue: '',
        placeholder: '',
        onConfirm: () => {
          closeModal();
          if (onConfirm) onConfirm();
          resolve(true);
        },
        onCancel: () => {
          closeModal();
          if (onCancel) onCancel();
          resolve(false);
        },
      });
    });
  }, [closeModal]);

  const showPrompt = useCallback(({
    title = 'Input Data',
    message,
    defaultValue = '',
    placeholder = 'Masukkan keterangan...',
    confirmText = 'Kirim',
    cancelText = 'Batal',
  }) => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        type: 'prompt',
        title,
        message,
        confirmText,
        cancelText,
        promptValue: defaultValue,
        placeholder,
        onConfirm: (val) => {
          closeModal();
          resolve(val);
        },
        onCancel: () => {
          closeModal();
          resolve(null);
        },
      });
    });
  }, [closeModal]);

  // Expose global window methods so any file or legacy code automatically opens this modal
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__showModalAlert = showAlert;
      window.__showModalConfirm = showConfirm;
      window.__showModalPrompt = showPrompt;

      // Polyfill window.alert to modern modal
      const originalAlert = window.alert;
      window.alert = (msg) => {
        showAlert({
          title: 'Pemberitahuan',
          message: String(msg || ''),
          type: 'info',
        });
      };

      return () => {
        window.alert = originalAlert;
      };
    }
  }, [showAlert, showConfirm, showPrompt]);

  // Determine icon & color based on type
  const renderIcon = () => {
    switch (modalState.type) {
      case 'success':
        return (
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: '#dcfce7',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <IconCheck size={28} />
          </div>
        );
      case 'error':
        return (
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <IconAlert size={28} />
          </div>
        );
      case 'warning':
      default:
        return (
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <IconAlertCircle size={28} />
          </div>
        );
    }
  };

  const getConfirmBtnColor = () => {
    switch (modalState.type) {
      case 'success':
        return '#16a34a';
      case 'error':
        return '#dc2626';
      case 'warning':
        return '#2563eb';
      default:
        return '#2563eb';
    }
  };

  return (
    <ModalAlertContext.Provider value={{ showAlert, showConfirm, showPrompt }}>
      {children}

      {modalState.isOpen && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '16px',
            animation: 'fadeIn 0.2s ease',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && modalState.cancelText) {
              if (modalState.onCancel) modalState.onCancel();
            }
          }}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: '440px',
              background: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              padding: '24px',
              textAlign: 'center',
              border: '1px solid #e2e8f0',
              animation: 'scaleUp 0.2s ease',
            }}
          >
            {renderIcon()}

            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#1e293b',
                marginBottom: '8px',
              }}
            >
              {modalState.title}
            </h3>

            <p
              style={{
                fontSize: '0.92rem',
                color: '#475569',
                lineHeight: 1.6,
                marginBottom: modalState.type === 'prompt' ? '16px' : '24px',
                whiteSpace: 'pre-line',
              }}
            >
              {modalState.message}
            </p>

            {modalState.type === 'prompt' && (
              <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                <input
                  type="text"
                  autoFocus
                  className="form-control"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.9rem',
                  }}
                  placeholder={modalState.placeholder}
                  value={modalState.promptValue}
                  onChange={(e) =>
                    setModalState((prev) => ({ ...prev, promptValue: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (modalState.onConfirm) modalState.onConfirm(modalState.promptValue);
                    }
                  }}
                />
              </div>
            )}

            <div
              style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
              }}
            >
              {Boolean(modalState.cancelText) && (
                <button
                  type="button"
                  onClick={() => {
                    if (modalState.onCancel) modalState.onCancel();
                  }}
                  className="btn btn-outline"
                  style={{
                    flex: 1,
                    padding: '10px 18px',
                    borderRadius: '8px',
                    borderColor: '#cbd5e1',
                    color: '#475569',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {modalState.cancelText}
                </button>
              )}

              <button
                type="button"
                autoFocus={modalState.type !== 'prompt'}
                onClick={() => {
                  if (modalState.onConfirm) {
                    modalState.onConfirm(modalState.type === 'prompt' ? modalState.promptValue : true);
                  }
                }}
                className="btn"
                style={{
                  flex: 1,
                  padding: '10px 18px',
                  borderRadius: '8px',
                  background: getConfirmBtnColor(),
                  color: '#ffffff',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              >
                {modalState.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalAlertContext.Provider>
  );
}

export function useModalAlert() {
  const context = useContext(ModalAlertContext);
  if (!context) {
    return {
      showAlert: ({ title, message, type, onConfirm }) => {
        if (typeof window !== 'undefined' && window.__showModalAlert) {
          return window.__showModalAlert({ title, message, type, onConfirm });
        }
        return Promise.resolve(true);
      },
      showConfirm: ({ title, message, type, confirmText, cancelText, onConfirm, onCancel }) => {
        if (typeof window !== 'undefined' && window.__showModalConfirm) {
          return window.__showModalConfirm({ title, message, type, confirmText, cancelText, onConfirm, onCancel });
        }
        return Promise.resolve(false);
      },
      showPrompt: ({ title, message, defaultValue, placeholder }) => {
        if (typeof window !== 'undefined' && window.__showModalPrompt) {
          return window.__showModalPrompt({ title, message, defaultValue, placeholder });
        }
        return Promise.resolve(null);
      },
    };
  }
  return context;
}
