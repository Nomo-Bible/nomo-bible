import { BookOpen } from 'lucide-react';
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
  const passageLabel = formatReaderLocation(location);
  const studyExpanded = isExpanded('study');

  return (
    <aside
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
        <div className="study-workspace__header-row">
          <h2 className="study-workspace__title">Study Workspace</h2>
          <WorkspaceExpandButton
            panelId="study"
            label="Study workspace"
            restoreLabel="Back to Bible"
          />
        </div>
        <p className="study-workspace__passage" aria-live="polite">
          {passageLabel}
        </p>
      </header>

      <StudyWorkspaceTabs
        activeTab={workspace.activeTab}
        onTabChange={workspace.setActiveTab}
      />

      {(workspace.activeTab === 'study-notes' ||
        workspace.activeTab === 'cross-references') && (
        <StudyToolbar
          showNoteActions={workspace.activeTab === 'study-notes'}
          canSave={workspace.canSave}
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
          <StudyTabContent workspace={workspace} passageLabel={passageLabel} />
        </div>
      </div>
    </aside>
  );
}
