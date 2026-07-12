import { useAuth } from '@/auth/useAuth';
import { AuthGate } from '@/components/auth/AuthGate';
import type { useStudyWorkspace } from '@/hooks/useStudyWorkspace';
import type { StudyWorkspaceTabId } from '@/types/studyWorkspace';
import { StudyTabContent } from './StudyTabContent';
import { StudyToolbar } from './StudyToolbar';

const PUBLIC_STUDY_TABS: StudyWorkspaceTabId[] = ['how-to-study', 'kjv-word-guide'];
type StudyWorkspaceState = ReturnType<typeof useStudyWorkspace>;

interface StudyWorkspaceBodyProps {
  workspace: StudyWorkspaceState;
  passageLabel: string;
  showToolbar?: boolean;
  howToStudySectionId?: string | null;
  onHowToStudySectionChange?: (sectionId: string | null) => void;
}

export function StudyWorkspaceBody({
  workspace,
  passageLabel,
  showToolbar = true,
  howToStudySectionId = null,
  onHowToStudySectionChange,
}: StudyWorkspaceBodyProps) {
  const { isAuthenticated, loading, isConfigured } = useAuth();
  const canViewTab =
    PUBLIC_STUDY_TABS.includes(workspace.activeTab) ||
    !isConfigured ||
    isAuthenticated;
  return (
    <>
      {showToolbar &&
        (workspace.activeTab === 'study-notes' ||
          workspace.activeTab === 'cross-references') &&
        (isAuthenticated || !isConfigured) && (
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
          {loading ? (
            <p className="study-workspace__auth-loading">Loading…</p>
          ) : canViewTab ? (
            <StudyTabContent
              workspace={workspace}
              passageLabel={passageLabel}
              howToStudySectionId={howToStudySectionId}
              onHowToStudySectionChange={onHowToStudySectionChange}
            />
          ) : (
            <AuthGate />
          )}
        </div>
      </div>
    </>
  );
}
