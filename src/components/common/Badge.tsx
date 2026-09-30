import React from 'react';
import { IssuePriority, IssueStatus, IssueCategory } from '../../types';
import {
  Circle,
  Clock,
  CheckCircle2,
  SignalHigh,
  SignalMedium,
  SignalLow,
  AlertCircle,
  Bug,
  Layers,
  CheckSquare,
  TrendingUp,
  Shield,
} from 'lucide-react';

interface PriorityBadgeProps {
  priority: IssuePriority;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  showIcon = true,
  size = 'md',
}) => {
  const configs: Record<IssuePriority, { label: string; color: string; icon: React.ReactNode }> = {
    urgent: {
      label: 'Urgent',
      color: '#f43f5e',
      icon: <AlertCircle size={size === 'sm' ? 12 : 13} color="#f43f5e" />,
    },
    high: {
      label: 'High',
      color: '#fb923c',
      icon: <SignalHigh size={size === 'sm' ? 12 : 13} color="#fb923c" />,
    },
    medium: {
      label: 'Medium',
      color: '#eab308',
      icon: <SignalMedium size={size === 'sm' ? 12 : 13} color="#eab308" />,
    },
    low: {
      label: 'Low',
      color: '#64748b',
      icon: <SignalLow size={size === 'sm' ? 12 : 13} color="#64748b" />,
    },
  };

  const config = configs[priority];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: size === 'sm' ? '0.72rem' : '0.75rem',
        color: config.color,
        fontWeight: 500,
      }}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};

interface StatusBadgeProps {
  status: IssueStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const configs: Record<IssueStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    open: {
      label: 'Open',
      color: 'var(--color-open)',
      bg: 'var(--color-open-bg)',
      icon: <Circle size={size === 'sm' ? 10 : 12} color="var(--color-open)" strokeWidth={2.5} />,
    },
    in_progress: {
      label: 'In Progress',
      color: 'var(--color-in-progress)',
      bg: 'var(--color-in-progress-bg)',
      icon: <Clock size={size === 'sm' ? 11 : 13} color="var(--color-in-progress)" strokeWidth={2.2} />,
    },
    closed: {
      label: 'Closed',
      color: 'var(--color-closed)',
      bg: 'var(--color-closed-bg)',
      icon: <CheckCircle2 size={size === 'sm' ? 11 : 13} color="var(--color-closed)" strokeWidth={2.2} />,
    },
  };

  const config = configs[status];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: size === 'sm' ? '2px 7px' : '3px 9px',
        borderRadius: 'var(--radius-full)',
        backgroundColor: config.bg,
        color: config.color,
        fontSize: size === 'sm' ? '0.7rem' : '0.75rem',
        fontWeight: 500,
        border: `1px solid ${config.color}25`,
      }}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};

interface CategoryBadgeProps {
  category: IssueCategory;
  size?: 'sm' | 'md';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, size = 'md' }) => {
  const iconSize = size === 'sm' ? 11 : 12;

  const configs: Record<IssueCategory, { label: string; icon: React.ReactNode; color: string }> = {
    bug: { label: 'Bug', icon: <Bug size={iconSize} />, color: '#f43f5e' },
    feature: { label: 'Feature', icon: <Layers size={iconSize} />, color: '#8b5cf6' },
    task: { label: 'Task', icon: <CheckSquare size={iconSize} />, color: '#3b82f6' },
    improvement: { label: 'Improvement', icon: <TrendingUp size={iconSize} />, color: '#10b981' },
    security: { label: 'Security', icon: <Shield size={iconSize} />, color: '#fb923c' },
  };

  const config = configs[category];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        color: config.color,
        fontSize: size === 'sm' ? '0.7rem' : '0.75rem',
        fontWeight: 500,
      }}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
