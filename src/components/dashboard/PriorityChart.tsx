import React from 'react';
import { useIssues } from '../../context/IssueContext';

export const PriorityChart: React.FC = () => {
  const { metrics } = useIssues();

  const priorities = [
    { label: 'Urgent', count: metrics.byPriority.urgent, color: '#ef4444' },
    { label: 'High', count: metrics.byPriority.high, color: '#f97316' },
    { label: 'Medium', count: metrics.byPriority.medium, color: '#eab308' },
    { label: 'Low', count: metrics.byPriority.low, color: '#64748b' },
  ];

  const maxCount = Math.max(...priorities.map((p) => p.count), 1);

  return (
    <div className="card-clean" style={{ padding: '16px' }}>
      <div style={{ marginBottom: '14px' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Priority Distribution
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {priorities.map((p) => {
          const widthPct = Math.round((p.count / maxCount) * 100);
          return (
            <div key={p.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78125rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{p.label}</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                  {p.count}
                </span>
              </div>
              <div
                style={{
                  height: '6px',
                  backgroundColor: 'var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${widthPct}%`,
                    backgroundColor: p.color,
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
