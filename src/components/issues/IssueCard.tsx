import React from 'react';
import { Issue, IssueStatus } from '../../types';
import { PriorityBadge, CategoryBadge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { formatDate, isOverdue } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';
import { MessageSquare, Calendar, Clock } from 'lucide-react';

interface IssueCardProps {
  issue: Issue;
  onClick: () => void;
  onQuickStatusChange?: (newStatus: IssueStatus) => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  onClick,
}) => {
  const { showToast } = useToast();
  const overdue = isOverdue(issue.dueDate, issue.status);
  const isUrgent = issue.priority === 'urgent';

  return (
    <div
      onClick={onClick}
      className="card-clean"
      style={{
        padding: '12px 14px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        userSelect: 'none',
        borderLeft: isUrgent ? '3px solid var(--color-urgent)' : undefined,
      }}
    >
      {/* Top: Key & Meta */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(issue.key);
              showToast(`Copied ${issue.key} to clipboard`, 'success');
            }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.71875rem',
              fontWeight: 600,
              color: 'var(--accent-primary)',
              cursor: 'pointer',
            }}
            title="Click to copy key"
          >
            {issue.key}
          </span>
          <CategoryBadge category={issue.category} size="sm" />
        </div>
        <PriorityBadge priority={issue.priority} size="sm" />
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: '0.8125rem',
          fontWeight: 500,
          color: 'var(--text-primary)',
          lineHeight: 1.4,
          letterSpacing: '-0.01em',
        }}
      >
        {issue.title}
      </div>

      {/* Tags */}
      {issue.tags && issue.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {issue.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '0.65rem',
                color: 'var(--text-tertiary)',
                backgroundColor: 'var(--bg-app)',
                padding: '1px 6px',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--border-subtle)',
                fontWeight: 500,
              }}
            >
              {tag}
            </span>
          ))}
          {issue.tags.length > 3 && (
            <span
              style={{
                fontSize: '0.65rem',
                color: 'var(--text-tertiary)',
                padding: '1px 4px',
                fontWeight: 500,
              }}
            >
              +{issue.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '6px',
          borderTop: '1px solid var(--border-subtle)',
          marginTop: '2px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Avatar
            src={issue.assigneeAvatar}
            name={issue.assigneeName}
            size="xs"
            showTooltip
          />
          <span
            style={{
              fontSize: '0.71875rem',
              color: 'var(--text-secondary)',
              maxWidth: '80px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontWeight: 500,
            }}
          >
            {issue.assigneeName.split(' ')[0]}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Estimated hours */}
          {issue.estimatedHours && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                fontSize: '0.65rem',
                color: 'var(--text-tertiary)',
              }}
            >
              <Clock size={10} />
              <span>{issue.estimatedHours}h</span>
            </div>
          )}

          {/* Due date */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              fontSize: '0.65rem',
              color: overdue ? 'var(--color-urgent)' : 'var(--text-tertiary)',
              fontWeight: overdue ? 600 : 400,
            }}
          >
            <Calendar size={10} />
            <span>{formatDate(issue.dueDate).split(',')[0]}</span>
          </div>

          {/* Comments count */}
          {issue.commentsCount > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                fontSize: '0.65rem',
                color: 'var(--text-tertiary)',
              }}
            >
              <MessageSquare size={10} />
              <span>{issue.commentsCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
