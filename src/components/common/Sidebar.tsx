import React from 'react';
import { useIssues } from '../../context/IssueContext';
import {
  LayoutDashboard,
  Kanban,
  ListTodo,
  BarChart3,
  Activity,
  Users,
} from 'lucide-react';

export type NavTab = 'dashboard' | 'kanban' | 'list' | 'analytics' | 'activity' | 'team';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { metrics } = useIssues();

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; count?: number }[] = [
    {
      id: 'dashboard',
      label: 'Overview',
      icon: <LayoutDashboard size={15} />,
    },
    {
      id: 'kanban',
      label: 'Board',
      icon: <Kanban size={15} />,
      count: metrics.open + metrics.inProgress,
    },
    {
      id: 'list',
      label: 'Issues',
      icon: <ListTodo size={15} />,
      count: metrics.total,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 size={15} />,
    },
    {
      id: 'activity',
      label: 'Activity',
      icon: <Activity size={15} />,
    },
    {
      id: 'team',
      label: 'Team',
      icon: <Users size={15} />,
    },
  ];

  return (
    <aside
      className="app-sidebar"
      style={{
        width: 'var(--sidebar-width)',
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px 8px',
        flexShrink: 0,
        height: 'calc(100vh - var(--header-height))',
        position: 'sticky',
        top: 'var(--header-height)',
        transition: 'width 0.15s ease',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div
          className="sidebar-header"
          style={{
            fontSize: '0.6875rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text-tertiary)',
            padding: '4px 10px 8px 10px',
          }}
        >
          Workspace
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="btn"
              title={item.label}
              style={{
                width: '100%',
                justifyContent: 'flex-start',
                padding: '0 10px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isActive ? 'var(--accent-primary-subtle)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 400,
                border: isActive ? '1px solid rgba(94, 106, 210, 0.2)' : '1px solid transparent',
                transition: 'background-color 0.12s ease',
              }}
            >
              <span
                style={{
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {item.icon}
              </span>
              <span className="sidebar-label" style={{ flex: 1, textAlign: 'left', fontSize: '0.8125rem' }}>
                {item.label}
              </span>
              {item.count !== undefined && (
                <span
                  className="sidebar-count"
                  style={{
                    fontSize: '0.6875rem',
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    backgroundColor: isActive ? 'rgba(94, 106, 210, 0.12)' : 'transparent',
                    padding: '1px 5px',
                    borderRadius: 'var(--radius-xs)',
                  }}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Subtle workspace footer */}
      <div className="sidebar-footer">
        <div
          style={{
            padding: '10px 10px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: 'var(--color-closed)',
              }}
            />
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
              Operational
            </span>
          </div>
          <span
            style={{
              fontSize: '0.6875rem',
              color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            v1.2.0
          </span>
        </div>
      </div>
    </aside>
  );
};
