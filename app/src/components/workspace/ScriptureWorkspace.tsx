import { ScriptureInteractionProvider } from '@/context/ScriptureInteractionContext';
import { WordStudyProvider } from '@/context/WordStudyContext';
import { AuthPromptOverlay } from '@/components/auth/AuthPromptOverlay';
import { WorkspaceExpandProvider, useWorkspaceExpand } from '@/context/WorkspaceExpandContext';
import { WorkspaceResizeProvider, useWorkspaceResize } from '@/context/WorkspaceResizeContext';
import {
  StudyWorkspaceProvider,
  useStudyWorkspaceContext,
} from '@/context/StudyWorkspaceContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { WorkspaceResizeHandle } from '@/components/workspace/WorkspaceResizeHandle';
import { MobileScriptureWorkspace } from '@/components/mobile/MobileScriptureWorkspace';
import { ScriptureNavigationPanel } from './ScriptureNavigationPanel';
import { ScriptureReaderPanel } from './ScriptureReaderPanel';
import { StudyToolsChrome } from './StudyToolsChrome';
import { StudyWorkspacePanel } from './StudyWorkspacePanel';
import { WordStudyPopover } from './WordStudyPopover';
import './ScriptureWorkspace.css';

function DesktopScriptureWorkspace() {
  const { expandedPanel } = useWorkspaceExpand();
  const { resizeNavBy, resizeStudyRowBy, style, isResizable } = useWorkspaceResize();
  const { studyPanelOpen } = useStudyWorkspaceContext();

  const workspaceClassName = [
    'scripture-workspace',
    studyPanelOpen ? 'scripture-workspace--study-open' : '',
    expandedPanel ? `scripture-workspace--expanded-${expandedPanel}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="scripture-workspace-desktop">
      {(!expandedPanel || expandedPanel === 'study') ? <StudyToolsChrome /> : null}

      <div className={workspaceClassName} style={style}>
        <aside className="scripture-workspace__nav">
          <ScriptureNavigationPanel />
        </aside>

        {isResizable && !expandedPanel ? (
          <WorkspaceResizeHandle
            axis="horizontal"
            className="scripture-workspace__resize-nav"
            label="Resize navigation panel"
            onResize={resizeNavBy}
          />
        ) : null}

        <section className="scripture-workspace__scripture" aria-label="Scripture">
          <ScriptureReaderPanel />
        </section>

        {studyPanelOpen && isResizable && !expandedPanel ? (
          <WorkspaceResizeHandle
            axis="vertical"
            className="scripture-workspace__resize-study-row"
            label="Resize study panel height"
            onResize={resizeStudyRowBy}
          />
        ) : null}

        {studyPanelOpen ? (
          <aside className="scripture-workspace__study">
            <StudyWorkspacePanel />
          </aside>
        ) : null}
      </div>
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
        <WorkspaceResizeProvider>
          <WorkspaceExpandProvider>
            <StudyWorkspaceProvider>
              <ScriptureWorkspaceLayout />
            </StudyWorkspaceProvider>
          </WorkspaceExpandProvider>
        </WorkspaceResizeProvider>
      </WordStudyProvider>
    </ScriptureInteractionProvider>
  );
}
