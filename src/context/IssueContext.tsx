import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Issue,
  Comment,
  ActivityLog,
  IssueFilters,
  DashboardMetrics,
  IssueStatus,
  IssuePriority,
  IssueCategory,
} from '../types';
import { INITIAL_ISSUES, INITIAL_COMMENTS, INITIAL_ACTIVITY } from '../data/initialData';
import { useAuth } from './AuthContext';
import { exportToCSV, exportToJSON, isOverdue } from '../utils/helpers';
import confetti from 'canvas-confetti';

interface CreateIssueInput {
  title: string;
  description: string;
  priority: IssuePriority;
  status: IssueStatus;
  category: IssueCategory;
  assigneeId: string;
  dueDate: string;
  estimatedHours?: number;
  tags: string[];
}

interface IssueContextType {
  issues: Issue[];
  comments: Comment[];
  activities: ActivityLog[];
  filters: IssueFilters;
  setFilters: React.Dispatch<React.SetStateAction<IssueFilters>>;
  resetFilters: () => void;
  filteredIssues: Issue[];
  metrics: DashboardMetrics;
  createIssue: (input: CreateIssueInput) => Issue;
  updateIssue: (id: string, updates: Partial<Issue>) => void;
  deleteIssue: (id: string) => void;
  updateStatus: (id: string, newStatus: IssueStatus) => void;
  reassignIssue: (id: string, newAssigneeId: string) => void;
  addComment: (issueId: string, content: string) => void;
  deleteComment: (commentId: string) => void;
  getCommentsForIssue: (issueId: string) => Comment[];
  resetToInitialData: () => void;
  exportIssuesCSV: () => void;
  exportIssuesJSON: () => void;
}

