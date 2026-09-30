import React from 'react';
import { useIssues } from '../../context/IssueContext';

export const StatusChart: React.FC = () => {
  const { metrics } = useIssues();

  const total = metrics.total || 1;
  const openPct = (metrics.open / total) * 100;
  const progressPct = (metrics.inProgress / total) * 100;
  const closedPct = (metrics.closed / total) * 100;

  const segments = [
    { label: 'Open', value: metrics.open, pct: openPct, color: 'var(--color-open)' },
    { label: 'In Progress', value: metrics.inProgress, pct: progressPct, color: 'var(--color-in-progress)' },
    { label: 'Closed', value: metrics.closed, pct: closedPct, color: 'var(--color-closed)' },
  ];

  return (
    <div className="card-clean" style={{ padding: '16px' }}>
      <div style={{ marginBottom: '14px' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Status Breakdown
        </h3>
      </div>

      {/* Stacked bar */}
      <div
        style={{
          height: '10px',
          backgroundColor: 'var(--border-subtle)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          display: 'flex',
          marginBottom: '16px',
        }}
      >
        {segments.map((seg) =>
          seg.value > 0 ? (
            <div
              key={seg.label}
              title={`${seg.label}: ${seg.value}`}
              style={{ width: `${seg.pct}%`, backgroundColor: seg.color, transition: 'width 0.3s ease' }}
            />
          ) : null
        )}
      </div>

      {/* Legend */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        {segments.map((seg) => (
          <div key={seg.label} style={{ padding: '8px 10px', background: 'var(--bg-app)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: seg.color }} />
              <span>{seg.label}</span>
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 600, marginTop: '2px', color: 'var(--text-primary)' }}>
              {seg.value}
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontWeight: 400, marginLeft: '4px' }}>
                {Math.round(seg.pct)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
