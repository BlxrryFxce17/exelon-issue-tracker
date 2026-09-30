import React, { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { IssueProvider, useIssues } from './context/IssueContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar, NavTab } from './components/common/Sidebar';
import { MetricCards } from './components/dashboard/MetricCards';
import { StatusChart } from './components/dashboard/StatusChart';
import { PriorityChart } from './components/dashboard/PriorityChart';
import { WorkloadProgress } from './components/dashboard/WorkloadProgress';
import { CategoryBreakdown } from './components/dashboard/CategoryBreakdown';
import { ActivityFeed } from './components/dashboard/ActivityFeed';
import { IssueFilterBar } from './components/issues/IssueFilterBar';
import { IssueKanbanBoard } from './components/issues/IssueKanbanBoard';
import { IssueListView } from './components/issues/IssueListView';
import { IssueDetailModal } from './components/issues/IssueDetailModal';
import { IssueFormModal } from './components/issues/IssueFormModal';
import { DeleteConfirmModal } from './components/issues/DeleteConfirmModal';
import { ShortcutsModal } from './components/common/ShortcutsModal';
import { LoginModal } from './components/auth/LoginModal';
import { RegisterModal } from './components/auth/RegisterModal';
import { UserProfileModal } from './components/auth/UserProfileModal';
import { TeamView } from './components/team/TeamView';
import { Issue, IssueStatus } from './types';
import { Plus } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { filters, setFilters, deleteIssue, issues, metrics } = useIssues();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createDefaultStatus, setCreateDefaultStatus] = useState<IssueStatus>('open');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [issueToDelete, setIssueToDelete] = useState<Issue | null>(null);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable;

      // Escape closes shortcuts modal
      if (e.key === 'Escape' && isShortcutsModalOpen) {
        setIsShortcutsModalOpen(false);
        return;
      }

      // Mod+K or "/" to focus search
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      if (!isInput && e.key === '/') {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      // Single-key shortcuts only active when not typing
      if (isInput || e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        handleOpenCreateModal('open');
      } else if (e.key === '1') {
        setActiveTab('dashboard');
      } else if (e.key === '2') {
        setActiveTab('kanban');
      } else if (e.key === '3') {
        setActiveTab('list');
      } else if (e.key === '4') {
        setActiveTab('team');
      } else if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsModalOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isShortcutsModalOpen]);

  const handleOpenCreateModal = (defaultStatus: IssueStatus = 'open') => {
    setCreateDefaultStatus(defaultStatus);
    setIsCreateModalOpen(true);
  };

  const handleSelectIssue = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsDetailModalOpen(true);
  };

  const handleEditIssue = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsEditModalOpen(true);
  };

  const handleDeleteIssue = (issue: Issue) => {
    setIssueToDelete(issue);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (issueToDelete) {
      deleteIssue(issueToDelete.id);
      showToast(`Deleted issue ${issueToDelete.key}`, 'warning');
      setIssueToDelete(null);
      if (selectedIssue?.id === issueToDelete.id) {
        setIsDetailModalOpen(false);
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-app)' }}>
      {/* Navbar */}
      <Navbar
        onOpenCreateModal={() => handleOpenCreateModal('open')}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
        searchQuery={filters.search}
        setSearchQuery={(q) => setFilters((prev) => ({ ...prev, search: q }))}
        searchInputRef={searchInputRef}
      />

      {/* Main Body */}
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Workspace View */}
        <main
          className="app-main-content"
          style={{
            flex: 1,
            padding: '20px 24px',
            overflowY: 'auto',
            maxWidth: '1440px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Clean Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div>
                  <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    Overview
                  </h1>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                    Engineering health, metrics and issue tracking
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setActiveTab('kanban')}
                    className="btn btn-secondary"
                  >
                    View Board
                  </button>
                  <button
                    onClick={() => handleOpenCreateModal('open')}
                    className="btn btn-primary"
                    title="Press C"
                  >
                    <Plus size={14} />
                    <span>New Issue</span>
                  </button>
                </div>
              </div>

              <MetricCards
                onFilterStatus={(st) => {
                  setFilters((prev) => ({ ...prev, status: st }));
                  setActiveTab('kanban');
                }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
                <StatusChart />
                <PriorityChart />
              </div>

              <div className="dashboard-2col-layout" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '14px' }}>
                <WorkloadProgress />
                <CategoryBreakdown />
              </div>

              <ActivityFeed
                onSelectIssue={(issueId) => {
                  const target = issues.find((i) => i.id === issueId);
                  if (target) handleSelectIssue(target);
                }}
              />
            </div>
          )}

          {/* KANBAN BOARD */}
          {activeTab === 'kanban' && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Board
                  </h1>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                    Status workflow tracking
                  </p>
                </div>
                <button
                  onClick={() => handleOpenCreateModal('open')}
                  className="btn btn-primary"
                >
                  <Plus size={14} />
                  <span>New Issue</span>
                </button>
              </div>

              <IssueFilterBar />
              <IssueKanbanBoard
                onSelectIssue={handleSelectIssue}
                onOpenCreateModal={handleOpenCreateModal}
              />
            </div>
          )}

          {/* LIST VIEW */}
          {activeTab === 'list' && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    All Issues
                  </h1>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                    Table view with filtering & bulk actions
                  </p>
                </div>
                <button
                  onClick={() => handleOpenCreateModal('open')}
                  className="btn btn-primary"
                >
                  <Plus size={14} />
                  <span>New Issue</span>
                </button>
              </div>

              <IssueFilterBar />
              <IssueListView
                onSelectIssue={handleSelectIssue}
                onEditIssue={handleEditIssue}
                onDeleteIssue={handleDeleteIssue}
              />
            </div>
          )}

          {/* ANALYTICS */}
          {activeTab === 'analytics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Analytics
                </h1>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                  Severity and workload breakdowns
                </p>
              </div>

              <MetricCards />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                <StatusChart />
                <PriorityChart />
              </div>

              <div className="dashboard-2col-layout" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '14px' }}>
                <WorkloadProgress />
                <CategoryBreakdown />
              </div>
            </div>
          )}

          {/* ACTIVITY AUDIT */}
          {activeTab === 'activity' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Activity Audit Trail
                </h1>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                  Chronological history of updates and state changes
                </p>
              </div>

              <ActivityFeed
                limit={50}
                onSelectIssue={(issueId) => {
                  const target = issues.find((i) => i.id === issueId);
                  if (target) handleSelectIssue(target);
                }}
              />
            </div>
          )}

          {/* TEAM */}
          {activeTab === 'team' && <TeamView />}
        </main>
      </div>

      {/* Modals */}
      <IssueFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        defaultStatus={createDefaultStatus}
      />

      <IssueFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedIssue(null);
        }}
        editIssue={selectedIssue}
      />

      <IssueDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedIssue(null);
        }}
        issue={selectedIssue}
        onEdit={(issue) => {
          setSelectedIssue(issue);
          setIsEditModalOpen(true);
        }}
        onDelete={(issue) => {
          handleDeleteIssue(issue);
        }}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        issue={issueToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setIssueToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      <ShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onOpenRegister={() => setIsRegisterModalOpen(true)}
      />

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <IssueProvider>
          <ToastProvider>
            <MainAppContent />
          </ToastProvider>
        </IssueProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
