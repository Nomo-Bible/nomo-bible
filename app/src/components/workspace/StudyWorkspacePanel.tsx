import { BookOpen } from 'lucide-react';
import { useAuth } from '@/auth/useAuth';
import { AuthGate } from '@/components/auth/AuthGate';
import { useReader } from '@/context/ReaderContext';
import { useWorkspaceExpand } from '@/context/WorkspaceExpandContext';
import { useStudyWorkspace } from '@/hooks/useStudyWorkspace';
import { formatReaderLocation } from '@/types/bible';
import { WorkspaceExpandButton } from '@/components/workspace/WorkspaceExpandButton';
import { StudyTabContent } from './StudyTabContent';
import { StudyToolbar } from './StudyToolbar';
import { StudyWorkspaceTabs } from './StudyWorkspaceTabs';
import './StudyWorkspacePanel.css';

export function StudyWorkspacePanel() {
  const { location } = useReader();
  const { isExpanded, collapsePanel } = useWorkspaceExpand();
  const workspace = useStudyWorkspace();
  const { isAuthenticated, loading } = useAuth();
  const passageLabel = formatReaderLocation(location);
  const studyExpanded = isExpanded('study');

  return (    <aside
      className={
        studyExpanded
          ? 'study-workspace study-workspace--expanded'
          : 'study-workspace'
      }
      aria-label="Study workspace"
    >
      {studyExpanded && (
        <div className="study-workspace__return">
          <button
            type="button"
            className="study-workspace__return-link"
            onClick={collapsePanel}
          >
            <BookOpen size={15} strokeWidth={2} aria-hidden="true" />
            Back to Bible
          </button>
        </div>
      )}
      <header className="study-workspace__header">
        <h2 className="study-workspace__title visually-hidden">Study Workspace</h2>
        <p className="study-workspace__passage" aria-live="polite">
          {passageLabel}
        </p>
        <WorkspaceExpandButton
          panelId="study"
          label="Study workspace"
          restoreLabel="Back to Bible"
        />
      </header>

      <StudyWorkspaceTabs
        activeTab={workspace.activeTab}
        onTabChange={workspace.setActiveTab}
      />

      {(workspace.activeTab === 'study-notes' ||
        workspace.activeTab === 'cross-references') &&
        isAuthenticated && (
          <StudyToolbar
            showNoteActions={workspace.activeTab === 'study-notes'}          canSave={workspace.canSave}
          canEdit={workspace.canEdit}
          canDelete={workspace.canDelete}
          canCancel={workspace.canCancel}
          onNewNote={workspace.startCreate}
          onSave={workspace.saveDraft}
          onEdit={workspace.startEdit}
          onDelete={workspace.removeSelected}
          onRefresh={workspace.handleRefresh}
          onCancel={workspace.cancelEditing}
        />
      )}

      <div
        className="study-workspace__content"
        role="tabpanel"
        id={`study-panel-${workspace.activeTab}`}
        aria-labelledby={`study-tab-${workspace.activeTab}`}
      >
        <div className="study-workspace__tab-body">
          {loading ? (
            <p className="study-workspace__auth-loading">Loading…</p>
          ) : isAuthenticated ? (
            <StudyTabContent workspace={workspace} passageLabel={passageLabel} />
          ) : (
            <AuthGate />
          )}
        </div>
      </div>
    </aside>
  );
}