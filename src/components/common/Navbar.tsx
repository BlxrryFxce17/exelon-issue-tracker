import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useIssues } from '../../context/IssueContext';
import { useToast } from '../../context/ToastContext';
import { getModKey } from '../../utils/platform';
import { Avatar } from './Avatar';
import {
  Search,
  Plus,
  Moon,
  Sun,
  ChevronDown,
  UserCheck,
  Download,
  RotateCcw,
  Check,
  FileJson,
  FileSpreadsheet,
  Keyboard,
} from 'lucide-react';

interface NavbarProps {
  onOpenCreateModal: () => void;
  onOpenLoginModal: () => void;
  onOpenProfileModal: () => void;
  onOpenShortcutsModal?: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCreateModal,
  onOpenLoginModal,
  onOpenProfileModal,
  onOpenShortcutsModal,
  searchQuery,
  setSearchQuery,
  searchInputRef,
}) => {
  const { currentUser, users, switchUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { exportIssuesCSV, exportIssuesJSON, resetToInitialData } = useIssues();
  const { showToast } = useToast();

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  const modKey = getModKey();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleExportCSV = () => {
    exportIssuesCSV();
    setShowExportMenu(false);
    showToast('Issues exported to CSV', 'success');
  };

  const handleExportJSON = () => {
    exportIssuesJSON();
    setShowExportMenu(false);
    showToast('Full backup exported to JSON', 'success');
  };

  const handleResetData = () => {
    if (confirm('Reset all issues to default demo state?')) {
      resetToInitialData();
      setShowExportMenu(false);
      showToast('Demo data restored to initial state', 'info');
    }
  };

  return (
    <header
      style={{
        height: 'var(--header-height)',
        backgroundColor: 'var(--bg-app)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 18px',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Workspace Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.85rem',
            letterSpacing: '-0.03em',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
          }}
        >
          N
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
            NexusTrack
          </span>
          <span
            style={{
              fontSize: '0.6875rem',
              color: 'var(--text-tertiary)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              padding: '1px 6px',
              borderRadius: 'var(--radius-xs)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 500,
            }}
          >
            Exelon
          </span>
        </div>
      </div>

      {/* Centered Search Bar */}
      <div
        className="navbar-search-container"
        style={{
          flex: 1,
          maxWidth: '440px',
          margin: '0 24px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Search
          size={14}
          style={{
            position: 'absolute',
            left: '12px',
            color: 'var(--text-tertiary)',
            pointerEvents: 'none',
          }}
        />
        <input
          ref={searchInputRef}
          type="text"
          className="input-control"
          placeholder="Search issues, tags, assignees..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            paddingLeft: '32px',
            paddingRight: '54px',
            height: '34px',
            fontSize: '0.8125rem',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
          }}
        />
        <div style={{ position: 'absolute', right: '10px', display: 'flex', alignItems: 'center', gap: '2px' }}>
          <span className="kbd-shortcut" title={`Focus Search (${modKey}+K or /)`}>
            {modKey} K
          </span>
        </div>
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {/* New Issue Button */}
        <button
          onClick={onOpenCreateModal}
          className="btn btn-primary"
          style={{ height: '32px', padding: '0 14px', fontSize: '0.8rem' }}
          title="Create New Issue (Press C)"
        >
          <Plus size={14} />
          <span>New Issue</span>
        </button>

        {/* Shortcuts Help Button */}
        {onOpenShortcutsModal && (
          <button
            onClick={onOpenShortcutsModal}
            className="btn btn-ghost"
            style={{ height: '32px', width: '32px', padding: 0 }}
            title="Keyboard Shortcuts (Press ?)"
          >
            <Keyboard size={15} />
          </button>
        )}

        {/* Data Tools Menu */}
        <div style={{ position: 'relative' }} ref={exportMenuRef}>
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="btn btn-ghost"
            style={{ height: '32px', width: '32px', padding: 0 }}
            title="Export & Tools"
          >
            <Download size={14} />
          </button>

          {showExportMenu && (
            <div
              className="card-clean animate-fade-in"
              style={{
                position: 'absolute',
                right: 0,
                top: '38px',
                width: '200px',
                padding: '6px',
                zIndex: 50,
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <button
                onClick={handleExportCSV}
                className="btn btn-ghost"
                style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.78rem', height: '30px', gap: '8px' }}
              >
                <FileSpreadsheet size={13} color="var(--accent-primary)" />
                <span>Export as CSV</span>
              </button>
              <button
                onClick={handleExportJSON}
                className="btn btn-ghost"
                style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.78rem', height: '30px', gap: '8px' }}
              >
                <FileJson size={13} color="#8b5cf6" />
                <span>Export as JSON</span>
              </button>
              <div style={{ height: 1, backgroundColor: 'var(--border-subtle)', margin: '4px 0' }} />
              <button
                onClick={handleResetData}
                className="btn btn-ghost"
                style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.78rem', height: '30px', gap: '8px', color: 'var(--color-urgent)' }}
              >
                <RotateCcw size={12} />
                <span>Reset Demo Data</span>
              </button>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn-ghost"
          style={{ height: '32px', width: '32px', padding: 0 }}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 20, backgroundColor: 'var(--border-subtle)', margin: '0 4px' }} />

        {/* User Account / Switcher */}
        {currentUser ? (
          <div style={{ position: 'relative' }} ref={userDropdownRef}>
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="btn btn-ghost"
              style={{
                height: '32px',
                padding: '0 8px 0 4px',
                gap: '8px',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <Avatar src={currentUser.avatar} name={currentUser.name} size="xs" color={currentUser.color} />
              <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                {currentUser.name.split(' ')[0]}
              </span>
              <ChevronDown size={12} color="var(--text-tertiary)" />
            </button>

            {showUserDropdown && (
              <div
                className="card-clean animate-fade-in"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '40px',
                  width: '230px',
                  padding: '8px',
                  zIndex: 50,
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                {/* Current User Header */}
                <div
                  onClick={() => { setShowUserDropdown(false); onOpenProfileModal(); }}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '4px',
                    transition: 'background-color 0.12s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" color={currentUser.color} />
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                      {currentUser.name}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>
                      {currentUser.role.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                <div style={{ height: 1, backgroundColor: 'var(--border-subtle)', margin: '4px 0' }} />
                <div style={{
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  color: 'var(--text-tertiary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  padding: '6px 10px 4px 10px',
                }}>
                  Switch Active Persona
                </div>

                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUser(u.id);
                      setShowUserDropdown(false);
                      showToast(`Switched active user to ${u.name.split(' ')[0]}`, 'info');
                    }}
                    className="btn btn-ghost"
                    style={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      gap: '8px',
                      height: '32px',
                      padding: '0 8px',
                      fontSize: '0.78125rem',
                      color: u.id === currentUser.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      backgroundColor: u.id === currentUser.id ? 'var(--accent-primary-subtle)' : 'transparent',
                    }}
                  >
                    <Avatar src={u.avatar} name={u.name} size="xs" color={u.color} />
                    <span style={{ fontWeight: u.id === currentUser.id ? 600 : 400 }}>
                      {u.name}
                    </span>
                    {u.id === currentUser.id && (
                      <Check size={12} style={{ marginLeft: 'auto', color: 'var(--accent-primary)' }} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <button onClick={onOpenLoginModal} className="btn btn-secondary" style={{ height: '32px' }}>
            <UserCheck size={13} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
