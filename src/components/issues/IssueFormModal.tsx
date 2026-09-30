import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useIssues } from '../../context/IssueContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Issue, IssuePriority, IssueStatus, IssueCategory } from '../../types';
import { X, AlertCircle } from 'lucide-react';

interface IssueFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editIssue?: Issue | null;
  defaultStatus?: IssueStatus;
}

export const IssueFormModal: React.FC<IssueFormModalProps> = ({
  isOpen,
  onClose,
  editIssue,
  defaultStatus = 'open',
}) => {
  const { users, currentUser } = useAuth();
  const { createIssue, updateIssue } = useIssues();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<IssuePriority>('medium');
  const [status, setStatus] = useState<IssueStatus>(defaultStatus);
  const [category, setCategory] = useState<IssueCategory>('task');
  const [assigneeId, setAssigneeId] = useState(users[0]?.id || '');
  const [dueDate, setDueDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState<number>(8);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState('');

  const getDefaultDueDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  };

  useEffect(() => {
    if (editIssue) {
      setTitle(editIssue.title);
      setDescription(editIssue.description);
      setPriority(editIssue.priority);
      setStatus(editIssue.status);
      setCategory(editIssue.category);
      setAssigneeId(editIssue.assigneeId);
      setDueDate(editIssue.dueDate);
      setEstimatedHours(editIssue.estimatedHours || 8);
      setTags(editIssue.tags || []);
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus(defaultStatus);
      setCategory('task');
      setAssigneeId(currentUser?.id || users[0]?.id || '');
      setDueDate(getDefaultDueDate());
      setEstimatedHours(8);
      setTags(['backend']);
    }
    setError('');
  }, [editIssue, defaultStatus, isOpen, currentUser, users]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const cleaned = tagInput.trim().replace(/^#/, '').toLowerCase();
      if (cleaned && !tags.includes(cleaned)) {
        setTags([...tags, cleaned]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide a title.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a description.');
      return;
    }
    if (!dueDate) {
      setError('Please select a due date.');
      return;
    }

    if (editIssue) {
      updateIssue(editIssue.id, {
        title,
        description,
        priority,
        status,
        category,
        assigneeId,
        dueDate,
        estimatedHours,
        tags,
      });
      showToast(`Updated issue ${editIssue.key}`, 'info');
    } else {
      createIssue({
        title,
        description,
        priority,
        status,
        category,
        assigneeId,
        dueDate,
        estimatedHours,
        tags,
      });
      showToast('Created new issue successfully', 'success');
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="560px"
      title={editIssue ? `Edit Issue ${editIssue.key}` : 'Create Issue'}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 10px',
              backgroundColor: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.2)',
              borderRadius: 'var(--radius-xs)',
              color: '#f43f5e',
              fontSize: '0.78125rem',
            }}
          >
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        {/* Title */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px' }}>
            Title *
          </label>
          <input
            type="text"
            className="input-control"
            placeholder="Issue title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />
        </div>

        {/* Category, Priority & Status */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Category
            </label>
            <select
              className="input-control"
              value={category}
              onChange={(e) => setCategory(e.target.value as IssueCategory)}
            >
              <option value="bug">Bug</option>
              <option value="feature">Feature</option>
              <option value="task">Task</option>
              <option value="improvement">Improvement</option>
              <option value="security">Security</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Priority
            </label>
            <select
              className="input-control"
              value={priority}
              onChange={(e) => setPriority(e.target.value as IssuePriority)}
            >
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Status
            </label>
            <select
              className="input-control"
              value={status}
              onChange={(e) => setStatus(e.target.value as IssueStatus)}
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px' }}>
            Description *
          </label>
          <textarea
            className="input-control"
            rows={3}
            placeholder="Add description or context..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ resize: 'vertical', height: 'auto', minHeight: '70px', padding: '8px 10px' }}
          />
        </div>

        {/* Assignee, Due Date & Estimate */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 0.8fr', gap: '8px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Assignee
            </label>
            <select
              className="input-control"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Due Date *
            </label>
            <input
              type="date"
              className="input-control"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Estimate (h)
            </label>
            <input
              type="number"
              className="input-control"
              min={1}
              max={200}
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(parseInt(e.target.value) || 1)}
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px' }}>
            Tags (press Enter)
          </label>
          {tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '6px' }}>
              {tags.map((t) => (
                <span
                  key={t}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '1px 6px',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-secondary)',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.71875rem',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex' }}
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          )}
          <input
            type="text"
            className="input-control"
            placeholder="Type tag and press Enter..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {editIssue ? 'Save Changes' : 'Create Issue'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
