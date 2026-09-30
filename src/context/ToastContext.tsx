import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev.slice(-3), { id, message, type }]); // Keep at most 4 toasts

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Floating Toast Container */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          pointerEvents: 'none',
          maxWidth: '380px',
          width: 'calc(100% - 40px)',
        }}
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const isWarning = toast.type === 'warning';

          const icon = isSuccess ? (
            <CheckCircle2 size={15} color="var(--color-closed)" />
          ) : isError || isWarning ? (
            <AlertCircle size={15} color="var(--color-urgent)" />
          ) : (
            <Info size={15} color="var(--accent-primary)" />
          );

          const borderColor = isSuccess
            ? 'rgba(16, 185, 129, 0.3)'
            : isError || isWarning
            ? 'rgba(239, 68, 68, 0.3)'
            : 'rgba(94, 106, 210, 0.3)';

          return (
            <div
              key={toast.id}
              className="card-clean animate-fade-in"
              style={{
                pointerEvents: 'auto',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: 'var(--bg-surface)',
                border: `1px solid ${borderColor}`,
                boxShadow: 'var(--shadow-md)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                {icon}
              </div>
              <div
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  flex: 1,
                  lineHeight: 1.35,
                }}
              >
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="btn btn-ghost"
                style={{ height: '20px', width: '20px', padding: 0, color: 'var(--text-tertiary)' }}
                aria-label="Close notification"
              >
                <X size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
