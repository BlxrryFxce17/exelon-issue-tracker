import React from 'react';
import { useIssues } from '../../context/IssueContext';
import { Issue, IssueStatus } from '../../types';
import { IssueCard } from './IssueCard';
import { Circle, Clock, CheckCircle2, Plus, Inbox } from 'lucide-react';

interface IssueKanbanBoardProps {
  onSelectIssue: (issue: Issue) => void;
  onOpenCreateModal: (defaultStatus?: IssueStatus) => void;
}

export const IssueKanbanBoard: React.FC<IssueKanbanBoardProps> = ({
  onSelectIssue,
  onOpenCreateModal,
}) => {
  const { filteredIssues, updateStatus } = useIssues();

  const columns: {
    status: IssueStatus;
    title: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      status: 'open',
      title: 'Open',
      icon: <Circle size={13} color="var(--color-open)" strokeWidth={2.5} />,
      color: 'var(--color-open)',
    },
    {
      status: 'in_progress',
      title: 'In Progress',
      icon: <Clock size={13} color="var(--color-in-progress)" strokeWidth={2.2} />,
      color: 'var(--color-in-progress)',
    },
    {
      status: 'closed',
      title: 'Resolved',
      icon: <CheckCircle2 size={13} color="var(--color-closed)" strokeWidth={2.2} />,
      color: 'var(--color-closed)',
    },
  ];

  return (
    <div
      className="kanban-board-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '14px',
        alignItems: 'start',
      }}
    >
      {columns.map((col) => {
        const columnIssues = filteredIssues.filter((i) => i.status === col.status);

        return (
          <div
            key={col.status}
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'var(--bg-app)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              padding: '12px',
              minHeight: '400px',
            }}
          >
            {/* Column Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '10px',
                marginBottom: '10px',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {col.icon}
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {col.title}
                </span>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    color: col.color,
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  {columnIssues.length}
                </span>
              </div>

              <button
                onClick={() => onOpenCreateModal(col.status)}
                className="btn btn-ghost"
                style={{ height: '24px', width: '24px', padding: 0 }}
                title={`New issue in ${col.title}`}
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Issue Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              {columnIssues.length === 0 ? (
                <div
                  style={{
                    padding: '40px 16px',
                    textAlign: 'center',
                    color: 'var(--text-tertiary)',
                    fontSize: '0.78125rem',
                    border: '1px dashed var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    margin: 'auto 0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Inbox size={18} style={{ opacity: 0.6 }} />
                  <span>No {col.title.toLowerCase()} issues</span>
                </div>
              ) : (
                columnIssues.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    onClick={() => onSelectIssue(issue)}
                    onQuickStatusChange={(newStatus) => updateStatus(issue.id, newStatus)}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
