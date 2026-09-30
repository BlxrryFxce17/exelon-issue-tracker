import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../common/Avatar';
import { AlertCircle } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegister: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onOpenRegister,
}) => {
  const { login, users, switchUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    const success = login(email, password);
    if (success) {
      onClose();
    } else {
      setError('Invalid credentials.');
    }
  };

  const handleQuickLogin = (userId: string) => {
    switchUser(userId);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="420px" title="Sign In">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Demo profiles quick switch */}
        <div>
          <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Instant Demo Logins
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
            {users.slice(0, 4).map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleQuickLogin(u.id)}
                className="btn btn-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  justifyContent: 'flex-start',
                  padding: '6px 8px',
                  height: 'auto',
                  textAlign: 'left',
                }}
              >
                <Avatar src={u.avatar} name={u.name} size="xs" color={u.color} />
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.75rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {u.name}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
                    {u.role.replace('_', ' ')}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
          <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            or email
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
        </div>

        {/* Email form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 8px',
                backgroundColor: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.2)',
                borderRadius: 'var(--radius-xs)',
                color: '#f43f5e',
                fontSize: '0.75rem',
              }}
            >
              <AlertCircle size={12} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Email
            </label>
            <input
              type="email"
              className="input-control"
              placeholder="alex.vance@exelon.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Password
            </label>
            <input
              type="password"
              className="input-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '4px' }}>
            Sign In
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.78125rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenRegister();
            }}
            style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
          >
            Register
          </button>
        </div>
      </div>
    </Modal>
  );
};
