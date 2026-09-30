import React from 'react';
import { useIssues } from '../../context/IssueContext';
import { Avatar } from '../common/Avatar';

export const WorkloadProgress: React.FC = () => {
  const { metrics } = useIssues();

  return (
    <div className="card-clean" style={{ padding: '16px' }}>
      <div style={{ marginBottom: '14px' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Team Workload
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {metrics.byAssignee.map((assignee) => {
          const total = assignee.total || 0;
          const open = assignee.open || 0;
          const inProgress = assignee.inProgress || 0;
          const closed = assignee.closed || 0;
          const resolvedPct = total > 0 ? Math.round((closed / total) * 100) : 0;

          return (
            <div
              key={assignee.userId}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                backgroundColor: 'var(--bg-app)',
                borderRadius: 'var(--radius-sm)',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '120px' }}>
                <Avatar src={assignee.userAvatar} name={assignee.userName} size="xs" />
                <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                  {assignee.userName}
                </span>
              </div>

              <div style={{ flex: 1, maxWidth: '140px' }}>
                <div
                  style={{
                    height: '5px',
                    backgroundColor: 'var(--border-subtle)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                    display: 'flex',
                  }}
                >
                  {total > 0 ? (
                    <>
                      <div style={{ width: `${(closed / total) * 100}%`, backgroundColor: 'var(--color-closed)', transition: 'width 0.3s ease' }} />
                      <div style={{ width: `${(inProgress / total) * 100}%`, backgroundColor: 'var(--color-in-progress)', transition: 'width 0.3s ease' }} />
                      <div style={{ width: `${(open / total) * 100}%`, backgroundColor: 'var(--color-open)', transition: 'width 0.3s ease' }} />
                    </>
                  ) : (
                    <div style={{ width: '100%', backgroundColor: 'transparent' }} />
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>
                  {open + inProgress} active / {closed} done
                </span>
                <span style={{
                  fontWeight: 600,
                  color: resolvedPct === 100 && total > 0 ? 'var(--color-closed)' : 'var(--text-primary)',
                  width: '35px',
                  textAlign: 'right',
                }}>
                  {resolvedPct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
