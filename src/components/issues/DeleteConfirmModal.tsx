import React from 'react';
import { Modal } from '../common/Modal';
import { Issue } from '../../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  issue: Issue | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  issue,
  onClose,
  onConfirm,
}) => {
  if (!issue) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="400px" title="Delete Issue">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Are you sure you want to delete <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{issue.key}</strong>? This action cannot be undone.
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="btn btn-danger"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};
