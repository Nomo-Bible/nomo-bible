import { ScriptureInteractionProvider } from '@/context/ScriptureInteractionContext';
import { WordStudyProvider } from '@/context/WordStudyContext';
import { AuthPromptOverlay } from '@/components/auth/AuthPromptOverlay';
import { WorkspaceExpandProvider, useWorkspaceExpand } from '@/context/WorkspaceExpandContext';
import { WorkspaceResizeProvider, useWorkspaceResize } from '@/context/WorkspaceResizeContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { WorkspaceResizeHandle } from '@/components/workspace/WorkspaceResizeHandle';
import { MobileScriptureWorkspace } from '@/components/mobile/MobileScriptureWorkspace';
import { ScriptureNavigationPanel } from './ScriptureNavigationPanel';
import { ScriptureReaderPanel } from './ScriptureReaderPanel';
import { StudyWorkspacePanel } from './StudyWorkspacePanel';
import { WordStudyPopover } from './WordStudyPopover';
import './ScriptureWorkspace.css';

function DesktopScriptureWorkspace() {
  const { expandedPanel } = useWorkspaceExpand();
  const { resizeNavBy, resizeStudyBy, resizeStudyRowBy, style, isResizable } =
    useWorkspaceResize();
  const isStacked = useMediaQuery('(max-width: 1100px)');

  const workspaceClassName = expandedPanel
    ? `scripture-workspace scripture-workspace--expanded-${expandedPanel}`
    : 'scripture-workspace';

  return (
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

      {isResizable && !expandedPanel && !isStacked ? (
        <WorkspaceResizeHandle
          axis="horizontal"
          className="scripture-workspace__resize-study"
          label="Resize study panel width"
          onResize={resizeStudyBy}
        />
      ) : null}

      <aside className="scripture-workspace__study">
        <StudyWorkspacePanel />
      </aside>

      {isResizable && !expandedPanel && isStacked ? (
        <WorkspaceResizeHandle
          axis="vertical"
          className="scripture-workspace__resize-study-row"
          label="Resize study panel height"
          onResize={resizeStudyRowBy}
        />
      ) : null}
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
            <ScriptureWorkspaceLayout />
          </WorkspaceExpandProvider>
        </WorkspaceResizeProvider>
      </WordStudyProvider>
    </ScriptureInteractionProvider>
  );
}
