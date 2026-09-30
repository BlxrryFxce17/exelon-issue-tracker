import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useIssues } from '../../context/IssueContext';
import { Avatar } from '../common/Avatar';
import { Check } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenLogin,
}) => {
  const { currentUser, updateProfile, logout } = useAuth();
  const { issues } = useIssues();

  const [name, setName] = useState(currentUser?.name || '');
  const [department, setDepartment] = useState(currentUser?.department || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!currentUser) return null;

  const userIssues = issues.filter((i) => i.assigneeId === currentUser.id);
  const openCount = userIssues.filter((i) => i.status === 'open').length;
  const inProgressCount = userIssues.filter((i) => i.status === 'in_progress').length;
  const closedCount = userIssues.filter((i) => i.status === 'closed').length;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, department });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    onClose();
    onOpenLogin();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="420px" title="User Profile">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Profile Card */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            backgroundColor: 'var(--bg-app)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <Avatar src={currentUser.avatar} name={currentUser.name} size="lg" color={currentUser.color} />
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {currentUser.name}
            </h3>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
              {currentUser.email}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', marginTop: '2px', fontWeight: 500 }}>
              {currentUser.role.replace('_', ' ')} · {currentUser.department}
            </div>
          </div>
        </div>

        {/* Assigned Issues Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
          <div style={{ padding: '8px', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-xs)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--color-open)' }}>Open</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{openCount}</div>
          </div>
          <div style={{ padding: '8px', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-xs)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--color-in-progress)' }}>In Progress</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{inProgressCount}</div>
          </div>
          <div style={{ padding: '8px', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-xs)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--color-closed)' }}>Closed</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{closedCount}</div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Display Name
            </label>
            <input
              type="text"
              className="input-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Department
            </label>
            <input
              type="text"
              className="input-control"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              {isSaved ? <Check size={14} /> : null}
              <span>{isSaved ? 'Saved' : 'Save Profile'}</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-danger"
            >
              Sign Out
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
