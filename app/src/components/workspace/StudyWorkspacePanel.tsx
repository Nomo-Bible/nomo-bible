import { BookOpen, X } from 'lucide-react';
import { useCallback } from 'react';
import { useReader } from '@/context/ReaderContext';
import { useStudyWorkspaceContext } from '@/context/StudyWorkspaceContext';
import { useWorkspaceExpand } from '@/context/WorkspaceExpandContext';
import { formatReaderLocation } from '@/types/bible';
import { WorkspaceExpandButton } from '@/components/workspace/WorkspaceExpandButton';
import { StudyWorkspaceBody } from './StudyWorkspaceBody';
import './StudyWorkspacePanel.css';

export function StudyWorkspacePanel() {
  const { location } = useReader();
  const workspace = useStudyWorkspaceContext();
  const { isExpanded, collapsePanel, togglePanel, readingFocus } = useWorkspaceExpand();
  const passageLabel = formatReaderLocation(location);
  const studyExpanded = isExpanded('study');
  const readingFocusActive = studyExpanded && readingFocus !== null;

  const handleBackToBible = useCallback(() => {
    collapsePanel();
    workspace.closeStudyPanel();
  }, [collapsePanel, workspace.closeStudyPanel]);

  const handleExpandToggle = useCallback(() => {
    if (studyExpanded) {
      handleBackToBible();
      return;
    }
    togglePanel('study');
  }, [handleBackToBible, studyExpanded, togglePanel]);

  const workspaceClassName = [
    'study-workspace',
    'study-workspace--docked',
    studyExpanded ? 'study-workspace--expanded' : '',
    readingFocusActive ? 'study-workspace--reading-focus' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <aside className={workspaceClassName} aria-label="Study workspace">
      {studyExpanded && (
        <div className="study-workspace__return">
          <button
            type="button"
            className="study-workspace__return-link"
            onClick={handleBackToBible}
          >
            <BookOpen size={15} strokeWidth={2} aria-hidden="true" />
            Back to Bible
          </button>
        </div>
      )}
      <header
        className={
          readingFocusActive
            ? 'study-workspace__header study-workspace__header--compact'
            : 'study-workspace__header'
        }
      >
        <h2 className="study-workspace__title visually-hidden">Study Workspace</h2>
        {!readingFocusActive ? (
          <p className="study-workspace__passage" aria-live="polite">
            {passageLabel}
          </p>
        ) : null}
        <div className="study-workspace__header-actions">
          <WorkspaceExpandButton
            panelId="study"
            label="Study workspace"
            restoreLabel="Back to Bible"
            onToggle={handleExpandToggle}
          />
          {!studyExpanded ? (
            <button
              type="button"
              className="study-workspace__close-btn"
              onClick={workspace.closeStudyPanel}
              title="Close study panel"
              aria-label="Close study panel"
            >
              <X size={16} strokeWidth={2} aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </header>

      <StudyWorkspaceBody
        workspace={workspace}
        passageLabel={passageLabel}
        showToolbar={false}
      />
    </aside>
  );
}
