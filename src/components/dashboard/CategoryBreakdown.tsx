import React from 'react';
import { useIssues } from '../../context/IssueContext';
import { IssueCategory } from '../../types';
import { Bug, Layers, CheckSquare, TrendingUp, Shield } from 'lucide-react';

export const CategoryBreakdown: React.FC = () => {
  const { metrics } = useIssues();

  const categories: { key: IssueCategory; label: string; count: number; color: string; icon: React.ReactNode }[] = [
    { key: 'bug', label: 'Bugs', count: metrics.byCategory.bug, color: 'var(--color-urgent)', icon: <Bug size={14} /> },
    { key: 'feature', label: 'Features', count: metrics.byCategory.feature, color: '#8b5cf6', icon: <Layers size={14} /> },
    { key: 'task', label: 'Tasks', count: metrics.byCategory.task, color: 'var(--color-open)', icon: <CheckSquare size={14} /> },
    { key: 'improvement', label: 'Improvements', count: metrics.byCategory.improvement, color: 'var(--color-closed)', icon: <TrendingUp size={14} /> },
    { key: 'security', label: 'Security', count: metrics.byCategory.security, color: 'var(--color-high)', icon: <Shield size={14} /> },
  ];

  const total = metrics.total || 1;

  return (
    <div className="card-clean" style={{ padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Categories
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
            Issues grouped by classification
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
        {categories.map((c) => {
          const pct = Math.round((c.count / total) * 100);
          return (
            <div
              key={c.key}
              style={{
                padding: '12px',
                backgroundColor: 'var(--bg-app)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                transition: 'border-color 0.12s ease',
              }}
            >
              {/* Icon + Label */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: c.color,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  marginBottom: '8px',
                }}
              >
                {c.icon}
                <span style={{ color: 'var(--text-secondary)' }}>{c.label}</span>
              </div>

              {/* Count + Percentage */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {c.count}
                </span>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    color: 'var(--text-tertiary)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {pct}%
                </span>
              </div>

              {/* Mini progress bar */}
              <div
                style={{
                  marginTop: '8px',
                  height: '3px',
                  backgroundColor: 'var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    height: '100%',
                    backgroundColor: c.color,
                    borderRadius: 'var(--radius-full)',
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
