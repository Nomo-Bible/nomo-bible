import { BookOpen, NotebookPen } from 'lucide-react';
import './MobileWorkspaceBar.css';

export type MobileWorkspacePane = 'read' | 'study';

interface MobileWorkspaceBarProps {
  activePane: MobileWorkspacePane;
  onPaneChange: (pane: MobileWorkspacePane) => void;
}

export function MobileWorkspaceBar({ activePane, onPaneChange }: MobileWorkspaceBarProps) {
  return (
    <nav className="mobile-workspace-bar" aria-label="Workspace view">
      <button
        type="button"
        className={
          activePane === 'read'
            ? 'mobile-workspace-bar__btn mobile-workspace-bar__btn--active'
            : 'mobile-workspace-bar__btn'
        }
        aria-current={activePane === 'read' ? 'page' : undefined}
        onClick={() => onPaneChange('read')}
      >
        <BookOpen size={18} strokeWidth={2} aria-hidden="true" />
        Read
      </button>
      <button
        type="button"
        className={
          activePane === 'study'
            ? 'mobile-workspace-bar__btn mobile-workspace-bar__btn--active'
            : 'mobile-workspace-bar__btn'
        }
        aria-current={activePane === 'study' ? 'page' : undefined}
        onClick={() => onPaneChange('study')}
      >
        <NotebookPen size={18} strokeWidth={2} aria-hidden="true" />
        Study
      </button>
    </nav>
  );
}
