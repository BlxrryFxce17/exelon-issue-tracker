import { IssuePriority, IssueStatus, IssueCategory, Issue } from '../types';

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return formatDate(dateString);
  } catch {
    return dateString;
  }
}

export function isOverdue(dueDate: string, status: IssueStatus): boolean {
  if (status === 'closed') return false;
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today;
}

export function getPriorityColor(priority: IssuePriority): { bg: string; text: string; border: string; badgeBg: string } {
  switch (priority) {
    case 'urgent':
      return {
        bg: 'rgba(239, 68, 68, 0.12)',
        text: '#ef4444',
        border: 'rgba(239, 68, 68, 0.3)',
        badgeBg: '#ef4444',
      };
    case 'high':
      return {
        bg: 'rgba(249, 115, 22, 0.12)',
        text: '#f97316',
        border: 'rgba(249, 115, 22, 0.3)',
        badgeBg: '#f97316',
      };
    case 'medium':
      return {
        bg: 'rgba(234, 179, 8, 0.12)',
        text: '#eab308',
        border: 'rgba(234, 179, 8, 0.3)',
        badgeBg: '#eab308',
      };
    case 'low':
      return {
        bg: 'rgba(59, 130, 246, 0.12)',
        text: '#3b82f6',
        border: 'rgba(59, 130, 246, 0.3)',
        badgeBg: '#3b82f6',
      };
  }
}

export function getStatusColor(status: IssueStatus): { bg: string; text: string; border: string; label: string } {
  switch (status) {
    case 'open':
      return {
        bg: 'rgba(99, 102, 241, 0.12)',
        text: '#818cf8',
        border: 'rgba(99, 102, 241, 0.3)',
        label: 'Open',
      };
    case 'in_progress':
      return {
        bg: 'rgba(245, 158, 11, 0.12)',
        text: '#fbbf24',
        border: 'rgba(245, 158, 11, 0.3)',
        label: 'In Progress',
      };
    case 'closed':
      return {
        bg: 'rgba(16, 185, 129, 0.12)',
        text: '#34d399',
        border: 'rgba(16, 185, 129, 0.3)',
        label: 'Closed',
      };
  }
}

export function getCategoryBadge(category: IssueCategory): { iconName: string; color: string; bg: string } {
  switch (category) {
    case 'bug':
      return { iconName: 'Bug', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.12)' };
    case 'feature':
      return { iconName: 'Layers', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.12)' };
    case 'task':
      return { iconName: 'CheckSquare', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' };
    case 'improvement':
      return { iconName: 'TrendingUp', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' };
    case 'security':
      return { iconName: 'ShieldAlert', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)' };
  }
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.download = filename;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();

  // Keep element in DOM briefly so browser download manager captures the filename
  setTimeout(() => {
    if (document.body.contains(link)) {
      document.body.removeChild(link);
    }
    URL.revokeObjectURL(url);
  }, 1000);
}

export function exportToCSV(issues: Issue[]): void {
  const headers = ['Key', 'Title', 'Status', 'Priority', 'Category', 'Assignee', 'Reporter', 'Due Date', 'Tags', 'Created At'];
  const rows = issues.map((i) => [
    i.key,
    `"${(i.title || '').replace(/"/g, '""')}"`,
    i.status,
    i.priority,
    i.category,
    `"${(i.assigneeName || '').replace(/"/g, '""')}"`,
    `"${(i.reporterName || '').replace(/"/g, '""')}"`,
    i.dueDate || '',
    `"${(i.tags || []).join('; ')}"`,
    i.createdAt || '',
  ]);

  // Include UTF-8 Byte Order Mark (\uFEFF) so Excel opens it with proper encoding
  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, `nexustrack_issues_${new Date().toISOString().slice(0, 10)}.csv`);
}

export function exportToJSON(data: unknown, filename = 'nexustrack_export.json'): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
  triggerDownload(blob, filename);
}
