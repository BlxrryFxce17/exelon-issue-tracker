export type UserRole = 'admin' | 'tech_lead' | 'developer' | 'qa' | 'product_manager';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  department: string;
  avatar: string;
  initials: string;
  color: string;
  createdAt: string;
}

export type IssuePriority = 'low' | 'medium' | 'high' | 'urgent';
export type IssueStatus = 'open' | 'in_progress' | 'closed';
export type IssueCategory = 'bug' | 'feature' | 'task' | 'improvement' | 'security';

export interface Comment {
  id: string;
  issueId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: UserRole;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export type ActivityAction = 
  | 'created'
  | 'updated_status'
  | 'updated_priority'
  | 'reassigned'
  | 'commented'
  | 'edited_details'
  | 'closed'
  | 'reopened';

export interface ActivityLog {
  id: string;
  issueId: string;
  issueKey: string;
  issueTitle: string;
  userId: string;
  userName: string;
  userAvatar: string;
  action: ActivityAction;
  details: string;
  timestamp: string;
}

export interface Issue {
  id: string;
  key: string; // e.g. "EX-101"
  title: string;
  description: string;
  priority: IssuePriority;
  status: IssueStatus;
  category: IssueCategory;
  assigneeId: string;
  assigneeName: string;
  assigneeAvatar: string;
  reporterId: string;
  reporterName: string;
  reporterAvatar: string;
  dueDate: string; // YYYY-MM-DD
  estimatedHours?: number;
  tags: string[];
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

export interface IssueFilters {
  search: string;
  status: 'all' | IssueStatus;
  priority: 'all' | IssuePriority;
  category: 'all' | IssueCategory;
  assigneeId: 'all' | string;
  tag: 'all' | string;
  sortBy: 'createdAt' | 'updatedAt' | 'dueDate' | 'priority' | 'status' | 'title';
  sortOrder: 'asc' | 'desc';
}

export interface DashboardMetrics {
  total: number;
  open: number;
  inProgress: number;
  closed: number;
  urgent: number;
  overdue: number;
  resolutionRate: number; // percentage (0 - 100)
  byPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  byCategory: {
    bug: number;
    feature: number;
    task: number;
    improvement: number;
    security: number;
  };
  byAssignee: {
    userId: string;
    userName: string;
    userAvatar: string;
    total: number;
    open: number;
    inProgress: number;
    closed: number;
  }[];
}
