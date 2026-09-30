import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useIssues } from '../../context/IssueContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Issue, IssueStatus } from '../../types';
import { PriorityBadge, StatusBadge, CategoryBadge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { formatDate, formatDateTime, formatRelativeTime, isOverdue } from '../../utils/helpers';
import {
  Send,
  Trash2,
  Edit2,
  Tag,
  MessageSquare,
  Copy,
  Link2,
} from 'lucide-react';

interface IssueDetailModalProps {
  issue: Issue | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (issue: Issue) => void;
  onDelete: (issue: Issue) => void;
}

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({
  issue,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  const { users, currentUser } = useAuth();
  const { updateStatus, reassignIssue, addComment, deleteComment, getCommentsForIssue } = useIssues();
  const { showToast } = useToast();

  const [commentText, setCommentText] = useState('');

  if (!issue) return null;

  const comments = getCommentsForIssue(issue.id);
  const overdue = isOverdue(issue.dueDate, issue.status);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(issue.key);
    showToast(`Copied ${issue.key} to clipboard`, 'success');
  };

  const handleCopyMarkdown = () => {
    const md = `[${issue.key}] ${issue.title}`;
    navigator.clipboard.writeText(md);
    showToast(`Copied markdown link for ${issue.key}`, 'success');
  };

  const handleStatusChange = (newStatus: IssueStatus) => {
    updateStatus(issue.id, newStatus);
    showToast(`Status changed to ${newStatus.replace('_', ' ')}`, 'info');
  };

  const handleReassign = (assigneeId: string) => {
    reassignIssue(issue.id, assigneeId);
    const assignedUser = users.find((u) => u.id === assigneeId);
    if (assignedUser) {
      showToast(`Reassigned to ${assignedUser.name}`, 'info');
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(issue.id, commentText);
    setCommentText('');
    showToast('Comment posted', 'success');
  };

  const handleDeleteComment = (commentId: string) => {
    deleteComment(commentId);
    showToast('Comment deleted', 'info');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="680px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              {/* Clickable Key */}
              <button
                onClick={handleCopyKey}
                className="btn btn-ghost"
                style={{
                  height: '22px',
                  padding: '1px 6px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--accent-primary)',
                  backgroundColor: 'var(--accent-primary-subtle)',
                  borderRadius: 'var(--radius-xs)',
                  gap: '4px',
                }}
                title="Click to copy key"
              >
                <span>{issue.key}</span>
                <Copy size={10} />
              </button>

              <CategoryBadge category={issue.category} />
              <PriorityBadge priority={issue.priority} />
              <StatusBadge status={issue.status} />
            </div>

            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.35 }}>
              {issue.title}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={handleCopyMarkdown}
              className="btn btn-secondary"
              style={{ height: '28px', fontSize: '0.75rem', padding: '0 8px' }}
              title="Copy markdown title & key"
            >
              <Link2 size={12} />
              <span>Copy Link</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(issue);
              }}
              className="btn btn-secondary"
              style={{ height: '28px', fontSize: '0.75rem', padding: '0 8px' }}
            >
              <Edit2 size={12} />
              <span>Edit</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onDelete(issue);
              }}
              className="btn btn-danger"
              style={{ height: '28px', fontSize: '0.75rem', padding: '0 8px' }}
            >
              <Trash2 size={12} />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Content Split: Description/Comments vs Sidebar Metadata */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '16px' }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Description */}
            <div
              style={{
                backgroundColor: 'var(--bg-app)',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Description
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                {issue.description}
              </p>

              {/* Tags */}
              {issue.tags && issue.tags.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                  <Tag size={11} color="var(--text-tertiary)" />
                  {issue.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.6875rem',
                        color: 'var(--text-tertiary)',
                        backgroundColor: 'var(--bg-surface)',
                        padding: '1px 5px',
                        borderRadius: 'var(--radius-xs)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Comments Thread */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <MessageSquare size={13} color="var(--text-secondary)" />
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Comments ({comments.length})
                </span>
              </div>

              {/* List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                {comments.length === 0 ? (
                  <div
                    style={{
                      padding: '16px',
                      backgroundColor: 'var(--bg-app)',
                      borderRadius: 'var(--radius-sm)',
                      textAlign: 'center',
                      color: 'var(--text-tertiary)',
                      fontSize: '0.78125rem',
                      border: '1px dashed var(--border-subtle)',
                    }}
                  >
                    No comments yet.
                  </div>
                ) : (
                  comments.map((cmt) => (
                    <div
                      key={cmt.id}
                      style={{
                        padding: '10px 12px',
                        backgroundColor: 'var(--bg-app)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Avatar src={cmt.authorAvatar} name={cmt.authorName} size="xs" />
                          <span style={{ fontSize: '0.78125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {cmt.authorName}
                          </span>
                          <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
                            · {formatRelativeTime(cmt.createdAt)}
                          </span>
                        </div>
                        {currentUser?.id === cmt.authorId && (
                          <button
                            onClick={() => handleDeleteComment(cmt.id)}
                            style={{ background: 'none', border: 'none', color: 'var(--color-urgent)', cursor: 'pointer', padding: '2px' }}
                            title="Delete comment"
                          >
                            <Trash2 size={11} />
                          </button>
                        )}
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {cmt.content}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Comment Input */}
              {currentUser ? (
                <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="input-control"
                    placeholder="Leave a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    style={{ height: '32px' }}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ height: '32px', padding: '0 12px' }}
                    disabled={!commentText.trim()}
                  >
                    <Send size={12} />
                    <span>Send</span>
                  </button>
                </form>
              ) : (
                <div style={{ fontSize: '0.78125rem', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                  Sign in to post comments.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Meta sidepanel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Status Dropdown */}
            <div style={{ backgroundColor: 'var(--bg-app)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Status
              </label>
              <select
                className="input-control"
                style={{ height: '28px' }}
                value={issue.status}
                onChange={(e) => handleStatusChange(e.target.value as IssueStatus)}
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Assignee Dropdown */}
            <div style={{ backgroundColor: 'var(--bg-app)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Assignee
              </label>
              <select
                className="input-control"
                style={{ height: '28px' }}
                value={issue.assigneeId}
                onChange={(e) => handleReassign(e.target.value)}
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Reporter info */}
            <div style={{ backgroundColor: 'var(--bg-app)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Reporter
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Avatar src={issue.reporterAvatar} name={issue.reporterName} size="xs" />
                <span style={{ fontSize: '0.78125rem', color: 'var(--text-primary)' }}>
                  {issue.reporterName}
                </span>
              </div>
            </div>

            {/* Timestamps */}
            <div
              style={{
                backgroundColor: 'var(--bg-app)',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                fontSize: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Due:</span>
                <span style={{ color: overdue ? 'var(--color-urgent)' : 'var(--text-primary)', fontWeight: overdue ? 600 : 400 }}>
                  {formatDate(issue.dueDate)}
                </span>
              </div>
              {issue.estimatedHours && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Estimate:</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{issue.estimatedHours}h</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Created:</span>
                <span style={{ color: 'var(--text-secondary)' }}>{formatDateTime(issue.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
