import { useAuth } from '@/auth/useAuth';
import { useStudyWorkspaceContext } from '@/context/StudyWorkspaceContext';
import { StudyToolbar } from './StudyToolbar';
import { StudyWorkspaceTabs } from './StudyWorkspaceTabs';
import './StudyToolsChrome.css';

export function StudyToolsChrome() {
  const workspace = useStudyWorkspaceContext();
  const { isAuthenticated, isConfigured } = useAuth();
  const showActions =
    workspace.studyPanelOpen &&
    (workspace.activeTab === 'study-notes' ||
      workspace.activeTab === 'cross-references') &&
    (isAuthenticated || !isConfigured);

  return (
    <div className="study-tools-chrome" aria-label="Study tools">
      <StudyWorkspaceTabs
        activeTab={workspace.activeTab}
        onTabChange={workspace.selectStudyTab}
        onOpenTab={workspace.openStudyTab}
        studyPanelOpen={workspace.studyPanelOpen}
      />
      {showActions ? (
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
      ) : null}
    </div>
  );
}