const defaultFilters: IssueFilters = {
  search: '',
  status: 'all',
  priority: 'all',
  category: 'all',
  assigneeId: 'all',
  tag: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

const ISSUES_STORAGE_KEY = 'nexustrack_issues_v1';
const COMMENTS_STORAGE_KEY = 'nexustrack_comments_v1';
const ACTIVITY_STORAGE_KEY = 'nexustrack_activity_v1';

const IssueContext = createContext<IssueContextType | undefined>(undefined);

export const IssueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, users, getUserById } = useAuth();

  const [issues, setIssues] = useState<Issue[]>(() => {
    const saved = localStorage.getItem(ISSUES_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse issues:', e);
      }
    }
    return INITIAL_ISSUES;
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem(COMMENTS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse comments:', e);
      }
    }
    return INITIAL_COMMENTS;
  });

  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse activity logs:', e);
      }
    }
    return INITIAL_ACTIVITY;
  });

  const [filters, setFilters] = useState<IssueFilters>(defaultFilters);

  useEffect(() => {
    localStorage.setItem(ISSUES_STORAGE_KEY, JSON.stringify(issues));
  }, [issues]);

  useEffect(() => {
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activities));
  }, [activities]);

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const addActivity = (
    issueId: string,
    issueKey: string,
    issueTitle: string,
    action: ActivityLog['action'],
    details: string
  ) => {
    const newAct: ActivityLog = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      issueId,
      issueKey,
      issueTitle,
      userId: currentUser?.id || 'sys',
      userName: currentUser?.name || 'System',
      userAvatar:
        currentUser?.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const createIssue = (input: CreateIssueInput): Issue => {
    const issueNumber = issues.length + 101;
    const key = `EX-${issueNumber}`;
    const assignee = getUserById(input.assigneeId);
    const now = new Date().toISOString();

    const newIssue: Issue = {
      id: `iss-${Date.now()}`,
      key,
      title: input.title.trim(),
      description: input.description.trim(),
      priority: input.priority,
      status: input.status,
      category: input.category,
      assigneeId: input.assigneeId,
      assigneeName: assignee?.name || 'Unassigned',
      assigneeAvatar: assignee?.avatar || '',
      reporterId: currentUser?.id || 'usr-1',
      reporterName: currentUser?.name || 'Alex Vance',
      reporterAvatar: currentUser?.avatar || '',
      dueDate: input.dueDate,
      estimatedHours: input.estimatedHours || 4,
      tags: input.tags,
      commentsCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    setIssues((prev) => [newIssue, ...prev]);
    addActivity(
      newIssue.id,
      newIssue.key,
      newIssue.title,
      'created',
      `Created issue ${newIssue.key} (${newIssue.priority} priority) assigned to ${newIssue.assigneeName}`
    );

    return newIssue;
  };

  const updateIssue = (id: string, updates: Partial<Issue>) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === id) {
          const updated = {
            ...issue,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
          if (updates.assigneeId && updates.assigneeId !== issue.assigneeId) {
            const newAssignee = getUserById(updates.assigneeId);
            updated.assigneeName = newAssignee?.name || 'Unassigned';
            updated.assigneeAvatar = newAssignee?.avatar || '';
            addActivity(
              issue.id,
              issue.key,
              issue.title,
              'reassigned',
              `Reassigned to ${updated.assigneeName}`
            );
          }
          if (updates.status && updates.status !== issue.status) {
            addActivity(
              issue.id,
              issue.key,
              issue.title,
              'updated_status',
              `Changed status from ${issue.status.replace('_', ' ')} to ${updates.status.replace('_', ' ')}`
            );
            if (updates.status === 'closed') {
              updated.closedAt = new Date().toISOString();
              try {
                confetti({
                  particleCount: 50,
                  spread: 60,
                  origin: { y: 0.8 },
                });
              } catch (e) {
                // ignore
              }
            } else {
              updated.closedAt = undefined;
            }
          }
          return updated;
        }
        return issue;
      })
    );
  };

  const deleteIssue = (id: string) => {
    const target = issues.find((i) => i.id === id);
    if (target) {
      setIssues((prev) => prev.filter((i) => i.id !== id));
      setComments((prev) => prev.filter((c) => c.issueId !== id));
      addActivity(
        id,
        target.key,
        target.title,
        'edited_details',
        `Deleted issue ${target.key}`
      );
    }
  };

  const updateStatus = (id: string, newStatus: IssueStatus) => {
    updateIssue(id, { status: newStatus });
  };

  const reassignIssue = (id: string, newAssigneeId: string) => {
    updateIssue(id, { assigneeId: newAssigneeId });
  };

  const addComment = (issueId: string, content: string) => {
    if (!content.trim() || !currentUser) return;
    const target = issues.find((i) => i.id === issueId);
    if (!target) return;

    const newComment: Comment = {
      id: `cmt-${Date.now()}`,
      issueId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => [...prev, newComment]);
    setIssues((prev) =>
      prev.map((i) => (i.id === issueId ? { ...i, commentsCount: i.commentsCount + 1 } : i))
    );
    addActivity(
      issueId,
      target.key,
      target.title,
      'commented',
      `Added a comment: "${content.slice(0, 45)}${content.length > 45 ? '...' : ''}"`
    );
  };

  const deleteComment = (commentId: string) => {
    const cmt = comments.find((c) => c.id === commentId);
    if (cmt) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      setIssues((prev) =>
        prev.map((i) =>
          i.id === cmt.issueId ? { ...i, commentsCount: Math.max(0, i.commentsCount - 1) } : i
        )
      );
    }
  };

  const getCommentsForIssue = (issueId: string): Comment[] => {
    return comments.filter((c) => c.issueId === issueId);
  };

  const resetToInitialData = () => {
    setIssues(INITIAL_ISSUES);
    setComments(INITIAL_COMMENTS);
    setActivities(INITIAL_ACTIVITY);
    localStorage.removeItem(ISSUES_STORAGE_KEY);
    localStorage.removeItem(COMMENTS_STORAGE_KEY);
    localStorage.removeItem(ACTIVITY_STORAGE_KEY);
    resetFilters();
  };

  const exportIssuesCSV = () => {
    const dataToExport = filteredIssues.length > 0 ? filteredIssues : issues;
    exportToCSV(dataToExport);
  };

  const exportIssuesJSON = () => {
    exportToJSON(
      {
        exportDate: new Date().toISOString(),
        totalIssues: issues.length,
        issues,
        comments,
      },
      `nexustrack_backup_${new Date().toISOString().slice(0, 10)}.json`
    );
  };

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      // Search
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const matchTitle = issue.title.toLowerCase().includes(query);
        const matchKey = issue.key.toLowerCase().includes(query);
        const matchDesc = issue.description.toLowerCase().includes(query);
        const matchAssignee = issue.assigneeName.toLowerCase().includes(query);
        const matchTags = issue.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchTitle && !matchKey && !matchDesc && !matchAssignee && !matchTags) {
          return false;
        }
      }

      // Status
      if (filters.status !== 'all' && issue.status !== filters.status) {
        return false;
      }

      // Priority
      if (filters.priority !== 'all' && issue.priority !== filters.priority) {
        return false;
      }

      // Category
      if (filters.category !== 'all' && issue.category !== filters.category) {
        return false;
      }

      // Assignee
      if (filters.assigneeId !== 'all' && issue.assigneeId !== filters.assigneeId) {
        return false;
      }

      // Tag
      if (filters.tag !== 'all' && !issue.tags.includes(filters.tag)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (filters.sortBy === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (filters.sortBy === 'updatedAt') {
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      } else if (filters.sortBy === 'dueDate') {
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (filters.sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (filters.sortBy === 'priority') {
        const priorityRank: Record<IssuePriority, number> = {
          urgent: 4,
          high: 3,
          medium: 2,
          low: 1,
        };
        comparison = priorityRank[a.priority] - priorityRank[b.priority];
      } else if (filters.sortBy === 'status') {
        const statusRank: Record<IssueStatus, number> = {
          open: 1,
          in_progress: 2,
          closed: 3,
        };
        comparison = statusRank[a.status] - statusRank[b.status];
      }
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });
  }, [issues, filters]);

  const metrics: DashboardMetrics = useMemo(() => {
    const total = issues.length;
    const open = issues.filter((i) => i.status === 'open').length;
    const inProgress = issues.filter((i) => i.status === 'in_progress').length;
    const closed = issues.filter((i) => i.status === 'closed').length;
    const urgent = issues.filter((i) => i.priority === 'urgent' && i.status !== 'closed').length;
    const overdue = issues.filter((i) => isOverdue(i.dueDate, i.status)).length;
    const resolutionRate = total > 0 ? Math.round((closed / total) * 100) : 0;

    const byPriority = {
      low: issues.filter((i) => i.priority === 'low').length,
      medium: issues.filter((i) => i.priority === 'medium').length,
      high: issues.filter((i) => i.priority === 'high').length,
      urgent: issues.filter((i) => i.priority === 'urgent').length,
    };

    const byCategory = {
      bug: issues.filter((i) => i.category === 'bug').length,
      feature: issues.filter((i) => i.category === 'feature').length,
      task: issues.filter((i) => i.category === 'task').length,
      improvement: issues.filter((i) => i.category === 'improvement').length,
      security: issues.filter((i) => i.category === 'security').length,
    };

    const byAssignee = users.map((u) => {
      const userIssues = issues.filter((i) => i.assigneeId === u.id);
      return {
        userId: u.id,
        userName: u.name,
        userAvatar: u.avatar,
        total: userIssues.length,
        open: userIssues.filter((i) => i.status === 'open').length,
        inProgress: userIssues.filter((i) => i.status === 'in_progress').length,
        closed: userIssues.filter((i) => i.status === 'closed').length,
      };
    });

    return {
      total,
      open,
      inProgress,
      closed,
      urgent,
      overdue,
      resolutionRate,
      byPriority,
      byCategory,
      byAssignee,
    };
  }, [issues, users]);

  return (
    <IssueContext.Provider
      value={{
        issues,
        comments,
        activities,
        filters,
        setFilters,
        resetFilters,
        filteredIssues,
        metrics,
        createIssue,
        updateIssue,
        deleteIssue,
        updateStatus,
        reassignIssue,
        addComment,
        deleteComment,
        getCommentsForIssue,
        resetToInitialData,
        exportIssuesCSV,
        exportIssuesJSON,
      }}
    >
      {children}
    </IssueContext.Provider>
  );
};

export const useIssues = (): IssueContextType => {
  const context = useContext(IssueContext);
  if (!context) {
    throw new Error('useIssues must be used within an IssueProvider');
  }
  return context;
};
