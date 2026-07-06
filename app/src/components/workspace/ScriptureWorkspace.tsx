import { WordStudyProvider } from '@/context/WordStudyContext';
import { WorkspaceExpandProvider, useWorkspaceExpand } from '@/context/WorkspaceExpandContext';
import { ScriptureNavigationPanel } from './ScriptureNavigationPanel';
import { ScriptureReaderPanel } from './ScriptureReaderPanel';
import { StudyWorkspacePanel } from './StudyWorkspacePanel';
import { WordStudyPopover } from './WordStudyPopover';
import './ScriptureWorkspace.css';

function ScriptureWorkspaceLayout() {
  const { expandedPanel } = useWorkspaceExpand();

  const workspaceClassName = expandedPanel
    ? `scripture-workspace scripture-workspace--expanded-${expandedPanel}`
    : 'scripture-workspace';

  return (
    <>
      <div className={workspaceClassName}>
        <aside className="scripture-workspace__nav">
          <ScriptureNavigationPanel />
        </aside>

        <section className="scripture-workspace__scripture" aria-label="Scripture">
          <ScriptureReaderPanel />
        </section>

        <aside className="scripture-workspace__study">
          <StudyWorkspacePanel />
        </aside>
      </div>
      <WordStudyPopover />
    </>
  );
}

export function ScriptureWorkspace() {
  return (
    <WordStudyProvider>
      <WorkspaceExpandProvider>
        <ScriptureWorkspaceLayout />
      </WorkspaceExpandProvider>
    </WordStudyProvider>
  );
}
