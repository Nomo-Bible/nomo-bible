import { Maximize2, Minimize2 } from 'lucide-react';
import { useWorkspaceExpand } from '@/context/WorkspaceExpandContext';
import type { ReadingFocusId, WorkspacePanelId } from '@/types/workspaceExpand';
import './WorkspaceExpandButton.css';

interface WorkspaceExpandButtonProps {
  panelId: WorkspacePanelId;
  label: string;
  compact?: boolean;
  restoreLabel?: string;
  readingFocusId?: ReadingFocusId;
  /** When set, replaces the default expand/collapse toggle behavior. */
  onToggle?: () => void;
}

export function WorkspaceExpandButton({
  panelId,
  label,
  compact = false,
  restoreLabel = 'Restore layout',
  readingFocusId,
  onToggle,
}: WorkspaceExpandButtonProps) {
  const { isExpanded, togglePanel } = useWorkspaceExpand();
  const expanded = isExpanded(panelId);

  return (
    <button
      type="button"
      className={
        compact
          ? 'workspace-expand-btn workspace-expand-btn--compact'
          : 'workspace-expand-btn'
      }
      onClick={() => {
        if (onToggle) {
          onToggle();
          return;
        }
        togglePanel(panelId, readingFocusId);
      }}
      aria-pressed={expanded}
      aria-label={expanded ? `${restoreLabel} from ${label}` : `Expand ${label} to full workspace`}
      title={expanded ? restoreLabel : `Expand ${label}`}
    >
      {expanded ? (
        <Minimize2 size={compact ? 13 : 15} strokeWidth={2} aria-hidden="true" />
      ) : (
        <Maximize2 size={compact ? 13 : 15} strokeWidth={2} aria-hidden="true" />
      )}
      {!compact && (
        <span className="workspace-expand-btn__label">
          {expanded ? restoreLabel : 'Expand'}
        </span>
      )}
    </button>
  );
}
