import React from 'react';
import { useIssues } from '../../context/IssueContext';
import { Avatar } from '../common/Avatar';
import { formatRelativeTime } from '../../utils/helpers';
import { GitCommit, MessageSquare, ArrowRightLeft, PenLine, Plus, CheckCircle2 } from 'lucide-react';

interface ActivityFeedProps {
  limit?: number;
  onSelectIssue?: (issueId: string) => void;
}

const actionConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  created: { icon: <Plus size={12} />, label: 'created', color: 'var(--color-open)' },
  updated_status: { icon: <ArrowRightLeft size={12} />, label: 'moved', color: 'var(--color-in-progress)' },
  commented: { icon: <MessageSquare size={12} />, label: 'commented on', color: 'var(--accent-primary)' },
  reassigned: { icon: <GitCommit size={12} />, label: 'reassigned', color: '#8b5cf6' },
  edited_details: { icon: <PenLine size={12} />, label: 'edited', color: 'var(--text-secondary)' },
  closed: { icon: <CheckCircle2 size={12} />, label: 'resolved', color: 'var(--color-closed)' },
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ limit = 8, onSelectIssue }) => {
  const { activities } = useIssues();

  const displayed = activities.slice(0, limit);

  return (
    <div className="card-clean" style={{ padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Recent Activity
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
            Latest updates and status changes
          </p>
        </div>
        {activities.length > 0 && (
          <span
            style={{
              fontSize: '0.6875rem',
              color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-mono)',
              padding: '2px 8px',
              backgroundColor: 'var(--bg-app)',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {activities.length} events
          </span>
        )}
      </div>

      {displayed.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '28px 0',
            color: 'var(--text-tertiary)',
            fontSize: '0.8125rem',
          }}
        >
          No recent activity.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {displayed.map((act) => {
            const config = actionConfig[act.action] || actionConfig.edited_details;
            return (
              <div
                key={act.id}
                onClick={() => onSelectIssue?.(act.issueId)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: onSelectIssue ? 'pointer' : 'default',
                  transition: 'background-color 0.12s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Avatar src={act.userAvatar} name={act.userName} size="xs" />
                <div style={{ flex: 1, minWidth: 0, fontSize: '0.8125rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {act.userName.split(' ')[0]}
                    </span>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        color: config.color,
                        fontSize: '0.75rem',
                        fontWeight: 500,
                      }}
                    >
                      {config.icon}
                      {config.label}
                    </span>
                    <span
                      style={{
                        color: 'var(--accent-primary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.71875rem',
                        fontWeight: 600,
                      }}
                    >
                      {act.issueKey}
                    </span>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        color: 'var(--text-tertiary)',
                        marginLeft: 'auto',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {formatRelativeTime(act.timestamp)}
                    </span>
                  </div>
                  <div
                    style={{
                      color: 'var(--text-secondary)',
                      marginTop: '2px',
                      fontSize: '0.75rem',
                      lineHeight: 1.4,
                    }}
                  >
                    {act.details}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
