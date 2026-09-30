import React from 'react';
import { Modal } from './Modal';
import { getModKey, getOSName } from '../../utils/platform';
import { Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  const modKey = getModKey();
  const osName = getOSName();

  const sections = [
    {
      title: 'Navigation',
      shortcuts: [
        { keys: [`${modKey}`, 'K'], description: 'Focus search input' },
        { keys: ['/'], description: 'Quick search' },
        { keys: ['1'], description: 'Go to Overview' },
        { keys: ['2'], description: 'Go to Board (Kanban)' },
        { keys: ['3'], description: 'Go to All Issues' },
        { keys: ['4'], description: 'Go to Team' },
      ],
    },
    {
      title: 'Actions',
      shortcuts: [
        { keys: ['C'], description: 'Create new issue' },
        { keys: ['Esc'], description: 'Close open modal or dialog' },
        { keys: ['?'], description: 'Toggle this shortcuts cheatsheet' },
      ],
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="480px" title="Keyboard Shortcuts">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
            <Keyboard size={14} color="var(--accent-primary)" />
            <span>Detected system: <strong style={{ color: 'var(--text-primary)' }}>{osName}</strong></span>
          </div>
          <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
            Linear-style shortcuts
          </span>
        </div>

        {sections.map((sec) => (
          <div key={sec.title}>
            <div
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--text-tertiary)',
                marginBottom: '8px',
              }}
            >
              {sec.title}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {sec.shortcuts.map((sc) => (
                <div
                  key={sc.description}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 8px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    {sc.description}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {sc.keys.map((k, i) => (
                      <React.Fragment key={i}>
                        <kbd
                          className="kbd-shortcut"
                          style={{
                            minWidth: '22px',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            padding: '2px 6px',
                            backgroundColor: 'var(--bg-surface)',
                            borderColor: 'var(--border-medium)',
                            color: 'var(--text-primary)',
                            fontWeight: 600,
                          }}
                        >
                          {k}
                        </kbd>
                        {i < sc.keys.length - 1 && (
                          <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>+</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};
