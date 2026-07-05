import { ScriptureNavigationPanel } from './ScriptureNavigationPanel';
import { ScriptureReaderPanel } from './ScriptureReaderPanel';
import { StudyWorkspacePanel } from './StudyWorkspacePanel';
import './ScriptureWorkspace.css';

export function ScriptureWorkspace() {
  return (
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
  );
}
