import React from 'react';
import { useIssues } from '../../context/IssueContext';

interface MetricCardsProps {
  onFilterStatus?: (status: 'all' | 'open' | 'in_progress' | 'closed') => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ onFilterStatus }) => {
  const { metrics } = useIssues();

  const cards = [
    {
      id: 'total',
      label: 'Total Issues',
      value: metrics.total,
      sub: `${metrics.open + metrics.inProgress} active`,
      onClick: () => onFilterStatus?.('all'),
    },
    {
      id: 'open',
      label: 'Open',
      value: metrics.open,
      color: 'var(--color-open)',
      sub: `${Math.round((metrics.open / (metrics.total || 1)) * 100)}% of total`,
      onClick: () => onFilterStatus?.('open'),
    },
    {
      id: 'in_progress',
      label: 'In Progress',
      value: metrics.inProgress,
      color: 'var(--color-in-progress)',
      sub: 'Active work',
      onClick: () => onFilterStatus?.('in_progress'),
    },
    {
      id: 'closed',
      label: 'Closed',
      value: metrics.closed,
      color: 'var(--color-closed)',
      sub: `${metrics.resolutionRate}% resolved`,
      onClick: () => onFilterStatus?.('closed'),
    },
    {
      id: 'urgent',
      label: 'Urgent',
      value: metrics.urgent,
      color: 'var(--color-urgent)',
      sub: metrics.urgent > 0 ? 'Needs triage' : 'None',
    },
    {
      id: 'overdue',
      label: 'Overdue',
      value: metrics.overdue,
      color: metrics.overdue > 0 ? 'var(--color-urgent)' : 'var(--text-tertiary)',
      sub: metrics.overdue > 0 ? 'Past due date' : 'On track',
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))',
        gap: '10px',
        marginBottom: '14px',
      }}
    >
      {cards.map((card) => (
        <div
          key={card.id}
          className="card-clean"
          onClick={card.onClick}
          style={{
            padding: '14px 16px',
            cursor: card.onClick ? 'pointer' : 'default',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
            {card.label}
          </div>
          <div style={{ margin: '6px 0 4px 0' }}>
            <span
              style={{
                fontSize: '1.75rem',
                fontWeight: 600,
                color: card.color || 'var(--text-primary)',
                letterSpacing: '-0.03em',
              }}
            >
              {card.value}
            </span>
          </div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
            {card.sub}
          </div>
        </div>
      ))}
    </div>
  );
};
