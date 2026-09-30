import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useIssues } from '../../context/IssueContext';
import { Avatar } from '../common/Avatar';
import { UserCheck } from 'lucide-react';

export const TeamView: React.FC = () => {
  const { users, switchUser, currentUser } = useAuth();
  const { issues } = useIssues();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Engineering Team
        </h2>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
          Active members and ticket distribution
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
        {users.map((user) => {
          const userIssues = issues.filter((i) => i.assigneeId === user.id);
          const openCount = userIssues.filter((i) => i.status === 'open').length;
          const inProgressCount = userIssues.filter((i) => i.status === 'in_progress').length;
          const closedCount = userIssues.filter((i) => i.status === 'closed').length;
          const isCurrent = currentUser?.id === user.id;

          return (
            <div
              key={user.id}
              className="card-clean"
              style={{
                padding: '16px',
                border: isCurrent ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Avatar src={user.avatar} name={user.name} size="md" color={user.color} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.name}
                    </h3>
                    {isCurrent && (
                      <span
                        style={{
                          fontSize: '0.625rem',
                          fontWeight: 600,
                          backgroundColor: 'var(--accent-primary-subtle)',
                          color: 'var(--accent-primary)',
                          padding: '1px 5px',
                          borderRadius: 'var(--radius-xs)',
                        }}
                      >
                        YOU
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.email}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {user.department}
                  </div>
                </div>
              </div>

              {/* Status Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                <div style={{ padding: '6px', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-xs)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--color-open)' }}>Open</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>{openCount}</div>
                </div>
                <div style={{ padding: '6px', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-xs)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--color-in-progress)' }}>In Progress</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>{inProgressCount}</div>
                </div>
                <div style={{ padding: '6px', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-xs)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--color-closed)' }}>Closed</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>{closedCount}</div>
                </div>
              </div>

              {/* Switch Button */}
              {!isCurrent && (
                <button
                  onClick={() => switchUser(user.id)}
                  className="btn btn-secondary"
                  style={{ width: '100%', fontSize: '0.75rem', height: '28px' }}
                >
                  <UserCheck size={12} />
                  <span>Switch Profile</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
