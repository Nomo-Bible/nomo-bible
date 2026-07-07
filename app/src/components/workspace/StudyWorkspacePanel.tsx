import { BookOpen } from 'lucide-react';
import { useReader } from '@/context/ReaderContext';
import { useWorkspaceExpand } from '@/context/WorkspaceExpandContext';
import { useStudyWorkspace } from '@/hooks/useStudyWorkspace';
import { formatReaderLocation } from '@/types/bible';
import { WorkspaceExpandButton } from '@/components/workspace/WorkspaceExpandButton';
import { StudyWorkspaceBody } from './StudyWorkspaceBody';
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

      <StudyWorkspaceBody workspace={workspace} passageLabel={passageLabel} />
    </aside>
  );
}
