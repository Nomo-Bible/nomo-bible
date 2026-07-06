import { WordStudyProvider } from '@/context/WordStudyContext';
import { ScriptureNavigationPanel } from './ScriptureNavigationPanel';
import { ScriptureReaderPanel } from './ScriptureReaderPanel';
import { StudyWorkspacePanel } from './StudyWorkspacePanel';
import { WordStudyPopover } from './WordStudyPopover';
import './ScriptureWorkspace.css';

export function ScriptureWorkspace() {
  return (
    <WordStudyProvider>
      <div className="scripture-workspace">
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
    </WordStudyProvider>
  );
}
