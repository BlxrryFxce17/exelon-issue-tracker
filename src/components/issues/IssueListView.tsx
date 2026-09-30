import React, { useState } from 'react';
import { useIssues } from '../../context/IssueContext';
import { Issue, IssueStatus } from '../../types';
import { PriorityBadge, StatusBadge, CategoryBadge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { formatDate, isOverdue } from '../../utils/helpers';
import {
  Edit2,
  Trash2,
  Calendar,
  Eye,
  CheckSquare,
  Square,
  Circle,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface IssueListViewProps {
  onSelectIssue: (issue: Issue) => void;
  onEditIssue: (issue: Issue) => void;
  onDeleteIssue: (issue: Issue) => void;
}

export const IssueListView: React.FC<IssueListViewProps> = ({
  onSelectIssue,
  onEditIssue,
  onDeleteIssue,
}) => {
  const { filteredIssues, updateStatus, deleteIssue } = useIssues();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectAll = () => {
    if (selectedIds.length === filteredIssues.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredIssues.map((i) => i.id));
    }
  };

  const handleToggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkStatusChange = (status: IssueStatus) => {
    selectedIds.forEach((id) => updateStatus(id, status));
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedIds.length} selected issues?`)) {
      selectedIds.forEach((id) => deleteIssue(id));
      setSelectedIds([]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div
          className="card-clean animate-fade-in"
          style={{
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            backgroundColor: 'var(--bg-surface-active)',
          }}
        >
          <span style={{ fontSize: '0.78125rem', fontWeight: 500, color: 'var(--text-primary)' }}>
            {selectedIds.length} selected
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => handleBulkStatusChange('open')}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', height: '26px', padding: '0 8px' }}
            >
              <Circle size={10} color="var(--color-open)" />
              <span>Open</span>
            </button>
            <button
              onClick={() => handleBulkStatusChange('in_progress')}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', height: '26px', padding: '0 8px' }}
            >
              <Clock size={10} color="var(--color-in-progress)" />
              <span>In Progress</span>
            </button>
            <button
              onClick={() => handleBulkStatusChange('closed')}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', height: '26px', padding: '0 8px' }}
            >
              <CheckCircle2 size={10} color="var(--color-closed)" />
              <span>Closed</span>
            </button>

            <button
              onClick={handleBulkDelete}
              className="btn btn-danger"
              style={{ fontSize: '0.75rem', height: '26px', padding: '0 8px' }}
            >
              <Trash2 size={11} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div
        className="card-clean"
        style={{
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-tertiary)',
                  fontSize: '0.71875rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                <th style={{ padding: '8px 12px', width: '32px' }}>
                  <button
                    onClick={handleSelectAll}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex' }}
                  >
                    {selectedIds.length === filteredIssues.length && filteredIssues.length > 0 ? (
                      <CheckSquare size={14} color="var(--accent-primary)" />
                    ) : (
                      <Square size={14} />
                    )}
                  </button>
                </th>
                <th style={{ padding: '8px 12px', width: '90px' }}>Key</th>
                <th style={{ padding: '8px 12px' }}>Title</th>
                <th style={{ padding: '8px 12px', width: '100px' }}>Category</th>
                <th style={{ padding: '8px 12px', width: '90px' }}>Priority</th>
                <th style={{ padding: '8px 12px', width: '110px' }}>Status</th>
                <th style={{ padding: '8px 12px', width: '140px' }}>Assignee</th>
                <th style={{ padding: '8px 12px', width: '110px' }}>Due Date</th>
                <th style={{ padding: '8px 12px', width: '80px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                    No issues match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredIssues.map((issue) => {
                  const isSelected = selectedIds.includes(issue.id);
                  const overdue = isOverdue(issue.dueDate, issue.status);

                  return (
                    <tr
                      key={issue.id}
                      onClick={() => onSelectIssue(issue)}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        backgroundColor: isSelected ? 'var(--bg-surface-active)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background-color 0.1s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {/* Checkbox */}
                      <td style={{ padding: '10px 12px' }} onClick={(e) => handleToggleSelect(issue.id, e)}>
                        <div style={{ display: 'flex', color: isSelected ? 'var(--accent-primary)' : 'var(--text-tertiary)' }}>
                          {isSelected ? <CheckSquare size={14} /> : <Square size={14} />}
                        </div>
                      </td>

                      {/* Key */}
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>
                          {issue.key}
                        </span>
                      </td>

                      {/* Title */}
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                          {issue.title}
                        </span>
                      </td>

                      {/* Category */}
                      <td style={{ padding: '10px 12px' }}>
                        <CategoryBadge category={issue.category} size="sm" />
                      </td>

                      {/* Priority */}
                      <td style={{ padding: '10px 12px' }}>
                        <PriorityBadge priority={issue.priority} size="sm" />
                      </td>

                      {/* Status */}
                      <td style={{ padding: '10px 12px' }}>
                        <StatusBadge status={issue.status} size="sm" />
                      </td>

                      {/* Assignee */}
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Avatar src={issue.assigneeAvatar} name={issue.assigneeName} size="xs" />
                          <span style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)' }}>
                            {issue.assigneeName}
                          </span>
                        </div>
                      </td>

                      {/* Due Date */}
                      <td style={{ padding: '10px 12px' }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.75rem',
                            color: overdue ? '#f43f5e' : 'var(--text-tertiary)',
                            fontWeight: overdue ? 600 : 400,
                          }}
                        >
                          <Calendar size={11} />
                          <span>{formatDate(issue.dueDate)}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                        <div
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2px' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => onSelectIssue(issue)}
                            className="btn btn-ghost"
                            style={{ height: '24px', width: '24px', padding: 0 }}
                            title="View"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            onClick={() => onEditIssue(issue)}
                            className="btn btn-ghost"
                            style={{ height: '24px', width: '24px', padding: 0 }}
                            title="Edit"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => onDeleteIssue(issue)}
                            className="btn btn-ghost"
                            style={{ height: '24px', width: '24px', padding: 0, color: '#f43f5e' }}
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
