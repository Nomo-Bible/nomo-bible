import { ScriptureInteractionProvider } from '@/context/ScriptureInteractionContext';
import { WordStudyProvider } from '@/context/WordStudyContext';
import { AuthPromptOverlay } from '@/components/auth/AuthPromptOverlay';
import { WorkspaceExpandProvider, useWorkspaceExpand } from '@/context/WorkspaceExpandContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { MobileScriptureWorkspace } from '@/components/mobile/MobileScriptureWorkspace';
import { ScriptureNavigationPanel } from './ScriptureNavigationPanel';
import { ScriptureReaderPanel } from './ScriptureReaderPanel';
import { StudyWorkspacePanel } from './StudyWorkspacePanel';
import { WordStudyPopover } from './WordStudyPopover';
import './ScriptureWorkspace.css';

function DesktopScriptureWorkspace() {
  const { expandedPanel } = useWorkspaceExpand();

  const workspaceClassName = expandedPanel
    ? `scripture-workspace scripture-workspace--expanded-${expandedPanel}`
    : 'scripture-workspace';

  return (
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
  );
}

function ScriptureWorkspaceLayout() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <>
      {isMobile ? <MobileScriptureWorkspace /> : <DesktopScriptureWorkspace />}
      <WordStudyPopover />
      <AuthPromptOverlay />
    </>
  );
}

export function ScriptureWorkspace() {
  return (
    <ScriptureInteractionProvider>
      <WordStudyProvider>
        <WorkspaceExpandProvider>
          <ScriptureWorkspaceLayout />
        </WorkspaceExpandProvider>
      </WordStudyProvider>
    </ScriptureInteractionProvider>
  );
}
