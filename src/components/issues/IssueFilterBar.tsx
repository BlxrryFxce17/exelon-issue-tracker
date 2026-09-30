import React from 'react';
import { useIssues } from '../../context/IssueContext';
import { useAuth } from '../../context/AuthContext';
import { IssuePriority, IssueStatus, IssueCategory } from '../../types';
import { RotateCcw } from 'lucide-react';

export const IssueFilterBar: React.FC = () => {
  const { filters, setFilters, resetFilters } = useIssues();
  const { users } = useAuth();

  const isFiltered =
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.category !== 'all' ||
    filters.assigneeId !== 'all' ||
    filters.tag !== 'all' ||
    filters.search !== '';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
        marginBottom: '14px',
      }}
    >
      {/* Status Filter */}
      <select
        className="input-control"
        style={{ width: 'auto', minWidth: '110px', height: '28px', fontSize: '0.78125rem' }}
        value={filters.status}
        onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value as 'all' | IssueStatus }))}
      >
        <option value="all">Status: All</option>
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="closed">Closed</option>
      </select>

      {/* Priority Filter */}
      <select
        className="input-control"
        style={{ width: 'auto', minWidth: '110px', height: '28px', fontSize: '0.78125rem' }}
        value={filters.priority}
        onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value as 'all' | IssuePriority }))}
      >
        <option value="all">Priority: All</option>
        <option value="urgent">Urgent</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      {/* Category Filter */}
      <select
        className="input-control"
        style={{ width: 'auto', minWidth: '110px', height: '28px', fontSize: '0.78125rem' }}
        value={filters.category}
        onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value as 'all' | IssueCategory }))}
      >
        <option value="all">Category: All</option>
        <option value="bug">Bug</option>
        <option value="feature">Feature</option>
        <option value="task">Task</option>
        <option value="improvement">Improvement</option>
        <option value="security">Security</option>
      </select>

      {/* Assignee Filter */}
      <select
        className="input-control"
        style={{ width: 'auto', minWidth: '130px', height: '28px', fontSize: '0.78125rem' }}
        value={filters.assigneeId}
        onChange={(e) => setFilters((prev) => ({ ...prev, assigneeId: e.target.value }))}
      >
        <option value="all">Assignee: All</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>

      {/* Sort Options */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
        <select
          className="input-control"
          style={{ width: 'auto', minWidth: '110px', height: '28px', fontSize: '0.78125rem' }}
          value={filters.sortBy}
          onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
        >
          <option value="createdAt">Created</option>
          <option value="updatedAt">Updated</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>

        <button
          onClick={() => setFilters((prev) => ({ ...prev, sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' }))}
          className="btn btn-secondary"
          style={{ height: '28px', padding: '0 8px', fontSize: '0.75rem' }}
        >
          {filters.sortOrder.toUpperCase()}
        </button>

        {isFiltered && (
          <button
            onClick={resetFilters}
            className="btn btn-ghost"
            style={{ height: '28px', padding: '0 8px', fontSize: '0.78125rem' }}
            title="Clear filters"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};
