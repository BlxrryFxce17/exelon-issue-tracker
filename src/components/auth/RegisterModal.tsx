import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Avatar } from '../common/Avatar';
import { AlertCircle } from 'lucide-react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
];

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onOpenLogin,
}) => {
  const { register, users } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('developer');
  const [department, setDepartment] = useState('Core Engineering');
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);
  const [error, setError] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim()) {
      setError('Please fill all required fields.');
      return;
    }

    const existing = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      setError('An account with this email already exists.');
      return;
    }

    register({
      name,
      email,
      password: password || 'password123',
      role,
      department,
      avatar: selectedAvatar,
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="460px" title="Create Account">
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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

        {/* Avatar Picker */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
            Avatar
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {PRESET_AVATARS.map((av, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedAvatar(av)}
                style={{
                  padding: 1,
                  background: 'none',
                  border: selectedAvatar === av ? '2px solid var(--accent-primary)' : '2px solid transparent',
                  borderRadius: '50%',
                  cursor: 'pointer',
                }}
              >
                <Avatar src={av} name={`Avatar ${idx + 1}`} size="xs" />
              </button>
            ))}
          </div>
        </div>

        {/* Name & Email */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Full Name *
            </label>
            <input
              type="text"
              className="input-control"
              placeholder="e.g. Maya Lin"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Work Email *
            </label>
            <input
              type="email"
              className="input-control"
              placeholder="maya.lin@exelon.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Role & Department */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Role
            </label>
            <select
              className="input-control"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              <option value="tech_lead">Tech Lead</option>
              <option value="developer">Developer</option>
              <option value="qa">QA Engineer</option>
              <option value="product_manager">Product Manager</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Department
            </label>
            <input
              type="text"
              className="input-control"
              placeholder="Core Engineering"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>
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
          Register
        </button>

        <div style={{ textAlign: 'center', fontSize: '0.78125rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenLogin();
            }}
            style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
          >
            Sign In
          </button>
        </div>
      </form>
    </Modal>
  );
};
